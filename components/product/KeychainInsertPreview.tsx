'use client';

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
}

export default function KeychainInsertPreview({
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption = 'Scan our love story',
}: KeychainInsertPreviewProps) {
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
          <p className="text-sm font-medium text-slate-600 mb-2">
            QR Code Side
          </p>
          <div className="bg-white rounded-lg shadow-md p-2">
            <KeychainInsertQR
              widthMm={widthMm}
              heightMm={heightMm}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              caption={caption}
              scale={2}
            />
          </div>
        </div>

        {/* Photo Side */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-slate-600 mb-2">
            Photo Side
          </p>
          <div className="bg-white rounded-lg shadow-md p-2">
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

