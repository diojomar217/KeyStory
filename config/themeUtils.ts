import type { ThemeKey } from '@/config/themeConfig';
import { THEME_CONFIG } from '@/config/themeConfig';

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
  muted: string;
};

export function getThemeColors(theme: ThemeKey): ThemeColors {
  const preset = THEME_CONFIG[theme as ThemeKey] || THEME_CONFIG.romantic_classic;
  // Use a valid muted color for each theme
  let muted = '#6B7280'; // default gray-500
  switch (theme) {
    case 'romantic_classic':
      muted = '#9D174D'; // rose-700
      break;
    case 'cute_pastel':
      muted = '#6D28D9'; // purple-700
      break;
    case 'minimal_modern':
      muted = '#374151'; // slate-700
      break;
    default:
      muted = '#6B7280';
  }
  return {
    primary: preset.colors.primary,
    secondary: preset.colors.secondary,
    accent: preset.colors.accent,
    background: preset.colors.background,
    text: preset.colors.text,
    card: preset.colors.card,
    border: preset.colors.border,
    muted,
  };
}
