'use client';


import { useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import {
  getCardStyleClasses,
  getShadowClass,
  getSectionSpacingClass,
  getHeadingFontClass,
} from '@/lib/theme-color-helpers';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import type { SiteAnalyticsEventType } from '@/lib/types';

interface SongSectionProps {
  theme: ThemeKey;
  songLink?: string;
  autoplay?: boolean;
  onTrackEvent?: (eventType: SiteAnalyticsEventType, source: string, dedupeKey?: string) => void;
}

const SongSection = ({ theme, songLink, autoplay, onTrackEvent }: SongSectionProps) => {
  const themeUtils = useThemeUtils(theme);
  const { colors, styles } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false);

  if (!songLink) return null;

  // Use helper function to get embed info
  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink, !!autoplay);

  // Don't render if invalid URL
  if (!isValid || !embedUrl) {
    return (
      <section className={`${styles.sectionBgAlt} ${spacingClass} w-full`}>
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <ScrollReveal animation="fade-up">
            {(() => {
              const copy = getSectionCopy('song');
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
          <ScrollReveal animation="fade-up" delay={120}>
            <div
              className={`${styles.card} ${styles.cardBorder} ${cardStyle} ${shadowClass} border p-6 text-center`}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              <p style={{ color: colors.text }}>Invalid song link. Please provide a valid YouTube or Spotify link.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // Handle play/pause - Note: Due to iframe limitations, we show the visual effect
  const togglePlayPause = () => {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
    if (nextIsPlaying) {
      onTrackEvent?.('music_play', provider === 'spotify' ? 'song:spotify' : 'song:youtube', 'music_play');
    }
    // Note: Actual iframe play/pause requires JS API and specific embed URLs
  };

  return (
    <section className={`${styles.sectionBgAlt} ${spacingClass} w-full`} id="song">
      <div className="max-w-xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('song');
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
            ${styles.card} ${styles.cardBorder} ${cardStyle} ${shadowClass} border
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
                    backgroundColor: colors.accent,
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
                flex items-center justify-center
                hover:scale-110 transition-transform duration-300
                opacity-0 hover:opacity-100 focus:opacity-100
              `}
              style={{
                backgroundColor: colors.card,
                color: colors.primary,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 10px 24px color-mix(in srgb, ${colors.primary} 30%, transparent)`,
              }}
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
              {!isEmbedLoaded && (
                <div className="absolute inset-0 premium-loading-shell premium-skeleton" aria-hidden="true">
                  <div className="premium-skeleton-overlay" />
                </div>
              )}
              <iframe
                src={embedUrl}
                allow={provider === 'spotify' 
                  ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                }
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={`absolute top-0 left-0 w-full h-full rounded-t-xl transition-opacity duration-300 ${isEmbedLoaded ? 'opacity-100' : 'opacity-0'}`}
                title={`Our Song - ${provider === 'spotify' ? 'Spotify' : 'YouTube'} Player`}
                onLoad={() => setIsEmbedLoaded(true)}
              />
            </div>
            
            {/* Subtle bottom accent with helper text */}
            <div className={`
              px-4 py-4 flex items-center justify-between
              ${styles.sectionBgAlt}
            `} style={{ borderTop: `1px solid ${colors.border}` }}>
              <span className="text-sm flex items-center gap-2" style={{ color: colors.text }}>
                <span className="opacity-60">🎧</span>
                Put on your headphones and enjoy the melody
              </span>
              
              {/* Now Playing Indicator */}
              <div className="flex items-center gap-2" style={{ color: colors.text }}>
                <span className={`text-xs ${headingFontClass} ${isPlaying ? 'animate-pulse' : ''}`}>
                  {isPlaying ? '🎶 Playing...' : '⏸️ Paused'}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Decorative elements - Hearts */}
        <ScrollReveal animation="fade" delay={220}>
          <div className="flex justify-center gap-2 mt-8">
            <span className="opacity-50 text-sm" style={{ color: colors.accent }}>💕</span>
            <span className="opacity-35 text-xs" style={{ color: colors.accent }}>💕</span>
            <span className="opacity-20 text-sm" style={{ color: colors.accent }}>💕</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SongSection;

