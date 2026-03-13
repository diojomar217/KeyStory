'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import Image from 'next/image';
import { Theme } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';

export type QRLayout = 'classic' | 'minimal' | 'elegant';

interface QRCardProps {
  theme: Theme;
  customerName: string;
  partnerName: string;
  anniversaryDate?: string;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  websiteUrl?: string;
  layout?: QRLayout;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Romantic taglines for different themes
const romanticTaglines: Record<Theme, string[]> = {
  romantic_classic: [
    "Every love story is beautiful, but ours is my favorite.",
    "A little code that leads to a lot of memories.",
    "Scan to view our story",
    "Where it all began...",
  ],
  cute_pastel: [
    "You + Me = ❤️",
    "Our love in one scan!",
    "Tap into our sweet memories ✨",
    "Love is in the air!",
  ],
  minimal_modern: [
    "Our story, one scan away.",
    "A glimpse into us.",
    "Scan to explore.",
    "The beginning of forever.",
  ],
  dark_elegant: [
    "A love worth preserving.",
    "In the darkness, you are my light.",
    "Scan to discover our tale.",
    "Forever begins with you.",
  ],
  // Additional themes - reuse similar taglines
  soft_pastel: [
    "Every love story is beautiful, but ours is my favorite.",
    "A little code that leads to a lot of memories.",
    "Scan to view our story",
    "Where it all began...",
  ],
  elegant_rose_gold: [
    "A love worth preserving.",
    "In the darkness, you are my light.",
    "Scan to discover our tale.",
    "Forever begins with you.",
  ],
  vintage_love_letter: [
    "A little code that leads to a lot of memories.",
    "Every love story is beautiful, but ours is my favorite.",
    "Scan to view our story",
    "Where it all began...",
  ],
  scrapbook_memories: [
    "You + Me = ❤️",
    "Our love in one scan!",
    "Tap into our sweet memories ✨",
    "Love is in the air!",
  ],
  wedding_style: [
    "Forever begins with you.",
    "A love worth preserving.",
    "Scan to discover our tale.",
    "Where it all began...",
  ],
  floral_romance: [
    "Every love story is beautiful, but ours is my favorite.",
    "A little code that leads to a lot of memories.",
    "Scan to view our story",
    "Where it all began...",
  ],
  dreamy_pink: [
    "You + Me = ❤️",
    "Our love in one scan!",
    "Tap into our sweet memories ✨",
    "Love is in the air!",
  ],
  luxury_gold: [
    "A love worth preserving.",
    "In the darkness, you are my light.",
    "Scan to discover our tale.",
    "Forever begins with you.",
  ],
  minimal_white: [
    "Our story, one scan away.",
    "A glimpse into us.",
    "Scan to explore.",
    "The beginning of forever.",
  ],
  cute_kawaii: [
    "You + Me = ❤️",
    "Our love in one scan!",
    "Tap into our sweet memories ✨",
    "Love is in the air!",
  ],
  soft_lavender: [
    "Every love story is beautiful, but ours is my favorite.",
    "A little code that leads to a lot of memories.",
    "Scan to view our story",
    "Where it all began...",
  ],
  photo_focus: [
    "Our story, one scan away.",
    "A glimpse into us.",
    "Scan to explore.",
    "The beginning of forever.",
  ],
};

// Scan instructions
const scanInstructions = [
  "Scan to view our story",
  "Point your camera to see our love",
  "A little code that leads to a lot of memories",
];

export default function QRCard({
  theme,
  customerName,
  partnerName,
  anniversaryDate,
  qrCodeUrl,
  qrDataUrl,
  websiteUrl,
  layout = 'classic',
  size = 'medium',
  className = '',
}: QRCardProps) {
  const styles = useTheme(theme);
  const coupleNames = `${customerName} & ${partnerName}`;
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Get theme-specific colors
  const getThemeColors = () => {
    switch (theme) {
      case 'dark_elegant':
        return {
          primary: '#fbbf24', // amber-400
          secondary: '#f59e0b', // amber-500
          accent: '#d97706', // amber-600
          bg: 'from-zinc-800 to-zinc-900',
          border: 'border-zinc-600',
          text: 'text-zinc-100',
          textMuted: 'text-zinc-400',
        };
      case 'cute_pastel':
        return {
          primary: '#c084fc', // purple-400
          secondary: '#a855f7', // purple-500
          accent: '#9333ea', // purple-600
          bg: 'from-purple-50 to-pink-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          textMuted: 'text-purple-700',
        };
      case 'minimal_modern':
        return {
          primary: '#94a3b8', // slate-400
          secondary: '#64748b', // slate-500
          accent: '#475569', // slate-600
          bg: 'from-slate-50 to-gray-100',
          border: 'border-slate-200',
          text: 'text-slate-900',
          textMuted: 'text-slate-600',
        };
      default: // romantic_classic
        return {
          primary: '#fb7185', // rose-400
          secondary: '#f43f5e', // rose-500
          accent: '#e11d48', // rose-600
          bg: 'from-rose-50 to-pink-50',
          border: 'border-rose-200',
          text: 'text-rose-900',
          textMuted: 'text-rose-700',
        };
    }
  };

  const colors = getThemeColors();
  const taglines = romanticTaglines[theme];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];
  const instruction = scanInstructions[Math.floor(Math.random() * scanInstructions.length)];

