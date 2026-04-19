'use client';

import React from 'react';
import { Section, SiteConfig, TimelineEvent } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';

import { DEFAULT_THEME } from '@/config/defaults';

// Import section components for direct rendering
import HomeSection from '@/components/page/HomeSection';
import GallerySection from '@/components/sections/shared/GallerySection';
import TimelineSection from '@/components/sections/shared/TimelineSection';
import SongSection from '@/components/sections/shared/SongSection';
import LoveLetterSection from '@/components/sections/couple/LoveLetterSection';
import QuotesSection from '@/components/sections/couple/QuotesSection';
import OurStorySection from '@/components/sections/couple/OurStorySection';
import MilestonesSection from '@/components/sections/couple/MilestonesSection';
import FutureDreamsSection from '@/components/sections/couple/FutureDreamsSection';
import VideoMemoriesSection from '@/components/sections/shared/VideoMemoriesSection';
import RelationshipStatsSection from '@/components/sections/couple/RelationshipStatsSection';
import AnniversaryCountdownSection from '@/components/sections/shared/AnniversaryCountdownSection';
import PolaroidGallerySection from '@/components/sections/shared/PolaroidGallerySection';
import FirstDateSection from '@/components/sections/couple/FirstDateSection';
import SpecialMomentsSection from '@/components/sections/couple/SpecialMomentsSection';
import ReasonsILoveYouSection from '@/components/sections/couple/ReasonsILoveYouSection';
import MemoryMapSection from '@/components/sections/shared/MemoryMapSection';
import GuestMessagesSection from '@/components/sections/shared/GuestMessagesSection';
import LetterToFutureSection from '@/components/sections/couple/LetterToFutureSection';
import GiftSection from '@/components/sections/couple/GiftSection';
import SurpriseMessageSection from '@/components/sections/couple/SurpriseMessageSection';
import PlaylistSection from '@/components/sections/shared/PlaylistSection';
import InvitationSection from '@/components/sections/baptism/InvitationSection';
import ScheduleSection from '@/components/sections/baptism/ScheduleSection';
import DressCodeSection from '@/components/sections/baptism/DressCodeSection';
import RSVPSection from '@/components/sections/baptism/RSVPSection';
import MapSection from '@/components/sections/baptism/MapSection';
import EventDetailsSection from '@/components/sections/baptism/EventDetailsSection';
import GiftIdeasSection from '@/components/sections/shared/GiftIdeasSection';
import SafetyProtocolSection from '@/components/sections/shared/SafetyProtocolSection';

// ============================================
// PROPS INTERFACE
// ============================================

export interface DynamicSectionRendererProps {
  section: Section;
  config: SiteConfig;
  // Individual props for flexibility
  theme?: ThemeKey;
  customerName?: string;
  partnerName?: string;
  anniversaryDate?: string;
  message?: string;
  tagline?: string;
  photos?: string[];
  coverPhotoIndex?: number;
  songLink?: string;
  timelineEvents?: TimelineEvent[];
  songAutoplay?: boolean;
}

// ============================================
// INTERNAL PROPS BUILDER
// ============================================

interface InternalConfig {
  siteType: SiteConfig['occasion'];
  theme: ThemeKey;
  customerName: string;
  partnerName: string;
  anniversaryDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
  songLink?: string;
  song_link?: string;
  timelineEvents: TimelineEvent[];
  timeline_events?: TimelineEvent[];
  songAutoplay?: boolean;
  song_autoplay?: boolean;
  section_templates?: Record<string, string>;
  section_content?: import('@/lib/types').SectionContentMap;
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  song_template?: string;
}

// ============================================
// RENDERER COMPONENT MAP
// ============================================

const RENDERER_COMPONENTS: Record<Section, React.ComponentType<any>> = {
  home: HomeSection,
  gallery: GallerySection,
  timeline: TimelineSection,
  song: SongSection,
  love_letter: LoveLetterSection,
  our_story: OurStorySection,
  first_date: FirstDateSection,
  special_moments: SpecialMomentsSection,
  milestones: MilestonesSection,
  polaroid_gallery: PolaroidGallerySection,
  playlist: PlaylistSection,
  video_memories: VideoMemoriesSection,
  relationship_stats: RelationshipStatsSection,
  anniversary_countdown: AnniversaryCountdownSection,
  future_dreams: FutureDreamsSection,
  quotes: QuotesSection,
  reasons_love_you: ReasonsILoveYouSection,
  memory_map: MemoryMapSection,
  guest_messages: GuestMessagesSection,
  letter_future: LetterToFutureSection,
  gift_section: GiftSection,
  surprise_message: SurpriseMessageSection,
  birthday_message: LoveLetterSection,
  birthday_wishes: QuotesSection,
  birthday_countdown: AnniversaryCountdownSection,
  birthday_timeline: TimelineSection,
  party_details: OurStorySection,
  gift_wishlist: GiftSection,
  gift_ideas: GiftIdeasSection,
  wedding_countdown: AnniversaryCountdownSection,
  event_details: OurStorySection,
  wedding_timeline: TimelineSection,
  gift_registry: GiftSection,
  rsvp: RSVPSection,
  invitation: InvitationSection,
  schedule: ScheduleSection,
  dress_code: DressCodeSection,
  map_section: MapSection,
  safety_protocol: SafetyProtocolSection,
  closing: LoveLetterSection,
  couple_message: LoveLetterSection,
  graduation_message: LoveLetterSection,
  countdown: AnniversaryCountdownSection,
  school_memories: TimelineSection,
  achievements: TimelineSection,
  future_plans: FutureDreamsSection,
  baby_predictions: QuotesSection,
  parents_message: LoveLetterSection,
  photo_highlights: GallerySection,
  celebrant_message: LoveLetterSection,
  life_story: OurStorySection,
  tributes: QuotesSection,
  family_message: LoveLetterSection,
  travel_timeline: TimelineSection,
  travel_notes: OurStorySection,
  message_letter: LoveLetterSection,
  qr_keepsake: () => null, // QR is handled separately
};

