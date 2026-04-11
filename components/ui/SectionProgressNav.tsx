'use client';

import React, { useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { getThemeStyles } from '@/config/themeStyles';
import { isDarkTheme as checkIsDarkTheme } from '@/lib/theme-color-helpers';
import { motion } from 'framer-motion';

interface Props {
  theme: ThemeKey;
  sections: string[];
  activeSection: string;
  formatLabel?: (section: string) => string;
}

const SECTION_ICONS: Record<string, string> = {
  home: '🏠',
  timeline: '🗓️',
  gallery: '📸',
  playlist: '🎧',
  love_letter: '💌',
};

export default function SectionProgressNav({
  theme,
  sections,
  activeSection,
  formatLabel,
}: Props) {
  const styles = getThemeStyles(theme);
  const isDark = checkIsDarkTheme(theme);
  const [hovered, setHovered] = useState(false);

  const normalizedSections = sections.filter(Boolean);
  if (normalizedSections.length < 2) return null;

  const getLabel = (section: string) =>
    formatLabel?.(section) || section.replace(/_/g, ' ');

  const scrollToSection = (id: string) => {
    document.getElementById(`story-section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div
      className="fixed right-4 top-1/2 z-[72] hidden -translate-y-1/2 lg:flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ width: hovered ? 190 : 60 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-2xl border p-2 backdrop-blur-xl"
        style={{
          backgroundColor: isDark
            ? 'rgba(12,12,12,0.6)'
            : 'rgba(255,255,255,0.75)',
          borderColor: isDark
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(15,23,42,0.06)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflowX: 'hidden',
        }}
      >
        {normalizedSections.map((section) => {
          const isActive = section === activeSection;

          return (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="group flex items-center gap-3 rounded-full px-2 py-2 transition-all"
              style={{
                backgroundColor: isActive
                  ? isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.9)'
                  : 'transparent',
              }}
            >
              {/* ICON */}
              <span className="flex h-8 w-8 items-center justify-center text-lg">
                {SECTION_ICONS[section] || '✨'}
              </span>

              {/* LABEL */}
              <motion.span
                animate={{
                  opacity: hovered ? 1 : 0,
                  x: hovered ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className={`whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] ${
                  isActive ? styles.accent : styles.textMuted
                }`}
              >
                {getLabel(section)}
              </motion.span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}