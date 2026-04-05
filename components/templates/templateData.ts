import { OccasionType } from '@/lib/types';
import { OCCASION_REGISTRY } from '@/lib/occasion-registry';

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

export const STARTER_TEMPLATES: StarterTemplate[] = Object.values(OCCASION_REGISTRY).map((meta, index) => ({
  id: `${meta.key}-signature`,
  occasion: meta.key,
  name: `${meta.label} Signature`,
  description: `Template crafted for ${meta.label.toLowerCase()} stories. ${meta.description}`,
  previewLabel: `${meta.label} Layout`,
  previewUrl: `https://example.com/template-preview/${meta.key}`,
  accentClass: OCCASION_TEMPLATE_ACCENTS[index % OCCASION_TEMPLATE_ACCENTS.length]!,
}));

export const getTemplatesByOccasion = (occasion: OccasionType): StarterTemplate[] => {
  return STARTER_TEMPLATES.filter((template) => template.occasion === occasion);
};

export const getTemplateById = (templateId?: string | null): StarterTemplate => {
  return STARTER_TEMPLATES.find((template) => template.id === templateId) || STARTER_TEMPLATES[0]!;
};
