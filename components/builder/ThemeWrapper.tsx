'use client';


import type { ReactNode } from 'react';
import { ThemeKey } from '@/config/themeConfig';
import { ThemeStyles, getThemeStyles } from '@/config/themeStyles';
import { getThemeColors, getThemeTypography, getHeadingFontClass, getBodyFontClass } from '@/lib/theme-color-helpers';

type Props = {
  theme: ThemeKey;
  children: ReactNode;
  className?: string;
};


export default function ThemeWrapper({ theme, children, className = '' }: Props) {
  const styles: ThemeStyles = getThemeStyles(theme);
  const colors = getThemeColors(theme);
  const typography = getThemeTypography(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const bodyFontClass = getBodyFontClass(theme);

  // CSS variables for use in sections that can't use Tailwind classes
  const cssVars = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-text': colors.text,
    '--color-card': colors.card,
    '--color-border': colors.border,
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.bg} ${styles.text} ${bodyFontClass} min-h-screen w-full ${className}`}
      style={cssVars}
    >
      {children}
    </div>
  );
}

export function useTheme(theme: ThemeKey): ThemeStyles {
  return getThemeStyles(theme);
}

/**
 * Hook to get theme colors and style helpers
 */
export function useThemeUtils(theme: ThemeKey) {
  return {
    colors: getThemeColors(theme),
    typography: getThemeTypography(theme),
    styles: getThemeStyles(theme),
    headingFontClass: getHeadingFontClass(theme),
    bodyFontClass: getBodyFontClass(theme),
  };
}

