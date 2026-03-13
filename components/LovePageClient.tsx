'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, SectionContentMap, GalleryLayout } from '@/lib/types';
import ThemeWrapper from './ThemeWrapper';
import HomeSection from './HomeSection';
import GallerySection from './GallerySection';
import TimelineSection from './TimelineSection';
import SongSection from './SongSection';
import FooterSection from './FooterSection';
import LoveLetterSection from './LoveLetterSection';
import BackToTop from './BackToTop';
import MemoryCardSection from './product/MemoryCardSection';
import RomanticOpening from './RomanticOpening';

// Import new section components
import QuotesSection from './sections/QuotesSection';
import OurStorySection from './sections/OurStorySection';
import MilestonesSection from './sections/MilestonesSection';
import FutureDreamsSection from './sections/FutureDreamsSection';
import VideoMemoriesSection from './sections/VideoMemoriesSection';
import RelationshipStatsSection from './sections/RelationshipStatsSection';
import AnniversaryCountdownSection from './sections/AnniversaryCountdownSection';
import PolaroidGallerySection from './sections/PolaroidGallerySection';
import FirstDateSection from './sections/FirstDateSection';
import SpecialMomentsSection from './sections/SpecialMomentsSection';
import ReasonsILoveYouSection from './sections/ReasonsILoveYouSection';
// MemoryMapSection from './sections/MemoryMapSection'; // SSR issue - disabled for PHASE 2
import GuestMessagesSection from './sections/GuestMessagesSection';
import LetterToFutureSection from './sections/LetterToFutureSection';
import GiftSection from './sections/GiftSection';
import SurpriseMessageSection from './sections/SurpriseMessageSection';
import PlaylistSection from './sections/PlaylistSection';

// Import backward compatibility helpers
import { 
  convertToTimelineEvents, 
  getGalleryLayout,
  sortSectionsByDisplayOrder 
} from '@/lib/section-migration';

