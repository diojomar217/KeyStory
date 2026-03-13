# Keystory Architecture Refactor: Occasion-Based Scalability
## Status: 🚧 In Progress

## Breakdown of Approved Plan (Logical Steps)

### Phase 1: Core Types & Occasion System ✅ Complete

### Phase 2: Extend Registries ✅ Step 1 Complete
- [x] Update `lib/section-registry.tsx`: Add `supportedOccasions` to metadata, filter helpers
- [ ] Update `lib/section-renderer-registry.ts`
- [ ] Update `lib/builder-constants.ts`

## Current Progress
**Phase 1 Step 1 Complete** - Occasion registry ready with backward-compatible defaults.

### Phase 2: Extend Registries [After Phase 1]
- [ ] Update `lib/section-registry.tsx`: Add `supportedOccasions` to metadata, filter helpers
- [ ] Update `lib/section-renderer-registry.ts`: Generalize prop builders (participants/specialDate)
- [ ] Update `lib/builder-constants.ts`: Occasion-specific toggles/presets

### Phase 3: Dynamic Builder/Wizard [After Phase 2]
- [ ] Refactor `lib/builder-steps-config.ts`: Dynamic steps per occasion
- [ ] Update builder components: `SectionContentInputs.tsx`, `ContentInputComponents.tsx` for participants/specialDate

### Phase 4: Routing & Rendering [After Phase 3]
- [ ] Refactor `app/love/[slug]/page.tsx` → `app/[occasion]/[slug]/page.tsx`
- [ ] Update `components/love/*` → `components/occasions/couple/*`
- [ ] DynamicSectionRenderer: Filter sections by occasion

### Phase 5: Admin & API [After Phase 4]
- [ ] Add occasion selector to admin dashboard
- [ ] Update `app/api/order.ts`, Supabase schema/queries
- [ ] DB migration script for existing orders

### Phase 6: Sections Organization ✅ Complete
- [x] Organize `components/sections/` → `generic/` + `couple/` (20+ files moved)
- [x] Update `lib/section-renderer-registry.ts` imports

### Phase 7: Testing & Polish [Current]

### Phase 7: Testing & Polish [After Phase 6]

- [ ] Test full couple flow (create → preview → publish → view)
- [ ] Add wedding occasion stub & test extensibility
- [ ] Lint/build checks, remove deprecated sections
- [ ] Update README, constants exports

## Testing Commands
```bash
npm run lint
npm run build
npm run dev  # Test /love/[slug] works
```

## Current Progress
Updated: [Timestamp]

**Next Action: Proceed to Phase 1**

