'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';


interface Gift {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface GiftSectionProps {
  theme: ThemeKey;
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
  gifts
}: GiftSectionProps) {
  const displayGifts = gifts && gifts.length > 0 ? gifts : defaultGifts;
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  return (
    <section className={`relative ${spacingClass}`} id="gifts">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('gift_section', undefined, { partnerName });
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

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="grid gap-8 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {displayGifts.map((gift, index) => (
              <ScrollReveal key={gift.id} animation="fade-up" delay={index * 100}>
                <div
                  className={`
                  group backdrop-blur-xl border ${cardStyle} ${shadowClass} lg:shadow-2xl
                  p-10 lg:p-12 text-center h-full flex flex-col items-center hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]
                  hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out hover:border-[var(--gift-hover-border)]
                  before:absolute before:inset-0 before:${cardStyle} before:bg-gradient-to-br before:from-[var(--gift-glow-start)] before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
                  relative overflow-hidden
                `}
                  style={{
                    backgroundColor: `${themeUtils.colors.card}F2`,
                    borderColor: `${themeUtils.colors.border}66`,
                    ['--gift-hover-border' as string]: `${themeUtils.colors.accent}99`,
                    ['--gift-glow-start' as string]: `${themeUtils.colors.secondary}66`,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl"
                    style={{ backgroundColor: themeUtils.colors.secondary }}
                  >
                    🎁
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: themeUtils.colors.primary }}>
                    {gift.title}
                  </h3>
                  <p className="text-lg leading-relaxed flex-grow" style={{ color: themeUtils.colors.text }}>
                    {gift.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
