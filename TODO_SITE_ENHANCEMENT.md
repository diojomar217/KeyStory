# Site/[slug] Visual Enhancements - Priority Order

✅ **Plan Approved** - Hero + global polish first

## Phase 1: Hero & Global Polish (High Impact)
- [x] 1. Enhance app/globals.css: Add parallax keyframes, section progress nav styles, improved mobile typography  
- [x] 5. Create components/ui/SectionProgressNav.tsx: Sticky dots with active states (framer-motion installed)
- [ ] 2. components/page/HomeSection.tsx: Add JS parallax BG, particle canvas overlay, typewriter name reveal
- [ 

## Phase 2: Section Perfection
- [x] 9. components/page/SectionHeader.tsx: Reduced title sizes for premium elegance (4xl-6xl, subtitles xl)
- [ ] 4. components/page/SectionLayouts.tsx: Glassmorphism v2 (neubrut/minimal alt), theme glows, mobile hovers
- [x] 5. Create components/ui/SectionProgressNav.tsx: Sticky dots with active states

## Phase 3: Performance & UX
- [ ] 6. app/site/[slug]/page.tsx: Dynamic OG images, loading skeletons
- [ ] 7. Optimize images: Cloudinary params in lib/cloudinary.ts
- [ ] 8. Test: npm run dev, check mobile/lighthouse

## Commands:
```
npm run dev
# Test at http://localhost:3000/site/[test-slug]
npx lighthouse http://localhost:3000/site/[test-slug] --view
```

Progress: 2/8 complete

