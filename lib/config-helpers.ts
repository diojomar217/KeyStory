// Helper functions for config-driven builder logic
import { SITE_TYPE_CONFIG } from '@/config/siteTypeConfig';
import { SECTION_CONFIG } from '@/config/sectionConfig';
import { TEMPLATE_CONFIG } from '@/config/templateConfig';
import { THEME_CONFIG } from '@/config/themeConfig';

// 1. Get allowed sections for a site type
export function getAllowedSections(siteType) {
  const config = SITE_TYPE_CONFIG[siteType];
  if (!config) return [];
  return config.sections || [];
}

// 2. Get templates for a section
// Map section keys to template config group keys
const SECTION_TO_TEMPLATE_GROUP = {
  home: 'hero',
  gallery: 'gallery',
  timeline: 'timeline',
  song: 'song',
  // Add more mappings as needed
};

export function getTemplatesForSection(sectionKey) {
  const groupKey = SECTION_TO_TEMPLATE_GROUP[sectionKey] || sectionKey;
  // TEMPLATE_CONFIG[groupKey] is an array of templates
  return Array.isArray(TEMPLATE_CONFIG[groupKey]) ? TEMPLATE_CONFIG[groupKey] : [];
}

// 3. Get default selections for a site type
export function getDefaultSelections(siteType) {
  const config = SITE_TYPE_CONFIG[siteType];
  if (!config) return {};
  return {
    defaultSections: config.defaultSections || [],
    defaultTemplates: config.defaultTemplates || {},
    defaultTheme: config.defaultTheme || null,
  };
}

// 4. Get theme config by key
export function getThemeConfig(themeKey) {
  return THEME_CONFIG[themeKey] || null;
}
