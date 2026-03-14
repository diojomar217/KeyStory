'use client';

import { useMemo } from 'react';
import { SiteConfig, Theme } from '@/lib/types';

const themeStyles: Record<Theme, { bg: string; text: string; accent: string; card: string; gradient: string }> = {
  romantic_classic: { bg: 'bg-gradient-to-b from-rose-50 to-pink-50', text: 'text-rose-900', accent: 'text-rose-600', card: 'bg-white/80 border-rose-200', gradient: 'from-rose-400 to-pink-500' },
  cute_pastel: { bg: 'bg-gradient-to-b from-purple-50 to-pink-50', text: 'text-purple-900', accent: 'text-purple-600', card: 'bg-white/80 border-purple-200', gradient: 'from-purple-400 to-pink-500' },
  minimal_modern: { bg: 'bg-gradient-to-b from-slate-50 to-gray-100', text: 'text-slate-900', accent: 'text-slate-600', card: 'bg-white/90 border-slate-200', gradient: 'from-slate-500 to-slate-700' },
  dark_elegant: { bg: 'bg-gradient-to-b from-zinc-900 to-slate-900', text: 'text-zinc-100', accent: 'text-amber-400', card: 'bg-zinc-800/80 border-zinc-700', gradient: 'from-amber-400 to-yellow-500' },
  soft_pastel: { bg: 'bg-gradient-to-b from-amber-50 to-yellow-50', text: 'text-amber-900', accent: 'text-amber-600', card: 'bg-white/80 border-amber-200', gradient: 'from-amber-400 to-yellow-500' },
  elegant_rose_gold: { bg: 'bg-gradient-to-b from-rose-50 to-pink-50', text: 'text-rose-900', accent: 'text-rose-600', card: 'bg-white/80 border-rose-200', gradient: 'from-rose-400 to-pink-500' },
  vintage_love_letter: { bg: 'bg-gradient-to-b from-amber-50 to-orange-50', text: 'text-amber-900', accent: 'text-amber-600', card: 'bg-white/80 border-amber-200', gradient: 'from-amber-400 to-orange-500' },
  scrapbook_memories: { bg: 'bg-gradient-to-b from-orange-50 to-amber-50', text: 'text-orange-900', accent: 'text-orange-600', card: 'bg-white/80 border-orange-200', gradient: 'from-orange-400 to-amber-500' },
  wedding_style: { bg: 'bg-gradient-to-b from-slate-50 to-gray-100', text: 'text-slate-900', accent: 'text-amber-600', card: 'bg-white/80 border-slate-200', gradient: 'from-slate-400 to-slate-600' },
  floral_romance: { bg: 'bg-gradient-to-b from-rose-50 to-pink-50', text: 'text-rose-900', accent: 'text-rose-600', card: 'bg-white/80 border-rose-200', gradient: 'from-rose-400 to-pink-500' },
  dreamy_pink: { bg: 'bg-gradient-to-b from-pink-50 to-rose-50', text: 'text-pink-900', accent: 'text-pink-600', card: 'bg-white/80 border-pink-200', gradient: 'from-pink-400 to-rose-500' },
  luxury_gold: { bg: 'bg-gradient-to-b from-zinc-900 to-slate-900', text: 'text-yellow-100', accent: 'text-yellow-400', card: 'bg-zinc-800/80 border-zinc-700', gradient: 'from-yellow-400 to-amber-500' },
  minimal_white: { bg: 'bg-gradient-to-b from-white to-gray-50', text: 'text-slate-900', accent: 'text-slate-600', card: 'bg-white border-slate-200', gradient: 'from-slate-400 to-slate-600' },
  cute_kawaii: { bg: 'bg-gradient-to-b from-pink-50 to-purple-50', text: 'text-pink-900', accent: 'text-pink-600', card: 'bg-white/80 border-pink-200', gradient: 'from-pink-400 to-purple-500' },
  soft_lavender: { bg: 'bg-gradient-to-b from-violet-50 to-purple-50', text: 'text-violet-900', accent: 'text-violet-600', card: 'bg-white/80 border-violet-200', gradient: 'from-violet-400 to-purple-500' },
  photo_focus: { bg: 'bg-gradient-to-b from-gray-50 to-slate-100', text: 'text-slate-900', accent: 'text-slate-600', card: 'bg-white border-slate-200', gradient: 'from-slate-400 to-slate-600' },
  colorful_celebration: { bg: 'bg-gradient-to-r from-yellow-50 to-orange-50', text: 'text-orange-900', accent: 'text-orange-600', card: 'bg-white/80 border-orange-200', gradient: 'from-orange-400 to-pink-500' },
};

