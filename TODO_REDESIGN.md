# TODO: Redesign /love/[slug] - Premium Website Layout

## Project Overview
Transform the generated couple website from a simple stacked card layout to a premium full-width website with proper sections, spacing, and visual hierarchy.

## Current Issues Identified
1. Sections render without proper full-width containers
2. No alternating section backgrounds for visual rhythm
3. QR code is not displayed on the page
4. Music player is embedded inside hero instead of a dedicated section
5. Missing proper footer with QR code placement
6. Sections lack generous spacing and container max-widths

---

## Phase 1: Enhanced Theme System

### 1.1 Update ThemeWrapper.tsx
- [ ] Add section-specific background styles (sectionBg, sectionBgAlt)
- [ ] Add hero-specific background styles (heroBg)
- [ ] Add footer-specific styles
- [ ] Add gradient definitions for each theme
- [ ] Export theme context for child components

### 1.2 Extended Theme Definitions
```typescript
romantic_classic:
  - pageBg: gradient from rose-50 to pink-100
  - sectionBg: white with rose tint
  - sectionBgAlt: rose-50
  - heroBg: gradient with rose accents
  - accent: rose-500
  - heading: font-serif

cute_pastel:
  - pageBg: gradient from purple-50 via pink-50 to yellow-50
  - sectionBg: white
  - sectionBgAlt: purple-50/50
  - heroBg: gradient with soft pastels
  
minimal_modern:
  - pageBg: gradient from slate-50 to gray-100
  - sectionBg: white
  - sectionBgAlt: gray-50
  - heroBg: clean white with subtle shadow
  
dark_elegant:
  - pageBg: gradient from zinc-900 to zinc-800
  - sectionBg: zinc-800/50
  - sectionBgAlt: zinc-900
  - heroBg: dark gradient with amber accents
```

---

## Phase 2: Main Layout Redesign

### 2.1 Redesign LovePageClient.tsx
- [ ] Add full-width section containers with inner max-w-6xl mx-auto
- [ ] Add alternating section backgrounds for visual rhythm
- [ ] Add generous vertical spacing (py-16 or py-20) between sections
- [ ] Add proper header with navigation styling
- [ ] Add dedicated footer with QR code section
- [ ] Pass qrCodeUrl to client component

### 2.2 Update page.tsx
- [ ] Fetch qr_code_url from the database
- [ ] Pass qrCodeUrl to LovePageClient

---

## Phase 3: Section Enhancements

### 3.1 HomeSection.tsx Enhancements
- [ ] Add container wrapper with max-w-6xl mx-auto
- [ ] Improve hero templates with better backgrounds
- [ ] Add decorative elements (hearts, shapes) based on theme
- [ ] Make relationship timer more prominent

### 3.2 GallerySection.tsx Enhancements
- [ ] Add section container with max-w-6xl mx-auto
- [ ] Add section heading with decorative styling
- [ ] Improve grid layout with better spacing
- [ ] Add hover animations

### 3.3 TimelineSection.tsx Enhancements
- [ ] Add section container with max-w-6xl mx-auto
- [ ] Add section heading with decorative styling
- [ ] Improve timeline card styling

---

## Phase 4: New Components

### 4.1 Create SongSection.tsx
- [ ] Create dedicated "Our Song" section
- [ ] Style as a polished website section (not embedded iframe)
- [ ] Add heading, description, and supportive copy
- [ ] Include elegant music player embed
- [ ] Make it feel like part of the website

### 4.2 Create QRSection.tsx
- [ ] Create dedicated QR code section near footer
- [ ] Style as secondary/footer element
- [ ] Add "Scan to revisit our story" message
- [ ] Display QR code image elegantly
- [ ] Make it optional (only if qr_code_url exists)

### 4.3 Create FooterSection.tsx
- [ ] Create elegant footer
- [ ] Include couple names and romantic message
- [ ] Include QR section
- [ ] Add social/produced-by styling

---

## Phase 5: Relationship Timer Styling

### 5.1 Update RelationshipTimer.tsx
- [ ] Make timer more visually prominent
- [ ] Add card-like container styling
- [ ] Add better typography hierarchy
- [ ] Remove awkward pulse animation
- [ ] Style as hero highlight block

---

## Phase 6: Responsive Design

### 6.1 Mobile Optimizations
- [ ] Ensure sections stack properly on mobile
- [ ] Adjust padding for mobile (px-4 or px-6)
- [ ] Ensure images are responsive
- [ ] Test touch interactions

### 6.2 Desktop Enhancements
- [ ] Ensure generous spacing on desktop
- [ ] Add hover effects for interactive elements
- [ ] Ensure proper max-width containment

---

## File Changes Summary

### Files to Modify:
1. **app/love/[slug]/page.tsx** - Fetch and pass qr_code_url
2. **components/ThemeWrapper.tsx** - Enhanced theming
3. **components/LovePageClient.tsx** - Main layout redesign
4. **components/HomeSection.tsx** - Container and styling
5. **components/GallerySection.tsx** - Container and styling
6. **components/TimelineSection.tsx** - Container and styling
7. **components/RelationshipTimer.tsx** - Better styling

### Files to Create:
1. **components/SongSection.tsx** - Dedicated music section
2. **components/QRSection.tsx** - QR code display
3. **components/FooterSection.tsx** - Complete footer with QR

---

## Implementation Order

1. First: Update ThemeWrapper with extended styles
2. Second: Update page.tsx to pass qr_code_url
3. Third: Create new components (SongSection, QRSection, FooterSection)
4. Fourth: Update LovePageClient with new layout
5. Fifth: Enhance individual sections with containers
6. Sixth: Update RelationshipTimer styling
7. Seventh: Test and polish

---

## Success Criteria

- [ ] Page looks like a premium romantic microsite
- [ ] No "paper card" layout - full-width sections instead
- [ ] Proper vertical rhythm with alternating backgrounds
- [ ] QR code placed elegantly near footer (not as background)
- [ ] Music feels like a dedicated section, not an embed
- [ ] Responsive on all devices
- [ ] Each theme has distinct, polished styling
- [ ] All sections have proper max-width containers

