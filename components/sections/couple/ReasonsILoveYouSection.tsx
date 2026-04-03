'use client';

import { useState } from "react";
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface Reason {
  id: string;
  number: number;
  text: string;
}

interface ReasonsILoveYouSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  partnerName: string;
  reasons?: Reason[];
  variant?: 'default' | 'alt';
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
  siteType = 'couple',
  partnerName,
  reasons,
  variant = 'default'
}: ReasonsILoveYouSectionProps) {
  const displayReasons = (reasons && reasons.length > 0 ? reasons : defaultReasons).map((reason, index) => ({
    ...reason,
    id: reason.id || `reason-${index + 1}`,
    number: typeof reason.number === 'number' ? reason.number : index + 1,
  }));
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
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
    <section id="reasons-love-you" className={`relative ${spacingClass}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('reasons_love_you', siteType, { partnerName });
            return (
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            );
          })()}
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {displayReasons.map((reason) => (
            <div key={reason.id} className="group relative h-[200px] lg:h-[220px] cursor-pointer overflow-hidden" onClick={() => toggleFlip(reason.id)}>
              <div 
                className="relative w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:scale-[1.02]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCards.has(reason.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front face - Tap to reveal */}
                <div
                  className={`absolute inset-0 ${cardStyle} border backdrop-blur-xl flex items-center justify-center p-6 lg:p-8 transition-all duration-500`}
                  style={{
                    backgroundColor: `${themeUtils.colors.card}E6`,
                    borderColor: `${themeUtils.colors.border}CC`,
                    boxShadow: `0 20px 40px -18px ${themeUtils.colors.primary}33`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.secondary}66, ${themeUtils.colors.accent}33)`,
                    }}
                  />
                  <div className="flex items-center gap-4 lg:gap-6 text-center">
                    <div
                      className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 ${cardStyle} flex items-center justify-center text-3xl lg:text-4xl font-black text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-gentle-pulse`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.primary}, ${themeUtils.colors.secondary})`,
                        boxShadow: `0 8px 24px ${themeUtils.colors.primary}66`,
                      }}
                    >
                      {reason.number}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl lg:text-3xl animate-bounce-slow mb-2">❤️</span>
                      <p
                        className={`text-lg lg:text-xl font-semibold tracking-wide leading-tight ${headingFontClass}`}
                        style={{ color: themeUtils.colors.text }}
                      >
                        Tap to reveal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back face - Revealed text */}
                <div
                  className={`absolute inset-0 ${cardStyle} flex items-center justify-center p-8 lg:p-10 text-center text-white font-medium leading-relaxed text-lg lg:text-xl tracking-wide`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.primary}, ${themeUtils.colors.secondary}, ${themeUtils.colors.accent})`,
                    boxShadow: `0 25px 50px -12px ${themeUtils.colors.accent}66`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2), transparent 50%)',
                    }}
                  />
                  <p className={`max-w-md mx-auto drop-shadow-lg ${headingFontClass}`}>{reason.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
