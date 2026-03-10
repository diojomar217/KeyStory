'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface Reason {
  id: string;
  number: number;
  text: string;
}

interface ReasonsILoveYouSectionProps {
  theme: Theme;
  partnerName: string;
  reasons?: Reason[];
}

const defaultReasons: Reason[] = [
  { id: '1', number: 1, text: 'The way you make me laugh even on my worst days' },
  { id: '2', number: 2, text: 'Your beautiful smile that lights up every room' },
  { id: '3', number: 3, text: 'How caring and compassionate you are to everyone' },
  { id: '4', number: 4, text: 'The way you understand me without words' },
  { id: '5', number: 5, text: 'Your amazing sense of humor' },
  { id: '6', number: 6, text: 'How hard you work for your dreams' },
  { id: '7', number: 7, text: 'The way you support me in everything I do' },
  { id: '8', number: 8, text: 'Your kind heart and gentle soul' },
  { id: '9', number: 9, text: 'The way we can be ourselves around each other' },
  { id: '10', number: 10, text: 'Simply being you' },
];

export default function ReasonsILoveYouSection({ 
  theme, 
  partnerName,
  reasons = defaultReasons 
}: ReasonsILoveYouSectionProps) {
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
          💖 10 Things I Love About You
        </h2>
        
        <p 
          className="text-center mb-12"
          style={{ color: colors.text }}
        >
          {partnerName}, here are all the reasons I love you:
        </p>
        
        <div className="grid gap-4">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="flex gap-4 items-center p-6 rounded-2xl"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
              }}
            >
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.card
                }}
              >
                {reason.number}
              </div>
              <p 
                className="text-lg"
                style={{ 
                  color: colors.text,
                  fontFamily: typography.bodyFont
                }}
              >
                {reason.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

