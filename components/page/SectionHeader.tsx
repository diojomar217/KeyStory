'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { getThemeVibe } from '@/config/themeConfig';
import { getThemeAccentClasses } from '@/config/themeStyles';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  theme: ThemeKey;
  className?: string;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  theme,
  className = '',
}: SectionHeaderProps) {
  const accents = getThemeAccentClasses(theme);
  const vibe = getThemeVibe(theme);

  const shouldShimmer = vibe === 'romantic' || vibe === 'luxury';
  const shouldGlowIcon = vibe === 'cute' || vibe === 'playful';
  const shouldUseSoftSubtitle = vibe === 'soft';

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
      <h2 className={`section-title text-2xl md:text-3xl font-bold tracking-tight ${accents.title}`}>
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

      {/* Divider */}
      <div
        className={[
          'mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r opacity-80 transition-all duration-300',
          accents.line,
          shouldShimmer ? 'shimmer-rose' : '',
        ].join(' ')}
      />
    </div>
  );
}