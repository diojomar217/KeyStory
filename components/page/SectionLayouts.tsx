'use client';

import React from 'react';
import { useTheme } from '../builder/ThemeWrapper';
import SectionHeader from './SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import { Theme } from '@/lib/types';

export type SectionLayoutType = 'card' | 'timeline' | 'grid';

const SECTION_VERTICAL_PADDING = 'py-16 md:py-32 lg:py-40';
const SECTION_MIN_HEIGHT = 'min-h-[360px] md:min-h-[520px] lg:min-h-[640px]';
const SECTION_CONTENT_CENTER = 'min-h-[320px] md:min-h-[420px] flex flex-col justify-center';
const SEPARATOR_VERTICAL_PADDING = 'py-8 md:py-12 lg:py-16';

export interface BaseSectionLayoutProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  theme: Theme;
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
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-200/60 via-pink-200/20 to-rose-200/60" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-rose-200/60 via-pink-200/20 to-rose-200/60" />
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
              bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-3xl lg:rounded-[3rem]
              shadow-lg md:shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]
              p-6 sm:p-8 md:p-10 lg:p-16 xl:p-20
              hover:shadow-[0_35px_60px_-15px_rgba(244,114,182,0.15)] hover:border-rose-200/50 hover:-translate-y-2
              transition-all duration-500 ease-out relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-rose-50/50 before:to-transparent before:blur-xl before:-z-10
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
  const isDarkTheme = theme === 'dark_elegant';
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
                  hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-rose-100/50 hover:-translate-y-3 hover:scale-[1.02]
                  transition-all duration-500 ease-out hover:border-rose-200/60
                  relative before:absolute before:inset-0 before:rounded-xl md:before:rounded-2xl before:bg-gradient-to-br before:from-rose-50/60 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
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
  // Determine if dark theme (for soft-glow) or vintage theme (for paper grain)
  const isDarkTheme = theme === 'dark_elegant';
  const isVintageTheme = theme === 'vintage_love_letter';

  return (
    <section
      id={id}
      className={`relative ${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${bgClass} text-slate-700 dark:text-slate-100 ${isDarkTheme ? 'section-glow-dark' : ''} ${isVintageTheme ? 'texture-paper-grain' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-100/60 via-slate-100/20 to-rose-100/60" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-rose-100/60 via-slate-100/20 to-rose-100/60" />
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

// Separator color mapping (light values for BG blending)
const SECTION_BG_COLOR: Record<Theme, { default: string; alt: string }> = {
  romantic_classic: { default: '#ffffff', alt: '#fff1f2' },
  cute_pastel: { default: '#ffffff', alt: '#fdf7ff' },
  minimal_modern: { default: '#ffffff', alt: '#f8fafc' },
  dark_elegant: { default: '#111827', alt: '#1f2937' },
  soft_pastel: { default: '#ffffff', alt: '#fff1f2' },
  elegant_rose_gold: { default: '#ffffff', alt: '#fff1f2' },
  vintage_love_letter: { default: '#fffdf7', alt: '#fff4de' },
  scrapbook_memories: { default: '#ffffff', alt: '#fffbf3' },
  wedding_style: { default: '#ffffff', alt: '#fff1f2' },
  floral_romance: { default: '#ffffff', alt: '#fff1f2' },
  dreamy_pink: { default: '#ffffff', alt: '#fff1f2' },
  luxury_gold: { default: '#ffffff', alt: '#fff8eb' },
  minimal_white: { default: '#ffffff', alt: '#f8fafc' },
  cute_kawaii: { default: '#ffffff', alt: '#fff1f2' },
  soft_lavender: { default: '#ffffff', alt: '#f5f3ff' },
  colorful_celebration: { default: '#ffffff', alt: '#fff7ed' },
  photo_focus: { default: '#ffffff', alt: '#f8fafc' },
};

const getSectionBgColor = (theme: Theme, variant: 'default' | 'alt') => {
  const colors = SECTION_BG_COLOR[theme] || SECTION_BG_COLOR.romantic_classic;
  return variant === 'alt' ? colors.alt : colors.default;
};

export function SectionSeparator({
  theme = 'romantic_classic',
  prevVariant = 'default',
  nextVariant = 'alt',
}: {
  theme?: Theme;
  prevVariant?: 'default' | 'alt';
  nextVariant?: 'default' | 'alt';
}) {
  const startColor = getSectionBgColor(theme, prevVariant);
  const endColor = getSectionBgColor(theme, nextVariant);
  const iconColor = theme === 'dark_elegant' ? 'text-amber-300' : 'text-rose-500';

  const separatorGradient =
    startColor === endColor
      ? `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 100%)`
      : `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 44%, ${endColor} 56%, ${endColor} 100%)`;

  return (
    <div className="relative z-20 section-separator flex justify-center items-center -mt-10 -mb-10 md:-mt-12 md:-mb-12" role="img" aria-label="section separator">
      <div
        className="w-full max-w-3xl relative z-10 h-20 md:h-24 rounded-xl overflow-hidden"
        style={{ background: separatorGradient }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-white/15 backdrop-blur-sm" />
        <div className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg px-4 py-1.5">
          <div
            className="h-full w-full rounded-full border"
            style={{
              borderColor: theme === 'dark_elegant' ? 'rgba(252,211,77,0.45)' : 'rgba(255,255,255,0.55)',
              background:
                theme === 'dark_elegant'
                  ? 'radial-gradient(circle at center, rgba(255,236,179,0.5) 0%, rgba(245,158,11,0.15) 40%, rgba(245,158,11,0) 65%)'
                  : 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(251,207,232,0.35) 40%, rgba(236,72,153,0.08) 65%)',
            }}
            aria-hidden="true"
          >
            <span className={`relative z-40 block text-xl ${iconColor} animate-gentle-pulse text-center leading-none`} aria-hidden="true">
              💕
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GradientSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  const lineColor = theme === 'dark_elegant' ? '#3f3f46' : '#fce7f3';
  return (
    <div className={`relative ${SEPARATOR_VERTICAL_PADDING} flex justify-center`}>
      <div
        className="h-2 w-40 rounded-full shadow-xl blur-sm opacity-90"
        
      />
    </div>
  );
}

export function DotsSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  const colors = theme === 'dark_elegant' ? 'text-amber-400/60' : 'text-rose-400/70';
  return (
    <div className={`relative ${SEPARATOR_VERTICAL_PADDING} flex items-center justify-center`}>
      <div className="flex items-center gap-4">
        <span className={`text-2xl animate-pulse-slow ${colors}`}>✨</span>
        <span className={`text-xl ${colors}`}>•</span>
        <span className={`text-3xl animate-gentle-pulse ${colors}`}>💕</span>
        <span className={`text-xl ${colors}`}>•</span>
        <span className={`text-2xl animate-pulse-slow ${colors}`}>✨</span>
      </div>
    </div>
  );
}

// Section Layout Helpers
export function getSectionLayoutType(sectionKey: string): SectionLayoutType {
  const cardSections = [
    'love_letter',
    'future_dreams',
    'quotes',
    'letter_future',
    'gift_section',
    'surprise_message',
  ];
  
  const timelineSections = [
    'timeline',
    'our_story',
  ];
  
  const gridSections = [
    'reasons_love_you',
    'gallery',
    'special_moments',
    'video_memories',
    'milestones',
    'guest_messages',
  ];
  
  if (cardSections.includes(sectionKey)) return 'card';
  if (timelineSections.includes(sectionKey)) return 'timeline';
  if (gridSections.includes(sectionKey)) return 'grid';
  return 'card';
}

export function getGridConfig(sectionKey: string): { gridCols: string; gap: string } {
  const gridConfigs: Record<string, { gridCols: string; gap: string }> = {
    reasons_love_you: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-6 lg:gap-8' },
    gallery: { gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', gap: 'gap-6 lg:gap-8' },
    special_moments: { gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap: 'gap-8 lg:gap-10' },
    video_memories: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-8 lg:gap-10' },
    milestones: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-6 lg:gap-8' },
    guest_messages: { gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap: 'gap-8 lg:gap-10' },
  };
  
  return gridConfigs[sectionKey] || { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-8 lg:gap-10' };
}

