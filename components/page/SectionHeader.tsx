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

// Updated accent colors
const themeAccents: Record<Theme, { icon: string; title: string; subtitle: string; line: string }> = {
  romantic_classic: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-300',
    line: 'from-rose-400 via-pink-400 to-rose-400',
  },
  cute_pastel: {
    icon: 'text-purple-400',
    title: 'text-purple-900',
    subtitle: 'text-purple-400',
    line: 'from-purple-400 via-pink-300 to-purple-400',
  },
  minimal_modern: {
    icon: 'text-slate-400',
    title: 'text-slate-900',
    subtitle: 'text-slate-500',
    line: 'from-slate-400 via-gray-300 to-slate-400',
  },
  dark_elegant: {
    icon: 'text-amber-400',
    title: 'text-zinc-100',
    subtitle: 'text-zinc-400',
    line: 'from-amber-400 via-yellow-300 to-amber-400',
  },
  soft_pastel: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-400',
    line: 'from-pink-400 via-rose-300 to-pink-400',
  },
  elegant_rose_gold: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-300',
    line: 'from-rose-400 via-amber-300 to-rose-400',
  },
  vintage_love_letter: {
    icon: 'text-amber-600',
    title: 'text-amber-900',
    subtitle: 'text-amber-500',
    line: 'from-amber-400 via-yellow-300 to-amber-400',
  },
  scrapbook_memories: {
    icon: 'text-amber-500',
    title: 'text-amber-900',
    subtitle: 'text-amber-500',
    line: 'from-amber-400 via-orange-300 to-amber-400',
  },
  wedding_style: {
    icon: 'text-rose-400',
    title: 'text-rose-900',
    subtitle: 'text-rose-300',
    line: 'from-rose-400 via-pink-300 to-rose-400',
  },
  floral_romance: {
    icon: 'text-pink-500',
    title: 'text-pink-900',
    subtitle: 'text-pink-400',
    line: 'from-pink-500 via-rose-300 to-pink-500',
  },
  dreamy_pink: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-400',
    line: 'from-pink-400 via-fuchsia-300 to-pink-400',
  },
  luxury_gold: {
    icon: 'text-yellow-500',
    title: 'text-yellow-900',
    subtitle: 'text-yellow-500',
    line: 'from-yellow-400 via-amber-300 to-yellow-400',
  },
  minimal_white: {
    icon: 'text-slate-400',
    title: 'text-slate-900',
    subtitle: 'text-slate-500',
    line: 'from-slate-400 via-gray-300 to-slate-400',
  },
  cute_kawaii: {
    icon: 'text-pink-400',
    title: 'text-pink-900',
    subtitle: 'text-pink-400',
    line: 'from-pink-400 via-rose-300 to-pink-400',
  },
  soft_lavender: {
    icon: 'text-violet-400',
    title: 'text-violet-900',
    subtitle: 'text-violet-400',
    line: 'from-violet-400 via-purple-300 to-violet-400',
  },
  colorful_celebration: {
    icon: 'text-amber-500',
    title: 'text-orange-900',
    subtitle: 'text-orange-500',
    line: 'from-yellow-400 via-orange-400 to-pink-400',
  },
  photo_focus: {
    icon: 'text-slate-500',
    title: 'text-slate-900',
    subtitle: 'text-slate-500',
    line: 'from-slate-500 via-gray-400 to-slate-500',
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

  const romanticThemes = [
    'romantic_classic',
    'elegant_rose_gold',
    'wedding_style',
    'floral_romance',
    'dreamy_pink',
    'cute_pastel',
    'soft_pastel',
  ];

  const isRomantic = romanticThemes.includes(theme);

  return (
    <div className={`text-center mb-10 lg:mb-14 max-w-2xl mx-auto ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="mb-2">
          <span className={`inline-block text-3xl md:text-4xl ${accents.icon}`}>
            {icon}
          </span>
        </div>
      )}

      {/* Title */}
      <h2
        className={`${styles.heading} text-3xl md:text-4xl lg:text-[3.25rem] font-bold leading-tight tracking-tight`}
      >
        <span className={`bg-gradient-to-r ${accents.line} bg-clip-text text-transparent`}>
          {title}
        </span>
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`section-subtitle mt-3 text-sm md:text-base lg:text-lg font-medium leading-relaxed tracking-wide max-w-md mx-auto ${accents.subtitle}`}
        >
          {subtitle}
        </p>
      )}

      {/* Section rule */}
      <div
        className={`mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${accents.line} opacity-80 ${
          isRomantic ? 'shimmer-rose' : ''
        }`}
      />
    </div>
  );
}