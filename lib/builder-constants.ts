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
// THEME PRESETS
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
// SECTION TOGGLES
// ============================================

export const SECTION_TOGGLES: SectionToggle[] = [
  {
    id: 'home',
    label: 'Hero Section',
    description: 'The welcome page with your love story introduction',
    icon: '🏠',
    required: true,
    defaultEnabled: true,
  },
  {
    id: 'love_letter',
    label: 'Love Letter',
    description: 'Your heartfelt message to your partner',
    icon: '💌',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Your journey of love through time',
    icon: '📅',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Share your precious photos together',
    icon: '📸',
    required: false,
    defaultEnabled: true,
  },
  {
    id: 'song',
    label: 'Music',
    description: 'Your special song that defines your relationship',
    icon: '🎵',
    required: false,
    defaultEnabled: false,
  },
  {
    id: 'qr_keepsake',
    label: 'QR Keepsake',
    description: 'A printable QR code card for physical keepsake',
    icon: '🎴',
    required: false,
    defaultEnabled: false,
  },
];

// ============================================
// BUILDER STEPS
// ============================================

export const BUILDER_STEPS: BuilderStep[] = [
  { 
    id: 1, 
    title: 'Couple Details', 
    subtitle: 'Let\'s start with the basics',
    section: 'couple_details',
    isRequired: true,
  },
  { 
    id: 2, 
    title: 'Hero Section', 
    subtitle: 'Your love story begins here',
    section: 'hero_section',
    isRequired: true,
  },
  { 
    id: 3, 
    title: 'Love Letter', 
    subtitle: 'Write your heartfelt message',
    section: 'love_letter',
    isRequired: false,
  },
  { 
    id: 4, 
    title: 'Timeline', 
    subtitle: 'Your journey together',
    section: 'timeline',
    isRequired: false,
  },
  { 
    id: 5, 
    title: 'Gallery', 
    subtitle: 'Add your precious moments',
    section: 'gallery',
    isRequired: false,
  },
  { 
    id: 6, 
    title: 'Music', 
    subtitle: 'Your special song',
    section: 'music',
    isRequired: false,
  },
  { 
    id: 7, 
    title: 'Theme & Style', 
    subtitle: 'Choose your look',
    section: 'theme_style',
    isRequired: true,
  },
  { 
    id: 8, 
    title: 'Review & Publish', 
    subtitle: 'Almost there!',
    section: 'review_publish',
    isRequired: true,
  },
];

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

