'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../builder/ThemeWrapper';
import { useState } from 'react';
import { resolveDecorations, resolveDefaultCTA } from '@/lib/site-type-utils';
import { OccasionType } from '@/lib/occasion-registry';

type Props = {
  theme: ThemeKey;
  variant?: 'full' | 'top-bottom' | 'vignette' | 'cinematic';
};

export default function HeroOverlay({ theme, variant = 'full' }: Props) {
  const styles = useTheme(theme);

  if (variant === 'vignette') {
    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: styles.heroVignette }}
      />
    );
  }

  if (variant === 'cinematic') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-[30%] h-32 md:h-48 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)' 
        }} />
      </div>
    );
  }

  if (variant === 'top-bottom') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-x-0 top-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)` }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.35), transparent)` }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute inset-0 ${styles.heroOverlay}`} />
      <div className="absolute inset-0" style={{ background: styles.heroVignette }} />
    </div>
  );
}

export function HeroDecorations({
  theme,
  siteType = 'couple',
  variant = 'centered',
}: { theme: ThemeKey; siteType?: OccasionType; variant?: 'centered' | 'full' }) {
  const isBirthday = siteType === 'birthday';
  const decorations = resolveDecorations(siteType);
  const iconColorClass = decorations.themeTone === 'romantic' ? 'text-rose-400' : decorations.themeTone === 'celebration' ? 'text-yellow-300' : 'text-sky-300';


  // Different positioning based on variant
  const getHeartPosition = (index: number) => {
    if (variant === 'centered') {
      const positions = [
        { x: 5, y: 15 },
        { x: 85, y: 10 },
        { x: 10, y: 70 },
        { x: 90, y: 65 },
        { x: 50, y: 85 },
        { x: 75, y: 35 },
      ];
      return positions[index] || { x: 10, y: 50 };
    } else {
      const positions = [
        { x: 15, y: 25 },
        { x: 75, y: 20 },
        { x: 20, y: 55 },
        { x: 80, y: 50 },
        { x: 40, y: 75 },
        { x: 65, y: 70 },
      ];
      return positions[index] || { x: 10, y: 50 };
    }
  };

  const items = (() => {
    const badgeEmojis = decorations.iconSet;

    return Array.from({ length: 6 }, (_, i) => {
      const pos = getHeartPosition(i);
      return {
        id: i,
        x: pos.x,
        y: pos.y,
        delay: ((i * 0.8 + 1.2) % 5) + 0.2,
        emoji: badgeEmojis[i % badgeEmojis.length],
      };
    });
  })();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute ${iconColorClass} ${isBirthday ? 'animate-birthday-confetti' : 'animate-float-heart'}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: '7s',
            fontSize: variant === 'centered' ? '1rem' : '1.25rem',
            opacity: variant === 'centered' ? 0.35 : 0.55,
          }}
        >
          <span>{item.emoji}</span>
        </div>
      ))}

      {/* Add some additional star/bubble highlights for birthdays */}
      {isBirthday && (
        <>
          <div className="absolute top-10 left-1/4 w-3 h-3 bg-white/70 rounded-full animate-pulse-slow" />
          <div className="absolute top-32 right-24 w-4 h-4 bg-blue-200/70 rounded-full animate-pulse-slow" />
        </>
      )}
    </div>
  );
}

export function ScrollIndicator({ targetId = 'our-story' }: { targetId?: string }) {
  const scrollToContent = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 group cursor-pointer"
      aria-label="Start our story"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="
          px-6 py-3 
          bg-white/10 backdrop-blur-md 
          border border-white/20 
          rounded-full
          text-white/90 text-sm font-medium
          group-hover:bg-white/20 group-hover:scale-105
          transition-all duration-300
          shadow-lg
        ">
          <span className="flex items-center gap-2">
            <span className="animate-heartbeat">💕</span>
            Start Our Story
            <span className="animate-bounce-subtle">↓</span>
          </span>
        </div>
      </div>
    </button>
  );
}

// Premium Dual CTA Buttons - Using native anchor links with fixed positioning
export function PremiumDualCTAs({ 
  siteType = 'couple',
  primaryTarget = 'love-letter',
  secondaryTarget = 'gallery',
}: { 
  siteType?: OccasionType;
  primaryTarget?: string;
  secondaryTarget?: string;
}) {
  const ctaConfig = resolveDefaultCTA(siteType);
  const isBirthday = siteType === 'birthday';

  return (
    <div 
      className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-4"
      style={{ zIndex: 99999 }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={`#${primaryTarget}`}
          className="
            min-w-[220px] h-14
            px-6 
            bg-white/10 backdrop-blur-md 
            border border-white/30 
            rounded-full
            text-white text-sm font-medium
            hover:bg-white/20 hover:scale-105 active:scale-95
            transition-all duration-300
            shadow-lg
            inline-flex items-center justify-center gap-2
            whitespace-nowrap
            cursor-pointer
            no-underline
          "
          style={{ pointerEvents: 'auto' }}
        >
          <span>{ctaConfig.startIcon}</span>
          {ctaConfig.primary}
          <span>{isBirthday ? '🎂' : '↓'}</span>
        </a>

        {!isBirthday && (
          <a
            href={`#${secondaryTarget}`}
            className="
              min-w-[220px] h-14
              px-6 
              bg-gradient-to-r from-rose-500 to-pink-500
              hover:from-rose-400 hover:to-pink-400
              border border-rose-400/50
              rounded-full
              text-white text-sm font-medium
              hover:scale-105 active:scale-95
              transition-all duration-300
              shadow-lg shadow-rose-500/30
              inline-flex items-center justify-center gap-2
              whitespace-nowrap
              cursor-pointer
              no-underline
            "
            style={{ pointerEvents: 'auto' }}
          >
            <span>{ctaConfig.endIcon}</span>
            {ctaConfig.secondary}
            <span>→</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function CompactCTA({ targetId = 'our-story' }: { targetId?: string }) {
  const scrollToContent = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="
        px-5 py-2.5 
        bg-white/10 backdrop-blur-md 
        border border-white/20 
        rounded-full
        text-white/90 text-xs font-medium
        hover:bg-white/20
        transition-all duration-300
        shadow-md
        flex items-center gap-2
      "
    >
      <span className="animate-heartbeat">💕</span>
      Start Our Story
    </button>
  );
}

