'use client';

import { useEffect, useRef } from 'react';
import { STORY_CHAPTERS } from '@/hooks/useStoryProgress';

interface StorySectionWrapperProps {
  sectionKey: string;
  children: React.ReactNode;
  chapterNumber?: number;
  showChapterLabel?: boolean;
  onSectionVisible?: (sectionKey: string, element: HTMLElement) => void;
}

// Sections that should show chapter markers (main story chapters)
const MAIN_CHAPTER_SECTIONS = [
  'home',
  'love_letter', 
  'our_story',
  'timeline',
  'gallery',
  'song',
  'future_dreams',
  'reasons_love_you',
  'qr_keepsake',
];

export default function StorySectionWrapper({
  sectionKey,
  children,
  chapterNumber,
  showChapterLabel = false, // Disabled by default - chapter info shown in sidebar only
  onSectionVisible,
}: StorySectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  
  const chapterTitle = STORY_CHAPTERS[sectionKey];
  const isMainChapter = MAIN_CHAPTER_SECTIONS.includes(sectionKey);
  const shouldShowLabel = showChapterLabel && isMainChapter && chapterTitle;

  // Report section visibility to parent
  useEffect(() => {
    if (sectionRef.current && onSectionVisible) {
      onSectionVisible(sectionKey, sectionRef.current);
    }
  }, [sectionKey, onSectionVisible]);

  return (
    <section
      ref={sectionRef}
      data-story-section={sectionKey}
      className="story-section"
    >
      {/* Chapter Label */}
      {shouldShowLabel && (
        <div className="story-chapter-label">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-4 mb-6">
              {/* Chapter number */}
              {chapterNumber && (
                <span className="chapter-number">
                  {String(chapterNumber).padStart(2, '0')}
                </span>
              )}
              
              {/* Decorative line */}
              <div className="flex-1 max-w-xs">
                <div className="h-px bg-gradient-to-r from-rose-200 to-transparent" />
              </div>
              
              {/* Chapter title */}
              <h3 className="chapter-title">
                {chapterTitle}
              </h3>
              
              {/* Decorative line */}
              <div className="flex-1 max-w-xs">
                <div className="h-px bg-gradient-to-l from-rose-200 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Content */}
      {children}
    </section>
  );
}

// Simplified wrapper for non-chapter sections
export function SimpleSectionWrapper({
  sectionKey,
  children,
  onSectionVisible,
}: {
  sectionKey: string;
  children: React.ReactNode;
  onSectionVisible?: (sectionKey: string, element: HTMLElement) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current && onSectionVisible) {
      onSectionVisible(sectionKey, sectionRef.current);
    }
  }, [sectionKey, onSectionVisible]);

  return (
    <section
      ref={sectionRef}
      data-story-section={sectionKey}
    >
      {children}
    </section>
  );
}

