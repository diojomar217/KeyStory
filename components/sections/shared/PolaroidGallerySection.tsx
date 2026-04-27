'use client';

import type { ThemeKey } from '@/config/themeConfig';
import type { SectionAsset } from '@/lib/types';
import { useThemeUtils } from '../../builder/ThemeWrapper';
import { getHeadingFontClass, getSectionSpacingClass } from '@/lib/theme-color-helpers';
import ScrollReveal from '../../ui/ScrollReveal';
import { optimizeCloudinaryDeliveryUrl } from '@/lib/cloudinary-url';

interface PolaroidGallerySectionProps {
  theme: ThemeKey;
  photos: string[];
  assets?: SectionAsset;
}

export default function PolaroidGallerySection({ theme, photos }: PolaroidGallerySectionProps) {
  const themeUtils = useThemeUtils(theme);
  const spacingClass = getSectionSpacingClass(theme);
  const headingFontClass = getHeadingFontClass(theme);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section 
      className={spacingClass}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2
            className={`text-4xl font-bold text-center mb-12 ${headingFontClass}`}
            style={{ color: themeUtils.colors.primary }}
          >
            🖼️ Polaroid Memories
          </h2>
        </ScrollReveal>
        
        <div className="flex flex-wrap justify-center gap-8">
          {photos.map((photo, index) => {
            const isCover = index === 0;
            const optimizedPhoto = optimizeCloudinaryDeliveryUrl(photo, {
              quality: isCover ? 'auto:good' : 'auto:eco',
              width: 560,
              height: 560,
              crop: 'fill',
            });
            return (
              <ScrollReveal key={index} delay={index * 80} animation="tilt">
                <div
                  className="relative p-3 pb-8 rotate-transform"
                  style={{
                    backgroundColor: themeUtils.colors.card,
                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
                    border: isCover
                      ? `3px solid ${themeUtils.colors.primary}`
                      : `1px solid ${themeUtils.colors.border}`,
                    borderRadius: '12px',
                  }}
                >
                  <div className="w-48 h-48 sm:w-56 sm:h-56 overflow-hidden">
                    <img
                      src={optimizedPhoto}
                      alt={isCover ? 'Cover' : `Memory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span
                      className="text-sm font-handwriting"
                      style={{ color: themeUtils.colors.primary }}
                    >
                      {isCover ? 'Cover' : `#${index + 1}`}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

