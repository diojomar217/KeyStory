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

} as const;

// Centralized mapping from section keys to template group keys
export const SECTION_TEMPLATE_MAP = {
  home: 'hero',
  timeline: 'timeline',
  gallery: 'gallery',
  playlist: 'song',
} as const;

// Helper to get templates for a section
export function getTemplatesForSection(sectionKey: string) {
  const group = SECTION_TEMPLATE_MAP[sectionKey as keyof typeof SECTION_TEMPLATE_MAP];
  if (group && Array.isArray(TEMPLATE_CONFIG[group])) {
    return TEMPLATE_CONFIG[group];
  }
  return [];
}

export type TemplateSectionKey = keyof typeof TEMPLATE_CONFIG;
