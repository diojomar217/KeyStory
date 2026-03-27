'use client';

import React from 'react';
import { Section } from '@/lib/types';
import { SECTION_CONFIG } from '@/config/sectionConfig';

interface SectionTogglePanelProps {
  toggles: Record<Section, boolean>;
  onChange: (toggles: Record<Section, boolean>) => void;
}

export default function SectionTogglePanel({ toggles, onChange }: SectionTogglePanelProps) {
  const handleToggle = (section: Section) => {
    const toggle = SECTION_CONFIG.find(t => t.key === section);
    if (toggle?.required) return; // Cannot toggle required sections
    
    onChange({
      ...toggles,
      [section]: !toggles[section],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Website Sections</h3>
          <p className="text-sm text-slate-500">Enable or disable sections for your website</p>
        </div>
      </div>

      <div className="grid gap-3">
        {SECTION_CONFIG.map((section) => {
          const isEnabled = toggles[section.key as Section] ?? section.defaultEnabled;
          const isRequired = section.required;
          
          return (
            <div
              key={section.key}
              className={`
                relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
                ${isEnabled 
                  ? 'bg-white border-rose-200 shadow-sm' 
                  : 'bg-slate-50 border-slate-200'
                }
                ${isRequired ? 'opacity-75' : 'cursor-pointer hover:border-rose-300'}
              `}
              onClick={() => !isRequired && handleToggle(section.key as Section)}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${isEnabled ? 'bg-rose-100' : 'bg-slate-200'}
              `}>
                {section.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800">{section.label}</h4>
                  {isRequired && (
                    <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{section.description}</p>
              </div>

              {/* Toggle Switch */}
              <div className="flex-shrink-0">
                {isRequired ? (
                  <div className="w-10 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className={`
                    relative w-11 h-6 rounded-full transition-colors duration-200
                    ${isEnabled ? 'bg-rose-500' : 'bg-slate-300'}
                  `}>
                    <div className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                      ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {Object.values(toggles).filter(Boolean).length} sections enabled
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">
            {SECTION_CONFIG.filter(s => !s.required).length} optional
          </span>
        </div>
      </div>
    </div>
  );
}

