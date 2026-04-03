
import { NextResponse } from 'next/server';
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/api/admin-auth';
import { supabase } from '@/lib/supabase';
import { listWebsites as getSites } from '@/lib/db/websites';

// Simple in-memory cache (per server instance)
let cachedData: any = null;
let cachedAt: number = 0;
const CACHE_TTL = 15 * 1000; // 15 seconds

function normalizeError(err: unknown, context: string) {
  if (!err) return null;

  if (err instanceof Error) {
    return {
      context,
      message: err.message || 'Unexpected server error',
    };
  }

  if (typeof err === 'string') {
    const trimmed = err.trim();
    if (!trimmed) return null;
    return {
      context,
      message: trimmed,
    };
  }

  if (typeof err === 'object') {
    const maybeErr = err as {
      message?: unknown;
      hint?: unknown;
      details?: unknown;
      code?: unknown;
    };

    const message =
      typeof maybeErr.message === 'string' && maybeErr.message.trim() !== ''
        ? maybeErr.message
        : typeof maybeErr.details === 'string' && maybeErr.details.trim() !== ''
          ? maybeErr.details
          : null;

    const hint =
      typeof maybeErr.hint === 'string' && maybeErr.hint.trim() !== ''
        ? maybeErr.hint
        : undefined;

    const code =
      typeof maybeErr.code === 'string' && maybeErr.code.trim() !== ''
        ? maybeErr.code
        : undefined;

    if (!message && !hint && !code) {
      return null;
    }

    return {
      context,
      message: message || 'Unexpected backend error',
      hint,
      code,
    };
  }

  return {
    context,
    message: 'Unexpected backend error',
  };
}


export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

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
    const allSitesResult = await getSites({ limit: 5, sortBy: 'created_at', sortDirection: 'desc' });
    if (Array.isArray(allSitesResult)) {
      recentWebsites = allSitesResult.slice(0, 5);
    } else if (allSitesResult && Array.isArray((allSitesResult as { data?: unknown[] }).data)) {
      recentWebsites = ((allSitesResult as { data: unknown[] }).data || []).slice(0, 5);
    } else {
      recentWebsites = [];
    }
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

  const { count: pendingGuestMessages, error: pendingGuestMessagesError } = await supabase
    .from('guest_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: pendingGuestMessageSites, error: pendingGuestMessageSitesError } = await supabase
    .from('guest_messages')
    .select('site_id')
    .eq('status', 'pending');

  const sitesWithPendingGuestMessages = new Set(
    (pendingGuestMessageSites || [])
      .map((entry) => entry.site_id)
      .filter((siteId): siteId is string => typeof siteId === 'string' && siteId.length > 0)
  ).size;

  // Get recent activity from audit logs (last 6 entries)
  let recentActivity: Array<{
    id: string;
    label: string;
    timestamp: string;
    action: string;
    details: Record<string, any>;
  }> = [];
  let recentActivityError = null;
  try {
    const { data: auditLogs, error: auditError } = await supabase
      .from('admin_audit_logs')
      .select('id, action, created_at, details')
      .order('created_at', { ascending: false })
      .limit(6);

    if (auditError) {
      recentActivityError = auditError;
    } else {
      recentActivity = (auditLogs || []).map((log) => {
        // Human-readable action labels
        const actionLabels: Record<string, string> = {
          'admin.site.create': 'Website created',
          'admin.site.update': 'Website updated',
          'admin.site.delete': 'Website deleted',
          'admin.site.archive': 'Website archived',
          'admin.site.restore': 'Website restored',
          'admin.guest_message.update_status': 'Guest message reviewed',
          'admin.guest_message.delete': 'Guest message deleted',
          'admin.auth.login': 'Admin logged in',
          'admin.auth.logout': 'Admin logged out',
        };

        const label = actionLabels[log.action] || log.action.replace(/admin\./, '').replace(/_/g, ' ');
        const timestamp = new Date(log.created_at);

        return {
          id: log.id,
          label,
          timestamp: timestamp.toISOString(),
          action: log.action,
          details: log.details || {},
        };
      });
    }
  } catch (err) {
    recentActivityError = err;
  }

  const result = {
    totalWebsites: totalWebsites || 0,
    thisMonthCount: thisMonthCount || 0,
    publishedWebsites: publishedWebsites || 0,
    expiringSoon: expiringSoon || 0,
    expiredSites: expiredSites || 0,
    pendingGuestMessages: pendingGuestMessages || 0,
    sitesWithPendingGuestMessages,
    recentWebsites: recentWebsites || [],
    recentActivity: recentActivity || [],
    errors: [
      normalizeError(countError, 'countError'),
      normalizeError(monthError, 'monthError'),
      normalizeError(recentError, 'recentError'),
      normalizeError(publishedError, 'publishedError'),
      normalizeError(soonError, 'soonError'),
      normalizeError(expiredError, 'expiredError'),
      normalizeError(pendingGuestMessagesError, 'pendingGuestMessagesError'),
      normalizeError(pendingGuestMessageSitesError, 'pendingGuestMessageSitesError'),
      normalizeError(recentActivityError, 'recentActivityError'),
    ].filter(Boolean)
  };
  cachedData = result;
  cachedAt = nowTime;
  return NextResponse.json(result);
}
