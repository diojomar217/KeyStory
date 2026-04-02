import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // No change needed, not site CRUD

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const siteId = url.searchParams.get('site_id');

  let events: Array<{ event_type: string; source: string | null; created_at: string; ip_hash?: string | null }> = [];
  let error: any = null;

  if (siteId) {
    const result = await supabase
      .from('site_analytics_events')
      .select('event_type, source, created_at, ip_hash')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(1000);
    events = result.data || [];
    error = result.error;
  } else {
    const result = await supabase
      .from('site_analytics_events')
      .select('site_id, event_type, source, created_at, ip_hash')
      .order('created_at', { ascending: false })
      .limit(1000);
    events = result.data || [];
    error = result.error;
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
  const scansThisWeek = events.filter((e) => e.event_type === 'qr_scan' && new Date(e.created_at) >= weekAgo).length;
  const scansThisMonth = events.filter((e) => e.event_type === 'qr_scan' && new Date(e.created_at) >= monthAgo).length;

  const visitsThisWeek = events.filter((e) => e.event_type === 'page_view' && new Date(e.created_at) >= weekAgo).length;
  const visitsThisMonth = events.filter((e) => e.event_type === 'page_view' && new Date(e.created_at) >= monthAgo).length;

  const uniqueScanHashSet = new Set(
    events
      .filter((e) => e.event_type === 'qr_scan' && e.ip_hash)
      .map((e) => e.ip_hash as string)
  );

  const uniqueScans = uniqueScanHashSet.size;

  const sourceCounts = new Map<string, number>();
  for (const event of events) {
    if (event.event_type !== 'qr_scan') continue;
    const key = (event.source || 'unknown').toLowerCase();
    sourceCounts.set(key, (sourceCounts.get(key) || 0) + 1);
  }

  const topSources = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dailyMap = new Map<string, { date: string; page_views: number; qr_scans: number }>();
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, { date: key, page_views: 0, qr_scans: 0 });
  }

  for (const event of events) {
    const eventDate = new Date(event.created_at);
    if (eventDate < monthAgo || eventDate > now) continue;
    const key = eventDate.toISOString().slice(0, 10);
    const row = dailyMap.get(key);
    if (!row) continue;
    if (event.event_type === 'page_view') row.page_views += 1;
    if (event.event_type === 'qr_scan') row.qr_scans += 1;
  }

  const dailyTrend = Array.from(dailyMap.values());

  return NextResponse.json({
    totalVisits,
    totalQrScans,
    uniqueScans,
    lastVisited,
    visitsThisWeek,
    visitsThisMonth,
    scansThisWeek,
    scansThisMonth,
    topSources,
    dailyTrend,
    recentActivity: events || [],
  });
}
