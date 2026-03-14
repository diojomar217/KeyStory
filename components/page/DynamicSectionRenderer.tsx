'use client';

import React from 'react';
import { Section, Theme, SiteConfig, TimelineEvent } from '@/lib/types';

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

// ============================================
// PROPS INTERFACE
// ============================================

export interface DynamicSectionRendererProps {
  section: Section;
  config: SiteConfig;
  // Individual props for flexibility
  theme?: Theme;
  customerName?: string;
  partnerName?: string;
  anniversaryDate?: string;
  message?: string;
  tagline?: string;
  photos?: string[];
  coverPhotoIndex?: number;
  songLink?: string;
  timelineEvents?: TimelineEvent[];
}

// ============================================
// INTERNAL PROPS BUILDER
// ============================================

interface InternalConfig {
  theme: Theme;
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
  section_templates?: Record<string, string>;
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
  qr_keepsake: () => null, // QR is handled separately
};

// ============================================
// PROPS BUILDER FUNCTION
// ============================================

const buildProps = (section: Section, props: DynamicSectionRendererProps): Record<string, any> => {
  const { config, ...rest } = props;
  
  // Merge config with individual props (individual props take precedence)
  const mergedConfig: InternalConfig = {
    theme: props.theme || config.theme || 'romantic_classic',
    customerName: props.customerName || '',
    partnerName: props.partnerName || '',
    anniversaryDate: props.anniversaryDate || '',
    message: props.message || '',
    tagline: props.tagline || config.tagline,
    photos: props.photos || [],
    coverPhotoIndex: props.coverPhotoIndex ?? config.cover_photo_index,
    songLink: props.songLink || (config as any).song_link,
    song_link: (config as any).song_link,
    timelineEvents: props.timelineEvents || (config as any).timeline_events || [],
    timeline_events: (config as any).timeline_events || [],
    section_templates: config.section_templates,
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
      return {
        theme: mergedConfig.theme,
        template: getTemplate('gallery'),
        photos: mergedConfig.photos,
        coverPhotoIndex: mergedConfig.coverPhotoIndex,
      };

    case 'timeline':
      return {
        theme: mergedConfig.theme,
        template: getTemplate('timeline'),
        events: mergedConfig.timelineEvents || mergedConfig.timeline_events,
      };

    case 'song':
      // Only render if song link exists
      if (!mergedConfig.songLink && !mergedConfig.song_link) {
        return { _skip: true };
      }
      return {
        theme: mergedConfig.theme,
        songLink: mergedConfig.songLink || mergedConfig.song_link,
      };

    case 'love_letter':
      return {
        theme: mergedConfig.theme,
        message: mergedConfig.message,
      };

    case 'our_story':
    case 'first_date':
      return {
        theme: mergedConfig.theme,
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
      };

    case 'relationship_stats':
    case 'anniversary_countdown':
      return {
        theme: mergedConfig.theme,
        anniversaryDate: mergedConfig.anniversaryDate,
      };

    case 'reasons_love_you':
      return {
        theme: mergedConfig.theme,
        partnerName: mergedConfig.partnerName,
      };

    case 'letter_future':
    case 'gift_section':
    case 'surprise_message':
      return {
        theme: mergedConfig.theme,
        customerName: mergedConfig.customerName,
        partnerName: mergedConfig.partnerName,
      };

    case 'polaroid_gallery':
      return {
        theme: mergedConfig.theme,
        photos: mergedConfig.photos,
      };

    case 'playlist':
      return {
        theme: mergedConfig.theme,
        songLink: mergedConfig.songLink || mergedConfig.song_link,
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
  const sectionProps = { section, ...props };

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