// Import section layouts and separators
import { SectionSeparator } from './love/SectionLayouts';

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
  sectionContent?: SectionContentMap;
  slug?: string;
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
  sectionContent,
  slug,
}: Props) {
  // Romantic opening state
  const [showOpening, setShowOpening] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  // Determine if we need alternating backgrounds
  const hasGallery = sections.includes('gallery');
  const hasTimeline = sections.includes('timeline');
  const hasSong = !!songLink;

  // Check localStorage on mount to determine if we should skip the opening
  useEffect(() => {
    if (slug) {
      const storageKey = `love_story_opened_${slug}`;
      const hasOpened = localStorage.getItem(storageKey);
      
      if (hasOpened) {
        setShowOpening(false);
      }
    } else {
      // If no slug, skip opening
      setShowOpening(false);
    }
  }, [slug]);

  // Handle reveal - called when user clicks the open button
  const handleReveal = useCallback(() => {
    setIsRevealing(true);
    
    // Set localStorage to remember this visit
    if (slug) {
      const storageKey = `love_story_opened_${slug}`;
      localStorage.setItem(storageKey, 'true');
    }
    
    // Wait for animation to complete, then show main content
    setTimeout(() => {
      setShowOpening(false);
      setIsRevealing(false);
    }, 800);
  }, [slug]);

  // Compute backward-compatible data using useMemo
  const { effectiveGalleryLayout, mergedTimelineEvents } = useMemo(() => {
    // Determine gallery layout - handle polaroid_gallery backward compat
    const layout = getGalleryLayout(
      sections as any, 
      { gallery_template: galleryTemplate } as any
    );
    
    // Convert deprecated story sections to timeline events
    const mergedEvents = convertToTimelineEvents(timelineEvents, sectionContent);
    
    return {
      effectiveGalleryLayout: layout,
      mergedTimelineEvents: mergedEvents,
    };
  }, [sections, galleryTemplate, timelineEvents, sectionContent]);

  // Check for deprecated sections
  const hasFirstDate = sections.includes('first_date');
  const hasSpecialMoments = sections.includes('special_moments');
  const hasMilestones = sections.includes('milestones');
  const hasPolaroidGallery = sections.includes('polaroid_gallery');
  
  // Show timeline if it's enabled OR if deprecated story sections exist
  const shouldShowTimeline = hasTimeline || hasFirstDate || hasSpecialMoments || hasMilestones;
  
  // Show gallery if it's enabled OR if polaroid_gallery exists (for backward compat)
  const shouldShowGallery = hasGallery || hasPolaroidGallery;

  // Main content rendering with alternating backgrounds
  const renderMainContent = () => {
    // Track section index for alternating backgrounds
let sectionIndex = 0;
  const getSectionVariant = (index: number) => {
    const variant = index % 2 === 1 ? 'alt' : 'default';
    const staggered = index % 4 === 1 || index % 4 === 2;
    return { variant, staggered };
  };
    
    return (
      <ThemeWrapper theme={theme}>
        <div className="min-h-screen">
          {/* 1. Home Section - Hero - Full Width */}
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

          {/* 2. Love Letter Section - Full Width below hero */}
          {message && (
            <LoveLetterSection
              message={message}
              theme={theme}
            />
          )}

          {/* 3. Our Story Section - Alternating background */}
          {sections.includes('our_story') && (
            <OurStorySection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              story={sectionContent?.our_story?.content}
              variant={sectionIndex++ % 2 === 1 ? 'alt' : 'default'}
            />
          )}

          {/* 4. Timeline Section - Now handles first_date, special_moments, milestones */}
          {shouldShowTimeline && (
            <TimelineSection
              theme={theme}
              template={timelineTemplate}
              events={mergedTimelineEvents}
            />
          )}

          {/* 5. Gallery Section - Now handles polaroid_gallery via layout */}
          {shouldShowGallery && (
            <GallerySection
              theme={theme}
              template={effectiveGalleryLayout as any}
              photos={photos}
              coverPhotoIndex={coverPhotoIndex}
            />
          )}

          {/* Separator after Gallery */}
          {(shouldShowGallery || shouldShowTimeline) && <SectionSeparator theme={theme} />}

          {/* 6. Song Section - Music that represents the relationship */}
          {hasSong && (
            <SongSection
              theme={theme}
              songLink={songLink}
            />
          )}

          {/* 6b. Playlist Section */}
          {sections.includes('playlist') && (
            <PlaylistSection
              theme={theme}
              songLink={sectionContent?.playlist?.playlistUrl || songLink}
            />
          )}

          {/* 6c. Video Memories Section */}
          {sections.includes('video_memories') && (
            <VideoMemoriesSection theme={theme} videos={sectionContent?.video_memories?.videos} />
          )}

          {/* 7. Relationship Stats Section */}
          {sections.includes('relationship_stats') && (
            <RelationshipStatsSection
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          )}

          {/* 7b. Anniversary Countdown Section */}
          {sections.includes('anniversary_countdown') && (
            <AnniversaryCountdownSection
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          )}

          {/* Separator after Stats sections */}
          {(sections.includes('relationship_stats') || sections.includes('anniversary_countdown')) && (
            <SectionSeparator theme={theme} />
          )}

          {/* 8. Future Dreams Section - Alternating background */}
          {sections.includes('future_dreams') && (
            <FutureDreamsSection 
              theme={theme} 
              dreams={sectionContent?.future_dreams?.dreams}
              variant={sectionIndex++ % 2 === 1 ? 'alt' : 'default'}
            />
          )}

          {/* 9. Reasons I Love You Section - Alternating background */}
          {sections.includes('reasons_love_you') && (
            <ReasonsILoveYouSection
              theme={theme}
              partnerName={partnerName}
              reasons={sectionContent?.reasons_love_you?.reasons}
              variant={sectionIndex++ % 2 === 1 ? 'alt' : 'default'}
            />
          )}

          {/* 10. Quotes Section - Alternating background */}
          {sections.includes('quotes') && (
            <QuotesSection 
              theme={theme} 
              quotes={sectionContent?.quotes?.quotes}
              variant={sectionIndex++ % 2 === 1 ? 'alt' : 'default'}
            />
          )}

          {/* 11. Guest Messages Section - Alternating background */}
          {sections.includes('guest_messages') && (
            <GuestMessagesSection 
              theme={theme} 
              messages={sectionContent?.guest_messages?.messages}
              variant={sectionIndex++ % 2 === 1 ? 'alt' : 'default'}
            />
          )}

          {/* 12. Memory Map Section */}
{/* MemoryMap disabled for PHASE 2 SSR fix {sections.includes('memory_map') && (
            <MemoryMapSection 
              theme={theme} 
              locations={sectionContent?.memory_map?.locations}
            />
          )} */}

          {/* 13. Letter to Future Section */}
          {sections.includes('letter_future') && (
            <LetterToFutureSection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              letter={sectionContent?.letter_future?.letter}
              openDate={sectionContent?.letter_future?.openDate}
            />
          )}

          {/* 14. Gift Section */}
          {sections.includes('gift_section') && (
            <GiftSection
              theme={theme}
              partnerName={partnerName}
              gifts={sectionContent?.gift_section?.gifts}
            />
          )}

          {/* 15. Surprise Message Section */}
          {sections.includes('surprise_message') && (
            <SurpriseMessageSection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              message={sectionContent?.surprise_message?.message}
              hint={sectionContent?.surprise_message?.hint}
            />
          )}

          {/* 16. Memory Card Section - Premium Keepsake - Only render if qr_keepsake is enabled */}
          {/* Backward compatibility: if sections array is missing, check for qrCodeUrl */}
          {(() => {
            const isQrKeepsakeEnabled = Array.isArray(sections) && sections.includes('qr_keepsake');
            const hasQrCode = !!qrCodeUrl;
            const isLegacyWebsite = !Array.isArray(sections);
            
            // Show if: (qr_keepsake section is enabled) OR (legacy website with qrCodeUrl)
            if (isQrKeepsakeEnabled || (isLegacyWebsite && hasQrCode)) {
              return (
                <MemoryCardSection
                  theme={theme}
                  customerName={customerName}
                  partnerName={partnerName}
                  qrCodeUrl={qrCodeUrl}
                  qrDataUrl={qrDataUrl}
                  slug={slug}
                />
              );
            }
            return null;
          })()}

          {/* 17. Footer */}
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
  };

  // Show romantic opening if it's the first visit
  if (showOpening) {
    return (
      <>
        {/* Romantic Opening Screen */}
        <RomanticOpening 
          theme={theme}
          tagline={tagline}
          onReveal={handleReveal} 
        />
        
        {/* Main content (hidden during opening) */}
        <div 
          className={`main-content-wrapper ${isRevealing ? 'hidden' : ''}`}
          style={{ 
            opacity: isRevealing ? 0 : 1,
            transition: 'opacity 0.8s ease-out'
          }}
        >
          {renderMainContent()}
        </div>
      </>
    );
  }

  // Normal rendering (opening was skipped or completed)
  return renderMainContent();
}

