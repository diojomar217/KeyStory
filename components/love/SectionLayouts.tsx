'use client';

import React from 'react';
import { useTheme } from '../ThemeWrapper';
import SectionHeader from '../SectionHeader';
import ScrollReveal from '../ScrollReveal';
import { Theme } from '@/lib/types';

export type SectionLayoutType = 'card' | 'timeline' | 'grid';

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
      className={`py-24 lg:py-32 ${getBackgroundClass()}`}
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
      className={`py-24 lg:py-32 ${getBackgroundClass()}`}
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
      className={`py-24 lg:py-32 ${getBackgroundClass()}`}
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

// Separators
export function SectionSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  const styles = useTheme(theme);

  return (
    <div className="relative py-12 lg:py-16">
      <div className="absolute inset-x-0 -top-6 flex justify-center items-center">
        <div 
          className="px-8 py-3 rounded-3xl bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-xl shadow-2xl ring-2 ring-white/50"
          style={{ 
            backgroundColor: theme === 'dark_elegant' ? '#18181b' : '#fff' 
          }}
        >
          <span className="text-2xl md:text-3xl animate-gentle-pulse">
            💕
          </span>
        </div>
      </div>
      
      <div 
        className="border-t-2" 
        style={{ 
          borderColor: theme === 'dark_elegant' ? '#3f3f46' : '#fce7f3' 
        }} 
      />
    </div>
  );
}

export function GradientSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  return (
    <div className="relative py-12">
      <div 
        className="h-2 mx-auto w-32 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 rounded-full shadow-xl blur-sm opacity-75 animate-pulse-slow"
        style={{
          background: theme === 'dark_elegant' 
            ? 'linear-gradient(to right, transparent, #3f3f46, transparent)'
            : 'linear-gradient(to right, transparent, #fce7f3, transparent)'
        }}
      />
    </div>
  );
}

export function DotsSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  const colors = theme === 'dark_elegant' ? 'text-amber-400/60' : 'text-rose-400/70';
  return (
    <div className="relative py-12 flex items-center justify-center">
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