// ============================================
// PROPS BUILDER FUNCTION
// ============================================

const buildProps = (section: Section, props: DynamicSectionRendererProps): Record<string, any> => {
  const { config, ...rest } = props;
  const primaryParticipant = config.participants?.[0]?.name || '';
  const secondaryParticipant = config.participants?.[1]?.name || '';
  const sectionContent = (config.section_content || {}) as Record<string, any>;
  
  // Merge config with individual props (individual props take precedence)
  const mergedConfig: InternalConfig = {
    siteType: config.occasion,
    theme: (props.theme as ThemeKey) || (config.theme as ThemeKey) || (DEFAULT_THEME as ThemeKey),
    customerName: props.customerName || primaryParticipant,
    partnerName: props.partnerName || secondaryParticipant,
    anniversaryDate: props.anniversaryDate || config.specialDate || '',
    message: props.message || config.message || '',
    tagline: props.tagline || config.tagline,
    photos: (() => {
      if (Array.isArray(props.photos) && props.photos.length > 0) return props.photos;
      if (Array.isArray(config?.media?.photos) && config.media.photos.length > 0) return config.media.photos;
      if (Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0) return config.section_content.gallery.photos;
      if (Array.isArray((config as any)?.photos) && (config as any).photos.length > 0) return (config as any).photos;
      return [];
    })(),
    coverPhotoIndex: props.coverPhotoIndex ?? config.cover_photo_index,
    songLink: props.songLink || (config as any).song_link,
    song_link: (config as any).song_link,
    timelineEvents: props.timelineEvents || (config as any).timeline_events || [],
    timeline_events: (config as any).timeline_events || [],
    songAutoplay: (props.songAutoplay !== undefined ? props.songAutoplay : (config as any).media?.song_autoplay) || false,
    section_templates: config.section_templates,
    section_content: config.section_content,
    home_template: config.home_template,
    gallery_template: config.gallery_template,
    timeline_template: config.timeline_template,
    song_template: config.song_template,
    ...rest,
  };

  // Get template from config (supports both old and new formats)
  const getTemplate = (sectionKey: string): string => {
    // Try new format first
    if (mergedConfig.section_templates?.[sectionKey]) {
      return mergedConfig.section_templates[sectionKey];
    }
    // Fall back to old format
    switch (sectionKey) {
      case 'home':
        return mergedConfig.home_template || 'hero_centered';
      case 'gallery':
        return mergedConfig.gallery_template || 'grid';
      case 'timeline':
        return mergedConfig.timeline_template || 'vertical_timeline';
      case 'song':
        return mergedConfig.song_template || 'minimal_player';
      default:
        return mergedConfig.section_templates?.[sectionKey] || 'default';
    }
  };

  // Build section-specific props
  switch (section) {
    case 'home':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        config,
        template: getTemplate('home'),
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
        anniversaryDate: mergedConfig.anniversaryDate,
        message: mergedConfig.message,
        tagline: mergedConfig.tagline,
        photos: mergedConfig.photos,
        coverPhotoIndex: mergedConfig.coverPhotoIndex,
      };

    case 'gallery':
    case 'photo_highlights':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        template: getTemplate('gallery'),
        photos: mergedConfig.photos,
        coverPhotoIndex: mergedConfig.coverPhotoIndex,
      };

    case 'timeline':
    case 'birthday_timeline':
    case 'wedding_timeline':
    case 'school_memories':
    case 'achievements':
    case 'travel_timeline':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        template: getTemplate('timeline'),
        events: sectionContent[section]?.events || mergedConfig.timelineEvents || mergedConfig.section_content?.timeline,
      };

    case 'song':
      // Only render if song link exists
      if (!mergedConfig.songLink && !mergedConfig.song_link) {
        return { _skip: true };
      }
      return {
        theme: mergedConfig.theme,
        songLink: mergedConfig.songLink || mergedConfig.song_link,
        autoplay: mergedConfig.songAutoplay || mergedConfig.song_autoplay || false,
      };

    case 'love_letter':
    case 'birthday_message':
    case 'couple_message':
    case 'graduation_message':
    case 'parents_message':
    case 'celebrant_message':
    case 'family_message':
    case 'message_letter':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        message: sectionContent[section]?.content || sectionContent[section]?.text || mergedConfig.message,
      };

    case 'our_story':
    case 'first_date':
    case 'life_story':
    case 'travel_notes':
    case 'party_details':
    case 'event_details':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
        story: sectionContent[section]?.content || sectionContent[section]?.story,
      };

    case 'relationship_stats':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        anniversaryDate: mergedConfig.anniversaryDate,
      };

    case 'anniversary_countdown':
    case 'countdown':
    case 'birthday_countdown':
    case 'wedding_countdown':
      return {
        theme: mergedConfig.theme,
        anniversaryDate: mergedConfig.anniversaryDate,
      };

    case 'future_dreams':
    case 'future_plans':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        dreams: sectionContent[section]?.dreams || sectionContent.future_dreams?.dreams,
      };

    case 'quotes':
    case 'baby_predictions':
    case 'tributes':
    case 'birthday_wishes':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        quotes: sectionContent[section]?.quotes || sectionContent.quotes?.quotes,
      };

    case 'reasons_love_you':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        partnerName: mergedConfig.partnerName,
        reasons: sectionContent.reasons_love_you?.reasons,
      };

    case 'letter_future':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
        letter: sectionContent.letter_future?.letter,
        openDate: sectionContent.letter_future?.openDate,
      };

    case 'gift_section':
    case 'gift_wishlist':
    case 'gift_registry':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        partnerName: mergedConfig.partnerName || mergedConfig.customerName,
        gifts: sectionContent[section]?.gifts || sectionContent[section]?.items,
        items: sectionContent[section]?.items,
      };

    case 'surprise_message':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
        message: sectionContent.surprise_message?.message,
        hint: sectionContent.surprise_message?.hint,
      };

    case 'polaroid_gallery':
      return {
        theme: mergedConfig.theme,
        photos: mergedConfig.photos,
      };

    case 'playlist':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        autoplay: mergedConfig.songAutoplay || mergedConfig.song_autoplay || false,
        songLink: mergedConfig.songLink || mergedConfig.song_link,
      };

    case 'memory_map':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        locations: sectionContent.memory_map?.locations,
      };

    case 'guest_messages':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        messages: sectionContent[section]?.messages || sectionContent.guest_messages?.messages,
      };

    case 'rsvp':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        rsvpEnabled: sectionContent.rsvp?.enabled ?? true,
      };

    case 'invitation':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        invitationMessage: sectionContent.invitation?.invitationMessage || sectionContent.invitation?.text || mergedConfig.message,
        godparentMessage: sectionContent.invitation?.godparentMessage || '',
      };

    case 'schedule':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        schedule: sectionContent.schedule?.schedule || [],
      };

    case 'dress_code':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        dressCode: sectionContent.dress_code?.dressCode || '',
        themeColor: sectionContent.dress_code?.themeColor || (mergedConfig as any).themeColor || undefined,
      };

    case 'map_section':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        mapLink: sectionContent.map_section?.mapLink || '',
      };

    case 'closing':
      return {
        theme: mergedConfig.theme,
        siteType: mergedConfig.siteType,
        message: sectionContent.closing?.closingMessage || mergedConfig.message,
      };

    // Sections with no special props
    default:
      return {
        theme: mergedConfig.theme,
      };
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DynamicSectionRenderer({ section, ...props }: DynamicSectionRendererProps) {
  // Get the renderer component
  const Renderer = RENDERER_COMPONENTS[section];
  
  // If no renderer found, return null
  if (!Renderer) {
    console.warn(`No renderer found for section: ${section}`);
    return null;
  }

  // Special case: song section needs song link
  if (section === 'song') {
    const songLink = props.songLink || (props.config as any).song_link;
    if (!songLink) {
      return null;
    }
  }

  // Build props for this section
  const sectionProps = buildProps(section, { section, ...props });

  // Don't render if _skip flag is set (e.g., missing required data)
  if (sectionProps && (sectionProps as any)._skip) {
    return null;
  }

  // Render the section
  return <Renderer {...sectionProps} />;
}

// ============================================
// EXPORT HELPER FOR BATCH RENDERING
// ============================================

/**
 * Render multiple sections dynamically
 */
export function DynamicSectionRendererList({
  sections,
  config,
  ...rest
}: {
  sections: Section[];
  config: SiteConfig;
} & Omit<DynamicSectionRendererProps, 'section' | 'config'>) {
  return (
    <>
      {sections.map((section) => (
        <DynamicSectionRenderer
          key={section}
          section={section}
          config={config}
          {...rest}
        />
      ))}
    </>
  );
}

