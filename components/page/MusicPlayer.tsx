'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { DEFAULT_THEME } from '@/config/defaults';
import { useTheme } from '../builder/ThemeWrapper';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';

type Props = {
  songLink?: string;
  theme?: ThemeKey;
};

export default function MusicPlayer({ songLink, theme = DEFAULT_THEME }: Props) {
  const styles = useTheme(theme);
  
  if (!songLink) return null;
  
  // Use helper function to get embed info
  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink);

  // Don't render if invalid URL
  if (!isValid || !embedUrl) return null;

  // Determine container style based on provider
  // Spotify uses responsive height, YouTube uses fixed height
  const containerStyle = provider === 'spotify' 
    ? 'relative w-full min-h-[152px] md:min-h-[352px]'
    : 'relative w-full aspect-video';

  return (
    <div className={`${styles.card} rounded-[1.75rem] ${styles.cardBorder} border p-4 shadow-lg animate-fade-in`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🎵</span>
        <span className={`${styles.text} font-medium`}>Our Song</span>
      </div>
      <div className="overflow-hidden rounded-[1.25rem] border border-black/5">
        <div className={containerStyle}>
          <iframe
            src={embedUrl}
            width="100%"
            height={provider === 'spotify' ? '152' : '100%'}
            allow={provider === 'spotify' 
              ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              : "autoplay; encrypted-media"
            }
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full"
            title={`Love Song - ${provider === 'spotify' ? 'Spotify' : 'YouTube'}`}
          />
        </div>
      </div>
    </div>
  );
}

