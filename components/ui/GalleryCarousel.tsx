'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { ThemeKey } from '@/config/themeConfig';
import { useThemeUtils } from '../builder/ThemeWrapper';
import Lightbox from './Lightbox';
import ScrollReveal from './ScrollReveal';

type Props = {
  images: string[];
  theme: ThemeKey;
  sectionTitle?: string;
  sectionSubtitle?: string;
};

export default function GalleryCarousel({
  images,
  theme,
  sectionTitle,
  sectionSubtitle,
}: Props) {
  const themeUtils = useThemeUtils(theme);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const isDragging = useRef(false);

  const totalPhotos = images?.length ?? 0;
  const currentPhoto = images?.[currentIndex];

  const frameBg = useMemo(
    () =>
      `linear-gradient(180deg, ${themeUtils.colors.card}, ${themeUtils.colors.secondary}14 55%, ${themeUtils.colors.card})`,
    [themeUtils.colors.card, themeUtils.colors.secondary]
  );

  const captionBg = useMemo(
    () => `linear-gradient(180deg, ${themeUtils.colors.card}fb, ${themeUtils.colors.card}f3)`,
    [themeUtils.colors.card]
  );

  const borderColor = `${themeUtils.colors.border}b0`;
  const badgeBg = `linear-gradient(135deg, ${themeUtils.colors.secondary}72, ${themeUtils.colors.card}f3)`;
  const activeDot = themeUtils.colors.primary;
  const inactiveDot = `${themeUtils.colors.primary}26`;
  const arrowBg = `${themeUtils.colors.card}e8`;
  const arrowBorder = `${themeUtils.colors.border}cc`;
  const arrowColor = themeUtils.colors.primary;
  const countBg = `${themeUtils.colors.card}d8`;

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const start = () => {
      if (autoplayRef.current) return;
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 6000);
    };

    const stop = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    if (!isPaused && !lightboxOpen && typeof document !== 'undefined' && !document.hidden) {
      start();
    } else {
      stop();
    }

    return stop;
  }, [images, isPaused, lightboxOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div
        className="mx-auto flex w-full max-w-[460px] items-center justify-center rounded-[24px] border px-6 py-16 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
        style={{
          background: frameBg,
          borderColor,
          color: themeUtils.colors.text,
        }}
      >
        <p className="text-sm md:text-base">No memories yet 💕</p>
      </div>
    );
  }

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setIsPaused(true);
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    isSwiping.current = false;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - (touchStartY.current ?? 0);

    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const t = e.changedTouches[0];
    if (!t || touchStartX.current === null) {
      setIsPaused(false);
      return;
    }

    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - (touchStartY.current ?? 0);
    const threshold = 50;

    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;

    setTimeout(() => {
      isSwiping.current = false;
    }, 0);

    setTimeout(() => setIsPaused(false), 220);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setIsPaused(true);
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging.current || touchStartX.current === null) return;

    const dx = e.clientX - touchStartX.current;
    const dy = e.clientY - (touchStartY.current ?? 0);

    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging.current || touchStartX.current === null) {
      setIsPaused(false);
      return;
    }

    const dx = e.clientX - touchStartX.current;
    const dy = e.clientY - (touchStartY.current ?? 0);
    const threshold = 50;

    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }

    isDragging.current = false;
    touchStartX.current = null;
    touchStartY.current = null;

    setTimeout(() => {
      isSwiping.current = false;
    }, 0);

    setTimeout(() => setIsPaused(false), 220);
  };

  return (
    <ScrollReveal animation="fade-up">
      <div className="group">
        <div className="mx-auto w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px]">
          <div className="mb-3 flex items-center justify-between gap-2 px-1 sm:mb-4">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-[11px]"
              style={{
                background: badgeBg,
                borderColor,
                color: themeUtils.colors.primary,
              }}
            >
              <span aria-hidden="true">✨</span>
              Precious Moments
            </div>

            <div
              className="rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.14em] sm:px-3.5 sm:py-1.5 sm:text-[11px]"
              style={{
                backgroundColor: countBg,
                borderColor,
                color: themeUtils.colors.text,
              }}
            >
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[24px] border shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:rounded-[28px]"
            style={{
              background: frameBg,
              borderColor,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[24px] sm:rounded-t-[28px]">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={currentPhoto}
                    alt={`Photo ${currentIndex + 1}`}
                    fill
                    className="scale-105 object-cover blur-2xl opacity-10"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 560px"
                    quality={60}
                    priority={currentIndex === 0}
                  />
                </div>

                {images.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className={`absolute inset-0 z-10 transition-opacity duration-700 ease-out ${
                      idx === currentIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className={`object-cover transition-transform duration-[2200ms] ease-out ${
                        idx === currentIndex ? 'scale-[1.02]' : 'scale-100'
                      }`}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 560px"
                      quality={90}
                      draggable={false}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  aria-label="Open photo"
                  onClick={(e) => {
                    if (isSwiping.current) {
                      e.preventDefault();
                      e.stopPropagation();
                      isSwiping.current = false;
                      return;
                    }
                    setLightboxOpen(true);
                  }}
                  className="absolute inset-0 z-20 bg-transparent"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex"
                      style={{
                        backgroundColor: arrowBg,
                        borderColor: arrowBorder,
                        color: arrowColor,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex"
                      style={{
                        backgroundColor: arrowBg,
                        borderColor: arrowBorder,
                        color: arrowColor,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              <div
                className="border-t px-4 py-3 text-center sm:px-5 sm:py-4"
                style={{
                  background: captionBg,
                  borderTopColor: `${themeUtils.colors.border}85`,
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]"
                  style={{ color: themeUtils.colors.primary }}
                >
                  {sectionTitle || 'Captured with Love'}
                </p>

                {/* <p
                  className="mx-auto mt-1.5 max-w-[24rem] text-[11px] leading-relaxed sm:mt-2 sm:text-sm"
                  style={{ color: `${themeUtils.colors.text}d8` }}
                >
                  {sectionSubtitle || 'A few cherished moments from our little one’s journey'}
                </p> */}
              </div>
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex flex-col items-center justify-center gap-2 sm:mt-4">
              <div className="flex items-center justify-center gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to photo ${idx + 1}`}
                    onClick={() => setCurrentIndex(idx)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: idx === currentIndex ? 20 : 6,
                      height: 6,
                      backgroundColor: idx === currentIndex ? activeDot : inactiveDot,
                      opacity: idx === currentIndex ? 1 : 0.9,
                    }}
                  />
                ))}
              </div>

              <div
                className="text-[10px] font-medium sm:hidden"
                style={{ color: `${themeUtils.colors.text}a8` }}
              >
                Swipe to browse
              </div>
            </div>
          )}
        </div>

        <Lightbox
          photos={images}
          initialIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </ScrollReveal>
  );
}