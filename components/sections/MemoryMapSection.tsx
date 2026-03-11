'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  date?: string;
}

interface MemoryMapSectionProps {
  theme: Theme;
  locations?: Location[];
}

const defaultLocations: Location[] = [
  { id: '1', name: 'Where We Met', lat: 0, lng: 0, description: 'The beginning of everything' },
  { id: '2', name: 'First Date Location', lat: 0, lng: 0, description: 'Our first memories' },
  { id: '3', name: 'Favorite Spot', lat: 0, lng: 0, description: 'Our special place' },
];

export default function MemoryMapSection({ theme, locations = defaultLocations }: MemoryMapSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

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
        
        {/* Map Placeholder */}
        <div 
          className="aspect-video rounded-2xl mb-8 flex items-center justify-center"
          style={{ 
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            borderWidth: '1px'
          }}
        >
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🗺️</div>
            <p style={{ color: colors.text }}>
              Interactive map coming soon
            </p>
          </div>
        </div>
        
        {/* Location List */}
        <div className="grid gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex gap-4 items-center p-4 rounded-xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <span className="text-white">📍</span>
              </div>
              <div>
                <h4 
                  className="font-bold"
                  style={{ 
                    color: colors.primary,
                    fontFamily: typography.headingFont
                  }}
                >
                  {location.name}
                </h4>
                {location.description && (
                  <p className="text-sm" style={{ color: colors.text }}>
                    {location.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

