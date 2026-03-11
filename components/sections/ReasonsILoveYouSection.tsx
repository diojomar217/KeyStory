'use client';

import { useState } from 'react';
import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';
import ScrollReveal from '../ScrollReveal';

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
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
      id="reasons"
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal animation="fade-up">
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
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={100}>
          <p 
            className="text-center mb-12"
            style={{ color: colors.text }}
          >
            {partnerName}, here are all the reasons I love you:
          </p>
        </ScrollReveal>
        
        <div className="grid gap-4 md:grid-cols-2">
          {reasons.map((reason, idx) => (
            <ScrollReveal key={reason.id} animation="fade-up" delay={idx * 50}>
              {/* Flip Card Container */}
              <div 
                className="relative h-32 perspective-1000 cursor-pointer"
                onClick={() => toggleFlip(reason.id)}
              >
                {/* Flip Card Inner */}
                <div 
                  className={`
                    relative w-full h-full
                    transform-style-3d
                    transition-transform duration-500
                    ${flippedCards.has(reason.id) ? 'rotate-y-180' : ''}
                  `}
                >
                  {/* Front Face */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center p-6"
                    style={{ 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderWidth: '1px'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                        style={{ 
                          backgroundColor: colors.primary,
                          color: colors.card
                        }}
                      >
                        {reason.number}
                      </div>
                      <p 
                        className="text-sm font-medium"
                        style={{ 
                          color: colors.text,
                          fontFamily: typography.bodyFont
                        }}
                      >
                        Click to reveal
                      </p>
                    </div>
                  </div>
                  
                  {/* Back Face */}
                  <div 
                    className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex items-center justify-center p-4"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.border,
                      borderWidth: '1px'
                    }}
                  >
                    <p 
                      className="text-center text-base"
                      style={{ 
                        color: colors.card,
                        fontFamily: typography.bodyFont
                      }}
                    >
                      {reason.text}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

