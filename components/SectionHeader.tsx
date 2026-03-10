'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';

interface SectionHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  theme: Theme;
  className?: string;
}

// Theme-specific accent colors
const themeAccents: Record<Theme, { icon: string; title: string; subtitle: string; line: string }> = {
  romantic_classic: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-700',
    line: 'from-rose-300 via-pink-300 to-rose-300',
  },
  cute_pastel: {
    icon: 'text-purple-400',
    title: 'text-purple-900',
    subtitle: 'text-purple-700',
    line: 'from-purple-300 via-pink-300 to-purple-300',
  },
  minimal_modern: {
    icon: 'text-slate-400',
    title: 'text-slate-900',
    subtitle: 'text-slate-700',
    line: 'from-slate-300 via-gray-300 to-slate-300',
  },
  dark_elegant: {
    icon: 'text-amber-400',
    title: 'text-zinc-100',
    subtitle: 'text-zinc-400',
    line: 'from-amber-400 via-yellow-300 to-amber-400',
  },
};

export default function SectionHeader({
  icon,
  title,
  subtitle,
  theme,
  className = '',
}: SectionHeaderProps) {
  const styles = useTheme(theme);
  const accents = themeAccents[theme] || themeAccents.romantic_classic;

  return (
    <div className={`text-center mb-8 ${className}`}>
      {/* Icon */}
      <div className="inline-flex items-center justify-center mb-3">
        <span className={`text-2xl ${accents.icon}`}>{icon}</span>
      </div>

      {/* Title */}
      <h2 className={`${styles.heading} text-2xl md:text-3xl font-semibold ${accents.title}`}>
        {title}
      </h2>

      {/* Decorative line */}
      <div className={`w-16 h-0.5 mx-auto rounded-full bg-gradient-to-r ${accents.line} mt-3`} />

      {/* Subtitle */}
      <p className={`mt-3 text-base md:text-lg ${accents.subtitle} font-light max-w-xl mx-auto`}>
        {subtitle}
      </p>
    </div>
  );
}

