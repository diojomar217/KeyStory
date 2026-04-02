'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';

interface VideoMemory {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
}

interface VideoMemoriesSectionProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  videos?: VideoMemory[];
}

export default function VideoMemoriesSection({ theme, siteType, videos = [] }: VideoMemoriesSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);

  // Extract YouTube/Vimeo ID from URL
  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  if (videos.length === 0) {
    return (
      <section 
        id="video-memories"
        className={`relative ${spacingClass}`}
      >
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionHeader
              icon={siteType === 'birthday' ? '🎬' : '🎬'}
              title={siteType === 'birthday' ? 'Birthday Videos' : 'Video Memories'}
              subtitle={siteType === 'birthday' ? 'Special birthday moments on video' : 'Relive your most precious moments together'}
              theme={theme}
            />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div
              className={`text-center p-12 border ${cardStyle} ${shadowClass}`}
              style={{
                backgroundColor: themeUtils.colors.card,
                borderColor: themeUtils.colors.border,
              }}
            >
              <p style={{ color: themeUtils.colors.text }}>
                Add your favorite video memories to share special moments together.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="video-memories"
      className={spacingClass}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            icon={siteType === 'birthday' ? '🎬' : '🎬'}
            title={siteType === 'birthday' ? 'Birthday Videos' : 'Video Memories'}
            subtitle={siteType === 'birthday' ? 'Special birthday moments on video' : 'Relive your most precious moments together'}
            theme={theme}
          />
        </ScrollReveal>
        
        <div className="grid gap-8">
          {videos.map((video: VideoMemory, index: number) => (
            <ScrollReveal key={video.id} delay={index * 100}>
              <div
                className={`overflow-hidden border ${cardStyle} ${shadowClass}`}
                style={{
                  backgroundColor: themeUtils.colors.card,
                  borderColor: themeUtils.colors.border,
                }}
              >
                <div className="aspect-video">
                  <iframe
                    src={getEmbedUrl(video.url)}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {(video.title || video.description) && (
                  <div className="p-6">
                    {video.title && (
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{
                          color: themeUtils.colors.primary,
                          fontFamily: themeUtils.typography.headingFont,
                        }}
                      >
                        {video.title}
                      </h3>
                    )}
                    {video.description && (
                      <p style={{ color: themeUtils.colors.text }}>{video.description}</p>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

