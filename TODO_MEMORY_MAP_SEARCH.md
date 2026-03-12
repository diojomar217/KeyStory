# Memory Map Location Search Enhancement

## Task: Add map picker/location search autocomplete to Memory Map input

## Steps to Complete:

- [x] STEP 1: Create lib/geocoding.ts - Location search utility using Nominatim API
- [x] STEP 2: Update lib/types.ts - Add optional fields to MemoryMapLocation (address)
- [x] STEP 3: Update components/builder/ContentInputComponents.tsx - Add search + manual modes to MemoryMapInput
- [x] STEP 4: Test backward compatibility (implemented - existing lat/lng data preserved)

## Implementation Notes:

### Geocoding Service
- Using Nominatim (OpenStreetMap) - free, no API key required
- Rate limit: 1 request/second (handled with debounce)
- Returns: place_id, display_name, lat, lon

### MemoryMapInput UX
- Toggle between [🔍 Search Place] and [📍 Enter Coordinates]
- Search mode: debounced input, dropdown results, auto-fill on select
- Manual mode: separate lat/lng number inputs
- Keep backward compatibility with existing data

### Validation
- Ensure locations have valid lat/lng when saved
- Handle partial entries gracefully

