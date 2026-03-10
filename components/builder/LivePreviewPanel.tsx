'use client';

import { useMemo } from 'react';
import { SiteConfig, Theme, TimelineEvent } from '@/lib/types';

const themeStyles: Record<Theme, { bg: string; text: string; accent: string; card: string; gradient: string }> = {
  romantic_classic: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    card: 'bg-white/80 border-rose-200',
    gradient: 'from-rose-400 to-pink-500',
  },
  cute_pastel: {
    bg: 'bg-gradient-to-b from-purple-50 to-pink-50',
    text: 'text-purple-900',
    accent: 'text-purple-600',
    card: 'bg-white/80 border-purple-200',
    gradient: 'from-purple-400 to-pink-500',
  },
  minimal_modern: {
    bg: 'bg-gradient-to-b from-slate-50 to-gray-100',
    text: 'text-slate-900',
    accent: 'text-slate-600',
    card: 'bg-white/90 border-slate-200',
    gradient: 'from-slate-500 to-slate-700',
  },
  dark_elegant: {
    bg: 'bg-gradient-to-b from-zinc-900 to-slate-900',
    text: 'text-zinc-100',
    accent: 'text-amber-400',
    card: 'bg-zinc-800/80 border-zinc-700',
    gradient: 'from-amber-400 to-yellow-500',
  },
};

interface FormData {
  customer_name: string;
  partner_name: string;
  anniversary_date: string;
  tagline: string;
  message: string;
  song_link: string;
}

interface LivePreviewPanelProps {
  config: SiteConfig;
  form: FormData;
  photoPreviews: string[];
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function LivePreviewPanel({
  config,
  form,
  photoPreviews,
  isMobileOpen,
  onMobileClose,
}: LivePreviewPanelProps) {
  const theme = themeStyles[config.theme];
  
  const coverPhotoUrl = useMemo(() => {
    if (config.cover_photo_index !== undefined && config.cover_photo_index < photoPreviews.length) {
      return photoPreviews[config.cover_photo_index];
    }
    if (photoPreviews.length > 0) {
      return photoPreviews[0];
    }
    return null;
  }, [photoPreviews, config.cover_photo_index]);

  const coupleNames = useMemo(() => {
    if (form.customer_name && form.partner_name) {
      return `${form.customer_name} & ${form.partner_name}`;
    }
    if (form.customer_name) {
      return `${form.customer_name}'s Love Story`;
    }
    return 'Your Love Story';
  }, [form.customer_name, form.partner_name]);

  const formattedDate = useMemo(() => {
    if (form.anniversary_date) {
      const date = new Date(form.anniversary_date);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return null;
  }, [form.anniversary_date]);

  const content = (
    <div className={`w-full h-full ${theme.bg} p-4 overflow-y-auto`}>
      {/* Preview Header */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
          <span className={`text-xs font-medium ${theme.text} opacity-70`}>Live Preview</span>
        </div>
        <h3 className={`font-bold text-sm ${theme.text}`}>{coupleNames}</h3>
        <p className={`text-xs ${theme.text} opacity-60`}>yoursite.com/love/...</p>
      </div>

      {/* Cover Photo Preview */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Cover Photo</span>
        <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-200">
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl ${theme.text} opacity-30`}>💕</span>
            </div>
          )}
          {coverPhotoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
        </div>
      </div>

      {/* Tagline Preview */}
      {(form.tagline || coupleNames !== 'Your Love Story') && (
        <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
          <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>Tagline</span>
          <p className={`text-sm font-medium ${theme.text}`}>
            {form.tagline || (coupleNames !== 'Your Love Story' ? `"${coupleNames}"` : 'Your tagline here...')}
          </p>
        </div>
      )}

      {/* Relationship Info */}
      {formattedDate && (
        <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
          <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>Since</span>
          <p className={`text-sm font-medium ${theme.text}`}>{formattedDate}</p>
        </div>
      )}

      {/* Theme Colors Preview */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Theme Colors</span>
        <div className="flex gap-1">
          {config.theme === 'romantic_classic' && ['#BE185D', '#FBCFE8', '#881337', '#FDF4FF'].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'cute_pastel' && ['#F9A8D4', '#FDE68A', '#A7F3D0', '#E0E7FF'].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'minimal_modern' && ['#1F2937', '#F3F4F6', '#9CA3AF', '#FFFFFF'].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'dark_elegant' && ['#18181B', '#27272A', '#D4AF37', '#FAFAFA'].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-black/20" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Sections Preview */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Sections</span>
        <div className="space-y-1.5">
          {config.sections.length === 0 ? (
            <p className={`text-xs ${theme.text} opacity-50 italic`}>No sections selected</p>
          ) : (
            config.sections.map((section) => (
              <div key={section} className={`text-xs ${theme.text} flex items-center gap-2 bg-black/5 rounded px-2 py-1.5`}>
                <span className={theme.accent}>
                  {section === 'home' && '🏠'}
                  {section === 'gallery' && '📸'}
                  {section === 'timeline' && '📅'}
                  {section === 'song' && '🎵'}
                </span>
                <span className="font-medium capitalize">{section}</span>
                {section === 'gallery' && (
                  <span className="opacity-60">• Photos</span>
                )}
                {section === 'timeline' && config.timeline_events && config.timeline_events.length > 0 && (
                  <span className="opacity-60">• {config.timeline_events.length} events</span>
                )}
                {section === 'song' && form.song_link && (
                  <span className="opacity-60">• Added</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Timeline Events Preview */}
      {config.sections.includes('timeline') && config.timeline_events && config.timeline_events.length > 0 && (
        <div className={`${theme.card} rounded-lg p-3 border shadow-sm`}>
          <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Timeline Preview</span>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {config.timeline_events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 bg-gradient-to-r ${theme.gradient}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${theme.text} truncate`}>{event.title}</p>
                  {event.date && (
                    <p className={`text-xs ${theme.text} opacity-60`}>{event.date}</p>
                  )}
                </div>
              </div>
            ))}
            {config.timeline_events.length > 3 && (
              <p className={`text-xs ${theme.text} opacity-50`}>+{config.timeline_events.length - 3} more events</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Tip */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${theme.text} opacity-50`}>📱 Preview updates in real-time</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className={`${theme.card} rounded-2xl shadow-xl border overflow-hidden`}>
            <div className="px-4 py-3 border-b border-black/5">
              <h3 className={`font-semibold ${theme.text}`}>Live Preview</h3>
            </div>
            <div className="h-[600px]">
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Live Preview</h3>
              <button onClick={onMobileClose} className="p-1 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[50vh]">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

