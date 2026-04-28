import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPublicSiteBySlugNoCache } from '@/lib/site-data';
import { getBaseUrl, humanizeSlug } from '@/lib/public-site-metadata';
import { resolveDisplayName } from '@/lib/site-type-utils';
import type { OccasionType } from '@/lib/types';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || '';
    const baseUrl = getBaseUrl();
    const fallbackName = humanizeSlug(slug || 'story');

    if (!slug) {
      const notFound = new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,#fff7fb,#fffaf0)',
              fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
              color: '#6a2f39',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700 }}>KeyStory</div>
              <div style={{ marginTop: 8, fontSize: 20 }}>Invitation Not Found</div>
            </div>
          </div>
        ),
        size,
      );

      notFound.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return notFound;
    }

    const data = await getPublicSiteBySlugNoCache(slug);
    const config = data?.config || {};
    const siteType = (data?.site_type as OccasionType) || 'couple';
    const displayName = resolveDisplayName(
      siteType,
      (config?.participants as any) || [],
      (config?.people as any)?.primary || data?.customer_name || '',
      (config?.people as any)?.secondary || data?.partner_name || '',
    ) || fallbackName;

    const title =
      (config as any)?.eventTitle ||
      (config as any)?.title ||
      ((config as any)?.childName ? `${(config as any).childName}'s Celebration` : null) ||
      data?.website_name ||
      `${displayName}'s Celebration`;

    const description = (config as any)?.description || (config as any)?.message || 'View this beautiful digital invitation and shared memories on KeyStory.';

    // Cover detection
    let cover: string | null = (config as any)?.ogImage || null;
    if (!cover && Array.isArray((config as any)?.media?.photos) && (config as any).media.photos.length > 0) {
      const p = (config as any).media.photos[0];
      if (typeof p === 'string') cover = p;
      else if (p && typeof p.url === 'string') cover = p.url;
      else if (p && typeof p.secure_url === 'string') cover = p.secure_url;
    }

    if (cover && !/^https?:\/\//i.test(cover)) {
      const base = baseUrl.replace(/\/$/, '');
      cover = `${base}${cover.startsWith('/') ? cover : `/${cover}`}`;
    }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            padding: 48,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg,#fff7fb,#fffaf0)',
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            color: '#3b2b2f',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, paddingRight: 24 }}>
            <div style={{ fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: '#8b6c72', marginBottom: 12 }}>KeyStory</div>
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, color: '#6a2f39' }}>{title}</div>
            <div style={{ marginTop: 16, fontSize: 22, color: '#7d5c64', maxWidth: 740 }}>{description}</div>
            <div style={{ marginTop: 20, fontSize: 16, color: '#9b7a80' }}>Shareable invitation · {displayName}</div>
          </div>

          <div style={{ width: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cover ? (
              <div style={{ width: 380, height: 380, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.14)' }}>
                <img src={cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: 380, height: 380, borderRadius: 20, boxShadow: '0 12px 36px rgba(0,0,0,0.12)', background: 'linear-gradient(135deg,#F472B6 0%, #A78BFA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: 32, fontWeight: 700 }}>KeyStory</div>
              </div>
            )}
          </div>
        </div>
      ),
      size,
    );

    imageResponse.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return imageResponse;
  } catch (e) {
    try {
      const fallback = new ImageResponse(
        (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#fff7fb,#fffaf0)' }}>
            <div style={{ textAlign: 'center', fontFamily: 'Inter, system-ui, -apple-system' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6a2f39' }}>KeyStory</div>
            </div>
          </div>
        ),
        size,
      );

      fallback.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return fallback;
    } catch (inner) {
      return new Response('Failed to generate image', { status: 500 });
    }
  }
}
