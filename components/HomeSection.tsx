'use client';

import React from 'react';
import Image from 'next/image';
import { Theme, HomeTemplate } from '@/lib/types';
import { useTheme } from './ThemeWrapper';
import RelationshipTimer from './RelationshipTimer';
import LoveMessageCard from './LoveMessageCard';
import HeroOverlay, { HeroDecorations, ScrollIndicator } from './HeroOverlay';

type Props = {
  theme: Theme;
  template: HomeTemplate;
  customerName: string;
  partnerName: string;
  anniversaryDate: string;
  message: string;
  tagline?: string;
  photos: string[];
  coverPhotoIndex?: number;
  songLink?: string;
};

export default function HomeSection({
  theme,
  template,
  customerName,
  partnerName,
  anniversaryDate,
  message,
  tagline,
  photos,
  coverPhotoIndex,
}: Props) {
  const styles = useTheme(theme);
  
  // Use cover photo index if available, otherwise fallback to first photo
  const heroImage = (coverPhotoIndex !== undefined && photos?.[coverPhotoIndex]) 
    ? photos[coverPhotoIndex] 
    : photos?.[0] || '/vercel.svg';

  // Get accent color based on theme
  const getAccentColor = () => {
    switch (theme) {
      case 'dark_elegant': return 'amber';
      case 'cute_pastel': return 'purple';
      case 'minimal_modern': return 'slate';
      default: return 'rose';
    }
  };
  
  const accentColor = getAccentColor();

  // Premium Hero Centered Template
  const renderHeroCentered = () => {
    return (
      <div className={`${styles.heroBg} min-h-screen flex items-center justify-center pt-12 pb-16 w-full relative`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full relative z-10">
          
          {/* Decorative badge at top */}
          <div className="mb-8 animate-fade-in">
            <span 
              className={`
                inline-flex items-center gap-2 
                px-4 py-2 rounded-full 
                ${accentColor === 'amber' ? 'bg-amber-400/20' : accentColor === 'purple' ? 'bg-purple-100' : accentColor === 'slate' ? 'bg-slate-100' : 'bg-rose-100'}
                ${accentColor === 'amber' ? 'text-amber-300' : accentColor === 'purple' ? 'text-purple-600' : accentColor === 'slate' ? 'text-slate-600' : 'text-rose-600'}
                text-sm font-medium
              `}
            >
              <span className="animate-pulse">💕</span>
              <span>Our Love Story</span>
              <span className="animate-pulse">💕</span>
            </span>
          </div>

          {/* Hero Image - Premium styling */}
          <div className="relative w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto mb-10 rounded-full overflow-hidden 
            shadow-[0_20px_60px_rgba(0,0,0,0.25)] 
            ring-4 ring-white/30 
            backdrop-blur-sm 
            transform transition-all duration-500 
            hover:scale-105 hover:shadow-[0_25px_70px_rgba(0,0,0,0.3)]
            group
          ">
            <Image
              src={heroImage}
              alt={`${customerName} and ${partnerName}`}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            {/* Inner ring effect */}
            <div className="absolute inset-0 rounded-full ring-1 ring-white/20 pointer-events-none" />
          </div>

          {/* Couple Names - Premium typography */}
          <h1 className={`
            ${styles.heading} 
            text-4xl md:text-5xl lg:text-6xl 
            font-bold 
            ${styles.text} 
            mb-4
            tracking-tight
            drop-shadow-sm
          `}>
            {customerName} 
            <span className={`
              mx-3 md:mx-4
              ${theme === 'dark_elegant' ? 'text-amber-400/80' : theme === 'cute_pastel' ? 'text-purple-400' : theme === 'minimal_modern' ? 'text-slate-400' : 'text-rose-400'}
              font-light
            `}>&</span> 
            {partnerName}
          </h1>

          {/* Anniversary Date - Subtle but elegant */}
          <p className={`
            text-lg md:text-xl 
            ${styles.textMuted} 
            mb-8
            font-light
            tracking-wide
          `}>
            Together since <span className={`font-medium ${styles.text}`}>{anniversaryDate}</span>
          </p>

          {/* Relationship Timer - Premium pill design */}
          <div className="mb-12">
            <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
          </div>

          {/* Tagline - Short romantic line */}
          {tagline && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className={`
                text-lg md:text-xl lg:text-2xl
                leading-relaxed
                px-4
                ${styles.text}
                font-light
                italic
              `}>
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          )}
          
          {/* Decorative bottom element */}
          <div className="mt-16">
            <span className="text-2xl opacity-30">💕</span>
          </div>
        </div>
      </div>
    );
  };

  // Split Layout Template - Enhanced
  const renderSplitLayout = () => {
    const isDark = theme === 'dark_elegant';
    
    return (
      <div className={`${styles.heroBg} min-h-screen flex pt-8 relative`}>
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen overflow-hidden">
          <Image
            src={heroImage}
            alt={`${customerName} and ${partnerName}`}
            fill
            className="object-cover"
            priority
          />
          {/* Premium overlays */}
          <div className={`absolute inset-0 ${styles.overlay}`} />
          <div className="absolute inset-0" style={{ background: styles.heroVignette }} />
          
          {/* Decorative overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="text-white">
              <span className="text-4xl">💕</span>
            </div>
          </div>
          
          {/* Floating decorations */}
          <HeroDecorations theme={theme} />
        </div>

        {/* Right Side - Content */}
        <div className={`
          w-full md:w-1/2 
          flex flex-col justify-center 
          p-8 md:p-12 lg:p-16 
          ${isDark ? 'bg-zinc-900/80' : 'bg-white/80'}
          backdrop-blur-sm
          relative
        `}>
          {/* Decorative element */}
          <div className="mb-8">
            <span className="text-5xl">💕</span>
          </div>

          {/* Names with premium styling */}
          <div className="mb-2">
            <h1 className={`
              ${styles.heading} 
              text-4xl md:text-5xl lg:text-6xl 
              font-bold 
              ${styles.text} 
              leading-tight
            `}>
              {customerName}
            </h1>
          </div>
          
          <div className="mb-8">
            <p className={`
              text-3xl md:text-4xl 
              ${styles.accent}
              font-light
            `}>&</p>
          </div>
          
          <div className="mb-10">
            <h1 className={`
              ${styles.heading} 
              text-4xl md:text-5xl lg:text-6xl 
              font-bold 
              ${styles.text}
              leading-tight
            `}>
              {partnerName}
            </h1>
          </div>

          {/* Anniversary */}
          <p className={`
            text-lg md:text-xl 
            ${styles.textMuted} 
            mb-2
            font-light
          `}>
            Anniversary: <span className={`font-medium ${styles.text}`}>{anniversaryDate}</span>
          </p>

          {/* Timer */}
          <div className="mb-10">
            <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
          </div>

          {/* Tagline - Short romantic line */}
          {tagline && (
            <div className="mt-2 max-w-lg">
              <p className={`
                text-base md:text-lg
                leading-relaxed
                ${styles.textMuted}
                font-light
                italic
              `}>
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fullscreen Banner Template - Most premium with cinematic, elegant design
  const renderFullscreenBanner = () => {
    const isDark = theme === 'dark_elegant';
    
    return (
      <div className={`relative min-h-screen flex items-center justify-center ${styles.heroBg}`}>
        {/* Background Image - Premium styling with enhanced cinematic overlays */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced gradient overlays for better text readability */}
          {/* Layered: Top lighter, middle subtle, bottom strong dark */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
          {/* Additional overlay for depth */}
          <div className={`absolute inset-0 ${styles.overlay}`} />
          {/* Vignette effect for edges */}
          <div className="absolute inset-0" style={{ background: styles.heroVignette }} />
        </div>

        {/* Decorative elements - subtle floating hearts */}
        <HeroDecorations theme={theme} />

        {/* Content Overlay - Centered with improved layout */}
        <div className="relative z-10 text-center text-white px-4 
          flex flex-col items-center justify-center min-h-screen 
          max-w-3xl mx-auto">
          
          {/* Decorative element at top */}
          <div className="mb-8">
            <span className="text-5xl md:text-6xl animate-pulse inline-block">💕</span>
          </div>

          {/* Couple Names - Largest text, dramatic but elegant */}
          <h1 className={`
            ${styles.heading} 
            text-4xl md:text-6xl 
            font-semibold 
            mb-6 
            drop-shadow-lg
            leading-tight
            tracking-wide
          `}>
            {customerName} 
            <span className="block md:inline mx-0 md:mx-4 text-3xl md:text-4xl text-rose-300/80 font-light">&</span> 
            {partnerName}
          </h1>

          {/* "Together since" Date - Clear hierarchy */}
          <p className="text-lg md:text-xl mb-8 opacity-90 font-light tracking-wide drop-shadow-md">
            Together since <span className="font-medium">{anniversaryDate}</span>
          </p>

          {/* Relationship Timer Pill - Clean single container */}
          <div className="mb-10">
            <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
          </div>

          {/* Tagline / Quote - Elegant italic styling */}
          {tagline && (
            <div className="max-w-2xl mx-auto mb-16 px-4">
              <p className="
                text-lg md:text-xl
                leading-relaxed
                text-white/95
                font-light
                italic
                drop-shadow-md
              ">
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          )}
        </div>
        
        {/* Scroll indicator - Fixed at bottom center, never overlaps content */}
        <ScrollIndicator />
      </div>
    );
  };

  switch (template) {
    case 'split_layout':
      return renderSplitLayout();
    case 'fullscreen_banner':
      return renderFullscreenBanner();
    case 'hero_centered':
    default:
      return renderHeroCentered();
  }
}

