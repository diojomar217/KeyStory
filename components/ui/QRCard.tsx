'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import Image from 'next/image';
import { ThemeKey } from '@/config/themeConfig';
import { useTheme } from '../builder/ThemeWrapper';
import { getThemeTaglines } from '@/config/themeTaglines';
import {
  getCardStyleClasses,
  getShadowClass,
  getThemeColors,
  mapHexToTailwindClass,
} from '@/lib/theme-color-helpers';

export type QRLayout = 'classic' | 'minimal' | 'elegant';

interface QRCardProps {
  theme: ThemeKey;
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

import { THEME_TAGLINES } from '@/config/themeTaglines';

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
  const themeColors = getThemeColors(theme);
  const coupleNames = `${customerName} & ${partnerName}`;
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [taglineText, setTaglineText] = useState<string>('');
  const [instructionText, setInstructionText] = useState<string>('');

  // Size configurations - maps to actual card sizes
  const sizeConfig = {
    small: { card: 'max-w-xs', qr: 160, padding: 'p-4', textSize: 'text-sm', gap: 'gap-3' },
    medium: { card: 'max-w-sm', qr: 220, padding: 'p-6', textSize: 'text-base', gap: 'gap-4' },
    large: { card: 'max-w-lg', qr: 280, padding: 'p-8', textSize: 'text-lg', gap: 'gap-5' },
  };

  useEffect(() => {
    setIsClient(true);
    // Choose random tagline/instruction on client-side only
    try {
      const tl = getThemeTaglines(theme);
      setTaglineText(tl[Math.floor(Math.random() * tl.length)]);
      setInstructionText(scanInstructions[Math.floor(Math.random() * scanInstructions.length)]);
    } catch (e) {
      // ignore
    }
  }, []);
  const taglines = getThemeTaglines(theme);
  const tagline = taglineText || taglines[0] || '';
  const instruction = instructionText || scanInstructions[0];
  
  // Get theme-aware styling
  const cardStyleClass = getCardStyleClasses(theme);
  const shadowClass = getShadowClass(theme);

  // Generate styled QR code
  useEffect(() => {
    if (!qrRef.current || !qrDataUrl || !isClient) return;

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
        color: themeColors.primary,
        type: 'rounded',
      },
      backgroundOptions: {
        color: themeColors.background,
      },
      cornersSquareOptions: {
        color: themeColors.primary,
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: themeColors.primary,
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

  }, [qrDataUrl, theme, size, isClient, themeColors]);

