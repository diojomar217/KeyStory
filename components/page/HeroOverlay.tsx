'use client';

import type { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../builder/ThemeWrapper';
import { useThemeUtils } from '../builder/ThemeWrapper';
import { useEffect, useState } from 'react';
import { resolveDecorations, resolveDefaultCTA } from '@/lib/site-type-utils';
import { OccasionType } from '@/lib/occasion-registry';
import { getOccasionHeroSpec } from '@/config/occasionHeroConfig';

type Props = {
  theme: ThemeKey;
  variant?: 'full' | 'top-bottom' | 'vignette' | 'cinematic';
};

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const fullHex = normalized.length === 3
    ? normalized.split('').map((ch) => ch + ch).join('')
    : normalized;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}

function getScrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined') return 'auto';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export default function HeroOverlay({ theme, variant = 'full' }: Props) {
  const styles = useTheme(theme);
  const { colors } = useThemeUtils(theme);
  const baseTint = hexToRgba(colors.text, 0.18);
  const accentTint = hexToRgba(colors.accent, 0.12);
  const deepTint = hexToRgba(colors.text, 0.45);

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
        <div
          className="absolute inset-x-0 top-0 h-32 md:h-48"
          style={{ background: `linear-gradient(to bottom, ${baseTint}, transparent)` }}
        />
        <div
          className="absolute inset-x-0 top-[30%] h-32 md:h-48"
          style={{ background: `linear-gradient(to bottom, transparent, ${accentTint}, ${baseTint})` }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 md:h-56"
          style={{ background: `linear-gradient(to top, ${deepTint}, ${baseTint}, transparent)` }}
        />
        <div className="absolute inset-0" style={{ 
          background: `radial-gradient(ellipse at center, transparent 50%, ${hexToRgba(colors.text, 0.22)} 100%)`,
        }} />
      </div>
    );
  }

  if (variant === 'top-bottom') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-x-0 top-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to bottom, ${hexToRgba(colors.text, 0.24)}, transparent)` }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-24 md:h-32"
          style={{ background: `linear-gradient(to top, ${hexToRgba(colors.text, 0.34)}, transparent)` }}
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const decorations = resolveDecorations(siteType);
  const { colors } = useThemeUtils(theme);
  const iconColor =
    decorations.themeTone === 'romantic'
      ? colors.accent
      : decorations.themeTone === 'celebration'
        ? colors.secondary
        : colors.primary;
  const animationClass = (() => {
    if (prefersReducedMotion) return '';

    switch (decorations.themeTone) {
      case 'celebration':
        return 'animate-birthday-confetti';
      case 'elegant':
        return 'animate-twinkle';
      case 'soft':
        return 'animate-petal-float';
      case 'romantic':
      default:
        return 'animate-float-heart';
    }
  })();


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
          className={`absolute ${animationClass}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: prefersReducedMotion ? '0s' : '7s',
            fontSize: variant === 'centered' ? '1rem' : '1.25rem',
            opacity: variant === 'centered' ? 0.35 : 0.55,
            color: iconColor,
            textShadow: `0 6px 16px ${hexToRgba(colors.text, 0.2)}`,
          }}
        >
          <span>{item.emoji}</span>
        </div>
      ))}

      {decorations.themeTone === 'celebration' && (
        <>
          <div
            className={`absolute top-10 left-1/4 w-3 h-3 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse-slow'}`}
            style={{ backgroundColor: hexToRgba(colors.secondary, 0.75) }}
          />
          <div
            className={`absolute top-32 right-24 w-4 h-4 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse-slow'}`}
            style={{ backgroundColor: hexToRgba(colors.accent, 0.7) }}
          />
        </>
      )}
    </div>
  );
}

export function ScrollIndicator({ targetId = 'our-story' }: { targetId?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToContent = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: getScrollBehavior() });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: getScrollBehavior() });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 group cursor-pointer"
      aria-label="Open story"
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
          premium-cta-shell premium-cta-secondary
        ">
          <span className="flex items-center gap-2">
            <span className={prefersReducedMotion ? '' : 'animate-heartbeat'}>💕</span>
            Open Story
            <span className={prefersReducedMotion ? '' : 'animate-bounce-subtle'}>↓</span>
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
  const heroSpec = getOccasionHeroSpec(siteType);
  const ctaConfig = resolveDefaultCTA(siteType);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetIds = [primaryTarget, secondaryTarget].filter(Boolean);
    const elements = targetIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.25, 0.5, 0.8],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [primaryTarget, secondaryTarget]);

  const scrollToTarget = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
      return;
    }

    window.location.hash = targetId;
  };

  const shouldRenderSecondary = heroSpec.showSecondaryCta && Boolean(secondaryTarget);
  const shouldPromoteSecondary = shouldRenderSecondary && activeSection === primaryTarget;
  const primaryDestination = shouldPromoteSecondary ? secondaryTarget : primaryTarget;
  const primaryLabel = shouldPromoteSecondary ? ctaConfig.secondary : ctaConfig.primary;
  const primaryIcon = shouldPromoteSecondary ? ctaConfig.endIcon : ctaConfig.startIcon;
  const primaryArrow = shouldPromoteSecondary ? '→' : '↓';

  return (
    <div 
      className="fixed left-0 right-0 flex flex-col items-center gap-4 px-4"
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        zIndex: 99999,
      }}
    >
      <div className="flex w-full max-w-2xl flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <a
          href={`#${primaryDestination}`}
          className="
            w-full sm:min-w-[220px] sm:w-auto h-14
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
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
            premium-cta-shell premium-cta-secondary
          "
          style={{
            pointerEvents: 'auto',
            transitionDuration: prefersReducedMotion ? '0ms' : undefined,
          }}
          onClick={(event) => {
            event.preventDefault();
            scrollToTarget(primaryDestination);
          }}
        >
          <span>{primaryIcon}</span>
          {primaryLabel}
          <span>{primaryArrow}</span>
        </a>

        {shouldRenderSecondary && (
          <a
            href={`#${secondaryTarget}`}
            className="
              w-full sm:min-w-[220px] sm:w-auto h-14
              px-6 
              rounded-full
              text-white text-sm font-medium
              hover:scale-105 active:scale-95
              transition-all duration-300
              shadow-lg
              inline-flex items-center justify-center gap-2
              whitespace-nowrap
              cursor-pointer
              no-underline
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
              premium-cta-shell premium-cta-primary
            "
            style={{
              pointerEvents: 'auto',
              transitionDuration: prefersReducedMotion ? '0ms' : undefined,
              background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))',
              borderColor: hexToRgba('#FFFFFF', 0.45),
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              opacity: activeSection === secondaryTarget ? 0.88 : 1,
            }}
            onClick={(event) => {
              event.preventDefault();
              scrollToTarget(secondaryTarget);
            }}
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
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToContent = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: getScrollBehavior() });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: getScrollBehavior() });
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
        premium-cta-shell premium-cta-secondary
      "
    >
      <span className={prefersReducedMotion ? '' : 'animate-heartbeat'}>💕</span>
      Open Story
    </button>
  );
}

