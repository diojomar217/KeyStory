'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import SectionHeader from '../../page/SectionHeader';
import { getThemeStyles } from '@/config/themeStyles';
import { THEME_CONFIG } from '@/config/themeConfig';

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
  const styles = getThemeStyles(theme);
  const themeConfig = THEME_CONFIG[theme];
  const { colors, typography } = themeConfig;

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
        className="relative py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
        <SectionHeader
          icon={siteType === 'birthday' ? '🎬' : '🎬'}
          title={siteType === 'birthday' ? 'Birthday Videos' : 'Video Memories'}
          subtitle={siteType === 'birthday' ? 'Special birthday moments on video' : 'Relive your most precious moments together'}
          theme={theme}
        />
          <div 
            className="text-center p-12 rounded-2xl"
            style={{ 
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: '1px'
            }}
          >
            <p style={{ color: colors.text }}>
              Add your favorite video memories to share special moments together.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="video-memories"
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          icon={siteType === 'birthday' ? '🎬' : '🎬'}
          title={siteType === 'birthday' ? 'Birthday Videos' : 'Video Memories'}
          subtitle={siteType === 'birthday' ? 'Special birthday moments on video' : 'Relive your most precious moments together'}
          theme={theme}
        />
        
        <div className="grid gap-8">
          {videos.map((video: VideoMemory) => (
            <div
              key={video.id}
              className="rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: '1px'
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
                        color: colors.primary,
                        fontFamily: typography.headingFont
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
          ))}
        </div>
      </div>
    </section>
  );
}

