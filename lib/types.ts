// lib/types.ts

// ============================================
// THEME TYPES - 16 Theme Presets
// ============================================

export type Theme =
  | 'romantic_classic'
  | 'cute_pastel'
  | 'minimal_modern'
  | 'dark_elegant'
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
  | 'photo_focus';

// ============================================
// SECTION TYPES - Refactored to Remove Redundancy
// ============================================

// Core sections (after refactoring - removed redundant ones)
// Deprecated sections are kept for backward compatibility but marked deprecated
export type Section = 
  | 'home'
  | 'love_letter'
  | 'gallery'
  | 'timeline'
  | 'song'
  | 'quotes'
  | 'our_story'
  | 'milestones'              // DEPRECATED - use timeline instead
  | 'future_dreams'
  | 'playlist'
  | 'video_memories'
  | 'qr_keepsake'
  | 'anniversary_countdown'
  | 'relationship_stats'
  | 'memory_map'
  | 'polaroid_gallery'        // DEPRECATED - use gallery with layout="polaroid"
  | 'first_date'             // DEPRECATED - use timeline instead
  | 'special_moments'        // DEPRECATED - use timeline instead
  | 'reasons_love_you'
  | 'guest_messages'
  | 'letter_future'
  | 'gift_section'
  | 'surprise_message';

// Gallery layout options - replaces separate gallery sections
export type GalleryLayout = 'grid' | 'polaroid' | 'carousel';

// Timeline event type - expanded to handle all story moments
export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  photo?: string; // Optional photo for timeline events
  icon?: string; // Optional emoji/icon for chapter (e.g., 💍, 🌹, ✈️)
  isSpecial?: boolean; // Mark as special moment with premium styling
  photoPosition?: 'top' | 'side'; // Photo layout preference
  // Event type for categorization (new field for backward compat)
  eventType?: 'meeting' | 'date' | 'milestone' | 'trip' | 'anniversary' | 'special';
}

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
  preview?: string;
  required: boolean;
  defaultEnabled: boolean;
}

// Site Configuration
export interface SiteConfig {
  theme: Theme;
  layout_preset?: LayoutPreset;
  sections: Section[];
  section_toggles?: Record<Section, boolean>; // Enable/disable individual sections
  // New dynamic template format (recommended)
  section_templates?: Record<Section, string>;
  // Legacy template fields (for backward compatibility)
  home_template?: HomeTemplate;
  gallery_template?: GalleryTemplate;
  gallery_layout?: GalleryLayout; // New: grid | polaroid | carousel
  timeline_template?: TimelineTemplate;
  song_template?: SongTemplate;
  timeline_events?: TimelineEvent[];
  cover_photo_index?: number;
  tagline?: string;
  message?: string; // Love message for the website
  // Dynamic section content for each enabled section
  section_content?: SectionContentMap;
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

// ============================================
// NEW SECTION DATA TYPES
// ============================================

// Milestone - Relationship achievement
export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon?: string;
}

// Quote - Love quote
export interface LoveQuote {
  id: string;
  text: string;
  author?: string;
}

// Future Dream - Plans together
export interface FutureDream {
  id: string;
  title: string;
  description: string;
  targetYear?: string;
}

// Video Memory
export interface VideoMemory {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
}

// Guest Message
export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

// Reason I Love You
export interface ReasonILoveYou {
  id: string;
  number: number;
  text: string;
}

// Special Moment
export interface SpecialMoment {
  id: string;
  title: string;
  date: string;
  description: string;
  photo?: string;
}

// Memory Map Location
export interface MemoryMapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  date?: string;
}

// Gift Item
export interface GiftItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

// Relationship Stats
export interface RelationshipStats {
  daysTogether: number;
  monthsTogether: number;
  yearsTogether: number;
  hoursTogether: number;
}

// ============================================
// SECTION CONTENT MAP - Dynamic Content for Each Section
// ============================================

export interface SectionContentMap {
  love_letter?: {
    content: string;
  };
  our_story?: {
    content: string;
  };
  first_date?: {
    title: string;
    date: string;
    location: string;
    description: string;
  };
  special_moments?: {
    moments: SpecialMoment[];
  };
  milestones?: {
    milestones: Milestone[];
  };
  playlist?: {
    playlistUrl: string;
    title: string;
  };
  video_memories?: {
    videos: VideoMemory[];
  };
  future_dreams?: {
    dreams: FutureDream[];
  };
  quotes?: {
    quotes: LoveQuote[];
  };
  reasons_love_you?: {
    reasons: ReasonILoveYou[];
  };
  memory_map?: {
    locations: MemoryMapLocation[];
  };
  letter_future?: {
    letter: string;
    openDate: string;
  };
  surprise_message?: {
    message: string;
    hint: string;
  };
  gift_section?: {
    gifts: GiftItem[];
  };
  guest_messages?: {
    enabled: boolean;
  };
}
