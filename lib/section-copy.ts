// lib/getSectionCopy.ts
import type { SiteTypeKey } from '@/config/siteTypeConfig';
import {
  SECTION_COPY_CONFIG,
  type SectionCopyBySiteType,
  type SectionCopyContext,
  type SectionCopyKey,
} from '@/config/sectionCopyConfig';

function resolveCopyValue(
  value: string | ((context?: SectionCopyContext) => string),
  context?: SectionCopyContext
) {
  return typeof value === 'function' ? value(context) : value;
}

export function getSectionCopy(
  sectionKey: SectionCopyKey,
  siteType?: SiteTypeKey,
  context?: SectionCopyContext
) {
  const config = SECTION_COPY_CONFIG[sectionKey] as SectionCopyBySiteType;

  const selected =
    (siteType ? config[siteType] : undefined) ?? config.default;

  return {
    title: resolveCopyValue(selected.title, context),
    subtitle: resolveCopyValue(selected.subtitle, context),
    icon: selected.icon ?? '',
    emptyState: selected.emptyState
      ? resolveCopyValue(selected.emptyState, context)
      : '',
    formTitle: selected.formTitle
      ? resolveCopyValue(selected.formTitle, context)
      : '',
    submitLabel: selected.submitLabel
      ? resolveCopyValue(selected.submitLabel, context)
      : '',
  };
}