import { 
  Theme, 
  ThemePresetConfig, 
  LayoutPreset, 
  LayoutPresetConfig, 
  SectionToggle,
  Section,
  BuilderStep 
} from './types';

// ============================================
// THEME PRESETS - 16 Themes
// ============================================

export const THEME_PRESETS: Record<Theme, ThemePresetConfig> = {
  romantic_classic: {
    key: 'romantic_classic',
    label: 'Romantic Classic',
    description: 'Timeless elegance with roses and soft pinks',
    colors: {
      primary: '#BE185D',
      secondary: '#FBCFE8',
      accent: '#DB2777',
      background: '#FFF1F2',
      text: '#831843',
      card: '#FFFFFF',
      border: '#FBCFE8',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'rounded',
      shadowIntensity: 'medium',
    },
    preview: ['#BE185D', '#FBCFE8', '#881337', '#FDF4FF'],
  },
  cute_pastel: {
    key: 'cute_pastel',
    label: 'Cute Pastel',
    description: 'Soft and dreamy vibes with pastels',
    colors: {
      primary: '#EC4899',
      secondary: '#FDE68A',
      accent: '#A855F7',
      background: '#FAF5FF',
      text: '#831843',
      card: '#FFFFFF',
      border: '#F9A8D4',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'pill',
      sectionSpacing: 'spacious',
      accentStyle: 'solid',
      buttonStyle: 'soft',
      shadowIntensity: 'light',
    },
    preview: ['#F9A8D4', '#FDE68A', '#A7F3D0', '#E0E7FF'],
  },
  minimal_modern: {
    key: 'minimal_modern',
    label: 'Minimal Modern',
    description: 'Clean and sophisticated with clean lines',
    colors: {
      primary: '#1F2937',
      secondary: '#F3F4F6',
      accent: '#6B7280',
      background: '#FFFFFF',
      text: '#111827',
      card: '#FFFFFF',
      border: '#E5E7EB',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'square',
      sectionSpacing: 'compact',
      accentStyle: 'solid',
      buttonStyle: 'square',
      shadowIntensity: 'none',
    },
    preview: ['#1F2937', '#F3F4F6', '#9CA3AF', '#FFFFFF'],
  },
  dark_elegant: {
    key: 'dark_elegant',
    label: 'Dark Elegant',
    description: 'Bold and luxurious with gold accents',
    colors: {
      primary: '#D4AF37',
      secondary: '#27272A',
      accent: '#F59E0B',
      background: '#09090B',
      text: '#FAFAFA',
      card: '#18181B',
      border: '#3F3F46',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 300,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'pill',
      shadowIntensity: 'heavy',
    },
    preview: ['#18181B', '#27272A', '#D4AF37', '#FAFAFA'],
  },
  soft_pastel: {
    key: 'soft_pastel',
    label: 'Soft Pastel',
    description: 'Gentle and calming pastel tones',
    colors: {
      primary: '#F472B6',
      secondary: '#FEF3C7',
      accent: '#A78BFA',
      background: '#FFFBEB',
      text: '#831843',
      card: '#FFFFFF',
      border: '#FBCFE8',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 500,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'spacious',
      accentStyle: 'solid',
      buttonStyle: 'rounded',
      shadowIntensity: 'light',
    },
    preview: ['#F472B6', '#FEF3C7', '#A78BFA', '#FFFBEB'],
  },
  elegant_rose_gold: {
    key: 'elegant_rose_gold',
    label: 'Elegant Rose Gold',
    description: 'Sophisticated rose gold with champagne tones',
    colors: {
      primary: '#B76E79',
      secondary: '#FDF2F8',
      accent: '#D4AF37',
      background: '#FFF5F5',
      text: '#831843',
      card: '#FFFFFF',
      border: '#FBCFE8',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'rounded',
      shadowIntensity: 'medium',
    },
    preview: ['#B76E79', '#FDF2F8', '#D4AF37', '#FFF5F5'],
  },
  vintage_love_letter: {
    key: 'vintage_love_letter',
    label: 'Vintage Love Letter',
    description: 'Nostalgic vintage paper aesthetic',
    colors: {
      primary: '#78350F',
      secondary: '#FEF3C7',
      accent: '#92400E',
      background: '#FFFBEB',
      text: '#451A03',
      card: '#FFFCF0',
      border: '#D6D3D1',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'outline',
      buttonStyle: 'rounded',
      shadowIntensity: 'light',
    },
    preview: ['#78350F', '#FEF3C7', '#92400E', '#FFFCF0'],
  },
  scrapbook_memories: {
    key: 'scrapbook_memories',
    label: 'Scrapbook Memories',
    description: 'Crafty scrapbook with decorative elements',
    colors: {
      primary: '#EA580C',
      secondary: '#FED7AA',
      accent: '#F59E0B',
      background: '#FFFBEB',
      text: '#7C2D12',
      card: '#FFFCF0',
      border: '#FDBA74',
    },
    typography: {
      headingFont: 'cursive',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'spacious',
      accentStyle: 'solid',
      buttonStyle: 'pill',
      shadowIntensity: 'medium',
    },
    preview: ['#EA580C', '#FED7AA', '#F59E0B', '#FFFBEB'],
  },
  wedding_style: {
    key: 'wedding_style',
    label: 'Wedding Style',
    description: 'Elegant wedding invitation aesthetic',
    colors: {
      primary: '#1F2937',
      secondary: '#F3F4F6',
      accent: '#D4AF37',
      background: '#FAFAF9',
      text: '#1C1917',
      card: '#FFFFFF',
      border: '#E7E5E4',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'rounded',
      shadowIntensity: 'light',
    },
    preview: ['#1F2937', '#F3F4F6', '#D4AF37', '#FAFAF9'],
  },
  floral_romance: {
    key: 'floral_romance',
    label: 'Floral Romance',
    description: 'Beautiful floral patterns and soft pinks',
    colors: {
      primary: '#BE185D',
      secondary: '#FCE7F3',
      accent: '#EC4899',
      background: '#FFF1F2',
      text: '#831843',
      card: '#FFFFFF',
      border: '#F9A8D4',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'rounded',
      shadowIntensity: 'medium',
    },
    preview: ['#BE185D', '#FCE7F3', '#EC4899', '#FFF1F2'],
  },
  dreamy_pink: {
    key: 'dreamy_pink',
    label: 'Dreamy Pink',
    description: 'Soft dreamy pink atmosphere',
    colors: {
      primary: '#DB2777',
      secondary: '#FBCFE8',
      accent: '#F472B6',
      background: '#FDF2F8',
      text: '#831843',
      card: '#FFFFFF',
      border: '#F9A8D4',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 500,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'pill',
      sectionSpacing: 'spacious',
      accentStyle: 'solid',
      buttonStyle: 'soft',
      shadowIntensity: 'light',
    },
    preview: ['#DB2777', '#FBCFE8', '#F472B6', '#FDF2F8'],
  },
  luxury_gold: {
    key: 'luxury_gold',
    label: 'Luxury Gold',
    description: 'Premium gold and black aesthetic',
    colors: {
      primary: '#D4AF37',
      secondary: '#1F2937',
      accent: '#FBBF24',
      background: '#111827',
      text: '#F9FAFB',
      card: '#1F2937',
      border: '#374151',
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 300,
    },
    style: {
      cardStyle: 'square',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'rounded',
      shadowIntensity: 'heavy',
    },
    preview: ['#1F2937', '#D4AF37', '#FBBF24', '#111827'],
  },
  minimal_white: {
    key: 'minimal_white',
    label: 'Minimal White',
    description: 'Clean white minimalist design',
    colors: {
      primary: '#1F2937',
      secondary: '#F9FAFB',
      accent: '#6B7280',
      background: '#FFFFFF',
      text: '#111827',
      card: '#FFFFFF',
      border: '#E5E7EB',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'square',
      sectionSpacing: 'compact',
      accentStyle: 'solid',
      buttonStyle: 'square',
      shadowIntensity: 'none',
    },
    preview: ['#1F2937', '#F9FAFB', '#6B7280', '#FFFFFF'],
  },
  cute_kawaii: {
    key: 'cute_kawaii',
    label: 'Cute Kawaii',
    description: 'Playful kawaii style with cute icons',
    colors: {
      primary: '#F472B6',
      secondary: '#FEF3C7',
      accent: '#A855F7',
      background: '#FDF4FF',
      text: '#831843',
      card: '#FFFFFF',
      border: '#F9A8D4',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 500,
    },
    style: {
      cardStyle: 'pill',
      sectionSpacing: 'spacious',
      accentStyle: 'solid',
      buttonStyle: 'pill',
      shadowIntensity: 'light',
    },
    preview: ['#F472B6', '#FEF3C7', '#A855F7', '#FDF4FF'],
  },
  soft_lavender: {
    key: 'soft_lavender',
    label: 'Soft Lavender',
    description: 'Calming lavender purple tones',
    colors: {
      primary: '#7C3AED',
      secondary: '#EDE9FE',
      accent: '#A78BFA',
      background: '#FAF5FF',
      text: '#5B21B6',
      card: '#FFFFFF',
      border: '#C4B5FD',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'solid',
      buttonStyle: 'rounded',
      shadowIntensity: 'light',
    },
    preview: ['#7C3AED', '#EDE9FE', '#A78BFA', '#FAF5FF'],
  },
  colorful_celebration: {
    key: 'colorful_celebration',
    label: 'Colorful Celebration',
    description: 'Festive colors for birthdays and anniversaries',
    colors: {
      primary: '#F59E0B',
      secondary: '#FCD34D',
      accent: '#EC4899',
      background: '#FEF3C7',
      text: '#BE185D',
      card: '#FFFFFF',
      border: '#FEE2E2',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'rounded',
      sectionSpacing: 'normal',
      accentStyle: 'gradient',
      buttonStyle: 'pill',
      shadowIntensity: 'light',
    },
    preview: ['#F59E0B', '#FCD34D', '#EC4899', '#FBCFE8'],
  },
  photo_focus: {
    key: 'photo_focus',
    label: 'Photo Focus',
    description: 'Minimal design to showcase photos',
    colors: {
      primary: '#374151',
      secondary: '#F3F4F6',
      accent: '#9CA3AF',
      background: '#FFFFFF',
      text: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB',
    },
    typography: {
      headingFont: 'sans-serif',
      bodyFont: 'sans-serif',
      headingWeight: 600,
      bodyWeight: 400,
    },
    style: {
      cardStyle: 'square',
      sectionSpacing: 'compact',
      accentStyle: 'solid',
      buttonStyle: 'square',
      shadowIntensity: 'none',
    },
    preview: ['#374151', '#F3F4F6', '#9CA3AF', '#FFFFFF'],
  },
};

