# Edit Website Steps Advanced Stepper (BLACKBOXAI)

## Status: IN PROGRESS

**Goal:** Replace simple edit steps buttons with advanced responsive stepper matching create flow design (rose active, emerald progress, mobile scroller + desktop bar).

**Plan Breakdown:**
1. ✅ **Plan approved** by user
2. ✅ **Created** `components/builder/EditStepNav.tsx` - responsive stepper matching create HTML (rose active step 1, emerald progress/completed, mobile scroller + desktop bar)
3. ✅ **Updated** `app/admin/websites/[id]/edit/page.tsx` - replaced inline simple buttons with EditStepNav component + import
4. ✅ **Verified** TypeScript compilation (edit/page.tsx compiles clean)
5. ⏳ **Final test** & complete

**Current Step:** Step 2 - Creating EditStepNav component

---

**Previous Tasks (Complete):**
- [x] Locate exact edit steps HTML location
- [x] Analyze create StepNavigator structure
- [x] Confirm step labels/logic matches (Info/Theme/Sections/Templates/Content/Review)

