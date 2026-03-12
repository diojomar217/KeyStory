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

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery)}&limit=5&addressdetails=1`,
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
        // Extract a readable name from the result
        let name = item.name;
        if (!name) {
          // Use address components to build a name
          const addressParts = [];
          if (item.address?.city) addressParts.push(item.address.city);
          else if (item.address?.town) addressParts.push(item.address.town);
          else if (item.address?.village) addressParts.push(item.address.village);
          else if (item.address?.county) addressParts.push(item.address.county);
          
          if (item.address?.country) addressParts.push(item.address.country);
          name = addressParts.length > 0 ? addressParts.join(', ') : item.display_name;
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
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
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

    return {
      placeId: data.place_id?.toString() || '',
      name: data.address?.city || data.address?.town || data.address?.village || data.display_name?.split(',')[0] || 'Selected Location',
      displayName: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      type: data.type || 'place',
      address: data.address?.road ? 
        `${data.address.road}, ${data.address.city || data.address.town || ''}`.trim() : 
        undefined,
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