// ============================================
// LAYOUT PRESETS
// ============================================

export const LAYOUT_PRESETS: LayoutPresetConfig[] = [
  {
    key: 'elegant_story',
    label: 'Elegant Story',
    description: 'Timeless layout with generous spacing and elegant typography',
    sectionSpacing: 'spacious',
    headingTreatment: 'elegant',
    cardShapes: 'rounded',
    contentFlow: 'stacked',
    previewEmoji: '✨',
  },
  {
    key: 'modern_romance',
    label: 'Modern Romance',
    description: 'Contemporary design with bold elements and grid layouts',
    sectionSpacing: 'normal',
    headingTreatment: 'bold',
    cardShapes: 'square',
    contentFlow: 'grid',
    previewEmoji: '💖',
  },
  {
    key: 'soft_scrapbook',
    label: 'Soft Scrapbook',
    description: 'Nostalgic feel with polaroid frames and decorative elements',
    sectionSpacing: 'spacious',
    headingTreatment: 'decorative',
    cardShapes: 'rounded',
    contentFlow: 'masonry',
    previewEmoji: '📖',
  },
  {
    key: 'minimal_keepsake',
    label: 'Minimal Keepsake',
    description: 'Clean and focused on your precious memories',
    sectionSpacing: 'compact',
    headingTreatment: 'minimal',
    cardShapes: 'square',
    contentFlow: 'carousel',
    previewEmoji: '💎',
  },
];

