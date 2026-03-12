# Edit Website Flow Fix - TODO

## Goal
Fix the Edit Website flow so users must explicitly review and confirm changes before the site is updated.

## Changes Required

### 1. Edit Website Page (`app/admin/websites/[id]/edit/page.tsx`)

-] Add [x `isSaving` state to track saving status
- [x] Add explicit `handleSaveChanges` function (not relying on form onSubmit)
- [x] Change Step 7 header to "Review Your Changes" with subtitle
- [x] Change button text: Steps 1-6 = "Back | Continue →", Step 7 = "Back | Save Changes"
- [x] Add "Saving changes..." loading state
- [x] Disable buttons during save to prevent double submission

### 2. SummaryPanel (`components/SummaryPanel.tsx`)

- [x] Add `mode` prop: 'create' | 'edit'
- [x] Update header text based on mode:
  - Create: "Review Your Love Website"
  - Edit: "Review Your Changes"

## Implementation Status

- [ ] Edit page updates
- [ ] SummaryPanel updates  
- [ ] Testing

## Expected Result

Edit Website flow:
- Step 7 shows "Review Your Changes" with subtitle
- Users see "Save Changes" button (not "Continue")
- Clear "Saving changes..." loading state
- Navigation still works (back, edit earlier steps)
- Create flow unchanged

