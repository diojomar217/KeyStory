# Builder Upgrade TODO List

## Phase 1: Type System & Configuration
- [ ] 1.1 Update lib/types.ts with extended types
  - [ ] ThemePresetConfig with full color/typography/card configs
  - [ ] LayoutPresetConfig type
  - [ ] SectionToggleConfig type
  - [ ] BuilderState type
  - [ ] DraftState type
  - [ ] PreviewDeviceType ('desktop' | 'mobile')

## Phase 2: New Builder Components
- [ ] 2.1 Create BuilderSidebar.tsx - Left navigation sidebar
- [ ] 2.2 Create BuilderStepNav.tsx - Step navigation  
- [ ] 2.3 Create BuilderPreview.tsx - Enhanced live preview
- [ ] 2.4 Create DevicePreviewToggle.tsx - Desktop/Mobile toggle
- [ ] 2.5 Create ThemePresetCard.tsx - Visual theme card
- [ ] 2.6 Create LayoutPresetCard.tsx - Layout preset card
- [ ] 2.7 Create SectionTogglePanel.tsx - Section enable/disable
- [ ] 2.8 Create ReviewPublishPanel.tsx - Final review page
- [ ] 2.9 Create DraftAutosave.tsx - Autosave logic
- [ ] 2.10 Create SmartContentHelpers.tsx - Suggest helpers

## Phase 3: Main Builder Page
- [ ] 3.1 Refactor app/create/page.tsx
  - [ ] 3-column layout (sidebar, form, preview)
  - [ ] 8-step navigation
  - [ ] Device preview toggle
  - [ ] Autosave integration
  - [ ] Section toggles
  - [ ] Layout presets
  - [ ] Enhanced review & publish

## Phase 4: Styling & UX
- [ ] 4.1 Add builder-specific Tailwind styles
- [ ] 4.2 Add loading states and animations
- [ ] 4.3 Add toast notifications
- [ ] 4.4 Add unsaved changes warning

## Phase 5: Testing & Polish
- [ ] 5.1 Test autosave functionality
- [ ] 5.2 Test device preview toggle
- [ ] 5.3 Test section toggles
- [ ] 5.4 Test theme selection
- [ ] 5.5 Test layout presets
- [ ] 5.6 Test review & publish flow

