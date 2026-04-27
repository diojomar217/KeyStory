'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade' | 'scale' | 'tilt';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let timeoutId: number | null = null;

    if (prefersReducedMotion) {
      element.style.transitionDelay = '0ms';
      // Schedule state update asynchronously to avoid sync setState in effect
      timeoutId = window.setTimeout(() => setIsVisible(true), 0);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    // Set initial delay if any
    if (delay > 0) {
      element.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [threshold, once, delay, prefersReducedMotion]);

  // Determine animation class based on type
  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'reveal-fade';
      case 'scale':
        return 'reveal-scale';
      case 'tilt':
        return 'reveal-tilt';
      case 'fade-up':
      default:
        return 'reveal';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${prefersReducedMotion ? '' : getAnimationClass()} ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

