'use client';
import { Section } from '@/lib/types';
import { SECTION_TOGGLES } from '@/lib/builder-constants';
import React, { useState } from 'react';

// Group sections by category
const SECTION_CATEGORIES = [
  {
    name: 'Core Sections',
    ids: ['home'],
  },
  {
    name: 'Love & Story',
    ids: ['love_letter', 'our_story', 'first_date', 'special_moments', 'milestones'],
  },
  {
    name: 'Timeline & Photos',
    ids: ['timeline', 'gallery', 'polaroid_gallery'],
  },
  {
    name: 'Music & Video',
    ids: ['song', 'playlist', 'video_memories'],
  },
  {
    name: 'Stats & Counters',
    ids: ['relationship_stats', 'anniversary_countdown'],
  },
  {
    name: 'Dreams & Future',
    ids: ['future_dreams'],
  },
  {
    name: 'Interactive',
    ids: ['quotes', 'reasons_love_you', 'memory_map', 'guest_messages'],
  },
  {
    name: 'Special Features',
    ids: ['letter_future', 'gift_section', 'surprise_message', 'qr_keepsake'],
  },
];

type Props = {
  value: Section[];
  onChange: (sections: Section[]) => void;
};

export default function SectionSelector({ value, onChange }: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string>('Core Sections');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const toggle = (key: Section) => {
    if (value.includes(key)) {
      onChange(value.filter((s) => s !== key));
    } else {
      onChange([...value, key]);
    }
  };

  const getSectionInfo = (id: Section) => {
    return SECTION_TOGGLES.find(t => t.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">3</span>
          <h3 className="text-lg font-semibold text-slate-800">Select Website Sections</h3>
        </div>
        <span className="text-sm text-slate-500">
          {value.length} section{value.length !== 1 ? 's' : ''} selected
        </span>
      </div>

      {/* Section Categories */}
      {SECTION_CATEGORIES.map((category) => {
        const categorySections = category.ids.map(id => getSectionInfo(id as Section)).filter(Boolean);
        const selectedInCategory = categorySections.filter(s => s && value.includes(s!.id)).length;
        
        return (
          <div key={category.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Category Header */}
            <button
              type="button"
              onClick={() => setExpandedCategory(expandedCategory === category.name ? '' : category.name)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedInCategory > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                  {selectedInCategory}/{categorySections.length}
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedCategory === category.name ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Category Sections */}
            {expandedCategory === category.name && (
              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySections.map((section) => {
                  if (!section) return null;
                  const isSelected = value.includes(section.id);
                  const isRequired = section.required;
                  
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => !isRequired && toggle(section.id)}
                      onMouseEnter={() => setHoveredSection(section.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                      disabled={isRequired}
                      className={`
                        group relative flex items-start gap-3 p-3 rounded-xl border-2 text-left
                        transition-all duration-200
                        ${isSelected 
                          ? 'border-rose-500 bg-rose-50/70 shadow-sm' 
                          : isRequired
                            ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                            : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      {/* Required Badge */}
                      {isRequired && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-slate-400 text-white text-xs">
                          ✓
                        </div>
                      )}

                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg
                        ${isSelected ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {section.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${isSelected ? 'text-rose-700' : 'text-slate-700'}`}>
                          {section.label}
                          {isRequired && <span className="text-slate-400 ml-1">(Required)</span>}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {section.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Quick Select Options */}
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-sm text-slate-500 mr-2">Quick select:</span>
        <button
          type="button"
          onClick={() => {
            const defaultSections = SECTION_TOGGLES.filter(t => t.defaultEnabled).map(t => t.id);
            onChange(defaultSections);
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
        >
          Popular
        </button>
        <button
          type="button"
          onClick={() => {
            const allSections = SECTION_TOGGLES.map(t => t.id);
            onChange(allSections);
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Select All
        </button>
        <button
          type="button"
          onClick={() => onChange(['home'])}
          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Clear All
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
          Please select at least one section for your website
        </p>
      )}
    </div>
  );
}

