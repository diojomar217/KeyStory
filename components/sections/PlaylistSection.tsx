'use client';

import { Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface PlaylistSectionProps {
  theme: Theme;
  songLink?: string;
}

export default function PlaylistSection({ theme, songLink }: PlaylistSectionProps) {
  const themeConfig = THEME_PRESETS[theme];
  const { colors, typography } = themeConfig;

  const getEmbedUrl = (url: string) => {
    // Spotify
    const spotifyMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      return `https://open.spotify.com/embed/track/${spotifyMatch[1]}?utm_source=generator&theme=0`;
    }
    const spotifyPlaylistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    if (spotifyPlaylistMatch) {
      return `https://open.spotify.com/embed/playlist/${spotifyPlaylistMatch[1]}?utm_source=generator&theme=0`;
    }
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    return url;
  };

  if (!songLink) {
    return null;
  }

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-8"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🎶 Our Playlist
        </h2>
        
        <p 
          className="text-center mb-8"
          style={{ color: colors.text }}
        >
          Songs that define our relationship
        </p>
        
        <div 
          className="rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: '1px'
          }}
        >
          <iframe
            src={getEmbedUrl(songLink)}
            className="w-full h-96"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

