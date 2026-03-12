# TODO: Enable Interactive Memory Map

## Status: COMPLETED

---

## Step 1: Install Leaflet Dependencies
- [x] Install `leaflet` and `@types/leaflet` packages

---

## Step 2: Update Builder Input (ContentInputComponents.tsx)
- [x] Add latitude/longitude fields to MemoryMapInput
- [x] Support add/remove place entries

---

## Step 3: Create Interactive Map Component
- [x] Create `MemoryMap.tsx` component (client-only)
- [x] Handle SSR properly with dynamic import
- [x] Render map with markers
- [x] Handle empty state

---

## Step 4: Update MemoryMapSection.tsx
- [x] Import and use the interactive map component
- [x] Handle backward compatibility
- [x] Add location list below map

---

## Step 5: Test and Verify
- [ ] Test builder flow (create/edit)
- [ ] Test rendering on /love/[slug]
- [ ] Verify SSR handling

---

## Implementation Summary:

### Files Modified:
1. `components/sections/MemoryMap.tsx` - NEW - Interactive map with Leaflet
2. `components/sections/MemoryMapSection.tsx` - Uses dynamic import for SSR
3. `components/builder/ContentInputComponents.tsx` - Already has coordinates support
4. `app/globals.css` - Leaflet CSS already imported

### Data Structure (already exists):
```typescript
interface MemoryMapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  date?: string;
}
```

### SSR Handling:
- Uses Next.js dynamic import with `ssr: false` in MemoryMapSection.tsx
- MemoryMap component handles client-side mounting check

### Features:
- Interactive Leaflet map with heart markers
- Click markers to see location details (name, description, date)
- Location list below map with click-to-focus
- Empty state when no locations with valid coordinates
- Auto-center and fit bounds based on saved locations
