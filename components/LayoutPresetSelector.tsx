'use client';
import { LayoutPreset } from '@/lib/types';
import { LAYOUT_PRESETS } from '@/lib/builder-constants';
import React from 'react';

type Props = {
  value?: LayoutPreset;
  onChange: (preset: LayoutPreset) => void;
};

export default function LayoutPresetSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-800">Site Layout</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-600">
          Optional
        </span>
      </div>
      <p className="text-sm text-slate-500">
        Choose a layout preset to quickly style your entire website. You can customize individual sections afterward.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LAYOUT_PRESETS.map((preset, index) => {
          const isSelected = value === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onChange(preset.key)}
              className={`
                group relative flex flex-col p-4 rounded-2xl border-2 text-left
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl
                opacity-0 animate-fade-in-up
                ${isSelected 
                  ? 'border-rose-500 bg-rose-50/70 shadow-lg ring-2 ring-rose-200' 
                  : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-md'
                }
              `}
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white animate-scale-in">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Layout Preview Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 text-2xl">
                {preset.previewEmoji}
              </div>

              {/* Preset Name */}
              <h4 className={`font-semibold text-base mb-1 text-center transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
                {preset.label}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-slate-500 text-center transition-colors duration-300">
                {preset.description}
              </p>

              {/* Style Tags */}
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {preset.sectionSpacing}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {preset.contentFlow}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

