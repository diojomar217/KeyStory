import { OccasionType } from './occasion-registry';
import { Section, Theme, LayoutPreset, HomeTemplate, GalleryTemplate, TimelineTemplate, SongTemplate } from './types';

export type PresetDefaults = {
  sections: Section[];
  theme: Theme;
  layout_preset: LayoutPreset;
  templates: {
    home?: HomeTemplate;
    gallery?: GalleryTemplate;
    timeline?: TimelineTemplate;
    song?: SongTemplate;
  };
  copy?: {
    tagline?: string;
    message?: string;
  };
};

export interface OccasionPreset {
  id: string;
  siteType: OccasionType;
  label: string;
  description: string;
  badge: string;
  defaults: PresetDefaults;
}

export const PRESET_REGISTRY: OccasionPreset[] = [
  {
    id: 'couple_classic',
    siteType: 'couple',
    label: 'Couple Classic',
    description: 'Romantic journey with timeline, gallery, and music.',
    badge: 'Couple',
    defaults: {
      sections: ['home', 'love_letter', 'timeline', 'gallery', 'playlist', 'qr_keepsake'],
      theme: 'romantic_classic',
      layout_preset: 'elegant_story',
      templates: {
        home: 'hero_centered',
        gallery: 'grid',
        timeline: 'vertical_timeline',
        song: 'minimal_player',
      },
      copy: {
        tagline: 'Every love story is beautiful, but ours is my favorite.',
        message: 'Our journey together is the best adventure.'
      },
    },
  },
  {
    id: 'couple_minimal',
    siteType: 'couple',
    label: 'Couple Minimal',
    description: 'Clean, modern couple look with essential content.',
    badge: 'Couple',
    defaults: {
      sections: ['home', 'gallery', 'quotes', 'future_dreams', 'qr_keepsake'],
      theme: 'minimal_modern',
      layout_preset: 'modern_romance',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
        timeline: 'vertical_timeline',
      },
      copy: {
        tagline: 'Our story is simple, bold, and true.',
        message: 'Love, joy, and a future together.'
      },
    },
  },
  {
    id: 'birthday_celebration',
    siteType: 'birthday',
    label: 'Birthday Celebration',
    description: 'Bright celebratory design with wishes and countdown.',
    badge: 'Birthday',
    defaults: {
      sections: ['home', 'gallery', 'birthday_countdown', 'birthday_wishes', 'playlist', 'qr_keepsake'],
      theme: 'colorful_celebration',
      layout_preset: 'celebration_flow',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
      },
      copy: {
        tagline: 'Happy Birthday! Let’s celebrate in style.',
        message: 'Wishes, memories and joy for your special day.'
      },
    },
  },
  {
    id: 'birthday_scrapbook',
    siteType: 'birthday',
    label: 'Birthday Scrapbook',
    description: 'Warm and nostalgic scrapbook style birthday site.',
    badge: 'Birthday',
    defaults: {
      sections: ['home', 'gallery', 'video_memories', 'memory_map', 'surprise_message', 'qr_keepsake'],
      theme: 'soft_pastel',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'hero_centered',
        gallery: 'grid',
      },
      copy: {
        tagline: 'A beautiful birthday memory book.',
        message: 'Celebrate with photos, videos and surprises.'
      },
    },
  },
];

export const getPresetsForOccasion = (occasion: OccasionType): OccasionPreset[] => {
  return PRESET_REGISTRY.filter((preset) => preset.siteType === occasion);
};

export const getPresetById = (id: string): OccasionPreset | undefined => {
  return PRESET_REGISTRY.find((preset) => preset.id === id);
};
