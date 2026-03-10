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
    tagline: string;
    message: string;
    song_link: string;
  };
  photoPreviews: string[];
  device: PreviewDevice;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

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

  // Get couple names
  const coupleNames = useMemo(() => {
    if (form.customer_name && form.partner_name) {
      return `${form.customer_name} & ${form.partner_name}`;
    }
    if (form.customer_name) {
      return `${form.customer_name}'s Love Story`;
    }
    return 'Your Love Story';
  }, [form.customer_name, form.partner_name]);

  // Format date
  const formattedDate = useMemo(() => {
    if (form.anniversary_date) {
      return new Date(form.anniversary_date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    return null;
  }, [form.anniversary_date]);

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
      className={`h-full overflow-y-auto ${device === 'mobile' ? 'px-2' : 'p-4'}`}
      style={{ backgroundColor: themePreset.colors.background }}
    >
      {/* Website Header */}
      <div 
        className="rounded-lg p-3 mb-3 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
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
        <h3 className="font-bold text-sm" style={{ color: themePreset.colors.text }}>
          {coupleNames}
        </h3>
        <p className="text-xs" style={{ color: themePreset.colors.text, opacity: 0.6 }}>
          yoursite.com/love/...
        </p>
      </div>

      {/* Cover Photo Preview */}
      <div 
        className="rounded-lg overflow-hidden mb-3 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <div className="relative aspect-video">
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
              <span className="text-4xl">💕</span>
            </div>
          )}
          {coverPhotoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
          {/* Hero overlay content */}
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="font-bold text-white text-lg drop-shadow-md">{coupleNames}</h2>
            {form.tagline && (
              <p className="text-white/90 text-sm drop-shadow-sm">"{form.tagline}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Relationship Info */}
      {formattedDate && (
        <div 
          className="rounded-lg p-3 mb-3 shadow-sm"
          style={{ 
            backgroundColor: themePreset.colors.card,
            borderColor: themePreset.colors.border,
            borderWidth: '1px'
          }}
        >
          <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            Together Since
          </span>
          <p className="font-semibold text-sm" style={{ color: themePreset.colors.text }}>
            {formattedDate}
          </p>
        </div>
      )}

      {/* Love Message Preview */}
      {form.message && enabledSections.includes('love_letter') && (
        <div 
          className="rounded-lg p-3 mb-3 shadow-sm"
          style={{ 
            backgroundColor: themePreset.colors.card,
            borderColor: themePreset.colors.border,
            borderWidth: '1px'
          }}
        >
          <span className="text-xs font-medium block mb-1" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            💌 Love Letter
          </span>
          <p className="text-sm" style={{ color: themePreset.colors.text }}>
            {form.message.length > 100 ? form.message.substring(0, 100) + '...' : form.message}
          </p>
        </div>
      )}

      {/* Sections Preview */}
      <div 
        className="rounded-lg p-3 mb-3 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <span className="text-xs font-medium block mb-2" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
          📄 Sections
        </span>
        <div className="space-y-2">
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
                  <span className="font-medium" style={{ color: themePreset.colors.text }}>
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

      {/* Theme Colors */}
      <div 
        className="rounded-lg p-3 shadow-sm"
        style={{ 
          backgroundColor: themePreset.colors.card,
          borderColor: themePreset.colors.border,
          borderWidth: '1px'
        }}
      >
        <span className="text-xs font-medium block mb-2" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
          🎨 Theme: {themePreset.label}
        </span>
        <div className="flex gap-1">
          {themePreset.preview.map((color, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {layoutPreset && (
          <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: themePreset.colors.text, opacity: 0.7 }}>
            <span>{layoutPreset.previewEmoji}</span>
            <span>{layoutPreset.label} Layout</span>
          </div>
        )}
      </div>

      {/* Mobile Tip */}
      <div className="mt-4 text-center">
        <p className="text-xs" style={{ color: themePreset.colors.text, opacity: 0.5 }}>
          📱 {device === 'mobile' ? 'Mobile' : 'Desktop'} Preview • Updates in real-time
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
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{ 
                borderColor: themePreset.colors.border,
                backgroundColor: themePreset.colors.card
              }}
            >
              <h3 className="font-semibold" style={{ color: themePreset.colors.text }}>
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
              style={{ height: '600px' }}
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

