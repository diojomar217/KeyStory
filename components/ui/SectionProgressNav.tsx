'use client';

import React from 'react';
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
  song: '🎵',
  playlist: '🎧',
  guest_messages: '💬',
  rsvp: '💌',
  memory_map: '🗺️',
  love_letter: '💌',
  qr_keepsake: '🔖',
};

export default function SectionProgressNav({ theme, sections, activeSection, formatLabel }: Props) {
  const styles = getThemeStyles(theme);
  const normalizedSections = sections.filter(Boolean);

  if (normalizedSections.length < 2) return null;

  const getLabel = (section: string) => formatLabel?.(section) || section;
  const getIcon = (section: string) => SECTION_ICONS[section] || '✨';

  const scrollToSection = (id: string) => {
    document.getElementById(`story-section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <div className="fixed right-4 top-1/2 z-[72] hidden -translate-y-1/2 lg:flex">
        <div
          className="flex max-h-[74vh] flex-col gap-2 overflow-y-auto rounded-[1.6rem] border p-3 shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: checkIsDarkTheme(theme) ? 'rgba(10,10,10,0.62)' : 'rgba(255,255,255,0.84)',
            borderColor: checkIsDarkTheme(theme) ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
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
                    ? checkIsDarkTheme(theme)
                      ? 'rgba(245,158,11,0.16)'
                      : 'rgba(255,255,255,0.92)'
                    : 'transparent',
                }}
                aria-label={`Jump to ${getLabel(section)}`}
                title={getLabel(section)}
              >
                <span className="text-base" aria-hidden="true">
                  {getIcon(section)}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'currentColor' : checkIsDarkTheme(theme) ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.18)',
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
          className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto rounded-2xl border px-3 py-2.5 shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: checkIsDarkTheme(theme) ? 'rgba(10,10,10,0.76)' : 'rgba(255,255,255,0.9)',
            borderColor: checkIsDarkTheme(theme) ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
          }}
        >
          {normalizedSections.map((section) => {
            const isActive = section === activeSection;
            return (
              <motion.button
                key={section}
                onClick={() => scrollToSection(section)}
                className="shrink-0 rounded-xl px-3 py-2 text-[11px] font-semibold transition-colors"
                animate={{ scale: isActive ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: isActive
                    ? checkIsDarkTheme(theme)
                      ? 'rgba(245,158,11,0.16)'
                      : 'rgba(255,255,255,0.96)'
                    : 'transparent',
                  color: isActive
                    ? checkIsDarkTheme(theme)
                      ? '#F59E0B'
                      : '#111827'
                    : checkIsDarkTheme(theme)
                      ? 'rgba(250,250,250,0.78)'
                      : 'rgba(17,24,39,0.62)',
                }}
                aria-label={`Jump to ${getLabel(section)}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true">{getIcon(section)}</span>
                  <span>{getLabel(section)}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}

