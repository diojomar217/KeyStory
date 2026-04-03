import { OccasionType, getOccasionMetadata } from './occasion-registry';
import { Participant } from './types';
import { formatOccasionDisplayName } from './public-site-copy';

export type DecoratorSet = {
  iconSet: string[];
  badge: string;
  themeTone: 'romantic' | 'celebration' | 'elegant' | 'soft';
};

export type CTAConfig = {
  primary: string;
  secondary: string;
  startIcon: string;
  endIcon: string;
};

export type HeroConfig = {
  title: string;
  subtitle: string;
  description: string;
  cta: CTAConfig;
  decorations: DecoratorSet;
};

export type FooterConfig = {
  tagline: string;
  decorations: string[];
};

export const resolveDisplayName = (
  siteType: OccasionType,
  participants: Participant[] = [],
  customerName = '',
  partnerName = '',
) => {
  const primary = participants[0]?.name || customerName || (siteType === 'birthday' ? 'Birthday Star' : 'Your Name');
  const secondary = participants[1]?.name || partnerName || '';

  return formatOccasionDisplayName(siteType, primary, secondary);
};

export const resolveParticipantNames = (
  siteType: OccasionType,
  participants: Participant[] = [],
  customerName = '',
  partnerName = '',
): { primaryName: string; secondaryName: string; displayName: string } => {
  const primaryName = participants[0]?.name || customerName || (siteType === 'birthday' ? 'Birthday Star' : 'Your Name');
  const secondaryName = participants[1]?.name || partnerName || '';

  const isSingleNameOccasion = ['birthday', 'graduation', 'debut', 'memorial', 'mothers_day', 'fathers_day'].includes(siteType);

  return {
    primaryName,
    secondaryName: isSingleNameOccasion ? '' : secondaryName,
    displayName: formatOccasionDisplayName(siteType, primaryName, secondaryName),
  };
};

export const resolveHeroSubtitle = (
  siteType: OccasionType,
  specialDate?: string,
  customerName?: string,
) => {
  const occasionMeta = getOccasionMetadata(siteType);

  if (specialDate) {
    return `${occasionMeta.specialDateLabel}: ${specialDate}`;
  }

  switch (siteType) {
    case 'birthday':
      return `Happy Birthday ${customerName ?? ''}`.trim();
    case 'wedding':
      return 'A celebration of love, vows, and forever';
    case 'proposal':
      return 'The story behind one unforgettable yes';
    case 'anniversary':
      return 'Another chapter in a love story still growing';
    case 'graduation':
      return 'A proud milestone worth remembering';
    case 'baby_shower':
      return 'A sweet celebration for a little one on the way';
    case 'debut':
      return 'An unforgettable celebration of a new chapter';
    case 'memorial':
      return 'A space to remember, honor, and hold close';
    case 'family':
      return 'A keepsake built from shared memories';
    case 'friendship':
      return 'A story shaped by laughter, trust, and time';
    case 'travel':
      return 'A journal of places, moments, and memories';
    case 'valentines':
      return 'A love note made to be revisited';
    case 'mothers_day':
      return 'A tribute to love that shaped everything';
    case 'fathers_day':
      return 'A tribute to steady care, strength, and love';
    case 'couple':
    default:
      return 'A love journey to remember';
  }
};

export const resolveHeroStats = (
  siteType: OccasionType,
  specialDate?: string,
): { label: string; value: string }[] => {
  if (siteType === 'birthday') {
    const today = new Date();
    const date = specialDate ? new Date(specialDate) : null;
    const age = date ? today.getFullYear() - date.getFullYear() : NaN;
    const descending = date ? Math.max(0, age) : NaN;

    return [
      {
        label: 'Next Birthday',
        value: date ? `${date.toLocaleDateString()}` : 'To be set',
      },
      {
        label: 'Age',
        value: !Number.isNaN(descending) ? `${descending}` : 'N/A',
      },
    ];
  }

  const occasionMeta = getOccasionMetadata(siteType);

  return [
    {
      label: occasionMeta.specialDateLabel,
      value: specialDate || 'Set your date',
    },
  ];
};

