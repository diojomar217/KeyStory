'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { getOccasionHeroSpec } from '../../config/occasionHeroConfig';
import { useTheme } from '../builder/ThemeWrapper';
import SectionHeader from './SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import { useOccasionType } from './OccasionContext';

interface SectionProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Section icon (emoji) */
  icon?: string;
  /** Theme */
  theme: ThemeKey;
  /** Section content */
  children: React.ReactNode;
  /** Custom CSS class for container */
  className?: string;
  /** Show decorative separator between sections */
  showSeparator?: boolean;
  /** Section variant for alternating backgrounds */
  variant?: 'default' | 'alt' | 'glass';
  /** HTML id for anchor links */
  id?: string;
  /** Hide the header even if title is provided */
  hideHeader?: boolean;
  /** Custom max-width (default: 6xl) */
  maxWidth?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  /** Animation delay for scroll reveal */
  animationDelay?: number;
  /** Padding top override */
  pt?: string;
  /** Padding bottom override */
  pb?: string;
}

/**
 * Standardized Section component for consistent layout across all sections.
 * 
 * Features:
 * - Consistent spacing: py-16 md:py-24
 * - Container: max-w-6xl mx-auto px-6
 * - Built-in header with icon, title, subtitle
 * - Decorative separator option
 * - Alternating backgrounds support
 * - Theme-aware styling
 */
export default function Section({
  title,
  subtitle,
  icon,
  theme,
  children,
  className = '',
  showSeparator = false,
  variant = 'default',
  id,
  hideHeader = false,
  maxWidth = '6xl',
  animationDelay = 0,
  pt,
  pb,
}: SectionProps) {
  const styles = useTheme(theme);
  const siteType = useOccasionType();

  // Determine background based on variant
  const getBackgroundClass = () => {
    switch (variant) {
      case 'alt':
        return styles.sectionBgAlt;
      case 'glass':
        return 'bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm';
      default:
        return styles.sectionBg;
    }
  };

  // Padding classes
  const paddingTop = pt || 'py-16 md:py-24';
  const paddingBottom = pb || '';

  const sectionContent = (
    <>
      {/* Section Header */}
      {!hideHeader && (title || subtitle) && (
        <ScrollReveal animation="fade-up" delay={animationDelay}>
          <SectionHeader
            icon={icon || '💕'}
            title={title || ''}
            subtitle={subtitle || ''}
            theme={theme}
            siteType={siteType}
          />
        </ScrollReveal>
      )}

      {/* Section Content */}
      <ScrollReveal animation="fade-up" delay={animationDelay + 100}>
        <div className={hideHeader ? '' : 'mt-8'}>
          {children}
        </div>
      </ScrollReveal>
    </>
  );

  return (
    <>
      <section
        id={id}
        className={`
          ${paddingTop} ${paddingBottom}
          ${getBackgroundClass()}
          ${className}
        `}
      >
        <div className={`max-w-${maxWidth} mx-auto px-4 md:px-6`}>
          {sectionContent}
        </div>
      </section>

      {/* Decorative Separator */}
      {showSeparator && (
        <div className="relative">
          {/* Hearts separator */}
          <div className="absolute left-0 right-0 -top-3 flex justify-center">
            <div className="bg-white dark:bg-zinc-900 px-4">
              <span className="text-rose-300 text-lg leading-none">
                💕
              </span>
            </div>
          </div>
          
          {/* Divider line */}
          <div className="border-t border-rose-100 dark:border-zinc-800" />
        </div>
      )}
    </>
  );
}

/**
 * Compact version of Section for smaller sections
 */
export function SectionCompact({
  title,
  subtitle,
  icon,
  theme,
  children,
  className = '',
  id,
}: Omit<SectionProps, 'variant' | 'showSeparator' | 'pt' | 'pb' | 'maxWidth'>) {
  const siteType = useOccasionType();

  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${theme === 'dark_elegant' ? 'bg-zinc-900' : 'bg-white'} ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <SectionHeader
            icon={icon || '💕'}
            title={title || ''}
            subtitle={subtitle || ''}
            theme={theme}
            siteType={siteType}
            className="mb-6"
          />
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Section separator component for manual placement
 */
export function SectionSeparator({ theme }: { theme?: ThemeKey }) {
  const siteType = useOccasionType();
  const occasionHero = getOccasionHeroSpec(siteType);
  const borderColor = theme === 'dark_elegant' ? '#3f3f46' : '#fce7f3';
  const iconColor =
    siteType === 'wedding'
      ? 'text-amber-400'
      : siteType === 'memorial'
        ? 'text-white/70'
        : siteType === 'travel'
          ? 'text-sky-500'
          : theme === 'dark_elegant'
            ? 'text-amber-300'
            : 'text-rose-500';
  const dividerIcon =
    siteType === 'wedding'
      ? '💍'
      : siteType === 'memorial'
        ? '🕊️'
        : siteType === 'travel'
          ? '✈️'
          : occasionHero.badge;

  return (
    <div className="relative py-8 md:py-10 flex justify-center items-center">
      <div className="w-full max-w-3xl relative">
        <div className="h-px w-full rounded-full" style={{ background: `linear-gradient(to right, transparent, ${borderColor}, transparent)` }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 shadow-lg px-4 py-1.5 bg-white">
          <span className={`text-xl ${iconColor} animate-gentle-pulse`}>
            {dividerIcon}
          </span>
        </div>
      </div>
    </div>
  );
}

