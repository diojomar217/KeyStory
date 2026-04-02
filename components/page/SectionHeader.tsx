'use client';

import { getOccasionHeroSpec } from '../../config/occasionHeroConfig';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeVibe } from '@/config/themeConfig';
import { getThemeAccentClasses } from '@/config/themeStyles';
import type { OccasionType } from '@/lib/types';
import { useOccasionType } from './OccasionContext';
import { useThemeUtils } from '../builder/ThemeWrapper';
import { getHeadingFontClass } from '@/lib/theme-color-helpers';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  theme: ThemeKey;
  className?: string;
  siteType?: OccasionType;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  theme,
  className = '',
  siteType,
}: SectionHeaderProps) {
  const contextOccasion = useOccasionType();
  const resolvedSiteType = siteType || contextOccasion;
  const occasionHero = getOccasionHeroSpec(resolvedSiteType);
  const accents = getThemeAccentClasses(theme);
  const vibe = getThemeVibe(theme);
  const themeUtils = useThemeUtils(theme);
  const headingFontClass = getHeadingFontClass(theme);

  const shouldShimmer = vibe === 'romantic' || vibe === 'luxury';
  const shouldGlowIcon = vibe === 'cute' || vibe === 'playful';
  const shouldUseSoftSubtitle = vibe === 'soft';

  if (resolvedSiteType === 'wedding') {
    return (
      <div className={`section-header text-center mb-12 ${className}`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/75 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-700 shadow-sm backdrop-blur-md">
          <span>{icon || occasionHero.badge}</span>
          Ceremony Chapter
        </div>
        <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-amber-950 md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-amber-800/80 md:text-base">
            {subtitle}
          </p>
        )}
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-4 text-amber-400/80">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
          <span className="text-lg">{occasionHero.badge}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>
      </div>
    );
  }

  if (resolvedSiteType === 'memorial') {
    return (
      <div className={`section-header text-center mb-12 ${className}`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55 backdrop-blur-md">
          <span>{icon || occasionHero.badge}</span>
          Tribute Chapter
        </div>
        <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
            {subtitle}
          </p>
        )}
        <div className="mx-auto mt-6 h-px w-28 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>
    );
  }

  if (resolvedSiteType === 'travel') {
    return (
      <div className={`section-header text-center mb-12 ${className}`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm">
          <span>{icon || occasionHero.badge}</span>
          Route Stop
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {subtitle}
          </p>
        )}
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 text-slate-400">
          <span className="text-base">{occasionHero.badge}</span>
          <div className="h-px flex-1 border-t border-dashed border-slate-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Journal Marker</span>
          <div className="h-px flex-1 border-t border-dashed border-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={`section-header text-center mb-10 ${className}`}>
      {/* Icon */}
      {icon && (
        <div
          className={[
            'mx-auto mb-2 text-3xl',
            accents.icon,
            shouldGlowIcon ? 'drop-shadow-[0_0_8px_rgba(244,114,182,0.25)]' : '',
          ].join(' ')}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h2 className={`section-title text-2xl md:text-3xl font-bold tracking-tight ${accents.title} ${headingFontClass}`}>
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={[
            'section-subtitle mt-3 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide max-w-md mx-auto',
            shouldUseSoftSubtitle ? 'font-normal opacity-90' : 'font-medium',
            accents.subtitle,
          ].join(' ')}
        >
          {subtitle}
        </p>
      )}

      {/* Divider - use theme accent color */}
      <div
        className={[
          'mx-auto mt-4 h-1 w-16 rounded-full opacity-80 transition-all duration-300',
          shouldShimmer ? 'shimmer-rose' : '',
        ].join(' ')}
        style={{
          backgroundImage: `linear-gradient(to right, ${themeUtils.colors.primary}, ${themeUtils.colors.accent}, ${themeUtils.colors.primary})`
        }}
      />
    </div>
  );
}