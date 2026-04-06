'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import Image from 'next/image';
import type { ThemeKey } from '@/config/themeConfig';
import type { OccasionType } from '@/lib/types';
import { useTheme } from '../builder/ThemeWrapper';
import { isDarkTheme as checkIsDarkTheme } from '@/lib/theme-color-helpers';
import { formatOccasionDisplayName, getOccasionPublicCopy } from '@/lib/public-site-copy';

type Props = {
  theme: ThemeKey;
  siteType?: OccasionType;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  coupleNames?: string;
};

export default function QRSection({ theme, siteType = 'couple', qrCodeUrl, qrDataUrl, coupleNames = 'Our Love Story' }: Props) {
  const styles = useTheme(theme);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);
  const publicCopy = getOccasionPublicCopy(siteType);
  const displayName = formatOccasionDisplayName(siteType, coupleNames, '');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use qrDataUrl if available for styled QR, otherwise show basic QR
  const showStyledQR = !!qrDataUrl;

  useEffect(() => {
    if (!qrRef.current || !showStyledQR || !qrDataUrl) return;

    // Create styled QR code instance using the actual URL data
    const qrCode = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'canvas',
      data: qrDataUrl,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
      },
      dotsOptions: {
        color: '#E11D48', // Rose-600 romantic pink
        type: 'rounded', // Rounded dots instead of squares
      },
      backgroundOptions: {
        color: '#ffffff', // White background
      },
      cornersSquareOptions: {
        color: '#E11D48',
        type: 'extra-rounded', // More rounded corners for finder patterns
      },
      cornersDotOptions: {
        color: '#E11D48',
        type: 'dot',
      },
      image: '/heart-icon.svg', // Heart icon in center
      qrOptions: {
        errorCorrectionLevel: 'H', // High error correction
      },
    });

    qrCodeInstanceRef.current = qrCode;

    // Clear previous QR code
    qrRef.current.innerHTML = '';
    
    // Append new styled QR code
    qrCode.append(qrRef.current);

  }, [qrDataUrl, showStyledQR]);

  const handleDownload = () => {
    if (qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current.download({
        name: `${publicCopy.qr.footerLabel.replace(/\s+/g, '-').toLowerCase()}-${displayName.replace(/\s+/g, '-').toLowerCase()}`,
        extension: 'png',
      });
    }
  };

  if (!qrCodeUrl) return null;

  return (
    <section className={`py-12 w-full ${checkIsDarkTheme(theme) ? 'bg-zinc-800/50' : 'bg-white/50'}`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Decorative element */}
        <div className="mb-6">
          <span className="text-4xl">{publicCopy.qr.icon}</span>
        </div>
        
        <h3 className={`${styles.heading} text-xl font-semibold ${styles.text} mb-3`}>
          {publicCopy.qr.title}
        </h3>
        
        <p className={`${styles.textMuted} mb-6`}>
          {publicCopy.qr.subtitle}
        </p>
        
        {/* QR Code Card with Romantic Styling */}
        <div className={`inline-block ${styles.card} rounded-2xl ${styles.cardBorder} border p-6 shadow-lg bg-white`}>
          {showStyledQR ? (
            <div 
              ref={qrRef} 
              className="mx-auto"
              style={{ width: '280px', height: '280px' }}
            />
          ) : (
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              <Image
                src={qrCodeUrl}
                alt={publicCopy.qr.altText}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
        
        {/* Download Button */}
        {isClient && (
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium transition-colors duration-200 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {publicCopy.qr.downloadLabel}
            </button>
          </div>
        )}
        
        <p className={`mt-4 text-sm ${styles.textMuted}`}>
          {publicCopy.qr.footerLabel} • {displayName}
        </p>
      </div>
    </section>
  );
}

