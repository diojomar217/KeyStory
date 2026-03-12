'use client';

import { useState, useEffect } from 'react';
import { StorySection } from '@/hooks/useStoryProgress';

interface StoryProgressProps {
  chapters: StorySection[];
  currentSection: string;
  progress: number;
  onSectionClick: (sectionKey: string) => void;
}

export default function StoryProgress({
  chapters,
  currentSection,
  progress,
  onSectionClick,
}: StoryProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only show progress indicator after initial scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleScroll();
    checkMobile();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render on mobile by default (too intrusive)
  if (isMobile) {
    return (
      <MobileProgressBar 
        chapters={chapters} 
        currentSection={currentSection} 
        progress={progress} 
      />
    );
  }

  // Desktop: Sticky side progress indicator
  return (
    <div 
      className={`
        fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-500
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Progress Line */}
        <div className="relative flex flex-col items-center">
          {/* Background line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-rose-100"
            style={{ height: '100%' }}
          />
          
          {/* Progress fill */}
          <div 
            className="absolute top-0 w-0.5 bg-rose-400 transition-all duration-300"
            style={{ height: `${progress}%` }}
          />

          {/* Chapter markers */}
          <div className="relative flex flex-col gap-3 py-4">
            {chapters.map((chapter) => {
              const isActive = currentSection === chapter.key;
              const isPast = chapters.findIndex(c => c.key === currentSection) > 
                chapters.findIndex(c => c.key === chapter.key);

              return (
                <button
                  key={chapter.key}
                  onClick={() => onSectionClick(chapter.key)}
                  className={`
                    group relative flex items-center gap-2 transition-all duration-300
                    ${isActive ? 'scale-110' : 'hover:scale-105'}
                  `}
                  aria-label={`Go to ${chapter.title}`}
                >
                  {/* Heart marker */}
                  <div 
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-rose-500 scale-125 shadow-lg shadow-rose-300' 
                        : isPast 
                          ? 'bg-rose-300' 
                          : 'bg-rose-200 group-hover:bg-rose-300'
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute inset-0 animate-ping inline-flex rounded-full bg-rose-400 opacity-75" />
                    )}
                  </div>

                  {/* Label - only show on active or hover */}
                  <span 
                    className={`
                      text-xs whitespace-nowrap transition-all duration-300
                      ${isActive 
                        ? 'opacity-100 translate-x-1 text-rose-600 font-medium' 
                        : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                      }
                    `}
                  >
                    {chapter.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile progress bar - simpler, less intrusive
function MobileProgressBar({
  chapters,
  currentSection,
  progress,
}: {
  chapters: StorySection[];
  currentSection: string;
  progress: number;
}) {
  const currentChapter = chapters.find(c => c.key === currentSection);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || chapters.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-rose-100 px-4 py-2">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <span className="text-xs text-rose-600 font-medium truncate">
          {currentChapter?.title || 'Reading our story...'}
        </span>
        <span className="text-xs text-rose-400">
          {Math.round(progress)}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-100">
        <div 
          className="h-full bg-rose-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

