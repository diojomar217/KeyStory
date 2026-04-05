'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import { getMusicEmbedInfo } from '@/lib/musicEmbed';
import SectionHeader from '../../page/SectionHeader';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface PlaylistSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  songLink?: string;
  autoplay?: boolean;
  sectionId?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
}

export default function PlaylistSection({
  theme,
  siteType = 'couple',
  songLink,
  autoplay = false,
  sectionId = 'playlist',
  icon,
  title,
  subtitle,
}: PlaylistSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  if (!songLink) {
    return null;
  }

  const { provider, embedUrl, isValid } = getMusicEmbedInfo(songLink, autoplay);
  if (!isValid || !embedUrl) {
    return null;
  }

  const mediaFrameClass = provider === 'spotify'
    ? 'relative w-full min-h-[152px] md:min-h-[352px]'
    : 'relative w-full aspect-video';

  return (
    <section
      id={sectionId}
      className={spacingClass}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            icon={icon || (siteType === 'birthday' ? '🎵' : '🎶')}
            title={title || (siteType === 'birthday' ? 'Birthday Playlist' : 'Our Playlist')}
            subtitle={subtitle || (siteType === 'birthday' ? 'Tunes to celebrate the day' : 'Songs that define our relationship')}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div
            className={`overflow-hidden rounded-[2.25rem] border ${shadowClass}`}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px',
              color: colors.text,
              boxShadow: `0 0 0 1px ${colors.primary}18`,
            }}
          >
            <div className="p-5 md:p-6">
              <div
                className="overflow-hidden rounded-[1.75rem] border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                }}
              >
                <div className={mediaFrameClass}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full"
                    allow={provider === 'spotify'
                      ? 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                      : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={siteType === 'birthday' ? 'Birthday Playlist' : 'Our Playlist'}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

