'use client';

import { useEffect, useState } from 'react';
import { Theme } from '@/lib/types';

interface BackgroundDecorationsProps {
  theme: Theme;
  className?: string;
}

export default function BackgroundDecorations({ theme, className = '' }: BackgroundDecorationsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Theme-specific decoration colors - refined for premium feel
  const getDecorationColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          hearts: 'text-amber-500',
          sparkles: 'text-amber-400',
          glow: 'bg-amber-500',
        };
      case 'cute_pastel':
        return {
          hearts: 'text-pink-400',
          sparkles: 'text-purple-400',
          glow: 'bg-pink-400',
        };
      case 'minimal_modern':
        return {
          hearts: 'text-slate-400',
          sparkles: 'text-slate-300',
          glow: 'bg-slate-400',
        };
      default:
        return {
          hearts: 'text-rose-300',
          sparkles: 'text-pink-300',
          glow: 'bg-rose-300',
        };
    }
  };

  const colors = getDecorationColors();

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Minimal floating hearts - positioned intentionally */}
      <div 
        className={`absolute top-[10%] left-[5%] ${colors.hearts} opacity-[0.035] float-slow`}
        style={{ animationDelay: '0s' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div 
        className={`absolute top-[8%] right-[8%] ${colors.hearts} opacity-[0.025] float-medium`}
        style={{ animationDelay: '2s' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div 
        className={`absolute bottom-[20%] left-[10%] ${colors.hearts} opacity-[0.03] float-slow`}
        style={{ animationDelay: '4s' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div 
        className={`absolute bottom-[30%] right-[6%] ${colors.hearts} opacity-[0.025] float-medium`}
        style={{ animationDelay: '1s' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      {/* Minimal sparkles - refined placement */}
      <div 
        className={`absolute top-[25%] left-[20%] ${colors.sparkles} opacity-[0.05] float-fast`}
        style={{ animationDelay: '0.5s' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div 
        className={`absolute top-[45%] right-[15%] ${colors.sparkles} opacity-[0.04] float-slow`}
        style={{ animationDelay: '1.5s' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div 
        className={`absolute bottom-[45%] left-[15%] ${colors.sparkles} opacity-[0.035] float-medium`}
        style={{ animationDelay: '2.5s' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div 
        className={`absolute top-[60%] left-[8%] ${colors.sparkles} opacity-[0.03] float-slow`}
        style={{ animationDelay: '3.5s' }}
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      {/* Subtle ambient glows - Very minimal for premium feel */}
      <div className={`absolute top-[5%] left-[30%] w-32 h-32 ${colors.glow} opacity-[0.012] rounded-full blur-3xl`} />
      <div className={`absolute bottom-[10%] right-[20%] w-40 h-40 ${colors.glow} opacity-[0.008] rounded-full blur-3xl`} />
    </div>
  );
}

