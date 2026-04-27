'use client';

import { useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType, SectionAsset } from '@/lib/types';
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
  assets?: SectionAsset;
}

export default function VideoMemoriesSection({ theme, siteType, videos = [] }: VideoMemoriesSectionProps) {
  const themeUtils = useThemeUtils(theme);
  const { colors } = themeUtils;
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const [loadedVideos, setLoadedVideos] = useState<Record<string, boolean>>({});

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
                className={`overflow-hidden rounded-[2rem] border ${shadowClass}`}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div className="px-5 pt-5 pb-3">
                  <div
                    className="relative overflow-hidden rounded-[1.5rem] border"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <div className="relative aspect-video">
                      {!loadedVideos[video.id] && (
                        <div className="absolute inset-0 premium-loading-shell premium-skeleton" aria-hidden="true">
                          <div className="premium-skeleton-overlay" />
                        </div>
                      )}
                      <iframe
                        src={getEmbedUrl(video.url)}
                        title={video.title}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${loadedVideos[video.id] ? 'opacity-100' : 'opacity-0'}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => {
                          setLoadedVideos((prev) => ({
                            ...prev,
                            [video.id]: true,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                {(video.title || video.description) && (
                  <div className="p-6">
                    {video.title && (
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{
                          color: colors.primary,
                          fontFamily: themeUtils.typography.headingFont,
                        }}
                      >
                        {video.title}
                      </h3>
                    )}
                    {video.description && (
                      <p style={{ color: colors.text }}>{video.description}</p>
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

