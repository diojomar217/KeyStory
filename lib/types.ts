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
  cover_photo_index?: number;
  tagline?: string;
}

export interface CreateOrderPayload {
  website_name: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  tagline?: string;
  song_link?: string;
  photos: string[]; // base64
  config: SiteConfig;
}

// Admin Sidebar Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}
