'use client';

import type { CSSProperties } from 'react';
import KeychainInsertQR from './KeychainInsertQR';
import KeychainInsertPhoto from './KeychainInsertPhoto';

interface KeychainInsertPreviewProps {
  widthMm: number;
  heightMm: number;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  coverPhotoUrl?: string;
  coupleNames: string;
  caption?: string;
  qrScale?: number;
  qrDesign?: {
    dotsColor: string;
    backgroundColor: string;
    cornersColor: string;
    dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    cornersType: 'square' | 'dot' | 'extra-rounded';
    cornersDotType: 'dot' | 'square';
    logoUrl?: string;
  };
}

export default function KeychainInsertPreview({
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption = 'Scan our love story',
  qrScale = 1,
  qrDesign,
}: KeychainInsertPreviewProps) {
  const previewCardStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.8rem',
    padding: '0.75rem',
    boxShadow: 'none',
  };

  const previewCardStyle2: CSSProperties = {
    ...previewCardStyle,
  };

  return (
    <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-rose-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Live Preview
      </h3>

      {/* Preview Container */}
      <div className="flex flex-wrap gap-8 justify-center items-start">
        {/* QR Side */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-700 mb-2">
            QR Code Side
          </p>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0.8rem',
            boxShadow: 'none',
            padding: '8px',
            width: 'fit-content',
          }}>
            <KeychainInsertQR
              widthMm={widthMm}
              heightMm={heightMm}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              caption={caption}
              scale={2}
              qrScale={qrScale}
              qrDesign={qrDesign}
            />
          </div>
        </div>

        {/* Photo Side */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-700 mb-2">
            Photo Side
          </p>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0.8rem',
            boxShadow: 'none',
            padding: '8px',
            width: 'fit-content',
          }}>
            <KeychainInsertPhoto
              widthMm={widthMm}
              heightMm={heightMm}
              coverPhotoUrl={coverPhotoUrl}
              coupleNames={coupleNames}
              scale={2}
            />
          </div>
        </div>
      </div>

      {/* Size Indicator */}
      <p className="text-center text-xs text-slate-500 mt-4">
        Actual size: {widthMm}mm × {heightMm}mm
      </p>
    </div>
  );
}

