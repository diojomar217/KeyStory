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
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

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
      observer.unobserve(element);
    };
  }, [threshold, once, delay]);

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
      className={`${getAnimationClass()} ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

