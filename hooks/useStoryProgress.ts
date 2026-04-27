'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface StorySection {
  key: string;
  id: string;
  title: string;
  chapterNumber: number;
}

// Map of section keys to chapter titles
export const STORY_CHAPTERS: Record<string, string> = {
  home: 'The Beginning',
  love_letter: 'A Love Letter',
  our_story: 'Our Story',
  first_date: 'Where It Started',
  special_moments: 'Cherished Moments',
  timeline: 'Our Journey',
  milestones: 'Milestones',
  gallery: 'Memories',
  polaroid_gallery: 'Photo Memories',
  song: 'Our Song',
  playlist: 'Our Playlist',
  video_memories: 'Video Memories',
  relationship_stats: 'Our Love in Numbers',
  anniversary_countdown: 'Counting Down',
  future_dreams: 'Dreams We Share',
  quotes: 'Words of Love',
  reasons_love_you: 'Why I Love You',
  memory_map: 'Places We Love',
  guest_messages: 'Love From Family & Friends',
  letter_future: 'A Letter to Tomorrow',
  gift_section: 'Love Gifts',
  surprise_message: 'A Surprise',
  qr_keepsake: 'A Piece of Our Story',
};

// Sections that should show chapter markers (as object for proper typing)
const CHAPTER_SECTIONS_SET: Record<string, boolean> = {
  home: true,
  love_letter: true,
  our_story: true,
  timeline: true,
  gallery: true,
  song: true,
  future_dreams: true,
  reasons_love_you: true,
  qr_keepsake: true,
};

interface UseStoryProgressOptions {
  sectionIds: string[];
  enabledSections: string[];
}

export function useStoryProgress({ sectionIds, enabledSections }: UseStoryProgressOptions) {
  const [currentSection, setCurrentSection] = useState<string>('');
  const [progress, setProgress] = useState(0);
  // chapters are derived from enabledSections/sectionIds
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  // sectionsArrayRef previously unused — keep ref for potential future use
  const sectionsArrayRef = useRef<HTMLElement[]>([]);

  // Compute chapter list in a memo to avoid calling setState synchronously in effects
  const chapters = useMemo(() => {
    const chapterList: StorySection[] = [];
    let chapterNum = 1;

    for (const sectionKey of enabledSections) {
      if (CHAPTER_SECTIONS_SET[sectionKey] || sectionIds.includes(sectionKey)) {
        chapterList.push({
          key: sectionKey,
          id: sectionKey,
          title: STORY_CHAPTERS[sectionKey] || sectionKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          chapterNumber: chapterNum,
        });
        chapterNum++;
      }
    }


    return chapterList;
  }, [enabledSections, sectionIds]);

  // Register a section element
  const registerSection = useCallback((key: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(key, element);
    } else {
      sectionRefs.current.delete(key);
    }
  }, []);

  // Set up intersection observer for scroll tracking
  useEffect(() => {
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Find the first visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Get the topmost visible section
        const sortedEntries = visibleEntries.sort((a, b) => {
          const rectA = a.boundingClientRect;
          const rectB = b.boundingClientRect;
          return rectA.top - rectB.top;
        });
        
        const topEntry = sortedEntries[0];
        const sectionId = topEntry.target.getAttribute('data-story-section');
        
        if (sectionId) {
          setCurrentSection(sectionId);
          
          // Calculate progress
          const currentIndex = chapters.findIndex(c => c.key === sectionId);
          if (currentIndex >= 0 && chapters.length > 0) {
            const newProgress = ((currentIndex + 1) / chapters.length) * 100;
            setProgress(Math.min(newProgress, 100));
          }
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    // Observe all registered sections
    sectionRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [chapters]);

  // Update observer when sections change
  useEffect(() => {
    if (!observerRef.current) return;

    observerRef.current.disconnect();

    sectionRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });
  }, [sectionIds]);

  const scrollToSection = useCallback((sectionKey: string) => {
    const element = sectionRefs.current.get(sectionKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const isChapterSection = useCallback((sectionKey: string) => {
    return CHAPTER_SECTIONS_SET[sectionKey] === true;
  }, []);

  return {
    currentSection,
    progress,
    chapters,
    registerSection,
    scrollToSection,
    isChapterSection,
  };
}

export default useStoryProgress;

