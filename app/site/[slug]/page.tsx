import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, GuestMessageRecord } from '@/lib/types';
import LovePageClient from '@/components/page/LovePageClient';
import { isExpired, isArchived } from '@/lib/site-status';
import { getPublicSiteBySlug } from '@/lib/site-data';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSiteBySlug(slug);

  if (data) {
    const siteType = (data.site_type as 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary') || 'couple';
    const customerName =
      data.config?.people?.primary || data.customer_name || data.config?.customer_name || '';
    const partnerName =
      data.config?.people?.secondary || data.partner_name || data.config?.partner_name || '';
    const websiteSlug = slug;

    const humanizedSiteTitle = websiteSlug
      ? websiteSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
      : 'Love Story';

    if (siteType === 'birthday') {
      return {
        title: `${customerName || humanizedSiteTitle} - Happy Birthday!`,
        description: 'A special birthday website full of celebration and joy.',
      };
    }

    const coupleTitle = customerName && partnerName
      ? `${customerName} & ${partnerName} - Our Love Story`
      : customerName
        ? `${customerName} - Our Love Story`
        : partnerName
          ? `${partnerName} - Our Love Story`
          : `${humanizedSiteTitle} - Love Story`;

    return {
      title: coupleTitle,
      description: 'A special website celebrating our love story.',
    };
  }
  return {
    title: slug ? `${slug.replace(/[-_]/g, ' ')} - Love Story` : 'Love Story',
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
        slug={slug}
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
        slug={slug}
        websiteName={data.website_name || data.slug}
        status="expired"
        expiresAt={data.expires_at || undefined}
        siteType={data.site_type?.toString()}
      />
    );
  }

  // Get config from data
  const config = data.config || {};

  // Fetch approved guest messages from DB for this site
  const { data: approvedMessagesData, error: approvedMessagesError } = await supabase
    .from('guest_messages')
    .select('id, site_id, name, message, status, created_at')
    .eq('site_id', data.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (approvedMessagesError) {
    console.warn('Failed fetching approved guest messages:', approvedMessagesError.message);
  }

  const approvedGuestMessages = (approvedMessagesData ?? []) as GuestMessageRecord[];
  
  // Extract theme and templates with fallbacks
  const theme: Theme = (config.theme as Theme) || 'romantic_classic';
  const sections = Array.isArray(config.sections) ? config.sections : ['home'];
  const homeTemplate: HomeTemplate = (config.home_template as HomeTemplate) || 'hero_centered';
  const galleryTemplate: GalleryTemplate = (config.gallery_template as GalleryTemplate) || 'grid';
  const timelineTemplate: TimelineTemplate = (config.timeline_template as TimelineTemplate) || 'vertical_timeline';
  
  // Get timeline events
  const timelineEvents: TimelineEvent[] = Array.isArray(config.timeline) 
    ? config.timeline 
    : Array.isArray(config.timeline_events) 
      ? config.timeline_events 
      : [];

  // Get section content (new feature for dynamic content)
  const sectionContent = config.content 
    ? (config.content as Record<string, unknown>) 
    : (config.section_content as Record<string, unknown>) || undefined;

  // Get photos - from config.media or fallback older fields
  const photos = Array.isArray(config?.media?.photos)
    ? config.media.photos
    : Array.isArray(data.photos)
      ? data.photos
      : Array.isArray(config.photos)
        ? config.photos
        : [];

  // Get tagline from config
  const tagline = config.tagline || data.tagline;

  // Get cover photo index from config
  const coverPhotoIndex = config.cover_photo_index;

  // Get QR data URL target (link to encode in styled QR)
  const qrDataUrl = config.qr_data_url || undefined;

  const siteType = (data.site_type as 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary') || 'couple';
  const customerName = config?.people?.primary || data.customer_name || '';
  const partnerName = config?.people?.secondary || data.partner_name || '';
  const specialDateVal = config?.dates?.special_date || data.specialDate || data.anniversary_date || '';
  const message = config?.message || data.message || '';
  const songLink = config?.media?.song_link || data.song_link || '';
  const songAutoplay = config?.media?.song_autoplay ?? (data as any).song_autoplay ?? false;

  return (
    <LovePageClient
        siteType={siteType}
        config={config}
        slug={slug}
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
        approvedGuestMessages={approvedGuestMessages}
      />
  );
}
