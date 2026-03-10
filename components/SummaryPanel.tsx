'use client';
import { SiteConfig, Theme } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/builder-constants';

const getThemeLabel = (theme: Theme): string => {
  return THEME_PRESETS[theme]?.label || theme;
};

const getThemeColors = (theme: Theme): string[] => {
  return THEME_PRESETS[theme]?.preview || ['#BE185D', '#FBCFE8', '#881337', '#FDF4FF'];
};

const sectionLabels: Record<string, string> = {
  home: 'Home',
  gallery: 'Gallery',
  timeline: 'Timeline',
  song: 'Song',
};

const templateLabels: Record<string, string> = {
  hero_centered: 'Hero Centered',
  split_layout: 'Split Layout',
  fullscreen_banner: 'Fullscreen Banner',
  grid: 'Grid',
  carousel: 'Carousel',
  polaroid: 'Polaroid',
  vertical_timeline: 'Vertical Timeline',
  milestone_cards: 'Milestone Cards',
  story_chapters: 'Story Chapters',
  minimal_player: 'Minimal Player',
  visual_player: 'Visual Player',
  lyrics_card: 'Lyrics Card',
};

type Props = {
  config: SiteConfig;
  form: {
    website_name: string;
    customer_name: string;
    partner_name: string;
    anniversary_date: string;
    message: string;
    song_link?: string;
    photos: File[];
  };
};

export default function SummaryPanel({ config, form }: Props) {
  const hasGallery = config.sections.includes('gallery');
  const hasTimeline = config.sections.includes('timeline');

  return (
    <div className="space-y-6">
      {/* Theme Summary */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Selected Theme
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {getThemeColors(config.theme).map((color: string, i: number) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="font-medium text-slate-700">{getThemeLabel(config.theme)}</span>
        </div> REPLACE
      </div>

      {/* Sections Summary */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Selected Sections
        </h4>
        <div className="space-y-2">
          {config.sections.map((section) => (
            <div key={section} className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200">
              <span className="font-medium text-slate-700">{sectionLabels[section]}</span>
              <span className="text-sm text-slate-500">
                {section === 'home' && config.home_template && templateLabels[config.home_template]}
                {section === 'gallery' && config.gallery_template && templateLabels[config.gallery_template]}
                {section === 'timeline' && config.timeline_template && templateLabels[config.timeline_template]}
                {section === 'song' && config.song_template && templateLabels[config.song_template]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Info Summary */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Basic Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Website:</span>
            <span className="font-medium text-slate-700">yoursite.com/love/{form.website_name || '...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Couple:</span>
            <span className="font-medium text-slate-700">{form.customer_name || '...'} & {form.partner_name || '...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Anniversary:</span>
            <span className="font-medium text-slate-700">{form.anniversary_date || '...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Photos:</span>
            <span className="font-medium text-slate-700">{form.photos.length} uploaded</span>
          </div>
          {config.cover_photo_index !== undefined && form.photos.length > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Cover Photo:</span>
              <span className="font-medium text-rose-600">Photo {config.cover_photo_index + 1}</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {(hasGallery || hasTimeline) && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Validation Status
          </h4>
          <div className="space-y-2">
            {hasGallery && (
              <div className={`flex items-center gap-2 text-sm ${form.photos.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {form.photos.length > 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>Gallery section {form.photos.length > 0 ? 'has photos' : 'needs photos'}</span>
              </div>
            )}
            {hasTimeline && (
              <div className={`flex items-center gap-2 text-sm ${(config.timeline_events?.length ?? 0) > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {(config.timeline_events?.length ?? 0) > 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>Timeline section {config.timeline_events && config.timeline_events.length > 0 ? `has ${config.timeline_events.length} events` : 'needs events'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

