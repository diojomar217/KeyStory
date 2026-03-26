'use client';

import { Theme, MemoryMapLocation } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { useTheme } from '../../builder/ThemeWrapper';
import dynamic from 'next/dynamic';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface MemoryMapSectionProps {
  theme: Theme;
  locations?: MemoryMapLocation[];
}

const MemoryMap = dynamic(() => import('./MemoryMap'), {
  ssr: false,
});

export default function MemoryMapSection({ theme, locations }: MemoryMapSectionProps) {
  const styles = useTheme(theme);
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  const displayLocations = locations || [];

  return (
    <section
      id="memory-map"
      className="relative py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          icon="🗺️"
          title="Our Memory Map"
          subtitle="Places that hold special memories in our relationship"
          theme={theme}
        />

        <MemoryMap locations={displayLocations} />
      </div>
    </section>
  );
}