export const resolveDefaultCTA = (siteType: OccasionType): CTAConfig => {
  switch (siteType) {
    case 'birthday':
      return {
        primary: 'Start the Celebration',
        secondary: 'View Memories',
        startIcon: '🎉',
        endIcon: '📸',
      };
    case 'wedding':
      return {
        primary: 'View RSVP',
        secondary: 'Meet the Couple',
        startIcon: '💍',
        endIcon: '💐',
      };
    case 'proposal':
      return {
        primary: 'Say Yes',
        secondary: 'View Proposal Story',
        startIcon: '💎',
        endIcon: '❤️',
      };
    case 'anniversary':
      return {
        primary: 'Relive Moments',
        secondary: 'Share your story',
        startIcon: '🥂',
        endIcon: '✨',
      };
    case 'graduation':
      return {
        primary: 'View Tribute',
        secondary: 'See Milestones',
        startIcon: '🎓',
        endIcon: '⭐',
      };
    case 'baby_shower':
      return {
        primary: 'Open Celebration',
        secondary: 'Read Messages',
        startIcon: '🍼',
        endIcon: '🧸',
      };
    case 'debut':
      return {
        primary: 'Enter the Celebration',
        secondary: 'See Highlights',
        startIcon: '👑',
        endIcon: '✨',
      };
    case 'memorial':
      return {
        primary: 'View Tribute',
        secondary: 'Read Messages',
        startIcon: '🕊️',
        endIcon: '🕯️',
      };
    case 'family':
      return {
        primary: 'Open Our Story',
        secondary: 'Browse Memories',
        startIcon: '🏡',
        endIcon: '📷',
      };
    case 'friendship':
      return {
        primary: 'Start the Story',
        secondary: 'See Shared Moments',
        startIcon: '🤝',
        endIcon: '📸',
      };
    case 'travel':
      return {
        primary: 'Open the Journey',
        secondary: 'View the Map',
        startIcon: '✈️',
        endIcon: '🗺️',
      };
    case 'valentines':
      return {
        primary: 'Open the Love Note',
        secondary: 'View Our Moments',
        startIcon: '💌',
        endIcon: '🌹',
      };
    case 'mothers_day':
      return {
        primary: 'Read the Tribute',
        secondary: 'View Memories',
        startIcon: '🌸',
        endIcon: '🤍',
      };
    case 'fathers_day':
      return {
        primary: 'Read the Tribute',
        secondary: 'View Memories',
        startIcon: '🧡',
        endIcon: '⭐',
      };
    case 'couple':
    default:
      return {
        primary: 'Start Our Story',
        secondary: 'View Our Memories',
        startIcon: '💕',
        endIcon: '📸',
      };
  }
};

