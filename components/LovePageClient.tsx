'use client';

import { useState, useEffect, useCallback } from 'react';
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
import MemoryMapSection from './sections/MemoryMapSection';
import GuestMessagesSection from './sections/GuestMessagesSection';
import LetterToFutureSection from './sections/LetterToFutureSection';
import GiftSection from './sections/GiftSection';
import SurpriseMessageSection from './sections/SurpriseMessageSection';
import PlaylistSection from './sections/PlaylistSection';

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

  // Main content rendering
  const renderMainContent = () => {
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

          {/* Our Story Section */}
          {sections.includes('our_story') && (
            <OurStorySection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
            />
          )}

          {/* First Date Section */}
          {sections.includes('first_date') && (
            <FirstDateSection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
            />
          )}

          {/* Special Moments Section */}
          {sections.includes('special_moments') && (
            <SpecialMomentsSection theme={theme} />
          )}

          {/* Timeline Section - Relationship story */}
          {hasTimeline && (
            <TimelineSection
              theme={theme}
              template={timelineTemplate}
              events={timelineEvents}
            />
          )}

          {/* Milestones Section */}
          {sections.includes('milestones') && (
            <MilestonesSection theme={theme} />
          )}

          {/* Gallery Section - Memories together */}
          {hasGallery && (
            <GallerySection
              theme={theme}
              template={galleryTemplate}
              photos={photos}
              coverPhotoIndex={coverPhotoIndex}
            />
          )}

          {/* Polaroid Gallery Section */}
          {sections.includes('polaroid_gallery') && (
            <PolaroidGallerySection
              theme={theme}
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

          {/* Playlist Section */}
          {sections.includes('playlist') && songLink && (
            <PlaylistSection
              theme={theme}
              songLink={songLink}
            />
          )}

          {/* Video Memories Section */}
          {sections.includes('video_memories') && (
            <VideoMemoriesSection theme={theme} />
          )}

          {/* Relationship Stats Section */}
          {sections.includes('relationship_stats') && (
            <RelationshipStatsSection
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          )}

          {/* Anniversary Countdown Section */}
          {sections.includes('anniversary_countdown') && (
            <AnniversaryCountdownSection
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          )}

          {/* Future Dreams Section */}
          {sections.includes('future_dreams') && (
            <FutureDreamsSection theme={theme} />
          )}

          {/* Quotes Section */}
          {sections.includes('quotes') && (
            <QuotesSection theme={theme} />
          )}

          {/* Reasons I Love You Section */}
          {sections.includes('reasons_love_you') && (
            <ReasonsILoveYouSection
              theme={theme}
              partnerName={partnerName}
            />
          )}

          {/* Memory Map Section */}
          {sections.includes('memory_map') && (
            <MemoryMapSection theme={theme} />
          )}

          {/* Guest Messages Section */}
          {sections.includes('guest_messages') && (
            <GuestMessagesSection theme={theme} />
          )}

          {/* Letter to Future Section */}
          {sections.includes('letter_future') && (
            <LetterToFutureSection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
            />
          )}

          {/* Gift Section */}
          {sections.includes('gift_section') && (
            <GiftSection
              theme={theme}
              partnerName={partnerName}
            />
          )}

          {/* Surprise Message Section */}
          {sections.includes('surprise_message') && (
            <SurpriseMessageSection
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
            />
          )}

          {/* Memory Card Section - Premium Keepsake */}
          <MemoryCardSection
            theme={theme}
            customerName={customerName}
            partnerName={partnerName}
            qrCodeUrl={qrCodeUrl}
            qrDataUrl={qrDataUrl}
            slug={slug}
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

