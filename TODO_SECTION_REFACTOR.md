# Section Refactoring Plan

## Overview
Refactor the Love Story Website Builder to remove redundant sections and create a cleaner, scalable architecture for the /love/[slug] page.

---

## Current State Analysis

### Redundant Sections Identified:

**Story Related (6 sections → 1):**
- `our_story` - Share relationship story
- `first_date` - First date memory
- `special_moments` - Memorable experiences
- `milestones` - Relationship achievements
- `timeline` - Relationship journey (KEEP)
- (no `our_love_story` currently exists in code)

**Photo Related (3 sections → 1):**
- `gallery` - Standard photo grid (KEEP, enhance)
- `polaroid_gallery` - Polaroid style
- (no `memories` currently exists in code)

**Media Related (3 sections → 1-2):**
- `song` - Single song
- `playlist` - Playlist
- `video_memories` - Videos

---

## Implementation Plan

### Phase 1: Update Type Definitions (lib/types.ts)

1. Keep Section type but document deprecated sections
2. Add `gallery_layout` to SiteConfig: `'grid' | 'polaroid' | 'carousel'`
3. Keep all types for backward compatibility

### Phase 2: Update Builder Constants (lib/builder-constants.ts)

Reduce from 24 to ~14 core sections:

**Keep (14 sections):**
1. home (required)
2. love_letter
3. our_story (rename concept to "Story" but keep id)
4. timeline (enhanced - absorbs first_date, special_moments, milestones)
5. gallery (enhanced - absorbs polaroid_gallery with layout option)
6. song
7. playlist
8. video_memories
9. relationship_stats
10. anniversary_countdown
11. future_dreams
12. reasons_love_you
13. quotes
14. guest_messages
15. surprise_message
16. qr_keepsake

**Remove from UI (but handle in backward compat):**
- first_date → convert to timeline event
- special_moments → convert to timeline event  
- milestones → convert to timeline event
- polaroid_gallery → convert to gallery with layout="polaroid"
- memory_map (optional - keep if useful)
- letter_future (optional - keep if useful)
- gift_section (optional - keep if useful)

### Phase 3: Update Section Registry (lib/section-registry.tsx)

1. Mark deprecated sections with `deprecated: true` flag
2. Add gallery_layout options to gallery section
3. Update hasLayoutOption for new structure

### Phase 4: Update Section Renderer Registry (lib/section-renderer-registry.ts)

1. Update gallery renderer to support layout prop
2. Add backward compatibility mapping for deprecated sections

### Phase 5: Update LovePageClient (components/LovePageClient.tsx)

**New Section Order:**
1. Hero (home)
2. Love Letter (love_letter)
3. Our Story (our_story)
4. Timeline (timeline) - now handles first_date, special_moments, milestones data
5. Gallery (gallery) - now handles polaroid_gallery layout
6. Media (song/playlist/video)
7. Love Stats (relationship_stats, anniversary_countdown)
8. Future Dreams (future_dreams)
9. Reasons I Love You (reasons_love_you)
10. Love Quotes (quotes)
11. Guest Messages (guest_messages)
12. Surprise Message (surprise_message)
13. QR Keepsake (qr_keepsake)
14. Footer

**Backward Compatibility Logic:**
- If `first_date` in sections → add to timeline events
- If `special_moments` in sections → add to timeline events
- If `milestones` in sections → add to timeline events
- If `polaroid_gallery` in sections → use gallery with layout="polaroid"

### Phase 6: Update Gallery Components

1. Update GallerySection to accept `layout` prop
2. Support: grid, polaroid, carousel layouts
3. PolaroidGallerySection can be deprecated but still work

### Phase 7: Update Timeline Component

1. TimelineSection should accept additional events from:
   - sectionContent.first_date
   - sectionContent.special_moments
   - sectionContent.milestones

---

## Backward Compatibility Strategy

### Migration Mapping:

```typescript
// Deprecated sections that should be converted
const DEPRECATED_SECTION_MAPPING: Record<string, Section> = {
  'first_date': 'timeline',
  'special_moments': 'timeline', 
  'milestones': 'timeline',
  'polaroid_gallery': 'gallery',
};

// Gallery layout mapping
const GALLERY_LAYOUT_MAPPING: Record<string, string> = {
  'polaroid_gallery': 'polaroid',
  'gallery': 'grid',
};
```

### Data Migration:

1. On page load, check for deprecated sections
2. Convert old data to new format
3. Render normally without showing deprecated sections in UI

---

## Expected Result

- Reduced from 24 to ~16 visible sections in builder
- Cleaner /love/[slug] page with logical story flow
- Timeline becomes the main relationship journey component
- Gallery supports multiple layouts (grid, polaroid, carousel)
- Existing websites continue to work without breaking
- Builder UI is simpler and less overwhelming

---

## Files to Modify

1. `lib/types.ts` - Update Section type, add gallery_layout
2. `lib/builder-constants.ts` - Update SECTION_TOGGLES
3. `lib/section-registry.tsx` - Update registry, add deprecation markers
4. `lib/section-renderer-registry.ts` - Update renderers, add backward compat
5. `components/LovePageClient.tsx` - Update rendering logic with backward compat
6. `components/GallerySection.tsx` - Add layout support
7. `components/TimelineSection.tsx` - Accept additional events
8. `app/love/[slug]/page.tsx` - Add backward compat data transformation

---

## Testing Checklist

- [ ] New websites can use all new sections
- [ ] Gallery displays in grid, polaroid, carousel modes
- [ ] Timeline displays correctly events from multiple sources
- [ ] Old websites with deprecated sections still render correctly
- [ ] Builder UI shows reduced section list (~14-16)
- [ ] Page flow is logical and story-driven

