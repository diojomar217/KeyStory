import type { OccasionType } from '@/lib/types';
import { OCCASION_REGISTRY } from '@/lib/occasion-registry';
import type { ThemeKey } from '@/config/themeConfig';

export function getOccasionThemeRecommendations(occasion?: OccasionType): {
  defaultTheme?: ThemeKey;
  supportedThemes: ThemeKey[];
  occasionLabel?: string;
} {
  if (!occasion) {
    return { supportedThemes: [] };
  }

  const metadata = OCCASION_REGISTRY[occasion];
  if (!metadata) {
    return { supportedThemes: [] };
  }

  return {
    defaultTheme: metadata.defaultTheme,
    supportedThemes: metadata.supportedThemes,
    occasionLabel: metadata.label,
  };
}
