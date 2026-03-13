'use client';

import type { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  theme: Theme;
  className?: string;
}

// Theme-specific accent colors - simplified for plain subtitle
const themeAccents: Record<Theme, { icon: string; title: string; subtitle: string; line: string }> = {
  romantic_classic: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-600',
    line: 'from-rose-300 via-pink-300 to-rose-300',
  },
  // ... (all other themes unchanged)
  cute_pastel: {
    icon: 'text-purple-400',
    title: 'text-purple-900',
    subtitle: 'text-purple-600',
    line: 'from-purple-300 via-pink-300 to-purple-300',
  },
  minimal_modern: {
    icon: 'text-slate-400',
    title: 'text-slate-900',
    subtitle: 'text-slate-600',
    line: 'from-slate-300 via-gray-300 to-slate-300',
  },
  dark_elegant: {
    icon: 'text-amber-400',
    title: 'text-zinc-100',
    subtitle: 'text-zinc-300',
    line: 'from-amber-400 via-yellow-300 to-amber-400',
  },
  soft_pastel: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-600',
    line: 'from-pink-300 via-rose-300 to-pink-300',
  },
  elegant_rose_gold: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-600',
    line: 'from-rose-300 via-amber-200 to-rose-300',
  },
  vintage_love_letter: {
    icon: 'text-amber-600',
    title: 'text-amber-900',
    subtitle: 'text-amber-600',
    line: 'from-amber-300 via-yellow-200 to-amber-300',
  },
  scrapbook_memories: {
    icon: 'text-amber-500',
    title: 'text-amber-900',
    subtitle: 'text-amber-600',
    line: 'from-amber-300 via-orange-200 to-amber-300',
  },
  wedding_style: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-600',
    line: 'from-rose-300 via-pink-200 to-rose-300',
  },
  floral_romance: {
    icon: 'text-pink-500',
    title: 'text-pink-900',
    subtitle: 'text-pink-600',
    line: 'from-pink-300 via-rose-200 to-pink-300',
  },
  dreamy_pink: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-600',
    line: 'from-pink-300 via-fuchsia-200 to-pink-300',
  },
  luxury_gold: {
    icon: 'text-yellow-500',
    title: 'text-yellow-900',
    subtitle: 'text-yellow-600',
    line: 'from-yellow-300 via-amber-200 to-yellow-300',
  },
  minimal_white: {
    icon: 'text-slate-400',
    title: 'text-slate-900',
    subtitle: 'text-slate-600',
    line: 'from-slate-300 via-gray-200 to-slate-300',
  },
  cute_kawaii: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-600',
    line: 'from-pink-300 via-rose-200 to-pink-300',
  },
  soft_lavender: {
    icon: 'text-violet-400',
    title: 'text-violet-900',
    subtitle: 'text-violet-600',
    line: 'from-violet-300 via-purple-200 to-violet-300',
  },
  photo_focus: {
    icon: 'text-slate-500',
    title: 'text-slate-900',
    subtitle: 'text-slate-600',
    line: 'from-slate-400 via-gray-300 to-slate-400',
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
    <div className={`text-center mb-16 lg:mb-24 max-w-3xl mx-auto ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="inline-flex items-center justify-center mb-6 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl ring-2 ring-offset-4 ring-rose-100/50">
          <span className={`text-3xl md:text-4xl drop-shadow-2xl ring-2 ring-offset-2 ring-white/50 shadow-lg ${accents.icon}`}>{icon}</span>
        </div>
      )}

      {/* Title */}
      <h2 className={`${styles.heading} text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent ${accents.title}`}>
        {title}
      </h2>

      {/* Decorative line */}
      <div className={`w-20 h-1.5 mx-auto rounded-full bg-gradient-to-r ${accents.line} mt-4 shadow-lg`} />

      {/* Subtitle */}
      {subtitle && (
        <p className={`mt-6 text-lg md:text-xl font-medium max-w-xl mx-auto text-rose-600/700 ${accents.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
