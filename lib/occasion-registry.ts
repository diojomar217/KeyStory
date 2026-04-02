// lib/occasion-registry.ts
// ============================================
// OCCASION REGISTRY - Core extensibility layer
// ============================================

import type { ThemeKey } from '@/config/themeConfig';
import { Section } from './types';
import { SECTION_REGISTRY, getDefaultSections } from './section-registry';

/**
 * Core occasion types — mirrors SiteTypeKey from siteTypeConfig
 */
export type OccasionType = 
  | 'couple'
  | 'wedding'
  | 'birthday'
  | 'proposal'
  | 'anniversary'
  | 'graduation'
  | 'baby_shower'
  | 'debut'
  | 'memorial'
  | 'family'
  | 'friendship'
  | 'travel'
  | 'valentines'
  | 'mothers_day'
  | 'fathers_day';

/**
 * Occasion metadata & defaults
 */
export interface OccasionMetadata {
  key: OccasionType;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultSections: Section[];
  defaultTheme: ThemeKey;
  participantsLabel: string;     // 'Partner', 'Bride/Groom', etc.
  specialDateLabel: string;      // 'Anniversary Date', 'Wedding Date', etc.
  supportedThemes: ThemeKey[];
  previewImage?: string;
  isProductionReady: boolean;    // Only 'couple' is fully ready
}

/**
 * Full occasion registry
 */
