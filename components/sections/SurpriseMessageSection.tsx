'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface SurpriseMessageSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  message?: string;
  hint?: string;
}

// Default fallback values
const defaultMessage = 'I love you more than words can say! 💖';

export default function SurpriseMessageSection({ 
  theme, 
  customerName,
  partnerName,
  message,
  hint
}: SurpriseMessageSectionProps) {
  // Use provided message or fallback to default
  const displayMessage = message || defaultMessage;
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 
          className="text-4xl font-bold mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🎉 A Surprise for You
        </h2>
        
        {!isRevealed ? (
          <div>
            <button
              onClick={() => setIsRevealed(true)}
              className="relative group"
            >
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl animate-pulse"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.card
                }}
              >
                🎁
              </div>
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  backgroundColor: colors.accent,
                  animation: 'pulse 2s infinite'
                }}
              />
            </button>
            <p 
              className="mt-6 text-lg"
              style={{ color: colors.text }}
            >
              {hint ? hint : 'Click the gift to reveal your surprise! 💕'}
            </p>
          </div>
        ) : (
          <div 
            className="p-8 rounded-2xl animate-fade-in"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <div className="text-6xl mb-4">💕</div>
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              Hey {partnerName}!
            </h3>
            <p 
              className="text-lg mb-4"
              style={{ color: colors.text }}
            >
              {customerName} wanted to tell you something special...
            </p>
            <p 
              className="text-3xl font-bold"
              style={{ 
                color: colors.primary,
                fontFamily: typography.headingFont
              }}
            >
              {displayMessage}
            </p>
            <button
              onClick={() => setIsRevealed(false)}
              className="mt-6 text-sm underline"
              style={{ color: colors.accent }}
            >
              Hide surprise
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

