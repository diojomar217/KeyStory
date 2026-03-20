'use client';

import React from 'react';
import { useTheme } from '../builder/ThemeWrapper';
import SectionHeader from '../page/SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import { Theme } from '@/lib/types';

export type SectionLayoutType = 'card' | 'timeline' | 'grid';

const SECTION_VERTICAL_PADDING = 'py-20 md:py-24';
const SECTION_MIN_HEIGHT = 'min-h-[460px] md:min-h-[560px]';
const SEPARATOR_VERTICAL_PADDING = 'py-8 md:py-10';

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
  variant = 'default',
  staggered = false,
  animationDelay = 0,
}: BaseSectionLayoutProps & { staggered?: boolean }) {
  const styles = useTheme(theme);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt || 'bg-gradient-to-b from-white/90 to-white/30 backdrop-blur-xl';
      default:
        return styles.sectionBg || 'bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-lg';
    }
  };

  const getContentAlignment = () => {
    if (staggered) {
      return 'md:text-left max-w-4xl mx-auto transform md:-skew-x-1 hover:skew-x-0 transition-transform duration-500 md:-translate-x-8 lg:-translate-x-12';
    }
    return 'text-center max-w-4xl mx-auto';
  };

  return (
    <section
      id={id}
      className={`${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${getBackgroundClass()}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
              bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl lg:rounded-[3rem] 
              shadow-2xl lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]
              p-10 lg:p-16 xl:p-20
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
  variant = 'default',
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
  gap = 'gap-8 lg:gap-10',
  animationDelay = 0,
}: BaseSectionLayoutProps & { gridCols?: string; gap?: string }) {
  const styles = useTheme(theme);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt || 'bg-gradient-to-b from-slate-50/80 to-white/60 backdrop-blur-lg';
      default:
        return styles.sectionBg || 'bg-gradient-to-b from-pink-50/70 to-rose-50/50 backdrop-blur-xl';
    }
  };

  return (
    <section
      id={id}
      className={`${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${getBackgroundClass()}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                  h-full min-h-[280px] lg:min-h-[320px] ${styles.card} backdrop-blur-md border border-white/30
                  rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-8 lg:p-10
                  hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:shadow-rose-100/50 hover:-translate-y-3 hover:scale-[1.02]
                  transition-all duration-500 ease-out hover:border-rose-200/60
                  relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-rose-50/60 before:to-transparent before:blur-md before:-z-10 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-500
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
  variant = 'default',
  animationDelay = 0,
}: BaseSectionLayoutProps) {
  const styles = useTheme(theme);

  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt || 'bg-gradient-to-b from-white/90 to-white/40 backdrop-blur-lg';
      default:
        return styles.sectionBg || 'bg-gradient-to-b from-rose-50/80 to-pink-50/60 backdrop-blur-xl';
    }
  };

  return (
    <section
      id={id}
      className={`${SECTION_VERTICAL_PADDING} ${SECTION_MIN_HEIGHT} ${getBackgroundClass()}`}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
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

// Separators
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
  const iconBubbleClass = theme === 'dark_elegant'
    ? 'bg-slate-900/30 border-slate-400/30 text-amber-200'
    : 'bg-white/20 border-white/40 text-rose-500';

  const separatorGradient =
    startColor === endColor
      ? `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 100%)`
      : `linear-gradient(to bottom, ${startColor} 0%, ${startColor} 44%, ${endColor} 56%, ${endColor} 100%)`;

  return (
    <div className="relative z-20 flex justify-center items-center -mt-6 -mb-6 md:-mt-8 md:-mb-8">
      <div
        className="w-full max-w-3xl relative z-10 h-20 md:h-24 rounded-xl overflow-hidden py-2 md:py-2"
        style={{ background: separatorGradient }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-white/15 backdrop-blur-sm" />
        <div className={`absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-lg px-4 py-1.5 backdrop-blur-sm ${iconBubbleClass}`}>
          <span className={`text-xl ${iconColor} animate-gentle-pulse`}>
            💕
          </span>
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
        style={{
          background: `linear-gradient(to right, transparent, ${lineColor}, transparent)`,
        }}
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

