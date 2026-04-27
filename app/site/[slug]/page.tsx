import { DEFAULT_THEME } from '@/config/defaults';
import { Metadata } from 'next';
import type { HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, GuestMessageRecord, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import ClientPage from '@/components/page/ClientPage';
import { isExpired, isArchived } from '@/lib/site-status';
import { getApprovedGuestMessagesBySiteId, getPublicSiteBySlug } from '@/lib/site-data';
import { getBusinessContactSettings } from '@/lib/business-contact-settings';
import { resolveDisplayName, resolveHeroCoverPhoto } from '@/lib/site-type-utils';
import { optimizeCloudinaryDeliveryUrl } from '@/lib/cloudinary-url';
import {
  buildOccasionDescription,
  buildOccasionTitle,
  buildSocialImageUrl,
  getBaseUrl,
  humanizeSlug,
} from '@/lib/public-site-metadata';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSiteBySlug(slug);
  const humanizedSiteTitle = slug ? humanizeSlug(slug) : 'Story';
  // Build a safe base URL preferring the public env var
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim())
    ? process.env.NEXT_PUBLIC_SITE_URL.trim()
    : getBaseUrl();

  // Fallback metadata if site not found
  if (!data) {
    const siteUrl = `${baseUrl.replace(/\/$/, '')}/site/${slug}`;
    const fallbackTitle = 'KeyStory';
    const fallbackDescription = 'Share and celebrate special moments.';
    const fallbackImage = '/default-og-image.png';

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: siteUrl,
        siteName: 'KeyStory',
        images: [
          {
            url: fallbackImage,
            width: 1200,
            height: 630,
            alt: fallbackTitle,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackImage],
      },
    };
  }

  const config = data.config || {};
  const sectionContent = (config.section_content as Record<string, unknown>) || {};
  const home = (sectionContent?.home as Record<string, unknown>) || {};

  // Derive celebrant / display name
  const celebrantName =
    (config as any)?.people?.primary || data.customer_name || (config as any)?.customer_name || '';

  const homeEventTitle =
    typeof (home as any).eventTitle === 'string' && (home as any).eventTitle.trim().length > 0
      ? (home as any).eventTitle.trim()
      : undefined;

  const title = homeEventTitle || `${celebrantName ? celebrantName : humanizedSiteTitle}'s Celebration`;

  const description =
    typeof (home as any).shortMessage === 'string' && (home as any).shortMessage.trim().length > 0
      ? (home as any).shortMessage.trim()
      : typeof (home as any).subtitle === 'string' && (home as any).subtitle.trim().length > 0
      ? (home as any).subtitle.trim()
      : 'You are warmly invited to celebrate this special day with us.';

  // Image preference: home.heroImage -> config.hero.coverPhotoUrl -> first media photo -> default
  const extractHomeHero = (): string | null => {
    const h = home as any;
    if (!h) return null;
    if (typeof h.heroImage === 'string' && h.heroImage.trim()) return h.heroImage.trim();
    if (h.heroImage && typeof h.heroImage.url === 'string' && h.heroImage.url.trim()) return h.heroImage.url.trim();
    return null;
  };

  const homeHero = extractHomeHero();
  const heroCoverPhotoUrl = typeof (config as any)?.hero?.coverPhotoUrl === 'string' && (config as any).hero.coverPhotoUrl.trim()
    ? (config as any).hero.coverPhotoUrl.trim()
    : null;
  const firstMediaPhoto = Array.isArray((config as any)?.media?.photos) && (config as any).media.photos.length > 0 && typeof (config as any).media.photos[0] === 'string'
    ? (config as any).media.photos[0]
    : null;

  const image = homeHero || heroCoverPhotoUrl || firstMediaPhoto || buildSocialImageUrl(slug) || '/default-og-image.png';

  const siteUrl = `${baseUrl.replace(/\/$/, '')}/site/${slug}`;

  const unavailable = isArchived(data) || isExpired(data);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'KeyStory',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: unavailable
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export default async function LovePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch site from cached helper (Next.js cache + revalidation path)
  const data = await getPublicSiteBySlug(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50 px-4">
        <div className="text-center p-6 rounded-lg shadow-md bg-white/80">
          <h1 className="text-3xl font-serif text-rose-900 mb-4">Page Not Found</h1>
          <p className="text-rose-700">This site doesn&apos;t exist or the link is invalid.</p>
        </div>
      </div>
    );
  }

  const siteStatus = (data.status || 'active').toString().toLowerCase();
  const siteIsExpired = isExpired(data);
  const siteIsArchived = isArchived(data);

  if (siteIsArchived) {
    const ArchivedSitePage = (await import('@/components/site/ExpiredSitePage')).default;
    return (
      <ArchivedSitePage
        siteSlug={slug}
        websiteName={data.website_name || data.slug}
        status="archived"
        expiresAt={data.expires_at || undefined}
        siteType={data.site_type?.toString()}
      />
    );
  }

  if (siteIsExpired) {
    const ExpiredSitePage = (await import('@/components/site/ExpiredSitePage')).default;
    return (
      <ExpiredSitePage
        siteSlug={slug}
        websiteName={data.website_name || data.slug}
        status="expired"
        expiresAt={data.expires_at || undefined}
        siteType={data.site_type?.toString()}
      />
    );
  }

  // Get config from data
  const config = data.config || {};

  const sections = Array.isArray(config.sections) ? config.sections : ['home'];
  const shouldLoadApprovedGuestMessages = sections.includes('guest_messages');
  const siteId = typeof data.id === 'string' ? data.id : '';

  let approvedMessagesData: GuestMessageRecord[] = [];
  if (shouldLoadApprovedGuestMessages && siteId) {
    approvedMessagesData = await getApprovedGuestMessagesBySiteId(siteId);
  }

  const approvedGuestMessages = approvedMessagesData;
  
  // Extract theme and templates with fallbacks
  const theme: ThemeKey = (config.theme as ThemeKey) || DEFAULT_THEME;
  const homeTemplate: HomeTemplate =
    (config.templates?.home as HomeTemplate) ||
    (config.home_template as HomeTemplate) ||
    'hero_centered';
  const galleryTemplate: GalleryTemplate =
    (config.templates?.gallery as GalleryTemplate) ||
    (config.gallery_template as GalleryTemplate) ||
    'grid';
  const timelineTemplate: TimelineTemplate =
    (config.templates?.timeline as TimelineTemplate) ||
    (config.timeline_template as TimelineTemplate) ||
    'vertical_timeline';
  
  // Get timeline events
  const timelineEvents: TimelineEvent[] = Array.isArray(config.timeline)
    ? config.timeline
    : Array.isArray(config.section_content?.timeline)
      ? config.section_content.timeline
      : [];

  // Get section content (new feature for dynamic content)
  const sectionContent = (config.section_content as Record<string, unknown>) || undefined;

  // Get photos - prefer config.media.photos; fallback to section_content.gallery.photos for legacy
  const rawPhotosCandidate = Array.isArray(config?.media?.photos) && config.media.photos.length > 0
    ? config.media.photos
    : Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0
      ? config.section_content.gallery.photos
      : [];

  const photosRaw: string[] = Array.isArray(rawPhotosCandidate)
    ? rawPhotosCandidate.filter(
        (photo): photo is string => typeof photo === 'string' && photo.trim().length > 0,
      )
    : [];

  const photos: string[] = photosRaw.map((photo: string, index: number) => {
    return optimizeCloudinaryDeliveryUrl(photo, {
      quality: index === 0 ? 'auto:good' : 'auto:eco',
      width: index === 0 ? 1600 : 1280,
      crop: 'limit',
    });
  });

  // Get tagline from config
  const tagline = config.tagline || data.tagline;

  // Get cover photo index from config
  const coverPhotoIndex = config.cover_photo_index;
  const heroCoverPhotoUrl = config?.hero?.coverPhotoUrl || null;

  const heroIndex = typeof config?.hero?.coverPhotoIndex === 'number' ? config.hero.coverPhotoIndex : null;
  const legacyCoverIndex = typeof coverPhotoIndex === 'number' ? coverPhotoIndex : null;
  const resolvedFromFallbackChain = resolveHeroCoverPhoto(
    { hero: config?.hero, cover_photo_index: coverPhotoIndex },
    photosRaw,
  );
  const effectiveHeroUrl = heroCoverPhotoUrl || resolvedFromFallbackChain || null;

  const heroPhotoSource =
    heroCoverPhotoUrl
      ? 'config.hero.coverPhotoUrl'
      : heroIndex !== null && Boolean(photos[heroIndex])
        ? `config.hero.coverPhotoIndex(${heroIndex})`
        : legacyCoverIndex !== null && Boolean(photosRaw[legacyCoverIndex])
          ? `config.cover_photo_index(${legacyCoverIndex})`
          : photosRaw.length > 0
            ? 'photos[0]'
            : 'none';

  const shortUrl = (url?: string | null) => {
    if (!url) return null;
    return url.length > 140 ? `${url.slice(0, 140)}...` : url;
  };

  if (process.env.NODE_ENV !== 'production') {
    console.info('[site-photo-source]', {
      slug,
      siteId: data.id,
      heroPhotoSource,
      dbFields: {
        heroCoverPhotoUrl: shortUrl(config?.hero?.coverPhotoUrl || null),
        heroCoverPhotoIndex: heroIndex,
        coverPhotoIndex: legacyCoverIndex,
        photosCount: photosRaw.length,
        firstPhoto: shortUrl(photosRaw[0] || null),
      },
      resolvedHeroUrl: shortUrl(effectiveHeroUrl),
    });
  }

  // Get QR data URL target (link to encode in styled QR)
  const qrDataUrl = config.qr_data_url || undefined;

  const siteType = (data.site_type as OccasionType) || 'couple';
  const customerName = config?.people?.primary || data.customer_name || '';
  const partnerName = config?.people?.secondary || data.partner_name || '';
  const specialDateVal = config?.dates?.special_date || data.specialDate || '';
  const message = config?.message || data.message || '';
  const songLink = config?.media?.song_link || data.song_link || '';
  const songAutoplay = config?.media?.song_autoplay ?? (data as any).song_autoplay ?? false;

  return (
    <ClientPage
        siteType={siteType}
        config={config}
        siteId={siteId}
        slug={slug}
      analyticsEnabled={(await getBusinessContactSettings())?.analyticsEnabled ?? null}
        theme={theme}
        sections={sections}
        homeTemplate={homeTemplate}
        galleryTemplate={galleryTemplate}
        timelineTemplate={timelineTemplate}
        customerName={customerName}
        partnerName={partnerName}
        anniversaryDate={specialDateVal}
        message={message}
        tagline={tagline}
        photos={photos}
        coverPhotoIndex={coverPhotoIndex}
        songLink={songLink}
        songAutoplay={songAutoplay}
        qrCodeUrl={data.qr_code_url}
        qrDataUrl={qrDataUrl}
        timelineEvents={timelineEvents}
        sectionContent={sectionContent}
        heroCoverPhotoUrl={heroCoverPhotoUrl}
        approvedGuestMessages={approvedGuestMessages}
      />
  );
}
