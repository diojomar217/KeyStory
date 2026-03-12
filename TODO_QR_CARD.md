# QR Card Enhancement Plan

## Information Gathered

### Project Context
- Next.js App Router + TypeScript + Tailwind CSS
- QR codes generated using `qrcode` library and styled with `qr-code-styling`
- Theme system with 4 themes: romantic_classic, cute_pastel, minimal_modern, dark_elegant
- Website data stored in Supabase with fields: customer_name, partner_name, anniversary_date, qr_code_url, config (theme, qr_data_url)
- Existing QRSection and MemoryCardSection components for QR display
- Admin sidebar already exists with navigation

### Key Files Analyzed
- `components/QRSection.tsx` - Current QR display component
- `components/product/MemoryCardSection.tsx` - Premium card design reference
- `components/ThemeWrapper.tsx` - Theme styles system
- `lib/supabase.ts` - Order type definition
- `app/love/[slug]/page.tsx` - How QR data is passed to components
- `components/admin/WebsiteActions.tsx` - Action buttons on websites table
- `app/admin/websites/page.tsx` - Websites list page

## Plan

### Step 1: Create Printable QR Card Page
- Route: `/admin/websites/[id]/qr-card`
- Fetch website data by ID
- Display printable QR card with theme adaptation

### Step 2: Create Reusable QR Card Component
- `components/product/QRCard.tsx` - Main card with:
  - Couple names (top)
  - QR code (middle, centered with frame)
  - Scan instruction text (below QR)
  - Romantic tagline/caption (bottom)
  - Theme-aware styling
  - Support for multiple layout options

### Step 3: Create Printable Layout Component
- `components/product/PrintableCardLayout.tsx` - Wrapper with:
  - Centered card on page
  - Print-specific styles (white background, no UI)
  - Proper sizing for print

### Step 4: Create Print Actions Component
- `components/product/PrintActions.tsx` - Buttons for:
  - Print Card (triggers window.print())
  - Download QR (existing functionality)

### Step 5: Add Print Styles
- Add print-specific CSS to `app/globals.css`
- Hide admin UI when printing
- Ensure proper page breaks and sizing

### Step 6: Update Admin Integration
- Add "View QR Card" button to WebsiteActions
- Add "Print QR Card" button to WebsiteActions

### Step 7: Add Decorative Elements
- Heart icon accent
- Elegant divider lines
- Subtle border styling
- Optional romantic captions

## Files to Create
1. `app/admin/websites/[id]/qr-card/page.tsx` - Printable QR card page
2. `components/product/QRCard.tsx` - Main QR card component
3. `components/product/PrintableCardLayout.tsx` - Print layout wrapper
4. `components/product/PrintActions.tsx` - Print/download actions

## Files to Modify
1. `components/admin/WebsiteActions.tsx` - Add QR card actions
2. `app/globals.css` - Add print styles
3. `lib/types.ts` - Add QR card layout type if needed

## Dependent Files
- `lib/supabase.ts` - Order type (existing)
- `components/ThemeWrapper.tsx` - Theme styles (existing)
- `lib/qrcode.ts` - QR generation (existing)

## Follow-up Steps
1. Test print functionality
2. Verify QR scanning works on printed version
3. Test with different themes
4. Verify mobile responsiveness

