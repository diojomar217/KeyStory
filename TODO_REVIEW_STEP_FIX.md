# TODO: Fix Review Step to Show All Dynamic Section Content

## Task Overview
Fix the Review step (SummaryPanel.tsx) so it properly displays all content entered in Step 6 (Content), including dynamic section content from config.section_content.

## Steps to Complete:

### Step 1: Analyze and understand the current SummaryPanel.tsx
- [x] Read SummaryPanel.tsx - identifies hardcoded content review
- [x] Read lib/types.ts - understands SectionContentMap types
- [x] Read lib/builder-constants.ts - understands SECTION_TOGGLES
- [x] Read components/builder/ContentInputComponents.tsx - understands content input components

### Step 2: Create enhanced Content review logic
- [x] Create helper function to render section content summaries
- [x] Iterate through config.sections and display content from config.section_content
- [x] Handle each section type appropriately (text preview, counts, links)

### Step 3: Implement section-specific summaries
- [x] love_letter - show text preview (first 100 chars)
- [x] our_story - show text preview (first 100 chars)
- [x] first_date - show title, date, location preview
- [x] special_moments - show moment count
- [x] milestones - show milestone count
- [x] playlist - show playlist link or "Not configured"
- [x] video_memories - show video count
- [x] future_dreams - show dream count
- [x] quotes - show quote count
- [x] reasons_love_you - show reason count
- [x] memory_map - show location count
- [x] letter_future - show preview (first 80 chars)
- [x] gift_section - show gift count
- [x] surprise_message - show "Configured" or "Not configured"
- [x] guest_messages - show status
- [x] qr_keepsake - show status

### Step 4: Handle missing vs completed states
- [x] Show appropriate status for sections with/without content
- [x] Use color-coded badges (green for completed, red for missing)

### Step 5: Keep existing functionality
- [x] Maintain backward compatibility (handle undefined section_content)
- [x] Keep existing gallery/timeline/song summaries working
- [x] Keep Edit buttons functional

### Step 6: Test the implementation
- [x] Verify all sections are displayed in Review
- [x] Verify content previews are readable
- [x] Verify missing content is clearly visible
- [x] Verify Edit buttons work correctly