export const resolveDecorations = (siteType: OccasionType): DecoratorSet => {
  switch (siteType) {
    case 'birthday':
      return {
        iconSet: ['🎉', '🎂', '🎈', '✨', '🌟', '🥳'],
        badge: '🥳',
        themeTone: 'celebration',
      };
    case 'wedding':
      return {
        iconSet: ['💍', '💒', '💕', '🌸', '✨'],
        badge: '💒',
        themeTone: 'elegant',
      };
    case 'proposal':
      return {
        iconSet: ['💎', '💍', '💘', '✨', '🥂'],
        badge: '💍',
        themeTone: 'romantic',
      };
    case 'anniversary':
      return {
        iconSet: ['💑', '🥂', '🎉', '✨', '💐'],
        badge: '🎉',
        themeTone: 'soft',
      };
    case 'graduation':
      return {
        iconSet: ['🎓', '⭐', '📘', '✨', '🎉'],
        badge: '🎓',
        themeTone: 'celebration',
      };
    case 'baby_shower':
      return {
        iconSet: ['🍼', '☁️', '🧸', '✨', '🌙'],
        badge: '🍼',
        themeTone: 'soft',
      };
    case 'debut':
      return {
        iconSet: ['👑', '✨', '🌸', '💫', '🥂'],
        badge: '👑',
        themeTone: 'elegant',
      };
    case 'memorial':
      return {
        iconSet: ['🕊️', '🤍', '✨', '🌿', '🕯️'],
        badge: '🕊️',
        themeTone: 'soft',
      };
    case 'family':
      return {
        iconSet: ['🏡', '🤎', '✨', '🌿', '📷'],
        badge: '🏡',
        themeTone: 'soft',
      };
    case 'friendship':
      return {
        iconSet: ['🤝', '✨', '💫', '🌈', '📸'],
        badge: '🤝',
        themeTone: 'celebration',
      };
    case 'travel':
      return {
        iconSet: ['✈️', '🗺️', '📍', '✨', '🌍'],
        badge: '✈️',
        themeTone: 'celebration',
      };
    case 'valentines':
      return {
        iconSet: ['💌', '💕', '✨', '🌹', '💖'],
        badge: '💌',
        themeTone: 'romantic',
      };
    case 'mothers_day':
      return {
        iconSet: ['🌸', '💗', '✨', '🌷', '🤍'],
        badge: '🌸',
        themeTone: 'soft',
      };
    case 'fathers_day':
      return {
        iconSet: ['🧡', '✨', '⭐', '🤎', '👔'],
        badge: '🧡',
        themeTone: 'elegant',
      };
    case 'couple':
    default:
      return {
        iconSet: ['💕', '💗', '💖', '💓', '💞', '💘'],
        badge: '💕',
        themeTone: 'romantic',
      };
  }
};

const optCloudinaryUrl = (url: string, isHero: boolean): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // If already optimized with f_auto/q_auto, skip modification
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }

  const cloudinaryUploadSegment = '/upload/';
  if (!url.includes(cloudinaryUploadSegment)) return url;

  const quality = isHero ? 'auto:good' : 'auto:eco';
  return url.replace(cloudinaryUploadSegment, `/upload/f_auto,q_${quality}/`);
};

export const resolveHeroCoverPhoto = (
  config: { hero?: { coverPhotoUrl?: string; coverPhotoIndex?: number }; cover_photo_index?: number },
  photos: string[] = []
): string | null => {
  if (config?.hero?.coverPhotoUrl) {
    return optCloudinaryUrl(config.hero.coverPhotoUrl, true);
  }

  if (typeof config?.hero?.coverPhotoIndex === 'number' && photos[config.hero.coverPhotoIndex]) {
    return optCloudinaryUrl(photos[config.hero.coverPhotoIndex], true);
  }

  if (typeof config?.cover_photo_index === 'number' && photos[config.cover_photo_index]) {
    return optCloudinaryUrl(photos[config.cover_photo_index], false);
  }

  if (photos.length > 0) {
    return optCloudinaryUrl(photos[0], false);
  }

  return null;
};

