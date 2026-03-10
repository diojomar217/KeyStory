'use client';

import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent } from '@/lib/types';
import ThemeWrapper from './ThemeWrapper';
import HomeSection from './HomeSection';
import GallerySection from './GallerySection';
import TimelineSection from './TimelineSection';
import SongSection from './SongSection';
import FooterSection from './FooterSection';
import LoveLetterSection from './LoveLetterSection';
import BackToTop from './BackToTop';
import MemoryCardSection from './product/MemoryCardSection';

type Props = {
  theme: Theme;
  sections: string[];
  homeTemplate: HomeTemplate;
  galleryTemplate: GalleryTemplate;
  timelineTemplate: TimelineTemplate;
  customerName: string;
  partnerName: string;
  anniversaryDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
  songLink?: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  timelineEvents: TimelineEvent[];
};

export default function LovePageClient({
  theme,
  sections,
  homeTemplate,
  galleryTemplate,
  timelineTemplate,
  customerName,
  partnerName,
  anniversaryDate,
  message,
  tagline,
  photos,
  coverPhotoIndex,
  songLink,
  qrCodeUrl,
  qrDataUrl,
  timelineEvents,
}: Props) {
  // Determine if we need alternating backgrounds
  const hasGallery = sections.includes('gallery');
  const hasTimeline = sections.includes('timeline');
  const hasSong = !!songLink;

  return (
    <ThemeWrapper theme={theme}>
      <div className="min-h-screen">
        {/* Home Section - Hero - Full Width */}
        {sections.includes('home') && (
          <HomeSection
            theme={theme}
            template={homeTemplate}
            customerName={customerName}
            partnerName={partnerName}
            anniversaryDate={anniversaryDate}
            message={message}
            tagline={tagline}
            photos={photos}
            coverPhotoIndex={coverPhotoIndex}
          />
        )}

        {/* Love Letter Section - Full Width below hero */}
        {message && (
          <LoveLetterSection
            message={message}
            theme={theme}
          />
        )}

        {/* Timeline Section - Relationship story */}
        {hasTimeline && (
          <TimelineSection
            theme={theme}
            template={timelineTemplate}
            events={timelineEvents}
          />
        )}

        {/* Gallery Section - Memories together */}
        {hasGallery && (
          <GallerySection
            theme={theme}
            template={galleryTemplate}
            photos={photos}
          />
        )}

        {/* Song Section - Music that represents the relationship */}
        {hasSong && (
          <SongSection
            theme={theme}
            songLink={songLink}
          />
        )}

        {/* Memory Card Section - Premium Keepsake */}
        <MemoryCardSection
          theme={theme}
          customerName={customerName}
          partnerName={partnerName}
          qrCodeUrl={qrCodeUrl}
          qrDataUrl={qrDataUrl}
        />

        {/* Footer */}
        <FooterSection
          theme={theme}
          customerName={customerName}
          partnerName={partnerName}
          qrCodeUrl={qrCodeUrl}
          qrDataUrl={qrDataUrl}
        />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </ThemeWrapper>
  );
}

