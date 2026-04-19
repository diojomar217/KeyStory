// lib/geocoding.ts
// ============================================
// GEOCODING SERVICE - Location search using Nominatim (OpenStreetMap)
// ============================================
// Free, no API key required - safe for Vercel deployment
// Rate limit: 1 request per second (handled by debounce in UI)

export interface SearchResult {
  placeId: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  address?: string;
}

export interface GeocodingError {
  error: string;
}

// Parse coordinates from a Google Maps URL or a plain lat,lng pair in the query.
function parseCoordinatesFromQuery(q: string): { lat: number; lng: number } | null {
  if (!q) return null;

  // Pattern: !3d{lat}!4d{lng}
  let m = q.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (m) {
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Pattern: @lat,lng (common in Google Maps URLs)
  m = q.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (m) {
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Generic coordinate pair like "15.1954095, 120.5821143"
  m = q.match(/\b(-?\d{1,3}\.\d+)\s*,?\s*(-?\d{1,3}\.\d+)\b/);
  if (m) {
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

/**
 * Search for places using Nominatim (OpenStreetMap)
 * @param query - Search query string
 * @returns Promise<SearchResult[]> - Array of search results
 */
export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();

  // If the query contains a Google Maps URL or a direct coordinate pair,
  // parse coordinates and return the reverse-geocoded location as a single
  // search result. This lets users paste Google Maps links directly.
  try {
    const coords = parseCoordinatesFromQuery(trimmedQuery);
    if (coords && isValidCoordinates(coords.lat, coords.lng)) {
      const rev = await reverseGeocode(coords.lat, coords.lng);
      if (rev) return [rev];
      // If reverse didn't return anything, fall through to normal search
    }
  } catch (e) {
    // ignore and continue with string-based search
  }

  try {
    // Request namedetails and extratags to surface POI names and alternate names
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery)}&limit=7&addressdetails=1&namedetails=1&extratags=1`,
      {
        headers: {
          // Nominatim requires a User-Agent header
          'User-Agent': 'Keystory-LoveStoryBuilder/1.0',
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Transform API response to our format
    const results: SearchResult[] = data
      .filter((item: any) => item.lat && item.lon)
      .map((item: any) => {
        // Extract a readable name from the result. Prefer explicit namedetails
        // (POI/name variants) when available, then the `name` property, then
        // fall back to the first segment of display_name.
        const displayPrimary = (item.display_name || '').split(',')[0].trim();
        const namedetailName = item.namedetails?.name || item.namedetails?.['name:en'] || item.namedetails?.['name:en_US'];
        let name = namedetailName || item.name || displayPrimary || item.display_name;

        // If item.name exists but is just the road or city (e.g., "Arenal Lane"),
        // prefer the more descriptive display primary or namedetail.
        try {
          const road = (item.address?.road || '').toLowerCase();
          const city = (item.address?.city || item.address?.town || item.address?.village || '').toLowerCase();
          const rawName = (item.name || '').toLowerCase();
          if (rawName && (rawName === road || rawName === city)) {
            if (namedetailName) name = namedetailName;
            else if (displayPrimary) name = displayPrimary;
          }
        } catch (e) {
          // ignore and keep fallback name
        }

        // Build a formatted address string
        const addressParts = [];
        if (item.address?.road) addressParts.push(item.address.road);
        if (item.address?.city || item.address?.town) addressParts.push(item.address.city || item.address.town);
        if (item.address?.country) addressParts.push(item.address.country);
        const address = addressParts.length > 0 ? addressParts.join(', ') : undefined;

        return {
          placeId: item.place_id.toString(),
          name,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type || 'place',
          address,
        };
      });

    return results;
  } catch (error) {
    console.error('Geocoding search error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise<SearchResult | null>
 */
export async function reverseGeocode(lat: number, lng: number): Promise<SearchResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&namedetails=1`,
      {
        headers: {
          'User-Agent': 'Keystory-LoveStoryBuilder/1.0',
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || !data.lat || !data.lon) {
      return null;
    }

    // Prefer an explicit name if provided by the reverse endpoint (POI),
    // then namedetails, then fall back to the first segment of display_name.
    const displayPrimary = (data.display_name || '').split(',')[0].trim();
    let name = data.name || (data.namedetails && data.namedetails.name) || displayPrimary || 'Selected Location';

    // If the address contains a POI-like field, prefer that (amenity, tourism, building, etc.)
    try {
      const poiFields = ['place_of_worship', 'amenity', 'tourism', 'building', 'attraction', 'historic', 'leisure', 'shop'];
      for (const key of poiFields) {
        if (data.address && data.address[key]) {
          name = data.address[key];
          break;
        }
      }
    } catch (e) {
      // ignore
    }

    const addressParts: string[] = [];
    if (data.address?.road) addressParts.push(data.address.road);
    if (data.address?.suburb) addressParts.push(data.address.suburb);
    if (data.address?.city || data.address?.town || data.address?.village) addressParts.push(data.address.city || data.address.town || data.address.village);
    if (data.address?.country) addressParts.push(data.address.country);
    const address = addressParts.length > 0 ? addressParts.join(', ') : undefined;

    return {
      placeId: data.place_id?.toString() || '',
      name,
      displayName: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      type: data.type || 'place',
      address,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Validate if coordinates are within valid ranges
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

