## BIRTHDAY OCCASION IMPLEMENTATION
### Status: ✅ In Progress (Phase 1)

## Phases Complete
- [x] **Phase 0**: Analyzed architecture & created plan

## Current Phase (Phase 1: Activate Birthday)
- [x] 1. Set `OCCASION_REGISTRY.birthday.isProductionReady = true`
- [x] 2. Update birthday `defaultSections`
- [x] 3. Refactor `app/admin/websites/create/page.tsx` (occasion-aware form)
- [x] 4. Fix `/api/order.ts` for new fields + dynamic URL
- [x] 5. ✅ Create this TODO.md

**Phase 1 COMPLETE** 🎉

## Phase 2: Birthday Sections (Next)
```
- [ ] Create components/sections/birthday/
  - [ ] BirthdayMessageSection.tsx
  - [ ] BirthdayWishesSection.tsx  
  - [ ] BirthdayCountdownSection.tsx
- [ ] Update registries (section-registry.tsx, section-renderer-registry.ts)
```

## Phase 3: Builder Integration
```
- [ ] Add occasion selector to Step 1
- [ ] Conditional fields (couple: 2 names vs birthday: 1+)
- [ ] Filter sections by occasion.supportedOccasions
```

## Phase 4: Routing & Rendering
```
- [ ] app/[occasion]/[slug]/page.tsx (new dynamic route)
- [ ] /love/[slug] → redirect/legacy handler
```

## Phase 5: Data Migration
```
- [ ] Supabase: Add `occasion` column
- [ ] API /api/order: Accept occasion, map fields
- [ ] Backfill old data: occasion='couple'
```

## Testing Checklist
```
- [ ] Existing couple sites unaffected
- [ ] New birthday flow: create → preview → publish
- [ ] Legacy data migration
```

**Next Action**: Complete Phase 1 → Mark complete → Phase 2**

