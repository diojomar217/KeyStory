import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent } from '@/lib/types';
import LovePageClient from '@/components/LovePageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from('orders')
    .select('customer_name, partner_name')
    .eq('website_name', slug)
    .maybeSingle();

  if (data) {
    return {
      title: `${data.customer_name} & ${data.partner_name} - Our Love Story`,
      description: 'A special website celebrating our love story.',
    };
  }
  return {
    title: 'Love Story',
  };
}

export default async function LovePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch order from Supabase using slug
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('website_name', slug)
    .maybeSingle();

  if (error) {
    console.error('Supabase fetch error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-serif text-rose-900 mb-4">Oops!</h1>
          <p className="text-rose-700">Something went wrong. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-serif text-rose-900 mb-4">Page Not Found</h1>
          <p className="text-rose-700">This love story doesn&apos;t exist or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // Get config from data
  const config = data.config || {};
  
  // Extract theme and templates with fallbacks
  const theme: Theme = (config.theme as Theme) || 'romantic_classic';
  const sections = Array.isArray(config.sections) ? config.sections : ['home'];
  const homeTemplate: HomeTemplate = (config.home_template as HomeTemplate) || 'hero_centered';
  const galleryTemplate: GalleryTemplate = (config.gallery_template as GalleryTemplate) || 'grid';
  const timelineTemplate: TimelineTemplate = (config.timeline_template as TimelineTemplate) || 'vertical_timeline';
  
  // Get timeline events
  const timelineEvents: TimelineEvent[] = Array.isArray(config.timeline_events) 
    ? config.timeline_events 
    : [];

  // Get photos - could be in config or directly on data
  const photos = Array.isArray(data.photos) 
    ? data.photos 
    : Array.isArray(config.photos) 
      ? config.photos 
      : [];

  // Get tagline from config
  const tagline = config.tagline;

  // Get cover photo index from config
  const coverPhotoIndex = config.cover_photo_index;

  // Get QR data URL from config (for styled QR generation)
  const qrDataUrl = config.qr_data_url;

  return (
    <LovePageClient
      slug={slug}
      theme={theme}
      sections={sections}
      homeTemplate={homeTemplate}
      galleryTemplate={galleryTemplate}
      timelineTemplate={timelineTemplate}
      customerName={data.customer_name}
      partnerName={data.partner_name}
      anniversaryDate={data.anniversary_date}
      message={data.message}
      tagline={tagline}
      photos={photos}
      coverPhotoIndex={coverPhotoIndex}
      songLink={data.song_link}
      qrCodeUrl={data.qr_code_url}
      qrDataUrl={qrDataUrl}
      timelineEvents={timelineEvents}
    />
  );
}

