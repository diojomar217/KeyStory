'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { GalleryTemplate, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme, useThemeUtils } from '../../builder/ThemeWrapper';
import { getCardStyleClasses, getShadowClass } from '@/lib/theme-color-helpers';
import Lightbox from '../../ui/Lightbox';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';
import GalleryCarousel from '../../ui/GalleryCarousel';

type Props = {
  theme: ThemeKey;
  template: GalleryTemplate;
  photos: string[];
  coverPhotoIndex?: number;
  siteType?: OccasionType;
};

export default function GallerySection({
  theme,
  template,
  photos,
  coverPhotoIndex,
  siteType = 'couple',
}: Props) {
  const styles = useTheme(theme);
  const themeUtils = useThemeUtils(theme);
  const cardStyle = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);

  const blurPlaceholder =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxzdHlsZT5yZWN0IHdpZHRoOjEwMCU7IGhlaWdodDo1MDAlOyBmaWxsOiNkZGRkZGQ7PC9zdHlsZT48L3N2Zz4=';

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const hasCoverPhoto = typeof coverPhotoIndex === 'number' && coverPhotoIndex >= 0;
  const sectionCopy = useMemo(() => getSectionCopy('gallery', siteType), [siteType]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const sortedPhotos =
    coverPhotoIndex !== undefined && coverPhotoIndex > 0
      ? [photos[coverPhotoIndex], ...photos.filter((_, i) => i !== coverPhotoIndex)]
      : photos;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-6">
      {sortedPhotos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`
              relative aspect-square overflow-hidden ${cardStyle} ${shadowClass}
              ${styles.cardBorder} gallery-zoom-hover group cursor-pointer border-2
              ${idx === 0 && coverPhotoIndex !== undefined && coverPhotoIndex > 0 ? 'md:col-span-2 md:aspect-[2/1]' : ''}
            `}
            style={
              idx === 0 && coverPhotoIndex !== undefined && coverPhotoIndex > 0
                ? {
                    boxShadow: `0 0 0 4px ${themeUtils.colors.primary}40`,
                    borderColor: themeUtils.colors.border,
                  }
                : { borderColor: themeUtils.colors.border }
            }
          >
            {idx === 0 && coverPhotoIndex !== undefined && coverPhotoIndex > 0 && (
              <div
                className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg"
                style={{ backgroundColor: themeUtils.colors.accent }}
              >
                <span>📸</span> Cover Photo
              </div>
            )}

            <Image
              src={photo}
              alt={`Photo ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              quality={80}
              placeholder="blur"
              blurDataURL={blurPlaceholder}
              loading={idx < 2 ? 'eager' : 'lazy'}
              priority={idx < 2}
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <svg
                className="h-8 w-8 text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="px-4">
      <GalleryCarousel
        images={sortedPhotos}
        theme={theme}
        sectionTitle={sectionCopy.title}
        sectionSubtitle={sectionCopy.subtitle}
      />
    </div>
  );

  const renderPolaroid = () => (
    <div className="flex flex-wrap justify-center gap-6 px-4 md:gap-8">
      {sortedPhotos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`
              cursor-pointer rounded-sm p-3 pb-8 ${shadowClass}
              group transform transition-all duration-300
              hover:-translate-y-2 hover:rotate-1
            `}
            style={{
              backgroundColor: themeUtils.colors.card,
              transform: `rotate(${(idx % 5 - 2) * 2}deg)`,
              border: `1px solid ${themeUtils.colors.border}`,
            }}
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-sm md:h-40 md:w-40">
              <Image
                src={photo}
                alt={idx === 0 ? 'Cover photo' : `Photo ${idx + 1}`}
                fill
                className="object-cover gallery-zoom-hover"
                sizes="160px"
                quality={80}
                placeholder="blur"
                blurDataURL={blurPlaceholder}
                loading={idx < 2 ? 'eager' : 'lazy'}
              />
            </div>
            <div
              className="mt-2 text-center text-sm font-handwriting"
              style={{ color: themeUtils.colors.text }}
            >
              #{idx + 1}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  return (
    <section className="relative py-16 md:py-24" id="gallery">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at top, ${themeUtils.colors.secondary}22, transparent 45%)`,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon={sectionCopy.icon}
            title={sectionCopy.title}
            subtitle={sectionCopy.subtitle}
            theme={theme}
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={90}>
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{
                backgroundColor: themeUtils.colors.card,
                borderColor: themeUtils.colors.border,
                color: themeUtils.colors.text,
              }}
            >
              <span aria-hidden="true">Gallery</span>
              {photos.length} photos
            </span>

            {hasCoverPhoto && (
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
                style={{
                  backgroundColor: `${themeUtils.colors.secondary}55`,
                  borderColor: themeUtils.colors.border,
                  color: themeUtils.colors.primary,
                }}
              >
                <span aria-hidden="true">Cover</span>
                cover highlight enabled
              </span>
            )}

            <span className="text-xs" style={{ color: themeUtils.colors.text }}>
              Tap any photo to view it in full
            </span>
          </div>
        </ScrollReveal>

        {template === 'grid' && renderGrid()}
        {template === 'carousel' && renderCarousel()}
        {template === 'polaroid' && renderPolaroid()}

        {template !== 'carousel' && (
          <Lightbox
            photos={sortedPhotos}
            initialIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={closeLightbox}
          />
        )}
      </div>
    </section>
  );
}