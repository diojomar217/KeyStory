import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteByIdWithConfig } from '@/lib/db/websites';
import { createArchiveForSite } from '@/lib/archiver';
import { recordAdminAudit } from '@/lib/reliability/audit';
import { captureError } from '@/lib/reliability/monitoring';

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

    if ((site.status || '').toLowerCase() === 'archived' || site.config?.archive?.archived === true) {
      return NextResponse.json({ success: true, message: 'Already archived' });
    }

    try {
      const archiveResult = await createArchiveForSite(site);

      try {
        const { revalidatePath } = await import('next/cache');
        const target = site.website_name || site.slug;
        if (target) {
          revalidatePath(`/site/${target}`);
          revalidatePath(`/love/${target}`);
        }
      } catch (err) {
        console.warn('Revalidate path failed on archive:', err);
      }

      await recordAdminAudit(req, {
        action: 'admin.site.archive',
        targetType: 'site',
        targetId: id,
        success: true,
      });

      return NextResponse.json({ success: true, archived_at: new Date().toISOString(), archive: archiveResult });
    } catch (archiveErr) {
      await captureError('admin-site-archive', archiveErr, { siteId: id });
      await recordAdminAudit(req, {
        action: 'admin.site.archive',
        targetType: 'site',
        targetId: id,
        success: false,
        details: { error: archiveErr instanceof Error ? archiveErr.message : String(archiveErr) },
      });
      return NextResponse.json({ success: false, message: 'Failed to create archive package' }, { status: 500 });
    }
  } catch (err) {
    await captureError('admin-site-archive', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