export const OCCASION_REGISTRY: Record<OccasionType, OccasionMetadata> = {
  couple: {
    key: 'couple',
    label: 'Romantic Couple',
    description: 'Websites celebrating romantic relationships and love stories',
    icon: '💕',
    color: '#BE185D',
    defaultSections: ['home', 'love_letter', 'gallery', 'timeline', 'song'],
    defaultTheme: 'romantic_classic',
    participantsLabel: 'You & Partner',
    specialDateLabel: 'Anniversary Date',
    supportedThemes: [
      'romantic_classic', 'cute_pastel', 'elegant_rose_gold', 'dreamy_pink'
    ],
    isProductionReady: true,
  },
  wedding: {
    key: 'wedding',
    label: 'Wedding',
    description: 'Wedding websites for RSVPs, stories, and celebration',
    icon: '💍',
    color: '#D4AF37',
    defaultSections: ['home', 'gallery', 'timeline', 'guest_messages'],
    defaultTheme: 'wedding_style',
    participantsLabel: 'Bride & Groom',
    specialDateLabel: 'Wedding Date',
    supportedThemes: [
      'wedding_style', 'elegant_rose_gold', 'luxury_gold', 'minimal_white'
    ],
    isProductionReady: true,
  },
  birthday: {
    key: 'birthday',
    label: 'Birthday',
    description: 'Surprise birthday tribute websites',
    icon: '🎂',
    color: '#F59E0B',
    defaultSections: ['home', 'birthday_message', 'birthday_wishes', 'gallery', 'playlist', 'birthday_countdown', 'qr_keepsake'],
    defaultTheme: 'cute_pastel',
    participantsLabel: 'Birthday Person',
    specialDateLabel: 'Birthday',
    supportedThemes: ['cute_pastel', 'cute_kawaii', 'soft_pastel', 'colorful_celebration'],
    isProductionReady: false,
  },
  proposal: {
    key: 'proposal',
    label: 'Marriage Proposal',
    description: 'Romantic marriage proposal websites',
    icon: '💒',
    color: '#EC4899',
    defaultSections: ['home', 'love_letter', 'timeline', 'surprise_message'],
    defaultTheme: 'romantic_classic',
    participantsLabel: 'You & Future Spouse',
    specialDateLabel: 'Proposal Date (future)',
    supportedThemes: ['romantic_classic', 'floral_romance'],
    isProductionReady: false,
  },
  anniversary: {
    key: 'anniversary',
    label: 'Anniversary',
    description: 'Celebrate relationship milestones',
    icon: '💑',
    color: '#8B5CF6',
    defaultSections: ['home', 'gallery', 'timeline', 'relationship_stats'],
    defaultTheme: 'elegant_rose_gold',
    participantsLabel: 'You & Partner',
    specialDateLabel: 'Anniversary Date',
    supportedThemes: ['elegant_rose_gold', 'luxury_gold'],
    isProductionReady: false,
  },
  graduation: {
    key: 'graduation',
    label: 'Graduation',
    description: 'Celebrate academic achievements and next chapters',
    icon: '🎓',
    color: '#1D4ED8',
    defaultSections: ['home', 'gallery', 'graduation_message', 'school_memories', 'guest_messages'],
    defaultTheme: 'minimal_modern',
    participantsLabel: 'Graduate',
    specialDateLabel: 'Graduation Date',
    supportedThemes: ['minimal_modern', 'dark_elegant', 'colorful_celebration'],
    isProductionReady: false,
  },
  baby_shower: {
    key: 'baby_shower',
    label: 'Baby Shower',
    description: 'Celebrate the upcoming arrival of a little one',
    icon: '🍼',
    color: '#EC4899',
    defaultSections: ['home', 'gallery', 'parents_message', 'baby_predictions', 'guest_messages'],
    defaultTheme: 'soft_pastel',
    participantsLabel: 'Parents-to-be',
    specialDateLabel: 'Due Date',
    supportedThemes: ['soft_pastel', 'cute_pastel', 'dreamy_pink'],
    isProductionReady: false,
  },
  debut: {
    key: 'debut',
    label: 'Debut',
    description: 'Make a 18th birthday or debut celebration extra special',
    icon: '👑',
    color: '#D97706',
    defaultSections: ['home', 'gallery', 'celebrant_message', 'birthday_wishes', 'guest_messages'],
    defaultTheme: 'elegant_rose_gold',
    participantsLabel: 'Debutante',
    specialDateLabel: 'Debut Date',
    supportedThemes: ['elegant_rose_gold', 'dreamy_pink', 'luxury_gold'],
    isProductionReady: false,
  },
  memorial: {
    key: 'memorial',
    label: 'Memorial',
    description: 'Honor and remember a loved one',
    icon: '🕊️',
    color: '#6B7280',
    defaultSections: ['home', 'gallery', 'life_story', 'tributes', 'guest_messages'],
    defaultTheme: 'dark_elegant',
    participantsLabel: 'In Memory of',
    specialDateLabel: 'Date of Remembrance',
    supportedThemes: ['dark_elegant', 'minimal_modern', 'minimal_white'],
    isProductionReady: false,
  },
  family: {
    key: 'family',
    label: 'Family',
    description: 'Capture family memories and milestones',
    icon: '🏡',
    color: '#10B981',
    defaultSections: ['home', 'gallery', 'timeline', 'family_message', 'guest_messages'],
    defaultTheme: 'scrapbook_memories',
    participantsLabel: 'Family',
    specialDateLabel: 'Family Date',
    supportedThemes: ['scrapbook_memories', 'soft_pastel', 'colorful_celebration'],
    isProductionReady: false,
  },
  friendship: {
    key: 'friendship',
    label: 'Friendship',
    description: 'Celebrate friendship and shared memories',
    icon: '🫶',
    color: '#F59E0B',
    defaultSections: ['home', 'gallery', 'timeline', 'guest_messages'],
    defaultTheme: 'colorful_celebration',
    participantsLabel: 'Friends',
    specialDateLabel: 'Friendship Anniversary',
    supportedThemes: ['colorful_celebration', 'cute_pastel', 'soft_lavender'],
    isProductionReady: false,
  },
  travel: {
    key: 'travel',
    label: 'Travel',
    description: 'Turn a memorable trip into a shareable keepsake',
    icon: '✈️',
    color: '#0EA5E9',
    defaultSections: ['home', 'gallery', 'travel_timeline', 'travel_notes', 'memory_map'],
    defaultTheme: 'photo_focus',
    participantsLabel: 'Travelers',
    specialDateLabel: 'Trip Date',
    supportedThemes: ['photo_focus', 'minimal_modern', 'dark_elegant'],
    isProductionReady: false,
  },
  valentines: {
    key: 'valentines',
    label: "Valentine's",
    description: 'A sweet and romantic page for Valentine gifts',
    icon: '🌷',
    color: '#F43F5E',
    defaultSections: ['home', 'love_letter', 'gallery', 'reasons_love_you'],
    defaultTheme: 'floral_romance',
    participantsLabel: 'You & Partner',
    specialDateLabel: "Valentine's Day",
    supportedThemes: ['floral_romance', 'romantic_classic', 'dreamy_pink'],
    isProductionReady: false,
  },
  mothers_day: {
    key: 'mothers_day',
    label: "Mother's Day",
    description: 'A heartfelt page to appreciate moms',
    icon: '💐',
    color: '#EC4899',
    defaultSections: ['home', 'gallery', 'message_letter', 'guest_messages'],
    defaultTheme: 'soft_pastel',
    participantsLabel: 'Mom',
    specialDateLabel: "Mother's Day",
    supportedThemes: ['soft_pastel', 'floral_romance', 'dreamy_pink'],
    isProductionReady: false,
  },
  fathers_day: {
    key: 'fathers_day',
    label: "Father's Day",
    description: 'A meaningful tribute page for dads',
    icon: '🧡',
    color: '#0284C7',
    defaultSections: ['home', 'gallery', 'message_letter', 'guest_messages'],
    defaultTheme: 'minimal_modern',
    participantsLabel: 'Dad',
    specialDateLabel: "Father's Day",
    supportedThemes: ['minimal_modern', 'dark_elegant', 'scrapbook_memories'],
    isProductionReady: false,
  },
};

/**
 * Getters & Helpers
 */
export const getOccasionMetadata = (occasion: OccasionType): OccasionMetadata => {
  return OCCASION_REGISTRY[occasion] || OCCASION_REGISTRY.couple; // Default to couple
};


// Helper to get default occasion data
export function getDefaultOccasionData(occasion: OccasionType): { occasion: OccasionType; sections: Section[]; theme: ThemeKey } {
  const meta = getOccasionMetadata(occasion);
  return {
    occasion,
    sections: meta.defaultSections,
    theme: meta.defaultTheme,
  };
}

export const getProductionReadyOccasions = (): OccasionType[] => {
  return Object.values(OCCASION_REGISTRY)
    .filter(meta => meta.isProductionReady)
    .map(meta => meta.key);
};

export const isValidOccasion = (value: string): value is OccasionType => {
  return Object.keys(OCCASION_REGISTRY).includes(value as OccasionType);
};

export const getParticipantLabel = (occasion: OccasionType): string => {
  return getOccasionMetadata(occasion).participantsLabel;
};

export const OCCASION_PREVIEW_URLS = {
  couple: '/previews/couple-preview.jpg',
  wedding: '/previews/wedding-preview.jpg',
  // Add more as implemented
} as const;

