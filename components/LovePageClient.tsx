'use client';

import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent } from '@/lib/types';
import ThemeWrapper from './ThemeWrapper';
import HomeSection from './HomeSection';
import GallerySection from './GallerySection';
import TimelineSection from './TimelineSection';
import SongSection from './SongSection';
import FooterSection from './FooterSection';
import LoveLetterSection from './LoveLetterSection';

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
  
  // Track section order for alternating backgrounds
  let sectionIndex = 0;

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

        {/* Song Section - Full Width */}
        {hasSong && (
          <SongSection
            theme={theme}
            songLink={songLink}
          />
        )}

        {/* Gallery Section */}
        {hasGallery && (
          <section className={`py-16 md:py-20 ${sectionIndex++ % 2 === 0 ? theme === 'dark_elegant' ? 'bg-zinc-800/30' : 'bg-white' : theme === 'dark_elegant' ? 'bg-zinc-900/30' : 'bg-rose-50/50'}`}>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <GallerySection
                theme={theme}
                template={galleryTemplate}
                photos={photos}
              />
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {hasTimeline && (
          <section className={`py-16 md:py-20 ${sectionIndex++ % 2 === 0 ? theme === 'dark_elegant' ? 'bg-zinc-800/30' : 'bg-white' : theme === 'dark_elegant' ? 'bg-zinc-900/30' : 'bg-rose-50/50'}`}>
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <TimelineSection
                theme={theme}
                template={timelineTemplate}
                events={timelineEvents}
              />
            </div>
          </section>
        )}

        {/* Footer */}
        <FooterSection
          theme={theme}
          customerName={customerName}
          partnerName={partnerName}
          qrCodeUrl={qrCodeUrl}
          qrDataUrl={qrDataUrl}
        />
      </div>
    </ThemeWrapper>
  );
}

