'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import type { ThemeKey } from '@/config/themeConfig';

interface ParticlesCanvasProps {
  theme: ThemeKey;
  className?: string;
}

export default function ParticlesCanvas({ theme, className = '' }: ParticlesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getParticleColor = (theme: Theme) => {
    const colors = {
      'romantic_classic': '#ec4899',
      'cute_pastel': '#a78bfa',
      'dark_elegant': '#fbbf24',
      'minimal_modern': '#94a3b8',
      default: '#f472b6'
    };
    return colors[theme as keyof typeof colors] || colors.default;
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const color = getParticleColor(theme);
    const particles: { x: number; y: number; vy: number; opacity: number; size: number }[] = [];

    // Create 20-40 particles based on canvas size
    const particleCount = Math.floor((canvas.width * canvas.height) / 50000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        vy: (Math.random() * 0.5 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.5 + 0.2,
        size: Math.random() * 3 + 1,
      });
    }

    const animateFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.y += p.vy;
        if (p.y < -50 || p.y > canvas.height + 50) {
          p.y = canvas.height + 50;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animateFrame);
    };

    animateFrame();

    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  useEffect(() => {
    animate();
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`particles-canvas w-full h-full absolute inset-0 z-0 pointer-events-none ${className}`}
    />
  );
}

