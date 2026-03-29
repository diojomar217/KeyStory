import { SiteConfig, Section } from '@/lib/types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  section: Section;
  message: string;
  field?: string;
}

// Validation rules for each section type
const sectionValidationRules = {
  gallery: {
    requirePhotos: (config: SiteConfig, photos: File[]): ValidationError | null => {
      if (config.sections.includes('gallery') && photos.length === 0) {
        return {
          section: 'gallery',
          message: 'Gallery section requires at least one photo',
          field: 'photos',
        };
      }
      return null;
    },
  },
  timeline: {
    requireEvents: (config: SiteConfig): ValidationError | null => {
      if (config.sections.includes('timeline')) {
        if (!config.timeline_events || config.timeline_events.length === 0) {
          return {
            section: 'timeline',
            message: 'Timeline section requires at least one event',
            field: 'timeline_events',
          };
        }
        
        // Check if all events have required fields
        const invalidEvents = config.timeline_events.filter(
          (event) => !event.title.trim() || !event.date
        );
        
        if (invalidEvents.length > 0) {
          return {
            section: 'timeline',
            message: `Timeline has ${invalidEvents.length} event(s) missing title or date`,
            field: 'timeline_events',
          };
        }
      }
      return null;
    },
  },
  song: {
    validateLink: (config: SiteConfig, songLink: string): ValidationError | null => {
      if (config.sections.includes('song') && songLink.trim()) {
        const isValidYouTube = songLink.includes('youtube.com') || songLink.includes('youtu.be');
        const isValidSpotify = songLink.includes('spotify.com');
        
        if (!isValidYouTube && !isValidSpotify) {
          return {
            section: 'song',
            message: 'Please enter a valid YouTube or Spotify link',
            field: 'song_link',
          };
        }
      }
      return null;
    },
  },
};

/**
 * Validates the website configuration based on enabled sections
 */
export function validateSections(
  config: SiteConfig,
  photos: File[] = [],
  songLink: string = ''
): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate gallery section
  const photoError = sectionValidationRules.gallery.requirePhotos(config, photos);
  if (photoError) errors.push(photoError);
  
  // Validate timeline section
  const timelineError = sectionValidationRules.timeline.requireEvents(config);
  if (timelineError) errors.push(timelineError);
  
  // Validate song section
  const songError = sectionValidationRules.song.validateLink(config, songLink);
  if (songError) errors.push(songError);
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a specific field and returns an error message if invalid
 */
export function validateField(
  fieldName: string,
  value: unknown,
  config: SiteConfig
): string | null {
  switch (fieldName) {
    case 'photos':
      if (config.sections.includes('gallery') && (value as File[]).length === 0) {
        return 'Gallery section requires at least one photo';
      }
      return null;
      
    case 'timeline_events':
      if (config.sections.includes('timeline')) {
        const events = value as { title: string; date: string }[];
        if (!events || events.length === 0) {
          return 'Timeline section requires at least one event';
        }
        const missingFields = events.filter(e => !e.title.trim() || !e.date);
        if (missingFields.length > 0) {
          return `${missingFields.length} event(s) missing title or date`;
        }
      }
      return null;
      
    case 'song_link':
      if (config.sections.includes('song') && typeof value === 'string' && value.trim()) {
        const link = value as string;
        const isValidYouTube = link.includes('youtube.com') || link.includes('youtu.be');
        const isValidSpotify = link.includes('spotify.com');
        if (!isValidYouTube && !isValidSpotify) {
          return 'Please enter a valid YouTube or Spotify link';
        }
      }
      return null;
      
    default:
      return null;
  }
}

/**
 * Gets validation status for each section (for UI indicators)
 */
export function getSectionValidationStatus(
  config: SiteConfig,
  photos: File[] = [],
  songLink: string = ''
): Record<Section, 'valid' | 'invalid' | 'warning'> {
  const status: Record<Section, 'valid' | 'invalid' | 'warning'> = {
    home: 'valid',
    gallery: 'valid',
    timeline: 'valid',
    song: 'valid',
    love_letter: 'valid',
    qr_keepsake: 'valid',
    quotes: 'valid',
    our_story: 'valid',
    milestones: 'valid',
    future_dreams: 'valid',
    playlist: 'valid',
    video_memories: 'valid',
    anniversary_countdown: 'valid',
    birthday_message: 'valid',
    birthday_wishes: 'valid',
    birthday_countdown: 'valid',
    birthday_timeline: 'valid',
    party_details: 'valid',
    gift_wishlist: 'valid',
    relationship_stats: 'valid',
    memory_map: 'valid',
    polaroid_gallery: 'valid',
    first_date: 'valid',
    special_moments: 'valid',
    reasons_love_you: 'valid',
    guest_messages: 'valid',
    letter_future: 'valid',
    gift_section: 'valid',
    surprise_message: 'valid',
  };
  
  // Check gallery
      if (config.sections.includes('timeline')) {
        const timeline = config.section_content?.timeline || [];
        if (!timeline.length) {
          return {
            section: 'timeline',
            message: 'Timeline section requires at least one event',
            field: 'timeline',
          };
        }
        // Check if all events have required fields
        const invalidEvents = timeline.filter(
          (event) => !event.title?.trim() || !event.date
        );
        if (invalidEvents.length > 0) {
          return {
            section: 'timeline',
            message: 'All timeline events must have a title and date',
            field: 'timeline',
          };
        }
      }
      if (!isValidYouTube && !isValidSpotify) {
        status.song = 'invalid';
      }
    } else {
      status.song = 'warning'; // Optional but should have a value if enabled
    }
  }
  
  return status;
}

