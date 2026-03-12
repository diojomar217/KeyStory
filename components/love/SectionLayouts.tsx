'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../ThemeWrapper';
import SectionHeader from '../SectionHeader';
import ScrollReveal from '../ScrollReveal';

// ============================================
// SECTION LAYOUT TYPES
// ============================================

export type SectionLayoutType = 'card' | 'timeline' | 'grid';

export interface BaseSectionLayoutProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Section icon (emoji) */
  icon?: string;
  /** Theme */
  theme: Theme;
  /** Section content */
  children: React.ReactNode;
  /** HTML id for anchor links */
  id?: string;
  /** Section variant for alternating backgrounds */
  variant?: 'default' | 'alt';
  /** Animation delay */
  animationDelay?: number;
}

// ============================================
// CARD SECTION LAYOUT
// ============================================

/**
 * Card Section Layout - for sections with centered card content
 * Use for: Love Letter, Future Dreams, Quotes, Letter to Future, Gift, Surprise
 */
export function CardSectionLayout({
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

  // Determine background based on variant
  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt;
      default:
        return styles.sectionBg;
    }
  };

  return (
    <section
      id={id}
      className={`py-20 md:py-24 ${getBackgroundClass()}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <SectionHeader
              icon={icon || '💕'}
              title={title || ''}
              subtitle={subtitle || ''}
              theme={theme}
            />
          </ScrollReveal>
        )}

        {/* Section Content */}
        <ScrollReveal animation="fade-up" delay={animationDelay + 100}>
          <div className={title || subtitle ? 'mt-10' : ''}>
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// GRID SECTION LAYOUT
// ============================================

/**
 * Grid Section Layout - for sections with grid-based content
 * Use for: Reasons I Love You, Gallery, Special Moments, Video Memories
 */
export function GridSectionLayout({
  title,
  subtitle,
  icon,
  theme,
  children,
  id,
  variant = 'default',
  animationDelay = 0,
  gridCols = 'grid-cols-1 md:grid-cols-2',
  gap = 'gap-6',
}: BaseSectionLayoutProps & { gridCols?: string; gap?: string }) {
  const styles = useTheme(theme);

  // Determine background based on variant
  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt;
      default:
        return styles.sectionBg;
    }
  };

  return (
    <section
      id={id}
      className={`py-20 md:py-24 ${getBackgroundClass()}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <SectionHeader
              icon={icon || '💕'}
              title={title || ''}
              subtitle={subtitle || ''}
              theme={theme}
            />
          </ScrollReveal>
        )}

        {/* Section Content - Grid */}
        <ScrollReveal animation="fade-up" delay={animationDelay + 100}>
          <div className={`${title || subtitle ? 'mt-10' : ''} grid ${gridCols} ${gap}`}>
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// NARROW SECTION LAYOUT
// ============================================

/**
 * Narrow Section Layout - for sections with narrow, focused content
 * Use for: Relationship Stats, Anniversary Countdown, Playlist
 */
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

  // Determine background based on variant
  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt;
      default:
        return styles.sectionBg;
    }
  };

  return (
    <section
      id={id}
      className={`py-20 md:py-24 ${getBackgroundClass()}`}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-up" delay={animationDelay}>
            <SectionHeader
              icon={icon || '💕'}
              title={title || ''}
              subtitle={subtitle || ''}
              theme={theme}
            />
          </ScrollReveal>
        )}

        {/* Section Content */}
        <ScrollReveal animation="fade-up" delay={animationDelay + 100}>
          <div className={title || subtitle ? 'mt-10' : ''}>
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ============================================
// SECTION SEPARATOR
// ============================================

/**
 * Romantic Section Separator - adds visual breaks between major sections
 */
export function SectionSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  const styles = useTheme(theme);

  return (
    <div className="relative py-8">
      {/* Hearts in the middle */}
      <div className="absolute left-0 right-0 -top-4 flex justify-center items-center">
        <div 
          className="px-4"
          style={{ 
            backgroundColor: theme === 'dark_elegant' ? '#18181b' : '#fff' 
          }}
        >
          <span className="text-rose-300 text-lg">
            💕
          </span>
        </div>
      </div>
      
      {/* Divider */}
      <div 
        className="border-t" 
        style={{ 
          borderColor: theme === 'dark_elegant' ? '#3f3f46' : '#fce7f3' 
        }} 
      />
    </div>
  );
}

/**
 * Gradient Section Separator - subtle gradient divider
 */
export function GradientSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  return (
    <div className="relative py-6">
      <div 
        className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"
        style={{
          background: theme === 'dark_elegant' 
            ? 'linear-gradient(to right, transparent, #3f3f46, transparent)'
            : 'linear-gradient(to right, transparent, #fce7f3, transparent)'
        }}
      />
    </div>
  );
}

/**
 * Dots Separator - elegant dotted line
 */
export function DotsSeparator({ theme = 'romantic_classic' }: { theme?: Theme }) {
  return (
    <div className="relative py-6 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="text-rose-200">•</span>
        <span className="text-rose-300">•</span>
        <span className="text-rose-400">💕</span>
        <span className="text-rose-300">•</span>
        <span className="text-rose-200">•</span>
      </div>
    </div>
  );
}

// ============================================
// SECTION LAYOUT CLASSES
// ============================================

/**
 * Get section layout type based on section key
 */
export function getSectionLayoutType(sectionKey: string): SectionLayoutType {
  // Card sections - centered card content
  const cardSections = [
    'love_letter',
    'future_dreams',
    'quotes',
    'letter_future',
    'gift_section',
    'surprise_message',
  ];
  
  // Timeline sections - chronological events
  const timelineSections = [
    'timeline',
    'our_story', // For narrative story
  ];
  
  // Grid sections - grid-based content
  const gridSections = [
    'reasons_love_you',
    'gallery',
    'special_moments',
    'video_memories',
    'milestones',
    'guest_messages',
  ];
  
  if (cardSections.includes(sectionKey)) {
    return 'card';
  }
  
  if (timelineSections.includes(sectionKey)) {
    return 'timeline';
  }
  
  if (gridSections.includes(sectionKey)) {
    return 'grid';
  }
  
  // Default to card layout
  return 'card';
}

/**
 * Get grid configuration based on section type
 */
export function getGridConfig(sectionKey: string): { gridCols: string; gap: string } {
  const gridConfigs: Record<string, { gridCols: string; gap: string }> = {
    reasons_love_you: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      gap: 'gap-4',
    },
    gallery: {
      gridCols: 'grid-cols-2 md:grid-cols-3',
      gap: 'gap-4 md:gap-6',
    },
    special_moments: {
      gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      gap: 'gap-6',
    },
    video_memories: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      gap: 'gap-6',
    },
    milestones: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      gap: 'gap-4',
    },
    guest_messages: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      gap: 'gap-6',
    },
  };
  
  return gridConfigs[sectionKey] || {
    gridCols: 'grid-cols-1 md:grid-cols-2',
    gap: 'gap-6',
  };
}

