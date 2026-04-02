import type { Section } from '@/lib/types';

// Centralized template config for all template sections
export const TEMPLATE_CONFIG = {
  hero: [
    {
      key: 'hero_centered',
      label: 'Hero Centered',
      description: 'Premium centered hero layout.',
      preview: { type: 'mock', variant: 'hero_centered' },
    },
    {
      key: 'split_layout',
      label: 'Split Layout',
      description: 'Side-by-side image and text.',
      preview: { type: 'mock', variant: 'split_layout' },
    },
    {
      key: 'fullscreen_banner',
      label: 'Fullscreen Banner',
      description: 'Immersive full-bleed hero.',
      preview: { type: 'mock', variant: 'fullscreen_banner' },
    },
  ],
  gallery: [
    {
      key: 'grid',
      label: 'Grid Gallery',
      description: 'Classic grid photo gallery.',
      preview: { type: 'mock', variant: 'gallery_grid' },
    },
    {
      key: 'carousel',
      label: 'Carousel Gallery',
      description: 'Swipeable photo carousel.',
      preview: { type: 'mock', variant: 'gallery_carousel' },
    },
    {
      key: 'polaroid',
      label: 'Polaroid Gallery',
      description: 'Polaroid-style scattered gallery.',
      preview: { type: 'mock', variant: 'gallery_polaroid' },
    },
  ],
  timeline: [
    {
      key: 'vertical_timeline',
      label: 'Vertical Timeline',
      description: 'Milestones in a vertical timeline.',
      preview: { type: 'mock', variant: 'timeline_vertical' },
    },
    {
      key: 'milestone_cards',
      label: 'Milestone Cards',
      description: 'Timeline as a series of cards.',
      preview: { type: 'mock', variant: 'timeline_milestone_cards' },
    },
    {
      key: 'story_chapters',
      label: 'Story Chapters',
      description: 'Timeline as narrative chapters.',
      preview: { type: 'mock', variant: 'timeline_story_chapters' },
    },
  ],
  song: [
    {
      key: 'minimal_player',
      label: 'Minimal Player',
      description: 'Simple audio player.',
      preview: { type: 'mock', variant: 'song_minimal' },
    },
    {
      key: 'visual_player',
      label: 'Visual Player',
      description: 'Player with visualizer.',
      preview: { type: 'mock', variant: 'song_visual' },
    },
    {
      key: 'lyrics_card',
      label: 'Lyrics Card',
      description: 'Song with lyrics display.',
      preview: { type: 'mock', variant: 'song_lyrics' },
    },
  ],
  love_letter: [
    {
      key: 'classic_letter',
      label: 'Classic Letter',
      description: 'Elegant centered love message layout.',
      preview: { type: 'mock', variant: 'love_letter_classic' },
    },
    {
      key: 'floral_border',
      label: 'Floral Border',
      description: 'Romantic letter with decorative floral framing.',
      preview: { type: 'mock', variant: 'love_letter_floral' },
    },
    {
      key: 'handwritten',
      label: 'Handwritten Style',
      description: 'Personal handwritten-style presentation.',
      preview: { type: 'mock', variant: 'love_letter_handwritten' },
    },
  ],
  qr_keepsake: [
    {
      key: 'qr_card',
      label: 'QR Card',
      description: 'Classic keepsake card with QR and caption.',
      preview: { type: 'mock', variant: 'qr_card' },
    },
    {
      key: 'qr_mini',
      label: 'Mini QR Tag',
      description: 'Compact QR design for tags and keychains.',
      preview: { type: 'mock', variant: 'qr_mini' },
    },
    {
      key: 'qr_ornament',
      label: 'QR Ornament',
      description: 'Decorative QR style for framed keepsakes.',
      preview: { type: 'mock', variant: 'qr_ornament' },
    },
  ],

} as const;

// Centralized mapping from section keys to template group keys
export const SECTION_TEMPLATE_MAP: Partial<Record<Section, keyof typeof TEMPLATE_CONFIG>> = {
  home: 'hero',
  timeline: 'timeline',
  wedding_timeline: 'timeline',
  travel_timeline: 'timeline',
  school_memories: 'timeline',
  achievements: 'timeline',
  birthday_timeline: 'timeline',
  gallery: 'gallery',
  photo_highlights: 'gallery',
  love_letter: 'love_letter',
  couple_message: 'love_letter',
  graduation_message: 'love_letter',
  parents_message: 'love_letter',
  celebrant_message: 'love_letter',
  family_message: 'love_letter',
  message_letter: 'love_letter',
  birthday_message: 'love_letter',
  life_story: 'love_letter',
  travel_notes: 'love_letter',
  song: 'song',
  playlist: 'song',
  qr_keepsake: 'qr_keepsake',
};

// Helper to get templates for a section
export function getTemplatesForSection(sectionKey: Section | string) {
  const group = SECTION_TEMPLATE_MAP[sectionKey as Section];
  if (group && Array.isArray(TEMPLATE_CONFIG[group])) {
    return TEMPLATE_CONFIG[group];
  }
  return [];
}

export type TemplateSectionKey = keyof typeof TEMPLATE_CONFIG;
