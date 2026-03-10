'use client';
import { SiteConfig, Theme } from '@/lib/types';

const themeStyles: Record<Theme, { bg: string; text: string; accent: string; card: string }> = {
  romantic_classic: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    card: 'bg-white/80 border-rose-200',
  },
  cute_pastel: {
    bg: 'bg-gradient-to-b from-purple-50 to-pink-50',
    text: 'text-purple-900',
    accent: 'text-purple-600',
    card: 'bg-white/80 border-purple-200',
  },
  minimal_modern: {
    bg: 'bg-gradient-to-b from-slate-50 to-gray-100',
    text: 'text-slate-900',
    accent: 'text-slate-600',
    card: 'bg-white/90 border-slate-200',
  },
  dark_elegant: {
    bg: 'bg-gradient-to-b from-zinc-900 to-slate-900',
    text: 'text-zinc-100',
    accent: 'text-amber-400',
    card: 'bg-zinc-800/80 border-zinc-700',
  },
};

const templateIcons: Record<string, React.ReactNode> = {
  hero_centered: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2H4V6z" />
    </svg>
  ),
  split_layout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  fullscreen_banner: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  grid: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  carousel: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  polaroid: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    </svg>
  ),
  vertical_timeline: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  milestone_cards: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  story_chapters: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

type Props = {
  config: SiteConfig;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export default function LivePreview({ config, isMobileOpen, onMobileClose }: Props) {
  const theme = themeStyles[config.theme];
  const sections = config.sections;
  
  const sectionLabels: Record<string, string> = {
    home: 'Home',
    gallery: 'Gallery',
    timeline: 'Timeline',
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
  };

  const content = (
    <div className={`w-full h-full ${theme.bg} p-4 overflow-y-auto`}>
      {/* Preview Header */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${theme.accent.replace('text-', 'bg-')}`}></div>
          <span className={`text-xs font-medium ${theme.text} opacity-70`}>Live Preview</span>
        </div>
        <h3 className={`font-bold text-sm ${theme.text}`}>Your Love Story</h3>
        <p className={`text-xs ${theme.text} opacity-60`}>yoursite.com/love/...</p>
      </div>

      {/* Theme Colors Preview */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Theme</span>
        <div className="flex gap-1">
          {config.theme === 'romantic_classic' && [ '#BE185D', '#FBCFE8', '#881337', '#FDF4FF'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'cute_pastel' && [ '#F9A8D4', '#FDE68A', '#A7F3D0', '#E0E7FF'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'minimal_modern' && [ '#1F2937', '#F3F4F6', '#9CA3AF', '#FFFFFF'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
          ))}
          {config.theme === 'dark_elegant' && [ '#18181B', '#27272A', '#D4AF37', '#FAFAFA'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Sections Preview */}
      <div className={`${theme.card} rounded-lg p-3 mb-3 border`}>
        <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Sections</span>
        <div className="space-y-1.5">
          {sections.length === 0 ? (
            <p className={`text-xs ${theme.text} opacity-50 italic`}>No sections selected</p>
          ) : (
            sections.map((section) => (
              <div key={section} className={`text-xs ${theme.text} flex items-center gap-2 bg-black/5 rounded px-2 py-1`}>
                <span className={theme.accent}>{sectionLabels[section]}</span>
                {section === 'home' && config.home_template && (
                  <span className="opacity-60">• {templateLabels[config.home_template]}</span>
                )}
                {section === 'gallery' && config.gallery_template && (
                  <span className="opacity-60">• {templateLabels[config.gallery_template]}</span>
                )}
                {section === 'timeline' && config.timeline_template && (
                  <span className="opacity-60">• {templateLabels[config.timeline_template]}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section Icons Preview */}
      {sections.length > 0 && (
        <div className={`${theme.card} rounded-lg p-3 border`}>
          <span className={`text-xs font-medium ${theme.text} opacity-70 block mb-2`}>Page Layouts</span>
          <div className="flex flex-wrap gap-2">
            {sections.includes('home') && config.home_template && (
              <div className={`w-8 h-8 ${theme.bg.replace('bg-gradient-to-b', 'bg')} rounded border border-black/10 flex items-center justify-center ${theme.accent}`}>
                {templateIcons[config.home_template]}
              </div>
            )}
            {sections.includes('gallery') && config.gallery_template && (
              <div className={`w-8 h-8 ${theme.bg.replace('bg-gradient-to-b', 'bg')} rounded border border-black/10 flex items-center justify-center ${theme.accent}`}>
                {templateIcons[config.gallery_template]}
              </div>
            )}
            {sections.includes('timeline') && config.timeline_template && (
              <div className={`w-8 h-8 ${theme.bg.replace('bg-gradient-to-b', 'bg')} rounded border border-black/10 flex items-center justify-center ${theme.accent}`}>
                {templateIcons[config.timeline_template]}
              </div>
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
            <div className="h-[500px]">
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

