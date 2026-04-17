import type { OccasionType } from '@/lib/types';

export type OccasionHeroSpec = {
  renderStrategy: 'shared' | 'dedicated';
  dedicatedTemplate?: 'wedding' | 'memorial' | 'travel';
  archetype:
    | 'romantic_editorial'
    | 'ceremony_cinematic'
    | 'celebration_stage'
    | 'scrapbook_story'
    | 'tribute_minimal'
    | 'travel_journal';
  badge: string;
  intro: string;
  datePrefix: string;
  primaryTarget: string;
  secondaryTarget: string;
  primaryLabel: string;
  secondaryLabel: string;
  timerLabel: string;
  showSecondaryCta: boolean;
};

export type OccasionDesignSummary = {
  heroLabel: string;
  headerLabel: string;
  toneLabel: string;
};

const BASE_OCCASION_HERO: OccasionHeroSpec = {
  renderStrategy: 'shared',
  archetype: 'romantic_editorial',
  badge: '💕',
  intro: 'Our Story',
  datePrefix: 'Together since',
  primaryTarget: 'love-letter',
  secondaryTarget: 'gallery',
  primaryLabel: 'Start Our Story',
  secondaryLabel: 'View Memories',
  timerLabel: 'Milestone date',
  showSecondaryCta: true,
};

export const OCCASION_HERO_OVERRIDES: Partial<Record<OccasionType, Partial<OccasionHeroSpec>>> = {
  birthday: {
    archetype: 'celebration_stage',
    badge: '🎂',
    intro: 'Birthday Spotlight',
    datePrefix: 'Celebrating on',
    primaryTarget: 'birthday-message',
    secondaryTarget: 'birthday-wishes',
    primaryLabel: 'Open Birthday Message',
    secondaryLabel: 'Read Birthday Wishes',
    timerLabel: 'Countdown to the celebration',
    showSecondaryCta: true,
  },
  wedding: {
    renderStrategy: 'dedicated',
    dedicatedTemplate: 'wedding',
    archetype: 'ceremony_cinematic',
    badge: '💍',
    intro: 'Wedding Day',
    datePrefix: 'Wedding date',
    primaryTarget: 'event-details',
    secondaryTarget: 'rsvp',
    primaryLabel: 'View Event Details',
    secondaryLabel: 'Open RSVP',
    timerLabel: 'Ceremony day',
  },
  anniversary: {
    archetype: 'romantic_editorial',
    badge: '🥂',
    intro: 'Anniversary Chapter',
    datePrefix: 'Celebrating since',
    primaryTarget: 'timeline',
    secondaryTarget: 'gallery',
    primaryLabel: 'Relive Our Timeline',
    secondaryLabel: 'See Highlights',
    timerLabel: 'Years together',
  },
  proposal: {
    archetype: 'ceremony_cinematic',
    badge: '💎',
    intro: 'Proposal Story',
    datePrefix: 'The big day',
    primaryTarget: 'our-story',
    secondaryTarget: 'surprise-message',
    primaryLabel: 'View Proposal Story',
    secondaryLabel: 'Open Surprise',
    timerLabel: 'Proposal date',
  },
  graduation: {
    archetype: 'celebration_stage',
    badge: '🎓',
    intro: 'Graduation Tribute',
    datePrefix: 'Graduation day',
    primaryTarget: 'graduation-message',
    secondaryTarget: 'achievements',
    primaryLabel: 'Open Graduation Message',
    secondaryLabel: 'See Achievements',
    timerLabel: 'Milestone date',
  },
  baby_shower: {
    archetype: 'scrapbook_story',
    badge: '🍼',
    intro: 'Baby Shower Celebration',
    datePrefix: 'Due date',
    primaryTarget: 'parents-message',
    secondaryTarget: 'baby-predictions',
    primaryLabel: 'Read Parents Message',
    secondaryLabel: 'View Predictions',
    timerLabel: 'Baby countdown',
  },
  baptism: {
    archetype: 'scrapbook_story',
    badge: '👶',
    intro: 'Baptism Celebration',
    datePrefix: 'Baptism Date',
    primaryTarget: 'parents-message',
    secondaryTarget: 'gallery',
    primaryLabel: 'Read Parents Message',
    secondaryLabel: 'View Photos',
    timerLabel: 'Baptism date',
    showSecondaryCta: true,
  },
  debut: {
    archetype: 'celebration_stage',
    badge: '👑',
    intro: 'Debut Celebration',
    datePrefix: 'Debut date',
    primaryTarget: 'celebrant-message',
    secondaryTarget: 'birthday-wishes',
    primaryLabel: 'Read Celebrant Message',
    secondaryLabel: 'Open Wishes',
    timerLabel: 'Countdown to debut',
  },
  memorial: {
    renderStrategy: 'dedicated',
    dedicatedTemplate: 'memorial',
    archetype: 'tribute_minimal',
    badge: '🕊️',
    intro: 'In Loving Memory',
    datePrefix: 'Date of remembrance',
    primaryTarget: 'life-story',
    secondaryTarget: 'tributes',
    primaryLabel: 'View Life Story',
    secondaryLabel: 'Read Tributes',
    timerLabel: 'Remembrance date',
  },
  family: {
    archetype: 'scrapbook_story',
    badge: '🏡',
    intro: 'Family Keepsake',
    datePrefix: 'Family milestone',
    primaryTarget: 'family-message',
    secondaryTarget: 'gallery',
    primaryLabel: 'Read Family Message',
    secondaryLabel: 'Browse Photos',
    timerLabel: 'Family date',
  },
  friendship: {
    archetype: 'scrapbook_story',
    badge: '🫶',
    intro: 'Friendship Story',
    datePrefix: 'Friends since',
    primaryTarget: 'timeline',
    secondaryTarget: 'gallery',
    primaryLabel: 'View Friendship Timeline',
    secondaryLabel: 'See Shared Memories',
    timerLabel: 'Friendship milestone',
  },
  travel: {
    renderStrategy: 'dedicated',
    dedicatedTemplate: 'travel',
    archetype: 'travel_journal',
    badge: '✈️',
    intro: 'Travel Journal',
    datePrefix: 'Trip date',
    primaryTarget: 'travel-timeline',
    secondaryTarget: 'memory-map',
    primaryLabel: 'Open Travel Timeline',
    secondaryLabel: 'View Map',
    timerLabel: 'Travel date',
  },
  valentines: {
    archetype: 'romantic_editorial',
    badge: '🌷',
    intro: 'Valentine Special',
    datePrefix: 'Valentine date',
    primaryTarget: 'love-letter',
    secondaryTarget: 'reasons-love-you',
    primaryLabel: 'Read Love Letter',
    secondaryLabel: 'Reasons I Love You',
    timerLabel: 'Special date',
  },
  mothers_day: {
    archetype: 'scrapbook_story',
    badge: '💐',
    intro: "Mother's Day Tribute",
    datePrefix: "Mother's Day",
    primaryTarget: 'message-letter',
    secondaryTarget: 'gallery',
    primaryLabel: 'Open Message',
    secondaryLabel: 'View Family Photos',
    timerLabel: 'Celebration date',
  },
  fathers_day: {
    archetype: 'scrapbook_story',
    badge: '🛠️',
    intro: "Father's Day Tribute",
    datePrefix: "Father's Day",
    primaryTarget: 'message-letter',
    secondaryTarget: 'gallery',
    primaryLabel: 'Open Message',
    secondaryLabel: 'View Family Photos',
    timerLabel: 'Celebration date',
  },
};

