   'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';

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
      <section className={`${styles.sectionBgAlt} py-16 md:py-24 w-full`}>
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <ScrollReveal animation="fade-up">
            <SectionHeader
              icon="🎵"
              title="Our Song"
              subtitle="A song that reminds us of our favorite moments together"
              theme={theme}
            />
          </ScrollReveal>
          <div className={`${styles.card} ${styles.cardBorder} border rounded-2xl p-6 text-center shadow-xl`}>
            <p className={`${styles.textMuted}`}>Invalid song link. Please provide a valid YouTube or Spotify link.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.sectionBgAlt} py-16 md:py-24 w-full`}>
      <div className="max-w-xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="🎵"
            title="Our Song"
            subtitle="A song that reminds us of our favorite moments together"
            theme={theme}
          />
        </ScrollReveal>

        {/* Premium Video Container */}
        <ScrollReveal animation="fade-up" delay={150}>
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
            
            {/* Subtle bottom accent with helper text */}
            <div className={`
              px-4 py-4 flex items-center justify-center
              ${styles.sectionBgAlt}
            `}>
              <span className={`text-sm ${styles.textMuted} flex items-center gap-2`}>
                <span className="opacity-60">🎧</span>
                Put on your headphones and enjoy the melody
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Decorative elements - Hearts */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="text-rose-300/50 text-sm">💕</span>
          <span className="text-rose-300/30 text-xs">💕</span>
          <span className="text-rose-300/20 text-sm">💕</span>
        </div>
      </div>
    </section>
  );
}

