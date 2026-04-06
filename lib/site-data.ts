import { unstable_cache } from 'next/cache';
import { supabase, Site } from '@/lib/supabase';
import { isArchived, isExpired } from '@/lib/site-status';
import type { GuestMessageRecord } from '@/lib/types';

export type PublicSiteData = Omit<Site, 'password' | 'password_input'>;

const PUBLIC_SITE_CACHE_REVALIDATE_SECONDS = 300;
const APPROVED_GUEST_MESSAGES_CACHE_REVALIDATE_SECONDS = 120;

export const getPublicSiteBySlugTag = (slug: string) => `public-site:${slug}`;
export const getApprovedGuestMessagesBySiteIdTag = (siteId: string) => `approved-guest-messages:${siteId}`;

async function fetchPublicSiteBySlugUncached(slug: string): Promise<PublicSiteData | null> {
  if (!slug) return null;
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;


  // Slug lookup only needs public-facing fields; avoid select('*') to reduce payload/egress.
  const publicSiteSelect = [
    'id',
    'slug',
    'website_name',
    'site_type',
    'status',
    'expires_at',
    'archived_at',
    'qr_code_url',
    'config',
  ].join(',');

  const lookupByWebsiteName = await supabase
    .from('sites')
    .select(publicSiteSelect)
    .eq('website_name', normalizedSlug)
    .maybeSingle();

  const lookupBySlug =
    lookupByWebsiteName.error || !lookupByWebsiteName.data
      ? await supabase
          .from('sites')
          .select(publicSiteSelect)
          .eq('slug', normalizedSlug)
          .maybeSingle()
      : null;

  const rawSite = (lookupByWebsiteName.data || lookupBySlug?.data) as Site | null;
  const error = lookupByWebsiteName.error || lookupBySlug?.error || null;

  const site = rawSite;
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

  if (process.env.NODE_ENV !== 'production') {
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
  }

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

export async function getPublicSiteBySlug(slug: string): Promise<PublicSiteData | null> {
  if (!slug) return null;

  return unstable_cache(
    async () => fetchPublicSiteBySlugUncached(slug),
    ['public-site-by-slug', slug],
    {
      revalidate: PUBLIC_SITE_CACHE_REVALIDATE_SECONDS,
      tags: [getPublicSiteBySlugTag(slug)],
    },
  )();
}

export async function getApprovedGuestMessagesBySiteId(siteId: string): Promise<GuestMessageRecord[]> {
  if (!siteId) return [];

  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('id, site_id, name, message, status, created_at')
        .eq('site_id', siteId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Failed fetching approved guest messages:', error.message);
        return [];
      }

      return (data ?? []) as GuestMessageRecord[];
    },
    ['approved-guest-messages-by-site', siteId],
    {
      revalidate: APPROVED_GUEST_MESSAGES_CACHE_REVALIDATE_SECONDS,
      tags: [getApprovedGuestMessagesBySiteIdTag(siteId)],
    },
  )();
}
