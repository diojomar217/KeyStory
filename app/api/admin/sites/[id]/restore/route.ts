import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteByIdWithConfig } from '@/lib/db/websites';
import { restoreSiteFromArchive } from '@/lib/archiver';
import { supabase } from '@/lib/supabase';
import { recordAdminAudit } from '@/lib/reliability/audit';
import { captureError } from '@/lib/reliability/monitoring';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    let site;
    try {
      site = await getWebsiteByIdWithConfig(id);
    } catch (fetchError) {
      return NextResponse.json({ success: false, message: 'Site not found' }, { status: 404 });
    }

    const isStatusArchived = (site.status || '').toLowerCase() === 'archived';
    const hasArchiveMetadata = Boolean(site.config?.archive?.archivePath || site.config?.archive?.archived);

    if (!isStatusArchived) {
      return NextResponse.json({ success: false, message: 'Site is not archived' }, { status: 400 });
    }

    if (!hasArchiveMetadata) {
      // fallback: if archived flag is set but archive payload is missing, un-archive safely
      const newExpires = new Date();
      newExpires.setMonth(newExpires.getMonth() + 6);

      const { data: updatedSite, error: updateError } = await supabase
        .from('sites')
        .update({
          status: 'active',
          archived_at: null,
          expires_at: newExpires.toISOString(),
          config: {
            ...site.config,
            archive: {
              ...(site.config?.archive || {}),
              archived: false,
              reason: 'restored-without-archive-metadata',
            },
          },
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError || !updatedSite) {
        return NextResponse.json({ success: false, message: 'Cannot restore site; archive data is missing' }, { status: 500 });
      }

      await recordAdminAudit(req, {
        action: 'admin.site.restore',
        targetType: 'site',
        targetId: id,
        success: true,
        details: { mode: 'restored-without-media' },
      });
      return NextResponse.json({ success: true, restoredSite: updatedSite, info: 'restored-without-media' });
    }

    try {
      const restoredSite = await restoreSiteFromArchive(site);

      try {
        const { revalidatePath } = await import('next/cache');
        const target = site.website_name || site.slug;
        if (target) {
          revalidatePath(`/site/${target}`);
          revalidatePath(`/love/${target}`);
        }
      } catch (err) {
        console.warn('Revalidate path failed on restore:', err);
      }

      await recordAdminAudit(req, {
        action: 'admin.site.restore',
        targetType: 'site',
        targetId: id,
        success: true,
      });
      return NextResponse.json({ success: true, restoredSite });
    } catch (err) {
      await captureError('admin-site-restore', err, { siteId: id });
      await recordAdminAudit(req, {
        action: 'admin.site.restore',
        targetType: 'site',
        targetId: id,
        success: false,
        details: { error: err instanceof Error ? err.message : String(err) },
      });
      return NextResponse.json({ success: false, message: 'Failed to restore archived site' }, { status: 500 });
    }
  } catch (err) {
    await captureError('admin-site-restore', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
