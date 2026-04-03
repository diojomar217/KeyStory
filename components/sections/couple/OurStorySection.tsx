'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import { useTheme, useThemeUtils } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal'; // Ensure this is a default import
import { getCardStyleClasses, getShadowClass } from '@/lib/theme-color-helpers';
import { formatOccasionDisplayName } from '@/lib/public-site-copy';

interface OurStorySectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  customerName: string;
  partnerName: string;
  story?: string;
  variant?: 'default' | 'alt';
}

export default function OurStorySection({
  theme,
  siteType = 'couple',
  customerName,
  partnerName,
  story,
  variant = 'default',
}: OurStorySectionProps) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const sectionBg = variant === 'alt' ? styles.sectionBgAlt : styles.sectionBg;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const copy = getSectionCopy('our_story', siteType);
  const displayName = formatOccasionDisplayName(siteType, customerName, partnerName);

  const defaultStory = (() => {
    switch (siteType) {
      case 'travel':
        return `This is the journey of ${displayName}.

Every destination added a new memory, every detour became part of the story, and every place along the way left something worth keeping.

What began as a trip became a collection of moments, landscapes, conversations, and memories that still feel close long after the bags were unpacked.`;
      case 'memorial':
        return `This is the life story of ${displayName}.

It is a story of presence, kindness, memory, and the moments that continue to live on in the people whose lives were changed along the way.

What remains is love, remembrance, and a life worth honoring with gratitude.`;
      case 'family':
        return `This is the story of ${displayName}.

It is a story shaped by shared milestones, everyday moments, traditions, and the kind of love that quietly holds everything together.

These memories are reminders of what was built together and what continues to matter most.`;
      case 'friendship':
        return `This is the story of ${displayName}.

It is a story built from trust, laughter, shared seasons, and the kind of connection that only grows more meaningful with time.

Every memory here is a reminder of just how much this friendship has meant along the way.`;
      default:
        return `This is the story of ${displayName}.

Every chapter has brought new memories, quiet moments, and milestones worth keeping close.

This page holds the moments that shaped the journey and the story still being written.`;
    }
  })();

  const finalStory = (story || defaultStory).trim();
  const paragraphs = finalStory
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const isShortStory = finalStory.length < 180;

  return (
    <section className={`relative py-14 md:py-18 ${sectionBg}`} id="our-story">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={copy.icon}
            title={copy.title}
            subtitle={copy.subtitle}
            theme={theme}
            className="mb-8"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="max-w-4xl mx-auto">
            <div
              className={`
                relative overflow-hidden
                ${cardStyle}
                border
                ${styles.card}
                transition-all duration-500 ease-out
                hover:-translate-y-1
                ${shadowClass}
                px-8 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16
              `}
              style={{
                borderColor: themeUtils.colors.border,
                backgroundColor: themeUtils.colors.card,
                boxShadow: `0 20px 50px ${themeUtils.colors.accent}20`
              }}
            >
              {/* soft top glow */}
              <div className="pointer-events-none absolute inset-0">
                <div 
                  className="absolute inset-x-0 top-0 h-24 to-transparent bg-gradient-to-b"
                  style={{
                    backgroundColor: themeUtils.colors.secondary,
                    backgroundImage: `linear-gradient(to bottom, ${themeUtils.colors.accent}30, transparent)`
                  }}
                />
              </div>

              <div className="relative z-10 text-center">
                <p 
                  className="text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
                  style={{ color: themeUtils.colors.accent }}
                >
                  {copy.title}
                </p>

                <div 
                  className="w-16 h-[3px] mx-auto rounded-full opacity-70 mb-8"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeUtils.colors.primary}, ${themeUtils.colors.accent}, ${themeUtils.colors.primary})`
                  }}
                />

                <div
                  className={`
    mx-auto text-left max-w-2xl
    ${isShortStory ? 'text-center text-xl md:text-2xl leading-10 md:leading-[2.8rem] font-medium' : 'text-base md:text-lg leading-8 md:leading-9 font-normal'}
  `}
                  style={{ color: themeUtils.colors.text }}
                >
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={index !== paragraphs.length - 1 ? 'mb-6 md:mb-7' : ''}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-opacity-70" style={{ color: themeUtils.colors.accent }}>
                  <span className="text-lg">{copy.icon || '✦'}</span>
                  <span className="text-xs md:text-sm italic tracking-wide">
                    {displayName}
                  </span>
                  <span className="text-lg">{copy.icon || '✦'}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}