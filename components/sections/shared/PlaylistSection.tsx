'use client';

import { Theme } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { useTheme } from '../../builder/ThemeWrapper';
import { THEME_PRESETS } from '@/lib/builder-constants';

interface PlaylistSectionProps {
  theme: Theme;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
  songLink?: string;
}

export default function PlaylistSection({ theme, siteType = 'couple', songLink }: PlaylistSectionProps) {
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
      id="playlist"
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          icon={siteType === 'birthday' ? '🎵' : '🎶'}
          title={siteType === 'birthday' ? 'Birthday Playlist' : 'Our Playlist'}
          subtitle={siteType === 'birthday' ? 'Tunes to celebrate the day' : 'Songs that define our relationship'}
          theme={theme}
        />
        
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

