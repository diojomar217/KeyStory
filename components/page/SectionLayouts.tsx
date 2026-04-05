'use client';

import React from 'react';
import { getOccasionHeroSpec } from '../../config/occasionHeroConfig';
import { useTheme } from '../builder/ThemeWrapper';
import SectionHeader from './SectionHeader';
import { useOccasionType } from './OccasionContext';
import ScrollReveal from '../ui/ScrollReveal';
import { isDarkTheme as checkIsDarkTheme } from '@/lib/theme-color-helpers';

import { ThemeKey } from '@/config/themeConfig';
import { cardSections, timelineSections, gridSections, gridConfigs } from '@/config/sectionLayoutConfig';

export type SectionLayoutType = 'card' | 'timeline' | 'grid';

const SECTION_VERTICAL_PADDING = 'py-16 md:py-32 lg:py-40';
const SECTION_MIN_HEIGHT = 'min-h-[360px] md:min-h-[520px] lg:min-h-[640px]';
const SECTION_CONTENT_CENTER = 'min-h-[320px] md:min-h-[420px] flex flex-col justify-center';
const SEPARATOR_VERTICAL_PADDING = 'py-8 md:py-12 lg:py-16';

function getSeparatorPresentation(siteType: string, theme?: ThemeKey) {
  const hero = getOccasionHeroSpec(siteType as any);
  const safeTheme: ThemeKey = theme || 'romantic_classic';

  if (siteType === 'wedding') {
    return {
      icon: '💍',
      accentClass: 'text-amber-300',
      lineStyle: 'rgba(252, 211, 77, 0.55)',
      dividerBackground: 'radial-gradient(circle at center, rgba(255,248,220,0.72) 0%, rgba(245,158,11,0.18) 46%, rgba(245,158,11,0) 72%)',
      shellBorder: 'rgba(252, 211, 77, 0.42)',
      dotsLeft: '✦',
      dotsRight: '✦',
    };
  }

  if (siteType === 'memorial') {
    return {
      icon: '🕊️',
      accentClass: 'text-white/70',
      lineStyle: 'rgba(255, 255, 255, 0.22)',
      dividerBackground: 'radial-gradient(circle at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0) 72%)',
      shellBorder: 'rgba(255,255,255,0.16)',
      dotsLeft: '•',
      dotsRight: '•',
    };
  }

  if (siteType === 'travel') {
    return {
      icon: '✈️',
      accentClass: 'text-sky-500',
      lineStyle: 'rgba(148, 163, 184, 0.55)',
      dividerBackground: 'radial-gradient(circle at center, rgba(255,255,255,0.82) 0%, rgba(191,219,254,0.25) 42%, rgba(191,219,254,0) 72%)',
      shellBorder: 'rgba(148, 163, 184, 0.36)',
      dotsLeft: '•',
      dotsRight: '⌁',
    };
  }

  const isDark = checkIsDarkTheme(safeTheme);
  return {
    icon: hero.badge,
    accentClass: isDark ? 'text-amber-300' : 'text-rose-500',
    lineStyle: isDark ? 'rgba(252,211,77,0.45)' : 'rgba(255,255,255,0.55)',
    dividerBackground:
      isDark
        ? 'radial-gradient(circle at center, rgba(255,236,179,0.5) 0%, rgba(245,158,11,0.15) 40%, rgba(245,158,11,0) 65%)'
        : 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(251,207,232,0.35) 40%, rgba(236,72,153,0.08) 65%)',
    shellBorder: isDark ? 'rgba(252,211,77,0.45)' : 'rgba(255,255,255,0.55)',
    dotsLeft: '✨',
    dotsRight: '✨',
  };
}

function withAlpha(color: string, alphaHex: string) {
  if (!color || !color.startsWith('#')) return color;

  const normalized = color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    : color;

  return `${normalized}${alphaHex}`;
}

export interface BaseSectionLayoutProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  theme: ThemeKey;
  children: React.ReactNode;
  id?: string;
  variant?: 'default' | 'alt';
  staggered?: boolean;
  animationDelay?: number;
}

