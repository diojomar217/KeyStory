import { supabase, Site } from '@/lib/supabase';

const SORTABLE_SITE_COLUMNS = new Set([
  'created_at',
  'updated_at',
  'website_name',
  'slug',
  'status',
  'expires_at',
]);

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Fetch full site object (with config) by id
export async function getWebsiteByIdWithConfig(id: string) {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type CreateWebsiteInput = Omit<Site, 'id'>;
export type UpdateWebsiteInput = Partial<Site> & { id: string };

const stripUnsupportedLegacyColumns = <T extends Record<string, any>>(input: T): T => {
  const sanitized = { ...input };
  delete sanitized.customer_name;
  delete sanitized.partner_name;
  delete sanitized.specialDate;
  delete sanitized.tagline;
  delete sanitized.message;
  delete sanitized.anniversary_date;
  delete sanitized.song_link;
  delete sanitized.photos;
  return sanitized;
};

export async function createWebsite(data: CreateWebsiteInput) {
  const sanitized = stripUnsupportedLegacyColumns(data as Record<string, any>);
  const { data: site, error } = await supabase.from('sites').insert(sanitized).select().single();
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
  const sanitized = stripUnsupportedLegacyColumns(updates as Record<string, any>);
  const { data, error } = await supabase.from('sites').update(sanitized).eq('id', id).select().single();
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
  guestMessageFilter?: 'all' | 'pending';
}

export async function listWebsites(options: ListWebsitesOptions = {}) {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const offset = Math.max(options.offset ?? 0, 0);
  const sortBy = SORTABLE_SITE_COLUMNS.has(options.sortBy || '') ? options.sortBy! : 'created_at';
  const ascending = options.sortDirection === 'asc';
  const guestMessageFilter = options.guestMessageFilter || 'all';

  let pendingSiteIds: string[] | null = null;
  if (guestMessageFilter === 'pending') {
    const { data: pendingMessages, error: pendingMessagesError } = await supabase
      .from('guest_messages')
      .select('site_id')
      .eq('status', 'pending');

    if (pendingMessagesError) throw pendingMessagesError;

    pendingSiteIds = Array.from(
      new Set(
        (pendingMessages || [])
          .map((row) => row.site_id)
          .filter((siteId): siteId is string => typeof siteId === 'string' && siteId.length > 0)
      )
    );

    if (pendingSiteIds.length === 0) {
      return { data: [], total: 0 };
    }
  }

  const listSelectColumns = [
    'id',
    'slug',
    'website_name',
    'site_type',
    'status',
    'expires_at',
    'created_at',
    'updated_at',
    'config',
  ].join(',');

  // Select only columns needed by list screens to reduce query payload and egress.
  let query = supabase.from('sites').select(listSelectColumns, { count: 'exact' });
  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (pendingSiteIds) {
    query = query.in('id', pendingSiteIds);
  }
  if (options.search) {
    query = query.or(`website_name.ilike.%${options.search}%,slug.ilike.%${options.search}%`);
  }
  query = query.order(sortBy, { ascending });
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}
