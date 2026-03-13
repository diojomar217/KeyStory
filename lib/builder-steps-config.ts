'use client';

import { SiteConfig, CreateOrderPayload, OccasionType } from './types';
import { 
  getSectionsRequiringPhotos, 
  getSectionsRequiringTimeline
} from './section-registry';
import { getOccasionMetadata as getOccasionMetadataFromOccasion } from './occasion-registry';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export type ValidationFunction = (
  form: WizardFormData,
  config: SiteConfig
) => ValidationResult;

export interface WizardStepConfig {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  validate: ValidationFunction;
}

// Type for the form data used in validation
export type WizardFormData = Omit<CreateOrderPayload, 'config' | 'photos'> & { photos: File[] };

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Step 1: Your Details - Validates required couple information
 */
export const validateDetailsStep = (
  form: WizardFormData,
  _config: SiteConfig
): ValidationResult => {
  if (!form.website_name?.trim()) {
    return { valid: false, error: 'Website name is required' };
  }
  
  if (!/^[a-z0-9-]+$/.test(form.website_name)) {
    return {
      valid: false,
      error: 'Website name can only contain letters, numbers, and hyphens',
    };
  }
  
if (!form.participants || form.participants.length === 0) {
    return { valid: false, error: 'At least one participant name is required' };
  }
  
  if (form.participants.length < 2 && form.occasion === 'couple') {
    return { valid: false, error: 'Couple occasion requires two participant names' };
  }
  
  if (!form.specialDate) {
    return { valid: false, error: 'Special date is required' };
  }
  
  return { valid: true };
};

/**
 * Step 2: Hero & Message - Validates love message content
 */
export const validateHeroStep = (
  form: WizardFormData,
  _config: SiteConfig
): ValidationResult => {
  if (!form.message?.trim()) {
    return { valid: false, error: 'Love message is required' };
  }
  
  return { valid: true };
};

/**
 * Step 3: Choose Style - Validates theme selection
 */
export const validateStyleStep = (
  _form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  if (!config.theme) {
    return { valid: false, error: 'Please select a theme' };
  }
  
  return { valid: true };
};

/**
 * Step 4: Page Layout - Validates section selection
 */
export const validateLayoutStep = (
  _form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  if (!config.sections || config.sections.length === 0) {
    return { valid: false, error: 'Please select at least one section' };
  }
  
  return { valid: true };
};

/**
 * Step 5: Templates - Validates required templates for enabled sections
 */
export const validateTemplateStep = (
  _form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  const sections = config.sections || [];
  
  if (sections.includes('home') && !config.home_template) {
    return { valid: false, error: 'Please select a home template' };
  }
  
  if (sections.includes('gallery') && !config.gallery_template) {
    return { valid: false, error: 'Please select a gallery template' };
  }
  
  if (sections.includes('timeline') && !config.timeline_template) {
    return { valid: false, error: 'Please select a timeline template' };
  }
  
  if (sections.includes('song') && !config.song_template) {
    return { valid: false, error: 'Please select a song template' };
  }
  
  return { valid: true };
};

/**
 * Step 6: Content - Validates content based on selected sections
 */
export const validateContentStep = (
  form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  const sections = config.sections || [];
  const sectionContent = config.section_content || {};
  
  // Gallery requires photos
  if (sections.includes('gallery') && (!form.photos || form.photos.length === 0)) {
    return { valid: false, error: 'Gallery section requires at least one photo' };
  }
  
  // Timeline requires events
  if (
    sections.includes('timeline') &&
    (!config.timeline_events || config.timeline_events.length === 0)
  ) {
    return { valid: false, error: 'Timeline section requires at least one event' };
  }
  
  // Love Letter requires text content
  if (sections.includes('love_letter') && sectionContent.love_letter) {
    const loveLetterContent = sectionContent.love_letter.content || '';
    if (!loveLetterContent.trim()) {
      return { valid: false, error: 'Love Letter section requires content' };
    }
  }
  
  // Our Story requires text content
  if (sections.includes('our_story') && sectionContent.our_story) {
    const storyContent = sectionContent.our_story.content || '';
    if (!storyContent.trim()) {
      return { valid: false, error: 'Our Story section requires content' };
    }
  }
  
  // Reasons I Love You requires at least one reason
  if (sections.includes('reasons_love_you') && sectionContent.reasons_love_you) {
    const reasons = sectionContent.reasons_love_you.reasons || [];
    if (reasons.length === 0) {
      return { valid: false, error: 'Reasons I Love You requires at least one reason' };
    }
  }
  
  // Future Dreams requires at least one dream
  if (sections.includes('future_dreams') && sectionContent.future_dreams) {
    const dreams = sectionContent.future_dreams.dreams || [];
    if (dreams.length === 0) {
      return { valid: false, error: 'Future Dreams requires at least one dream' };
    }
  }
  
  // Song requires song link (from form)
  if (sections.includes('song') && !form.song_link?.trim()) {
    return { valid: false, error: 'Song section requires a song link' };
  }
  
  // Playlist requires playlist URL
  if (sections.includes('playlist') && sectionContent.playlist) {
    if (!sectionContent.playlist.playlistUrl?.trim()) {
      return { valid: false, error: 'Playlist section requires a playlist link' };
    }
  }
  
  // Video Memories requires at least one video
  if (sections.includes('video_memories') && sectionContent.video_memories) {
    const videos = sectionContent.video_memories.videos || [];
    if (videos.length === 0) {
      return { valid: false, error: 'Video Memories requires at least one video' };
    }
  }
  
  return { valid: true };
};

