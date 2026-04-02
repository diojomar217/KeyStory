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

  const { error } = await supabase.from('site_analytics_events').insert(payload);
  if (error) throw error;
  return true;
}
