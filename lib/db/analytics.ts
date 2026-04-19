import { supabase } from '@/lib/supabase';

export type AnalyticsEventInput = {
  site_id: string;
  event_type: string;
  source?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  ip_hash?: string | null;
};

export async function insertAnalyticsEvent(event: AnalyticsEventInput) {
  // Check whether analytics are enabled for this site; if explicitly disabled, skip recording.
  try {
    const { data: siteRow } = await supabase.from('sites').select('config').eq('id', event.site_id).maybeSingle();
    const cfg = (siteRow as any)?.config || {};
    if (cfg && typeof cfg.analytics_enabled !== 'undefined' && cfg.analytics_enabled === false) {
      // Analytics disabled for this site — treat as successful no-op.
      return true;
    }
  } catch (e) {
    // If the config lookup fails, fall through and continue to attempt insert to avoid losing events.
  }
  // Check global business settings for analytics enable flag. If explicitly disabled, skip recording.
  try {
    const { data: bs } = await supabase.from('business_settings').select('analytics_enabled').maybeSingle();
    if (bs && typeof (bs as any).analytics_enabled !== 'undefined' && (bs as any).analytics_enabled === false) {
      return true;
    }
  } catch (e) {
    // fall through if business settings cannot be read
  }
  const dedupeSince = new Date(Date.now() - 15 * 1000).toISOString();

  let dedupeQuery = supabase
    .from('site_analytics_events')
    .select('id')
    .eq('site_id', event.site_id)
    .eq('event_type', event.event_type)
    .gte('created_at', dedupeSince)
    .limit(1);

  dedupeQuery = event.source ? dedupeQuery.eq('source', event.source) : dedupeQuery.is('source', null);
  dedupeQuery = event.ip_hash ? dedupeQuery.eq('ip_hash', event.ip_hash) : dedupeQuery.is('ip_hash', null);

  const { data: recent, error: dedupeError } = await dedupeQuery;
  if (dedupeError) throw dedupeError;
  if (recent && recent.length > 0) return true;

  const payload = {
    site_id: event.site_id,
    event_type: event.event_type,
    source: event.source || null,
    user_agent: event.user_agent || null,
    referrer: event.referrer || null,
    ip_hash: event.ip_hash || null,
  };

  // Validate event_type against known allowed values to avoid DB check-constraint failures.
  const allowed = [
    'page_view',
    'qr_scan',
    'section_view',
    'share_click',
    'download_card',
    'music_play',
    'opening_reveal',
  ];

  if (!allowed.includes(String(payload.event_type))) {
    // map unknown event types to 'page_view' as a safe fallback
    payload.event_type = 'page_view';
  }

  try {
    const { error } = await supabase.from('site_analytics_events').insert(payload);
    if (error) throw error;
    return true;
  } catch (err: any) {
    // If DB check constraint rejects the event type, try a safe fallback and continue.
    if (err && err.code === '23514') {
      try {
        payload.event_type = 'page_view';
        const { error: retryErr } = await supabase.from('site_analytics_events').insert(payload);
        if (retryErr) throw retryErr;
        return true;
      } catch (e) {
        // rethrow original for visibility
        throw err;
      }
    }
    throw err;
  }
}
