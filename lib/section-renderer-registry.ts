// lib/section-renderer-registry.ts
// ============================================
// SECTION RENDERER REGISTRY - Maps sections to their renderer components
// ============================================
// This file provides the connection between section registry and actual
// React components that render each section.

import type { TimelineEvent, Participant } from './types';
import type { ThemeKey } from '@/config/themeConfig';
import { Section } from './types';

// Import shared sections
import HomeSection from '@/components/page/HomeSection';
import GallerySection from '@/components/sections/shared/GallerySection';
import TimelineSection from '@/components/sections/shared/TimelineSection';
import SongSection from '@/components/sections/shared/SongSection';
import AnniversaryCountdownSection from '@/components/sections/shared/AnniversaryCountdownSection';
import PolaroidGallerySection from '@/components/sections/shared/PolaroidGallerySection';
import MemoryMapSection from '@/components/sections/shared/MemoryMapSection';
import GuestMessagesSection from '@/components/sections/shared/GuestMessagesSection';
import VideoMemoriesSection from '@/components/sections/shared/VideoMemoriesSection';
import PlaylistSection from '@/components/sections/shared/PlaylistSection';
import SafetyProtocolSection from '@/components/sections/shared/SafetyProtocolSection';
// Baptism-specific sections
import InvitationSection from '@/components/sections/baptism/InvitationSection';
import EventDetailsSection from '@/components/sections/baptism/EventDetailsSection';
import ScheduleSection from '@/components/sections/baptism/ScheduleSection';
import DressCodeSection from '@/components/sections/baptism/DressCodeSection';
import RSVPSection from '@/components/sections/baptism/RSVPSection';
import MapSection from '@/components/sections/baptism/MapSection';

// Import couple-specific sections
import LoveLetterSection from '@/components/sections/couple/LoveLetterSection';
import QuotesSection from '@/components/sections/couple/QuotesSection';
import OurStorySection from '@/components/sections/couple/OurStorySection';
import ReasonsILoveYouSection from '@/components/sections/couple/ReasonsILoveYouSection';
import FirstDateSection from '@/components/sections/couple/FirstDateSection';
import SpecialMomentsSection from '@/components/sections/couple/SpecialMomentsSection';
import MilestonesSection from '@/components/sections/couple/MilestonesSection';
import RelationshipStatsSection from '@/components/sections/couple/RelationshipStatsSection';
import FutureDreamsSection from '@/components/sections/couple/FutureDreamsSection';
import LetterToFutureSection from '@/components/sections/couple/LetterToFutureSection';
import GiftSection from '@/components/sections/couple/GiftSection';
import SurpriseMessageSection from '@/components/sections/couple/SurpriseMessageSection';

// Birthday-specific sections
import BirthdayMessageSection from '@/components/sections/birthday/BirthdayMessageSection';
import BirthdayWishesSection from '@/components/sections/birthday/BirthdayWishesSection';
import BirthdayCountdownSection from '@/components/sections/birthday/BirthdayCountdownSection';
import BirthdayTimelineSection from '@/components/sections/birthday/BirthdayTimelineSection';
import PartyDetailsSection from '@/components/sections/birthday/PartyDetailsSection';
import GiftWishlistSection from '@/components/sections/birthday/GiftWishlistSection';
import GiftIdeasSection from '@/components/sections/shared/GiftIdeasSection';

// ============================================
// SECTION RENDERER PROPS - Base interface for all section renderers
// ============================================

export interface BaseSectionProps {
  theme: ThemeKey;
}

export interface HomeSectionProps extends BaseSectionProps {
  template: string;
  participants: Participant[];
  specialDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
}

export interface GallerySectionProps extends BaseSectionProps {
  template: string;
  photos: string[];
  coverPhotoIndex?: number;
}

export interface TimelineSectionProps extends BaseSectionProps {
  template: string;
  events: TimelineEvent[];
}

export interface SongSectionProps extends BaseSectionProps {
  songLink: string;
}

export interface LoveLetterSectionProps extends BaseSectionProps {
  message: string;
}

export interface PartnerNameProps extends BaseSectionProps {
  partnerName: string;
}

export interface AnniversaryDateProps extends BaseSectionProps {
  anniversaryDate: string;
}

// ============================================
// SECTION RENDERER MAP
// ============================================

