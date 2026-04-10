'use client';

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { optimizeCloudinaryDeliveryUrl } from '@/lib/cloudinary-url';

type LightboxProps = {
  photos: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_TAP_DELAY = 280;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDistance(touches: TouchList) {
  if (touches.length < 2) return 0;
  const dx = touches[0]!.clientX - touches[1]!.clientX;
  const dy = touches[0]!.clientY - touches[1]!.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function Lightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const thumbStripRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOriginRef = useRef({ x: 0, y: 0 });

  const swipeTouchStartXRef = useRef<number | null>(null);
  const swipeTouchEndXRef = useRef<number | null>(null);

  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetZoomState = useCallback(() => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoomState();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      resetZoomState();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex, resetZoomState]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    resetZoomState();
  }, [photos.length, resetZoomState]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetZoomState();
  }, [photos.length, resetZoomState]);

  const toggleZoom = useCallback(() => {
    if (zoom > 1) {
      resetZoomState();
    } else {
      setZoom(2);
      setTranslate({ x: 0, y: 0 });
    }
  }, [zoom, resetZoomState]);

  useEffect(() => {
    if (!isOpen || !thumbStripRef.current || !activeThumbRef.current) return;

    activeThumbRef.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [currentIndex, isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (zoom === 1) goToPrev();
          break;
        case 'ArrowRight':
          if (zoom === 1) goToNext();
          break;
        case '+':
        case '=':
          setZoom((prev) => clamp(prev + 0.25, MIN_ZOOM, MAX_ZOOM));
          break;
        case '-':
          setZoom((prev) => {
            const next = clamp(prev - 0.25, MIN_ZOOM, MAX_ZOOM);
            if (next === 1) {
              setTranslate({ x: 0, y: 0 });
            }
            return next;
          });
          break;
        case '0':
          resetZoomState();
          break;
      }
    },
    [goToNext, goToPrev, isOpen, onClose, resetZoomState, zoom]
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isOpen]);

  const activePhoto = photos[currentIndex] || '';
  const optimizedActivePhoto = optimizeCloudinaryDeliveryUrl(activePhoto, {
    quality: 'auto:good',
    width: 2200,
    crop: 'limit',
  });

  const handleBackdropClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom((prev) => {
      const next = clamp(prev + delta, MIN_ZOOM, MAX_ZOOM);
      if (next === 1) {
        setTranslate({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLImageElement>) => {
    if (zoom <= 1) return;

    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragOriginRef.current = { ...translate };
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    setTranslate({
      x: dragOriginRef.current.x + dx,
      y: dragOriginRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const now = Date.now();

    if (event.touches.length === 1) {
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        toggleZoom();
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
    }

    if (event.touches.length === 2) {
      pinchStartDistanceRef.current = getDistance(event.touches);
      pinchStartZoomRef.current = zoom;
      return;
    }

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      swipeTouchStartXRef.current = touch?.clientX ?? null;
      swipeTouchEndXRef.current = null;

      if (zoom > 1 && touch) {
        setIsDragging(true);
        dragStartRef.current = { x: touch.clientX, y: touch.clientY };
        dragOriginRef.current = { ...translate };
      }
    }
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const distance = getDistance(event.touches);
      if (!pinchStartDistanceRef.current) return;

      const scaleFactor = distance / pinchStartDistanceRef.current;
      const nextZoom = clamp(
        pinchStartZoomRef.current * scaleFactor,
        MIN_ZOOM,
        MAX_ZOOM
      );
      setZoom(nextZoom);

      if (nextZoom === 1) {
        setTranslate({ x: 0, y: 0 });
      }
      return;
    }

    if (event.touches.length === 1) {
      const touch = event.touches[0];
      swipeTouchEndXRef.current = touch?.clientX ?? null;

      if (zoom > 1 && isDragging && touch) {
        const dx = touch.clientX - dragStartRef.current.x;
        const dy = touch.clientY - dragStartRef.current.y;

        setTranslate({
          x: dragOriginRef.current.x + dx,
          y: dragOriginRef.current.y + dy,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    if (pinchStartDistanceRef.current) {
      pinchStartDistanceRef.current = null;
      if (zoom <= 1) {
        resetZoomState();
      }
      return;
    }

    if (
      zoom === 1 &&
      swipeTouchStartXRef.current !== null &&
      swipeTouchEndXRef.current !== null
    ) {
      const delta = swipeTouchStartXRef.current - swipeTouchEndXRef.current;
      const swipeThreshold = 48;

      if (delta > swipeThreshold) {
        goToNext();
      } else if (delta < -swipeThreshold) {
        goToPrev();
      }
    }

    setIsDragging(false);
    swipeTouchStartXRef.current = null;
    swipeTouchEndXRef.current = null;
  };

  if (!mounted || !isOpen) return null;

  const lightboxContent = (
    <div
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      style={{
        width: '100vw',
        height: '100dvh',
        maxWidth: '100vw',
        maxHeight: '100dvh',
      }}
    >
      <div
        className="grid h-[100dvh] w-screen overflow-hidden"
        style={{
          gridTemplateRows: '72px minmax(0,1fr) 108px',
        }}
      >
        {/* Top bar */}
        <div className="relative z-[60] flex items-center justify-between gap-3 px-3 pt-3 md:px-5 md:pt-4">
          <div className="rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white md:px-4 md:py-2 md:text-sm">
            {currentIndex + 1} / {photos.length}
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="rounded-full bg-black/45 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90">
              {zoom > 1
                ? 'Drag to move • wheel/pinch to zoom • Esc to close'
                : 'Swipe or use arrows to navigate'}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/85 transition-colors hover:bg-white/20 hover:text-white md:p-3"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Viewer area */}
        <div
          className="relative min-h-0 px-2 md:px-6"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            {photos.length > 1 && (
              <button
                onClick={goToPrev}
                className="absolute left-1 z-[55] rounded-full bg-white/10 p-2 text-white/85 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 hover:text-white md:left-4 md:p-3"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="flex h-full w-full items-center justify-center" onDoubleClick={toggleZoom}>
              <img
                src={optimizedActivePhoto}
                alt={`Photo ${currentIndex + 1}`}
                onMouseDown={handleMouseDown}
                draggable={false}
                style={{
                  maxWidth: 'min(92vw, 1400px)',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  display: 'block',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 180ms ease',
                  willChange: 'transform',
                }}
              />
            </div>

            {photos.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-1 z-[55] rounded-full bg-white/10 p-2 text-white/85 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 hover:text-white md:right-4 md:p-3"
                aria-label="Next image"
              >
                <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-[60] flex flex-col items-center justify-end px-3 pb-3 md:px-4 md:pb-4">
          {photos.length > 1 && (
            <div
              ref={thumbStripRef}
              className="mx-auto flex w-fit max-w-[94vw] gap-2 overflow-x-auto rounded-full bg-black/55 px-3 py-2 backdrop-blur-sm md:max-w-[80vw]"
            >
              {photos.map((photo, idx) => {
                const optimizedThumb = optimizeCloudinaryDeliveryUrl(photo, {
                  quality: 'auto:eco',
                  width: 96,
                  height: 96,
                  crop: 'fill',
                });

                return (
                  <button
                    key={idx}
                    ref={idx === currentIndex ? activeThumbRef : null}
                    onClick={() => {
                      setCurrentIndex(idx);
                      resetZoomState();
                    }}
                    className={`relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full transition-all md:h-12 md:w-12 ${
                      idx === currentIndex
                        ? 'scale-110 ring-2 ring-rose-500'
                        : 'opacity-55 hover:opacity-85'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={optimizedThumb}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-2 text-center text-[11px] text-white/65 md:hidden">
            Swipe to navigate • double tap to zoom
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}