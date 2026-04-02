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

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return `rgba(107,114,128,${alpha})`;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getThemeColors(theme: ThemeKey): ThemeColors {
  const preset = THEME_CONFIG[theme as ThemeKey] || THEME_CONFIG.romantic_classic;
  const muted = hexToRgba(preset.colors.text, 0.68);

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
