import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { restoreSiteFromArchive } from '@/lib/archiver';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    const { data: site, error: fetchError } = await supabase.from('sites').select('*').eq('id', id).single();
    if (fetchError || !site) {
      return NextResponse.json({ success: false, message: 'Site not found' }, { status: 404 });
    }

    if (!site.config?.archive?.archived || site.status?.toLowerCase() !== 'archived') {
      return NextResponse.json({ success: false, message: 'Site is not archived' }, { status: 400 });
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

      return NextResponse.json({ success: true, restoredSite });
    } catch (err) {
      console.error('Restore site error:', err);
      return NextResponse.json({ success: false, message: 'Failed to restore archived site' }, { status: 500 });
    }
  } catch (err) {
    console.error('Restore site error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