// ============================================
// SECTION TOGGLES - Refactored UX (Reduced from 24 to ~16)
// ============================================

export const SECTION_TOGGLES: SectionToggle[] = [
  // Core Required Sections
  {
    id: 'home',
    label: 'Home',
    description: 'Hero section showing your names, love message, and anniversary.',
    icon: '🏠',
    preview: 'hero-preview',
    required: true,
    defaultEnabled: true,
  },
  // Content Sections
  {
    id: 'love_letter',
    label: 'Love Letter',
    description: 'Your heartfelt message to your partner',
    icon: '💌',
    preview: 'letter-preview',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'our_story',
    label: 'Our Story',
    description: 'Share your relationship story in detail',
    icon: '📖',
    preview: 'story-preview',
    required: false,
    defaultEnabled: false,
  },
  // Timeline - Now handles first date, milestones, special moments
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Show the important moments of your love story (includes first date, milestones, special moments)',
    icon: '📅',
    preview: 'timeline-preview',
    required: false,
    defaultEnabled: true,
  },
  // Photo Sections - Gallery now supports grid, polaroid, carousel layouts
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Display photos from your relationship journey (grid, polaroid, or carousel)',
    icon: '📸',
    preview: 'gallery-preview',
    required: false,
    defaultEnabled: true,
  },
  // Music & Video
  {
    id: 'song',
    label: 'Song',
    description: 'Embed your special Spotify or YouTube song.',
    icon: '🎵',
    preview: 'song-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'playlist',
    label: 'Playlist',
    description: 'Share your relationship playlist',
    icon: '🎶',
    preview: 'playlist-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'video_memories',
    label: 'Video Memories',
    description: 'Share embedded video memories',
    icon: '🎬',
    preview: 'video-preview',
    required: false,
    defaultEnabled: false,
  },
  // Stats & Counters
  {
    id: 'relationship_stats',
    label: 'Relationship Stats',
    description: 'Show days, months, and hours together',
    icon: '📊',
    preview: 'stats-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'anniversary_countdown',
    label: 'Anniversary Countdown',
    description: 'Live countdown to your next anniversary',
    icon: '⏰',
    preview: 'countdown-preview',
    required: false,
    defaultEnabled: false,
  },
  // Dreams & Future
  {
    id: 'future_dreams',
    label: 'Future Dreams',
    description: 'Share your plans and dreams together',
    icon: '💭',
    preview: 'dreams-preview',
    required: false,
    defaultEnabled: false,
  },
  // Interactive Sections
  {
    id: 'quotes',
    label: 'Love Quotes',
    description: 'Display romantic love quotes',
    icon: '💕',
    preview: 'quotes-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'reasons_love_you',
    label: 'Reasons I Love You',
    description: 'List all the reasons you love them',
    icon: '💖',
    preview: 'reasons-preview',
    required: false,
    defaultEnabled: false,
  },
  // Guest & Messages
  {
    id: 'guest_messages',
    label: 'Guest Messages',
    description: 'Let friends and family leave messages',
    icon: '💬',
    preview: 'guest-preview',
    required: false,
    defaultEnabled: false,
  },
  // Special Features
  {
    id: 'letter_future',
    label: 'Letter to the Future',
    description: 'Write a message to open later',
    icon: '📮',
    preview: 'future-letter-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'gift_section',
    label: 'Gift Section',
    description: 'Display digital love gifts',
    icon: '🎁',
    preview: 'gift-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'surprise_message',
    label: 'Surprise Message',
    description: 'Hidden message reveal feature',
    icon: '🎉',
    preview: 'surprise-preview',
    required: false,
    defaultEnabled: false,
  },
  // Keepsake
  {
    id: 'qr_keepsake',
    label: 'QR Keepsake',
    description: 'A printable QR code card for physical keepsake',
    icon: '🎴',
    preview: 'qr-preview',
    required: false,
    defaultEnabled: false,
  },
  // Optional: Memory Map
  {
    id: 'memory_map',
    label: 'Memory Map',
    description: 'Show places you have visited together',
    icon: '🗺️',
    preview: 'map-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'birthday_message',
    label: 'Birthday Message',
    description: 'A personal birthday greeting for the celebrant',
    icon: '🎂',
    preview: 'birthday-message-preview',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'birthday_wishes',
    label: 'Birthday Wishes',
    description: 'Messages from friends and family to celebrate the birthday',
    icon: '🎈',
    preview: 'birthday-wishes-preview',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'birthday_countdown',
    label: 'Birthday Countdown',
    description: 'Live countdown timer to the birthday celebration',
    icon: '⏳',
    preview: 'birthday-countdown-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'birthday_timeline',
    label: 'Birthday Timeline',
    description: 'Highlight life milestones and memories for the celebrant',
    icon: '🎂',
    preview: 'birthday-timeline-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'party_details',
    label: 'Party Details',
    description: 'Set time, venue and dress code for the celebration',
    icon: '📍',
    preview: 'party-details-preview',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'gift_wishlist',
    label: 'Gift Wishlist',
    description: 'Share gift ideas and wishlist for the birthday',
    icon: '🎁',
    preview: 'gift-wishlist-preview',
    required: false,
    defaultEnabled: false,
  },
];

