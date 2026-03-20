import { NextRequest, NextResponse } from 'next/server';
import { supabase, Site } from '@/lib/supabase';
import { needsAutoArchive } from '@/lib/site-status';
import { createArchiveForSite } from '@/lib/archiver';

export async function POST(req: NextRequest) {
  try {
    const { graceDays = 7 } = await req.json().catch(() => ({}));

    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .in('status', ['expired', 'active'])
      .order('expires_at', { ascending: true });

    if (error) {
      console.error('auto-archive fetch error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const eligible = (sites || []).filter((site: Site) => needsAutoArchive(site, Number(graceDays)));

    const results = [];
    for (const site of eligible) {
      try {
        const archiveInfo = await createArchiveForSite(site);
        results.push({ id: site.id, status: 'archived', ...archiveInfo });
      } catch (err) {
        console.error('auto archive fail for site', site.id, err);
        results.push({ id: site.id, status: 'failed', error: (err as Error).message });
      }
    }

    return NextResponse.json({ success: true, total: eligible.length, results });
  } catch (err) {
    console.error('auto-archive error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
