'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { THEME_CONFIG } from '@/config/themeConfig';

interface PolaroidGallerySectionProps {
  theme: ThemeKey;
  photos: string[];
}

export default function PolaroidGallerySection({ theme, photos }: PolaroidGallerySectionProps) {
  const themeConfig = THEME_CONFIG[theme];
  const { colors, typography } = themeConfig;

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-12"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight 
          }}
        >
          🖼️ Polaroid Memories
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          {photos.map((photo, index) => {
            const isCover = index === 0;
            return (
              <div
                key={index}
                className="relative p-3 pb-8 rotate-transform"
                style={{
                  backgroundColor: '#FFFFFF',
                  transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
                  border: isCover ? '3px solid #f43f5e' : '1px solid rgba(148,163,184,0.4)',
                  borderRadius: '12px',
                }}
              >
                <div className="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden">
                  <img
                    src={photo}
                    alt={isCover ? 'Cover' : `Memory ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span
                    className="text-sm font-handwriting"
                    style={{ color: colors.primary }}
                  >
                    {isCover ? 'Cover' : `#${index + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

