'use client';

import { Theme } from '@/lib/types';
import { useTheme } from './ThemeWrapper';

type Props = {
  theme: Theme;
  variant?: 'full' | 'top-bottom' | 'vignette';
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

  if (variant === 'top-bottom') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient */}
        <div 
          className="absolute inset-x-0 top-0 h-32 md:h-48"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)` }}
        />
        {/* Bottom gradient */}
        <div 
          className="absolute inset-x-0 bottom-0 h-32 md:h-48"
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.5), transparent)` }}
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

// Decorative floating hearts/sparkles component
export function HeroDecorations({ theme }: { theme: Theme }) {
  const styles = useTheme(theme);
  
  const accentColor = theme === 'dark_elegant' ? 'amber' : 'rose';
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      <div className="absolute top-[10%] left-[10%] animate-float opacity-20">
        <span className={`text-2xl md:text-3xl ${accentColor === 'amber' ? 'text-amber-300' : 'text-rose-400'}`}>💕</span>
      </div>
      <div className="absolute top-[20%] right-[15%] animate-float opacity-15" style={{ animationDelay: '1s' }}>
        <span className={`text-xl md:text-2xl ${accentColor === 'amber' ? 'text-amber-300' : 'text-rose-400'}`}>💗</span>
      </div>
      <div className="absolute bottom-[30%] left-[8%] animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <span className={`text-xl md:text-2xl ${accentColor === 'amber' ? 'text-amber-300' : 'text-rose-400'}`}>💖</span>
      </div>
      <div className="absolute bottom-[20%] right-[10%] animate-float opacity-15" style={{ animationDelay: '0.5s' }}>
        <span className={`text-2xl md:text-3xl ${accentColor === 'amber' ? 'text-amber-300' : 'text-rose-400'}`}>💕</span>
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-[15%] right-[25%] animate-pulse opacity-30">
        <span className={`text-sm ${accentColor === 'amber' ? 'text-amber-200' : 'text-pink-300'}`}>✦</span>
      </div>
      <div className="absolute top-[40%] left-[5%] animate-pulse opacity-20" style={{ animationDelay: '1.5s' }}>
        <span className={`text-sm ${accentColor === 'amber' ? 'text-amber-200' : 'text-pink-300'}`}>✧</span>
      </div>
      <div className="absolute bottom-[40%] right-[20%] animate-pulse opacity-25" style={{ animationDelay: '2s' }}>
        <span className={`text-xs ${accentColor === 'amber' ? 'text-amber-200' : 'text-pink-300'}`}>✦</span>
      </div>
    </div>
  );
}

// Scroll indicator component
export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <span className="text-2xl">↓</span>
      </div>
    </div>
  );
}

