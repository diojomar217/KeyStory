'use client';

import React from 'react';
import { SiteConfig, Theme, LayoutPreset, Section } from '@/lib/types';
import { THEME_PRESETS, LAYOUT_PRESETS, SECTION_TOGGLES } from '@/lib/builder-constants';

interface ReviewPublishPanelProps {
  form: {
    website_name: string;
    customer_name: string;
    partner_name: string;
    specialDate?: string;
    anniversary_date?: string;
    message: string;
    tagline?: string;
    song_link?: string;
    photos: File[];
  };
  config: SiteConfig;
  onSaveDraft: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

export default function ReviewPublishPanel({
  form,
  config,
  onSaveDraft,
  onPublish,
  isPublishing = false,
}: ReviewPublishPanelProps) {
  const themePreset = THEME_PRESETS[config.theme];
  const layoutPreset = LAYOUT_PRESETS.find(p => p.key === config.layout_preset);
  
  // Get enabled sections
  const enabledSections: Section[] = Object.entries(config.section_toggles || {})
    .filter(([_, enabled]) => enabled)
    .map(([section]) => section as Section);

  // If section_toggles not set, fall back to config.sections
  const sections = enabledSections.length > 0 ? enabledSections : config.sections;
  
  const photoCount = form.photos.length;
  const timelineEventCount = config.timeline_events?.length || 0;
  
  const hasMusic = form.song_link && form.song_link.length > 0;
  const hasCoverPhoto = config.cover_photo_index !== undefined || photoCount > 0;

  // Format date
  const dateString = form.specialDate || form.anniversary_date;
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not set';

  return (
    <div className="space-y-6">
      {/* Website Overview */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💕</span>
          Website Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Website Name */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Website URL</span>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              yoursite.com/site/{form.website_name || '...'}
            </p>
          </div>

          {/* Couple Names */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Couple</span>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              {form.customer_name || '...'} & {form.partner_name || '...'}
            </p>
          </div>

          {/* Anniversary */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Anniversary</span>
            <p className="text-lg font-semibold text-slate-800 mt-1">{formattedDate}</p>
          </div>

          {/* Tagline */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tagline</span>
            <p className="text-lg font-semibold text-slate-800 mt-1 italic">
              "{form.tagline || 'No tagline'}"
            </p>
          </div>
        </div>
      </div>

      {/* Theme & Layout */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🎨</span>
          Theme & Style
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Theme */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Theme</span>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex gap-1">
                {themePreset.preview.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-800">{themePreset.label}</span>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Layout</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl">{layoutPreset?.previewEmoji}</span>
              <span className="font-semibold text-slate-800">{layoutPreset?.label || 'Default'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📄</span>
          Website Sections ({sections.length})
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sections.map((section) => {
            const toggle = SECTION_TOGGLES.find(t => t.id === section);
            return (
              <div 
                key={section}
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <span className="text-xl">{toggle?.icon}</span>
                <span className="font-medium text-slate-700">{toggle?.label || section}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📸</span>
          Content Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-rose-500">{photoCount}</div>
            <div className="text-sm text-slate-500">Photos</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-rose-500">{timelineEventCount}</div>
            <div className="text-sm text-slate-500">Timeline Events</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className="text-3xl font-bold text-rose-500">{sections.length}</div>
            <div className="text-sm text-slate-500">Sections</div>
          </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
            <div className={`text-3xl font-bold ${hasMusic ? 'text-emerald-500' : 'text-slate-300'}`}>
              {hasMusic ? '✓' : '—'}
            </div>
            <div className="text-sm text-slate-500">Music</div>
          </div>
        </div>

        {/* Love Message Preview */}
        <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">Love Message Preview</span>
          <p className="text-sm text-slate-600 mt-2 line-clamp-3">
            {form.message || 'No message written yet...'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Draft
        </button>
        
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPublishing ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Publish Website
            </>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-sm text-slate-400">
        By publishing, you agree to create this beautiful memory for your special someone. 💕
      </p>
    </div>
  );
}

