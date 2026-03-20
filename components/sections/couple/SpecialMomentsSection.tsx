'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface SpecialMoment {
  id: string;
  title: string;
  date: string;
  description: string;
  photo?: string;
}

interface SpecialMomentsSectionProps {
  theme: Theme;
  moments?: SpecialMoment[];
}

const defaultMoments: SpecialMoment[] = [
  { id: '1', title: 'First Trip Together', date: '', description: 'Our first adventure as a couple' },
  { id: '2', title: 'Meeting the Family', date: '', description: 'The moment everything felt real' },
  { id: '3', title: 'First Holiday Together', date: '', description: 'Celebrating our first season of love' },
  { id: '4', title: 'Moving In Together', date: '', description: 'Starting our life under one roof' },
];

export default function SpecialMomentsSection({ theme, moments = defaultMoments }: SpecialMomentsSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
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
          ⭐ Special Moments
        </h2>
        
        <div className="space-y-6">
          {moments.map((moment, index) => (
            <div
              key={moment.id}
              className="flex gap-6 items-center p-6 rounded-2xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div 
                className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: colors.secondary }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ 
                    color: colors.primary,
                    fontFamily: typography.headingFont
                  }}
                >
                  {moment.title}
                </h3>
                <p style={{ color: colors.text }}>{moment.description}</p>
                {moment.date && (
                  <p className="text-sm mt-1" style={{ color: colors.accent }}>{moment.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