/**
 * Step 7: Review - Always valid (informational step)
 */
export const validateReviewStep = (
  _form: WizardFormData,
  _config: SiteConfig
): ValidationResult => {
  return { valid: true };
};

/**
 * Validate all steps - Used for final submission
 */
export const validateAllSteps = (
  form: WizardFormData,
  config: SiteConfig
): { valid: boolean; error?: string; step?: number } => {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const stepConfig = WIZARD_STEPS.find(s => s.id === i);
    if (stepConfig) {
      const result = stepConfig.validate(form, config);
      if (!result.valid) {
        return { valid: false, error: result.error, step: i };
      }
    }
  }
  return { valid: true };
};

// ============================================
// WIZARD STEP CONFIGURATION
// ============================================

/**
 * Centralized wizard step configuration
 * All wizard behavior is defined here:
 * - Step order
 * - Step titles
 * - Step subtitles
 * - Validation functions
 * 
 * Future changes should only require editing this array.
 */
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 1,
    key: 'occasion-participants',
    title: 'Occasion & Participants',
    subtitle: 'Choose occasion and names',
    validate: validateDetailsStep,
  },
  {
    id: 2,
    key: 'hero',
    title: 'Hero & Message',
    subtitle: 'Your special message',
    validate: validateHeroStep,
  },
  {
    id: 3,
    key: 'style',
    title: 'Choose Style',
    subtitle: 'Pick the mood',
    validate: validateStyleStep,
  },
  {
    id: 4,
    key: 'layout',
    title: 'Page Layout',
    subtitle: 'Select sections',
    validate: validateLayoutStep,
  },
  {
    id: 5,
    key: 'templates',
    title: 'Templates',
    subtitle: 'Design picks',
    validate: validateTemplateStep,
  },
  {
    id: 6,
    key: 'content',
    title: 'Content',
    subtitle: 'Fill in your sections',
    validate: validateContentStep,
  },
  {
    id: 7,
    key: 'review',
    title: 'Review',
    subtitle: 'Almost done!',
    validate: validateReviewStep,
  },
];

/**
 * Total number of wizard steps
 */
export const TOTAL_STEPS = 7;

/**
 * Get step configuration by ID
 */
export const getStepConfig = (stepId: number): WizardStepConfig | undefined => {
  return WIZARD_STEPS.find(s => s.id === stepId);
};

/**
 * Get step configuration by key
 */
export const getStepConfigByKey = (key: string): WizardStepConfig | undefined => {
  return WIZARD_STEPS.find(s => s.key === key);
};

/**
 * Get the next step ID after current step
 */
export const getNextStep = (currentStep: number): number | null => {
  if (currentStep >= TOTAL_STEPS) return null;
  return currentStep + 1;
};

/**
 * Get the previous step ID before current step
 */
export const getPreviousStep = (currentStep: number): number | null => {
  if (currentStep <= 1) return null;
  return currentStep - 1;
};

/**
 * Check if current step is the final step
 */
export const isFinalStep = (currentStep: number): boolean => {
  return currentStep === TOTAL_STEPS;
};

/**
 * Check if current step is the first step
 */
export const isFirstStep = (currentStep: number): boolean => {
  return currentStep === 1;
};

/**
 * Get step title by ID (for use in UI)
 */
export const getStepTitle = (stepId: number): string => {
  const step = getStepConfig(stepId);
  return step?.title || 'Unknown Step';
};

/**
 * Get step subtitle by ID (for use in UI)
 */
export const getStepSubtitle = (stepId: number): string => {
  const step = getStepConfig(stepId);
  return step?.subtitle || '';
};

/**
 * Validate a specific step by ID
 */
export const validateStep = (
  stepId: number,
  form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  const stepConfig = getStepConfig(stepId);
  if (!stepConfig) {
    return { valid: true };
  }
  return stepConfig.validate(form, config);
};

/**
 * Navigation helper: check if a step is clickable
 * Users can only click on completed steps or the current step
 */
export const canNavigateToStep = (
  targetStep: number,
  currentStep: number,
  completedSteps: number[]
): boolean => {
  // Can always go back to previous steps
  if (targetStep < currentStep) {
    return true;
  }
  // Can only go forward to completed steps
  if (completedSteps.includes(targetStep - 1)) {
    return true;
  }
  return false;
};

// ============================================
// RE-EXPORT FROM BUILDER-CONSTANTS
// ============================================

// Re-export section toggles for convenience
export { SECTION_TOGGLES, THEME_PRESETS, LAYOUT_PRESETS } from './builder-constants';

