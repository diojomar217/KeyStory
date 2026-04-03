'use client';

import React from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';
import { motion } from 'framer-motion';

interface Props {
  theme: ThemeKey;
  sections: string[];
  activeSection: string;
  formatLabel?: (section: string) => string;
}

export default function SectionProgressNav({ theme, sections, activeSection, formatLabel }: Props) {
  const styles = getThemeStyles(theme);
  const normalizedSections = sections.filter(Boolean);

  if (normalizedSections.length < 2) return null;

  const getLabel = (section: string) => formatLabel?.(section) || section;

  const scrollToSection = (id: string) => {
    document.getElementById(`story-section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <div className="fixed right-5 top-1/2 z-[72] hidden -translate-y-1/2 lg:flex">
        <div
          className="flex flex-col gap-2 rounded-[1.6rem] border p-3 shadow-xl backdrop-blur-xl"
          style={{
            backgroundColor: theme === 'dark_elegant' ? 'rgba(10,10,10,0.58)' : 'rgba(255,255,255,0.72)',
            borderColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
          }}
        >
          {normalizedSections.map((section) => {
            const isActive = section === activeSection;
            return (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="group flex items-center gap-3 rounded-full px-3 py-2 text-left transition-all duration-200 hover:translate-x-[-2px]"
                style={{
                  backgroundColor: isActive
                    ? theme === 'dark_elegant'
                      ? 'rgba(245,158,11,0.16)'
                      : 'rgba(255,255,255,0.92)'
                    : 'transparent',
                }}
                aria-label={`Jump to ${getLabel(section)}`}
                title={getLabel(section)}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'currentColor' : theme === 'dark_elegant' ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.18)',
                  }}
                />
                <span className={`text-xs font-semibold tracking-[0.14em] uppercase ${isActive ? styles.accent : styles.textMuted}`}>
                  {getLabel(section)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-[72] px-4 lg:hidden">
        <div
          className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto rounded-full border px-3 py-2 shadow-xl backdrop-blur-xl"
          style={{
            backgroundColor: theme === 'dark_elegant' ? 'rgba(10,10,10,0.72)' : 'rgba(255,255,255,0.8)',
            borderColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
          }}
        >
          {normalizedSections.map((section) => {
            const isActive = section === activeSection;
            return (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className="shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
                animate={{ scale: isActive ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: isActive
                    ? theme === 'dark_elegant'
                      ? 'rgba(245,158,11,0.16)'
                      : 'rgba(255,255,255,0.96)'
                    : 'transparent',
                  color: isActive
                    ? theme === 'dark_elegant'
                      ? '#F59E0B'
                      : '#111827'
                    : theme === 'dark_elegant'
                      ? 'rgba(250,250,250,0.78)'
                      : 'rgba(17,24,39,0.62)',
                }}
                aria-label={`Jump to ${getLabel(section)}`}
              >
                {getLabel(section)}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}

