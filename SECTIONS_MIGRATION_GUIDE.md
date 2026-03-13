# Sections Migration Guide

## Generic Folder (`components/sections/generic/` - all occasions)
```
MOVE sections/ → generic/:
- AnniversaryCountdownSection.tsx
- GallerySection.tsx (rename/move)
- TimelineSection.tsx  
- SongSection.tsx
- MemoryMapSection.tsx
- GuestMessagesSection.tsx
- VideoMemoriesSection.tsx
- PlaylistSection.tsx
- PolaroidGallerySection.tsx
```

## Couple Folder (`components/sections/couple/` - love-specific)
```
MOVE sections/ → couple/:
- LoveLetterSection.tsx
- QuotesSection.tsx
- OurStorySection.tsx
- ReasonsILoveYouSection.tsx
- FirstDateSection.tsx
- SpecialMomentsSection.tsx
- MilestonesSection.tsx
- RelationshipStatsSection.tsx
- FutureDreamsSection.tsx
- LetterToFutureSection.tsx
- GiftSection.tsx
- SurpriseMessageSection.tsx
```

## After Moving:
```
npm run build
npm run dev
Update lib/section-renderer-registry.ts imports if needed
```

**Pattern:** generic = universal, couple = love-specific. Ready for wedding/birthday dirs!

