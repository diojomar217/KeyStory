import { supabase } from '@/lib/supabase';

export type GuestMessageInput = {
  site_id: string;
  name: string;
  message: string;
  status?: string;
};

export async function insertGuestMessage(input: GuestMessageInput) {
  const siteId = (input.site_id || '').trim();
  const name = (input.name || '').trim();
  const message = (input.message || '').trim();
  const status = (input.status || 'pending').trim();

  if (!siteId || !name || !message) {
    throw new Error('site_id, name, and message are required');
  }

  const dedupeSince = new Date(Date.now() - 60 * 1000).toISOString();
  const { data: recent, error: dedupeError } = await supabase
    .from('guest_messages')
    .select('id')
    .eq('site_id', siteId)
    .eq('name', name)
    .eq('message', message)
    .gte('created_at', dedupeSince)
    .limit(1);

  if (dedupeError) throw dedupeError;
  if (recent && recent.length > 0) return true;

  const { error } = await supabase.from('guest_messages').insert({
    site_id: siteId,
    name,
    message,
    status,
  });
  if (error) throw error;
  return true;
}

export async function deleteGuestMessage(id: string) {
  const { error } = await supabase.from('guest_messages').delete().eq('id', id);
  if (error) throw error;
  return true;
}
