'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface LetterToFutureSectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  letter?: string;
  openDate?: string;
}

// Default fallback letter
const defaultLetter = `My love,

By the time you read this, I hope we've created even more beautiful memories together. I want you to know that every moment we've shared has been precious to me.

{customerName} loves {partnerName} more than words can express. Here's to our forever and beyond! 💕

With all my love,
Your {partnerName}`;

export default function LetterToFutureSection({ 
  theme, 
  customerName,
  partnerName,
  letter,
  openDate
}: LetterToFutureSectionProps) {
  // Use provided letter or build default with names
  const displayLetter = letter || defaultLetter.replace(/{customerName}/g, customerName).replace(/{partnerName}/g, partnerName);
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          📮 Letter to Our Future
        </h2>
        
        <div 
          className="p-8 rounded-2xl text-center"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: '1px'
          }}
        >
          {!isRevealed ? (
            <div>
              <div className="text-6xl mb-6">💌</div>
              <h3 
                className="text-2xl font-bold mb-4"
                style={{ 
                  color: colors.primary,
                  fontFamily: typography.headingFont
                }}
              >
                A Message for the Future
              </h3>
              <p 
                className="mb-6"
                style={{ color: colors.text }}
              >
                Click below to reveal your letter to each other
              </p>
              <button
                onClick={() => setIsRevealed(true)}
                className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.card
                }}
              >
                Open Letter 💕
              </button>
            </div>
          ) : (
            <div>
              <h3 
                className="text-2xl font-bold mb-6"
                style={{ 
                  color: colors.primary,
                  fontFamily: typography.headingFont
                }}
              >
                Dear Future Us,
              </h3>
              <div 
                className="prose max-w-none text-left whitespace-pre-wrap"
                style={{ color: colors.text, fontFamily: typography.bodyFont }}
              >
                {displayLetter}
              </div>
              <button
                onClick={() => setIsRevealed(false)}
                className="mt-6 text-sm underline"
                style={{ color: colors.accent }}
              >
                Close letter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

