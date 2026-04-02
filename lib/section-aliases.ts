import type { Section } from './types';

export const SECTION_ALIAS_MAP = {
  first_date: 'timeline',
  special_moments: 'timeline',
  milestones: 'timeline',
  polaroid_gallery: 'gallery',
} as const satisfies Partial<Record<Section, Section>>;

export function resolveSectionAlias(section: Section): Section {
  const aliasMap: Partial<Record<Section, Section>> = SECTION_ALIAS_MAP;
  return aliasMap[section] ?? section;
}