// ============================================
// BUILDER STEPS - 7 Steps for Love Website Wizard
// ============================================

export const BUILDER_STEPS: BuilderStep[] = [
  { 
    id: 1, 
    title: 'Your Details', 
    subtitle: "Let's start",
    section: 'your_details',
    isRequired: true,
  },
  { 
    id: 2, 
    title: 'Hero & Message', 
    subtitle: 'Your love story',
    section: 'hero_message',
    isRequired: true,
  },
  { 
    id: 3, 
    title: 'Choose Style', 
    subtitle: 'Pick the mood',
    section: 'choose_style',
    isRequired: true,
  },
  { 
    id: 4, 
    title: 'Page Layout', 
    subtitle: 'Select sections',
    section: 'page_layout',
    isRequired: true,
  },
  { 
    id: 5, 
    title: 'Templates', 
    subtitle: 'Design picks',
    section: 'templates',
    isRequired: true,
  },
  { 
    id: 6, 
    title: 'Content', 
    subtitle: 'Fill in your sections',
    section: 'content', 
    isRequired: false,
  },
  { 
    id: 7, 
    title: 'Review', 
    subtitle: 'Almost done!',
    section: 'review',
    isRequired: true,
  },
];

export const TOTAL_STEPS = 7;

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getThemePreset = (theme: Theme): ThemePresetConfig => {
  return THEME_PRESETS[theme];
};

export const getLayoutPreset = (layout: LayoutPreset): LayoutPresetConfig | undefined => {
  return LAYOUT_PRESETS.find(p => p.key === layout);
};

export const getSectionToggle = (section: Section): SectionToggle | undefined => {
  return SECTION_TOGGLES.find(t => t.id === section);
};

export const getEnabledSections = (toggles: Record<Section, boolean>): Section[] => {
  return Object.entries(toggles)
    .filter(([_, enabled]) => enabled)
    .map(([section]) => section as Section);
};

export const getDefaultSectionToggles = (): Record<Section, boolean> => {
  const toggles: Record<string, boolean> = {};
  SECTION_TOGGLES.forEach(toggle => {
    toggles[toggle.id] = toggle.defaultEnabled;
  });
  return toggles as Record<Section, boolean>;
};

