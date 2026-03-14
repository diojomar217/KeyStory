// lib/occasion-registry.ts
// ============================================
// OCCASION REGISTRY - Core extensibility layer
// ============================================

import { Section, Theme } from './types';
import { SECTION_REGISTRY, getDefaultSections } from './section-registry';

/**
 * Core occasion types - easily extensible
 */
export type OccasionType = 
  | 'couple'     // Current primary (romantic relationships)
  | 'wedding'    // Future: wedding websites
  | 'birthday'   // Future: birthday celebrations  
  | 'proposal'   // Future: marriage proposals
  | 'anniversary'; // Future: anniversary celebrations

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
  defaultTheme: Theme;
  participantsLabel: string;     // 'Partner', 'Bride/Groom', etc.
  specialDateLabel: string;      // 'Anniversary Date', 'Wedding Date', etc.
  supportedThemes: Theme[];
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
};

/**
 * Getters & Helpers
 */
export const getOccasionMetadata = (occasion: OccasionType): OccasionMetadata => {
  return OCCASION_REGISTRY[occasion] || OCCASION_REGISTRY.couple; // Default to couple
};

export const getDefaultOccasionConfig = (occasion: OccasionType = 'couple'): {
  occasion: OccasionType;
  sections: Section[];
  theme: Theme;
} => {
  const meta = getOccasionMetadata(occasion);
  return {
    occasion,
    sections: meta.defaultSections,
    theme: meta.defaultTheme,
  };
};

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

