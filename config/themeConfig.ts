// config/themeConfig.ts

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export interface ThemeTypography {
  headingFont: 'serif' | 'sans-serif' | 'cursive';
  bodyFont: 'serif' | 'sans-serif' | 'cursive';
  headingWeight: number;
  bodyWeight: number;
}

export interface ThemeStyleSettings {
  cardStyle: 'rounded' | 'pill' | 'square';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  accentStyle: 'solid' | 'gradient' | 'outline';
  buttonStyle: 'rounded' | 'pill' | 'square' | 'soft';
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
}

export type ThemeVibe =
  | 'romantic'
  | 'cute'
  | 'minimal'
  | 'luxury'
  | 'vintage'
  | 'playful'
  | 'soft';

export interface ThemeDefinition {
  key: string;
  label: string;
  description: string;
  vibe: ThemeVibe;
  colors: ThemeColors;
  typography: ThemeTypography;
  style: ThemeStyleSettings;
  preview: readonly [string, string, string, string];
}

export const THEME_CONFIG = {
  romantic_classic: {
    key: 'romantic_classic',
    label: 'Romantic Classic',
    description: 'Timeless elegance with roses and soft pinks',
    vibe: 'romantic',
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
    description: 'Soft and dreamy vibes with pastel tones',
    vibe: 'cute',
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
    description: 'Clean and sophisticated with sleek modern lines',
    vibe: 'minimal',
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
    description: 'Bold and luxurious with dark tones and gold accents',
    vibe: 'luxury',
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
    vibe: 'soft',
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
    vibe: 'luxury',
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
    description: 'Nostalgic paper-and-ink love letter aesthetic',
    vibe: 'vintage',
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
    description: 'Crafty scrapbook layout with warm handmade charm',
    vibe: 'playful',
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
    description: 'Elegant wedding invitation inspired design',
    vibe: 'romantic',
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
    description: 'Soft florals and delicate pink romance',
    vibe: 'romantic',
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
    description: 'Soft dreamy pink atmosphere with a sweet glow',
    vibe: 'romantic',
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
    description: 'Premium black and gold luxury aesthetic',
    vibe: 'luxury',
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
    vibe: 'minimal',
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
    description: 'Playful kawaii style with cute colors and cheerful energy',
    vibe: 'cute',
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
    description: 'Calming lavender tones with a gentle dreamy mood',
    vibe: 'soft',
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
    preview: ['#7C3AED', '#EDE9FE', '#A78BFA', '#FAFAF5'],
    // keep last preview if you want; above is slightly softened
  },

  colorful_celebration: {
    key: 'colorful_celebration',
    label: 'Colorful Celebration',
    description: 'Festive and joyful colors for birthdays and celebrations',
    vibe: 'playful',
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
    description: 'Clean layout designed to let photos stand out',
    vibe: 'minimal',
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
} as const satisfies Record<string, ThemeDefinition>;

export type ThemeKey = keyof typeof THEME_CONFIG;
export const THEME_KEYS = Object.keys(THEME_CONFIG) as ThemeKey[];

export type ThemeConfig = (typeof THEME_CONFIG)[ThemeKey];

export function getThemeConfig(theme: ThemeKey): ThemeConfig {
  return THEME_CONFIG[theme];
}

export function isThemeKey(value: string): value is ThemeKey {
  return value in THEME_CONFIG;
}

export function isRomanticTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'romantic';
}

export function isCuteTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'cute';
}

export function isMinimalTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'minimal';
}

export function isLuxuryTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'luxury';
}

export function isVintageTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'vintage';
}

export function isPlayfulTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'playful';
}

export function isSoftTheme(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe === 'soft';
}

export function getThemeVibe(theme: ThemeKey) {
  return THEME_CONFIG[theme].vibe;
}