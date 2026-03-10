'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';

type Props = {
  theme: Theme;
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
    // Cinematic layered gradient - softer for better text readability
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1: Top lighter gradient */}
        <div className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-black/10 to-transparent" />
        {/* Layer 2: Middle subtle overlay */}
        <div className="absolute inset-x-0 top-[30%] h-32 md:h-48 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
        {/* Layer 3: Bottom strong dark gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
        {/* Subtle vignette for edges */}
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)' 
        }} />
      </div>
    );
  }

  if (variant === 'top-bottom') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient - softer */}
        <div 
          className="absolute inset-x-0 top-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)` }}
        />
        {/* Bottom gradient - softer */}
        <div 
          className="absolute inset-x-0 bottom-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.35), transparent)` }}
        />
      </div>
    );
  }

  // Full overlay
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute inset-0 ${styles.heroOverlay}`} />
      <div className="absolute inset-0" style={{ background: styles.heroVignette }} />
    </div>
  );
}

// Refined floating hearts - very subtle for elegant feel
export function HeroDecorations({ theme }: { theme: Theme }) {
  const accentColor = theme === 'dark_elegant' ? 'amber' : 'rose';
  const heartColorClass = accentColor === 'amber' ? 'text-amber-300' : 'text-rose-400';
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Only 2 very subtle hearts with low opacity */}
      <div 
        className={`absolute top-[20%] left-[20%] ${heartColorClass}`}
        style={{ 
          opacity: 0.25,
          animation: 'float 20s ease-in-out infinite'
        }}
      >
        <span className="text-lg md:text-xl">💕</span>
      </div>
      
      <div 
        className={`absolute top-[30%] right-[25%] ${heartColorClass}`}
        style={{ 
          opacity: 0.2,
          animation: 'float 24s ease-in-out infinite',
          animationDelay: '8s'
        }}
      >
        <span className="text-base md:text-lg">💗</span>
      </div>
    </div>
  );
}

// Scroll indicator component - improved positioning at bottom center
export function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <span className="text-2xl">↓</span>
      </div>
    </div>
  );
}

