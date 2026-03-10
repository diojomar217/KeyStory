'use client';

import React from 'react';
import { LayoutPreset } from '@/lib/types';
import { LAYOUT_PRESETS } from '@/lib/builder-constants';

interface LayoutPresetCardProps {
  layout: LayoutPreset;
  isSelected: boolean;
  onSelect: (layout: LayoutPreset) => void;
}

export default function LayoutPresetCard({ layout, isSelected, onSelect }: LayoutPresetCardProps) {
  const preset = LAYOUT_PRESETS.find(p => p.key === layout);
  
  if (!preset) return null;

  return (
    <button
      type="button"
      onClick={() => onSelect(layout)}
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

      {/* Layout Preview Icon */}
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100">
        <span className="text-3xl">{preset.previewEmoji}</span>
      </div>

      {/* Layout Name */}
      <h4 className={`font-semibold text-base mb-1 text-center transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
        {preset.label}
      </h4>
      
      {/* Description */}
      <p className="text-sm text-slate-500 text-center transition-colors duration-300">
        {preset.description}
      </p>

      {/* Style Details */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-1 justify-center">
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
            {preset.headingTreatment} headings
          </span>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
            {preset.contentFlow} layout
          </span>
        </div>
      </div>
    </button>
  );
}

// Export all layout presets
export { LAYOUT_PRESETS };

