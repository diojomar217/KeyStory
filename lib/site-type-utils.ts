import { OccasionType, getOccasionMetadata } from './occasion-registry';
import { Participant } from './types';

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
  madeWith: string;
  decorations: string[];
  decorationClasses?: string;
};

export const resolveDisplayName = (
  siteType: OccasionType,
  participants: Participant[] = [],
  customerName = '',
  partnerName = '',
) => {
  const primary = participants[0]?.name || customerName || (siteType === 'birthday' ? 'Birthday Star' : 'Your Name');
  const secondary = participants[1]?.name || partnerName || '';

  if (siteType === 'birthday') {
    return primary;
  }

  if (secondary) {
    return `${primary} & ${secondary}`;
  }

  return primary;
};

export const resolveParticipantNames = (
  siteType: OccasionType,
  participants: Participant[] = [],
  customerName = '',
  partnerName = '',
): { primaryName: string; secondaryName: string; displayName: string } => {
  const primaryName = participants[0]?.name || customerName || (siteType === 'birthday' ? 'Birthday Star' : 'Your Name');
  const secondaryName = participants[1]?.name || partnerName || '';

  if (siteType === 'birthday') {
    return {
      primaryName,
      secondaryName: '',
      displayName: primaryName,
    };
  }

  return {
    primaryName,
    secondaryName,
    displayName: secondaryName ? `${primaryName} & ${secondaryName}` : primaryName,
  };
};

export const resolveHeroSubtitle = (
  siteType: OccasionType,
  specialDate?: string,
  customerName?: string,
) => {
  if (siteType === 'birthday') {
    return specialDate ? `Birthday: ${specialDate}` : `Happy Birthday ${customerName ?? ''}`;
  }

  return specialDate ? `Together since ${specialDate}` : 'A love journey to remember';
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

  return [
    {
      label: 'Together since',
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
  const title =
    siteType === 'birthday'
      ? `${participants[0]?.name || 'Celebrant'}`
      : `${participants[0]?.name || 'You'} ${siteType === 'couple' ? '& ' + (participants[1]?.name || 'Partner') : ''}`;

  const subtitle = resolveHeroSubtitle(siteType, specialDate, participants[0]?.name);
  const cta = resolveDefaultCTA(siteType);
  const decorations = resolveDecorations(siteType);

  const description =
    siteType === 'birthday'
      ? 'A special page to celebrate your day with friends and family.'
      : 'A cherished place for your love story and memories.';

  return { title, subtitle, description, cta, decorations };
};

export const resolveFooterConfig = (siteType: OccasionType, displayName: string): FooterConfig => {
  switch (siteType) {
    case 'birthday':
      return {
        tagline: `Happy Birthday, ${displayName}! 🎉`,
        madeWith: 'Made especially for this special day',
        decorations: ['🎉', '🎈', '🥳', '✨', '🎂'],
        decorationClasses: 'text-yellow-300/80 text-lg',
      };
    case 'wedding':
      return {
        tagline: 'Together forever begins today 💒',
        madeWith: 'Made with elegance and celebration',
        decorations: ['💍', '🌸', '💒', '✨', '💐'],
        decorationClasses: 'text-amber-200',
      };
    case 'proposal':
      return {
        tagline: 'She said YES! 💍',
        madeWith: 'Made to celebrate the next chapter',
        decorations: ['💎', '💫', '💍', '✨', '🥂'],
        decorationClasses: 'text-blue-200',
      };
    case 'anniversary':
      return {
        tagline: 'Celebrating another beautiful year together ✨',
        madeWith: 'Made with treasured memories and love',
        decorations: ['🌟', '🎉', '🥂', '✨', '💐'],
        decorationClasses: 'text-sky-200',
      };
    case 'couple':
    default:
      return {
        tagline: 'Forever & Always 💍',
        madeWith: 'Made with love especially for you',
        decorations: ['💗', '💕', '💖', '💖', '💕'],
        decorationClasses: 'text-rose-300',
      };
  }
};
