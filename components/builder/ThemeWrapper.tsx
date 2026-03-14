'use client';

import { Theme } from '@/lib/types';
import { ReactNode } from 'react';

export interface ThemeStyles {
  // Base backgrounds
  bg: string;
  bgFrom: string;
  bgTo: string;
  
  // Text colors
  text: string;
  textMuted: string;
  
  // Accent colors
  accent: string;
  accentBg: string;
  accentLight: string;
  
  // Card styles
  card: string;
  cardBorder: string;
  
  // Glassmorphism card (for love message)
  glassCard: string;
  glassBorder: string;
  
  // Timer pill styles
  timerBg: string;
  timerBorder: string;
  
  // Typography
  heading: string;
  border: string;
  
  // Section-specific backgrounds
  sectionBg: string;
  sectionBgAlt: string;
  heroBg: string;
  footerBg: string;
  
  // Decorative elements
  gradient: string;
  overlay: string;
  
  // Hero-specific overlays
  heroOverlay: string;
  heroVignette: string;
  heroGradient: string;
}

export const themeStyles: Record<Theme, ThemeStyles> = {
  romantic_classic: {
    // Base backgrounds
    bg: 'bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100',
    bgFrom: 'from-rose-50',
    bgTo: 'to-pink-100',
    
    // Text colors
    text: 'text-rose-900',
    textMuted: 'text-rose-700',
    
    // Accent colors
    accent: 'text-rose-600',
    accentBg: 'bg-rose-600',
    accentLight: 'bg-rose-100',
    
    // Card styles
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-rose-200',
    
    // Glassmorphism card (for love message)
    glassCard: 'bg-white/70 backdrop-blur-md',
    glassBorder: 'border-white/40',
    
    // Timer pill styles
    timerBg: 'bg-white/80 backdrop-blur-sm',
    timerBorder: 'border-rose-100',
    
    // Typography
    heading: 'font-serif',
    border: 'border-rose-300',
    
    // Section-specific backgrounds
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-rose-50/50',
    heroBg: 'bg-gradient-to-b from-rose-100 via-pink-50 to-rose-50',
    footerBg: 'bg-rose-900',
    
    // Decorative elements
    gradient: 'from-rose-300 via-pink-300 to-rose-300',
    overlay: 'bg-gradient-to-t from-rose-900/30 to-transparent',
    
    // Hero-specific overlays
    heroOverlay: 'bg-gradient-to-b from-rose-900/40 via-rose-900/20 to-rose-900/50',
    heroVignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(120, 50, 70, 0.3) 100%)',
    heroGradient: 'from-rose-900/50 via-rose-800/30 to-rose-900/50',
  },
  cute_pastel: {
    // Base backgrounds
    bg: 'bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50',
    bgFrom: 'from-purple-50',
    bgTo: 'to-yellow-50',
    
    // Text colors
    text: 'text-purple-900',
    textMuted: 'text-purple-700',
    
    // Accent colors
    accent: 'text-purple-600',
    accentBg: 'bg-purple-600',
    accentLight: 'bg-purple-100',
    
    // Card styles
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-purple-200',
    
    // Glassmorphism card (for love message)
    glassCard: 'bg-white/70 backdrop-blur-md',
    glassBorder: 'border-white/40',
    
    // Timer pill styles
    timerBg: 'bg-white/80 backdrop-blur-sm',
    timerBorder: 'border-purple-100',
    
    // Typography
    heading: 'font-sans',
    border: 'border-purple-300',
    
    // Section-specific backgrounds
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-purple-50/50',
    heroBg: 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50',
    footerBg: 'bg-purple-900',
    
    // Decorative elements
    gradient: 'from-purple-300 via-pink-300 to-yellow-300',
    overlay: 'bg-gradient-to-t from-purple-900/20 to-transparent',
    
    // Hero-specific overlays
    heroOverlay: 'bg-gradient-to-b from-purple-900/40 via-purple-900/20 to-purple-900/50',
    heroVignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(100, 50, 120, 0.3) 100%)',
    heroGradient: 'from-purple-900/50 via-purple-800/30 to-purple-900/50',
  },
  minimal_modern: {
    // Base backgrounds
    bg: 'bg-gradient-to-b from-slate-50 via-gray-100 to-slate-200',
    bgFrom: 'from-slate-50',
    bgTo: 'to-gray-200',
    
    // Text colors
    text: 'text-slate-900',
    textMuted: 'text-slate-700',
    
    // Accent colors
    accent: 'text-slate-600',
    accentBg: 'bg-slate-600',
    accentLight: 'bg-slate-100',
    
    // Card styles
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-slate-200',
    
    // Glassmorphism card (for love message)
    glassCard: 'bg-white/80 backdrop-blur-md',
    glassBorder: 'border-white/50',
    
    // Timer pill styles
    timerBg: 'bg-white/90 backdrop-blur-sm',
    timerBorder: 'border-slate-100',
    
    // Typography
    heading: 'font-sans',
    border: 'border-slate-300',
    
    // Section-specific backgrounds
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-gray-50',
    heroBg: 'bg-white',
    footerBg: 'bg-slate-900',
    
    // Decorative elements
    gradient: 'from-slate-300 via-gray-300 to-slate-300',
    overlay: 'bg-gradient-to-t from-slate-900/20 to-transparent',
    
    // Hero-specific overlays
    heroOverlay: 'bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-900/40',
    heroVignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(50, 50, 60, 0.2) 100%)',
    heroGradient: 'from-slate-900/40 via-slate-800/20 to-slate-900/40',
  },
  dark_elegant: {
    // Base backgrounds
    bg: 'bg-gradient-to-b from-zinc-900 via-slate-900 to-zinc-800',
    bgFrom: 'from-zinc-900',
    bgTo: 'to-zinc-800',
    
    // Text colors
    text: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    
    // Accent colors
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentLight: 'bg-amber-500/20',
    
    // Card styles
    card: 'bg-zinc-800/90 backdrop-blur-sm',
    cardBorder: 'border-zinc-700',
    
    // Glassmorphism card (for love message)
    glassCard: 'bg-zinc-800/70 backdrop-blur-md',
    glassBorder: 'border-zinc-600/50',
    
    // Timer pill styles
    timerBg: 'bg-zinc-800/80 backdrop-blur-sm',
    timerBorder: 'border-zinc-700',
    
    // Typography
    heading: 'font-serif',
    border: 'border-zinc-600',
    
    // Section-specific backgrounds
    sectionBg: 'bg-zinc-800/50',
    sectionBgAlt: 'bg-zinc-900/50',
    heroBg: 'bg-gradient-to-b from-zinc-800 via-slate-900 to-zinc-900',
    footerBg: 'bg-black',
    
    // Decorative elements
    gradient: 'from-amber-400 via-yellow-300 to-amber-400',
    overlay: 'bg-gradient-to-t from-black/70 to-transparent',
    
    // Hero-specific overlays
    heroOverlay: 'bg-gradient-to-b from-black/70 via-black/40 to-black/70',
    heroVignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
    heroGradient: 'from-black/60 via-zinc-900/40 to-black/60',
  },
  // Additional 12 themes - using fallback styles
  soft_pastel: {} as ThemeStyles,
  elegant_rose_gold: {} as ThemeStyles,
  vintage_love_letter: {} as ThemeStyles,
  scrapbook_memories: {} as ThemeStyles,
  wedding_style: {} as ThemeStyles,
  floral_romance: {} as ThemeStyles,
  dreamy_pink: {} as ThemeStyles,
  luxury_gold: {} as ThemeStyles,
  minimal_white: {} as ThemeStyles,
  cute_kawaii: {} as ThemeStyles,
  soft_lavender: {} as ThemeStyles,
  photo_focus: {} as ThemeStyles,
  colorful_celebration: {} as ThemeStyles,
};

type Props = {
  theme: Theme;
  children: ReactNode;
  className?: string;
};

export default function ThemeWrapper({ theme, children, className = '' }: Props) {
  const styles = themeStyles[theme] || themeStyles.romantic_classic;

  return (
    <div className={`${styles.bg} ${styles.text} min-h-screen w-full `}>
      {children}
    </div>
  );
}

export function useTheme(theme: Theme): ThemeStyles {
  return themeStyles[theme] || themeStyles.romantic_classic;
}

