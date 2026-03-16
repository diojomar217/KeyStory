'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, SectionContentMap, GalleryLayout, Section } from '@/lib/types';
import BackgroundDecorations from './BackgroundDecorations';
import ThemeWrapper from '../builder/ThemeWrapper';
import HomeSection from './HomeSection';
import { getAvailableSections } from '@/lib/section-registry';
import GallerySection from '../sections/shared/GallerySection';
import TimelineSection from '../sections/shared/TimelineSection';
import SongSection from '../sections/shared/SongSection';
import FooterSection from './FooterSection';
import LoveLetterSection from '../sections/couple/LoveLetterSection';
import BackToTop from '../ui/BackToTop';
import MemoryCardSection from '../ui/MemoryCardSection';
import RomanticOpening from './RomanticOpening';

// Import new section components
import QuotesSection from '../sections/couple/QuotesSection';
import OurStorySection from '../sections/couple/OurStorySection';
import MilestonesSection from '../sections/couple/MilestonesSection';
import FutureDreamsSection from '../sections/couple/FutureDreamsSection';
import VideoMemoriesSection from '../sections/shared/VideoMemoriesSection';
import RelationshipStatsSection from '../sections/couple/RelationshipStatsSection';
import AnniversaryCountdownSection from '../sections/shared/AnniversaryCountdownSection';
import PolaroidGallerySection from '../sections/shared/PolaroidGallerySection';
import FirstDateSection from '../sections/couple/FirstDateSection';
import SpecialMomentsSection from '../sections/couple/SpecialMomentsSection';
import ReasonsILoveYouSection from '../sections/couple/ReasonsILoveYouSection';
import MemoryMapSection from '../sections/shared/MemoryMapSection';
import GuestMessagesSection from '../sections/shared/GuestMessagesSection';
import LetterToFutureSection from '../sections/couple/LetterToFutureSection';
import GiftSection from '../sections/couple/GiftSection';
import SurpriseMessageSection from '../sections/couple/SurpriseMessageSection';
import PlaylistSection from '../sections/shared/PlaylistSection';

// Import backward compatibility helpers
import { 
  convertToTimelineEvents, 
  getGalleryLayout,
  sortSectionsByDisplayOrder 
} from '@/lib/section-migration';

// Import section layouts and separators
import { SectionSeparator } from './SectionLayouts';

type Props = {
  theme: Theme;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
  config?: any; // optional, new site config object (for footer and future sections)
  sections: Section[];
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
  songAutoplay?: boolean;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  timelineEvents: TimelineEvent[];
  sectionContent?: SectionContentMap;
  slug?: string;
};

