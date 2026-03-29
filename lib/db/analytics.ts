import { supabase } from '@/lib/supabase';

export type AnalyticsEventInput = {
  site_id: string;
  event_type: string;
  source: string;
  user_agent: string;
  referrer: string;
  ip_hash: string;
};

export async function insertAnalyticsEvent(event: AnalyticsEventInput) {
  const { error } = await supabase.from('site_analytics_events').insert(event);
  if (error) throw error;
  return true;
}