export const resolveHeroConfig = (
  siteType: OccasionType,
  participants: Participant[] = [],
  specialDate?: string,
): HeroConfig => {
  const displayName = resolveDisplayName(siteType, participants, participants[0]?.name || '', participants[1]?.name || '');
  const occasionMeta = getOccasionMetadata(siteType);
  const title = displayName || occasionMeta.label;

  const subtitle = resolveHeroSubtitle(siteType, specialDate, participants[0]?.name);
  const cta = resolveDefaultCTA(siteType);
  const decorations = resolveDecorations(siteType);

  const description = (() => {
    switch (siteType) {
      case 'birthday':
        return 'A special page to celebrate the day with friends and family.';
      case 'wedding':
        return 'A wedding page for details, memories, and celebration.';
      case 'proposal':
        return 'A keepsake for one unforgettable question and answer.';
      case 'anniversary':
        return 'A celebration of the story that keeps growing.';
      case 'graduation':
        return 'A tribute to a milestone worth honoring.';
      case 'baby_shower':
        return 'A sweet celebration for a growing family.';
      case 'debut':
        return 'A celebration page for a beautiful new chapter.';
      case 'memorial':
        return 'A remembrance page built with love and gratitude.';
      case 'family':
        return 'A keepsake for shared family memories.';
      case 'friendship':
        return 'A story built from years of shared moments.';
      case 'travel':
        return 'A journal of places, adventures, and memories.';
      case 'valentines':
        return 'A love note made to be revisited.';
      case 'mothers_day':
        return 'A tribute page filled with gratitude and love.';
      case 'fathers_day':
        return 'A tribute page honoring care, strength, and love.';
      case 'couple':
      default:
        return 'A cherished place for your love story and memories.';
    }
  })();

  return { title, subtitle, description, cta, decorations };
};

export const resolveFooterConfig = (siteType: OccasionType, displayName: string): FooterConfig => {
  switch (siteType) {
    case 'birthday':
      return {
        tagline: `Happy Birthday, ${displayName}! 🎉`,
        decorations: ['🎉', '🎈', '🥳', '✨', '🎂'],
      };
    case 'wedding':
      return {
        tagline: 'Together forever begins today 💒',
        decorations: ['💍', '🌸', '💒', '✨', '💐'],
      };
    case 'proposal':
      return {
        tagline: 'She said YES! 💍',
        decorations: ['💎', '💫', '💍', '✨', '🥂'],
      };
    case 'anniversary':
      return {
        tagline: 'Celebrating another beautiful year together ✨',
        decorations: ['🌟', '🎉', '🥂', '✨', '💐'],
      };
    case 'graduation':
      return {
        tagline: 'A proud milestone and a beautiful new beginning 🎓',
        decorations: ['🎓', '⭐', '📘', '✨', '🎉'],
      };
    case 'baby_shower':
      return {
        tagline: 'A little one is already so deeply loved 🍼',
        decorations: ['🍼', '☁️', '🧸', '✨', '🌙'],
      };
    case 'debut':
      return {
        tagline: 'A night to celebrate grace, joy, and a new chapter 👑',
        decorations: ['👑', '✨', '🌸', '💫', '🥂'],
      };
    case 'memorial':
      return {
        tagline: 'Held in love, remembered with grace 🕊️',
        decorations: ['🕊️', '🤍', '✨', '🌿', '🕯️'],
      };
    case 'family':
      return {
        tagline: 'The best stories are the ones we share together 🏡',
        decorations: ['🏡', '🤎', '✨', '🌿', '📷'],
      };
    case 'friendship':
      return {
        tagline: 'Some bonds only grow better with time 🤝',
        decorations: ['🤝', '✨', '💫', '🌈', '📸'],
      };
    case 'travel':
      return {
        tagline: 'Every destination becomes a memory worth keeping ✈️',
        decorations: ['✈️', '🗺️', '📍', '✨', '🌍'],
      };
    case 'valentines':
      return {
        tagline: 'A little more love, today and always 💌',
        decorations: ['💌', '💕', '✨', '🌹', '💖'],
      };
    case 'mothers_day':
      return {
        tagline: 'For the love that shaped everything 🌸',
        decorations: ['🌸', '💗', '✨', '🌷', '🤍'],
      };
    case 'fathers_day':
      return {
        tagline: 'For the strength, care, and love that always stayed 🧡',
        decorations: ['🧡', '✨', '⭐', '🤎', '👔'],
      };
    case 'couple':
    default:
      return {
        tagline: 'Forever & Always 💍',
        decorations: ['💗', '💕', '💖', '💖', '💕'],
      };
  }
};
