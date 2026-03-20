import { cache } from 'react';
import { supabase, Site } from '@/lib/supabase';
import { isArchived, isExpired } from '@/lib/site-status';

export type PublicSiteData = Omit<Site, 'password' | 'password_input'>;

export const getPublicSiteBySlug = cache(async (slug: string): Promise<PublicSiteData | null> => {
  if (!slug) return null;

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('website_name', slug)
    .maybeSingle();

  if (error) {
    console.error('[getPublicSiteBySlug] Supabase error:', error);
    throw error;
  }

  if (!site) return null;

  const status = (site.status || 'active').toString().toLowerCase();

  // Keep site status in sync with expires_at and archive marker
  let normalizedStatus = status;
  if (isArchived(site)) {
    normalizedStatus = 'archived';
  } else if (isExpired(site)) {
    normalizedStatus = 'expired';
  }

  return {
    ...site,
    status: normalizedStatus,
    config: site.config || {},
  } as PublicSiteData;
});
