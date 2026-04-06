import type {LayoutPreset, HomeTemplate, GalleryTemplate, TimelineTemplate, SongTemplate } from './types';
import { Section } from './types';
import type { ThemeKey } from '@/config/themeConfig';
import type { SiteTypeKey } from '@/config/siteTypeConfig';
export type PresetDefaults = {
  sections: Section[];
  theme: ThemeKey;
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
  siteType: SiteTypeKey;
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
  {
    id: 'wedding_elegant',
    siteType: 'wedding',
    label: 'Wedding Elegant',
    description: 'Elegant wedding flow with story, gallery, and guest interactions.',
    badge: 'Wedding',
    defaults: {
      sections: ['home', 'our_story', 'gallery', 'playlist', 'video_memories', 'memory_map', 'guest_messages'],
      theme: 'wedding_style',
      layout_preset: 'elegant_story',
      templates: {
        home: 'hero_centered',
        gallery: 'grid',
        timeline: 'vertical_timeline',
      },
      copy: {
        tagline: 'Two hearts, one beautiful beginning.',
        message: 'Celebrate our special day with stories and memories.',
      },
    },
  },
  {
    id: 'wedding_modern',
    siteType: 'wedding',
    label: 'Wedding Modern',
    description: 'Contemporary wedding flow with editorial visuals and clean story cards.',
    badge: 'Wedding',
    defaults: {
      sections: ['home', 'wedding_timeline', 'gallery', 'rsvp', 'guest_messages', 'playlist'],
      theme: 'minimal_white',
      layout_preset: 'editorial_timeline',
      templates: {
        home: 'split_layout',
        gallery: 'carousel',
        timeline: 'milestone_cards',
      },
      copy: {
        tagline: 'A modern celebration of our forever.',
        message: 'Join our day through moments, stories, and heartfelt wishes.',
      },
    },
  },
  {
    id: 'anniversary_timeless',
    siteType: 'anniversary',
    label: 'Anniversary Timeless',
    description: 'A warm anniversary layout focused on milestones and memories.',
    badge: 'Anniversary',
    defaults: {
      sections: ['home', 'love_letter', 'timeline', 'gallery', 'playlist', 'relationship_stats', 'anniversary_countdown'],
      theme: 'elegant_rose_gold',
      layout_preset: 'modern_romance',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
        timeline: 'story_chapters',
      },
      copy: {
        tagline: 'Another year, another beautiful chapter.',
        message: 'Thank you for every memory and every moment.',
      },
    },
  },
  {
    id: 'anniversary_gold',
    siteType: 'anniversary',
    label: 'Anniversary Gold',
    description: 'Elegant anniversary keepsake with chapters and heartfelt notes.',
    badge: 'Anniversary',
    defaults: {
      sections: ['home', 'love_letter', 'timeline', 'gallery', 'quotes', 'anniversary_countdown'],
      theme: 'luxury_gold',
      layout_preset: 'elegant_story',
      templates: {
        home: 'hero_centered',
        gallery: 'carousel',
        timeline: 'story_chapters',
      },
      copy: {
        tagline: 'Years pass, love deepens.',
        message: 'Every chapter with you is still my favorite.',
      },
    },
  },
  {
    id: 'proposal_magic',
    siteType: 'proposal',
    label: 'Proposal Magic',
    description: 'A romantic proposal setup with surprise and future dreams.',
    badge: 'Proposal',
    defaults: {
      sections: ['home', 'love_letter', 'gallery', 'playlist', 'surprise_message', 'future_dreams', 'video_memories'],
      theme: 'romantic_classic',
      layout_preset: 'elegant_story',
      templates: {
        home: 'fullscreen_banner',
        gallery: 'carousel',
      },
      copy: {
        tagline: 'Will you make forever with me?',
        message: 'Every moment led me to this question.',
      },
    },
  },
  {
    id: 'proposal_intimate',
    siteType: 'proposal',
    label: 'Proposal Intimate',
    description: 'Soft proposal style focused on message, gallery, and surprise reveal.',
    badge: 'Proposal',
    defaults: {
      sections: ['home', 'love_letter', 'gallery', 'quotes', 'surprise_message'],
      theme: 'floral_romance',
      layout_preset: 'modern_romance',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
      },
      copy: {
        tagline: 'One question, one forever.',
        message: 'This page holds the moment I asked you to be mine forever.',
      },
    },
  },
  {
    id: 'graduation_pride',
    siteType: 'graduation',
    label: 'Graduation Pride',
    description: 'Celebrate achievements with highlights, videos, and messages.',
    badge: 'Graduation',
    defaults: {
      sections: ['home', 'gallery', 'timeline', 'video_memories', 'playlist', 'guest_messages', 'qr_keepsake'],
      theme: 'minimal_modern',
      layout_preset: 'celebration_flow',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
        timeline: 'milestone_cards',
      },
      copy: {
        tagline: 'The tassel was worth the hassle.',
        message: 'A proud milestone worth celebrating.',
      },
    },
  },
  {
    id: 'graduation_journal',
    siteType: 'graduation',
    label: 'Graduation Journal',
    description: 'Story-driven graduation template with milestones and memories.',
    badge: 'Graduation',
    defaults: {
      sections: ['home', 'school_memories', 'achievements', 'gallery', 'quotes', 'guest_messages'],
      theme: 'dark_elegant',
      layout_preset: 'editorial_timeline',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
        timeline: 'story_chapters',
      },
      copy: {
        tagline: 'From lessons to legacy.',
        message: 'A milestone built on hard work, heart, and dreams.',
      },
    },
  },
  {
    id: 'baby_shower_joy',
    siteType: 'baby_shower',
    label: 'Baby Shower Joy',
    description: 'Sweet baby shower layout with media and guest interactions.',
    badge: 'Baby Shower',
    defaults: {
      sections: ['home', 'gallery', 'playlist', 'video_memories', 'memory_map', 'guest_messages'],
      theme: 'soft_pastel',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
      },
      copy: {
        tagline: 'A little one is on the way.',
        message: 'Join us in celebrating this precious new chapter.',
      },
    },
  },
  {
    id: 'baby_shower_clouds',
    siteType: 'baby_shower',
    label: 'Baby Shower Clouds',
    description: 'Gentle baby shower template with wishes, songs, and sweet memories.',
    badge: 'Baby Shower',
    defaults: {
      sections: ['home', 'gallery', 'baby_predictions', 'parents_message', 'playlist', 'guest_messages'],
      theme: 'dreamy_pink',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'hero_centered',
        gallery: 'carousel',
      },
      copy: {
        tagline: 'Tiny feet, huge love.',
        message: 'Celebrating the little miracle arriving soon.',
      },
    },
  },
  {
    id: 'debut_glam',
    siteType: 'debut',
    label: 'Debut Glam',
    description: 'A stylish debut setup with gallery, playlist, and wishes.',
    badge: 'Debut',
    defaults: {
      sections: ['home', 'gallery', 'playlist', 'video_memories', 'guest_messages', 'birthday_wishes'],
      theme: 'cute_kawaii',
      layout_preset: 'celebration_flow',
      templates: {
        home: 'hero_centered',
        gallery: 'carousel',
      },
      copy: {
        tagline: 'A sparkling debut to remember.',
        message: 'Thank you for being part of this milestone celebration.',
      },
    },
  },
  {
    id: 'debut_luxe',
    siteType: 'debut',
    label: 'Debut Luxe',
    description: 'Premium debut style with elegant highlights and timeline moments.',
    badge: 'Debut',
    defaults: {
      sections: ['home', 'gallery', 'timeline', 'birthday_wishes', 'playlist', 'guest_messages'],
      theme: 'elegant_rose_gold',
      layout_preset: 'celebration_flow',
      templates: {
        home: 'fullscreen_banner',
        gallery: 'polaroid',
        timeline: 'milestone_cards',
      },
      copy: {
        tagline: 'A night to shine, a memory to keep.',
        message: 'Thank you for celebrating this grand chapter with me.',
      },
    },
  },
  {
    id: 'memorial_tribute',
    siteType: 'memorial',
    label: 'Memorial Tribute',
    description: 'A respectful and heartfelt memorial memory page.',
    badge: 'Memorial',
    defaults: {
      sections: ['home', 'gallery', 'our_story', 'quotes', 'video_memories', 'memory_map', 'guest_messages'],
      theme: 'minimal_white',
      layout_preset: 'minimal_keepsake',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
      },
      copy: {
        tagline: 'Forever remembered, forever loved.',
        message: 'A place to honor memories and share tributes.',
      },
    },
  },
  {
    id: 'memorial_serene',
    siteType: 'memorial',
    label: 'Memorial Serene',
    description: 'Calm memorial template centered on stories, photos, and prayers.',
    badge: 'Memorial',
    defaults: {
      sections: ['home', 'life_story', 'gallery', 'quotes', 'guest_messages'],
      theme: 'minimal_modern',
      layout_preset: 'minimal_keepsake',
      templates: {
        home: 'hero_centered',
        gallery: 'grid',
      },
      copy: {
        tagline: 'In loving memory.',
        message: 'A space where memories continue to live and comfort us.',
      },
    },
  },
  {
    id: 'family_album',
    siteType: 'family',
    label: 'Family Album',
    description: 'Family-focused page with timeline, memories, and messages.',
    badge: 'Family',
    defaults: {
      sections: ['home', 'gallery', 'timeline', 'playlist', 'video_memories', 'memory_map', 'guest_messages'],
      theme: 'soft_pastel',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
        timeline: 'vertical_timeline',
      },
      copy: {
        tagline: 'Where family memories live on.',
        message: 'Our story, one cherished moment at a time.',
      },
    },
  },
  {
    id: 'family_storybook',
    siteType: 'family',
    label: 'Family Storybook',
    description: 'Warm family narrative format with timeline and shared highlights.',
    badge: 'Family',
    defaults: {
      sections: ['home', 'family_message', 'gallery', 'timeline', 'video_memories', 'guest_messages'],
      theme: 'minimal_white',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
        timeline: 'vertical_timeline',
      },
      copy: {
        tagline: 'Our roots, our story, our love.',
        message: 'A family keepsake made of moments that matter most.',
      },
    },
  },
  {
    id: 'friendship_vibes',
    siteType: 'friendship',
    label: 'Friendship Vibes',
    description: 'Fun friendship page with highlights, quotes, and shared plans.',
    badge: 'Friendship',
    defaults: {
      sections: ['home', 'gallery', 'timeline', 'playlist', 'quotes', 'video_memories', 'future_dreams', 'guest_messages'],
      theme: 'colorful_celebration',
      layout_preset: 'modern_romance',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
        timeline: 'milestone_cards',
      },
      copy: {
        tagline: 'Friends by chance, family by choice.',
        message: 'Cheers to all the laughs and memories we share.',
      },
    },
  },
  {
    id: 'friendship_scrap',
    siteType: 'friendship',
    label: 'Friendship Scrap',
    description: 'Casual and fun friendship template with photos and stories.',
    badge: 'Friendship',
    defaults: {
      sections: ['home', 'gallery', 'quotes', 'timeline', 'playlist', 'future_dreams'],
      theme: 'cute_pastel',
      layout_preset: 'modern_romance',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
        timeline: 'milestone_cards',
      },
      copy: {
        tagline: 'Best friends, best memories.',
        message: 'A celebration of laughter, adventures, and lifelong bonds.',
      },
    },
  },
  {
    id: 'travel_journal',
    siteType: 'travel',
    label: 'Travel Journal',
    description: 'Travel keepsake with route moments, media, and notes.',
    badge: 'Travel',
    defaults: {
      sections: ['home', 'gallery', 'timeline', 'memory_map', 'video_memories', 'playlist', 'quotes'],
      theme: 'photo_focus',
      layout_preset: 'minimal_keepsake',
      templates: {
        home: 'fullscreen_banner',
        gallery: 'carousel',
        timeline: 'story_chapters',
      },
      copy: {
        tagline: 'Collect moments, not things.',
        message: 'A journey of places, stories, and unforgettable experiences.',
      },
    },
  },
  {
    id: 'travel_postcards',
    siteType: 'travel',
    label: 'Travel Postcards',
    description: 'Postcard-inspired travel layout for photos, notes, and route highlights.',
    badge: 'Travel',
    defaults: {
      sections: ['home', 'photo_highlights', 'travel_timeline', 'travel_notes', 'gallery', 'memory_map'],
      theme: 'minimal_modern',
      layout_preset: 'photo_showcase',
      templates: {
        home: 'split_layout',
        gallery: 'carousel',
        timeline: 'story_chapters',
      },
      copy: {
        tagline: 'Miles of memories, one beautiful journal.',
        message: 'From every city to every sunset, this is our route of stories.',
      },
    },
  },
  {
    id: 'valentines_sweet',
    siteType: 'valentines',
    label: 'Valentine Sweet',
    description: 'A sweet valentine setup with romantic notes and playlists.',
    badge: 'Valentine\'s',
    defaults: {
      sections: ['home', 'love_letter', 'gallery', 'playlist', 'quotes', 'future_dreams', 'reasons_love_you', 'gift_section'],
      theme: 'dreamy_pink',
      layout_preset: 'elegant_story',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
      },
      copy: {
        tagline: 'You are my favorite love story.',
        message: 'A little page filled with all my love for you.',
      },
    },
  },
  {
    id: 'valentines_midnight',
    siteType: 'valentines',
    label: 'Valentine Midnight',
    description: 'A moodier romantic style for dramatic photos and heartfelt letters.',
    badge: 'Valentine\'s',
    defaults: {
      sections: ['home', 'love_letter', 'gallery', 'quotes', 'playlist', 'reasons_love_you'],
      theme: 'dark_elegant',
      layout_preset: 'elegant_story',
      templates: {
        home: 'fullscreen_banner',
        gallery: 'carousel',
      },
      copy: {
        tagline: 'You are still my favorite chapter.',
        message: 'A night-sky style page made for love notes and memories.',
      },
    },
  },
  {
    id: 'mothers_day_tribute',
    siteType: 'mothers_day',
    label: 'Mother\'s Day Tribute',
    description: 'Heartfelt mother\'s day tribute with photos and messages.',
    badge: 'Mother\'s Day',
    defaults: {
      sections: ['home', 'gallery', 'quotes', 'video_memories', 'guest_messages', 'love_letter'],
      theme: 'soft_pastel',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
      },
      copy: {
        tagline: 'Thank you for your endless love.',
        message: 'Celebrating the strength and kindness of moms everywhere.',
      },
    },
  },
  {
    id: 'mothers_day_garden',
    siteType: 'mothers_day',
    label: 'Mother\'s Day Garden',
    description: 'Soft floral tribute style with letters and cherished moments.',
    badge: 'Mother\'s Day',
    defaults: {
      sections: ['home', 'love_letter', 'gallery', 'quotes', 'guest_messages'],
      theme: 'dreamy_pink',
      layout_preset: 'soft_scrapbook',
      templates: {
        home: 'hero_centered',
        gallery: 'polaroid',
      },
      copy: {
        tagline: 'For the heart that raised us.',
        message: 'A page of gratitude for every sacrifice and every hug.',
      },
    },
  },
  {
    id: 'fathers_day_honor',
    siteType: 'fathers_day',
    label: 'Father\'s Day Honor',
    description: 'Meaningful father\'s day page with memories and appreciation.',
    badge: 'Father\'s Day',
    defaults: {
      sections: ['home', 'gallery', 'quotes', 'video_memories', 'guest_messages', 'our_story'],
      theme: 'minimal_modern',
      layout_preset: 'minimal_keepsake',
      templates: {
        home: 'split_layout',
        gallery: 'grid',
      },
      copy: {
        tagline: 'To the one who always showed the way.',
        message: 'A tribute to strength, wisdom, and love.',
      },
    },
  },
  {
    id: 'fathers_day_legacy',
    siteType: 'fathers_day',
    label: 'Father\'s Day Legacy',
    description: 'Strong and classic tribute template with stories and milestones.',
    badge: 'Father\'s Day',
    defaults: {
      sections: ['home', 'our_story', 'gallery', 'quotes', 'timeline', 'guest_messages'],
      theme: 'dark_elegant',
      layout_preset: 'minimal_keepsake',
      templates: {
        home: 'hero_centered',
        gallery: 'grid',
        timeline: 'vertical_timeline',
      },
      copy: {
        tagline: 'Your guidance is our foundation.',
        message: 'A legacy of strength, sacrifice, and love.',
      },
    },
  },
];

export const getPresetsForOccasion = (occasion: SiteTypeKey): OccasionPreset[] => {
  return PRESET_REGISTRY.filter((preset) => preset.siteType === occasion);
};

export const getPresetById = (id: string): OccasionPreset | undefined => {
  return PRESET_REGISTRY.find((preset) => preset.id === id);
};