  // Size configurations
  const sizeConfig = {
    compact: { card: 'max-w-[180px]', qr: 120, padding: 'p-2' },
    small: { card: 'max-w-[280px]', qr: 180, padding: 'p-4' },
    medium: { card: 'max-w-[340px]', qr: 220, padding: 'p-6' },
    large: { card: 'max-w-[400px]', qr: 260, padding: 'p-8' },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate styled QR code
  useEffect(() => {
    if (!qrRef.current || !qrDataUrl || !isClient) return;

    // Get accent color based on theme
    const getAccentColor = () => {
      switch (theme) {
        case 'dark_elegant': return '#fbbf24';
        case 'cute_pastel': return '#c084fc';
        case 'minimal_modern': return '#64748b';
        default: return '#e11d48';
      }
    };

    const qrCode = new QRCodeStyling({
      width: sizeConfig[size].qr,
      height: sizeConfig[size].qr,
      type: 'canvas',
      data: qrDataUrl,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
      },
      dotsOptions: {
        color: getAccentColor(),
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: getAccentColor(),
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: getAccentColor(),
        type: 'dot',
      },
      image: '/heart-icon.svg',
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    qrCodeInstanceRef.current = qrCode;
    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);

  }, [qrDataUrl, theme, size, isClient]);

  // Render different layouts
  const renderClassicLayout = () => (
    <div className={`
      relative
      bg-gradient-to-br ${colors.bg}
      rounded-3xl
      shadow-xl
      ${colors.border} border
      ${sizeConfig[size].padding}
      ${sizeConfig[size].card}
      ${className}
    `}>
      {/* Decorative corner elements */}
      <div className={`absolute top-0 left-0 w-12 h-12 opacity-20`}>
        <svg viewBox="0 0 100 100" className={`w-full h-full text-${colors.primary}`}>
          <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      </div>
      <div className={`absolute bottom-0 right-0 w-12 h-12 opacity-20 rotate-180`}>
        <svg viewBox="0 0 100 100" className={`w-full h-full text-${colors.primary}`}>
          <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      </div>

      {/* Card Content */}
      <div className="flex flex-col items-center text-center">
        {/* Heart Decoration */}
        <div className="text-2xl mb-3">💕</div>

        {/* Couple Names */}
        <h3 className={`${styles.heading} text-lg md:text-xl font-bold ${colors.text} mb-4`}>
          {coupleNames}
        </h3>

        {/* QR Code Container */}
        <div className={`
          relative
          bg-white
          rounded-2xl
          shadow-lg
          p-3
          mb-4
          border-2
          ${colors.border}
        `}>
          {/* Gradient frame effect */}
          <div className={`
            absolute -inset-1.5
            rounded-2.5xl
            opacity-30
            bg-gradient-to-br from-${colors.primary} to-${colors.secondary}
            -z-10
          `} />
          
          {qrDataUrl && isClient ? (
            <div 
              ref={qrRef} 
              className="mx-auto"
              style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}
            />
          ) : qrCodeUrl ? (
            <div className="relative" style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}>
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center bg-gray-100 rounded-lg"
              style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}
            >
              <span className={colors.textMuted}>No QR Code</span>
            </div>
          )}
          
          {/* Heart icon below QR */}
          <div className="text-center mt-2">
            <span className="text-xl">💕</span>
          </div>
        </div>

        {/* Scan Instruction */}
        <p className={`${colors.textMuted} text-sm mb-3 font-medium`}>
          {instruction}
        </p>

        {/* Divider */}
        <div className={`w-16 h-px bg-gradient-to-r from-transparent via-${colors.border} to-transparent my-3`} />

        {/* Tagline */}
        <p className={`${colors.textMuted} text-xs italic mb-3`}>
          "{tagline}"
        </p>

        {/* Footer: Anniversary Date or Website URL */}
        {anniversaryDate && (
          <p className={`${colors.text} text-xs font-medium`}>
            💍 Since {new Date(anniversaryDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
        
        {websiteUrl && !anniversaryDate && (
          <p className={`${colors.textMuted} text-xs`}>
            {websiteUrl}
          </p>
        )}
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div className={`
      relative
      bg-white
      rounded-2xl
      shadow-lg
      border border-slate-200
      ${sizeConfig[size].padding}
      ${sizeConfig[size].card}
      ${className}
    `}>
      {/* Minimal horizontal layout */}
      <div className="flex flex-row items-center gap-4">
        {/* QR Code */}
        <div className="flex-shrink-0">
          <div className="relative bg-white rounded-lg p-2 border border-slate-200">
            {qrDataUrl && isClient ? (
              <div 
                ref={qrRef} 
                className="mx-auto"
                style={{ width: sizeConfig[size].qr * 0.8, height: sizeConfig[size].qr * 0.8 }}
              />
            ) : qrCodeUrl ? (
              <div className="relative" style={{ width: sizeConfig[size].qr * 0.8, height: sizeConfig[size].qr * 0.8 }}>
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div 
                className="flex items-center justify-center bg-gray-100 rounded"
                style={{ width: sizeConfig[size].qr * 0.8, height: sizeConfig[size].qr * 0.8 }}
              >
                <span className="text-slate-400 text-xs">No QR</span>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left">
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            {coupleNames}
          </h3>
          <p className="text-slate-600 text-sm mb-2">
            {instruction}
          </p>
        {anniversaryDate && (
          <p className="text-slate-500 text-xs">
            💍 {new Date(anniversaryDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric'
            })}
          </p>
        )}
        </div>
      </div>
    </div>
  );

  const renderElegantLayout = () => (
    <div className={`
      relative
      bg-white
      rounded-xl
      shadow-2xl
      border border-slate-100
      ${sizeConfig[size].padding}
      ${sizeConfig[size].card}
      ${className}
      overflow-hidden
    `}>
      {/* Top accent bar */}
      <div className={`
        absolute top-0 left-0 right-0 h-1
        bg-gradient-to-r from-${colors.primary} via-${colors.secondary} to-${colors.primary}
      `} />

      {/* Card Content */}
      <div className="flex flex-col items-center text-center pt-2">
        {/* Elegant divider with heart */}
        <div className="flex items-center gap-3 mb-4 w-full">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-2xl">💕</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Couple Names */}
        <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-2">
          {coupleNames}
        </h3>

        {/* Elegant tagline */}
        <p className="text-slate-500 text-sm italic mb-6">
          {tagline}
        </p>

        {/* QR Code */}
        <div className="relative bg-white rounded-xl shadow-md p-4 mb-4 border border-slate-100">
          {qrDataUrl && isClient ? (
            <div 
              ref={qrRef} 
              className="mx-auto"
              style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}
            />
          ) : qrCodeUrl ? (
            <div className="relative" style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}>
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center bg-gray-50 rounded-lg"
              style={{ width: sizeConfig[size].qr, height: sizeConfig[size].qr }}
            >
              <span className="text-slate-400">No QR Code</span>
            </div>
          )}
        </div>

        {/* Instruction */}
        <p className="text-slate-600 text-sm font-medium mb-4">
          📱 {instruction}
        </p>

        {/* Bottom divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-4" />

        {/* Footer */}
        <div className="text-center">
          {anniversaryDate && (
            <p className="text-slate-700 text-sm font-medium mb-1">
              Our journey since {new Date(anniversaryDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          )}
          {websiteUrl && (
            <p className="text-slate-400 text-xs">
              {websiteUrl.replace(/^https?:\/\//, '')}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Render selected layout
  switch (layout) {
    case 'minimal':
      return renderMinimalLayout();
    case 'elegant':
      return renderElegantLayout();
    case 'classic':
      return renderClassicLayout();
    default:
      return renderClassicLayout();
  }
}

