// lib/index.ts
// ============================================
// LOVE STORY BUILDER - Main Export File
// ============================================
// Export all public APIs from a single entry point

// Types
export * from './types';

// Section Registry
export * from './occasion-registry';
export * from './section-registry';

// Section Renderer (explicit re-exports to avoid conflicts)
export { 
  SECTION_RENDERERS, 
  getSectionRenderer, 
  hasSectionRenderer, 
  getRenderableSections as getAvailableSectionRenderers,
  buildSectionProps 
} from './section-renderer-registry';

// Section Validation
export * from './section-validation';

// Constants
// builder-constants.ts fully deprecated; all constants are now in /config

