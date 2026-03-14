'use client';

import { useMemo } from 'react';
import { SiteConfig, Theme, PreviewDevice } from '@/lib/types';
import { THEME_PRESETS, LAYOUT_PRESETS, SECTION_TOGGLES } from '@/lib/builder-constants';

interface BuilderPreviewProps {
  config: SiteConfig;
  form: {
    customer_name: string;
    partner_name: string;
    anniversary_date: string;
    specialDate?: string;
    tagline: string;
    message: string;
    song_link: string;
  };
  photoPreviews: string[];
  device: PreviewDevice;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// Helper to get display names with proper empty state
const getDisplayNames = (form: { customer_name: string; partner_name: string }): { hasContent: boolean; primary: string } => {
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
const getDisplayTagline = (form: { tagline: string }): { hasContent: boolean; text: string } => {
  if (form.tagline?.trim()) {
    return { hasContent: true, text: form.tagline };
  }
  return { hasContent: false, text: 'Your tagline will appear here' };
};

// Helper to get special date with proper empty state
const getDisplayAnniversary = (form: { anniversary_date?: string; specialDate?: string }): { hasContent: boolean; text: string } => {
  const dateString = form.specialDate || form.anniversary_date;
  if (dateString) {
    const date = new Date(dateString);
    return {
      hasContent: true,
      text: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  }
  return { hasContent: false, text: 'Add special date' };
};

export default function BuilderPreview({
  config,
  form,
  photoPreviews,
  device,
  isMobileOpen,
  onMobileClose,
}: BuilderPreviewProps) {
  const themePreset = THEME_PRESETS[config.theme];
  const layoutPreset = LAYOUT_PRESETS.find(p => p.key === config.layout_preset);
  
  // Get enabled sections
  const enabledSections = useMemo(() => {
    if (config.section_toggles) {
      return Object.entries(config.section_toggles)
        .filter(([_, enabled]) => enabled)
        .map(([section]) => section);
    }
    return config.sections;
  }, [config.section_toggles, config.sections]);

  // Get cover photo
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

  // Format date for display
  const formattedDate = useMemo(() => {
    const dateString = form.specialDate || form.anniversary_date;
    if (dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return null;
  }, [form.anniversary_date, form.specialDate]);

  // Theme styles
  const themeStyles = useMemo(() => {
    const t = themePreset;
    return {
      bg: `bg-[${t.colors.background}]`,
      text: `text-[${t.colors.text}]`,
      accent: `text-[${t.colors.primary}]`,
      card: `bg-[${t.colors.card}] border-[${t.colors.border}]`,
      gradient: `from-[${t.colors.primary}] to-[${t.colors.accent}]`,
    };
  }, [themePreset]);

  // Preview dimensions based on device
  const previewDimensions = device === 'mobile' 
    ? 'max-w-[320px] mx-auto' 
    : 'w-full';

  const previewContent = (
    <div 
      className={`h-full overflow-y-auto ${device === 'mobile' ? 'px-2' : 'p-3'}`}
      style={{ backgroundColor: themePreset.colors.background }}
    >
      {/* Website Header - Compact */}
      <div 
className={`rounded-xl p-4 mb-4 shadow-md border-dashed ${nameData.hasContent ? '' : 'border-gray-200/50 opacity-80'}`}
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: nameData.hasContent ? '1px' : '2px'
        }}

      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${previewDimensions.includes('max-w') ? 'from-pink-400 to-rose-500' : ''}`} 
              style={{ background: `linear-gradient(to right, ${themePreset.colors.primary}, ${themePreset.colors.accent})` }}
            />
            <span className="text-xs font-medium" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
              Live Preview
            </span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
        </div>
        <h3 className="font-bold text-sm truncate" style={{ color: nameData.hasContent ? themePreset.colors.text : themePreset.colors.text, opacity: nameData.hasContent ? 1 : 0.4 }}>
          {nameData.primary}
        </h3>
        <p className="text-xs truncate" style={{ color: themePreset.colors.text, opacity: 0.5 }}>
          yoursite.com/site/...
        </p>
      </div>

      {/* Cover Photo Preview - More compact */}
      <div 
        className="rounded-lg overflow-hidden mb-2 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <div className="relative aspect-[16/10]">
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: themePreset.colors.background, opacity: 0.8 }}>
              <span className="text-2xl mb-1" style={{ opacity: 0.3 }}>📷</span>
              <span className="text-xs italic" style={{ color: themePreset.colors.text, opacity: 0.4 }}>Add a cover photo</span>
            </div>
          )}
          {coverPhotoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
          {/* Hero overlay - matches actual hero structure from HomeSection */}
{coverPhotoUrl && (nameData.hasContent || taglineData.hasContent) && (
            <div className="absolute bottom-6 left-3 right-3 p-3 bg-black/60 backdrop-blur-sm rounded-t-xl">
              {nameData.hasContent && (
                <h2 className="font-bold text-white text-base leading-tight line-clamp-1 drop-shadow-lg mb-1">
                  {form.customer_name && form.partner_name ? `${form.customer_name} & ${form.partner_name}` : nameData.primary}
                </h2>
              )}
              {taglineData.hasContent && (
                <p className="text-white/95 text-sm leading-tight line-clamp-1 drop-shadow-lg">&ldquo;{form.tagline}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Names & Tagline Section - Combined for better layout */}
      <div 
        className="rounded-lg p-2.5 mb-2 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        {/* Names */}
        <div className="mb-2">
          <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            Names
          </span>
          <p 
            className={`text-sm font-medium truncate ${!nameData.hasContent ? 'italic' : ''}`}
            style={{ 
              color: themePreset.colors.text,
              opacity: nameData.hasContent ? 1 : 0.4
            }}
          >
            {nameData.primary}
          </p>
        </div>
        
        {/* Tagline */}
        <div>
          <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            Tagline
          </span>
          <p 
            className={`text-sm truncate ${!taglineData.hasContent ? 'italic' : ''}`}
            style={{ 
              color: themePreset.colors.text,
              opacity: taglineData.hasContent ? 1 : 0.4
            }}
          >
            {taglineData.hasContent ? `"${form.tagline}"` : taglineData.text}
          </p>
        </div>
      </div>

      {/* Anniversary Section - Always visible with placeholder */}
      <div 
        className="rounded-lg p-2.5 mb-2 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
          Together Since
        </span>
        <p 
          className={`text-sm truncate ${!anniversaryData.hasContent ? 'italic' : ''}`}
          style={{ 
            color: themePreset.colors.text,
            opacity: anniversaryData.hasContent ? 1 : 0.4,
            fontWeight: anniversaryData.hasContent ? 600 : 400
          }}
        >
          {anniversaryData.text}
        </p>
      </div>

      {/* Love Message Section - Always visible with placeholder when empty */}
      <div 
        className="rounded-lg p-2.5 mb-2 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
          💌 Love Message
        </span>
        {form.message?.trim() ? (
          <p className="text-sm line-clamp-3" style={{ color: themePreset.colors.text }}>
            {form.message.length > 80 ? form.message.substring(0, 80) + '...' : form.message}
          </p>
        ) : (
          <p className="text-sm italic" style={{ color: themePreset.colors.text, opacity: 0.4 }}>
            Your love message will appear here
          </p>
        )}
      </div>

      {/* Sections Preview */}
      <div 
        className="rounded-lg p-2.5 mb-2 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <span className="text-xs font-medium block mb-2" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
          📄 Sections
        </span>
        <div className="space-y-1.5">
          {enabledSections.length === 0 ? (
            <p className="text-xs italic" style={{ color: themePreset.colors.text, opacity: 0.5 }}>
              No sections enabled
            </p>
          ) : (
            enabledSections.map((section) => {
              const toggle = SECTION_TOGGLES.find(t => t.id === section);
              return (
                <div 
                  key={section}
                  className="flex items-center gap-2 text-xs rounded px-2 py-1.5"
                  style={{ 
                    backgroundColor: themePreset.colors.background,
                    opacity: 0.8
                  }}
                >
                  <span>{toggle?.icon}</span>
                  <span className="font-medium truncate" style={{ color: themePreset.colors.text }}>
                    {toggle?.label || section}
                  </span>
                  {section === 'gallery' && (
                    <span style={{ color: themePreset.colors.text, opacity: 0.6 }}>
                      • {photoPreviews.length} photos
                    </span>
                  )}
                  {section === 'timeline' && config.timeline_events && config.timeline_events.length > 0 && (
                    <span style={{ color: themePreset.colors.text, opacity: 0.6 }}>
                      • {config.timeline_events.length} events
                    </span>
                  )}
                  {section === 'song' && form.song_link && (
                    <span style={{ color: themePreset.colors.text, opacity: 0.6 }}>
                      • Added
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Theme Colors - Compact */}
      <div 
        className="rounded-lg p-2.5 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            🎨 {themePreset.label}
          </span>
          <div className="flex gap-1">
            {themePreset.preview.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {layoutPreset && (
            <span className="text-xs" style={{ color: themePreset.colors.text, opacity: 0.6 }}>
              {layoutPreset.previewEmoji} {layoutPreset.label}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Tip */}
      <div className="mt-3 text-center">
        <p className="text-xs" style={{ color: themePreset.colors.text, opacity: 0.4 }}>
          📱 {device === 'mobile' ? 'Mobile' : 'Desktop'} • Updates as you type
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-1 min-w-0">
        <div className="sticky top-4">
          <div 
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ 
              backgroundColor: themePreset.colors.background,
              borderWidth: '1px',
              borderColor: themePreset.colors.border
            }}
          >
            {/* Preview Header */}
            <div 
              className="px-3 py-2.5 border-b flex items-center justify-between"
              style={{ 
                borderColor: themePreset.colors.border,
                backgroundColor: themePreset.colors.card
              }}
            >
              <h3 className="font-semibold text-sm" style={{ color: themePreset.colors.text }}>
                Live Preview
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full ${device === 'mobile' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${device === 'desktop' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                </div>
              </div>
            </div>
            
            {/* Preview Content */}
            <div 
              className={`${previewDimensions} transition-all duration-300`}
              style={{ height: '550px' }}
            >
              {previewContent}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose}></div>
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh] overflow-hidden animate-slide-up"
            style={{ backgroundColor: themePreset.colors.background }}
          >
            <div 
              className="p-4 flex items-center justify-between border-b"
              style={{ 
                borderColor: themePreset.colors.border,
                backgroundColor: themePreset.colors.card
              }}
            >
              <h3 className="font-semibold" style={{ color: themePreset.colors.text }}>
                Live Preview
              </h3>
              <button 
                onClick={onMobileClose} 
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[60vh] overflow-y-auto">
              {previewContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

