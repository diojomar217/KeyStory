'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Theme, GalleryTemplate } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import Lightbox from './Lightbox';
import SectionHeader from './SectionHeader';
import ScrollReveal from './ScrollReveal';

type Props = {
  theme: Theme;
  template: GalleryTemplate;
  photos: string[];
};

export default function GallerySection({ theme, template, photos }: Props) {
  const styles = useTheme(theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

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

  const renderGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4">
      {photos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`relative aspect-square rounded-xl overflow-hidden shadow-lg ${styles.cardBorder} border-2 cursor-pointer group`}
          >
            <Image
              src={photo}
              alt={`Photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative px-4">
      <ScrollReveal animation="fade-up">
        <div 
          className="relative h-[300px] md:h-[400px] lg:h-[600px] w-full max-w-7xl mx-auto cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
          
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
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? `${styles.accentBg} w-8` : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderPolaroid = () => (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8 px-4">
      {photos.map((photo, idx) => (
        <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
          <div
            onClick={() => openLightbox(idx)}
            className={`${styles.card} p-3 pb-8 rounded-sm shadow-xl transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 cursor-pointer group`}
            style={{
              backgroundColor: '#fff',
              transform: `rotate(${(idx % 5 - 2) * 2}deg)`,
            }}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-sm">
              <Image
                src={photo}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="160px"
              />
            </div>
            <div className="text-center mt-2 text-gray-400 text-sm font-handwriting">
              #{idx + 1}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );

  return (
    <section className={`py-16 md:py-24 ${styles.sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <SectionHeader
            icon="📸"
            title="Our Memories"
            subtitle="Moments we will never forget"
            theme={theme}
          />
        </ScrollReveal>
        
        {/* Gallery Content */}
        {template === 'grid' && renderGrid()}
        {template === 'carousel' && renderCarousel()}
        {template === 'polaroid' && renderPolaroid()}

        {/* Lightbox */}
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
        />
      </div>
    </section>
  );
}

