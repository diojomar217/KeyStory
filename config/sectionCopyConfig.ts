// config/sectionCopyConfig.ts
import type { SiteTypeKey } from '@/config/siteTypeConfig';

export type SectionCopyContext = {
  partnerName?: string;
  celebrantName?: string;
  coupleLabel?: string;
  eventLabel?: string;
};

type CopyValue = string | ((context?: SectionCopyContext) => string);

export type SectionCopy = {
  title: CopyValue;
  subtitle: CopyValue;
  icon?: string;
  emptyState?: CopyValue;
  formTitle?: CopyValue;
  submitLabel?: CopyValue;
};

export type SectionCopyBySiteType = {
  default: SectionCopy;
} & Partial<Record<SiteTypeKey, SectionCopy>>;

export const SECTION_COPY_CONFIG = {
  home: {
    default: {
      title: 'Home',
      subtitle: 'The opening section of your story',
      icon: '🏠',
    },
    birthday: {
      title: 'Home',
      subtitle: 'The opening section of the celebration',
      icon: '🏠',
    },
    wedding: {
      title: 'Home',
      subtitle: 'The opening section of your wedding story',
      icon: '🏠',
    },
  },

  love_letter: {
    default: {
      title: 'Love Letter',
      subtitle: 'A heartfelt message from you',
      icon: '💌',
      formTitle: 'Your Love Letter',
    },
    anniversary: {
      title: 'Anniversary Letter',
      subtitle: 'A heartfelt message for your anniversary',
      icon: '💌',
      formTitle: 'Your Anniversary Letter',
    },
    proposal: {
      title: 'Love Letter',
      subtitle: 'A heartfelt message for your proposal page',
      icon: '💌',
      formTitle: 'Your Love Letter',
    },
  },

  our_story: {
    default: {
      title: 'Our Story',
      subtitle: 'Share the story behind your journey',
      icon: '📖',
      formTitle: 'Your Story',
    },
  },

  timeline: {
    default: {
      title: 'Timeline',
      subtitle: 'The important moments of your journey together',
      icon: '📅',
      formTitle: 'Timeline Events',
    },
    birthday: {
      title: 'Timeline',
      subtitle: 'The important moments leading to this celebration',
      icon: '📅',
      formTitle: 'Timeline Events',
    },
    family: {
      title: 'Family Timeline',
      subtitle: 'The important moments in your family journey',
      icon: '📅',
      formTitle: 'Timeline Events',
    },
    friendship: {
      title: 'Friendship Timeline',
      subtitle: 'The moments that shaped your friendship',
      icon: '📅',
      formTitle: 'Timeline Events',
    },
  },

  gallery: {
    default: {
      title: 'Gallery',
      subtitle: 'A collection of your favorite memories',
      icon: '📸',
      formTitle: 'Upload Photos',
      emptyState: 'No photos added yet.',
    },
    birthday: {
      title: 'Gallery',
      subtitle: 'A collection of birthday memories',
      icon: '📸',
      formTitle: 'Upload Photos',
      emptyState: 'No birthday photos added yet.',
    },
  },

  song: {
    default: {
      title: 'Song',
      subtitle: 'A special song for this page',
      icon: '🎵',
      formTitle: 'Song Link',
    },
  },

  playlist: {
    default: {
      title: 'Playlist',
      subtitle: 'Songs that tell your story',
      icon: '🎶',
      formTitle: 'Playlist Link',
    },
    birthday: {
      title: 'Playlist',
      subtitle: 'Songs for the celebration',
      icon: '🎶',
      formTitle: 'Playlist Link',
    },
  },

  video_memories: {
    default: {
      title: 'Video Memories',
      subtitle: 'Embedded videos that capture your moments',
      icon: '🎬',
      formTitle: 'Video Memories',
    },
  },

  relationship_stats: {
    default: {
      title: 'Relationship Stats',
      subtitle: 'Automatically generated from your dates and timeline',
      icon: '📊',
      emptyState: 'This section is generated automatically from your relationship data.',
    },
  },

  anniversary_countdown: {
    default: {
      title: 'Anniversary Countdown',
      subtitle: 'Automatically counts down to your next anniversary',
      icon: '⏰',
      emptyState: 'This section is generated automatically from your anniversary date.',
    },
  },

  future_dreams: {
    default: {
      title: 'Future Dreams',
      subtitle: 'Your hopes, plans, and dreams together',
      icon: '💭',
      formTitle: 'Future Dreams',
    },
  },

  quotes: {
    default: {
      title: 'Love Quotes',
      subtitle: 'Quotes that reflect your feelings and memories',
      icon: '💕',
      formTitle: 'Love Quotes',
    },
    family: {
      title: 'Family Quotes',
      subtitle: 'Quotes that reflect your family memories',
      icon: '💕',
      formTitle: 'Family Quotes',
    },
    friendship: {
      title: 'Friendship Quotes',
      subtitle: 'Quotes that reflect your friendship',
      icon: '💕',
      formTitle: 'Friendship Quotes',
    },
    birthday: {
      title: 'Celebration Quotes',
      subtitle: 'Quotes and wishes for the celebration',
      icon: '💕',
      formTitle: 'Celebration Quotes',
    },
  },

  reasons_love_you: {
    default: {
      title: 'Reasons I Love You',
      subtitle: 'The little and big reasons that make them special',
      icon: '💖',
      formTitle: 'Reasons Why I Love You',
    },
  },

  guest_messages: {
    default: {
      title: 'Guest Messages',
      subtitle: 'Messages from friends and family',
      icon: '💬',
      emptyState: 'No guest messages yet. Be the first to leave one!',
      formTitle: 'Leave a Message',
      submitLabel: 'Submit Message',
    },
    birthday: {
      title: 'Birthday Wishes',
      subtitle: 'Birthday wishes from friends and family',
      icon: '🥳',
      emptyState: 'No birthday wishes yet. Be the first to leave one!',
      formTitle: 'Leave a Birthday Wish',
      submitLabel: 'Send Wish',
    },
    wedding: {
      title: 'Guest Wishes',
      subtitle: 'Warm wishes from family and friends',
      icon: '💍',
      emptyState: 'No guest wishes yet. Be the first to leave one!',
      formTitle: 'Leave a Wedding Wish',
      submitLabel: 'Send Wish',
    },
    proposal: {
      title: 'Support Messages',
      subtitle: 'Messages from people cheering for your love story',
      icon: '💖',
      emptyState: 'No support messages yet. Be the first to leave one!',
      formTitle: 'Leave a Support Message',
      submitLabel: 'Send Message',
    },
    anniversary: {
      title: 'Anniversary Messages',
      subtitle: 'Messages from friends and family',
      icon: '🌹',
      emptyState: 'No anniversary messages yet. Be the first to leave one!',
      formTitle: 'Leave an Anniversary Message',
      submitLabel: 'Send Message',
    },
    graduation: {
      title: 'Congratulations Messages',
      subtitle: 'Messages celebrating this achievement',
      icon: '🎓',
      emptyState: 'No congratulatory messages yet. Be the first to leave one!',
      formTitle: 'Leave a Congratulations Message',
      submitLabel: 'Send Message',
    },
    baby_shower: {
      title: 'Baby Wishes',
      subtitle: 'Messages for the parents and little one',
      icon: '🍼',
      emptyState: 'No baby wishes yet. Be the first to leave one!',
      formTitle: 'Leave a Baby Wish',
      submitLabel: 'Send Wish',
    },
    memorial: {
      title: 'Tribute Messages',
      subtitle: 'Messages of remembrance and support',
      icon: '🕊️',
      emptyState: 'No tribute messages yet. Be the first to leave one!',
      formTitle: 'Leave a Tribute',
      submitLabel: 'Submit Tribute',
    },
  },

  letter_future: {
    default: {
      title: 'Letter to the Future',
      subtitle: 'Write a message to be opened later',
      icon: '📮',
      formTitle: 'Letter to the Future',
    },
  },

  gift_section: {
  default: {
    title: 'Digital Gifts for You',
    subtitle: (context?: SectionCopyContext) =>
      context?.partnerName
        ? `${context.partnerName}, these are just for you 💕`
        : 'These are just for you 💕',
    icon: '🎁',
    formTitle: 'Digital Gifts',
  },
  birthday: {
    title: 'Birthday Gifts',
    subtitle: (context?: SectionCopyContext) =>
      context?.celebrantName
        ? `${context.celebrantName}, these are for your celebration 🎁`
        : 'Special gifts for the celebration 🎁',
    icon: '🎁',
    formTitle: 'Birthday Gifts',
  },
},

  surprise_message: {
    default: {
      title: 'Surprise Message',
      subtitle: 'A hidden message waiting to be revealed',
      icon: '🎉',
      formTitle: 'Surprise Message',
    },
  },

  qr_keepsake: {
    default: {
      title: 'QR Keepsake',
      subtitle: 'A printable QR keepsake linked to this page',
      icon: '🎴',
      emptyState: 'This section is generated automatically from your site link and QR settings.',
    },
  },

  memory_map: {
    default: {
      title: 'Memory Map',
      subtitle: 'Places that hold special memories',
      icon: '🗺️',
      formTitle: 'Memory Locations',
    },
    travel: {
      title: 'Travel Map',
      subtitle: 'Places from your unforgettable journey',
      icon: '🗺️',
      formTitle: 'Travel Locations',
    },
  },

  birthday_message: {
    default: {
      title: 'Birthday Message',
      subtitle: 'A special message for the celebrant',
      icon: '🎂',
      formTitle: 'Birthday Message',
    },
  },

  birthday_wishes: {
    default: {
      title: 'Birthday Wishes',
      subtitle: 'Messages and wishes for the celebrant',
      icon: '🎈',
      formTitle: 'Birthday Wishes',
    },
  },

  birthday_countdown: {
    default: {
      title: 'Birthday Countdown',
      subtitle: 'Automatically counts down to the birthday celebration',
      icon: '⏳',
      emptyState: 'This section is generated automatically from the birthday date.',
    },
  },

  birthday_timeline: {
    default: {
      title: 'Birthday Timeline',
      subtitle: 'Life milestones and memories of the celebrant',
      icon: '🎂',
      formTitle: 'Birthday Timeline',
    },
  },

  party_details: {
    default: {
      title: 'Party Details',
      subtitle: 'Time, venue, and celebration details',
      icon: '📍',
      formTitle: 'Party Details',
    },
    wedding: {
      title: 'Event Details',
      subtitle: 'Ceremony and reception details',
      icon: '📍',
      formTitle: 'Event Details',
    },
    baby_shower: {
      title: 'Event Details',
      subtitle: 'Details for the baby shower celebration',
      icon: '📍',
      formTitle: 'Event Details',
    },
  },

  gift_wishlist: {
    default: {
      title: 'Gift Wishlist',
      subtitle: 'Gift ideas and wishlist for the celebration',
      icon: '🎁',
      formTitle: 'Gift Wishlist',
    },
  },
} as const;

export type SectionCopyKey = keyof typeof SECTION_COPY_CONFIG;