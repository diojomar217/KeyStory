
import { NextResponse } from 'next/server';
import { supabase, getSites } from '@/lib/supabase';

// Simple in-memory cache (per server instance)
let cachedData: any = null;
let cachedAt: number = 0;
const CACHE_TTL = 15 * 1000; // 15 seconds


export async function GET() {
  const nowTime = Date.now();
  if (cachedData && nowTime - cachedAt < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  // Get total count
  const { count: totalWebsites, error: countError } = await supabase
    .from('sites')
    .select('id', { count: 'exact', head: true });

  // Get this month's count
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: thisMonthCount, error: monthError } = await supabase
    .from('sites')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', monthStart);

  // Get 5 most recent
  let recentWebsites = [];
  let recentError = null;
  try {
    const allSites = await getSites();
    recentWebsites = (allSites || []).slice(0, 5);
  } catch (err) {
    recentError = err;
  }

  // Get published count (active, not expired)
  const { count: publishedWebsites, error: publishedError } = await supabase
    .from('sites')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  // Expiring soon (next 30 days)
  const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: expiringSoon, error: soonError } = await supabase
    .from('sites')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
    .lte('expires_at', soon)
    .gte('expires_at', now.toISOString());

  // Expired
  const { count: expiredSites, error: expiredError } = await supabase
    .from('sites')
    .select('id', { count: 'exact', head: true })
    .or('status.eq.archived,status.eq.expired')
    .lte('expires_at', now.toISOString());

  const result = {
    totalWebsites: totalWebsites || 0,
    thisMonthCount: thisMonthCount || 0,
    publishedWebsites: publishedWebsites || 0,
    expiringSoon: expiringSoon || 0,
    expiredSites: expiredSites || 0,
    recentWebsites: recentWebsites || [],
    errors: [countError, monthError, recentError, publishedError, soonError, expiredError].filter(Boolean)
  };
  cachedData = result;
  cachedAt = nowTime;
  return NextResponse.json(result);
}