export const getOccasionHeroSpec = (siteType: OccasionType): OccasionHeroSpec => ({
  ...BASE_OCCASION_HERO,
  ...OCCASION_HERO_OVERRIDES[siteType],
});

export const getOccasionDesignSummary = (siteType: OccasionType): OccasionDesignSummary => {
  const hero = getOccasionHeroSpec(siteType);

  const toneMap: Record<OccasionHeroSpec['archetype'], string> = {
    romantic_editorial: 'Editorial romance',
    ceremony_cinematic: 'Cinematic ceremony',
    celebration_stage: 'Celebration spotlight',
    scrapbook_story: 'Scrapbook keepsake',
    tribute_minimal: 'Quiet tribute',
    travel_journal: 'Journal postcard',
  };

  const dedicatedHeroMap: Record<NonNullable<OccasionHeroSpec['dedicatedTemplate']>, string> = {
    wedding: 'Dedicated wedding hero',
    memorial: 'Dedicated memorial hero',
    travel: 'Dedicated travel hero',
  };

  return {
    heroLabel:
      hero.renderStrategy === 'dedicated' && hero.dedicatedTemplate
        ? dedicatedHeroMap[hero.dedicatedTemplate]
        : 'Shared premium archetype',
    headerLabel:
      hero.renderStrategy === 'dedicated' && hero.dedicatedTemplate
        ? 'Dedicated section header style'
        : 'Shared themed section header',
    toneLabel: toneMap[hero.archetype],
  };
};