  // Render different layouts
  const renderClassicLayout = () => (
    <div className={`
      relative
      ${sizeConfig[size].card}
      ${sizeConfig[size].padding}
      ${shadowClass}
      ${cardStyleClass}
      border
      ${className}
      flex flex-col items-center gap-${sizeConfig[size].gap}
    `}
    style={{
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    }}>
      {/* Decorative top accent */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 ${cardStyleClass}`}
        style={{
          background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
        }}
      />

      {/* Header Icon */}
      <div className="pt-2">
        <span className="text-3xl">💕</span>
      </div>

      {/* Couple Names */}
      <h3 className={`${sizeConfig[size].textSize} font-bold text-center`} style={{ color: themeColors.text }}>
        {coupleNames}
      </h3>

      {/* QR Code Container - Properly styled with theme card style */}
      <div 
        className={`
          relative
          ${cardStyleClass}
          ${shadowClass}
          p-3
          border-2
          flex items-center justify-center
          overflow-hidden
        `}
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.primary,
          width: sizeConfig[size].qr,
          height: sizeConfig[size].qr,
        }}
      >
        {qrDataUrl && isClient ? (
          <div 
            ref={qrRef}
            className="flex items-center justify-center w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : qrCodeUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={sizeConfig[size].qr - 12}
              height={sizeConfig[size].qr - 12}
              className="object-contain"
            />
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center w-full h-full"
            style={{ color: themeColors.text }}
          >
            <span className="text-2xl mb-2">📱</span>
            <span className="text-xs">No QR</span>
          </div>
        )}
      </div>

      {/* Scan Instruction */}
      <p className={`${sizeConfig[size].textSize} font-medium text-center`} style={{ color: themeColors.text }}>
        {instruction}
      </p>

      {/* Divider */}
      <div className="w-12 h-px" style={{ backgroundColor: themeColors.border }} />

      {/* Tagline */}
      <p className="text-xs italic text-center" style={{ color: themeColors.text, opacity: 0.75 }}>
        "{tagline}"
      </p>

      {/* Footer Content */}
      {(anniversaryDate || websiteUrl) && (
        <div className="text-center">
          {anniversaryDate && (
            <p className="text-xs font-medium" style={{ color: themeColors.text }}>
              💍 Since {new Date(anniversaryDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
          
          {websiteUrl && !anniversaryDate && (
            <p className="text-xs" style={{ color: themeColors.text, opacity: 0.7 }}>
              {websiteUrl}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderMinimalLayout = () => (
    <div className={`
      relative
      ${sizeConfig[size].card}
      ${sizeConfig[size].padding}
      ${shadowClass}
      ${cardStyleClass}
      border
      ${className}
    `}
    style={{
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    }}>
      {/* Minimal horizontal layout */}
      <div className="flex flex-row items-center gap-4">
        {/* QR Code */}
        <div className="flex-shrink-0">
          <div 
            className={`
              relative
              ${cardStyleClass}
              p-2
              border
              flex items-center justify-center
              overflow-hidden
            `}
            style={{
              backgroundColor: themeColors.background,
              borderColor: themeColors.primary,
              width: sizeConfig[size].qr * 0.75,
              height: sizeConfig[size].qr * 0.75,
            }}
          >
            {qrDataUrl && isClient ? (
              <div 
                ref={qrRef}
                className="flex items-center justify-center w-full h-full"
              />
            ) : qrCodeUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={Math.floor(sizeConfig[size].qr * 0.75 - 8)}
                  height={Math.floor(sizeConfig[size].qr * 0.75 - 8)}
                  className="object-contain"
                />
              </div>
            ) : (
              <span style={{ color: themeColors.text, fontSize: '10px' }}>No QR</span>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left">
          <h3 className={`${sizeConfig[size].textSize} font-bold mb-1`} style={{ color: themeColors.text }}>
            {coupleNames}
          </h3>
          <p className="text-xs mb-2" style={{ color: themeColors.text, opacity: 0.75 }}>
            {instruction}
          </p>
        {anniversaryDate && (
          <p className="text-xs" style={{ color: themeColors.text, opacity: 0.6 }}>
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
      ${sizeConfig[size].card}
      ${sizeConfig[size].padding}
      ${shadowClass}
      ${cardStyleClass}
      border
      ${className}
      overflow-hidden
    `}
    style={{
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    }}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${cardStyleClass}`} style={{
        background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.primary})`
      }} />

      {/* Card Content */}
      <div className="flex flex-col items-center text-center pt-4">
        {/* Elegant divider with heart */}
        <div className="flex items-center gap-3 mb-4 w-full">
          <div className="flex-1 h-px" style={{ backgroundColor: themeColors.border }} />
          <span className="text-3xl">💕</span>
          <div className="flex-1 h-px" style={{ backgroundColor: themeColors.border }} />
        </div>

        {/* Couple Names */}
        <h3 className={`${sizeConfig[size].textSize} font-bold font-serif mb-2`} style={{ color: themeColors.text }}>
          {coupleNames}
        </h3>

        {/* Elegant tagline */}
        <p className="text-xs italic mb-4" style={{ color: themeColors.text, opacity: 0.75 }}>
          {tagline}
        </p>

        {/* QR Code */}
        <div 
          className={`
            relative
            ${cardStyleClass}
            p-3
            mb-4
            border
            ${shadowClass}
            flex items-center justify-center
            overflow-hidden
          `}
          style={{
            backgroundColor: themeColors.background,
            borderColor: themeColors.primary,
            width: sizeConfig[size].qr,
            height: sizeConfig[size].qr,
          }}
        >
          {qrDataUrl && isClient ? (
            <div 
              ref={qrRef}
              className="flex items-center justify-center w-full h-full"
            />
          ) : qrCodeUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={sizeConfig[size].qr - 12}
                height={sizeConfig[size].qr - 12}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full" style={{ color: themeColors.text }}>
              <span className="text-2xl mb-1">📱</span>
              <span className="text-xs">No QR Code</span>
            </div>
          )}
        </div>

        {/* Instruction */}
        <p className={`${sizeConfig[size].textSize} font-medium mb-3`} style={{ color: themeColors.text }}>
          📱 {instruction}
        </p>

        {/* Bottom divider */}
        <div className="w-12 h-px mb-3" style={{
          background: `linear-gradient(90deg, transparent, ${themeColors.border}, transparent)`
        }} />

        {/* Footer */}
        <div className="text-center">
          {anniversaryDate && (
            <p className="text-xs font-medium mb-1" style={{ color: themeColors.text }}>
              Our journey since {new Date(anniversaryDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          )}
          {websiteUrl && (
            <p className="text-xs" style={{ color: themeColors.text, opacity: 0.6 }}>
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

