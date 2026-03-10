'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';

type Props = {
  theme: Theme;
  songLink?: string;
};

// Theme-specific accent colors for the music icon
const themeAccents: Record<Theme, { bg: string; text: string; glow: string }> = {
  romantic_classic: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    glow: 'shadow-rose-500/20',
  },
  cute_pastel: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    glow: 'shadow-purple-500/20',
  },
  minimal_modern: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    glow: 'shadow-slate-500/20',
  },
  dark_elegant: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/30',
  },
};

export default function SongSection({ theme, songLink }: Props) {
  const styles = useTheme(theme);
  const accent = themeAccents[theme] || themeAccents.romantic_classic;

  if (!songLink) return null;

  // Use helper function to get embed info
  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink);

  // Don't render if invalid URL
  if (!isValid || !embedUrl) {
    return (
      <section className={`${styles.sectionBgAlt} py-12 md:py-16 w-full`}>
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${accent.bg} ${accent.glow} shadow-lg mb-4`}>
              <span className={`text-2xl ${accent.text}`}>🎵</span>
            </div>
            <h2 className={`${styles.heading} text-2xl md:text-3xl font-semibold ${styles.text} mb-2`}>
              Our Song
            </h2>
            <p className={`text-sm md:text-base ${styles.textMuted} max-w-md mx-auto`}>
              A song that reminds us of our favorite moments together
            </p>
          </div>
          <div className={`${styles.card} ${styles.cardBorder} border rounded-2xl p-8 text-center shadow-xl`}>
            <p className={`${styles.textMuted}`}>Invalid song link. Please provide a valid YouTube or Spotify link.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.sectionBgAlt} py-12 md:py-16 w-full`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header - Elegant & Balanced */}
        <div className="text-center mb-8">
          {/* Icon Container - Premium styling with glow effect */}
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${accent.bg} ${accent.glow} shadow-lg mb-4`}>
            <span className={`text-2xl ${accent.text}`}>🎵</span>
          </div>
          
          {/* Refined Heading */}
          <h2 className={`${styles.heading} text-2xl md:text-3xl font-semibold ${styles.text} mb-2`}>
            Our Song
          </h2>
          
          {/* Elegant Subtitle */}
          <p className={`text-sm md:text-base ${styles.textMuted} max-w-md mx-auto`}>
            A song that reminds us of our favorite moments together
          </p>
        </div>

        {/* Premium Video Container - Polished Frame */}
        <div className={`
          relative overflow-hidden rounded-2xl
          ${styles.card} ${styles.cardBorder} border
          shadow-xl
          ${theme === 'dark_elegant' ? 'shadow-amber-500/10' : 'shadow-rose-500/10'}
        `}>
          {/* Decorative top accent line */}
          <div className={`
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r ${styles.gradient}
          `} />
          
          {/* Responsive container - 16:9 for YouTube, auto height for Spotify */}
          <div className={provider === 'spotify' ? 'relative w-full h-[152px] md:h-[352px]' : 'relative w-full aspect-video'}>
            <iframe
              src={embedUrl}
              allow={provider === 'spotify' 
                ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              }
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute top-0 left-0 w-full h-full rounded-t-xl"
              title={`Our Song - ${provider === 'spotify' ? 'Spotify' : 'YouTube'} Player`}
            />
          </div>
          
          {/* Subtle bottom accent */}
          <div className={`
            px-4 py-3 flex items-center justify-center
            ${styles.sectionBgAlt}
          `}>
            <span className={`text-xs ${styles.textMuted} flex items-center gap-2`}>
              <span className="opacity-60">🎧</span>
              Put on your headphones and enjoy the melody
            </span>
          </div>
        </div>

        {/* Decorative elements - Hearts */}
        <div className="flex justify-center gap-2 mt-6">
          <span className="text-rose-300/50 text-sm">💕</span>
          <span className="text-rose-300/30 text-xs">💕</span>
          <span className="text-rose-300/20 text-sm">💕</span>
        </div>
      </div>
    </section>
  );
}

