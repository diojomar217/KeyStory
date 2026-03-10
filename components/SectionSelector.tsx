'use client';
import { Section } from '@/lib/types';
import React from 'react';

const allSections: { key: Section; label: string; icon: React.ReactNode }[] = [
  { 
    key: 'home', 
    label: 'Home',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    key: 'gallery', 
    label: 'Gallery',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    key: 'timeline', 
    label: 'Timeline',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
];

type Props = {
  value: Section[];
  onChange: (sections: Section[]) => void;
};

export default function SectionSelector({ value, onChange }: Props) {
  const toggle = (key: Section) => {
    if (value.includes(key)) {
      onChange(value.filter((s) => s !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">2</span>
        <h3 className="text-lg font-semibold text-slate-800">Select Website Sections</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {allSections.map((s, index) => {
          const isSelected = value.includes(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                font-medium text-sm transition-all duration-200
                hover:scale-105 active:scale-95
                opacity-0 animate-fade-in-up
                ${isSelected 
                  ? 'bg-rose-500 text-white shadow-md hover:bg-rose-600 hover:shadow-lg scale-105' 
                  : 'bg-white text-rose-500 border-2 border-rose-300 hover:border-rose-500 hover:bg-rose-50'
                }
              `}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <span className={`transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>
                {s.icon}
              </span>
              {s.label}
              {isSelected && (
                <svg className="w-3.5 h-3.5 ml-1 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg animate-fade-in">
          Please select at least one section for your website
        </p>
      )}
    </div>
  );
}

