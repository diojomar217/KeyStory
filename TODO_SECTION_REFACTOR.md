# Section Architecture Refactor Plan

## Information Gathered

### Current State Analysis

**Current Sections (23 total):**
1. `home` - Hero section (required)
2. `love_letter` - Love letter
3. `gallery` - Photo gallery
4. `timeline` - Timeline with events
5. `song` - Song embed
6. `our_story` - Story text
7. `first_date` - First date details
8. `special_moments` - Special moments
9. `milestones` - Milestones
10. `polaroid_gallery` - Polaroid style photos
11. `playlist` - Playlist embed
12. `video_memories` - Video memories
13. `relationship_stats` - Stats counter
14. `anniversary_countdown` - Countdown
15. `future_dreams` - Future dreams
16. `quotes` - Love quotes
17. `reasons_love_you` - Reasons list
18. `memory_map` - Map of places
19. `guest_messages` - Guest messages
20. `letter_future` - Letter to future
21. `gift_section` - Gift section
22. `surprise_message` - Surprise message
23. `qr_keepsake` - QR keepsake

**Redundancy Identified:**
- STORY: `our_story`, `first_date`, `special_moments`, `milestones`, `timeline` - all represent relationship journey
- PHOTO: `gallery`, `polaroid_gallery` - both display photos

---

## Plan: Part 1 - Update Types (lib/types.ts)

### Changes:
1. Keep `Section` type but add deprecation markers in comments
2. Add `GalleryLayout` type: `'grid' | 'polaroid' | 'carousel'`
3. Add backward compatibility mapping type

---

## Plan: Part 2 - Update Section Registry (lib/section-registry.tsx)

### Changes:
1. Mark deprecated sections with `deprecated: true` flag
2. Add `gallery_layout` to gallery section metadata
3. Add `mergeTo` property to map deprecated sections to new ones:
   - `first_date` → `timeline` (convert to timeline event)
   - `special_moments` → `timeline` (convert to timeline events)
   - `milestones` → `timeline` (convert to timeline events)
   - `polaroid_gallery` → `gallery` (use layout="polaroid")

---

## Plan: Part 3 - Update Builder Constants (lib/builder-constants.ts)

### Changes:
1. Remove deprecated sections from main toggles or mark as hidden
2. Create `DEPRECATED_SECTIONS` constant
3. Update `getDefaultSections()` to exclude deprecated
4. Add gallery layout selector to section toggles

---

## Plan: Part 4 - Update LovePageClient (components/LovePageClient.tsx)

### Changes:
1. Add backward compatibility handler for old sections
2. Merge timeline events from deprecated sections into main timeline
3. Handle polaroid_gallery → gallery with polaroid layout
4. Update rendering order to match target structure

**Backward Compatibility Logic:**
```typescript
// Convert old sections to new format
const normalizeSections = (sections: string[], config: any) => {
  let normalized = [...sections];
  let timelineEvents = [...(config.timeline_events || [])];
  let galleryLayout = config.gallery_template || 'grid';

  // If first_date exists, add to timeline events
  if (normalized.includes('first_date') && config.section_content?.first_date) {
    timelineEvents.push({
      title: config.section_content.first_date.title || 'First Date',
      date: config.section_content.first_date.date || config.anniversary_date,
      description: config.section_content.first_date.description || '',
      isSpecial: true
    });
    normalized = normalized.filter(s => s !== 'first_date');
  }

  // If polaroid_gallery exists, switch gallery to polaroid layout
  if (normalized.includes('polaroid_gallery')) {
    galleryLayout = 'polaroid';
    normalized = normalized.filter(s => s !== 'polaroid_gallery');
  }

  return { normalized, timelineEvents, galleryLayout };
};
```

---

## Plan: Part 5 - Update Gallery Section (components/GallerySection.tsx)

### Changes:
1. Gallery already supports `grid`, `carousel`, `polaroid` layouts ✓
2. No changes needed - just ensure backward compatibility passes correct layout

---

## Plan: Part 6 - Update Section Selector UI (components/SectionSelector.tsx)

### Changes:
1. Hide deprecated sections from main UI
2. Show deprecation notice when user has deprecated sections enabled
3. Auto-migrate deprecated sections on load

---

## Plan: Part 7 - Update Page Rendering Order (components/LovePageClient.tsx)

### Target Order:
1. Hero (home)
2. Love Letter
3. Our Story
4. Timeline (handles first_date, milestones, special_moments)
5. Gallery (handles polaroid_gallery)
6. Media (Song/Playlist/Video)
7. Love Stats (Relationship Stats / Anniversary Countdown)
8. Future Dreams
9. Reasons I Love You
10. Love Quotes
11. Guest Messages
12. Surprise Message
13. QR Keepsake
14. Footer

---

## Implementation Steps

### Step 1: Update lib/types.ts
- Add GalleryLayout type

### Step 2: Update lib/section-registry.tsx
- Add deprecation flags
- Add merge mappings

### Step 3: Update lib/builder-constants.ts
- Create deprecated sections list
- Update default sections

### Step 4: Update components/LovePageClient.tsx
- Add backward compatibility logic
- Update section rendering order

### Step 5: Test backward compatibility
- Verify old websites still work

---

## Expected Result

- Reduced from 23 to ~14 meaningful sections in builder UI
- Timeline becomes the main relationship journey component
- Gallery supports multiple layouts (no separate polaroid section)
- Cleaner, story-driven page flow
- Backward compatibility maintained for existing websites

