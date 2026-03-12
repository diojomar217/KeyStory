# Hero Enhancement Plan

## Objective
Enhance the hero section and love message flow of the couple website:
- Make the hero cleaner with a short tagline instead of long message
- Add a separate Love Letter section with typing animation
- Improve background image readability with better overlays

---

## Plan

### 1. Update TypeScript Types (`lib/types.ts`)
- Add `tagline?: string` to `SiteConfig` interface
- Update `CreateOrderPayload` to include tagline

### 2. Update Order API (`app/api/order/route.ts`)
- Accept tagline in request body
- Save tagline to config

### 3. Update Create Website Form (`app/admin/websites/create/page.tsx`)
- Add tagline input field in Step 1 (Basic Information)
- Add helper text explaining it's for hero section
- Recommended max length: 120 characters
- Update validation to include tagline

### 4. Update Love Page Route (`app/love/[slug]/page.tsx`)
- Extract tagline from config
- Pass tagline to LovePageClient

### 5. Update LovePageClient (`components/LovePageClient.tsx`)
- Add tagline prop
- Pass tagline to HomeSection
- Add new LoveLetterSection component below the hero

### 6. Create Typing Animation Component (`components/TypingText.tsx`)
- Create reusable typing animation component
- Smooth and elegant speed
- Reveal text progressively

### 7. Create Love Letter Section (`components/LoveLetterSection.tsx`)
- Elegant centered layout
- Section title: "Love Letter" or "A Message From My Heart"
- Premium romantic styling
- Use typing animation for the message
- Readable width (max-w-3xl or max-w-4xl)
- Premium soft card styling

### 8. Update HomeSection (`components/HomeSection.tsx`)
- Accept tagline prop
- Update all 3 templates to:
  - Show tagline instead of full message
  - Add proper background overlay for fullscreen_banner template
  - Fix scroll indicator position (bottom center)
  - Improve text readability

### 9. Update HeroOverlay (`components/HeroOverlay.tsx`)
- Add stronger gradient overlays for better text readability
- Lighter dark gradient near top
- Stronger dark gradient near bottom

### 10. Update ThemeWrapper (if needed)
- Add additional overlay styles if needed

---

## Implementation Order

1. ✅ lib/types.ts - Add tagline to types
2. ✅ app/api/order/route.ts - Accept and save tagline
3. ✅ app/admin/websites/create/page.tsx - Add tagline input field
4. ✅ app/love/[slug]/page.tsx - Pass tagline to client
5. ✅ components/TypingText.tsx - NEW: Create typing animation
6. ✅ components/LoveLetterSection.tsx - NEW: Create love letter section
7. ✅ components/LovePageClient.tsx - Add tagline prop and render LoveLetterSection
8. ✅ components/HomeSection.tsx - Update hero to use tagline
9. ✅ components/HeroOverlay.tsx - Enhance overlays

---

## Dependent Files to Edit

1. `lib/types.ts` - Add tagline type
2. `app/api/order/route.ts` - Save tagline
3. `app/admin/websites/create/page.tsx` - Add tagline input
4. `app/love/[slug]/page.tsx` - Pass tagline
5. `components/TypingText.tsx` - NEW FILE
6. `components/LoveLetterSection.tsx` - NEW FILE
7. `components/LovePageClient.tsx` - Use tagline and new section
8. `components/HomeSection.tsx` - Show tagline in hero
9. `components/HeroOverlay.tsx` - Better overlays

---

## Followup Steps

After implementing changes:
1. Test the website creation flow with the new tagline field
2. Verify the hero displays the tagline correctly
3. Verify the Love Letter section appears below the hero
4. Verify the typing animation works smoothly
5. Test on mobile devices
6. Test all three hero templates