// Premium Card Section Layout
export function CardSectionLayout({
  title,
  subtitle,
  icon,
  theme,
  children,
  id,
  bgClass = '',
  staggered = false,
  animationDelay = 0,
}: BaseSectionLayoutProps & { staggered?: boolean; bgClass?: string }) {
  const styles = useTheme(theme);

  const getContentAlignment = () => {
    if (staggered) {
      return 'md:text-left max-w-4xl mx-auto transform md:-skew-x-1 hover:skew-x-0 transition-transform duration-500 md:-translate-x-8 lg:-translate-x-12';
    }
    return 'text-center max-w-4xl mx-auto';
  };

  // Determine if dark theme (for soft-glow) or vintage theme (for paper grain)
  const isDarkTheme = theme === 'dark_elegant';
  const isVintageTheme = theme === 'vintage_love_letter';

  return (
    <section
      id={id}
      className={`relative ${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${bgClass} text-slate-700 dark:text-slate-100 ${isDarkTheme ? 'section-glow-dark' : ''} ${isVintageTheme ? 'texture-paper-grain' : ''}`}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${styles.gradient}`} />
      <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${styles.gradient}`} />
      <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${SECTION_CONTENT_CENTER}`}>
        {/* Header ABOVE card */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
              <SectionHeader
                icon={icon || '💕'}
                title={title || ''}
                subtitle={subtitle || ''}
                theme={theme}
              />
            </div>
          </ScrollReveal>
        )}

        {/* Card Container */}
        <ScrollReveal animation="fade-up" delay={animationDelay + 200}>
          <div className={getContentAlignment()}>
            <div className={`
              ${styles.card} backdrop-blur-xl border ${styles.cardBorder} rounded-2xl md:rounded-3xl lg:rounded-[3rem]
              shadow-lg md:shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]
              p-6 sm:p-8 md:p-10 lg:p-16 xl:p-20
              hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.18)] hover:border-white/60 hover:-translate-y-2
              transition-all duration-500 ease-out relative overflow-hidden
              premium-interactive-card
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:blur-xl before:-z-10
            `}>
              {children}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Enhanced Grid Section Layout
export function GridSectionLayout({
  title,
  subtitle,
  icon,
  theme,
  children,
  id,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
  gap = 'gap-8 lg:gap-10',
  bgClass = '',
  animationDelay = 0,
}: BaseSectionLayoutProps & { gridCols?: string; gap?: string; bgClass?: string }) {
  const styles = useTheme(theme);

  // Determine if dark theme (for soft-glow) or vintage theme (for paper grain)
  const isDarkTheme = checkIsDarkTheme(theme);
  const isVintageTheme = theme === 'vintage_love_letter';

  return (
    <section
      id={id}
      className={`relative ${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${bgClass} text-slate-700 dark:text-slate-100 ${isDarkTheme ? 'section-glow-dark' : ''} ${isVintageTheme ? 'texture-paper-grain' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-slate-300/60 via-slate-200/20 to-slate-300/60" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-slate-300/60 via-slate-200/20 to-slate-300/60" />
      <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${SECTION_CONTENT_CENTER}`}>
        {/* Header ABOVE grid */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
              <SectionHeader
                icon={icon || '💕'}
                title={title || ''}
                subtitle={subtitle || ''}
                theme={theme}
              />
            </div>
          </ScrollReveal>
        )}

        {/* Premium Grid */}
        <ScrollReveal animation="fade-up" delay={animationDelay + 200}>
          <div className={`grid ${gridCols} ${gap}`}>
            {React.Children.toArray(children).map((child, index) => (
              <div key={index} className="group">
                <div className={`
                  h-full min-h-[260px] md:min-h-[280px] lg:min-h-[320px] ${styles.card} backdrop-blur-md border border-white/30
                  rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl p-5 sm:p-6 md:p-8 lg:p-10
                  hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] hover:-translate-y-3 hover:scale-[1.02]
                  transition-all duration-500 ease-out hover:border-white/60
                  premium-interactive-card
                  relative before:absolute before:inset-0 before:rounded-xl md:before:rounded-2xl before:bg-gradient-to-br before:from-white/35 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
                `}>
                  {child}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Narrow Section Layout
export function NarrowSectionLayout({
  title,
  subtitle,
  icon,
  theme,
  children,
  id,
  bgClass = '',
  animationDelay = 0,
}: BaseSectionLayoutProps & { bgClass?: string }) {
  const styles = useTheme(theme);

  // Determine if dark theme (for soft-glow) or vintage theme (for paper grain)
  const isDarkTheme = checkIsDarkTheme(theme);
  const isVintageTheme = theme === 'vintage_love_letter';

  return (
    <section
      id={id}
      className={`relative ${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${bgClass} text-slate-700 dark:text-slate-100 ${isDarkTheme ? 'section-glow-dark' : ''} ${isVintageTheme ? 'texture-paper-grain' : ''}`}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${styles.gradient}`} />
      <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${styles.gradient}`} />
      <div className={`w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${SECTION_CONTENT_CENTER}`}>
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
              <SectionHeader
                icon={icon || '💕'}
                title={title || ''}
                subtitle={subtitle || ''}
                theme={theme}
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal animation="fade-up" delay={animationDelay + 200}>
          <div className="">
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}



import { getSectionBgColor } from '@/config/sectionBgColors';

export function SectionSeparator({
  theme = 'romantic_classic',
  prevVariant = 'default',
  nextVariant = 'alt',
}: {
  theme?: ThemeKey;
  prevVariant?: 'default' | 'alt';
  nextVariant?: 'default' | 'alt';
}) {
  const siteType = useOccasionType();
  const sectionColors = getSectionBgColor(theme ?? 'romantic_classic');
  const startColor = prevVariant === 'alt' ? sectionColors.alt : sectionColors.default;
  const endColor = nextVariant === 'alt' ? sectionColors.alt : sectionColors.default;
  const separatorUi = getSeparatorPresentation(siteType, theme);

  const separatorGradient =
    startColor === endColor
      ? `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 100%)`
      : `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 44%, ${endColor} 56%, ${endColor} 100%)`;
  const glowColor = checkIsDarkTheme(theme) ? 'rgba(252, 211, 77, 0.08)' : 'rgba(244, 114, 182, 0.08)';
  const accentTint = withAlpha(startColor, '22');
  const bridgeColor =
    startColor === endColor
      ? `linear-gradient(to right, transparent, ${withAlpha(startColor, '66')}, transparent)`
      : `linear-gradient(to right, transparent, ${withAlpha(startColor, '52')}, ${withAlpha(endColor, '52')}, transparent)`;

  return (
    <div className="relative z-20 section-separator flex justify-center items-center -mt-2 -mb-2 px-6 md:-mt-3 md:-mb-3 animate-fade-in-up motion-reduce:animate-none" role="img" aria-label="section separator">
      <div
        className="w-full max-w-2xl relative z-10 h-5 md:h-6 overflow-hidden"
      >
        <div
          className="absolute inset-x-[26%] top-1/2 h-4 -translate-y-1/2 rounded-full blur-xl"
          style={{
            backgroundColor: glowColor,
          }}
        />
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{
            background: `linear-gradient(to right, transparent, ${separatorUi.lineStyle}, transparent)`,
          }}
        />
        <div
          className="absolute inset-x-[18%] top-1/2 h-2 -translate-y-1/2 rounded-full blur-md"
          style={{
            background: bridgeColor,
            opacity: 0.22,
          }}
        />
        <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 items-center justify-between md:left-6 md:right-6">
          <div className="flex items-center gap-2 md:gap-2.5">
            <span className="h-px w-6 md:w-8" style={{ background: `linear-gradient(to right, transparent, ${separatorUi.lineStyle})` }} aria-hidden="true" />
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accentTint }} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2 md:gap-2.5">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accentTint }} aria-hidden="true" />
            <span className="h-px w-6 md:w-8" style={{ background: `linear-gradient(to left, transparent, ${separatorUi.lineStyle})` }} aria-hidden="true" />
          </div>
        </div>
        <div className="absolute z-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className={`text-[9px] opacity-45 ${separatorUi.accentClass}`}>{separatorUi.dotsLeft}</span>
            <span className={`section-separator-icon relative z-40 block text-xs md:text-sm ${separatorUi.accentClass} animate-gentle-pulse motion-reduce:animate-none text-center leading-none`}>
              {separatorUi.icon}
            </span>
            <span className={`text-[9px] opacity-45 ${separatorUi.accentClass}`}>{separatorUi.dotsRight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GradientSeparator({ theme = 'romantic_classic' }: { theme?: ThemeKey }) {
  const siteType = useOccasionType();
  const separatorUi = getSeparatorPresentation(siteType, theme);
  const lineColor =
    siteType === 'wedding'
      ? 'linear-gradient(to right, transparent, rgba(252,211,77,0.85), transparent)'
      : siteType === 'memorial'
        ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)'
        : siteType === 'travel'
          ? 'linear-gradient(to right, transparent, rgba(56,189,248,0.75), transparent)'
          : checkIsDarkTheme(theme)
            ? '#3f3f46'
            : '#fce7f3';
  return (
    <div className={`relative ${SEPARATOR_VERTICAL_PADDING} flex justify-center animate-fade-in-up motion-reduce:animate-none`}>
      <div className="relative flex items-center gap-2 md:gap-2.5">
          <span className={`text-[10px] opacity-50 ${separatorUi.accentClass} animate-fade-in motion-reduce:animate-none`}>{separatorUi.dotsLeft}</span>
        <div
          className="h-px w-10 md:w-14"
          style={{ background: lineColor }}
        />
        <span className={`text-xs ${separatorUi.accentClass} animate-gentle-pulse motion-reduce:animate-none`}>{separatorUi.icon}</span>
        <div
          className="h-px w-10 md:w-14"
          style={{ background: lineColor }}
        />
        <span className={`text-[10px] opacity-50 ${separatorUi.accentClass} animate-fade-in motion-reduce:animate-none`}>{separatorUi.dotsRight}</span>
      </div>
    </div>
  );
}

export function DotsSeparator({ theme = 'romantic_classic' }: { theme?: ThemeKey }) {
  const siteType = useOccasionType();
  const separatorUi = getSeparatorPresentation(siteType, theme);
  return (
    <div className={`relative ${SEPARATOR_VERTICAL_PADDING} flex items-center justify-center animate-fade-in-up motion-reduce:animate-none`}>
      <div className="flex items-center gap-1.5 md:gap-2">
        <span className={`text-[10px] opacity-60 animate-pulse-slow motion-reduce:animate-none ${separatorUi.accentClass}`}>{separatorUi.dotsLeft}</span>
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: separatorUi.lineStyle }} aria-hidden="true" />
        <span className={`text-xs animate-gentle-pulse motion-reduce:animate-none ${separatorUi.accentClass}`}>{separatorUi.icon}</span>
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: separatorUi.lineStyle }} aria-hidden="true" />
        <span className={`text-[10px] opacity-60 animate-pulse-slow motion-reduce:animate-none ${separatorUi.accentClass}`}>{separatorUi.dotsRight}</span>
      </div>
    </div>
  );
}

// Section Layout Helpers
export function getSectionLayoutType(sectionKey: string): SectionLayoutType {
  if (cardSections.includes(sectionKey)) return 'card';
  if (timelineSections.includes(sectionKey)) return 'timeline';
  if (gridSections.includes(sectionKey)) return 'grid';
  return 'card';
}

export function getGridConfig(sectionKey: string): { gridCols: string; gap: string } {
  return gridConfigs[sectionKey] || { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-8 lg:gap-10' };
}