export default function LovePageClient({
  theme,
  siteType = 'couple',
  config,
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
  songAutoplay = false,
  slug,
}: Props) {
  const isBirthday = siteType === 'birthday';

  // Romantic opening state
  const [showOpening, setShowOpening] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  // Use registry-based allowed sections to make site type rules data-driven
  const allowedSections = getAvailableSections(siteType);

  const effectiveSections = sections.filter((section) => allowedSections.includes(section));

  const activeSections = effectiveSections;

  // Determine if we need alternating backgrounds
  const hasGallery = activeSections.includes('gallery');
  const hasTimeline = activeSections.includes('timeline');
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
  const hasFirstDate = activeSections.includes('first_date');
  const hasSpecialMoments = activeSections.includes('special_moments');
  const hasMilestones = activeSections.includes('milestones');
  const hasPolaroidGallery = activeSections.includes('polaroid_gallery');
  
  // Show timeline if it's enabled OR if deprecated story sections exist
  const shouldShowTimeline = hasTimeline || hasFirstDate || hasSpecialMoments || hasMilestones;
  
  // Show gallery if it's enabled OR if polaroid_gallery exists (for backward compat)
  const shouldShowGallery = hasGallery || hasPolaroidGallery;

  // Main content rendering with alternating backgrounds
  const renderMainContent = () => {
    const getSectionVariant = (index: number) => {
      return index % 2 === 1 ? 'alt' : 'default';
    };

    const renderSection = (section: Section, index: number) => {
      const variant = getSectionVariant(index);

      switch (section) {
        case 'home':
          return null; // Home is rendered above

        case 'love_letter':
          // Love letter is controlled by section settings and message content
          if (!activeSections.includes('love_letter')) return null;
          if (!message && !sectionContent?.love_letter?.content) return null;
          return (
            <LoveLetterSection
              key="love_letter"
              message={sectionContent?.love_letter?.content || message}
              theme={theme}
            />
          );

        case 'our_story':
          return (
            <OurStorySection
              key="our_story"
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              story={sectionContent?.our_story?.content}
              variant={variant}
            />
          );

        case 'timeline':
          if (!shouldShowTimeline) return null;
          return (
            <TimelineSection
              key="timeline"
              theme={theme}
              template={timelineTemplate}
              events={mergedTimelineEvents}
            />
          );

        case 'gallery':
          if (!shouldShowGallery) return null;
          return (
            <GallerySection
              key="gallery"
              theme={theme}
              template={effectiveGalleryLayout as any}
              photos={photos}
              coverPhotoIndex={coverPhotoIndex}
            />
          );

        case 'song':
          if (!hasSong) return null;
          return (
            <SongSection
              key="song"
              theme={theme}
              songLink={songLink}
              autoplay={songAutoplay}
            />
          );

        case 'playlist':
          if (!activeSections.includes('playlist')) return null;
          return (
            <PlaylistSection
              key="playlist"
              theme={theme}
              songLink={sectionContent?.playlist?.playlistUrl || songLink}
            />
          );

        case 'video_memories':
          if (!activeSections.includes('video_memories')) return null;
          return (
            <VideoMemoriesSection
              key="video_memories"
              theme={theme}
              videos={sectionContent?.video_memories?.videos}
            />
          );

        case 'relationship_stats':
          if (!activeSections.includes('relationship_stats')) return null;
          return (
            <RelationshipStatsSection
              key="relationship_stats"
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          );

        case 'anniversary_countdown':
          if (!activeSections.includes('anniversary_countdown')) return null;
          return (
            <AnniversaryCountdownSection
              key="anniversary_countdown"
              theme={theme}
              anniversaryDate={anniversaryDate}
            />
          );

        case 'future_dreams':
          return (
            <FutureDreamsSection
              key="future_dreams"
              theme={theme}
              dreams={sectionContent?.future_dreams?.dreams}
              variant={variant}
            />
          );

        case 'reasons_love_you':
          return (
            <ReasonsILoveYouSection
              key="reasons_love_you"
              theme={theme}
              partnerName={partnerName}
              reasons={sectionContent?.reasons_love_you?.reasons}
              variant={variant}
            />
          );

        case 'quotes':
          return (
            <QuotesSection
              key="quotes"
              theme={theme}
              quotes={sectionContent?.quotes?.quotes}
              variant={variant}
            />
          );

        case 'guest_messages':
          return (
            <GuestMessagesSection
              key="guest_messages"
              theme={theme}
              siteType={siteType}
              messages={sectionContent?.guest_messages?.messages}
              variant={variant}
            />
          );

        case 'memory_map':
          return (
            <MemoryMapSection
              key="memory_map"
              theme={theme}
              locations={sectionContent?.memory_map?.locations}
            />
          );

        case 'letter_future':
          return (
            <LetterToFutureSection
              key="letter_future"
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              letter={sectionContent?.letter_future?.letter}
              openDate={sectionContent?.letter_future?.openDate}
            />
          );

        case 'gift_section':
          return (
            <GiftSection
              key="gift_section"
              theme={theme}
              partnerName={partnerName}
              gifts={sectionContent?.gift_section?.gifts}
            />
          );

        case 'surprise_message':
          return (
            <SurpriseMessageSection
              key="surprise_message"
              theme={theme}
              customerName={customerName}
              partnerName={partnerName}
              message={sectionContent?.surprise_message?.message}
              hint={sectionContent?.surprise_message?.hint}
            />
          );

        default:
          return null;
      }
    };

    const remainingSections = activeSections.filter((section) => section !== 'home');

    return (
      <ThemeWrapper theme={theme}>
        <div className="relative min-h-screen">
          <BackgroundDecorations theme={theme} siteType={siteType} />
          <div className="relative z-10">
            {/* Home Section - Hero */}
            {activeSections.includes('home') && (
              <HomeSection
                theme={theme}
                siteType={siteType}
                config={config}
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

            {/* Render remaining sections in selected order */}
            {remainingSections.map((section, index) => renderSection(section, index))}

          {/* 16. Memory Card Section - Premium Keepsake - Only render if qr_keepsake is enabled */}
          {/* Backward compatibility: if sections array is missing, check for qrCodeUrl */}
          {(() => {
            const isQrKeepsakeEnabled = Array.isArray(sections) && activeSections.includes('qr_keepsake');
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
            siteType={siteType}
            config={config}
            customerName={customerName}
            partnerName={partnerName}
            qrCodeUrl={qrCodeUrl}
            qrDataUrl={qrDataUrl}
          />

          {/* Back to Top Button */}
          <BackToTop />
        </div>
      </div>
      </ThemeWrapper>
    );
  };

  // Show romantic opening if it's the first visit
  if (showOpening) {
    return (
      <>
        {/* Occasion-aware Opening Screen */}
        <RomanticOpening 
          theme={theme}
          siteType={siteType}
          customerName={customerName}
          partnerName={partnerName}
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

