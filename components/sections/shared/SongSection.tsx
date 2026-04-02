'use client';


import { useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';
import { getThemeColors } from '@/config/themeUtils';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';

interface SongSectionProps {
  theme: ThemeKey;
  songLink?: string;
  autoplay?: boolean;
}

const SongSection = ({ theme, songLink, autoplay }: SongSectionProps) => {


  // Helper function to get theme accent colors
  function getThemeAccents(theme: ThemeKey) {
    switch (theme) {
      case 'dark_elegant':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/30' };
      case 'cute_pastel':
        return { bg: 'bg-purple-100', text: 'text-purple-600', glow: 'shadow-purple-500/20' };
      case 'minimal_modern':
        return { bg: 'bg-slate-100', text: 'text-slate-600', glow: 'shadow-slate-500/20' };
      default:
        return { bg: 'bg-rose-100', text: 'text-rose-600', glow: 'shadow-rose-500/20' };
    }
  }


  const styles = getThemeStyles(theme);
  const themeColors = getThemeColors(theme);
  const accent = getThemeAccents(theme);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!songLink) return null;

  // Use helper function to get embed info
  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink, !!autoplay);

  // Don't render if invalid URL
  if (!isValid || !embedUrl) {
    return (
      <section className={`${styles.sectionBgAlt} py-16 md:py-24 w-full`}>
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <ScrollReveal animation="fade-up">
            {(() => {
              const copy = getSectionCopy('song', siteType);
              return (
                <SectionHeader
                  icon={copy.icon}
                  title={copy.title}
                  subtitle={copy.subtitle}
                  theme={theme}
                />
              );
            })()}
          </ScrollReveal>
          <div className={`${styles.card} ${styles.cardBorder} border rounded-2xl p-6 text-center shadow-xl`}>
            <p className={`${styles.textMuted}`}>Invalid song link. Please provide a valid YouTube or Spotify link.</p>
          </div>
        </div>
      </section>
    );
  }

  // Handle play/pause - Note: Due to iframe limitations, we show the visual effect
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Note: Actual iframe play/pause requires JS API and specific embed URLs
  };

  const isDarkTheme = theme === 'dark_elegant';

  return (
    <section className={`${styles.sectionBgAlt} py-16 md:py-24 w-full`} id="song">
      <div className="max-w-xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('song', siteType);
            return (
              <SectionHeader
                icon={copy.icon}
                title={copy.title}
                subtitle={copy.subtitle}
                theme={theme}
              />
            );
          })()}
        </ScrollReveal>

        {/* Premium Video Container with Waveform Animation */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className={`
            relative overflow-hidden rounded-2xl
            ${styles.card} ${styles.cardBorder} border
            shadow-xl
            shadow-black/10
          `}>
            {/* Decorative top accent line */}
            <div className={`
              absolute top-0 left-0 right-0 h-1
              bg-gradient-to-r ${styles.gradient}
            `} />
            
            {/* Equalizer / Waveform Animation Bar */}
            <div className={`
              absolute top-4 right-4 z-10
              flex items-end gap-1 h-8
              ${isPlaying ? 'opacity-100' : 'opacity-50'}
              transition-opacity duration-300
            `}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-1 rounded-full
                    equalizer-bar
                  `}
                  style={{
                    height: '100%',
                    backgroundColor: themeColors.accent,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button Overlay */}
            <button
              onClick={togglePlayPause}
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                z-10 w-16 h-16 rounded-full
                ${accent.bg} ${accent.text}
                flex items-center justify-center
                shadow-lg ${accent.glow}
                hover:scale-110 transition-transform duration-300
                opacity-0 hover:opacity-100 focus:opacity-100
              `}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
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
              px-4 py-4 flex items-center justify-between
              ${styles.sectionBgAlt}
            `}>
              <span className={`text-sm ${styles.textMuted} flex items-center gap-2`}>
                <span className="opacity-60">🎧</span>
                Put on your headphones and enjoy the melody
              </span>
              
              {/* Now Playing Indicator */}
              <div className={`flex items-center gap-2 ${styles.textMuted}`}>
                <span className={`text-xs ${isPlaying ? 'animate-pulse' : ''}`}>
                  {isPlaying ? '🎶 Playing...' : '⏸️ Paused'}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Decorative elements - Hearts */}
        <div className="flex justify-center gap-2 mt-8">
          <span className={`${styles.accent} opacity-50 text-sm`}>💕</span>
          <span className={`${styles.accent} opacity-35 text-xs`}>💕</span>
          <span className={`${styles.accent} opacity-20 text-sm`}>💕</span>
        </div>
      </div>
    </section>
  );
};

export default SongSection;

