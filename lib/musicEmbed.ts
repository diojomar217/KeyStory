/**
 * Music Embed Helper
 * Converts music URLs (YouTube, Spotify) to embed URLs for iframe embedding
 */

export type MusicProvider = 'youtube' | 'spotify' | null;

export interface MusicEmbedInfo {
  provider: MusicProvider;
  embedUrl: string | null;
  isValid: boolean;
}

/**
 * Extracts the Spotify resource ID from a URL
 * @param url - Spotify URL like https://open.spotify.com/track/7acJdyRgw4cGLL8W42DAra
 * @returns Object with type (track|album|playlist) and id
 */
function extractSpotifyId(url: string): { type: 'track' | 'album' | 'playlist'; id: string } | null {
  const patterns = [
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/album\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
  ];

  const types: Array<'track' | 'album' | 'playlist'> = ['track', 'album', 'playlist'];

  for (let i = 0; i < patterns.length; i++) {
    const match = url.match(patterns[i]);
    if (match && match[1]) {
      return { type: types[i], id: match[1] };
    }
  }

  return null;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL
 * @returns Video ID or null
 */
function extractYouTubeId(url: string): string | null {
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return null;
}

/**
 * Detects the music provider and converts the URL to an embed URL
 * @param songLink - The original song URL (YouTube or Spotify)
 * @returns MusicEmbedInfo with provider type and embed URL
 */
export function getMusicEmbedInfo(songLink: string): MusicEmbedInfo {
  if (!songLink) {
    return { provider: null, embedUrl: null, isValid: false };
  }

  const trimmedLink = songLink.trim();

  // Check for Spotify
  if (trimmedLink.includes('open.spotify.com')) {
    const spotifyInfo = extractSpotifyId(trimmedLink);
    
    if (spotifyInfo) {
      const embedUrl = `https://open.spotify.com/embed/${spotifyInfo.type}/${spotifyInfo.id}?utm_source=generator&theme=0`;
      return {
        provider: 'spotify',
        embedUrl,
        isValid: true,
      };
    }

    // If Spotify URL but couldn't parse, return invalid
    return { provider: 'spotify', embedUrl: null, isValid: false };
  }

  // Check for YouTube
  if (trimmedLink.includes('youtube.com') || trimmedLink.includes('youtu.be')) {
    const videoId = extractYouTubeId(trimmedLink);

    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      return {
        provider: 'youtube',
        embedUrl,
        isValid: true,
      };
    }

    // If YouTube URL but couldn't parse, return invalid
    return { provider: 'youtube', embedUrl: null, isValid: false };
  }

  // Unknown provider
  return { provider: null, embedUrl: null, isValid: false };
}

