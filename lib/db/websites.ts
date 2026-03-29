// Fetch full site object (with config) by id
export async function getWebsiteByIdWithConfig(id: string) {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
import { supabase, Site } from '@/lib/supabase';

export type CreateWebsiteInput = Omit<Site, 'id'>;
export type UpdateWebsiteInput = Partial<Site> & { id: string };

export async function createWebsite(data: CreateWebsiteInput) {
  const { data: site, error } = await supabase.from('sites').insert(data).select().single();
  if (error) throw error;
  return site;
}

export async function getWebsiteById(id: string) {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateWebsite(input: UpdateWebsiteInput) {
  const { id, ...updates } = input;
  const { data, error } = await supabase.from('sites').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteWebsite(id: string) {
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function listWebsites() {
  const { data, error } = await supabase.from('sites').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
