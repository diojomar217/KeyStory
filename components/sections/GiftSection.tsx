'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface Gift {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface GiftSectionProps {
  theme: Theme;
  partnerName: string;
  gifts?: Gift[];
}

const defaultGifts: Gift[] = [
  { id: '1', title: 'Digital Love Letter', description: 'A personalized love letter just for you' },
  { id: '2', title: 'Memory Collage', description: 'Our best moments together in one place' },
  { id: '3', title: 'Playlist of Us', description: 'Songs that remind me of you' },
];

export default function GiftSection({ 
  theme, 
  partnerName,
  gifts = defaultGifts 
}: GiftSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-4"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🎁 Digital Gifts for You
        </h2>
        
        <p 
          className="text-center mb-12"
          style={{ color: colors.text }}
        >
          {partnerName}, these are just for you 💕
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="p-6 rounded-2xl text-center hover:scale-105 transition-transform"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: colors.secondary }}
              >
                🎁
              </div>
              <h3 
                className="text-xl font-bold mb-2"
                style={{ 
                  color: colors.primary,
                  fontFamily: typography.headingFont
                }}
              >
                {gift.title}
              </h3>
              <p style={{ color: colors.text }}>{gift.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

