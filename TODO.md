# Section Background Alternation Refactor TODO
Current Working Directory: c:/Users/diojo/OneDrive/Documents/keystory

## Plan Summary
Refactor public site (/site/[slug]) for dynamic rendered-index section bg alternation. Centralize in lib/section-utils.ts, fix double-bg in sections/layouts.

## Steps (to be checked off as completed)

### 1. Create central helper ✅
- Created lib/section-utils.ts with getSectionBgClass/useSectionBg/getSectionVariant

### 2. Update SectionLayouts.tsx ✅
- Removed getBackgroundClass from all 3 layouts, added bgClass?: string prop
- Layouts now padding-only (`relative py-24 lg:py-32 ${bgClass}`)
- Fixed remaining TS errors (styles in GridSectionLayout)

### 3. Minor polish LovePageClient.tsx ✅
- Imported helpers from lib/section-utils.ts
- Wrapper now uses useSectionBg(theme)(renderedSectionCount)
- Removed local getSectionVariant (uses imported)

### 4. Identify hardcoded bg sections ✅
- search_files + manual: Found & fixed OurStory/Quotes/FutureDreams/ReasonsILoveYou + others via pattern.

### 5. Batch update sections ✅
- For each: remove hardcoded bg/variant from <section>, keep py-*/content/inner styling.
- e.g. OurStorySection: <section id="our-story" className="relative">

### 6. Test [ ]
- Manually verify alternation on /site/[slug]
- Reorder sections, disable some → confirm dynamic.
- Check all themes.

### 7. Cleanup [ ]
- Update TODO.md complete ✅
- attempt_completion

**Progress: 3/7**
