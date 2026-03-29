// lib/section-validation.ts
// ============================================
// SECTION VALIDATION - Registry-driven validation rules
// ============================================
// This module provides validation logic driven by the section registry
// to avoid hardcoded checks across multiple files.

import { Section, SiteConfig, Section as SectionType } from './types';
import { getSectionMetadata, SECTION_REGISTRY } from './section-registry';

// ============================================
// VALIDATION RULE TYPES
// ============================================

export interface ValidationRule {
  /** Unique identifier for the rule */
  id: string;
  /** Section this rule applies to */
  section: Section;
  /** Validation check function */
  check: (config: SiteConfig, data: ValidationData) => boolean;
  /** Warning message if validation fails */
  message: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationData {
  photos: File[] | string[];
  song_link?: string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  infos: string[];
}

// ============================================
// VALIDATION RULES - Define rules per section
// ============================================

/**
 * Get all validation rules from the registry
 */
export const getValidationRules = (): ValidationRule[] => {
  const rules: ValidationRule[] = [];

  // Iterate through all sections in registry
  Object.values(SECTION_REGISTRY).forEach((metadata) => {
    const section = metadata.key;

    // Photo requirement rule
    if (metadata.requiresPhotos) {
      rules.push({
        id: `${section}-photos`,
        section,
        check: (config, data) => {
          const photos = data.photos || [];
          return photos.length > 0;
        },
        message: `${metadata.title} section requires at least one photo`,
        severity: 'error',
      });
    }

    // Timeline events requirement rule
    if (metadata.requiresEvents) {
      rules.push({
        id: `${section}-events`,
        section,
        check: (config, data) => {
          const events = config.section_content?.timeline || [];
          return events.length > 0;
        },
        message: `${metadata.title} section requires at least one event`,
        severity: 'error',
      });
    }

    // Song link requirement rule
    if (section === 'song' || section === 'playlist') {
      rules.push({
        id: `${section}-song`,
        section,
        check: (config, data) => {
          return !!(data.song_link || (config as any).song_link);
        },
        message: `${metadata.title} section requires a song link`,
        severity: 'error',
      });
    }
  });

  return rules;
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate all enabled sections against their requirements
 */
export const validateSections = (
  sections: Section[],
  config: SiteConfig,
  data: ValidationData
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    infos: [],
  };

  const rules = getValidationRules();

  // Check each rule
  rules.forEach((rule) => {
    // Only validate rules for enabled sections
    if (!sections.includes(rule.section)) {
      return;
    }

    const passed = rule.check(config, data);

    if (!passed) {
      // Downgrade errors to warnings for non-critical rules
      if (rule.severity === 'error') {
        result.errors.push(rule.message);
        result.valid = false;
      } else if (rule.severity === 'warning') {
        result.warnings.push(rule.message);
      } else {
        result.infos.push(rule.message);
      }
    }
  });

  return result;
};

/**
 * Get warnings for a specific section
 */
export const getSectionWarnings = (
  section: Section,
  config: SiteConfig,
  data: ValidationData
): string[] => {
  const metadata = getSectionMetadata(section);
  if (!metadata) return [];

  const warnings: string[] = [];
  const photos = data.photos || [];
  const songLink = data.song_link || (config as any).song_link;

  // Check photo requirement
  if (metadata.requiresPhotos && photos.length === 0) {
    warnings.push(`${metadata.title} section enabled but no photos uploaded`);
  }

  // Check photo count recommendation
  if (section === 'gallery' && photos.length > 0 && photos.length < 3) {
    warnings.push('Consider adding more photos for a better gallery');
  }

  // Check timeline events
  if (metadata.requiresEvents) {
    const events = config.section_content?.timeline || [];
    if (events.length === 0) {
      warnings.push(`${metadata.title} enabled but no events added`);
    } else if (events.length < 2) {
      warnings.push(`${metadata.title} needs at least 2 events for a better story`);
    }
  }

  // Check song link
  if (section === 'song' && !songLink) {
    warnings.push(`${metadata.title} section enabled but no song link added`);
  }

  return warnings;
};

/**
 * Get all warnings for enabled sections
 */
export const getAllWarnings = (
  sections: Section[],
  config: SiteConfig,
  data: ValidationData
): string[] => {
  const warnings: string[] = [];

  sections.forEach((section) => {
    const sectionWarnings = getSectionWarnings(section, config, data);
    warnings.push(...sectionWarnings);
  });

  // Additional general warnings
  const photos = data.photos || [];
  if (photos.length > 0 && config.cover_photo_index === undefined) {
    warnings.push('No cover photo selected - first photo will be used');
  }

  return warnings;
};

/**
 * Check if a section has required data to render
 */
export const canRenderSection = (
  section: Section,
  config: SiteConfig,
  data: ValidationData
): boolean => {
  const metadata = getSectionMetadata(section);
  if (!metadata) return true; // Unknown sections are allowed

  const photos = data.photos || [];
  const songLink = data.song_link || (config as any).song_link;

  // Check photos
  if (metadata.requiresPhotos && photos.length === 0) {
    return false;
  }

  // Check timeline events
  if (metadata.requiresEvents) {
    const events = config.timeline_events || [];
    if (events.length === 0) {
      return false;
    }
  }

  // Check song link
  if ((section === 'song' || section === 'playlist') && !songLink) {
    return false;
  }

  return true;
};

/**
 * Get sections that can be rendered based on available data
 */
export const getRenderableSections = (
  sections: Section[],
  config: SiteConfig,
  data: ValidationData
): Section[] => {
  return sections.filter((section) => canRenderSection(section, config, data));
};

// ============================================
// TEMPLATE VALIDATION
// ============================================

/**
 * Check if all enabled sections have templates selected
 */
export const validateTemplates = (
  sections: Section[],
  config: SiteConfig
): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  const templateSections = ['home', 'gallery', 'timeline', 'song', 'love_letter', 'qr_keepsake'];

