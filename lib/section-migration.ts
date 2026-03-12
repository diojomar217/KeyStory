// lib/section-migration.ts
// ============================================
// SECTION MIGRATION & BACKWARD COMPATIBILITY
// ============================================
// This file handles migration from deprecated sections to new architecture.
// It ensures older websites continue to work without breaking.

import { Section, TimelineEvent, GalleryLayout, SectionContentMap, SpecialMoment, Milestone } from './types';

// ============================================
// DEPRECATED SECTION MAPPING
// ============================================

// Map deprecated sections to their new equivalents
export const DEPRECATED_SECTION_MAPPING: Record<string, Section | null> = {
  // Story-related: These should now be timeline events
  'first_date': null, // Will be converted to timeline event
  'special_moments': null, // Will be converted to timeline events
  'milestones': null, // Will be converted to timeline events
  
  // Photo-related: Use gallery with layout option
  'polaroid_gallery': 'gallery', // Convert to gallery with polaroid layout
};

// ============================================
// GALLERY LAYOUT MAPPING
// ============================================

// Map old section IDs to gallery layouts
export const GALLERY_LAYOUT_MAPPING: Record<string, GalleryLayout> = {
  'polaroid_gallery': 'polaroid',
  'gallery': 'grid',
};

// ============================================
// CORE SECTIONS (Visible in Builder)
// ============================================

// These are the sections shown in the builder UI (after refactoring)
export const CORE_SECTIONS: Section[] = [
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
  'reasons_love_you',
  'quotes',
  'guest_messages',
  'surprise_message',
  'qr_keepsake',
  // Optional sections
  'memory_map',
  'letter_future',
  'gift_section',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a section is deprecated
 */
export const isSectionDeprecated = (section: Section): boolean => {
  return section in DEPRECATED_SECTION_MAPPING;
};

/**
 * Get the target section for a deprecated section
 */
export const getMigrationTarget = (section: Section): Section | null => {
  return DEPRECATED_SECTION_MAPPING[section] || null;
};

/**
 * Get gallery layout from section (for backward compatibility)
 */
export const getGalleryLayout = (
  sections: Section[],
  sectionTemplates?: Record<string, string>
): GalleryLayout => {
  // Check if polaroid_gallery is in sections
  if (sections.includes('polaroid_gallery')) {
    return 'polaroid';
  }
  
  // Check section_templates for gallery layout
  if (sectionTemplates?.gallery) {
    return sectionTemplates.gallery as GalleryLayout;
  }
  
  // Check gallery_template (legacy)
  if (sectionTemplates?.gallery_template) {
    return sectionTemplates.gallery_template as GalleryLayout;
  }
  
  return 'grid';
};

/**
 * Convert deprecated story sections to timeline events
 * This merges first_date, special_moments, and milestones into timeline
 */
export const convertToTimelineEvents = (
  existingEvents: TimelineEvent[],
  sectionContent?: SectionContentMap
): TimelineEvent[] => {
  const events = [...existingEvents];
  
  // Convert first_date to timeline event
  if (sectionContent?.first_date) {
    const { title, date, description } = sectionContent.first_date;
    events.push({
      title: title || 'First Date',
      date: date || '',
      description: description || '',
      icon: '🌹',
      eventType: 'date',
    });
  }
  
  // Convert special moments to timeline events
  if (sectionContent?.special_moments?.moments) {
    sectionContent.special_moments.moments.forEach((moment: SpecialMoment) => {
      events.push({
        title: moment.title,
        date: moment.date,
        description: moment.description,
        photo: moment.photo,
        icon: '⭐',
        eventType: 'special',
        isSpecial: true,
      });
    });
  }
  
  // Convert milestones to timeline events
  if (sectionContent?.milestones?.milestones) {
    sectionContent.milestones.milestones.forEach((milestone: Milestone) => {
      events.push({
        title: milestone.title,
        date: milestone.date,
        description: milestone.description,
        icon: milestone.icon || '🏆',
        eventType: 'milestone',
        isSpecial: true,
      });
    });
  }
  
  // Sort events by date
  return events.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

/**
 * Filter out deprecated sections from the sections array
 * but keep them for backward compatibility rendering
 */
export const filterSections = (sections: Section[]): Section[] => {
  return sections.filter(section => {
    // Keep all sections - they'll be handled by the migration logic
    return true;
  });
};

/**
 * Normalize sections for rendering - handles backward compatibility
 * Returns the effective sections array with deprecated sections converted
 */
export const normalizeSections = (
  sections: Section[],
  sectionContent?: SectionContentMap
): {
  sections: Section[];
  galleryLayout: GalleryLayout;
  timelineEvents: TimelineEvent[];
  showTimeline: boolean;
  showGallery: boolean;
} => {
  const hasPolaroid = sections.includes('polaroid_gallery');
  const hasFirstDate = sections.includes('first_date');
  const hasSpecialMoments = sections.includes('special_moments');
  const hasMilestones = sections.includes('milestones');
  const hasTimeline = sections.includes('timeline');
  const hasGallery = sections.includes('gallery');
  
  // Determine gallery layout
  let galleryLayout: GalleryLayout = 'grid';
  if (hasPolaroid) {
    galleryLayout = 'polaroid';
  }
  
  // Build effective sections list
  const effectiveSections: Section[] = sections.filter(section => {
    // Remove deprecated photo sections (they're handled by gallery)
    if (section === 'polaroid_gallery') return false;
    return true;
  });
  
  // Ensure timeline and gallery are included if deprecated sections exist
  if (!hasTimeline && (hasFirstDate || hasSpecialMoments || hasMilestones)) {
    if (!effectiveSections.includes('timeline')) {
      effectiveSections.push('timeline');
    }
  }
  
  if (!hasGallery && hasPolaroid) {
    if (!effectiveSections.includes('gallery')) {
      effectiveSections.push('gallery');
    }
  }
  
  return {
    sections: effectiveSections,
    galleryLayout,
    timelineEvents: [], // Will be populated by convertToTimelineEvents
    showTimeline: hasTimeline || hasFirstDate || hasSpecialMoments || hasMilestones,
    showGallery: hasGallery || hasPolaroid,
  };
};

/**
 * Get the display order for sections on the rendered page
 */
export const SECTION_DISPLAY_ORDER: Section[] = [
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
  'reasons_love_you',
  'quotes',
  'guest_messages',
  'surprise_message',
  'qr_keepsake',
];

/**
 * Sort sections according to display order
 */
export const sortSectionsByDisplayOrder = (sections: Section[]): Section[] => {
  const sectionOrder = SECTION_DISPLAY_ORDER.reduce((acc, section, index) => {
    acc[section] = index;
    return acc;
  }, {} as Record<Section, number>);
  
  return [...sections].sort((a, b) => {
    const orderA = sectionOrder[a] ?? 999;
    const orderB = sectionOrder[b] ?? 999;
    return orderA - orderB;
  });
};

