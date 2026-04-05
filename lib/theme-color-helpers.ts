/**
 * Theme color helper utilities
 * Provides functions to extract and map theme colors to usable values
 */

import type { ThemeKey } from '@/config/themeConfig';
import { THEME_CONFIG } from '@/config/themeConfig';

/**
 * Get the full theme configuration for a given theme
 */
export function getThemeConfig(theme: ThemeKey) {
  return THEME_CONFIG[theme];
}

/**
 * Get only the color values for a theme
 */
export function getThemeColors(theme: ThemeKey) {
  const config = getThemeConfig(theme);
  return config.colors;
}

/**
 * Get typography settings for a theme
 */
export function getThemeTypography(theme: ThemeKey) {
  const config = getThemeConfig(theme);
  return config.typography;
}

/**
 * Get style settings (card style, spacing, button style, etc.) for a theme
 */
export function getThemeStyle(theme: ThemeKey) {
  const config = getThemeConfig(theme);
  return config.style;
}

/**
 * Get Tailwind heading font class based on theme typography
 */
export function getHeadingFontClass(theme: ThemeKey): string {
  const { headingFont } = getThemeTypography(theme);
  const fontMap: Record<string, string> = {
    serif: 'font-serif',
    cursive: 'font-cursive',
    'sans-serif': 'font-sans',
  };
  return fontMap[headingFont] || 'font-sans';
}

/**
 * Get Tailwind body font class based on theme typography
 */
export function getBodyFontClass(theme: ThemeKey): string {
  const { bodyFont } = getThemeTypography(theme);
  const fontMap: Record<string, string> = {
    serif: 'font-serif',
    cursive: 'font-cursive',
    'sans-serif': 'font-sans',
  };
  return fontMap[bodyFont] || 'font-sans';
}

/**
 * Get Tailwind card style classes based on theme style settings
 */
export function getCardStyleClasses(theme: ThemeKey): string {
  const { cardStyle } = getThemeStyle(theme);
  switch (cardStyle) {
    case 'rounded':
      return 'rounded-lg';
    case 'pill':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    default:
      return 'rounded-lg';
  }
}

/**
 * Get Tailwind button style classes based on theme style settings
 */
export function getButtonStyleClasses(theme: ThemeKey): string {
  const { buttonStyle } = getThemeStyle(theme);
  switch (buttonStyle) {
    case 'rounded':
      return 'rounded-lg';
    case 'pill':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'soft':
      return 'rounded-md';
    default:
      return 'rounded-lg';
  }
}

/**
 * Get Tailwind shadow class based on theme style settings
 */
export function getShadowClass(theme: ThemeKey): string {
  const { shadowIntensity } = getThemeStyle(theme);
  switch (shadowIntensity) {
    case 'none':
      return 'shadow-none';
    case 'light':
      return 'shadow-sm';
    case 'medium':
      return 'shadow-md';
    case 'heavy':
      return 'shadow-lg';
    default:
      return 'shadow-md';
  }
}

/**
 * Get section spacing padding classes based on theme style settings
 */
export function getSectionSpacingClass(theme: ThemeKey): string {
  const { sectionSpacing } = getThemeStyle(theme);
  switch (sectionSpacing) {
    case 'compact':
      return 'py-8 px-4';
    case 'spacious':
      return 'py-20 px-4';
    case 'normal':
    default:
      return 'py-16 px-4';
  }
}

/**
 * Map hex color to closest Tailwind color with intensity
 * Used for applying theme colors as Tailwind classes
 * Returns something like 'text-rose-900' based on theme primary color
 */
