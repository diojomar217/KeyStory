'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import { resolveHeroConfig } from '@/lib/site-type-utils';

interface RomanticOpeningProps {
  theme: ThemeKey;
  siteType?: OccasionType;
  customerName?: string;
  partnerName?: string;
  tagline?: string;
  onReveal: () => void;
}

export default function RomanticOpening({
  theme,
  siteType = 'couple',
  customerName,
  partnerName,
  tagline,
  onReveal,
}: RomanticOpeningProps) {
  const [isHiding, setIsHiding] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const participants = [
    { id: 'customer', name: customerName || 'You' },
    ...(partnerName ? [{ id: 'partner', name: partnerName }] : []),
  ];
  const heroConfig = resolveHeroConfig(siteType || 'couple', participants, undefined);
  const floatingIcons = heroConfig.decorations.iconSet.slice(0, 5);

  // Get theme-specific classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          bg: 'opening-bg-gradient-dark',
          title: 'text-amber-200',
          subtitle: 'text-amber-100/70',
          button: 'opening-button-amber',
        };
      case 'cute_pastel':
        return {
          bg: 'opening-bg-gradient-pastel',
          title: 'opening-title-purple',
          subtitle: 'opening-subtitle-purple',
          button: 'opening-button-purple',
        };
      case 'minimal_modern':
        return {
          bg: 'opening-bg-gradient-minimal',
          title: 'opening-title-slate',
          subtitle: 'opening-subtitle-slate',
          button: 'opening-button-slate',
        };
      case 'romantic_classic':
      default:
        return {
          bg: 'opening-bg-gradient',
          title: 'opening-title-rose',
          subtitle: 'opening-subtitle-rose',
          button: 'opening-button-rose',
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Generate burst positions using useMemo for deterministic rendering
  const burstPositions = useMemo(() => {
    const positions = [];
    const num = 24;
    
    for (let i = 0; i < num; i++) {
      const angle = (i / num) * 360;
      const distance = 180 + ((i * 41) % 220);
      const tx = Math.cos((angle * Math.PI) / 180) * distance;
      const ty = Math.sin((angle * Math.PI) / 180) * distance;
      positions.push({ tx, ty });
    }
    return positions;
  }, []);

  const handleOpen = useCallback(() => {
    setIsHiding(true);
    setShowBurst(true);
    
    // Wait for animations to complete
    setTimeout(() => {
      onReveal();
    }, 1500);
  }, [onReveal]);

  // Generate burst particles
  const renderBurst = () => {
    if (!showBurst) return null;

    const emojis = heroConfig.decorations.iconSet;

    const particles = burstPositions.map((pos, i) => (
      <div
        key={i}
        className="heart-burst animate"
        style={{
          '--tx': `${pos.tx}px`,
          '--ty': `${pos.ty}px`,
        } as React.CSSProperties}
      >
        {emojis[i % emojis.length]}
      </div>
    ));
    
    return <div className="heart-burst-container">{particles}</div>;
  };

  return (
    <>
      <div
        className={`opening-screen ${themeClasses.bg} ${
          isHiding ? 'hidden' : ''
        }`}
      >
        {/* Occasion-aware decoration */}
        {floatingIcons.map((icon, index) => (
          <span key={`${icon}-${index}`} className="opening-floating-heart">{icon}</span>
        ))}

        <div className={`opening-content ${isHiding ? 'hiding' : ''}`}>
          {/* Title */}
          <h1 className={`opening-title ${themeClasses.title} font-serif`}>
            {heroConfig.title}
          </h1>

          {/* Subtitle */}
          <p className={`opening-subtitle ${themeClasses.subtitle}`}>
            {tagline ? `"${tagline}"` : heroConfig.subtitle}
          </p>

          {/* Open Button */}
          <button
            onClick={handleOpen}
            className={`opening-button ${themeClasses.button}`}
            aria-label={heroConfig.cta.primary}
          >
            <span className="opening-button-heart">{heroConfig.cta.startIcon}</span>
            <span>{heroConfig.cta.primary}</span>
            <span className="opening-button-heart">{heroConfig.cta.endIcon}</span>
          </button>
        </div>
      </div>

      {/* Occasion burst animation */}
      {renderBurst()}
    </>
  );
}

