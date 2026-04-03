import type { LayoutPreset, Section, SiteConfig } from '@/lib/types';
import { SECTION_TEMPLATE_MAP, type TemplateSectionKey } from '@/config/templateConfig';

const LAYOUT_TEMPLATE_MAP: Record<LayoutPreset, Partial<Record<TemplateSectionKey, string>>> = {
  elegant_story: {
    hero: 'hero_centered',
    gallery: 'grid',
    timeline: 'vertical_timeline',
    song: 'visual_player',
    love_letter: 'classic_letter',
    qr_keepsake: 'qr_card',
  },
  modern_romance: {
    hero: 'split_layout',
    gallery: 'carousel',
    timeline: 'milestone_cards',
    song: 'visual_player',
    love_letter: 'floral_border',
    qr_keepsake: 'qr_ornament',
  },
  soft_scrapbook: {
    hero: 'fullscreen_banner',
    gallery: 'polaroid',
    timeline: 'story_chapters',
    song: 'lyrics_card',
    love_letter: 'handwritten',
    qr_keepsake: 'qr_ornament',
  },
  minimal_keepsake: {
    hero: 'hero_centered',
    gallery: 'carousel',
    timeline: 'vertical_timeline',
    song: 'minimal_player',
    love_letter: 'classic_letter',
    qr_keepsake: 'qr_mini',
  },
  celebration_flow: {
    hero: 'split_layout',
    gallery: 'grid',
    timeline: 'milestone_cards',
    song: 'visual_player',
    love_letter: 'floral_border',
    qr_keepsake: 'qr_card',
  },
  editorial_timeline: {
    hero: 'hero_centered',
    gallery: 'grid',
    timeline: 'story_chapters',
    song: 'lyrics_card',
    love_letter: 'classic_letter',
    qr_keepsake: 'qr_card',
  },
  photo_showcase: {
    hero: 'fullscreen_banner',
    gallery: 'polaroid',
    timeline: 'milestone_cards',
    song: 'visual_player',
    love_letter: 'handwritten',
    qr_keepsake: 'qr_ornament',
  },
};

function buildTemplateAssignments(layoutPreset: LayoutPreset, sections: Section[] = []): Partial<Record<Section, string>> {
  const templateByGroup = LAYOUT_TEMPLATE_MAP[layoutPreset] || {};
  const targetSections = sections.length > 0 ? sections : (Object.keys(SECTION_TEMPLATE_MAP) as Section[]);

  return targetSections.reduce<Partial<Record<Section, string>>>((acc, sectionKey) => {
    const groupKey = SECTION_TEMPLATE_MAP[sectionKey];
    if (!groupKey) return acc;

    const selectedTemplate = templateByGroup[groupKey];
    if (!selectedTemplate) return acc;

    acc[sectionKey] = selectedTemplate;
    return acc;
  }, {});
}

export function applyLayoutPresetToConfig(
  currentConfig: SiteConfig,
  layoutPreset: LayoutPreset
): Partial<SiteConfig> {
  const templateAssignments = buildTemplateAssignments(layoutPreset, currentConfig.sections || []);
  const nextTemplates = {
    ...(currentConfig.templates || {}),
    ...templateAssignments,
  };
  const nextSectionTemplates = {
    ...(currentConfig.section_templates || {}),
    ...templateAssignments,
  };

  return {
    layout_preset: layoutPreset,
    templates: nextTemplates,
    section_templates: nextSectionTemplates,
    // Keep legacy fields synced because some parts of the builder/public stack still read them.
    home_template: (nextTemplates.home || currentConfig.home_template) as string | undefined,
    gallery_template: (nextTemplates.gallery || currentConfig.gallery_template) as string | undefined,
    timeline_template: (nextTemplates.timeline || currentConfig.timeline_template) as string | undefined,
    song_template: (nextTemplates.song || currentConfig.song_template) as string | undefined,
  };
}