export function mapHexToTailwindClass(
  hex: string,
  type: 'text' | 'bg' | 'border' = 'text'
): string {
  const colorMap: Record<string, string> = {
    // Reds/Roses
    '#BE185D': 'rose-900',
    '#DB2777': 'rose-600',
    '#EC4899': 'pink-500',
    '#F472B6': 'pink-400',
    '#FBCFE8': 'pink-200',
    
    // Purples
    '#A855F7': 'purple-600',
    '#A78BFA': 'purple-400',
    '#C4B5FD': 'purple-300',
    '#EDE9FE': 'purple-100',
    '#7C3AED': 'purple-600',
    '#5B21B6': 'purple-900',

    // Yellows/Gold
    '#FEF3C7': 'yellow-100',
    '#FDE68A': 'yellow-300',
    '#D4AF37': 'yellow-500',
    '#FBBF24': 'amber-400',
    '#F59E0B': 'amber-500',

    // Neutrals/Blacks
    '#1F2937': 'gray-800',
    '#111827': 'slate-900',
    '#09090B': 'zinc-950',
    '#27272A': 'zinc-700',
    '#18181B': 'zinc-800',
    '#3F3F46': 'zinc-700',

    // Light/Whites
    '#FFFFFF': 'white',
    '#F9FAFB': 'gray-50',
    '#F3F4F6': 'gray-100',
    '#FAFAF9': 'stone-50',
    '#FAF5FF': 'purple-50',
    '#FDF2F8': 'pink-50',
    '#FFF1F2': 'rose-50',
    '#FDF4FF': 'purple-50',
    '#FFFBEB': 'amber-50',

    // Text colors (darker)
    '#831843': 'rose-900',
    '#451A03': 'amber-950',
    '#7C2D12': 'orange-950',
    '#1C1917': 'stone-900',
    '#FAFAFA': 'zinc-50',

    // Grays/Accents
    '#6B7280': 'gray-500',
    '#9CA3AF': 'gray-400',
    '#E5E7EB': 'gray-200',
    '#D6D3D1': 'stone-300',
    '#FDBA74': 'orange-200',
  };

  const tailwindColor = colorMap[hex];
  if (!tailwindColor) return `${type}-gray-500`; // fallback

  return `${type}-${tailwindColor}`;
}

/**
 * Apply hex color as inline style (for complex colors not in Tailwind)
 */
export function getColorStyle(hex: string, type: 'text' | 'bg' | 'border' = 'text') {
  switch (type) {
    case 'text':
      return { color: hex };
    case 'bg':
      return { backgroundColor: hex };
    case 'border':
      return { borderColor: hex };
    default:
      return {};
  }
}

/**
 * Detect if a theme has a dark background (based on actual luminance, not vibe)
 * Works for dark_elegant, luxury_gold, and any future dark-themed variants
 */
export function isDarkTheme(theme: ThemeKey): boolean {
  const config = getThemeConfig(theme);
  const bgColor = config.colors.background;
  
  // Calculate luminance of the background color
  // Light colors (luminance > 0.5) = light themes, dark colors = dark themes
  return isColorDark(bgColor);
}

/**
 * Helper: Check if a hex color is dark using WCAG relative luminance formula
 */
function isColorDark(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Use relative luminance formula from WCAG
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5; // Dark if luminance is less than 50%
}

/**
 * Detect if a theme uses light text on dark background
 * Useful for footer, header, and overlay text color logic
 */
export function isBrightTextTheme(theme: ThemeKey): boolean {
  const { text } = getThemeColors(theme);
  // If text color starts with F or is very light (#FFF, #F5F5F5, etc.)
  return text.toUpperCase().startsWith('#F') || text.toUpperCase().startsWith('#E');
}

/**
 * Get footer text color based on theme's natural contrast
 * Returns theme-aware colors for dark themes, white for light themes
 * Replaces scattered `theme === 'dark_elegant'` checks
 */
export function getFooterTextColors(theme: ThemeKey) {
  const colors = getThemeColors(theme);
  
  if (isDarkTheme(theme)) {
    // For dark themes (dark_elegant, luxury_gold, etc.), use theme's text color with opacity
    return {
      title: colors.text,
      body: `${colors.text}D9`, // 85% opacity
      faint: `${colors.text}99`, // 60% opacity
    };
  }
  
  // For light themes, use white text (assuming dark footer background)
  return {
    title: '#FFFFFF',
    body: 'rgba(255, 255, 255, 0.84)', // 84% opacity
    faint: 'rgba(255, 255, 255, 0.62)', // 62% opacity
  };
}
