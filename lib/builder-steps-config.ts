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
  helpText?: string;
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
  config: SiteConfig
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
  
if (!form.participants || form.participants.length === 0 || !form.participants[0]?.name?.trim()) {
    return { valid: false, error: 'At least one participant name is required' };
  }
  
  if (form.participants.length < 2 && form.occasion === 'couple') {
    return { valid: false, error: 'Couple occasion requires two participant names' };
  }
  
  if (!form.specialDate) {
    return { valid: false, error: 'Special date is required' };
  }

  if (config?.password?.enabled) {
    if (!form.password_input?.trim()) {
      return { valid: false, error: 'Password is required when protection is enabled' };
    }
    const len = form.password_input.trim().length;
    if (len < 4 || len > 6) {
      return { valid: false, error: 'Password must be 4 to 6 characters long' };
    }
  }
  
  return { valid: true };
};

/**
 * Step 2: Hero & Message - Validates love message content
 */
export const validateHeroStep = (
  form: WizardFormData,
  config: SiteConfig
): ValidationResult => {
  // Love message is only required if the Love Letter section is enabled
  const requiresMessage = config.sections?.includes('love_letter');
  if (requiresMessage && !form.message?.trim()) {
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
  
  // Love Letter requires hero message content (moved from step 2 into content)
  if (sections.includes('love_letter') && !form.message?.trim()) {
    return { valid: false, error: 'Love message is required when Love Letter section is selected' };
  }

  // Song requires song link (from section_content)
  if (sections.includes('song')) {
    const songLink = sectionContent.song?.song_link || '';
    if (!songLink.trim()) {
      return { valid: false, error: 'Song section requires a song link' };
    }
  }

  // Birthday Message requires content
  if (sections.includes('birthday_message')) {
    const message = sectionContent.birthday_message?.content || '';
    if (!message.trim()) {
      return { valid: false, error: 'Birthday Message section requires a message' };
    }
  }

  // Birthday Wishes requires at least one wish
  if (sections.includes('birthday_wishes')) {
    const wishes = sectionContent.birthday_wishes?.quotes || [];
    if (!Array.isArray(wishes) || wishes.length === 0) {
      return { valid: false, error: 'Birthday Wishes section requires at least one wish' };
    }
  }

  // Party Details require at least one field
  if (sections.includes('party_details')) {
    const details = sectionContent.party_details || {};
    if (!details.location && !details.date && !details.time && !details.dressCode) {
      return { valid: false, error: 'Party Details section requires at least one field filled in' };
    }
  }

  // Gift Wishlist requires at least one item
  if (sections.includes('gift_wishlist')) {
    const items = sectionContent.gift_wishlist?.items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, error: 'Gift Wishlist section requires at least one item' };
    }
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
    helpText: 'Select the type of occasion (e.g., birthday, wedding, anniversary) and enter the names of the main participants. This information will personalize your website and help generate the right sections.',
    validate: validateDetailsStep,
  },
  {
    id: 2,
    key: 'style',
    title: 'Choose Style',
    subtitle: 'Pick the mood',
    helpText: 'Select a theme that matches the vibe of your occasion. You can preview different color schemes and font styles to see what fits best.',
    validate: validateStyleStep,
  },
  {
    id: 3,
    key: 'layout',
    title: 'Page Layout',
    subtitle: 'Select sections',
    helpText: 'Choose which sections to include on your website (e.g., gallery, timeline, guestbook). You can reorder or remove sections to customize the flow.',
    validate: validateLayoutStep,
  },
  {
    id: 4,
    key: 'templates',
    title: 'Templates',
    subtitle: 'Design picks',
    helpText: 'Pick templates for each section. Templates control the layout and style of content blocks like your gallery, timeline, or love letter.',
    validate: validateTemplateStep,
  },
  {
    id: 5,
    key: 'content',
    title: 'Content',
    subtitle: 'Fill in your sections',
    helpText: 'Add your story, upload photos, and personalize each section. You can save your progress and come back anytime.',
    validate: validateContentStep,
  },
  {
    id: 6,
    key: 'review',
    title: 'Review',
    subtitle: 'Almost done!',
    helpText: 'Review all your details and make sure everything looks perfect. When you’re ready, submit to publish your website!',
    validate: validateReviewStep,
  },
];

/**
 * Total number of wizard steps
 */
export const TOTAL_STEPS = 6;

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
// No longer re-export from builder-constants; use /config files directly

