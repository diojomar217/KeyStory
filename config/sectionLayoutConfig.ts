// Centralized section layout and grid config
export const cardSections = [
  'love_letter',
  'future_dreams',
  'quotes',
  'letter_future',
  'gift_section',
  'surprise_message',
];

export const timelineSections = [
  'timeline',
  'our_story',
];

export const gridSections = [
  'reasons_love_you',
  'gallery',
  'special_moments',
  'video_memories',
  'milestones',
  'guest_messages',
];

export const gridConfigs: Record<string, { gridCols: string; gap: string }> = {
  reasons_love_you: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-6 lg:gap-8' },
  gallery: { gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', gap: 'gap-6 lg:gap-8' },
  special_moments: { gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap: 'gap-8 lg:gap-10' },
  video_memories: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-8 lg:gap-10' },
  milestones: { gridCols: 'grid-cols-1 md:grid-cols-2', gap: 'gap-6 lg:gap-8' },
  guest_messages: { gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', gap: 'gap-8 lg:gap-10' },
};
