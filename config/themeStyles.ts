// config/themeStyles.ts

import type { ThemeKey } from '@/config/themeConfig';

export interface ThemeStyles {
  bg: string;
  bgFrom: string;
  bgTo: string;
  text: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentLight: string;
  card: string;
  cardBorder: string;
  glassCard: string;
  glassBorder: string;
  timerBg: string;
  timerBorder: string;
  heading: string;
  border: string;
  sectionBg: string;
  sectionBgAlt: string;
  heroBg: string;
  footerBg: string;
  gradient: string;
  overlay: string;
  heroOverlay: string;
  heroVignette: string;
  heroGradient: string;
}

export interface ThemeAccentClasses {
  icon: string;
  title: string;
  subtitle: string;
  line: string;
}

const BASE_THEME_STYLES = {
  romantic_classic: {
    bg: 'bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100',
    bgFrom: 'from-rose-50',
    bgTo: 'to-pink-100',
    text: 'text-rose-900',
    textMuted: 'text-rose-700',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-600',
    accentLight: 'bg-rose-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-rose-200',
    glassCard: 'bg-white/70 backdrop-blur-md',
    glassBorder: 'border-white/40',
    timerBg: 'bg-white/80 backdrop-blur-sm',
    timerBorder: 'border-rose-100',
    heading: 'font-serif',
    border: 'border-rose-300',
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-rose-50/50',
    heroBg: 'bg-gradient-to-b from-rose-100 via-pink-50 to-rose-50',
    footerBg: 'bg-rose-900',
    gradient: 'from-rose-300 via-pink-300 to-rose-300',
    overlay: 'bg-gradient-to-t from-rose-900/30 to-transparent',
    heroOverlay: 'bg-gradient-to-b from-rose-900/40 via-rose-900/20 to-rose-900/50',
    heroVignette:
      'radial-gradient(ellipse at center, transparent 0%, rgba(120, 50, 70, 0.3) 100%)',
    heroGradient: 'from-rose-900/50 via-rose-800/30 to-rose-900/50',
  },

  cute_pastel: {
    bg: 'bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50',
    bgFrom: 'from-purple-50',
    bgTo: 'to-yellow-50',
    text: 'text-purple-900',
    textMuted: 'text-purple-700',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-600',
    accentLight: 'bg-purple-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-purple-200',
    glassCard: 'bg-white/70 backdrop-blur-md',
    glassBorder: 'border-white/40',
    timerBg: 'bg-white/80 backdrop-blur-sm',
    timerBorder: 'border-purple-100',
    heading: 'font-sans',
    border: 'border-purple-300',
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-purple-50/50',
    heroBg: 'bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50',
    footerBg: 'bg-purple-900',
    gradient: 'from-purple-300 via-pink-300 to-yellow-300',
    overlay: 'bg-gradient-to-t from-purple-900/20 to-transparent',
    heroOverlay: 'bg-gradient-to-b from-purple-900/40 via-purple-900/20 to-purple-900/50',
    heroVignette:
      'radial-gradient(ellipse at center, transparent 0%, rgba(100, 50, 120, 0.3) 100%)',
    heroGradient: 'from-purple-900/50 via-purple-800/30 to-purple-900/50',
  },

  minimal_modern: {
    bg: 'bg-gradient-to-b from-slate-50 via-gray-100 to-slate-200',
    bgFrom: 'from-slate-50',
    bgTo: 'to-gray-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-700',
    accent: 'text-slate-600',
    accentBg: 'bg-slate-600',
    accentLight: 'bg-slate-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardBorder: 'border-slate-200',
    glassCard: 'bg-white/80 backdrop-blur-md',
    glassBorder: 'border-white/50',
    timerBg: 'bg-white/90 backdrop-blur-sm',
    timerBorder: 'border-slate-100',
    heading: 'font-sans',
    border: 'border-slate-300',
    sectionBg: 'bg-white',
    sectionBgAlt: 'bg-gray-50',
    heroBg: 'bg-white',
    footerBg: 'bg-slate-900',
    gradient: 'from-slate-300 via-gray-300 to-slate-300',
    overlay: 'bg-gradient-to-t from-slate-900/20 to-transparent',
    heroOverlay: 'bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-900/40',
    heroVignette:
      'radial-gradient(ellipse at center, transparent 0%, rgba(50, 50, 60, 0.2) 100%)',
    heroGradient: 'from-slate-900/40 via-slate-800/20 to-slate-900/40',
  },

  dark_elegant: {
    bg: 'bg-gradient-to-b from-zinc-900 via-slate-900 to-zinc-800',
    bgFrom: 'from-zinc-900',
    bgTo: 'to-zinc-800',
    text: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentLight: 'bg-amber-500/20',
    card: 'bg-zinc-800/90 backdrop-blur-sm',
    cardBorder: 'border-zinc-700',
    glassCard: 'bg-zinc-800/70 backdrop-blur-md',
    glassBorder: 'border-zinc-600/50',
    timerBg: 'bg-zinc-800/80 backdrop-blur-sm',
    timerBorder: 'border-zinc-700',
    heading: 'font-serif',
    border: 'border-zinc-600',
    sectionBg: 'bg-zinc-800/50',
    sectionBgAlt: 'bg-zinc-900/50',
    heroBg: 'bg-gradient-to-b from-zinc-800 via-slate-900 to-zinc-900',
    footerBg: 'bg-black',
    gradient: 'from-amber-400 via-yellow-300 to-amber-400',
    overlay: 'bg-gradient-to-t from-black/70 to-transparent',
    heroOverlay: 'bg-gradient-to-b from-black/70 via-black/40 to-black/70',
    heroVignette:
      'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
    heroGradient: 'from-black/60 via-zinc-900/40 to-black/60',
  },
} as const satisfies Record<string, ThemeStyles>;

