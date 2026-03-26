'use client';

import type { Theme } from '@/lib/types';
import { useTheme } from '../../builder/ThemeWrapper';
import SectionHeader from '../../page/SectionHeader';
import ScrollReveal from '../../ui/ScrollReveal';

interface OurStorySectionProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  story?: string;
  variant?: 'default' | 'alt';
}

export default function OurStorySection({
  theme,
  customerName,
  partnerName,
  story,
  variant = 'default',
}: OurStorySectionProps) {
  const styles = useTheme(theme);
  const sectionBg = variant === 'alt' ? styles.sectionBgAlt : styles.sectionBg;

  const defaultStory = `This is the story of ${customerName} and ${partnerName}...

Every love story is beautiful, but theirs is their favorite. From the moment they met, something special began. It was like finding the missing piece of a puzzle they didn't know was incomplete.

Through sunny days and rainy afternoons, through laughter and tears, their bond grew stronger with each passing moment. They learned that love isn't about perfection—it's about choosing each other every single day.

This is just the beginning of their forever.`;

  const finalStory = (defaultStory).trim();
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
            icon="📖"
            title="Our Story"
            subtitle="The beautiful journey of us"
            theme={theme}
            className="mb-8"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="max-w-4xl mx-auto">
            <div
              className={`
                relative overflow-hidden
                rounded-[28px] md:rounded-[36px]
                border border-white/50
                bg-white/90 backdrop-blur-xl
                shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                transition-all duration-500 ease-out
                hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(244,114,182,0.12)]
                ${isShortStory ? 'px-8 py-10 md:px-12 md:py-12' : 'px-8 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16'}
              `}
            >
              {/* soft top glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-rose-50/70 to-transparent" />
              </div>

              <div className="relative z-10 text-center">
                <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-rose-300 mb-4">
                  How it all began
                </p>

                <div className="w-16 h-[3px] mx-auto rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 opacity-70 mb-8" />

                <div
                  className={`
    mx-auto text-rose-700 text-left
    ${isShortStory ? 'max-w-2xl text-center' : 'max-w-2xl'}
    ${isShortStory ? 'text-xl md:text-2xl leading-10 md:leading-[2.8rem]' : 'text-base md:text-lg leading-8 md:leading-9'}
  `}
                >
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`
    ${index !== paragraphs.length - 1 ? 'mb-6 md:mb-7' : ''}
    ${isShortStory ? 'font-medium text-center' : 'font-normal'}
  `}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-rose-300/70">
                  <span className="text-lg">💕</span>
                  <span className="text-xs md:text-sm italic tracking-wide">
                    {customerName} &amp; {partnerName}
                  </span>
                  <span className="text-lg">💕</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}