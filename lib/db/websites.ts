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

export interface ListWebsitesOptions {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export async function listWebsites(options: ListWebsitesOptions = {}) {
  let query = supabase.from('sites').select('*', { count: 'exact' });
  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options.search) {
    query = query.ilike('website_name', `%${options.search}%`);
  }
  if (options.sortBy) {
    query = query.order(options.sortBy, { ascending: options.sortDirection === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  if (typeof options.offset === 'number') {
    query = query.range(options.offset, (options.offset || 0) + (options.limit || 20) - 1);
  } else if (typeof options.limit === 'number') {
    query = query.limit(options.limit);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}