  sections.forEach((section) => {
    if (!templateSections.includes(section)) return;

    const metadata = getSectionMetadata(section);
    if (!metadata?.hasTemplates) return;

    // Check both old and new template formats
    const hasOldTemplate = [
      config.home_template,
      config.gallery_template,
      config.timeline_template,
      config.song_template,
    ].some((t) => t);

    const hasNewTemplate = config.section_templates?.[section];

    if (!hasOldTemplate && !hasNewTemplate && section !== 'love_letter') {
      missing.push(metadata.title);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
  };
};

// ============================================
// LEGACY HELPER FUNCTIONS (for backward compatibility)
// ============================================

/**
 * Legacy function to get warnings (used by SummaryPanel)
 */
export const getLegacyWarnings = (
  config: SiteConfig,
  form: { photos: File[]; song_link?: string }
): string[] => {
  const warnings: string[] = [];
  const sections = config.sections || [];

  // Gallery warnings
  if (sections.includes('gallery')) {
    if (form.photos.length === 0) {
      warnings.push('Gallery section enabled but no photos uploaded');
    } else if (form.photos.length < 3) {
      warnings.push('Consider adding more photos for a better gallery');
    }
  }

  // Timeline warnings
  if (sections.includes('timeline')) {
    const events = config.section_content?.timeline || [];
    if (events.length === 0) {
      warnings.push('Timeline enabled but no events added');
    } else if (events.length < 2) {
      warnings.push('Timeline section needs at least 2 events');
    }
  }

  // Song warnings
  if (sections.includes('song') && !form.song_link) {
    warnings.push('Song section enabled but no song link added');
  }

  // Cover photo warning
  if (form.photos.length > 0 && config.cover_photo_index === undefined) {
    warnings.push('No cover photo selected - first photo will be used');
  }

  return warnings;
};

