import { NextRequest, NextResponse } from 'next/server';
import { unauthorizedAdminResponse, isAdminRequestAuthorized } from '@/lib/api/admin-auth';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  if (!isAdminRequestAuthorized(req)) {
    return unauthorizedAdminResponse();
  }

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('site_id');
  const siteIdsParam = searchParams.get('site_ids');

  if (siteIdsParam) {
    const siteIds = siteIdsParam
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (siteIds.length === 0) {
      return NextResponse.json({ error: 'site_ids must include at least one site id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('guest_messages')
      .select('site_id, status')
      .in('site_id', siteIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const summaries = siteIds.reduce<Record<string, { total: number; pending: number; approved: number; rejected: number }>>((acc, id) => {
      acc[id] = { total: 0, pending: 0, approved: 0, rejected: 0 };
      return acc;
    }, {});

    for (const row of data || []) {
      const summary = summaries[row.site_id] || { total: 0, pending: 0, approved: 0, rejected: 0 };
      summary.total += 1;
      if (row.status === 'pending') summary.pending += 1;
      if (row.status === 'approved') summary.approved += 1;
      if (row.status === 'rejected') summary.rejected += 1;
      summaries[row.site_id] = summary;
    }

    return NextResponse.json({ summaries });
  }

  if (!siteId) {
    return NextResponse.json({ error: 'site_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('guest_messages')
    .select('id, site_id, name, message, status, created_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data || [] });
}
