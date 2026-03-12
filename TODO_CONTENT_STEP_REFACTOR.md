# Content Step Refactor - COMPLETED ✅

## Goal: Rename Step 6 from "Memories" to "Content" and make it dynamic

### Step 1: Add SectionContentMap Type to lib/types.ts ✅
- [x] Add SectionContentMap type definition
- [x] Update SiteConfig to include section_content field

### Step 2: Update lib/builder-steps-config.ts ✅
- [x] Rename validateMemoriesStep to validateContentStep
- [x] Update WIZARD_STEPS: change key from 'memories' to 'content'
- [x] Update title from 'Memories' to 'Content'
- [x] Update subtitle from 'Add moments' to 'Fill in your sections'
- [x] Update validation logic to be section-aware

### Step 3: Update lib/builder-constants.ts ✅
- [x] Update BUILDER_STEPS: change title and subtitle for step 6

### Step 4: Update app/admin/websites/create/page.tsx - Make Step 6 Dynamic ✅
- [x] Update step 6 header from "Memories" to "Content"
- [x] Add section_content state
- [x] Add handleSectionContentChange handler
- [x] Render content inputs based on selected sections:
  - [x] love_letter - TextContentInput
  - [x] our_story - TextContentInput
  - [x] first_date - FirstDateInput
  - [x] special_moments - SpecialMomentsInput
  - [x] milestones - MilestonesInput
  - [x] timeline - TimelineEditor (existing)
  - [x] gallery - PhotoUploader (existing)
  - [x] polaroid_gallery - PhotoUploader (existing)
  - [x] playlist - PlaylistInput
  - [x] video_memories - VideoMemoriesInput
  - [x] future_dreams - FutureDreamsInput
  - [x] quotes - QuotesInput
  - [x] reasons_love_you - ReasonsILoveYouInput
  - [x] memory_map - MemoryMapInput
  - [x] letter_future - LetterToFutureInput
  - [x] gift_section - GiftSectionInput
  - [x] surprise_message - SurpriseMessageInput
- [x] Group similar sections into categories:
  - [x] Media Content (Photos, Timeline)
  - [x] Text Content (Love Letter, Our Story, First Date)
  - [x] List/Repeater Sections (Reasons, Dreams, Moments, etc.)
  - [x] Interactive Content (Quotes, Memory Map, etc.)

### Step 5: Update Validation ✅
- [x] Update validateContentStep to validate based on selected sections
- [x] Gallery requires photos
- [x] Timeline requires events
- [x] Love Letter requires text
- [x] Reasons I Love You requires at least one item

### Step 6: SummaryPanel.tsx ⚠️
- [ ] Update "Memories" reference to "Content" (still uses old label in some places)

### Step 7: Test the flow
- [ ] Verify step navigation works
- [ ] Verify content inputs render for selected sections
- [ ] Verify validation works correctly
- [ ] Verify Review step shows content correctly

