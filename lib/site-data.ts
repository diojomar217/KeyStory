import { cache } from 'react';
import { supabase, Site, getSiteById } from '@/lib/supabase';
import { isArchived, isExpired } from '@/lib/site-status';

export type PublicSiteData = Omit<Site, 'password' | 'password_input'>;


export async function getPublicSiteBySlug(slug: string): Promise<PublicSiteData | null> {
  if (!slug) return null;
  // getSiteById expects id, so fallback to direct query for slug
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

  const photos = Array.isArray((site as any).photos) ? (site as any).photos : [];
  const config = (site as any).config || {};
  const shortUrl = (url?: string | null) => {
    if (!url) return null;
    return url.length > 140 ? `${url.slice(0, 140)}...` : url;
  };

  console.info('[getPublicSiteBySlug] DB photo fields', {
    slug,
    siteId: (site as any).id,
    hasConfigHeroCoverUrl: Boolean(config?.hero?.coverPhotoUrl),
    heroCoverPhotoUrl: shortUrl(config?.hero?.coverPhotoUrl || null),
    heroCoverPhotoIndex: typeof config?.hero?.coverPhotoIndex === 'number' ? config.hero.coverPhotoIndex : null,
    coverPhotoIndex: typeof config?.cover_photo_index === 'number' ? config.cover_photo_index : null,
    photosCount: photos.length,
    firstPhoto: shortUrl(photos[0] || null),
  });

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
}
