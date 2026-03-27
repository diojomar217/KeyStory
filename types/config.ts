// Shared config types for static data

export type SiteTypeKey = 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
export type ThemeKey =
  | 'romantic_classic'
  | 'dark_elegant'
  | 'cute_pastel'
  | 'minimal_modern'
  | 'soft_pastel'
  | 'elegant_rose_gold'
  | 'vintage_love_letter'
  | 'scrapbook_memories'
  | 'wedding_style'
  | 'floral_romance'
  | 'dreamy_pink'
  | 'luxury_gold'
  | 'minimal_white'
  | 'cute_kawaii'
  | 'soft_lavender'
  | 'photo_focus'
  | 'colorful_celebration';
export type SectionKey = 'home' | 'story' | 'memories' | 'gallery' | 'timeline' | 'song' | 'review' | 'publish';
export type TemplateKey = 'hero_centered' | 'split_layout' | 'fullscreen_banner';
export type HeroMode = 'elapsed' | 'countdown' | 'static';

export interface SiteTypeConfig {
  key: SiteTypeKey;
  label: string;
  icon: string;
  description: string;
  defaultTheme: ThemeKey;
  heroMode: HeroMode;
  requiredFields: string[];
  allowedSections: SectionKey[];
  recommendedTemplates: TemplateKey[];
  metadata?: Record<string, any>;
}

export interface ThemeConfig {
  key: ThemeKey;
  label: string;
  description: string;
  previewColor: string;
  cardColor: string;
  background: string;
  accent: string;
  text: string;
  button: string;
  divider: string;
  decorations?: string[];
  metadata?: Record<string, any>;
}

export interface SectionConfig {
  key: SectionKey;
  label: string;
  icon: string;
  description: string;
  required: boolean;
  allowedSiteTypes: SiteTypeKey[];
  defaultEnabled: boolean;
  order: number;
  category?: string;
  layoutCard?: string;
  previewLabel?: string;
  metadata?: Record<string, any>;
}

export interface TemplateConfig {
  key: TemplateKey;
  label: string;
  description: string;
  recommended: boolean;
  supportedSiteTypes: SiteTypeKey[];
  supportedThemes: ThemeKey[];
  preview?: string;
  metadata?: Record<string, any>;
}
