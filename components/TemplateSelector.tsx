'use client';
import {
  HomeTemplate,
  GalleryTemplate,
  TimelineTemplate,
  Section,
} from '@/lib/types';
import React from 'react';

type Props = {
  section: Section;
  value?: string;
  onChange: (template: string) => void;
};

const templates: Record<Section, { key: string; label: string; description: string; preview: React.ReactNode }[]> = {
  home: [
    { 
      key: 'hero_centered', 
      label: 'Hero Centered',
      description: 'Centered content with large title and elegant spacing',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-rose-100 to-white rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-rose-300 mb-1"></div>
          <div className="w-10 h-1 bg-rose-200 rounded"></div>
        </div>
      )
    },
    { 
      key: 'split_layout', 
      label: 'Split Layout',
      description: 'Photo on one side, text on the other for a modern look',
      preview: (
        <div className="w-full h-full bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-2 flex gap-1">
          <div className="flex-1 rounded bg-rose-200/50"></div>
          <div className="flex-1 rounded bg-rose-300/50"></div>
        </div>
      )
    },
    { 
      key: 'fullscreen_banner', 
      label: 'Fullscreen Banner',
      description: 'Immersive full-width hero with background image support',
      preview: (
        <div className="w-full h-full bg-rose-200 rounded-lg p-2 flex items-end justify-center">
          <div className="w-12 h-6 bg-white/70 rounded"></div>
        </div>
      )
    },
  ],
  gallery: [
    { 
      key: 'grid', 
      label: 'Grid',
      description: 'Classic masonry grid layout for displaying multiple photos',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-1.5 grid grid-cols-2 gap-1">
          <div className="rounded bg-rose-200"></div>
          <div className="rounded bg-pink-200"></div>
          <div className="rounded bg-rose-300"></div>
          <div className="rounded bg-pink-300"></div>
        </div>
      )
    },
    { 
      key: 'carousel', 
      label: 'Carousel',
      description: 'Swipeable carousel for an interactive photo experience',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-10 h-8 bg-rose-300 rounded-lg shadow-md"></div>
        </div>
      )
    },
    { 
      key: 'polaroid', 
      label: 'Polaroid',
      description: 'Vintage-style polaroid frames for a nostalgic feel',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-10 bg-white rounded-sm shadow-md flex items-center justify-center">
            <div className="w-6 h-5 bg-rose-200 rounded-sm"></div>
          </div>
        </div>
      )
    },
  ],
  timeline: [
    { 
      key: 'vertical_timeline', 
      label: 'Vertical Timeline',
      description: 'Chronological vertical timeline with connecting lines',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
        </div>
      )
    },
    { 
      key: 'milestone_cards', 
      label: 'Milestone Cards',
      description: 'Card-based design highlighting key moments',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col gap-1">
          <div className="h-2 bg-rose-200 rounded"></div>
          <div className="h-3 bg-white rounded shadow-sm"></div>
          <div className="h-2 bg-pink-200 rounded"></div>
          <div className="h-3 bg-white rounded shadow-sm"></div>
        </div>
      )
    },
    { 
      key: 'story_chapters', 
      label: 'Story Chapters',
      description: 'Chapter-based narrative layout for your love story',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-rose-50 to-pink-50 rounded-lg p-2 flex flex-col gap-1">
          <div className="h-2 w-2/3 bg-rose-300 rounded mx-auto"></div>
          <div className="flex-1 bg-white/60 rounded shadow-sm"></div>
        </div>
      )
    },
  ],
};

const sectionLabels: Record<Section, string> = {
  home: 'Home Template',
  gallery: 'Gallery Template',
  timeline: 'Timeline Template',
};

export default function TemplateSelector({ section, value, onChange }: Props) {
  const list = templates[section] || [];
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">3</span>
        <h3 className="text-lg font-semibold text-slate-800">{sectionLabels[section]}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((t, index) => {
          const isSelected = value === t.key;
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
                {t.preview}
              </div>
              
              {/* Template Label */}
              <h4 className={`font-semibold text-sm transition-colors duration-300 ${isSelected ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>
                {t.label}
              </h4>
              
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

