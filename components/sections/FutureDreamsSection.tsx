'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface FutureDream {
  id: string;
  title: string;
  description: string;
  targetYear?: string;
}

interface FutureDreamsSectionProps {
  theme: Theme;
  dreams?: FutureDream[];
}

const defaultDreams: FutureDream[] = [
  { id: '1', title: 'Dream Home', description: 'Building our perfect home together', targetYear: '2025' },
  { id: '2', title: 'Travel the World', description: 'Exploring new countries and cultures', targetYear: '2026' },
  { id: '3', title: 'Start a Family', description: 'Beginning the next chapter', targetYear: '2027' },
  { id: '4', title: 'Grow Old Together', description: 'Living a lifetime of adventures', targetYear: 'Forever' },
];

export default function FutureDreamsSection({ theme, dreams = defaultDreams }: FutureDreamsSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          💭 Our Future Dreams
        </h2>
        
        <div className="grid gap-6">
          {dreams.map((dream) => (
            <div
              key={dream.id}
              className="p-6 rounded-2xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      color: colors.primary,
                      fontFamily: typography.headingFont
                    }}
                  >
                    {dream.title}
                  </h3>
                  <p 
                    className="mb-2"
                    style={{ color: colors.text }}
                  >
                    {dream.description}
                  </p>
                </div>
                {dream.targetYear && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: colors.primary
                    }}
                  >
                    {dream.targetYear}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

