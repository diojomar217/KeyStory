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

  const getDecorationColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          hearts: 'text-amber-400/30',
          sparkles: 'text-amber-300/25',
          petals: 'text-amber-500/20',
          glow: 'bg-amber-400/10',
        };
      case 'cute_pastel':
        return {
          hearts: 'text-pink-400/35',
          sparkles: 'text-purple-400/30',
          petals: 'text-pink-500/25',
          glow: 'bg-pink-400/12',
        };
      case 'minimal_modern':
        return {
          hearts: 'text-slate-400/25',
          sparkles: 'text-slate-300/20',
          petals: 'text-slate-500/18',
          glow: 'bg-slate-400/8',
        };
      default:
        return {
          hearts: 'text-rose-300/35',
          sparkles: 'text-pink-300/30',
          petals: 'text-rose-400/25',
          glow: 'bg-rose-300/10',
        };
    }
  };

  const colors = getDecorationColors();

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Enhanced Floating Hearts - more organic placement & motion */}
      <div className={`absolute top-[8%] left-[8%] w-8 h-8 ${colors.hearts} animate-float-heart-slow`} style={{ animationDelay: '0s', animationDuration: '25s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div className={`absolute top-[15%] right-[10%] w-7 h-7 ${colors.hearts} animate-float-heart`} style={{ animationDelay: '6s', animationDuration: '22s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div className={`absolute bottom-[25%] left-[12%] w-9 h-9 ${colors.hearts} animate-float-heart-reverse`} style={{ animationDelay: '12s', animationDuration: '28s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div className={`absolute bottom-[35%] right-[8%] w-6 h-6 ${colors.hearts} animate-float-heart-slow`} style={{ animationDelay: '3s', animationDuration: '20s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      {/* Sparkles Cluster */}
      <div className={`absolute top-[25%] left-[25%] w-5 h-5 ${colors.sparkles} animate-twinkle`} style={{ animationDelay: '1s', animationDuration: '3s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div className={`absolute top-[55%] right-[25%] w-4 h-4 ${colors.sparkles} animate-twinkle`} style={{ animationDelay: '4s', animationDuration: '2.5s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div className={`absolute bottom-[40%] left-[25%] w-6 h-6 ${colors.sparkles} animate-twinkle-slow`} style={{ animationDelay: '8s', animationDuration: '4s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      {/* Petals - Rose petals falling gently */}
      <div className={`absolute top-[20%] right-[20%] w-6 h-6 ${colors.petals} animate-petal-fall`} style={{ animationDelay: '2s', animationDuration: '15s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 1 -10 10 10 10 0 0 1 10 -10m0 -2a12 12 0 1 0 12 -12a12 12 0 0 1 -12 12z"/>
        </svg>
      </div>

      <div className={`absolute bottom-[15%] left-[25%] w-5 h-5 ${colors.petals} animate-petal-float`} style={{ animationDelay: '5s', animationDuration: '18s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 1 -10 10 10 10 0 0 1 10 -10m0 -2a12 12 0 1 0 12 -12a12 12 0 0 1 -12 12z"/>
        </svg>
      </div>

      {/* Ambient Glow Orbs */}
      <div className={`absolute top-[5%] left-[35%] w-36 h-36 ${colors.glow} rounded-full blur-3xl animate-glow-pulse`} style={{ animationDelay: '0s' }} />
      <div className={`absolute bottom-[8%] right-[30%] w-48 h-48 ${colors.glow} rounded-full blur-[4rem] animate-glow-float`} style={{ animationDelay: '7s' }} />
      <div className={`absolute top-[70%] left-[5%] w-28 h-28 ${colors.glow} rounded-full blur-2xl animate-glow-slow`} style={{ animationDelay: '10s' }} />

      <style jsx>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(5deg) scale(1.1); }
          50% { transform: translateY(-35px) rotate(0deg) scale(1.05); }
          75% { transform: translateY(-15px) rotate(-3deg) scale(1.1); }
        }
        @keyframes float-heart-slow { animation-duration: 30s; }
        @keyframes float-heart-reverse { animation: float-heart 28s ease-in-out infinite reverse; }
        @keyframes twinkle { 
          0%, 100% { opacity: 0.05; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.15; transform: scale(1.3) rotate(180deg); }
        }
        @keyframes twinkle-slow { animation-duration: 5s; }
        @keyframes petal-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.25; }
          90% { opacity: 0.05; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes petal-float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(20px) rotate(120deg); }
          66% { transform: translateY(-10px) translateX(-10px) rotate(240deg); }
        }
        @keyframes glow-pulse { 
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes glow-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes glow-slow { animation-duration: 35s; }
      `}</style>
    </div>
  );
}

