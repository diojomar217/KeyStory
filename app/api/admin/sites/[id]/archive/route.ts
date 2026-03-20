import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createArchiveForSite } from '@/lib/archiver';

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

      return NextResponse.json({ success: true, archived_at: new Date().toISOString(), archive: archiveResult });
    } catch (archiveErr) {
      console.error('Failed to archive site data:', archiveErr);
      return NextResponse.json({ success: false, message: 'Failed to create archive package' }, { status: 500 });
    }
  } catch (err) {
    console.error('Archive site error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
