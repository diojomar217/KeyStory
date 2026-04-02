'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';
import { motion, AnimatePresence } from 'framer-motion'; // Note: install framer-motion if needed

interface Props {
  theme: ThemeKey;
  sections: string[];
  activeSection: string;
}

export default function SectionProgressNav({ theme, sections, activeSection }: Props) {
  const [scrolledSections, setScrolledSections] = useState<Set<string>>(new Set());
  const styles = getThemeStyles(theme);

  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const sectionEls = document.querySelectorAll('section[id]');
    
    let newActive = activeSection;
    sectionEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 100 && rect.bottom > 100) {
        newActive = el.id;
      }
    });
    
    setScrolledSections(prev => {
      const newSet = new Set(prev);
      newSet.add(newActive);
      return newSet;
    });
  }, [activeSection]);

  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection);
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [updateActiveSection]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDotClass = (section: string) => {
    if (section === activeSection) return styles.accentBg;
    return scrolledSections.has(section) ? styles.accentBg : 'bg-slate-300';
  };

  const getLabelClass = (section: string) => {
    return scrolledSections.has(section) || section === activeSection ? styles.accent : styles.textMuted;
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 group-hover:pointer-events-auto">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            onClick={() => scrollToSection(section)}
            className="w-3 h-3 rounded-full border-2 border-current transition-all duration-300 hover:w-4 hover:h-4 cursor-pointer relative"
            animate={{ scale: scrolledSections.has(section) ? 1.2 : 1 }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`w-full h-full rounded-full ${getDotClass(section)}`}
              initial={{ scale: 0 }}
              animate={{ scale: scrolledSections.has(section) ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <AnimatePresence>
              {scrolledSections.has(section) && (
                <motion.span 
                  className={`absolute -right-16 text-xs font-medium whitespace-nowrap ${getLabelClass(section)}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <motion.div 
        className="w-px h-24 bg-gradient-to-b from-rose-400/50 to-transparent"
        initial={{ height: 0 }}
        animate={{ height: scrolledSections.size > 0 ? '6rem' : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

