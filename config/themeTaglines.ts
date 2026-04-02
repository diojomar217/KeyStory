// config/themeTaglines.ts

import type { ThemeKey } from '@/config/themeConfig';

export const THEME_TAGLINES: Record<ThemeKey, string[]> = {
  romantic_classic: [
    'Every love story is beautiful, but ours is my favorite.',
    'A little code that leads to a lot of memories.',
    'Scan to view our story',
    'Where it all began...',
  ],
  cute_pastel: [
    'You + Me = ❤️',
    'Our love in one scan!',
    'Tap into our sweet memories ✨',
    'Love is in the air!',
  ],
  minimal_modern: [
    'Our story, one scan away.',
    'A glimpse into us.',
    'Scan to explore.',
    'The beginning of forever.',
  ],
  dark_elegant: [
    'A love worth preserving.',
    'In the darkness, you are my light.',
    'Scan to discover our tale.',
    'Forever begins with you.',
  ],
  soft_pastel: [
    'Every love story is beautiful, but ours is my favorite.',
    'A little code that leads to a lot of memories.',
    'Scan to view our story',
    'Where it all began...',
  ],
  elegant_rose_gold: [
    'A love worth preserving.',
    'In the darkness, you are my light.',
    'Scan to discover our tale.',
    'Forever begins with you.',
  ],
  vintage_love_letter: [
    'A little code that leads to a lot of memories.',
    'Every love story is beautiful, but ours is my favorite.',
    'Scan to view our story',
    'Where it all began...',
  ],
  scrapbook_memories: [
    'You + Me = ❤️',
    'Our love in one scan!',
    'Tap into our sweet memories ✨',
    'Love is in the air!',
  ],
  wedding_style: [
    'Forever begins with you.',
    'A love worth preserving.',
    'Scan to discover our tale.',
    'Where it all began...',
  ],
  floral_romance: [
    'Every love story is beautiful, but ours is my favorite.',
    'A little code that leads to a lot of memories.',
    'Scan to view our story',
    'Where it all began...',
  ],
  dreamy_pink: [
    'You + Me = ❤️',
    'Our love in one scan!',
    'Tap into our sweet memories ✨',
    'Love is in the air!',
  ],
  luxury_gold: [
    'A love worth preserving.',
    'In the darkness, you are my light.',
    'Scan to discover our tale.',
    'Forever begins with you.',
  ],
  minimal_white: [
    'Our story, one scan away.',
    'A glimpse into us.',
    'Scan to explore.',
    'The beginning of forever.',
  ],
  cute_kawaii: [
    'You + Me = ❤️',
    'Our love in one scan!',
    'Tap into our sweet memories ✨',
    'Love is in the air!',
  ],
  soft_lavender: [
    'Every love story is beautiful, but ours is my favorite.',
    'A little code that leads to a lot of memories.',
    'Scan to view our story',
    'Where it all began...',
  ],
  colorful_celebration: [
    'Celebrate together with one scan!',
    'A joyful journey starts here.',
    'Discover our birthday surprise.',
    'Scan and join the celebration!',
  ],
  photo_focus: [
    'Our story, one scan away.',
    'A glimpse into us.',
    'Scan to explore.',
    'The beginning of forever.',
  ],
};

export function getThemeTaglines(theme: ThemeKey) {
  return THEME_TAGLINES[theme] ?? THEME_TAGLINES.romantic_classic;
}