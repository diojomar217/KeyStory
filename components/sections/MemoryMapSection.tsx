'use client';

import { Theme, MemoryMapLocation } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';
import MemoryMap from './MemoryMap';

interface MemoryMapSectionProps {
  theme: Theme;
  locations?: MemoryMapLocation[];
}

export default function MemoryMapSection({ theme, locations }: MemoryMapSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  // Use provided locations or empty array (MemoryMap handles empty state)
  const displayLocations = locations || [];

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🗺️ Our Memory Map
        </h2>
        
        <p 
          className="text-center mb-8"
          style={{ color: colors.text }}
        >
          Places that hold special memories in our relationship
        </p>
        
        {/* Interactive Map */}
        <MemoryMap locations={displayLocations} />
      </div>
    </section>
  );
}
