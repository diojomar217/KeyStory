# Uniform Section Headers TODO
Approved plan to make ALL /love/[slug] section headers perfectly consistent using existing SectionHeader.tsx.

## Steps (Track progress by checking off):

### 1. ✅ Create this TODO.md [DONE]

### 2. Fix confirmed custom headers ✅
- ✅ components/sections/PlaylistSection.tsx → Added SectionHeader icon="🎶" title="Our Playlist" subtitle="Songs that define our relationship"
- ✅ components/sections/VideoMemoriesSection.tsx → Added SectionHeader icon="🎬" title="Video Memories" subtitle="Relive your most precious moments together" (both cases)

### 3. Search & fix ALL remaining custom headers ✅
- ✅ search_files returned 0 results → No remaining custom headers in components/sections

### 4. Standardize wrappers ✅
- ✅ components/love/SectionLayouts.tsx → Standardized to "text-center mb-16 lg:mb-24 max-w-3xl mx-auto" (fixed mb-20/28 max-w-4xl)

### 5. Enhance registry (optional for dynamic subtitles)
- [ ] lib/section-registry.tsx → Add subtitle to each SectionMetadata

### 6. ✅ Verify & test
- ✅ search_files: 0 custom headers remain
- Headers uniform ✓

### 7. ✅ User feedback: Add id to all sections
- ✅ Added `id="playlist"` to PlaylistSection.tsx sections
- ✅ Added `id="video-memories"` to VideoMemoriesSection.tsx sections (both cases)
- ✅ Many other sections already had ids (e.g. #song, #gallery, #timeline, #love-letter, #gifts, #future-dreams)
- All navigable ✓

### 8. Final verification
- ✅ All headers uniform, ids added, 0 custom headers ✓

## Standard Subtitle/Icon Map
```
playlist: icon="🎶" subtitle="Songs that define our relationship"
video_memories: icon="🎬" subtitle="Relive your most precious moments together"
love_letter: icon="💌" subtitle="A message from my heart to yours"
our_story: icon="📖" subtitle="How our incredible journey began"
reasons_love_you: icon="💖" subtitle="Reasons that make you so special"
...
```

