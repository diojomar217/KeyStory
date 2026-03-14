'use client';
import { Section } from '@/lib/types';
import { 
  getSectionTemplates, 
  getSectionTemplateLabel,
  getSectionMetadata 
} from '@/lib/section-registry';
import React from 'react';

type Props = {
  section: Section;
  value?: string;
  onChange: (template: string) => void;
};

const sectionLabels: Record<Section, string> = {
  home: 'Home Template',
  gallery: 'Gallery Template',
  timeline: 'Timeline Template',
  song: 'Song Template',
  love_letter: 'Love Letter Template',
  qr_keepsake: 'QR Keepsake Template',
  our_story: 'Our Story Template',
  first_date: 'First Date Template',
  special_moments: 'Special Moments Template',
  milestones: 'Milestones Template',
  polaroid_gallery: 'Polaroid Gallery Template',
  playlist: 'Playlist Template',
  video_memories: 'Video Memories Template',
  relationship_stats: 'Relationship Stats Template',
  anniversary_countdown: 'Anniversary Countdown Template',
  birthday_message: 'Birthday Message Template',
  birthday_wishes: 'Birthday Wishes Template',
  birthday_countdown: 'Birthday Countdown Template',
  birthday_timeline: 'Birthday Timeline Template',
  party_details: 'Party Details Template',
  gift_wishlist: 'Gift Wishlist Template',
  future_dreams: 'Future Dreams Template',
  quotes: 'Love Quotes Template',
  reasons_love_you: 'Reasons I Love You Template',
  memory_map: 'Memory Map Template',
  guest_messages: 'Guest Messages Template',
  letter_future: 'Letter to Future Template',
  gift_section: 'Gift Section Template',
  surprise_message: 'Surprise Message Template',
};

export default function TemplateSelector({ section, value, onChange }: Props) {
  // Get templates from registry
  const templates = getSectionTemplates(section);
  const label = getSectionTemplateLabel(section);
  const metadata = getSectionMetadata(section);
  
  // If no templates available for this section, show a message
  if (templates.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">5</span>
          <h3 className="text-lg font-semibold text-slate-800">{sectionLabels[section] || section}</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500">
            This section uses default styling. No template selection needed.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm font-semibold">5</span>
        <h3 className="text-lg font-semibold text-slate-800">{label}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((t, index) => {
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

