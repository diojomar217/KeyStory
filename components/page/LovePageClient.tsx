'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, SectionContentMap, GalleryLayout, Section, GuestMessage, GuestMessageRecord } from '@/lib/types';
import BackgroundDecorations from './BackgroundDecorations';
import ThemeWrapper, { useTheme } from '../builder/ThemeWrapper';
import { getSectionBgClass, getSectionVariant } from '@/lib/section-utils';
import PasswordGate from '../site/PasswordGate';
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
import BirthdayMessageSection from '../sections/birthday/BirthdayMessageSection';
import BirthdayWishesSection from '../sections/birthday/BirthdayWishesSection';
import BirthdayCountdownSection from '../sections/birthday/BirthdayCountdownSection';
import BirthdayTimelineSection from '../sections/birthday/BirthdayTimelineSection';
import PartyDetailsSection from '../sections/birthday/PartyDetailsSection';
import GiftWishlistSection from '../sections/birthday/GiftWishlistSection';

// Import backward compatibility helpers
import { 
  convertToTimelineEvents, 
  getGalleryLayout,
  sortSectionsByDisplayOrder 
} from '@/lib/section-migration';

// Import section layouts and separators
import { SectionSeparator, GradientSeparator, DotsSeparator } from './SectionLayouts';

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
  heroCoverPhotoUrl?: string | null;
  timelineEvents: TimelineEvent[];
  sectionContent?: SectionContentMap;
  slug?: string;
  approvedGuestMessages?: GuestMessageRecord[];
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
  heroCoverPhotoUrl,
  timelineEvents,
  sectionContent,
  approvedGuestMessages,
  songAutoplay = false,
  slug,
}: Props) {
  const isBirthday = siteType === 'birthday';

  // Romantic opening state
  const [showOpening, setShowOpening] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Theme styles for alternating section backgrounds
  const styles = useTheme(theme);

  // Use registry-based allowed sections to make site type rules data-driven
  const allowedSections = getAvailableSections(siteType);

  const effectiveSections = sections.filter((section) => allowedSections.includes(section));

  const activeSections = effectiveSections;

  // Determine if we need alternating backgrounds
  const hasGallery = activeSections.includes('gallery');
  const hasTimeline = activeSections.includes('timeline');
  const hasSong = !!songLink;

  const passwordEnabled = config?.password?.enabled === true;
  const passwordHash = config?.password?.hash;
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

  useEffect(() => {
    if (!passwordEnabled) {
      setIsUnlocked(true);
      return;
    }

    if (!slug || !passwordHash) {
      setIsUnlocked(false);
      return;
    }

    const storedUnlocked = typeof window !== 'undefined' ? window.localStorage.getItem(`unlocked_${slug}`) : null;
    const storedHash = typeof window !== 'undefined' ? window.localStorage.getItem(`unlocked_hash_${slug}`) : null;

    if (storedUnlocked === 'true' && storedHash === passwordHash) {
      setIsUnlocked(true);
    } else {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`unlocked_${slug}`);
        window.localStorage.removeItem(`unlocked_hash_${slug}`);
      }
      setIsUnlocked(false);
    }
  }, [slug, passwordEnabled, passwordHash]);

  useEffect(() => {
    if (!slug) return;

    if (typeof window === 'undefined') return;

    const sessionKey = `analytics_page_viewed_${slug}`;
    if (window.sessionStorage.getItem(sessionKey)) return;

    window.sessionStorage.setItem(sessionKey, 'true');
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, event_type: 'page_view', source: 'site' }),
    }).catch((err) => {
      console.warn('Analytics page_view tracking failed:', err);
    });
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

  // Section divider style configuration
  const sectionDividerStyle = (config?.section_divider_style as 'none' | 'standard' | 'gradient' | 'dots') || 'standard';

  const renderSectionSeparator = (
    prevVariant: 'default' | 'alt',
    nextVariant: 'default' | 'alt',
    key?: string
  ) => {
    if (sectionDividerStyle === 'none') return null;
    if (sectionDividerStyle === 'gradient') return <GradientSeparator key={key || 'section-sep'} theme={theme} />;
    if (sectionDividerStyle === 'dots') return <DotsSeparator key={key || 'section-sep'} theme={theme} />;
    return (
      <SectionSeparator
        key={key || 'section-sep'}
        theme={theme}
        prevVariant={prevVariant}
        nextVariant={nextVariant}
      />
    );
  };

  // Main content rendering with alternating backgrounds
  const renderMainContent = () => {
    const getSectionVariantLocal = getSectionVariant;

    const renderSection = (section: Section, index: number, variant: 'default' | 'alt') => {
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
              variant={variant}
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
              variant={variant}
            />
          );

        case 'birthday_countdown':
          if (!activeSections.includes('birthday_countdown')) return null;
          return (
            <BirthdayCountdownSection
              key="birthday_countdown"
              theme={theme}
              birthdayDate={anniversaryDate}
            />
          );

        case 'birthday_message':
          if (!activeSections.includes('birthday_message')) return null;
          return (
            <BirthdayMessageSection
              key="birthday_message"
              theme={theme}
              message={sectionContent?.birthday_message?.content || message}
            />
          );

        case 'birthday_wishes':
          if (!activeSections.includes('birthday_wishes')) return null;
          return (
            <BirthdayWishesSection
              key="birthday_wishes"
              theme={theme}
              wishes={
                (sectionContent?.birthday_wishes?.quotes || [])
                  .map((q: any) => (q?.text || '').trim())
                  .filter(Boolean)
              }
            />
          );

        case 'birthday_timeline':
          if (!activeSections.includes('birthday_timeline')) return null;
          return (
            <BirthdayTimelineSection
              key="birthday_timeline"
              theme={theme}
              template={timelineTemplate}
              events={mergedTimelineEvents}
            />
          );

        case 'party_details':
          if (!activeSections.includes('party_details')) return null;
          return (
            <PartyDetailsSection
              key="party_details"
              theme={theme}
              location={sectionContent?.party_details?.location}
              date={sectionContent?.party_details?.date}
              time={sectionContent?.party_details?.time}
              dressCode={sectionContent?.party_details?.dressCode}
            />
          );

        case 'gift_wishlist':
          if (!activeSections.includes('gift_wishlist')) return null;
          return (
            <GiftWishlistSection
              key="gift_wishlist"
              theme={theme}
              items={sectionContent?.gift_wishlist?.items}
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
              approvedMessages={approvedGuestMessages}
              slug={slug}
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

    if (passwordEnabled && !isUnlocked) {
      return <PasswordGate slug={slug || ''} passwordHash={passwordHash} onUnlock={() => setIsUnlocked(true)} />;
    }

    return (
      <ThemeWrapper theme={theme}>
        <div className="relative min-h-screen">
          <BackgroundDecorations theme={theme} siteType={siteType} />
          <div className="relative z-10">
            {/* Home Section - Hero */}
            {activeSections.includes('home') && (
              <div className={getSectionBgClass(theme, 0)}>
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
                  heroCoverPhotoUrl={heroCoverPhotoUrl}
                />
              </div>
            )}

            {/* Render remaining sections in selected order (with separators only between rendered sections) */}
            {(() => {
              const renderedNodes: React.ReactNode[] = [];
              let renderedSectionCount = 0;

              remainingSections.forEach((section) => {
                const variant = getSectionVariantLocal(renderedSectionCount);
                const sectionNode = renderSection(section, renderedSectionCount, variant);
                if (!sectionNode) return;

                // Add separator before new section only when previous section exists
                if (renderedSectionCount > 0) {
                  const prevVariant = getSectionVariantLocal(renderedSectionCount - 1);
                  renderedNodes.push(renderSectionSeparator(prevVariant, variant, `separator-${section}`));
                }

                const sectionWrapperClass = `${getSectionBgClass(theme, renderedSectionCount)} py-16`;
                renderedNodes.push(
                  <div key={`section-wrapper-${section}`} className={sectionWrapperClass}>
                    {sectionNode}
                  </div>
                );

                renderedSectionCount += 1;
              });

              return renderedNodes;
            })()}

          {/* 16. Memory Card Section - Premium Keepsake - Only render if qr_keepsake is enabled */}
          {/* Backward compatibility: if sections array is missing, check for qrCodeUrl */}
          {(() => {
            const isQrKeepsakeEnabled = Array.isArray(sections) && activeSections.includes('qr_keepsake');
            const hasQrCode = !!qrCodeUrl;
            const isLegacyWebsite = !Array.isArray(sections);
            
            // Show if: (qr_keepsake section is enabled) OR (legacy website with qrCodeUrl)
            if (isQrKeepsakeEnabled || (isLegacyWebsite && hasQrCode)) {
              return (
                <div className={`${getSectionBgClass(theme, 0)} py-16`}>
                  <MemoryCardSection
                    theme={theme}
                    customerName={customerName}
                    partnerName={partnerName}
                    qrCodeUrl={qrCodeUrl}
                    qrDataUrl={qrDataUrl}
                    slug={slug}
                  />
                </div>
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

