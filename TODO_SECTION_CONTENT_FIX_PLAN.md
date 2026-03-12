# Section Content Fix Plan - Edit Website Flow

## Problem Summary
The Edit Website page is missing Step 6 "Content" where users can input dynamic content for sections like Love Letter, Our Story, Future Dreams, etc.

## Issues Identified

1. **Edit has only 5 steps** (Create has 7 steps)
2. **No `section_content` in config state** 
3. **No `handleSectionContentChange` handler**
4. **No dynamic content inputs rendered**
5. **Step indicator shows only 5 steps**
6. **API doesn't save section_content** properly (needs to be in config)

## Fix Plan

### Step 1: Update Config State (Line ~100)
- Add `section_content: {}` to initial SiteConfig state

### Step 2: Add handleSectionContentChange Handler
```typescript
const handleSectionContentChange = (section: string, content: any) => {
  setConfig((prev) => ({
    ...prev,
    section_content: {
      ...prev.section_content,
      [section]: content,
    },
  }));
};
```

### Step 3: Fetch section_content from Database (fetchOrder function)
- Extract section_content from order.config when loading
- Safely handle missing section_content (backward compatibility)

### Step 4: Add Step 6 & 7 Content
- Update step indicator to show 7 steps
- Update navigation logic (handleNext, validateStep)
- Add Step 6 content rendering with all dynamic section inputs
- Add Step 7 review step

### Step 5: Import Required Components
- Import ContentInputComponents from @/components/builder/ContentInputComponents
- Import WIZARD_STEPS, TOTAL_STEPS, validateStep from @/lib/builder-steps-config

### Step 6: Update API Route (if needed)
- Ensure section_content is saved in config JSONB column

### Step 7: Backward Compatibility
- Handle missing section_content gracefully
- Default to empty {} if not present in database

## Files to Edit

1. **app/admin/websites/[id]/edit/page.tsx** - Main edit page (all changes here)
2. **app/api/admin/route.ts** - Verify section_content is saved (may already work)

## Components to Import

```typescript
import {
  TextContentInput,
  UrlContentInput,
  ReasonsILoveYouInput,
  FutureDreamsInput,
  VideoMemoriesInput,
  SpecialMomentsInput,
  MilestonesInput,
  PlaylistInput,
  FirstDateInput,
  LetterToFutureInput,
  SurpriseMessageInput,
  GiftSectionInput,
  QuotesInput,
  MemoryMapInput,
  GuestMessagesInput,
} from '@/components/builder/ContentInputComponents';
```

## Expected Result After Fix

- Edit page has 7 steps (matching Create)
- Step 6 shows dynamic content inputs for selected sections
- Saved values are prefilled from database
- Edits can be saved and persist correctly
- Backward compatible with older websites

