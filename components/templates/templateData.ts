import { OccasionType } from '@/lib/types';
import { PRESET_REGISTRY } from '@/lib/preset-registry';

export interface StarterTemplate {
  id: string;
  occasion: OccasionType;
  name: string;
  description: string;
  previewLabel: string;
  previewUrl: string;
  accentClass: string;
}

const OCCASION_TEMPLATE_ACCENTS = [
  'from-rose-100 via-orange-50 to-pink-100',
  'from-slate-100 via-zinc-50 to-blue-100',
  'from-indigo-100 via-sky-50 to-cyan-100',
  'from-emerald-100 via-lime-50 to-teal-100',
  'from-fuchsia-100 via-purple-50 to-violet-100',
  'from-amber-100 via-yellow-50 to-orange-100',
];

export const STARTER_TEMPLATES: StarterTemplate[] = PRESET_REGISTRY.map((preset, index) => ({
  id: preset.id,
  occasion: preset.siteType,
  name: preset.label,
  description: preset.description,
  previewLabel: `${preset.badge} Template`,
  previewUrl: `https://example.com/template-preview/${preset.id}`,
  accentClass: OCCASION_TEMPLATE_ACCENTS[index % OCCASION_TEMPLATE_ACCENTS.length]!,
}));

export const getTemplatesByOccasion = (occasion: OccasionType): StarterTemplate[] => {
  return STARTER_TEMPLATES.filter((template) => template.occasion === occasion);
};

export const getTemplateById = (templateId?: string | null): StarterTemplate => {
  return STARTER_TEMPLATES.find((template) => template.id === templateId) || STARTER_TEMPLATES[0]!;
};
