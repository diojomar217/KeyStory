'use client';

import { useEffect, useState } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import { OccasionType } from '@/lib/types';
import { resolveDecorations } from '@/lib/site-type-utils';

interface BackgroundDecorationsProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  className?: string;
}

export default function BackgroundDecorations({ theme, siteType = 'couple', className = '' }: BackgroundDecorationsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getDecorationColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          primary: 'text-amber-400/30',
          secondary: 'text-amber-300/25',
          accent: 'bg-amber-400/10',
        };
      case 'cute_pastel':
        return {
          primary: 'text-pink-400/35',
          secondary: 'text-purple-400/30',
          accent: 'bg-pink-400/12',
        };
      case 'minimal_modern':
        return {
          primary: 'text-slate-400/25',
          secondary: 'text-slate-300/20',
          accent: 'bg-slate-400/8',
        };
      default:
        return {
          primary: 'text-rose-300/35',
          secondary: 'text-pink-300/30',
          accent: 'bg-rose-300/10',
        };
    }
  };

  const colors = getDecorationColors();
  const decorations = resolveDecorations(siteType);
  const motionClassByTone = {
    romantic: ['animate-float-heart-slow', 'animate-float-heart', 'animate-float-heart-reverse'],
    celebration: ['animate-celebration-float', 'animate-celebration-bob', 'animate-celebration-float'],
    elegant: ['animate-twinkle', 'animate-twinkle-slow', 'animate-glow-float'],
    soft: ['animate-petal-float', 'animate-petal-fall', 'animate-glow-slow'],
  } as const;

  const floatingDecorations = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    icon: decorations.iconSet[index % decorations.iconSet.length],
    left: 8 + ((index * 11) % 84),
    top: 6 + ((index * 13) % 82),
    size: 18 + ((index * 5) % 18),
    opacity: decorations.themeTone === 'elegant' ? 0.16 : decorations.themeTone === 'soft' ? 0.18 : 0.26,
    animationClass: motionClassByTone[decorations.themeTone][index % motionClassByTone[decorations.themeTone].length],
    animationDuration: `${18 + (index % 4) * 5}s`,
    animationDelay: `${(index * 1.2) % 5}s`,
  }));

  const ambientDots = Array.from({ length: decorations.themeTone === 'celebration' ? 16 : 8 }, (_, index) => ({
    id: index,
    left: 4 + ((index * 9) % 92),
    top: 8 + ((index * 7) % 84),
    size: 4 + ((index * 3) % 8),
    opacity: decorations.themeTone === 'celebration' ? 0.45 : 0.22,
    animationDuration: `${6 + (index % 5) * 1.6}s`,
    animationDelay: `${(index * 0.2) % 2.4}s`,
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {floatingDecorations.map((item) => (
        <div
          key={`floating-${item.id}`}
          className={`absolute ${item.animationClass}`}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animationDuration: item.animationDuration,
            animationDelay: item.animationDelay,
          }}
        >
          <span className={colors.primary}>{item.icon}</span>
        </div>
      ))}

      {ambientDots.map((item) => (
        <div
          key={`dot-${item.id}`}
          className={`absolute rounded-full ${decorations.themeTone === 'celebration' ? 'animate-birthday-confetti' : 'animate-glow-pulse'}`}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            backgroundColor: decorations.themeTone === 'celebration'
              ? ['#F59E0B', '#F43F5E', '#A855F7', '#38BDF8', '#34D399'][item.id % 5]
              : 'rgba(255,255,255,0.24)',
            opacity: item.opacity,
            animationDuration: item.animationDuration,
            animationDelay: item.animationDelay,
          }}
        />
      ))}

      {decorations.themeTone === 'celebration' && (
        <>
          <div className="absolute bottom-14 left-10 w-8 h-12 bg-pink-300/70 rounded-full blur-sm animate-birthday-balloon" />
          <div className="absolute bottom-18 right-16 w-9 h-14 bg-blue-300/70 rounded-full blur-sm animate-birthday-balloon" />
          <div className="absolute bottom-20 left-72 w-7 h-10 bg-yellow-300/70 rounded-full blur-sm animate-birthday-balloon" />
        </>
      )}

      <div className={`absolute top-[5%] left-[20%] w-40 h-40 ${colors.accent} rounded-full blur-3xl animate-glow-pulse`} style={{ opacity: decorations.themeTone === 'soft' ? 0.22 : 0.35 }} />
      <div className={`absolute bottom-[15%] right-[30%] w-44 h-44 ${colors.accent} rounded-full blur-[4rem] animate-glow-float`} style={{ opacity: decorations.themeTone === 'elegant' ? 0.18 : 0.25 }} />
      <div className={`absolute top-[70%] left-[5%] w-28 h-28 ${colors.accent} rounded-full blur-2xl animate-glow-slow`} style={{ opacity: decorations.themeTone === 'romantic' ? 0.2 : 0.14 }} />

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
        @keyframes celebration-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          30% { transform: translateY(-18px) rotate(8deg) scale(1.08); }
          65% { transform: translateY(8px) rotate(-8deg) scale(0.96); }
        }
        @keyframes celebration-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes birthday-confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0.1; }
        }
        @keyframes birthday-balloon {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .animate-birthday-confetti {
          animation-name: birthday-confetti;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in;
        }
        .animate-birthday-balloon {
          animation-name: birthday-balloon;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .animate-celebration-float {
          animation-name: celebration-float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .animate-celebration-bob {
          animation-name: celebration-bob;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}

