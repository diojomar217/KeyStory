import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // No change needed, not site CRUD

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const siteId = url.searchParams.get('site_id');

  let events: Array<{ event_type: string; source: string | null; created_at: string }> = [];
  let error: any = null;

  if (siteId) {
    const result = await supabase
      .from('site_analytics_events')
      .select('event_type, source, created_at')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(100);
    events = result.data || [];
    error = result.error;
  } else {
    const result = await supabase
      .from('site_analytics_events')
      .select('site_id, event_type, source, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    events = result.data || [];
    error = result.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalVisits = events.filter((e) => e.event_type === 'page_view').length;
  const totalQrScans = events.filter((e) => e.event_type === 'qr_scan').length;
  const lastVisited = events.find((e) => e.event_type === 'page_view')?.created_at || null;

  const visitsThisWeek = events.filter((e) => e.event_type === 'page_view' && new Date(e.created_at) >= weekAgo).length;
  const visitsThisMonth = events.filter((e) => e.event_type === 'page_view' && new Date(e.created_at) >= monthAgo).length;

  return NextResponse.json({
    totalVisits,
    totalQrScans,
    lastVisited,
    visitsThisWeek,
    visitsThisMonth,
    recentActivity: events || [],
  });
}
