'use client';

import type { MemoryMapLocation, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import { useTheme } from '../../builder/ThemeWrapper';
import dynamic from 'next/dynamic';
import { THEME_CONFIG } from '@/config/themeConfig';

interface MemoryMapSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  locations?: MemoryMapLocation[];
}

const MemoryMap = dynamic(() => import('./MemoryMap'), {
  ssr: false,
});

export default function MemoryMapSection({ theme, siteType = 'couple', locations }: MemoryMapSectionProps) {
  const styles = useTheme(theme);
  const themeConfig = THEME_CONFIG[theme];
  const { colors, typography } = themeConfig;

  const displayLocations = locations || [];

  return (
    <section
      id="memory-map"
      className="relative py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {(() => {
          const copy = getSectionCopy('memory_map', siteType);
          return (
            <SectionHeader
              icon={copy.icon}
              title={copy.title}
              subtitle={copy.subtitle}
              theme={theme}
            />
          );
        })()}

        <MemoryMap locations={displayLocations} />
      </div>
    </section>
  );
}