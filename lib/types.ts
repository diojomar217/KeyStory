// lib/types.ts

export type Theme =
  | 'romantic_classic'
  | 'cute_pastel'
  | 'minimal_modern'
  | 'dark_elegant';

export type Section = 'home' | 'gallery' | 'timeline' | 'song' | 'love_letter' | 'qr_keepsake';

export type HomeTemplate = 'hero_centered' | 'split_layout' | 'fullscreen_banner';
export type GalleryTemplate = 'grid' | 'carousel' | 'polaroid';
export type TimelineTemplate = 'vertical_timeline' | 'milestone_cards' | 'story_chapters';
export type SongTemplate = 'minimal_player' | 'visual_player' | 'lyrics_card';

// Layout Presets
export type LayoutPreset = 
  | 'elegant_story'
  | 'modern_romance'
  | 'soft_scrapbook'
  | 'minimal_keepsake';

// Preview Device Types
export type PreviewDevice = 'desktop' | 'mobile';

// Timeline Event
export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

// Theme Preset Configuration
export interface ThemePresetColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export interface ThemePresetTypography {
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
}

export interface ThemePresetStyle {
  cardStyle: 'rounded' | 'square' | 'pill';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  accentStyle: 'solid' | 'gradient' | 'outline';
  buttonStyle: 'rounded' | 'square' | 'pill' | 'soft';
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
}

export interface ThemePresetConfig {
  key: Theme;
  label: string;
  description: string;
  colors: ThemePresetColors;
  typography: ThemePresetTypography;
  style: ThemePresetStyle;
  preview: string[]; // Color hex codes for preview
}

// Layout Preset Configuration
export interface LayoutPresetConfig {
  key: LayoutPreset;
  label: string;
  description: string;
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  headingTreatment: 'elegant' | 'bold' | 'minimal' | 'decorative';
  cardShapes: 'rounded' | 'square' | 'mixed';
  contentFlow: 'stacked' | 'grid' | 'masonry' | 'carousel';
  previewEmoji: string;
}

// Section Toggle Configuration
export interface SectionToggle {
  id: Section;
  label: string;
  description: string;
  icon: string;
  required: boolean;
  defaultEnabled: boolean;
}

// Site Configuration
export interface SiteConfig {
  theme: Theme;
  layout_preset?: LayoutPreset;
  sections: Section[];
  section_toggles?: Record<Section, boolean>; // Enable/disable individual sections
  home_template?: HomeTemplate;
  gallery_template?: GalleryTemplate;
  timeline_template?: TimelineTemplate;
  song_template?: SongTemplate;
  timeline_events?: TimelineEvent[];
  cover_photo_index?: number;
  tagline?: string;
}

// Builder State Types
export interface BuilderStep {
  id: number;
  title: string;
  subtitle: string;
  section: string;
  isRequired: boolean;
}

export type BuilderStepId = 
  | 'couple_details'
  | 'hero_section'
  | 'love_letter'
  | 'timeline'
  | 'gallery'
  | 'music'
  | 'theme_style'
  | 'review_publish';

// Draft State
export interface DraftState {
  form: BuilderFormData;
  config: SiteConfig;
  currentStep: number;
  completedSteps: number[];
  lastSaved: string | null;
  isDirty: boolean;
}

// Form Data for Builder
export interface BuilderFormData {
  website_name: string;
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  message: string;
  tagline?: string;
  song_link?: string;
  photos: File[];
}

// Preview State
export interface PreviewState {
  device: PreviewDevice;
  isLive: boolean;
}

// Create Order Payload
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
