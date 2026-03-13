'use client';

import { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';
import SectionHeader from './SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';

interface SectionProps {
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
  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${theme === 'dark_elegant' ? 'bg-zinc-900' : 'bg-white'} ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {icon && <span className="text-2xl mb-2 block">{icon}</span>}
            {title && (
              <h2 className={`text-2xl md:text-3xl font-bold font-serif ${
                theme === 'dark_elegant' ? 'text-zinc-100' : 'text-rose-900'
              }`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-2 ${
                theme === 'dark_elegant' ? 'text-zinc-400' : 'text-rose-700'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * Section separator component for manual placement
 */
export function SectionSeparator({ theme }: { theme?: Theme }) {
  return (
    <div className="relative py-2">
      {/* Hearts in the middle */}
      <div className="absolute left-0 right-0 -top-3 flex justify-center items-center">
        <div className={theme === 'dark_elegant' ? 'bg-zinc-900 px-3' : 'bg-white px-3'}>
          <span className="text-rose-300 text-sm">
            💕
          </span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-rose-100 dark:border-zinc-800" />
    </div>
  );
}

