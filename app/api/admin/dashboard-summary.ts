import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Get total count
  const { count: totalWebsites, error: countError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get this month's count
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: thisMonthCount, error: monthError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthStart);

  // Get 5 most recent
  const { data: recentWebsites, error: recentError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get published count (active, not expired)
  const { count: publishedWebsites, error: publishedError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Expiring soon (next 30 days)
  const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: expiringSoon, error: soonError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .lte('expires_at', soon)
    .gte('expires_at', now.toISOString());

  // Expired
  const { count: expiredSites, error: expiredError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .or('status.eq.archived,status.eq.expired')
    .lte('expires_at', now.toISOString());

  return NextResponse.json({
    totalWebsites: totalWebsites || 0,
    thisMonthCount: thisMonthCount || 0,
    publishedWebsites: publishedWebsites || 0,
    expiringSoon: expiringSoon || 0,
    expiredSites: expiredSites || 0,
    recentWebsites: recentWebsites || [],
    errors: [countError, monthError, recentError, publishedError, soonError, expiredError].filter(Boolean)
  });
}
