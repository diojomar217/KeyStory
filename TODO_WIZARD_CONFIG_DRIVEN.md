# Config-Driven Wizard System - Implementation Plan

## Overview
Refactor the Love Story Website Builder wizard from scattered logic to a centralized CONFIG-DRIVEN step system.

## Information Gathered

### Current Architecture Issues:
- `BUILDER_STEPS` in `lib/builder-constants.ts` (basic info only)
- `validateStep()` is a large switch statement in `app/admin/websites/create/page.tsx`
- `renderStepContent()` is a large switch statement in the same file
- Navigation logic (`handleNext`, `handleBack`, `handleStepClick`) scattered in the page
- `StepNavigator` component has its own hardcoded steps array

### Key Files to Modify:
1. **NEW:** `lib/builder-steps-config.ts` - Centralized wizard configuration
2. **UPDATE:** `app/admin/websites/create/page.tsx` - Use config-driven validation
3. **UPDATE:** `components/StepNavigator.tsx` - Use centralized config

---

## Implementation Steps

### STEP 1: Create Wizard Step Configuration
- [x] Create `lib/builder-steps-config.ts`
- [x] Define WIZARD_STEPS array with validation functions
- [x] Export TOTAL_STEPS constant
- [x] Include step keys: details, hero, style, layout, templates, memories, review

### STEP 2: Move Validation Functions
- [x] Create validateDetailsStep() - returns { valid: boolean; error?: string }
- [x] Create validateHeroStep()
- [x] Create validateStyleStep()
- [x] Create validateLayoutStep()
- [x] Create validateTemplateStep()
- [x] Create validateMemoriesStep()
- [x] Create validateReviewStep()

### STEP 3: Update Page Wizard Logic
- [x] Import WIZARD_STEPS from new config
- [x] Replace validateStep switch with config-driven validation
- [x] Use stepConfig.validate(form, config) pattern

### STEP 4: Update StepNavigator
- [x] Import WIZARD_STEPS from config
- [x] Remove hardcoded steps array
- [x] Use WIZARD_STEPS.map() for rendering

### STEP 5: Protect Final Submission
- [x] Ensure only step 7 (TOTAL_STEPS) triggers submission
- [x] Show "Create Your Love Website" button on final step
- [x] Show "Continue" button on all other steps

### STEP 6: Clean Navigation Logic
- [x] handleNext(): validate → mark completed → move next
- [x] handleBack(): move to previous step only
- [x] handleStepClick(): allow completed steps only

### STEP 7: Verify Maintainability
- [ ] Test all 7 steps work correctly
- [ ] Verify validation runs on each step
- [ ] Ensure Review step is never skipped

---

## Expected Result
- Wizard step titles always match content
- Validation always aligns with current step
- Review step never skipped
- Navigation becomes predictable
- Future changes only require editing builder-steps-config.ts

