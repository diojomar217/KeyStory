import { supabase } from '@/lib/supabase';

export type GuestMessageInput = {
  site_id: string;
  name: string;
  message: string;
  status?: string;
};

export async function insertGuestMessage(input: GuestMessageInput) {
  const { error } = await supabase.from('guest_messages').insert({
    ...input,
    status: input.status || 'pending',
  });
  if (error) throw error;
  return true;
}

export async function deleteGuestMessage(id: string) {
  const { error } = await supabase.from('guest_messages').delete().eq('id', id);
  if (error) throw error;
  return true;
}
