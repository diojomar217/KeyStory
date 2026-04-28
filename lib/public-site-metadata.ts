import { getOccasionMetadata } from '@/lib/occasion-registry';
import type { OccasionType } from '@/lib/types';

export function humanizeSlug(slug: string): string {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://key-story.vercel.app');
}

export function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${getBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`;
}

export function buildOccasionTitle(siteType: OccasionType, displayName: string, fallbackName: string): string {
  const name = displayName || fallbackName;

  switch (siteType) {
    case 'birthday':
      return `${name} - Birthday Celebration`;
    case 'wedding':
      return `${name} - Wedding Day`;
    case 'proposal':
      return `${name} - Proposal Story`;
    case 'anniversary':
      return `${name} - Anniversary Memories`;
    case 'graduation':
      return `${name} - Graduation Tribute`;
    case 'baby_shower':
      return `${name} - Baby Shower Celebration`;
    case 'debut':
      return `${name} - Debut Celebration`;
    case 'memorial':
      return `${name} - In Loving Memory`;
    case 'family':
      return `${name} - Family Keepsake`;
    case 'friendship':
      return `${name} - Friendship Story`;
    case 'travel':
      return `${name} - Travel Journal`;
    case 'valentines':
      return `${name} - Valentine's Story`;
    case 'mothers_day':
      return `${name} - Mother's Day Tribute`;
    case 'fathers_day':
      return `${name} - Father's Day Tribute`;
    case 'couple':
    default:
      return `${name} - Our Story`;
  }
}

export function buildOccasionDescription(
  siteType: OccasionType,
  displayName: string,
  tagline: string | null | undefined,
  specialDate: string | null | undefined,
): string {
  const occasionMeta = getOccasionMetadata(siteType);
  const trimmedTagline = tagline?.trim();
  const name = displayName || occasionMeta.label;
  const dateLine = specialDate ? ` ${occasionMeta.specialDateLabel}: ${specialDate}.` : '';

  if (trimmedTagline) {
    return `${trimmedTagline}${dateLine}`.trim();
  }

  switch (siteType) {
    case 'birthday':
      return `A birthday celebration page for ${name}.${dateLine}`.trim();
    case 'wedding':
      return `A wedding website for ${name}, filled with details, memories, and celebration.${dateLine}`.trim();
    case 'proposal':
      return `A proposal story page capturing one unforgettable yes.${dateLine}`.trim();
    case 'anniversary':
      return `An anniversary keepsake celebrating the story of ${name}.${dateLine}`.trim();
    case 'graduation':
      return `A graduation tribute page honoring ${name} and this milestone achievement.${dateLine}`.trim();
    case 'baby_shower':
      return `A baby shower page celebrating ${name} and the little one on the way.${dateLine}`.trim();
    case 'debut':
      return `A debut celebration page made for ${name} and this special occasion.${dateLine}`.trim();
    case 'memorial':
      return `A memorial tribute page created in loving remembrance of ${name}.${dateLine}`.trim();
    case 'family':
      return `A family keepsake page preserving shared memories for ${name}.${dateLine}`.trim();
    case 'friendship':
      return `A friendship story page celebrating shared memories, laughter, and milestones.${dateLine}`.trim();
    case 'travel':
      return `A travel journal page capturing destinations, memories, and adventures.${dateLine}`.trim();
    case 'valentines':
      return `A Valentine's keepsake page filled with love, memories, and heartfelt moments.${dateLine}`.trim();
    case 'mothers_day':
      return `A Mother's Day tribute page created with love and gratitude.${dateLine}`.trim();
    case 'fathers_day':
      return `A Father's Day tribute page honoring strength, care, and love.${dateLine}`.trim();
    case 'couple':
    default:
      return `A special website celebrating the story of ${name}.${dateLine}`.trim();
  }
}

export function buildSocialImageUrl(slug: string): string {
  return `${getBaseUrl()}/site/${slug}/opengraph-image`;
}