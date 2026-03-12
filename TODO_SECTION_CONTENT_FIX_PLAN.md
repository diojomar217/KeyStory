# Section Content Fix Plan

## Summary of the Issue
Content entered in Step 6 (Content) of the builder is not appearing on /love/[slug] pages. The builder correctly stores section_content in config, and the API correctly saves it to the database, but the LovePageClient components are not receiving or using this content.

## Root Causes Identified

### 1. LovePageClient doesn't pass sectionContent to most section components
The following sections receive sectionContent but don't pass it:
- `SurpriseMessageSection` - doesn't accept message prop
- `GiftSection` - doesn't accept gifts prop  
- `LetterToFutureSection` - doesn't accept letter prop
- `MemoryMapSection` - doesn't accept locations prop
- `GuestMessagesSection` - doesn't accept messages prop
- `QuotesSection` - accepts quotes prop but not passed from LovePageClient
- `ReasonsILoveYouSection` - accepts reasons prop but not passed from LovePageClient

### 2. RelationshipStats calculation can produce negative values
When anniversary date is in the future, the stats will be negative.

## Files to Edit

### 1. components/LovePageClient.tsx
- Pass sectionContent props to all section components

### 2. components/sections/SurpriseMessageSection.tsx
- Accept and display message from sectionContent

### 3. components/sections/GiftSection.tsx
- Accept and display gifts from sectionContent

### 4. components/sections/LetterToFutureSection.tsx
- Accept and display letter from sectionContent

### 5. components/sections/MemoryMapSection.tsx
- Accept and display locations from sectionContent

### 6. components/sections/GuestMessagesSection.tsx
- Accept messages prop (currently has defaultMessages)

### 7. components/sections/RelationshipStatsSection.tsx
- Fix negative value calculation

## Implementation Steps

1. Update LovePageClient to pass all sectionContent props
2. Update each section component to:
   - Accept the prop from sectionContent
   - Use fallback defaults ONLY when prop is missing/empty
3. Fix RelationshipStatsSection to ensure non-negative values

