# Section Registry Refactoring TODO

## Phase 1: Create Section Registry
- [x] Create lib/section-registry.ts with section metadata, templates, and requirements

## Phase 2: Update Types
- [ ] Update lib/types.ts - Add section_templates map and backward compatibility
- [ ] Keep existing template fields for API compatibility

## Phase 3: Update Builder Constants
- [ ] Integrate section registry into builder-constants.ts
- [ ] Export helper functions

## Phase 4: Update Validation
- [ ] Refactor lib/builder-steps-config.ts to use registry
- [ ] Dynamic validation based on section requirements

## Phase 5: Update Components
- [ ] Refactor TemplateSelector.tsx - Dynamic rendering from registry
- [ ] Refactor SummaryPanel.tsx - Dynamic section rendering
- [ ] Update app/admin/websites/create/page.tsx - Dynamic template selection

## Phase 6: Testing
- [ ] Verify backward compatibility
- [ ] Verify API submission works
- [ ] Verify builder UX unchanged

