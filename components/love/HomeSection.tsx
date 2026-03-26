'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Theme, HomeTemplate } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';
import RelationshipTimer from '../page/RelationshipTimer';
import HeroOverlay, { HeroDecorations, PremiumDualCTAs } from '../page/HeroOverlay';

type Props = {
  theme: Theme;
  siteType?: 'couple' | 'birthday' | 'wedding' | 'proposal' | 'anniversary';
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
  siteType = 'couple',
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
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Trigger animations on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Premium Hero Centered Template - Compact version that fits in one screen
  const renderHeroCentered = () => {
    // Safe fallbacks for missing names
    const displayCustomerName = customerName || 'Your Name';
    const displayPartnerName = partnerName || 'Partner Name';
    const hasValidNames = customerName && partnerName;

    return (
      <div className={`${styles.heroBg} min-h-[85vh] flex flex-col items-center justify-center py-8 w-full relative`}>
        {/* Background Glow Effect - More compact */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-b from-rose-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl opacity-50" />
        </div>

        {/* Floating decoration - siteType-aware */}
        <HeroDecorations theme={theme} siteType={siteType} variant="centered" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center w-full relative z-10">

          {/* Decorative badge at top - Smaller */}
          <div className={`mb-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span
              className={`
                inline-flex items-center gap-1.5 
                px-3 py-1.5 rounded-full 
                text-[10px] font-semibold uppercase tracking-widest
                ${accentColor === 'amber' ? 'bg-amber-400/20 text-amber-300' : accentColor === 'purple' ? 'bg-purple-100 text-purple-600' : accentColor === 'slate' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-600'}
              `}
            >
              <span className="animate-pulse">{siteType === 'birthday' ? '🎉' : '💕'}</span>
              <span>{siteType === 'birthday' ? 'Happy Birthday' : 'Our Love Story'}</span>
              <span className="animate-pulse">{siteType === 'birthday' ? '🎈' : '💕'}</span>
            </span>
          </div>

          {/* Image container - Smaller */}
          <div className={`
              relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52
              mx-auto rounded-full overflow-hidden 
              shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
              ring-3 ring-white/40
              transform transition-all duration-300
              hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
              group
            `}>
            <Image
              src={heroImage}
              alt={`${displayCustomerName} and ${displayPartnerName}`}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5 pointer-events-none" />
            {/* Inner ring effect */}
            <div className="absolute inset-0 rounded-full ring-1 ring-white/20 pointer-events-none" />
          </div>

          {/* Couple Names - IN ONE ROW on desktop */}
          <div className={`mb-3 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className={`
              ${styles.heading} 
              text-3xl md:text-4xl lg:text-5xl 
              font-bold 
              ${styles.text} 
              leading-tight
              tracking-tight
              drop-shadow-lg
              flex flex-wrap items-center justify-center gap-x-3 gap-y-1
            `}>
              {siteType === 'birthday'
                ? <span className="inline-block">{displayCustomerName || 'Happy Birthday!'}</span>
                : (
                  <>
                    <span className="inline-block">{displayCustomerName}</span>
                    <span className={`
                      text-xl md:text-2xl lg:text-3xl
                      ${theme === 'dark_elegant' ? 'text-amber-400/80' : theme === 'cute_pastel' ? 'text-purple-400' : theme === 'minimal_modern' ? 'text-slate-400' : 'text-rose-400'}
                      font-light italic
                    `}>
                      <span className="inline-block animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>&</span>
                    </span>
                    <span className="inline-block">{displayPartnerName}</span>
                  </>
                )}
            </h1>
          </div>

          {/* Anniversary Date - Compact */}
          {(anniversaryDate || hasValidNames) && (
            <p className={`
              text-sm md:text-base 
              ${styles.textMuted} 
              mb-3
              font-light
              tracking-wide
              transition-all duration-500 delay-300
              ${isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
              {anniversaryDate ? (
                <>Together since <span className={`font-semibold ${styles.text}`}>{anniversaryDate}</span></>
              ) : (
                <span className="opacity-60">Started our journey</span>
              )}
            </p>
          )}

          {/* Relationship Timer - Compact */}
          {anniversaryDate && (
            <div className={`
              mb-4
              transition-all duration-500 delay-400
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
              <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
            </div>
          )}

          {/* Tagline - Compact with tighter spacing */}
          {tagline && (
            <div className={`
              mb-5 max-w-xl mx-auto
              transition-all duration-500 delay-500
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}>
              <p className={`
                text-sm md:text-base lg:text-lg
                leading-relaxed
                ${theme === 'dark_elegant' ? 'text-white/70' : 'text-gray-500'}
                font-light italic
              `}>
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          )}

          {/* Premium Dual CTAs - Tight spacing */}
          <div className={`
            flex flex-col sm:flex-row items-center justify-center gap-3
            transition-all duration-500 delay-600
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}>
            {/* Primary Button - Gradient */}
            <a
              href="#love-letter"
              className="
                group
                flex items-center justify-center gap-2
                min-w-[160px]
                px-6 py-2.5
                bg-gradient-to-r from-rose-500 to-pink-500
                hover:from-rose-400 hover:to-pink-400
                text-white
                font-medium text-xs
                rounded-full
                transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-rose-500/25
                active:scale-95
                no-underline
              "
            >
              <span className="transition-transform group-hover:animate-pulse">💕</span>
              Start Our Story
              <span className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>

            {/* Secondary Button - Glassmorphism */}
            <a
              href="#gallery"
              className="
                group
                flex items-center justify-center gap-2
                min-w-[160px]
                px-6 py-2.5
                bg-white/20 backdrop-blur-sm
                border border-white/40
                hover:bg-white/30 hover:border-white/60
                text-white
                font-medium text-xs
                rounded-full
                transition-all duration-300
                hover:scale-105 hover:shadow-lg
                active:scale-95
                no-underline
              "
              style={{
                backgroundColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
                borderColor: theme === 'dark_elegant' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                color: theme === 'dark_elegant' ? 'white' : theme === 'cute_pastel' ? '#be185d' : theme === 'minimal_modern' ? '#475569' : '#be185d'
              }}
            >
              <span>📸</span>
              View Our Memories
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* Minimal scroll hint - Only visible when there's room */}
          <div className="mt-4 animate-bounce-subtle">
            <span className="text-lg opacity-30">💕</span>
          </div>
        </div>
      </div>
    );
  };

  // Split Layout Template - Enhanced Premium Version
  const renderSplitLayout = () => {
    const isDark = theme === 'dark_elegant';
    const isPastel = theme === 'cute_pastel';
    const isMinimal = theme === 'minimal_modern';

    // Get accent color for buttons
    const getAccentColor = () => {
      switch (theme) {
        case 'dark_elegant': return 'amber';
        case 'cute_pastel': return 'purple';
        case 'minimal_modern': return 'slate';
        default: return 'rose';
      }
    };
    const accentColor = getAccentColor();

    return (
      <div className={`${styles.heroBg} min-h-screen relative`}>
        {/* Use CSS Grid for balanced 50/50 layout */}
        <div className="grid lg:grid-cols-2 min-h-screen">

          {/* Left Side - Image with premium presentation */}
          <div className="relative h-[40vh] lg:h-auto min-h-[50vh] lg:min-h-screen overflow-hidden order-1 lg:order-1">
            <Image
              src={heroImage}
              alt={`${customerName} and ${partnerName}`}
              fill
              className="object-cover brightness-[0.85] lg:brightness-100"
              priority
            />
            {/* Gradient overlay - subtle transition from dark to transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 hidden lg:block" />

            {/* Soft vignette effect */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)' }} />

            {/* Decorative heart element */}
            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
              <span className="text-3xl lg:text-4xl animate-pulse">💕</span>
            </div>

            {/* Floating hearts/birthday decoration */}
            <HeroDecorations theme={theme} siteType={siteType} variant="full" />
          </div>

          {/* Right Side - Content with proper vertical centering */}
          <div className={`
            flex flex-col justify-center 
            p-6 md:p-10 lg:p-12 xl:p-16 
            ${isDark ? 'bg-zinc-900' : isPastel ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50' : isMinimal ? 'bg-slate-50' : 'bg-white'}
            relative
            order-2 lg:order-2
          `}>
            {/* Vertically center content with max-width for readability */}
            <div className="max-w-lg mx-auto lg:mx-0 w-full">

              {/* Decorative element */}
              <div className="mb-6 lg:mb-8">
                <span className={`text-4xl lg:text-5xl ${accentColor === 'amber' ? 'text-amber-300' : accentColor === 'purple' ? 'text-purple-400' : accentColor === 'slate' ? 'text-slate-400' : 'text-rose-400'}`}>
                  💕
                </span>
              </div>

              {/* Names with premium typography - larger and more prominent */}
              <div className="space-y-2 mb-6">
                <h1 className={`
                  ${styles.heading} 
                  text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  font-bold 
                  ${styles.text} 
                  leading-[1.1]
                  tracking-tight
                `}>
                  {customerName}
                </h1>

                <p className={`
                  text-2xl md:text-3xl lg:text-4xl 
                  ${styles.accent}
                  font-light
                  py-1
                `}>&</p>

                <h1 className={`
                  ${styles.heading} 
                  text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  font-bold 
                  ${styles.text}
                  leading-[1.1]
                  tracking-tight
                `}>
                  {partnerName}
                </h1>
              </div>

              {/* Anniversary - elegant secondary text */}
              <p className={`
                text-base md:text-lg 
                ${styles.textMuted} 
                mb-6
                font-light
                tracking-wide
              `}>
                Together since <span className={`font-medium ${styles.text}`}>{anniversaryDate}</span>
              </p>

              {/* Relationship Timer */}
              <div className="mb-8">
                <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
              </div>

              {/* Tagline - styled as elegant romantic quote */}
              {tagline && (
                <div className="mb-8">
                  <p className={`
                    text-base md:text-lg lg:text-xl
                    leading-relaxed
                    ${isDark ? 'text-white/70' : 'text-gray-600'}
                    font-light
                    italic
                    max-w-md
                    relative
                    pl-4
                  `}>
                    <span className={`absolute left-0 top-0 text-2xl leading-none ${accentColor === 'amber' ? 'text-amber-300/50' : accentColor === 'purple' ? 'text-purple-400/50' : accentColor === 'slate' ? 'text-slate-400/50' : 'text-rose-400/50'}`}>
                      &ldquo;
                    </span>
                    {tagline}
                    <span className={`absolute -bottom-1 text-2xl leading-none ${accentColor === 'amber' ? 'text-amber-300/50' : accentColor === 'purple' ? 'text-purple-400/50' : accentColor === 'slate' ? 'text-slate-400/50' : 'text-rose-400/50'}`}>
                      &rdquo;
                    </span>
                  </p>
                </div>
              )}

              {/* CTA Buttons - Premium styled */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                {/* Primary Button - Gradient with hover animation */}
                <a
                  href="#love-letter"
                  className="
                    group
                    flex items-center justify-center gap-2
                    px-6 py-3
                    bg-gradient-to-r from-rose-500 to-pink-500
                    hover:from-rose-400 hover:to-pink-400
                    text-white
                    font-medium text-sm
                    rounded-full
                    transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-rose-500/30
                    active:scale-95
                    no-underline
                  "
                >
                  <span className="transition-transform group-hover:animate-pulse">💕</span>
                  Start Our Story
                  <span className="transition-transform group-hover:translate-y-0.5">↓</span>
                </a>

                {/* Secondary Button - Glassmorphism style */}
                <a
                  href="#gallery"
                  className="
                    group
                    flex items-center justify-center gap-2
                    px-6 py-3
                    bg-white/20 backdrop-blur-sm
                    border border-white/40
                    hover:bg-white/30 hover:border-white/60
                    text-white
                    font-medium text-sm
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    active:scale-95
                    no-underline
                  "
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    color: isDark ? 'white' : isPastel ? '#be185d' : isMinimal ? '#475569' : '#be185d'
                  }}
                >
                  <span>📸</span>
                  View Our Memories
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll Indicator - Subtle hint at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-8">
          <a
            href="#love-letter"
            className="
              flex flex-col items-center gap-1
              text-white/60 hover:text-white/80
              transition-colors duration-300
              cursor-pointer
              no-underline
            "
          >
            <span className="text-xs uppercase tracking-widest opacity-70">Explore</span>
            <span className="animate-bounce text-lg">↓</span>
          </a>
        </div>
      </div>
    );
  };

  // Fullscreen Banner Template - Enhanced with dual CTAs
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
        <HeroDecorations theme={theme} siteType={siteType} variant="full" />

        {/* Content Overlay - Centered with improved layout */}
        <div className="relative z-10 text-center text-white px-4 
          flex flex-col items-center justify-center
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

          {/* "Together since" Date - Subtle secondary text */}
          <p className="text-base md:text-lg mb-8 opacity-60 font-light tracking-wide drop-shadow-md">
            Together since <span className="font-normal">{anniversaryDate}</span>
          </p>

          {/* Relationship Timer Pill - Clean single container */}
          <div className="mb-8">
            <RelationshipTimer anniversary={anniversaryDate} theme={theme} />
          </div>

          {/* Tagline / Quote - Elegant italic styling */}
          {tagline && (
            <div className="max-w-2xl mx-auto mb-8 px-4">
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

        {/* Premium Dual CTAs - NEW ENHANCEMENT */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <PremiumDualCTAs
            primaryTarget="love-letter"
            secondaryTarget="gallery"
          />
        </div>
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

