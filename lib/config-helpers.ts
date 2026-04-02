// Helper functions for config-driven builder logic
import { SITE_TYPE_CONFIG } from '@/config/siteTypeConfig';
import { getTemplatesForSection as getTemplatesForSectionFromConfig } from '@/config/templateConfig';
import { THEME_CONFIG } from '@/config/themeConfig';
import type { SiteTypeKey } from '@/config/siteTypeConfig';
import type { Section } from '@/lib/types';

type ThemeConfigKey = keyof typeof THEME_CONFIG;

// 1. Get allowed sections for a site type
export function getAllowedSections(siteType: SiteTypeKey): Section[] {
  const config = SITE_TYPE_CONFIG[siteType];
  if (!config) return [];
  return config.sections || [];
}

export function getTemplatesForSection(sectionKey: Section) {
  return getTemplatesForSectionFromConfig(sectionKey);
}

// 3. Get default selections for a site type
export function getDefaultSelections(siteType: SiteTypeKey) {
  const config = SITE_TYPE_CONFIG[siteType];
  if (!config) {
    return {
      defaultSections: [],
      defaultTemplates: {},
      defaultTheme: null,
    };
  }

  return {
    defaultSections: config.sections || [],
    defaultTemplates: {},
    defaultTheme: null,
  };
}

// 4. Get theme config by key
export function getThemeConfig(themeKey: ThemeConfigKey | null | undefined) {
  if (!themeKey) {
    return null;
  }

  return THEME_CONFIG[themeKey] || null;
}
