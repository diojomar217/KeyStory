'use client';

import React from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { THEME_CONFIG } from '@/config/themeConfig';

interface ThemePresetCardProps {
  theme: ThemeKey;
  isSelected: boolean;
  onSelect: (theme: ThemeKey) => void;
}

export default function ThemePresetCard({ theme, isSelected, onSelect }: ThemePresetCardProps) {
  const preset = THEME_CONFIG[theme];

  return (
    <button
      type="button"
      onClick={() => onSelect(theme)}
      className={`
        group relative w-full flex flex-col p-4 rounded-2xl border-2 text-left
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        ${isSelected 
          ? 'border-rose-500 bg-rose-50/70 shadow-lg ring-2 ring-rose-200' 
          : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-md'
        }
      `}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white animate-scale-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Color Palette Preview */}
      <div className="flex gap-1.5 mb-3">
        {preset.preview.map((color: string, idx: number) => (
          <div
            key={idx}
            className="w-6 h-6 rounded-full shadow-sm border border-slate-200/50 transform group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Theme Name */}
      <h4 className={`font-semibold text-base mb-1 transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
        {preset.label}
      </h4>
      
      {/* Description */}
      <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
        {preset.description}
      </p>

      {/* Style Details */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-1">
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
            {preset.style.cardStyle} cards
          </span>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
            {preset.style.sectionSpacing} spacing
          </span>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
            {preset.style.buttonStyle} buttons
          </span>
        </div>
      </div>
    </button>
  );
}

// Export all theme presets for use in theme selector
export { THEME_CONFIG };

