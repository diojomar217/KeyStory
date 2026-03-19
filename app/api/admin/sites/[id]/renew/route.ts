import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const addMonths = (date: Date, months: number): string => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
};

const durationMap: Record<string, number> = {
  '6_months': 6,
  '1_year': 12,
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const durationKey = (body.duration || '').toString();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Site ID is required' }, { status: 400 });
    }

    if (!durationMap[durationKey]) {
      return NextResponse.json({ success: false, message: 'Invalid duration' }, { status: 400 });
    }

    const { data: site, error: fetchError } = await supabase.from('sites').select('*').eq('id', id).single();
    if (fetchError || !site) {
      return NextResponse.json({ success: false, message: 'Site not found' }, { status: 404 });
    }

    const now = new Date();

    if ((site.status || '').toLowerCase() === 'archived') {
      try {
        const { restoreSiteFromArchive } = await import('@/lib/archiver');
        await restoreSiteFromArchive(site);
      } catch (err) {
        console.error('Refresh site restore error:', err);
        return NextResponse.json({ success: false, message: 'Unable to restore archived site' }, { status: 500 });
      }
    }

    const existingExpires = site.expires_at ? new Date(site.expires_at) : now;
    const effectiveBase = existingExpires > now ? existingExpires : now;
    const nextExpires = addMonths(effectiveBase, durationMap[durationKey]);

    const { error: updateError } = await supabase
      .from('sites')
      .update({
        expires_at: nextExpires,
        status: 'active',
        archived_at: null,
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });
    }

    try {
      const { revalidatePath } = await import('next/cache');
      const target = site.website_name || site.slug;
      if (target) {
        revalidatePath(`/site/${target}`);
        revalidatePath(`/love/${target}`);
      }
    } catch (err) {
      console.warn('Revalidate path failed on renew:', err);
    }

    return NextResponse.json({ success: true, expires_at: nextExpires });
  } catch (err) {
    console.error('Renew site error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
