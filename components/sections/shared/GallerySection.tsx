'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryTemplate, OccasionType } from '@/lib/types';
import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../../builder/ThemeWrapper';
import Lightbox from '../../ui/Lightbox';
import SectionHeader from '../../page/SectionHeader';
import { getSectionCopy } from '@/lib/section-copy';
import ScrollReveal from '../../ui/ScrollReveal';

type Props = {
  theme: ThemeKey;
  template: GalleryTemplate;
  photos: string[];
  coverPhotoIndex?: number;
  siteType?: OccasionType;
};

export default function GallerySection({ theme, template, photos, coverPhotoIndex, siteType = 'couple' }: Props) {
  const styles = useTheme(theme);
  const [currentIndex, setCurrentIndex] = useState(0);

  const blurPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxzdHlsZT5yZWN0IHdpZHRoOjEwMCU7IGhlaWdodDo1MDAlOyBmaWxsOiNkZGRkZGQ7PC9zdHlsZT48L3N2Zz4=';
  const isShortGallery = photos.length <= 3;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  // Sort photos to put cover photo first
  const sortedPhotos = coverPhotoIndex !== undefined && coverPhotoIndex > 0
    ? [photos[coverPhotoIndex], ...photos.filter((_, i) => i !== coverPhotoIndex)]
    : photos;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Open lightbox at specific index
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Grid layout with masonry-style
  const renderGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4">
      {sortedPhotos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`
              relative aspect-square rounded-xl overflow-hidden shadow-lg 
              ${styles.cardBorder} border-2 cursor-pointer group
              gallery-zoom-hover
              ${idx === 0 && coverPhotoIndex !== undefined && coverPhotoIndex > 0 ? 'ring-4 ring-rose-400/30 md:col-span-2 md:aspect-[2/1]' : ''}
            `}
          >
            {/* Cover Photo Badge */}
            {idx === 0 && coverPhotoIndex !== undefined && coverPhotoIndex > 0 && (
              <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-rose-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
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
              priority={idx < 4}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  // Carousel layout
  const renderCarousel = () => (
    <div className="relative px-4">
      <ScrollReveal animation="fade-up">
        <div
          className="relative h-[300px] md:h-[400px] lg:h-[600px] w-full max-w-7xl mx-auto cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
        >
          <Image
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            fill
            className="object-cover gallery-zoom-hover"
            quality={80}
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            priority={currentIndex === 0}
          />
          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${styles.card} p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10`}
                aria-label="Previous photo"
              >
                <svg className={`w-6 h-6 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${styles.card} p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10`}
                aria-label="Next photo"
              >
                <svg className={`w-6 h-6 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </ScrollReveal>

      {/* Dots Indicator */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? `${styles.accentBg} w-8` : 'bg-gray-300 dark:bg-gray-600'
                }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Polaroid layout with enhanced styling
  const renderPolaroid = () => (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8 px-4">
      {sortedPhotos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`
              ${styles.card} p-3 pb-8 rounded-sm shadow-xl 
              transform hover:-translate-y-2 hover:rotate-1 
              transition-all duration-300 cursor-pointer group
            `}
            style={{
              backgroundColor: '#fff',
              transform: `rotate(${(idx % 5 - 2) * 2}deg)`,
              border: '1px solid rgba(148,163,184,0.35)',
            }}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-sm">
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
            <div className="text-center mt-2 text-slate-700 dark:text-slate-200 text-sm font-handwriting">
              #{idx + 1}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  return (
    <section className="relative py-16 md:py-24" id="gallery">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          {(() => {
            const copy = getSectionCopy('gallery', siteType);
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

        

        {/* Gallery Content */}
        {template === 'grid' && renderGrid()}
        {template === 'carousel' && renderCarousel()}
        {template === 'polaroid' && renderPolaroid()}

        {/* Lightbox */}
        <Lightbox
          photos={sortedPhotos}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
        />
      </div>
    </section>
  );
}

