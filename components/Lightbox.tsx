'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

type LightboxProps = {
  photos: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function Lightbox({ photos, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when lightbox opens with new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        break;
      case 'ArrowRight':
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        break;
    }
  }, [isOpen, onClose, photos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Main image container */}
      <div className="relative w-full h-full max-w-7xl max-h-[85vh] px-16 flex items-center justify-center">
        {/* Previous button */}
        {photos.length > 1 && (
          <button
            onClick={goToPrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 text-white/80 hover:text-white backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-200">
          <div className="relative w-full h-full max-h-[85vh]">
            <Image
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Next button */}
        {photos.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 text-white/80 hover:text-white backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 transition-all ${
                idx === currentIndex
                  ? 'ring-2 ring-rose-500 scale-110'
                  : 'opacity-50 hover:opacity-80'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile: Swipe hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-xs md:hidden">
        Tap edges to navigate
      </div>
    </div>
  );
}

