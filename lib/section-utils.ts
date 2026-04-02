import { useTheme } from '@/components/builder/ThemeWrapper';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';

/**
 * Get section background class based on rendered index for alternation
 * even index (0,2,4...): sectionBg (e.g. bg-white)
 * odd index (1,3,5...): sectionBgAlt (e.g. bg-rose-50/50)
 */
export function getSectionBgClass(theme: ThemeKey, index: number): string {
  const styles = getThemeStyles(theme);
  return index % 2 === 0 ? styles.sectionBg : styles.sectionBgAlt;
}

/**
 * React hook version (uses context, requires ThemeWrapper)
 */
export function useSectionBg(theme: ThemeKey, index: number): string {
  const styles = useTheme(theme);
  return index % 2 === 0 ? styles.sectionBg : styles.sectionBgAlt;
}

/**
 * Get variant for compatibility
 */
export function getSectionVariant(index: number): 'default' | 'alt' {
  return index % 2 === 0 ? 'default' : 'alt';
}

export function useSectionVariant(index: number): 'default' | 'alt' {
  return getSectionVariant(index);
}