function cloneThemeStyles(styles: ThemeStyles): ThemeStyles {
  return { ...styles };
}

// THEME_STYLES is now private to this module. Use getThemeStyles helper only.
const THEME_STYLES: Record<ThemeKey, ThemeStyles> = {
  romantic_classic: cloneThemeStyles(BASE_THEME_STYLES.romantic_classic),
  cute_pastel: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  minimal_modern: cloneThemeStyles(BASE_THEME_STYLES.minimal_modern),
  dark_elegant: cloneThemeStyles(BASE_THEME_STYLES.dark_elegant),

  soft_pastel: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  elegant_rose_gold: cloneThemeStyles(BASE_THEME_STYLES.romantic_classic),
  vintage_love_letter: cloneThemeStyles(BASE_THEME_STYLES.romantic_classic),
  scrapbook_memories: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  wedding_style: cloneThemeStyles(BASE_THEME_STYLES.romantic_classic),
  floral_romance: cloneThemeStyles(BASE_THEME_STYLES.romantic_classic),
  dreamy_pink: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  luxury_gold: cloneThemeStyles(BASE_THEME_STYLES.dark_elegant),
  minimal_white: cloneThemeStyles(BASE_THEME_STYLES.minimal_modern),
  cute_kawaii: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  soft_lavender: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  colorful_celebration: cloneThemeStyles(BASE_THEME_STYLES.cute_pastel),
  photo_focus: cloneThemeStyles(BASE_THEME_STYLES.minimal_modern),
};

const THEME_ACCENT_CLASSES: Record<ThemeKey, ThemeAccentClasses> = {
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

export function getThemeStyles(theme: ThemeKey): ThemeStyles {
  return THEME_STYLES[theme] ?? THEME_STYLES.romantic_classic;
}

export function getThemeAccentClasses(theme: ThemeKey): ThemeAccentClasses {
  return THEME_ACCENT_CLASSES[theme] ?? THEME_ACCENT_CLASSES.romantic_classic;
}