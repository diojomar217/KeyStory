# Layout Improvement Plan

## Information Gathered:
The codebase has a Next.js App Router + TypeScript + Tailwind project for a "Love Story" website. The main components are:
- **LovePageClient.tsx** - Main page wrapper with sections
- **HomeSection.tsx** - Hero section with 3 templates (hero_centered, split_layout, fullscreen_banner)
- **GallerySection.tsx** - Photo gallery with 3 templates (grid, carousel, polaroid)
- **TimelineSection.tsx** - Timeline with 3 templates (vertical_timeline, milestone_cards, story_chapters)
- **SongSection.tsx** - Music player section
- **QRSection.tsx** - QR code section
- **ShareSection.tsx** - Social sharing section
- **FooterSection.tsx** - Footer wrapper

## Current Issues:
1. Many sections use `w-full` without centered max-width containers
2. Content can appear too narrow (card style) or too wide (full-width)
3. Missing consistent vertical rhythm between sections
4. No unified container system across sections

## Plan:

### Step 1: Update LovePageClient.tsx
- Add centered container pattern to each section wrapper
- Use consistent py-16 or py-20 spacing
- Use alternating backgrounds properly with centered content

### Step 2: Update HomeSection.tsx
- Hero centered: Change max-w-6xl to max-w-4xl for better readability
- Keep split_layout and fullscreen_banner as they are (already good)

### Step 3: Update GallerySection.tsx
- Wrap content in centered container with max-w-6xl
- Carousel: Reduce from max-w-7xl to max-w-6xl
- Ensure responsive px-4 mobile, px-6 desktop

### Step 4: Update TimelineSection.tsx
- Wrap content in centered container with max-w-5xl
- Add consistent padding

### Step 5: Update SongSection.tsx
- Wrap content in centered container with max-w-4xl
- Add proper section spacing

### Step 6: Update ShareSection.tsx
- Wrap content in centered container with max-w-4xl

### Step 7: Update QRSection.tsx
- Wrap content in centered container with max-w-4xl

### Step 8: Update FooterSection.tsx
- Ensure footer content is properly centered with max-w-5xl

## Container Width Standards:
- Hero: max-w-4xl (tighter for text readability)
- Gallery: max-w-6xl (wider for images)
- Timeline: max-w-5xl (balanced)
- Song/QR/Share: max-w-4xl (compact sections)
- Footer: max-w-5xl

## Responsive:
- Mobile: px-4
- Desktop: px-6

## Vertical Spacing:
- Section padding: py-16 (desktop: py-20)
- Section gap created by py on each section