interface FormData {
  customer_name: string;
  partner_name: string;
  specialDate?: string;
  anniversary_date?: string;
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

// Helper to check if user has entered any name data
const hasNameData = (form: FormData): boolean => {
  return !!(form.customer_name?.trim() || form.partner_name?.trim());
};

// Helper to get display names with proper empty state
const getDisplayNames = (form: FormData): { hasContent: boolean; primary: string; secondary?: string } => {
  const hasCustomer = form.customer_name?.trim();
  const hasPartner = form.partner_name?.trim();
  
  if (hasCustomer && hasPartner) {
    return { 
      hasContent: true, 
      primary: `${form.customer_name} & ${form.partner_name}` 
    };
  }
  if (hasCustomer) {
    return { 
      hasContent: true, 
      primary: `${form.customer_name}'s Love Story` 
    };
  }
  return { 
    hasContent: false, 
    primary: 'Add your names' 
  };
};

// Helper to get tagline with proper empty state
const getDisplayTagline = (form: FormData): { hasContent: boolean; text: string } => {
  if (form.tagline?.trim()) {
    return { hasContent: true, text: form.tagline };
  }
  return { hasContent: false, text: 'Your tagline will appear here' };
};

// Helper to get special date with proper empty state
const getDisplayAnniversary = (form: FormData): { hasContent: boolean; text: string } => {
  const dateString = form.specialDate || form.anniversary_date;
  if (dateString) {
    const date = new Date(dateString);
    return {
      hasContent: true,
      text: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  }
  return { hasContent: false, text: 'Add your special date' };
};

export default function LivePreviewPanel({
  config,
  form,
  photoPreviews,
  isMobileOpen,
  onMobileClose,
}: LivePreviewPanelProps) {
  const theme = themeStyles[config.theme] || themeStyles.romantic_classic;

  const coverPhotoUrl = useMemo(() => {
    if (config.cover_photo_index !== undefined && config.cover_photo_index < photoPreviews.length) {
      return photoPreviews[config.cover_photo_index];
    }
    if (photoPreviews.length > 0) {
      return photoPreviews[0];
    }
    return null;
  }, [photoPreviews, config.cover_photo_index]);

  // Use helper functions for proper empty state handling
  const nameData = useMemo(() => getDisplayNames(form), [form.customer_name, form.partner_name]);
  const taglineData = useMemo(() => getDisplayTagline(form), [form.tagline]);
  const anniversaryData = useMemo(() => getDisplayAnniversary(form), [form.anniversary_date, form.specialDate]);

  const content = (
    <div className={`w-full h-full ${theme.bg} p-3 overflow-y-auto`}>
      {/* Website Header - Compact */}
      <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
          <span className={`text-xs font-medium ${theme.text} opacity-70`}>Live Preview</span>
        </div>
        <h3 className={`font-bold text-sm truncate ${nameData.hasContent ? theme.text : `${theme.text} opacity-40 italic`}`}>
          {nameData.primary}
        </h3>
        <p className={`text-xs ${theme.text} opacity-50 truncate`}>yoursite.com/site/...</p>
      </div>

      {/* Cover Photo - More compact aspect ratio */}
      <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1.5`}>Cover Photo</span>
        <div className="relative rounded-lg overflow-hidden aspect-[16/10] bg-slate-100">
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className={`text-3xl ${theme.text} opacity-25`}>📷</span>
              <span className={`text-xs ${theme.text} opacity-40 italic`}>Add a cover photo</span>
            </div>
          )}
          {coverPhotoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
          {/* Hero overlay - matches actual hero structure */}
          {coverPhotoUrl && (nameData.hasContent || taglineData.hasContent) && (
            <div className="absolute bottom-2 left-2 right-2">
              {nameData.hasContent && (
                <h2 className="font-bold text-white text-sm truncate drop-shadow-md">
                  {form.customer_name && form.partner_name ? `${form.customer_name} & ${form.partner_name}` : nameData.primary}
                </h2>
              )}
              {taglineData.hasContent && (
                <p className="text-white/90 text-xs truncate drop-shadow-sm">&ldquo;{form.tagline}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Names & Tagline Section - Combined for better layout */}
      {(nameData.hasContent || taglineData.hasContent || !nameData.hasContent) && (
        <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
          {/* Names */}
          <div className="mb-2">
            <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>Names</span>
            <p className={`text-sm font-medium truncate ${nameData.hasContent ? theme.text : `${theme.text} opacity-40 italic`}`}>
              {nameData.primary}
            </p>
          </div>
          
          {/* Tagline - Only show if there's content or we want to show placeholder */}
          <div>
            <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>Tagline</span>
            <p className={`text-sm truncate ${taglineData.hasContent ? `${theme.text} font-medium` : `${theme.text} opacity-40 italic`}`}>
              {taglineData.hasContent ? `"${form.tagline}"` : taglineData.text}
            </p>
          </div>
        </div>
      )}

      {/* Anniversary Section */}
      <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>Together Since</span>
        <p className={`text-sm truncate ${anniversaryData.hasContent ? 'font-semibold' : 'italic opacity-50'}`} style={{ color: anniversaryData.hasContent ? undefined : 'inherit' }}>
          {anniversaryData.text}
        </p>
      </div>

      {/* Love Message Section - Added to fix missing love message display */}
      <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-1`}>💌 Love Message</span>
        {form.message?.trim() ? (
          <p className={`text-sm ${theme.text} line-clamp-3`}>
            {form.message.length > 100 ? form.message.substring(0, 100) + '...' : form.message}
          </p>
        ) : (
          <p className={`text-sm italic ${theme.text} opacity-40`}>
            Your love message will appear here
          </p>
        )}
      </div>

      {/* Sections Preview */}
      <div className={`${theme.card} rounded-lg p-2.5 mb-2.5 border shadow-sm`}>
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
                  {section === 'love_letter' && '💌'}
                  {section === 'our_story' && '📖'}
                  {section === 'quotes' && '💕'}
                  {section === 'milestones' && '🏆'}
                  {section === 'future_dreams' && '💭'}
                  {section === 'anniversary_countdown' && '⏰'}
                  {section === 'relationship_stats' && '📊'}
                  {section === 'first_date' && '🌹'}
                  {section === 'special_moments' && '⭐'}
                  {section === 'guest_messages' && '💬'}
                  {section === 'polaroid_gallery' && '🖼️'}
                  {section === 'playlist' && '🎶'}
                  {section === 'video_memories' && '🎬'}
                  {section === 'reasons_love_you' && '💖'}
                  {section === 'memory_map' && '🗺️'}
                  {section === 'letter_future' && '📮'}
                  {section === 'gift_section' && '🎁'}
                  {section === 'qr_keepsake' && '🎴'}
                  {section === 'surprise_message' && '🎉'}
                </span>
                <span className="font-medium capitalize">{section.replace(/_/g, ' ')}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className={`text-xs ${theme.text} opacity-40`}>📱 Updates as you type</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className={`${theme.card} rounded-2xl shadow-xl border overflow-hidden`}>
            <div className="px-3 py-2.5 border-b border-black/5">
              <h3 className={`font-semibold text-sm ${theme.text}`}>Live Preview</h3>
            </div>
            <div className="h-[550px]">{content}</div>
          </div>
        </div>
      </div>

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
            <div className="h-[50vh]">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}

