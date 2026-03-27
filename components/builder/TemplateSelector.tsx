'use client';
import { Section } from '@/lib/types';
import { getTemplatesForSection } from '@/config/templateConfig';
import React from 'react';
// Minimal mock preview component for template cards
function TemplateMockPreview({ type, variant }: { type: string; variant: string }) {
  // You can expand this switch for more visual variety per variant
  switch (variant) {
    case 'hero_centered':
      return <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-100 flex items-center justify-center rounded"><div className="w-2/3 h-3/4 bg-white rounded shadow-md" /></div>;
    case 'split_layout':
      return <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center rounded"><div className="w-1/2 h-3/4 bg-white rounded-l shadow-md" /><div className="w-1/2 h-3/4 bg-rose-200 rounded-r" /></div>;
    case 'fullscreen_banner':
      return <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-200 flex items-end justify-center rounded"><div className="w-5/6 h-2/3 bg-white rounded-t shadow-md" /></div>;
    case 'gallery_grid':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 grid grid-cols-3 gap-1 p-1 rounded"><div className="bg-white h-4 rounded" /><div className="bg-white h-4 rounded" /><div className="bg-white h-4 rounded" /><div className="bg-white h-4 rounded" /><div className="bg-white h-4 rounded" /><div className="bg-white h-4 rounded" /></div>;
    case 'gallery_carousel':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center rounded"><div className="w-2/3 h-3/4 bg-white rounded shadow-md" /><div className="w-1/6 h-2/3 bg-rose-200 rounded ml-1" /></div>;
    case 'gallery_polaroid':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center rounded"><div className="w-1/3 h-2/3 bg-white rounded shadow-md rotate-6 -ml-2" /><div className="w-1/3 h-2/3 bg-white rounded shadow-md -rotate-6 ml-2" /></div>;
    case 'timeline_vertical':
      return <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center rounded"><div className="w-1 h-3/4 bg-rose-400 rounded" /><div className="w-3 h-3 bg-white rounded-full mt-1" /><div className="w-3 h-3 bg-white rounded-full mt-1" /></div>;
    case 'timeline_milestone_cards':
      return <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center rounded"><div className="w-2/3 h-2 bg-white rounded mb-1" /><div className="w-2/3 h-2 bg-white rounded mb-1" /><div className="w-2/3 h-2 bg-white rounded" /></div>;
    case 'timeline_story_chapters':
      return <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center rounded"><div className="w-3/4 h-2 bg-white rounded mb-1" /><div className="w-1/2 h-2 bg-white rounded mb-1" /><div className="w-1/3 h-2 bg-white rounded" /></div>;
    case 'song_minimal':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center rounded"><div className="w-2/3 h-2 bg-white rounded" /><div className="w-1/6 h-2 bg-rose-200 rounded ml-1" /></div>;
    case 'song_visual':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 flex items-end justify-center rounded"><div className="w-2/3 h-2 bg-white rounded mb-1" /><div className="w-2/3 h-4 bg-rose-200 rounded" /></div>;
    case 'song_lyrics':
      return <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-50 flex flex-col items-center justify-center rounded"><div className="w-2/3 h-2 bg-white rounded mb-1" /><div className="w-1/2 h-2 bg-white rounded mb-1" /><div className="w-1/3 h-2 bg-white rounded" /></div>;
    default:
      return <div className="w-full h-full bg-slate-100 rounded" />;
  }
}

type Props = {
  section: Section;
  value?: string;
  onChange: (template: string) => void;
};

export default function TemplateSelector({ section, value, onChange }: Props) {
  const templates = getTemplatesForSection(section) as Array<any>;
  if (!Array.isArray(templates) || !templates.length) return null;
  const label = `${section.charAt(0).toUpperCase() + section.slice(1)} Template`;
  const recommendedTemplateKey = templates[0].key;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">4</span>
        <h3 className="text-lg font-semibold text-slate-800">{label}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((t: any, index: number) => {
          const isSelected = value === t.key;
          const isRecommended = t.key === recommendedTemplateKey;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`
                group relative flex flex-col rounded-2xl border-2 p-4
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg
                opacity-0 animate-fade-in-up
                ${isSelected 
                  ? 'border-rose-500 bg-rose-50/70 shadow-lg ring-2 ring-rose-200' 
                  : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-md'
                }
              `}
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
            >
              {/* Mini Layout Preview */}
              <div className="w-full h-16 mb-3 overflow-hidden rounded-lg transform group-hover:scale-105 transition-transform duration-300">
                {t.preview && t.preview.type === 'mock' ? (
                  <TemplateMockPreview type={t.preview.type} variant={t.preview.variant} />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded" />
                )}
              </div>

              {/* Template Label + Recommended Badge */}
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold text-sm transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>
                  {t.label}
                </h4>
                {isRecommended && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[11px] font-semibold border border-rose-200">Recommended</span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 group-hover:text-slate-600 transition-colors duration-300">
                {t.description}
              </p>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white animate-scale-in">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

