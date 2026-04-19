import { SECTION_REGISTRY } from '@/lib/section-registry';
import type { Section } from '@/lib/types';

export interface SectionConfigEntry {
  key: Section;
  label: string;
  description: string;
  icon: string;
  preview: string;
  required: boolean;
  defaultEnabled: boolean;
}

const SECTION_ORDER: Section[] = [
  'home',
  'love_letter',
  'our_story',
  'timeline',
  'gallery',
  'song',
  'playlist',
  'video_memories',
  'relationship_stats',
  'anniversary_countdown',
  'future_dreams',
  'quotes',
  'reasons_love_you',
  'guest_messages',
  'letter_future',
  'gift_section',
  'surprise_message',
  'qr_keepsake',
  'memory_map',
  'birthday_message',
  'birthday_wishes',
  'birthday_countdown',
  'birthday_timeline',
  'party_details',
  'gift_wishlist',
  'wedding_countdown',
  'event_details',
  'wedding_timeline',
  'gift_registry',
  'rsvp',
  'couple_message',
  'graduation_message',
  'countdown',
  'school_memories',
  'achievements',
  'future_plans',
  'baby_predictions',
  'parents_message',
  'photo_highlights',
  'celebrant_message',
  'life_story',
  'tributes',
  'family_message',
  'travel_timeline',
  'travel_notes',
  'message_letter',
  'polaroid_gallery',
  'first_date',
  'special_moments',
  'milestones',
];

const SECTION_PREVIEW_MAP: Partial<Record<Section, string>> = {
  home: 'hero-preview',
  love_letter: 'letter-preview',
  our_story: 'story-preview',
  timeline: 'timeline-preview',
  gallery: 'gallery-preview',
  song: 'song-preview',
  playlist: 'playlist-preview',
  video_memories: 'video-preview',
  relationship_stats: 'stats-preview',
  anniversary_countdown: 'countdown-preview',
  future_dreams: 'dreams-preview',
  quotes: 'quotes-preview',
  reasons_love_you: 'reasons-preview',
  guest_messages: 'guest-preview',
  letter_future: 'future-letter-preview',
  gift_section: 'gift-preview',
  surprise_message: 'surprise-preview',
  qr_keepsake: 'qr-preview',
  memory_map: 'map-preview',
  birthday_message: 'birthday-message-preview',
  birthday_wishes: 'birthday-wishes-preview',
  birthday_countdown: 'birthday-countdown-preview',
  birthday_timeline: 'birthday-timeline-preview',
  party_details: 'party-details-preview',
  gift_wishlist: 'gift-wishlist-preview',
  gift_ideas: 'gift-ideas-preview',
  wedding_countdown: 'wedding-countdown-preview',
  event_details: 'event-details-preview',
  wedding_timeline: 'wedding-timeline-preview',
  gift_registry: 'gift-registry-preview',
  rsvp: 'rsvp-preview',
  couple_message: 'couple-message-preview',
  graduation_message: 'graduation-message-preview',
  countdown: 'countdown-generic-preview',
  school_memories: 'school-memories-preview',
  achievements: 'achievements-preview',
  future_plans: 'future-plans-preview',
  baby_predictions: 'baby-predictions-preview',
  parents_message: 'parents-message-preview',
  photo_highlights: 'photo-highlights-preview',
  celebrant_message: 'celebrant-message-preview',
  life_story: 'life-story-preview',
  tributes: 'tributes-preview',
  family_message: 'family-message-preview',
  travel_timeline: 'travel-timeline-preview',
  travel_notes: 'travel-notes-preview',
  message_letter: 'message-letter-preview',
  polaroid_gallery: 'polaroid-gallery-preview',
  first_date: 'first-date-preview',
  special_moments: 'special-moments-preview',
  milestones: 'milestones-preview',
};

function getPreviewId(section: Section): string {
  return SECTION_PREVIEW_MAP[section] ?? `${section.replace(/_/g, '-')}-preview`;
}

// Merge SECTION_ORDER with any keys present in the registry but not enumerated
const registryKeys = Object.keys(SECTION_REGISTRY) as Section[];
const ALL_SECTION_KEYS: Section[] = [
  ...SECTION_ORDER,
  ...registryKeys.filter((k) => !SECTION_ORDER.includes(k)),
];

export const SECTION_CONFIG: SectionConfigEntry[] = ALL_SECTION_KEYS.map((section) => {
  const metadata = SECTION_REGISTRY[section];

  return {
    key: metadata?.key ?? section,
    label: metadata?.title ?? section,
    description: metadata?.description ?? '',
    icon: metadata?.icon ?? '',
    preview: getPreviewId(section),
    required: metadata?.required ?? false,
    defaultEnabled: metadata?.defaultEnabled ?? false,
  };
});

export const SECTION_CONFIG_BY_KEY: Record<Section, SectionConfigEntry> = Object.fromEntries(
  SECTION_CONFIG.map((entry) => [entry.key, entry])
) as Record<Section, SectionConfigEntry>;
