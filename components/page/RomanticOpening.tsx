'use client';

import { useState, useCallback, useMemo } from 'react';
import { Theme } from '@/lib/types';

interface RomanticOpeningProps {
  theme: Theme;
  tagline?: string;
  onReveal: () => void;
}

export default function RomanticOpening({ theme, tagline, onReveal }: RomanticOpeningProps) {
  const [isHiding, setIsHiding] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

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

  // Generate heart burst positions using useMemo for deterministic rendering
  const heartBurstPositions = useMemo(() => {
    const positions = [];
    const numHearts = 20;
    
    for (let i = 0; i < numHearts; i++) {
      const angle = (i / numHearts) * 360;
      // Use a deterministic "random" based on index for consistent rendering
      const distance = 200 + ((i * 37) % 200); // Pseudo-random but deterministic
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

  // Generate heart burst particles
  const renderHeartBurst = () => {
    if (!showBurst) return null;

    const hearts = heartBurstPositions.map((pos, i) => (
      <div
        key={i}
        className="heart-burst animate"
        style={{
          '--tx': `${pos.tx}px`,
          '--ty': `${pos.ty}px`,
        } as React.CSSProperties}
      >
        💕
      </div>
    ));
    
    return <div className="heart-burst-container">{hearts}</div>;
  };

  return (
    <>
      <div
        className={`opening-screen ${themeClasses.bg} ${
          isHiding ? 'hidden' : ''
        }`}
      >
        {/* Floating hearts decoration */}
        <span className="opening-floating-heart">💕</span>
        <span className="opening-floating-heart">❤️</span>
        <span className="opening-floating-heart">💗</span>
        <span className="opening-floating-heart">💖</span>
        <span className="opening-floating-heart">💘</span>

        <div className={`opening-content ${isHiding ? 'hiding' : ''}`}>
          {/* Title */}
          <h1 className={`opening-title ${themeClasses.title} font-serif`}>
            A message for you
          </h1>

          {/* Subtitle - Show tagline if available, otherwise show default */}
          <p className={`opening-subtitle ${themeClasses.subtitle}`}>
            {tagline ? `"${tagline}"` : "This website was made with love."}
          </p>

          {/* Open Button */}
          <button
            onClick={handleOpen}
            className={`opening-button ${themeClasses.button}`}
            aria-label="Open your love story"
          >
            <span className="opening-button-heart">💕</span>
            <span>Open Your Love Story</span>
          </button>
        </div>
      </div>

      {/* Heart burst animation */}
      {renderHeartBurst()}
    </>
  );
}