/**
 * Maps section keys to their renderer components and props builders
 */
export const SECTION_RENDERERS: Record<Section, {
  component: React.ComponentType<any>;
  getProps: (config: Record<string, any>) => Record<string, any>;
}> = {
home: {
    component: HomeSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.home || config.home_template || 'hero_centered',
      customerName: config.customerName || '',
      partnerName: config.partnerName || '',
      anniversaryDate: config.anniversaryDate || config.specialDate || '',
      message: config.message,
      tagline: config.tagline,
      photos: Array.isArray(config?.media?.photos) && config.media.photos.length > 0
        ? config.media.photos
        : Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0
          ? config.section_content.gallery.photos
          : config.photos || [],
      coverPhotoIndex: config.coverPhotoIndex,
    }),
  },
  
  gallery: {
    component: GallerySection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.gallery || config.gallery_template || 'grid',
      photos: Array.isArray(config?.media?.photos) && config.media.photos.length > 0
        ? config.media.photos
        : Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0
          ? config.section_content.gallery.photos
          : config.photos || [],
      coverPhotoIndex: config.coverPhotoIndex,
    }),
  },
  
  timeline: {
    component: TimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.timelineEvents || config.section_content?.timeline || [],
    }),
  },
  
  song: {
    component: SongSection,
    getProps: (config) => ({
      theme: config.theme,
      songLink: config.songLink || config.song_link || '',
      autoplay: config.songAutoplay || config.song_autoplay || false,
    }),
  },
  
  love_letter: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.message,
    }),
  },
  
  // Content sections
  our_story: {
    component: OurStorySection,
    getProps: (config) => ({
      theme: config.theme,
      participants: [{name: config.customerName || ''}, {name: config.partnerName || '', role: 'partner'}],
    }),
  },
  
  first_date: {
    component: FirstDateSection,
    getProps: (config) => ({
      theme: config.theme,
      customerName: config.customerName,
      partnerName: config.partnerName,
    }),
  },
  
  special_moments: {
    component: SpecialMomentsSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  milestones: {
    component: MilestonesSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  // Photo sections
  polaroid_gallery: {
    component: PolaroidGallerySection,
    getProps: (config) => ({
      theme: config.theme,
      photos: Array.isArray(config?.media?.photos) && config.media.photos.length > 0
        ? config.media.photos
        : Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0
          ? config.section_content.gallery.photos
          : config.photos || [],
    }),
  },
  
  // Music & Video
  playlist: {
    component: PlaylistSection,
    getProps: (config) => ({
      theme: config.theme,
      siteType: config.siteType,
      autoplay: config.songAutoplay || config.song_autoplay || false,
      songLink: config.songLink || config.song_link || '',
    }),
  },
  
  video_memories: {
    component: VideoMemoriesSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  // Stats & Counters
  relationship_stats: {
    component: RelationshipStatsSection,
    getProps: (config) => ({
      theme: config.theme,
      anniversaryDate: config.anniversaryDate,
    }),
  },
  
  anniversary_countdown: {
    component: AnniversaryCountdownSection,
    getProps: (config) => ({
      theme: config.theme,
      anniversaryDate: config.anniversaryDate,
    }),
  },
  
  // Dreams & Future
  future_dreams: {
    component: FutureDreamsSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  // Interactive Sections
  quotes: {
    component: QuotesSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  reasons_love_you: {
    component: ReasonsILoveYouSection,
    getProps: (config) => ({
      theme: config.theme,
      partnerName: config.partnerName,
    }),
  },
  
  memory_map: {
    component: MemoryMapSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  birthday_message: {
    component: BirthdayMessageSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.message || 'Happy Birthday! Wishing you all the best.',
    }),
  },
  birthday_wishes: {
    component: BirthdayWishesSection,
    getProps: (config) => ({
      theme: config.theme,
      wishes: config.birthday_wishes || [],
    }),
  },
  birthday_countdown: {
    component: BirthdayCountdownSection,
    getProps: (config) => ({
      theme: config.theme,
      birthdayDate: config.anniversaryDate || config.specialDate || config.birthdayDate || '',
    }),
  },
  birthday_timeline: {
    component: BirthdayTimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.timelineEvents || config.section_content?.timeline || [],
    }),
  },
  party_details: {
    component: PartyDetailsSection,
    getProps: (config) => ({
      theme: config.theme,
      location: config.partyLocation || config.venue || '',
      date: config.specialDate || config.birthdayDate || '',
      time: config.partyTime || '',
      dressCode: config.dressCode || 'Festive attire',
    }),
  },
  gift_wishlist: {
    component: GiftWishlistSection,
    getProps: (config) => ({
      theme: config.theme,
      items: config.giftWishlist || [],
    }),
  },
  gift_ideas: {
    component: GiftIdeasSection,
    getProps: (config) => ({
      theme: config.theme,
      giftIdeas: config.section_content?.gift_ideas?.items || config.giftIdeas || [],
      title: config.section_content?.gift_ideas?.title || 'Gift Ideas',
      subtitle: config.section_content?.gift_ideas?.subtitle || 'Your presence and prayers are more than enough, but if you wish to give, here are a few things we would appreciate.',
    }),
  },
  wedding_countdown: {
    component: AnniversaryCountdownSection,
    getProps: (config) => ({
      theme: config.theme,
      anniversaryDate: config.anniversaryDate || config.specialDate || '',
    }),
  },
  event_details: {
    component: PartyDetailsSection,
    getProps: (config) => ({
      theme: config.theme,
      location: config.partyLocation || config.venue || '',
      date: config.specialDate || config.eventDate || '',
      time: config.partyTime || config.eventTime || '',
      dressCode: config.dressCode || 'To be announced',
    }),
  },
  // Baptism / Invitation sections
  invitation: {
    component: InvitationSection,
    getProps: (config) => ({
      theme: config.theme,
      invitation: config.section_content?.invitation || undefined,
      invitationMessage: config.section_content?.invitation?.invitationMessage || config.invitationMessage || config.message || '',
      godparentMessage: config.section_content?.invitation?.godparentMessage || config.godparentMessage || '',
    }),
  },
  schedule: {
    component: ScheduleSection,
    getProps: (config) => ({
      theme: config.theme,
      schedule: config.section_content?.schedule?.schedule || config.schedule || [],
    }),
  },
  dress_code: {
    component: DressCodeSection,
    getProps: (config) => ({
      theme: config.theme,
      dressCode: config.section_content?.dress_code?.dressCode || config.dressCode || '',
      themeColor: config.section_content?.dress_code?.themeColor || config.themeColor || '',
    }),
  },
  map_section: {
    component: MapSection,
    getProps: (config) => ({
      theme: config.theme,
      mapLink: config.section_content?.map_section?.mapLink || config.mapLink || '',
    }),
  },
  safety_protocol: {
    component: SafetyProtocolSection,
    getProps: (config) => ({
      theme: config.theme,
      content: config.section_content?.safety_protocol?.content || config.safetyProtocol || '',
      guidelines: config.section_content?.safety_protocol?.guidelines || [],
      contactName: config.section_content?.safety_protocol?.contactName || config.safetyContactName || '',
      contactPhone: config.section_content?.safety_protocol?.contactPhone || config.safetyContactPhone || '',
      pdfUrl: config.section_content?.safety_protocol?.pdfUrl || config.safetyPdfUrl || '',
      items: config.section_content?.safety_protocol?.items || [],
    }),
  },
  wedding_timeline: {
    component: TimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.wedding_timeline || config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.section_content?.wedding_timeline || config.timelineEvents || config.section_content?.timeline || [],
      siteType: 'wedding',
    }),
  },
  gift_registry: {
    component: GiftWishlistSection,
    getProps: (config) => ({
      theme: config.theme,
      items: config.section_content?.gift_registry?.items || config.giftWishlist || [],
    }),
  },
  rsvp: {
    component: RSVPSection,
    getProps: (config) => ({
      theme: config.theme,
      rsvpEnabled: config.section_content?.rsvp?.enabled ?? config.rsvpEnabled ?? true,
    }),
  },
  closing: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.closing?.closingMessage || config.closingMessage || config.message || '',
    }),
  },
  couple_message: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.couple_message?.content || config.message,
    }),
  },
  graduation_message: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.graduation_message?.content || config.message,
    }),
  },
  countdown: {
    component: AnniversaryCountdownSection,
    getProps: (config) => ({
      theme: config.theme,
      anniversaryDate: config.anniversaryDate || config.specialDate || config.birthdayDate || '',
    }),
  },
  school_memories: {
    component: TimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.school_memories || config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.section_content?.school_memories || config.timelineEvents || config.section_content?.timeline || [],
    }),
  },
  achievements: {
    component: TimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.achievements || config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.section_content?.achievements || config.timelineEvents || config.section_content?.timeline || [],
    }),
  },
  future_plans: {
    component: FutureDreamsSection,
    getProps: (config) => ({
      theme: config.theme,
      dreams: config.section_content?.future_plans?.dreams || config.section_content?.future_dreams?.dreams,
    }),
  },
  baby_predictions: {
    component: QuotesSection,
    getProps: (config) => ({
      theme: config.theme,
      quotes: config.section_content?.baby_predictions?.quotes || config.section_content?.quotes?.quotes,
    }),
  },
  parents_message: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.parents_message?.content || config.message,
    }),
  },
  photo_highlights: {
    component: GallerySection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.photo_highlights || config.section_templates?.gallery || config.gallery_template || 'grid',
      photos: Array.isArray(config?.media?.photos) && config.media.photos.length > 0
        ? config.media.photos
        : Array.isArray(config?.section_content?.gallery?.photos) && config.section_content.gallery.photos.length > 0
          ? config.section_content.gallery.photos
          : config.photos || [],
      coverPhotoIndex: config.coverPhotoIndex,
    }),
  },
  celebrant_message: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.celebrant_message?.content || config.message,
    }),
  },
  life_story: {
    component: OurStorySection,
    getProps: (config) => ({
      theme: config.theme,
      participants: [{ name: config.customerName || '' }, { name: config.partnerName || '', role: 'partner' }],
    }),
  },
  tributes: {
    component: QuotesSection,
    getProps: (config) => ({
      theme: config.theme,
      quotes: config.section_content?.tributes?.quotes || config.section_content?.quotes?.quotes,
    }),
  },
  family_message: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.family_message?.content || config.message,
    }),
  },
  travel_timeline: {
    component: TimelineSection,
    getProps: (config) => ({
      theme: config.theme,
      template: config.section_templates?.travel_timeline || config.section_templates?.timeline || config.timeline_template || 'vertical_timeline',
      events: config.section_content?.travel_timeline || config.timelineEvents || config.section_content?.timeline || [],
    }),
  },
  travel_notes: {
    component: OurStorySection,
    getProps: (config) => ({
      theme: config.theme,
      participants: [{ name: config.customerName || '' }, { name: config.partnerName || '', role: 'partner' }],
    }),
  },
  message_letter: {
    component: LoveLetterSection,
    getProps: (config) => ({
      theme: config.theme,
      message: config.section_content?.message_letter?.content || config.message,
    }),
  },
  
  // Guest & Messages
  guest_messages: {
    component: GuestMessagesSection,
    getProps: (config) => ({
      theme: config.theme,
    }),
  },
  
  // Special Features
  letter_future: {
    component: LetterToFutureSection,
    getProps: (config) => ({
      theme: config.theme,
      customerName: config.customerName,
      partnerName: config.partnerName,
    }),
  },
  
  gift_section: {
    component: GiftSection,
    getProps: (config) => ({
      theme: config.theme,
      partnerName: config.partnerName,
    }),
  },
  
  surprise_message: {
    component: SurpriseMessageSection,
    getProps: (config) => ({
      theme: config.theme,
      customerName: config.customerName,
      partnerName: config.partnerName,
    }),
  },
  
  // Keepsake - handled separately (QR code)
  qr_keepsake: {
    component: () => null, // QR is rendered separately in MemoryCardSection
    getProps: () => ({}),
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the renderer for a specific section
 */
export const getSectionRenderer = (section: Section) => {
  return SECTION_RENDERERS[section];
};

/**
 * Check if a section has a renderer
 */
export const hasSectionRenderer = (section: Section): boolean => {
  return !!SECTION_RENDERERS[section];
};

/**
 * Get all available sections that have renderers
 */
export const getRenderableSections = (): Section[] => {
  return Object.keys(SECTION_RENDERERS) as Section[];
};

/**
 * Build props for a section based on config
 */
export const buildSectionProps = (section: Section, config: Record<string, any>): Record<string, any> => {
  const renderer = SECTION_RENDERERS[section];
  if (!renderer) return {};
  
  return renderer.getProps(config);
};

