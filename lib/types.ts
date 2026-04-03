// lib/types.ts

// ============================================
// THEME TYPES - 16 Theme Presets
// ============================================

// Theme type removed. Use ThemeKey from '@/config/themeConfig' everywhere.

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
  | 'birthday_message'
  | 'birthday_wishes'
  | 'birthday_countdown'
  | 'birthday_timeline'
  | 'party_details'
  | 'gift_wishlist'
  | 'relationship_stats'
  | 'memory_map'
  | 'polaroid_gallery'        // DEPRECATED - use gallery with layout="polaroid"
  | 'first_date'             // DEPRECATED - use timeline instead
  | 'special_moments'        // DEPRECATED - use timeline instead
  | 'reasons_love_you'
  | 'guest_messages'
  | 'letter_future'
  | 'gift_section'
  | 'surprise_message'
  | 'wedding_countdown'
  | 'event_details'
  | 'wedding_timeline'
  | 'gift_registry'
  | 'rsvp'
  | 'couple_message'
  | 'graduation_message'
  | 'countdown'
  | 'school_memories'
  | 'achievements'
  | 'future_plans'
  | 'baby_predictions'
  | 'parents_message'
  | 'photo_highlights'
  | 'celebrant_message'
  | 'life_story'
  | 'tributes'
  | 'family_message'
  | 'travel_timeline'
  | 'travel_notes'
  | 'message_letter';

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
  | 'minimal_keepsake'
  | 'celebration_flow'
  | 'editorial_timeline'
  | 'photo_showcase';

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

// ThemePresetConfig is now defined in config/themeConfig.ts. Use ThemeDefinition from there.

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

import type { OccasionType } from './occasion-registry';
export type { OccasionType };

export interface Participant {
  id: string;
  name: string;
  role?: string; // 'primary', 'partner', 'bride', 'groom', etc.
}

export interface SiteConfig {
  occasion: OccasionType;
  theme: string;
  layout_preset?: LayoutPreset;
  sections: Section[];
  section_toggles?: Record<Section, boolean>;
  section_templates?: Partial<Record<Section, string>>;
  templates?: Partial<Record<Section, string>>;
  gallery_layout?: GalleryLayout;
  timeline_events?: TimelineEvent[];
  cover_photo_index?: number;
  tagline?: string;
  message?: string;
  participants?: Participant[];
  specialDate?: string;
  media?: {
    photos?: string[];
    song_link?: string;
    song_autoplay?: boolean;
  };
  password?: {
    enabled: boolean;
    hash?: string;
  };
  password_input?: string;
  section_content?: SectionContentMap;
  // Legacy template fields (use section_templates instead)
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  song_template?: string;
  qr?: {
    color?: string;
    background?: string;
    style?: 'square' | 'dots' | 'rounded';
    cardStyle?: 'none' | 'love_card' | 'birthday_card' | 'minimal_card' | 'polaroid';
    title?: string;
    subtitle?: string;
    showNames?: boolean;
  };
  qr_data_url?: string;
  fulfillment?: {
    status?: 'draft' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'activated';
    note?: string;
    tracking_number?: string;
    courier?: string;
    updated_at?: string;
  };
  section_divider_style?: 'none' | 'standard' | 'gradient' | 'dots';
  hero?: {
    coverPhotoUrl?: string;
    publicId?: string;
    coverPhotoIndex?: number;
  };
  preset?: {
    id: string;
    label: string;
  };
}

export type SiteAnalyticsEventType =
  | 'page_view'
  | 'qr_scan'
  | 'section_view'
  | 'share_click'
  | 'download_card'
  | 'music_play'
  | 'opening_reveal';

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
  occasion: OccasionType;
  participants: Participant[]; // Replaces customer_name/partner_name
  specialDate: string;         // Canonical date field
  message: string;
  tagline?: string;
  song_link?: string;
  photos: File[];
  preset_id?: string;
  // Legacy for migration
  customer_name?: string;
  partner_name?: string;
}

// Preview State
export interface PreviewState {
  device: PreviewDevice;
  isLive: boolean;
}

// Create Order Payload
export interface CreateOrderPayload {
  website_name: string;
  occasion: OccasionType;
  participants: Participant[];
  specialDate: string;
  message: string;
  tagline?: string;
  song_link?: string;
  photos: string[]; // base64
  config: SiteConfig;
  // Legacy for migration
  customer_name?: string;
  partner_name?: string;
  password_input?: string;
  expires_at?: string;
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
  address?: string; // Optional formatted address from search
}

export interface GuestMessageRecord {
  id: string;
  site_id: string;
  name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SiteAnalyticsEvent {
  id: string;
  site_id: string;
  event_type: 'page_view' | 'qr_scan';
  source?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  ip_hash?: string | null;
  created_at: string;
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
    text?: string;
    content?: string;
  };
  our_story?: {
    text?: string;
    content?: string;
  };
  timeline?: TimelineEvent[];
  first_date?: {
    content?: string;
    title?: string;
    date?: string;
    location?: string;
    description?: string;
  };
  special_moments?: {
    content?: string;
    moments?: SpecialMoment[];
  };
  milestones?: {
    content?: string;
    milestones?: Milestone[];
  };
  travel_notes?: {
    content?: string;
  };
  life_story?: {
    content?: string;
  };
  message_letter?: {
    content?: string;
  };
  couple_message?: {
    content?: string;
  };
  family_message?: {
    content?: string;
  };
  parents_message?: {
    content?: string;
  };
  celebrant_message?: {
    content?: string;
  };
  graduation_message?: {
    content?: string;
  };
  playlist?: {
    playlistUrl: string;
    title: string;
  };
  video_memories?: {
    videos: VideoMemory[];
  };
  song?: {
    song_link: string;
    song_autoplay?: boolean;
  };
  future_dreams?: {
    dreams: FutureDream[];
  };
  future_plans?: {
    dreams: FutureDream[];
  };
  quotes?: {
    quotes: LoveQuote[];
  };
  tributes?: {
    quotes: LoveQuote[];
  };
  baby_predictions?: {
    quotes: LoveQuote[];
  };
  birthday_message?: {
    text?: string;
    content?: string;
  };
  birthday_wishes?: {
    quotes: LoveQuote[];
  };
  birthday_timeline?: TimelineEvent[];
  school_memories?: {
    events: TimelineEvent[];
  };
  achievements?: {
    events: TimelineEvent[];
  };
  travel_timeline?: {
    events: TimelineEvent[];
  };
  party_details?: {
    location?: string;
    date?: string;
    time?: string;
    dressCode?: string;
  };
  event_details?: {
    location?: string;
    date?: string;
    time?: string;
    dressCode?: string;
  };
  gift_wishlist?: {
    items: string[];
  };
  gift_registry?: {
    items: string[];
  };
  photo_highlights?: {
    photos: string[];
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
    messages?: GuestMessage[];
  };
  rsvp?: {
    deadline?: string;
    note?: string;
    messages?: GuestMessage[];
  };
}
