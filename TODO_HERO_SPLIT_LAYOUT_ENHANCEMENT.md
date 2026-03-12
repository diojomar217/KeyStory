# Hero Split Layout Enhancement Plan

## Task Overview
Enhance the hero section of `/love/[slug]` page, specifically the `split_layout` template, to feel more premium, balanced, and emotionally engaging.

## Current State Analysis

### Existing Implementation (`HomeSection.tsx`)
- **Template**: `split_layout` in `renderSplitLayout()` function
- **Layout**: Uses flex with `pt-8` (top padding hack)
- **Left side**: 50% width with image, has overlays but could be improved
- **Right side**: 50% width with content, no max-width container
- **Issues identified**:
  1. Large top padding `pt-8` instead of proper vertical centering
  2. Image dominates layout without proper balance
  3. No proper gradient overlay on image
  4. Text content stretches too wide
  5. Typography hierarchy could be improved
  6. Tagline styling is basic
  7. No CTA buttons in split layout
  8. No scroll indicator
  9. Mobile optimization needs work

## Enhancement Plan

### Part 1: Split Layout Balance
- Change from `flex pt-8` to `grid lg:grid-cols-2`
- Use equal 50/50 grid layout for desktop
- Ensure balanced visual weight between sides

### Part 2: Vertical Alignment
- Remove `pt-8` padding hack
- Use `min-h-screen` + `flex items-center` for proper centering
- Center content vertically within the viewport

### Part 3: Image Presentation
- Add subtle gradient overlay: `bg-gradient-to-r from-black/40 to-transparent`
- Improve transition between image and content
- Add `object-position` for better image framing
- Add subtle brightness control

### Part 4: Content Container
- Add `max-w-lg` to text container for better readability
- Improve typography hierarchy

### Part 5: Typography Hierarchy
- Increase names from `text-4xl md:text-5xl lg:text-6xl` to `text-5xl md:text-6xl lg:text-7xl`
- Add better spacing between elements
- Add stronger visual hierarchy

### Part 6: Tagline Styling
- Make it look like a romantic quote
- Use italic styling
- Use softer color (`text-white/70`)
- Center align with readable width (`max-w-md`)
- Add decorative quotes

### Part 7: CTA Buttons
- Add two CTA buttons under tagline:
  - "Start Our Story" → `#love-letter` (scroll to love letter section)
  - "View Our Memories" → `#gallery` (scroll to gallery section)
- Primary button: gradient pink/rose with hover animation
- Secondary button: glassmorphism with transparent background and border

### Part 8: Spacing & Layout Rhythm
- Use consistent vertical spacing with `space-y` utilities
- Ensure calm and elegant feel with proper spacing

### Part 9: Mobile Optimization
- Stack vertically on mobile (image on top, content below)
- Control image height with `h-[40vh]`
- Ensure text remains readable
- Buttons stack properly on mobile

### Part 10: Scroll Indicator
- Add subtle scroll hint at bottom
- Use bounce animation
- Position at bottom of hero section

## Files to Modify

### Primary File
- `components/HomeSection.tsx` - Main hero component with split layout template

### Supporting Files (No changes needed)
- `components/HeroOverlay.tsx` - Already has required CTA components
- `components/LoveLetterSection.tsx` - Already has `id="love-letter"`
- `components/GallerySection.tsx` - Already has `id="gallery"`

## Implementation Order

1. **Modify `renderSplitLayout()` function** in `HomeSection.tsx`:
   - Update container layout (grid, min-h-screen, flex items-center)
   - Remove pt-8 hack
   - Improve left side image presentation with gradient overlay
   - Add max-w-lg to right side content
   - Enhance typography
   - Improve tagline styling
   - Add CTA buttons
   - Add scroll indicator
   - Improve mobile responsiveness

2. **Test the implementation**:
   - Verify all sections work correctly
   - Check mobile responsiveness
   - Verify scrolling works for CTAs

## Expected Outcome
- Romantic, balanced, premium feel
- Split layout feels intentional and elegant
- Proper vertical centering without padding hacks
- Enhanced image presentation with gradient overlay
- Readable content with max-width
- Premium CTA buttons with smooth scrolling
- Mobile-optimized layout
- Subtle scroll indicator

