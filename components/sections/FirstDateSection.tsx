'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface FirstDateSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  firstDateInfo?: {
    date?: string;
    location?: string;
    description?: string;
    photo?: string;
  };
}

export default function FirstDateSection({ 
  theme, 
  customerName,
  partnerName,
  firstDateInfo 
}: FirstDateSectionProps) {
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
          🌹 Our First Date
        </h2>
        
        <div 
          className="p-8 rounded-2xl"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: '1px'
          }}
        >
          <div className="text-center mb-6">
            <div 
              className="inline-block p-4 rounded-full mb-4"
              style={{ backgroundColor: colors.secondary }}
            >
              <span className="text-5xl">💕</span>
            </div>
            <h3 
              className="text-2xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {customerName} & {partnerName}
            </h3>
          </div>
          
          {(firstDateInfo?.date || firstDateInfo?.location) && (
            <div className="flex justify-center gap-6 mb-6">
              {firstDateInfo?.date && (
                <div className="text-center">
                  <div className="text-2xl mb-1">📅</div>
                  <div style={{ color: colors.text }}>{firstDateInfo.date}</div>
                </div>
              )}
              {firstDateInfo?.location && (
                <div className="text-center">
                  <div className="text-2xl mb-1">📍</div>
                  <div style={{ color: colors.text }}>{firstDateInfo.location}</div>
                </div>
              )}
            </div>
          )}
          
          {firstDateInfo?.description && (
            <p 
              className="text-center text-lg"
              style={{ color: colors.text }}
            >
              {firstDateInfo.description}
            </p>
          )}
          
          {!firstDateInfo?.description && (
            <p 
              className="text-center text-lg"
              style={{ color: colors.text }}
            >
              The day that started it all. The moment when everything changed. 
              Neither of us knew that this would be the beginning of our forever.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

