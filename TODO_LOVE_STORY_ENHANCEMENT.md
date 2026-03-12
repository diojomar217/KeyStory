# Love Story Journey Enhancement - TODO

## Task
Transform the couple website into a smooth romantic storytelling experience with better spacing, transitions, and emotional flow.

## Implementation Steps

### Step 1: Add Scroll Animations & Smooth Scrolling
- [x] 1.1 Add scroll-behavior: smooth to globals.css
- [x] 1.2 Create ScrollReveal component for scroll-triggered animations
- [x] 1.3 Add animation utilities (fade-in-up, stagger delays)

### Step 2: Reorder Sections in LovePageClient
- [x] 2.1 Change order to: Hero → LoveLetter → Timeline → Gallery → Song
- [x] 2.2 Add consistent section wrapper with py-24 md:py-32 spacing
- [x] 2.3 Add max-w-5xl mx-auto px-6 for content centering

### Step 3: Create SectionHeader Component
- [x] 3.1 Create reusable SectionHeader component
- [x] 3.2 Format: Icon + Title + Subtitle

### Step 4: Enhance LoveLetterSection
- [x] 4.1 Use SectionHeader for consistent headers
- [x] 4.2 Enhance card styling with glassmorphism
- [x] 4.3 Keep typing animation

### Step 5: Enhance TimelineSection
- [x] 5.1 Use SectionHeader for header
- [x] 5.2 Add vertical line timeline
- [x] 5.3 Add date badges and icons/hearts
- [x] 5.4 Improve spacing between events

### Step 6: Enhance GallerySection
- [x] 6.1 Use SectionHeader for header
- [x] 6.2 Add subtle hover zoom effect
- [x] 6.3 Add rounded image cards with soft shadows

### Step 7: Enhance SongSection
- [x] 7.1 Use SectionHeader for header
- [x] 7.2 Change max-w to max-w-xl
- [x] 7.3 Add "Put on your headphones" helper text

### Step 8: Add Back to Top Button
- [x] 8.1 Create BackToTop floating button component
- [x] 8.2 Position fixed bottom-right
- [x] 8.3 Smooth scroll to top on click

### Step 9: Mobile Optimization
- [x] 9.1 Ensure sections stack cleanly on mobile
- [x] 9.2 Reduce padding on mobile
- [x] 9.3 Maintain readable spacing

## Files Modified/Created
1. ✅ app/globals.css - Added scroll-behavior and animations
2. ✅ components/ScrollReveal.tsx - NEW - Scroll animation component
3. ✅ components/SectionHeader.tsx - NEW - Reusable section header
4. ✅ components/BackToTop.tsx - NEW - Floating back to top button
5. ✅ components/LovePageClient.tsx - Reordered sections and added BackToTop
6. ✅ components/LoveLetterSection.tsx - Used SectionHeader, enhanced styling
7. ✅ components/TimelineSection.tsx - Used SectionHeader, enhanced timeline
8. ✅ components/GallerySection.tsx - Used SectionHeader, enhanced gallery
9. ✅ components/SongSection.tsx - Used SectionHeader, enhanced music player

## Expected Result ✅ COMPLETE
The page should feel like a romantic story journey where users scroll through meaningful moments instead of seeing disconnected blocks.

