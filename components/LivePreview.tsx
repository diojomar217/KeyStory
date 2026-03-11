'use client';

import { useState, useEffect } from 'react';
import { SiteConfig, Theme, Section } from '@/lib/types';
import { THEME_PRESETS, SECTION_TOGGLES } from '@/lib/builder-constants';
import { SectionRenderer } from '@/components/builder/SectionPreviews';

// ============================================
// THEME STYLES
// ============================================

type ThemeStyle = {
  bg: string;
  text: string;
  accent: string;
  card: string;
  border: string;
  muted: string;
};

const themeStyles: Record<Theme, ThemeStyle> = {
  romantic_classic: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    card: 'bg-white',
    border: 'border-rose-200',
    muted: 'text-rose-600/70',
  },
  cute_pastel: {
    bg: 'bg-gradient-to-b from-purple-50 to-pink-50',
    text: 'text-purple-900',
    accent: 'text-purple-600',
    card: 'bg-white',
    border: 'border-purple-200',
    muted: 'text-purple-600/70',
  },
  minimal_modern: {
    bg: 'bg-gradient-to-b from-slate-50 to-gray-100',
    text: 'text-slate-900',
    accent: 'text-slate-600',
    card: 'bg-white',
    border: 'border-slate-200',
    muted: 'text-slate-600/70',
  },
  dark_elegant: {
    bg: 'bg-gradient-to-b from-zinc-900 to-slate-900',
    text: 'text-zinc-100',
    accent: 'text-amber-400',
    card: 'bg-zinc-800',
    border: 'border-zinc-700',
    muted: 'text-zinc-400',
  },
  soft_pastel: {
    bg: 'bg-gradient-to-b from-amber-50 to-yellow-50',
    text: 'text-amber-900',
    accent: 'text-amber-600',
    card: 'bg-white',
    border: 'border-amber-200',
    muted: 'text-amber-600/70',
  },
  elegant_rose_gold: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    card: 'bg-white',
    border: 'border-rose-200',
    muted: 'text-rose-600/70',
  },
  vintage_love_letter: {
    bg: 'bg-gradient-to-b from-amber-50 to-orange-50',
    text: 'text-amber-900',
    accent: 'text-amber-700',
    card: 'bg-amber-50',
    border: 'border-amber-200',
    muted: 'text-amber-700/70',
  },
  scrapbook_memories: {
    bg: 'bg-gradient-to-b from-orange-50 to-amber-50',
    text: 'text-orange-900',
    accent: 'text-orange-600',
    card: 'bg-amber-50',
    border: 'border-orange-200',
    muted: 'text-orange-600/70',
  },
  wedding_style: {
    bg: 'bg-gradient-to-b from-stone-50 to-slate-100',
    text: 'text-stone-900',
    accent: 'text-stone-600',
    card: 'bg-white',
    border: 'border-stone-200',
    muted: 'text-stone-600/70',
  },
  floral_romance: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    text: 'text-rose-900',
    accent: 'text-rose-600',
    card: 'bg-white',
    border: 'border-rose-200',
    muted: 'text-rose-600/70',
  },
  dreamy_pink: {
    bg: 'bg-gradient-to-b from-pink-50 to-fuchsia-50',
    text: 'text-pink-900',
    accent: 'text-pink-600',
    card: 'bg-white',
    border: 'border-pink-200',
    muted: 'text-pink-600/70',
  },
  luxury_gold: {
    bg: 'bg-gradient-to-b from-zinc-900 to-yellow-900',
    text: 'text-yellow-100',
    accent: 'text-yellow-400',
    card: 'bg-zinc-800',
    border: 'border-zinc-700',
    muted: 'text-yellow-400/70',
  },
  minimal_white: {
    bg: 'bg-gradient-to-b from-white to-gray-50',
    text: 'text-slate-900',
    accent: 'text-slate-500',
    card: 'bg-white',
    border: 'border-slate-200',
    muted: 'text-slate-500/70',
  },
  cute_kawaii: {
    bg: 'bg-gradient-to-b from-pink-50 to-purple-50',
    text: 'text-pink-900',
    accent: 'text-pink-600',
    card: 'bg-white',
    border: 'border-pink-200',
    muted: 'text-pink-600/70',
  },
  soft_lavender: {
    bg: 'bg-gradient-to-b from-violet-50 to-purple-50',
    text: 'text-violet-900',
    accent: 'text-violet-600',
    card: 'bg-white',
    border: 'border-violet-200',
    muted: 'text-violet-600/70',
  },
  photo_focus: {
    bg: 'bg-gradient-to-b from-gray-50 to-slate-100',
    text: 'text-slate-900',
    accent: 'text-slate-500',
    card: 'bg-white',
    border: 'border-slate-200',
    muted: 'text-slate-500/70',
  },
};

// ============================================
// DEVICE PREVIEW STYLES
// ============================================

