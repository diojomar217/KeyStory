// config/sectionBgColor.ts

import type { ThemeKey } from '@/config/themeConfig';

export const SECTION_BG_COLOR: Record<ThemeKey, { default: string; alt: string }> = {
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

export function getSectionBgColor(theme: ThemeKey) {
  return SECTION_BG_COLOR[theme] ?? SECTION_BG_COLOR.romantic_classic;
}