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
    graduation: {
      title: 'Graduation Message',
      subtitle: 'A heartfelt message celebrating this milestone',
      icon: '🎓',
      formTitle: 'Graduation Message',
    },
    baby_shower: {
      title: 'Parents Message',
      subtitle: 'A heartfelt note for the growing family',
      icon: '🍼',
      formTitle: 'Parents Message',
    },
    debut: {
      title: 'Celebrant Message',
      subtitle: 'A heartfelt message for this special celebration',
      icon: '👑',
      formTitle: 'Celebrant Message',
    },
    family: {
      title: 'Family Message',
      subtitle: 'A heartfelt message from the family story',
      icon: '🏡',
      formTitle: 'Family Message',
    },
    mothers_day: {
      title: 'Message for Mom',
      subtitle: 'A heartfelt tribute written with gratitude and love',
      icon: '🌸',
      formTitle: 'Message for Mom',
    },
    fathers_day: {
      title: 'Message for Dad',
      subtitle: 'A heartfelt tribute written with gratitude and love',
      icon: '🧡',
      formTitle: 'Message for Dad',
    },
  },

  our_story: {
    default: {
      title: 'Our Story',
      subtitle: 'Share the story behind your journey',
      icon: '📖',
      formTitle: 'Your Story',
    },
    family: {
      title: 'Family Story',
      subtitle: 'Share the story behind your family journey',
      icon: '🏡',
      formTitle: 'Family Story',
    },
    friendship: {
      title: 'Friendship Story',
      subtitle: 'Share the story behind this lasting friendship',
      icon: '🤝',
      formTitle: 'Friendship Story',
    },
    travel: {
      title: 'Travel Notes',
      subtitle: 'Tell the story behind the journey',
      icon: '✈️',
      formTitle: 'Travel Notes',
    },
    memorial: {
      title: 'Life Story',
      subtitle: 'A story to remember, honor, and hold close',
      icon: '🕊️',
      formTitle: 'Life Story',
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
      title: 'Captured with Love',
      subtitle: 'A few beautifully captured moments of our little one’s',
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
    anniversary: {
      title: 'Anniversary Stats',
      subtitle: 'A live snapshot of the time and memories shared',
      icon: '🥂',
      emptyState: 'This section is generated automatically from your anniversary date.',
    },
    friendship: {
      title: 'Friendship Stats',
      subtitle: 'A live snapshot of the time and memories shared',
      icon: '🤝',
      emptyState: 'This section is generated automatically from your friendship milestone.',
    },
    family: {
      title: 'Family Stats',
      subtitle: 'A live snapshot of the time and milestones shared',
      icon: '🏡',
      emptyState: 'This section is generated automatically from your family milestone date.',
    },
    travel: {
      title: 'Journey Stats',
      subtitle: 'A live snapshot of the trip and memories collected',
      icon: '✈️',
      emptyState: 'This section is generated automatically from your journey date.',
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
    graduation: {
      title: 'Future Plans',
      subtitle: 'Goals, hopes, and plans for the next chapter',
      icon: '🚀',
      formTitle: 'Future Plans',
    },
    family: {
      title: 'Family Dreams',
      subtitle: 'Hopes, plans, and dreams for the family ahead',
      icon: '🏡',
      formTitle: 'Family Dreams',
    },
    friendship: {
      title: 'Future Adventures',
      subtitle: 'Plans, goals, and adventures still ahead',
      icon: '🗺️',
      formTitle: 'Future Adventures',
    },
    travel: {
      title: 'Next Destinations',
      subtitle: 'Places, plans, and journeys still calling',
      icon: '✈️',
      formTitle: 'Next Destinations',
    },
    baby_shower: {
      title: 'Dreams for the Little One',
      subtitle: 'Hopes and wishes for the chapter ahead',
      icon: '🧸',
      formTitle: 'Dreams for the Little One',
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
    baby_shower: {
      title: 'Baby Predictions',
      subtitle: 'Sweet guesses, wishes, and notes for the little one',
      icon: '🍼',
      formTitle: 'Baby Predictions',
    },
    memorial: {
      title: 'Tributes',
      subtitle: 'Words of remembrance, love, and reflection',
      icon: '🕊️',
      formTitle: 'Tributes',
    },
    graduation: {
      title: 'Inspiring Quotes',
      subtitle: 'Words that reflect growth, pride, and possibility',
      icon: '🎓',
      formTitle: 'Inspiring Quotes',
    },
    travel: {
      title: 'Travel Quotes',
      subtitle: 'Words that capture wonder, adventure, and discovery',
      icon: '✈️',
      formTitle: 'Travel Quotes',
    },
  },

  reasons_love_you: {
    default: {
      title: 'Reasons I Love You',
      subtitle: 'The little and big reasons that make them special',
      icon: '💖',
      formTitle: 'Reasons Why I Love You',
    },
    valentines: {
      title: 'Reasons You Mean Everything',
      subtitle: 'The little and big reasons this love matters',
      icon: '💌',
      formTitle: 'Reasons You Mean Everything',
    },
    friendship: {
      title: 'Reasons You Matter',
      subtitle: 'The little and big reasons this friendship means so much',
      icon: '🤝',
      formTitle: 'Reasons You Matter',
    },
    family: {
      title: 'Reasons Family Means Everything',
      subtitle: 'The little and big reasons family matters most',
      icon: '🏡',
      formTitle: 'Reasons Family Means Everything',
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
    graduation: {
      title: 'Note to Future Self',
      subtitle: 'A message for the version of you still becoming',
      icon: '🚀',
      formTitle: 'Note to Future Self',
    },
    family: {
      title: 'Letter to Our Future Family',
      subtitle: 'A message for the chapter still ahead',
      icon: '🏡',
      formTitle: 'Letter to Our Future Family',
    },
    friendship: {
      title: 'Letter to the Future',
      subtitle: 'A message for the memories and milestones still ahead',
      icon: '🤝',
      formTitle: 'Letter to the Future',
    },
    travel: {
      title: 'Postcard to the Future',
      subtitle: 'A note for the journeys and places still waiting',
      icon: '✈️',
      formTitle: 'Postcard to the Future',
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
  graduation: {
    title: 'Celebration Gifts',
    subtitle: 'Keepsakes and gifts to mark this milestone',
    icon: '🎓',
    formTitle: 'Celebration Gifts',
  },
  family: {
    title: 'Family Keepsakes',
    subtitle: 'Small gifts and keepsakes for the family story',
    icon: '🏡',
    formTitle: 'Family Keepsakes',
  },
  friendship: {
    title: 'Shared Surprises',
    subtitle: 'Small gifts and keepsakes from this friendship',
    icon: '🤝',
    formTitle: 'Shared Surprises',
  },
  travel: {
    title: 'Travel Keepsakes',
    subtitle: 'Souvenirs and surprises from the journey',
    icon: '✈️',
    formTitle: 'Travel Keepsakes',
  },
  mothers_day: {
    title: 'Special Gifts for Mom',
    subtitle: 'Small keepsakes chosen with love and gratitude',
    icon: '🌸',
    formTitle: 'Special Gifts for Mom',
  },
  fathers_day: {
    title: 'Special Gifts for Dad',
    subtitle: 'Small keepsakes chosen with gratitude and care',
    icon: '🧡',
    formTitle: 'Special Gifts for Dad',
  },
},

  surprise_message: {
    default: {
      title: 'Surprise Message',
      subtitle: 'A hidden message waiting to be revealed',
      icon: '🎉',
      formTitle: 'Surprise Message',
    },
    birthday: {
      title: 'Birthday Surprise',
      subtitle: 'A hidden message waiting to brighten the celebration',
      icon: '🎂',
      formTitle: 'Birthday Surprise',
    },
    proposal: {
      title: 'A Surprise Worth Revealing',
      subtitle: 'A hidden message waiting at the heart of this story',
      icon: '💍',
      formTitle: 'Surprise Message',
    },
    valentines: {
      title: 'Hidden Love Note',
      subtitle: 'A private message waiting to be revealed',
      icon: '💌',
      formTitle: 'Hidden Love Note',
    },
    graduation: {
      title: 'A Special Congratulations',
      subtitle: 'A hidden message celebrating this milestone',
      icon: '🎓',
      formTitle: 'Special Congratulations',
    },
    family: {
      title: 'Family Surprise',
      subtitle: 'A hidden message waiting for the right moment',
      icon: '🏡',
      formTitle: 'Family Surprise',
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