'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { HomeTemplate, GalleryTemplate, TimelineTemplate, TimelineEvent, SectionContentMap, GalleryLayout, Section, GuestMessage, GuestMessageRecord, OccasionType } from '@/lib/types';
import { ThemeKey } from '@/config/themeConfig';
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
import SectionHeader from './SectionHeader';
import LoveLetterSection from '../sections/couple/LoveLetterSection';
import BackToTop from '../ui/BackToTop';
import MemoryCardSection from '../sections/shared/MemoryCardSection';
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
import WeddingCountdownSection from '../sections/shared/WeddingCountdownSection';
import GiftRegistrySection from '../sections/shared/GiftRegistrySection';
import { OccasionProvider } from './OccasionContext';

// Import backward compatibility helpers
import {
  convertToTimelineEvents,
  getGalleryLayout,
  sortSectionsByDisplayOrder
} from '@/lib/section-migration';
import { resolveSectionAlias } from '@/lib/section-aliases';
import { resolveParticipantNames } from '@/lib/site-type-utils';

// Import section layouts and separators
import { SectionSeparator, GradientSeparator, DotsSeparator } from './SectionLayouts';

type Props = {
  theme: ThemeKey;
  siteType?: OccasionType;
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

export default function ClientPage({
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
  const resolvedNames = resolveParticipantNames(siteType, config?.participants || [], customerName, partnerName);
  const resolvedCustomerName = resolvedNames.primaryName;
  const resolvedPartnerName = resolvedNames.secondaryName;

  // Visual progress + transition state
  const [scrollProgress, setScrollProgress] = useState(0);

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
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const progress = (scrollY / Math.max(docHeight - winHeight, 1)) * 100;
      setScrollProgress(Math.max(0, Math.min(progress, 100)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      const resolvedSection = resolveSectionAlias(section);
      const rawSectionContent = (sectionContent as Record<string, any> | undefined)?.[section];
      const resolvedSectionContent = (sectionContent as Record<string, any> | undefined)?.[resolvedSection];
      const contentForSection = rawSectionContent || resolvedSectionContent;

      switch (resolvedSection) {
        case 'home':
          return null; // Home is rendered above

        case 'love_letter':
          if (!message && !contentForSection?.content) return null;
          return (
            <LoveLetterSection
              key={section}
              message={contentForSection?.content || message}
              theme={theme}
            />
          );

        case 'our_story':
          return (
            <OurStorySection
              key={section}
              theme={theme}
              customerName={resolvedCustomerName}
              partnerName={resolvedPartnerName}
              story={contentForSection?.content}
              variant={variant}
            />
          );

        case 'life_story':
        case 'travel_notes':
          return (
            <OurStorySection
              key={section}
              theme={theme}
              customerName={resolvedCustomerName}
              partnerName={resolvedPartnerName}
              story={contentForSection?.content}
              variant={variant}
            />
          );

        case 'timeline':
          if (!shouldShowTimeline) return null;
          return (
            <TimelineSection
              key={section}
              theme={theme}
              template={timelineTemplate}
              events={contentForSection?.events || contentForSection || mergedTimelineEvents}
              variant={variant}
              siteType={siteType}
            />
          );

        case 'wedding_timeline':
        case 'school_memories':
        case 'achievements':
        case 'travel_timeline':
          return (
            <TimelineSection
              key={section}
              theme={theme}
              template={timelineTemplate}
              events={contentForSection?.events || contentForSection || mergedTimelineEvents}
              variant={variant}
              siteType={siteType}
            />
          );

        case 'gallery':
          if (!shouldShowGallery) return null;
          return (
            <GallerySection
              key={section}
              theme={theme}
              template={effectiveGalleryLayout as any}
              photos={photos}
              coverPhotoIndex={coverPhotoIndex}
            />
          );

        case 'photo_highlights':
          return (
            <GallerySection
              key={section}
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
              key={section}
              theme={theme}
              songLink={contentForSection?.playlistUrl || sectionContent?.playlist?.playlistUrl || songLink}
            />
          );

        case 'video_memories':
          if (!activeSections.includes('video_memories')) return null;
          return (
            <VideoMemoriesSection
              key={section}
              theme={theme}
              videos={contentForSection?.videos || sectionContent?.video_memories?.videos}
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
          return (
            <AnniversaryCountdownSection
              key={section}
              theme={theme}
              anniversaryDate={anniversaryDate}
              variant={variant}
            />
          );

        case 'countdown':
          return (
            <AnniversaryCountdownSection
              key={section}
              theme={theme}
              anniversaryDate={anniversaryDate}
              variant={variant}
            />
          );

        case 'wedding_countdown':
          return (
            <WeddingCountdownSection
              key={section}
              theme={theme}
              weddingDate={anniversaryDate}
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
              message={(sectionContent as any)?.birthday_message?.content || sectionContent?.birthday_message?.text || message}
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
        case 'event_details':
          return (
            <PartyDetailsSection
              key={section}
              theme={theme}
              location={contentForSection?.location}
              date={contentForSection?.date}
              time={contentForSection?.time}
              dressCode={contentForSection?.dressCode}
            />
          );

        case 'gift_wishlist':
          return (
            <GiftWishlistSection
              key={section}
              theme={theme}
              items={contentForSection?.items || sectionContent?.gift_wishlist?.items}
            />
          );

        case 'gift_registry':
          return (
            <GiftRegistrySection
              key={section}
              theme={theme}
              items={contentForSection?.items || sectionContent?.gift_registry?.items || sectionContent?.gift_wishlist?.items}
            />
          );

        case 'future_dreams':
        case 'future_plans':
          return (
            <FutureDreamsSection
              key={section}
              theme={theme}
              dreams={contentForSection?.dreams || sectionContent?.future_dreams?.dreams}
              variant={variant}
            />
          );

        case 'reasons_love_you':
          return (
            <ReasonsILoveYouSection
              key="reasons_love_you"
              theme={theme}
              partnerName={resolvedPartnerName || resolvedCustomerName}
              reasons={sectionContent?.reasons_love_you?.reasons}
              variant={variant}
            />
          );

        case 'quotes':
        case 'baby_predictions':
        case 'tributes':
          return (
            <QuotesSection
              key={section}
              theme={theme}
              quotes={contentForSection?.quotes || sectionContent?.quotes?.quotes}
              variant={variant}
            />
          );

        case 'couple_message':
        case 'graduation_message':
        case 'parents_message':
        case 'celebrant_message':
        case 'family_message':
        case 'message_letter':
          return (
            <LoveLetterSection
              key={section}
              message={contentForSection?.content || contentForSection?.text || message}
              theme={theme}
            />
          );

        case 'guest_messages':
          return (
            <GuestMessagesSection
              key={section}
              theme={theme}
              siteType={siteType}
              messages={contentForSection?.messages || sectionContent?.guest_messages?.messages}
              approvedMessages={approvedGuestMessages}
              slug={slug}
              variant={variant}
            />
          );

        case 'rsvp':
          return (
            <>
              <section className={`py-10 ${variant === 'alt' ? styles.sectionBgAlt : styles.sectionBg}`} id="rsvp">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                  <SectionHeader
                    icon="💌"
                    title="RSVP"
                    subtitle="Let the couple know if you can attend"
                    theme={theme}
                  />
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className={`${styles.card} p-5 rounded-xl border ${styles.border}`}>
                      <h3 className={`text-sm font-semibold ${styles.textMuted} mb-1`}>Deadline</h3>
                      <p className={`text-base font-medium ${styles.text}`}>
                        {contentForSection?.deadline || sectionContent?.rsvp?.deadline || 'Please respond soon'}
                      </p>
                    </div>
                    <div className={`${styles.card} p-5 rounded-xl border ${styles.border}`}>
                      <h3 className={`text-sm font-semibold ${styles.textMuted} mb-1`}>Note</h3>
                      <p className={`text-base font-medium ${styles.text}`}>
                        {contentForSection?.note || sectionContent?.rsvp?.note || 'Please include your name and attendance details in your message.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <GuestMessagesSection
                key={section}
                theme={theme}
                siteType={siteType}
                messages={contentForSection?.messages || sectionContent?.rsvp?.messages || sectionContent?.guest_messages?.messages}
                approvedMessages={approvedGuestMessages}
                slug={slug}
                variant={variant}
              />
            </>
          );

        case 'memory_map':
          return (
            <MemoryMapSection
              key={section}
              theme={theme}
              siteType={siteType}
              locations={contentForSection?.locations || sectionContent?.memory_map?.locations}
            />
          );

        case 'letter_future':
          return (
            <LetterToFutureSection
              key={section}
              theme={theme}
              customerName={resolvedCustomerName}
              partnerName={resolvedPartnerName}
              letter={contentForSection?.letter || sectionContent?.letter_future?.letter}
              openDate={contentForSection?.openDate || sectionContent?.letter_future?.openDate}
            />
          );

        case 'gift_section':
          return (
            <GiftSection
              key={section}
              theme={theme}
              partnerName={resolvedPartnerName || resolvedCustomerName}
              gifts={contentForSection?.gifts || sectionContent?.gift_section?.gifts}
            />
          );

        case 'surprise_message':
          return (
            <SurpriseMessageSection
              key={section}
              theme={theme}
              customerName={resolvedCustomerName}
              partnerName={resolvedPartnerName}
              message={contentForSection?.message || sectionContent?.surprise_message?.message}
              hint={contentForSection?.hint || sectionContent?.surprise_message?.hint}
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
        <OccasionProvider siteType={siteType}>
          <div className="relative min-h-screen">
            <BackgroundDecorations theme={theme} siteType={siteType} />
            <div className="relative z-10">
            {/* Home Section - Hero */}
            {activeSections.includes('home') && (
              <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
                <div
                  className={`h-full ${styles.accentBg} transition-all duration-300 ease-out`}
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            )}

            {activeSections.includes('home') && (
              <HomeSection
                theme={theme}
                siteType={siteType}
                config={config}
                template={homeTemplate}
                customerName={resolvedCustomerName}
                partnerName={resolvedPartnerName}
                anniversaryDate={anniversaryDate}
                message={message}
                tagline={tagline}
                photos={photos}
                coverPhotoIndex={coverPhotoIndex}
                heroCoverPhotoUrl={heroCoverPhotoUrl}
              />
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

                const sectionWrapperClass = `${getSectionBgClass(theme, renderedSectionCount)} py-16 animate-fade-in-up section-snap`;
                const sectionAnimationDelay = Math.min(0.25 + renderedSectionCount * 0.08, 0.9);
                renderedNodes.push(
                  <div
                    key={`section-wrapper-${section}`}
                    className={sectionWrapperClass}
                    style={{ animationDelay: `${sectionAnimationDelay}s` }}
                  >
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
                      customerName={resolvedCustomerName}
                      partnerName={resolvedPartnerName}
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
              customerName={resolvedCustomerName}
              partnerName={resolvedPartnerName}
              qrCodeUrl={qrCodeUrl}
              qrDataUrl={qrDataUrl}
            />

            {/* Back to Top Button */}
            <BackToTop />
            </div>
          </div>
        </OccasionProvider>
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
          customerName={resolvedCustomerName}
          partnerName={resolvedPartnerName}
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

