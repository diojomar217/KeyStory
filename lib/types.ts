// lib/types.ts

export type Theme =
  | 'romantic_classic'
  | 'cute_pastel'
  | 'minimal_modern'
  | 'dark_elegant';

export type Section = 'home' | 'gallery' | 'timeline';

export type HomeTemplate = 'hero_centered' | 'split_layout' | 'fullscreen_banner';
export type GalleryTemplate = 'grid' | 'carousel' | 'polaroid';
export type TimelineTemplate = 'vertical_timeline' | 'milestone_cards' | 'story_chapters';

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

export interface SiteConfig {
  theme: Theme;
  sections: Section[];
  home_template?: HomeTemplate;
  gallery_template?: GalleryTemplate;
  timeline_template?: TimelineTemplate;
  timeline_events?: TimelineEvent[];
}

export interface CreateOrderPayload {
  website_name: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  song_link?: string;
  photos: string[]; // base64
  config: SiteConfig;
}
