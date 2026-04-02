'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface PlaylistSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  songLink?: string;
}

export default function PlaylistSection({ theme, siteType = 'couple', songLink }: PlaylistSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

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
      className={spacingClass}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            icon={siteType === 'birthday' ? '🎵' : '🎶'}
            title={siteType === 'birthday' ? 'Birthday Playlist' : 'Our Playlist'}
            subtitle={siteType === 'birthday' ? 'Tunes to celebrate the day' : 'Songs that define our relationship'}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div
            className={`overflow-hidden border ${cardStyle} ${shadowClass}`}
            style={{
              backgroundColor: themeUtils.colors.card,
              borderColor: themeUtils.colors.border,
              borderWidth: '1px',
              color: themeUtils.colors.text,
              boxShadow: `0 0 0 1px ${themeUtils.colors.primary}22`,
            }}
          >
            <iframe
              src={getEmbedUrl(songLink)}
              className="w-full h-96"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

