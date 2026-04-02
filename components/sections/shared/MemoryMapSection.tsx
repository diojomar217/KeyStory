'use client';

import type { MemoryMapLocation, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import dynamic from 'next/dynamic';
import { getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface MemoryMapSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  locations?: MemoryMapLocation[];
}

const MemoryMap = dynamic(() => import('./MemoryMap'), {
  ssr: false,
});

export default function MemoryMapSection({ theme, siteType = 'couple', locations }: MemoryMapSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const spacingClass = getSectionSpacingClass(theme);

  const displayLocations = locations || [];

  return (
    <section
      id="memory-map"
      className={`relative ${spacingClass}`}
      style={{ color: themeUtils.colors.text }}
    >
      <div className="max-w-4xl mx-auto">
        {(() => {
          const copy = getSectionCopy('memory_map', siteType);
          return (
            <ScrollReveal>
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            </ScrollReveal>
          );
        })()}

        <MemoryMap locations={displayLocations} />
      </div>
    </section>
  );
}