type DeviceType = 'desktop' | 'mobile';

interface Props {
  config: SiteConfig;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  coupleNames?: {
    customer_name: string;
    partner_name: string;
  };
  tagline?: string;
  coverPhotoUrl?: string;
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

function EmptyPreviewState({ theme }: { theme: ThemeStyle }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="text-4xl mb-4">💕</div>
      <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
        Start Building Your Love Story
      </h3>
      <p className={`text-sm text-center ${theme.muted}`}>
        Complete the wizard steps to see your website preview
      </p>
      
      <div className="mt-6 flex flex-col gap-2 text-center">
        <div className={`flex items-center gap-2 text-xs ${theme.muted}`}>
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">1</span>
          <span>Add your details</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${theme.muted}`}>
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">2</span>
          <span>Write your love message</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${theme.muted}`}>
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">3</span>
          <span>Choose a theme</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${theme.muted}`}>
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">4</span>
          <span>Select sections</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEVICE FRAME COMPONENT
// ============================================

function DeviceFrame({ 
  children, 
  device,
  theme,
  websiteName
}: { 
  children: React.ReactNode; 
  device: DeviceType;
  theme: ThemeStyle;
  websiteName?: string;
}) {
  const isMobile = device === 'mobile';
  
  return (
    <div className={`relative ${isMobile ? 'max-w-[280px] mx-auto' : ''}`}>
      {/* Device Frame */}
      <div 
        className={`
          ${isMobile ? 'rounded-3xl' : 'rounded-xl'}
          overflow-hidden border-4
          ${isMobile ? 'border-slate-800' : 'border-slate-700'}
          shadow-2xl bg-white
        `}
        style={{ 
          height: isMobile ? '520px' : '100%'
        }}
      >
        {/* Mobile notch or desktop header */}
        {isMobile && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-10" />
        )}
        
        {/* Browser/Phone chrome */}
        {!isMobile && (
          <div className="bg-slate-800 px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-[10px] text-slate-400 text-center">
              {websiteName ? `yoursite.com/love/${websiteName}` : 'yoursite.com/love/...'}
            </div>
          </div>
        )}
        
        {/* Website Content */}
        <div 
          className={`h-full overflow-y-auto ${theme.bg}`}
          style={{ 
            paddingTop: isMobile ? '1.5rem' : '0',
            paddingBottom: '1rem'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LIVE PREVIEW COMPONENT
// ============================================

export default function LivePreview({ config, isMobileOpen, onMobileClose, coupleNames, tagline }: Props) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [mounted, setMounted] = useState(false);

  // Get theme styles with fallback
  const themeKey = config.theme || 'romantic_classic';
  const theme = themeStyles[themeKey] || themeStyles.romantic_classic;
  const sections = config.sections || [];
  
  // Get theme colors for previews
  const themePreset = THEME_PRESETS[themeKey] || THEME_PRESETS.romantic_classic;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Live Preview</h3>
            </div>
            <div className="h-[500px] bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="h-full flex flex-col">
      {/* Device Toggle */}
      <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <button
          onClick={() => setDevice('desktop')}
          className={`p-2 rounded-lg transition-all ${
            device === 'desktop' 
              ? 'bg-rose-100 text-rose-600' 
              : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Desktop view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`p-2 rounded-lg transition-all ${
            device === 'mobile' 
              ? 'bg-rose-100 text-rose-600' 
              : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Mobile view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {sections.length === 0 ? (
          <EmptyPreviewState theme={theme} />
        ) : (
          <DeviceFrame device={device} theme={theme}>
            <div className="space-y-3 px-2 sm:px-3">
              {sections.map((section, index) => (
                <div 
                  key={`${section}-${index}`}
                  className="transform transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
<SectionRenderer sectionId={section} config={config} coupleNames={coupleNames} tagline={tagline} />
                </div>
              ))}
            </div>
          </DeviceFrame>
        )}
      </div>

      {/* Theme Color Bar */}
      <div className="px-3 py-2 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          {themePreset.preview?.map((color: string, i: number) => (
            <div 
              key={i} 
              className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <span className="ml-auto text-[10px] text-slate-400">
            {themePreset.label}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-semibold text-slate-800">Live Preview</h3>
              </div>
              <span className="text-xs text-slate-400">
                {sections.length} section{sections.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Preview Area */}
            <div className="h-[520px]">
              {content}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Preview Tips
            </h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Toggle between desktop and mobile views</li>
              <li>• Your changes update in real-time</li>
              <li>• Add photos in the Memories step</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden animate-slide-up">
            {/* Handle */}
            <div className="w-full flex justify-center py-3">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-4 pb-2 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-semibold text-slate-800">Live Preview</h3>
              </div>
              <button 
                onClick={onMobileClose} 
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="h-[calc(85vh-60px)]">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

