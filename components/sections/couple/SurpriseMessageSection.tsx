'use client';

import { useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';

interface SurpriseMessageSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  customerName: string;
  partnerName: string;
  message?: string;
  hint?: string;
}

export default function SurpriseMessageSection({ 
  theme, 
  siteType = 'couple',
  customerName,
  partnerName,
  message,
  hint
}: SurpriseMessageSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const displayMessage = message || (() => {
    switch (siteType) {
      case 'birthday':
        return 'Wishing you a celebration as joyful as you are! 🎉';
      case 'graduation':
        return 'You did it, and this is only the beginning. 🎓';
      case 'family':
        return 'Some of the best memories begin right here with family. 🏡';
      default:
        return 'I love you more than words can say! 💖';
    }
  })();
  const [isRevealed, setIsRevealed] = useState(false);
  const copy = getSectionCopy('surprise_message', siteType);
  const revealLabel = (() => {
    switch (siteType) {
      case 'birthday':
      case 'proposal':
      case 'valentines':
        return 'Open Surprise';
      case 'graduation':
        return 'Open Congratulations';
      default:
        return 'Open Message';
    }
  })();
  const revealHeading = partnerName || customerName || 'You';
  const revealIntro = (() => {
    switch (siteType) {
      case 'birthday':
        return `${customerName || 'Someone special'} wanted to brighten your celebration...`;
      case 'graduation':
        return `${customerName || 'Someone special'} wanted to celebrate this milestone with you...`;
      case 'family':
        return `${customerName || 'Your family'} wanted to share something special...`;
      default:
        return `${customerName} wanted to tell you something special...`;
    }
  })();

  return (
    <section className={`relative ${spacingClass}`} id="surprise">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={copy.icon}
            title={copy.title}
            subtitle={copy.subtitle}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="max-w-3xl mx-auto text-center">
            {!isRevealed ? (
              <div className="group cursor-pointer">
                <div
                  className="
                    mx-auto w-36 h-36 rounded-3xl flex items-center justify-center text-6xl
                    shadow-2xl hover:scale-110 transition-all duration-500
                    relative overflow-hidden animate-pulse
                  "
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.primary}, ${themeUtils.colors.secondary})`,
                    boxShadow: `0 20px 40px ${themeUtils.colors.primary}66`,
                  }}
                >
                  <span className="relative z-10">🎁</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse rounded-3xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.secondary}, ${themeUtils.colors.accent})`,
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsRevealed(true)}
                  className="mt-8 px-8 py-4 text-white rounded-3xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeUtils.colors.primary}, ${themeUtils.colors.secondary})`,
                  }}
                >
                  {revealLabel}
                </button>
              </div>
            ) : (
              <div
                className={`
                  ${cardStyle} ${shadowClass} border backdrop-blur-xl p-12 lg:p-16
                  transition-all duration-500 ease-out relative overflow-hidden hover:-translate-y-2
                `}
                style={{
                  backgroundColor: `${themeUtils.colors.card}F2`,
                  borderColor: `${themeUtils.colors.border}B3`,
                  boxShadow: `0 35px 60px -15px ${themeUtils.colors.primary}22`,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${themeUtils.colors.secondary}33, transparent)`,
                  }}
                />
                <div className="text-6xl mb-8 animate-bounce">💕</div>
                <h3
                  className={`text-3xl lg:text-4xl font-bold mb-6 ${headingFontClass}`}
                  style={{ color: themeUtils.colors.primary }}
                >
                  Hey {revealHeading}!
                </h3>
                <p className="text-xl mb-6" style={{ color: themeUtils.colors.text }}>
                  {revealIntro}
                </p>
                <p
                  className={`text-4xl lg:text-5xl font-bold mb-8 animate-pulse ${headingFontClass}`}
                  style={{ color: themeUtils.colors.accent }}
                >
                  {displayMessage}
                </p>
                <button
                  onClick={() => setIsRevealed(false)}
                  className="px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeUtils.colors.secondary}44, ${themeUtils.colors.accent}22)`,
                    color: themeUtils.colors.primary,
                    border: `1px solid ${themeUtils.colors.border}`,
                  }}
                >
                  🎁 Hide surprise
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

