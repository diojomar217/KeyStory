'use client';

import { useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface PrintActionsProps {
  customerName: string;
  partnerName: string;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  className?: string;
}

export default function PrintActions({
  customerName,
  partnerName,
  qrDataUrl,
  qrCodeUrl,
  className = '',
}: PrintActionsProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    // Get accent color based on theme (default to romantic)
    const getAccentColor = () => '#e11d48';

    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
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

    qrCode.download({
      name: `love-story-qr-${customerName.replace(/\s+/g, '-').toLowerCase()}-${partnerName.replace(/\s+/g, '-').toLowerCase()}`,
      extension: 'png',
    });
  };

  return (
    <div className={`flex flex-wrap gap-3 justify-center print:hidden ${className}`}>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="
          inline-flex items-center gap-2 
          px-5 py-2.5 
          bg-slate-800 hover:bg-slate-900 
          text-white font-medium rounded-xl
          transition-all duration-200
          hover:scale-105
          shadow-md hover:shadow-lg
        "
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
          />
        </svg>
        Print Card
      </button>

      {/* Download QR Button */}
      {qrDataUrl && (
        <button
          onClick={handleDownload}
          className="
            inline-flex items-center gap-2 
            px-5 py-2.5 
            bg-rose-600 hover:bg-rose-700 
            text-white font-medium rounded-xl
            transition-all duration-200
            hover:scale-105
            shadow-md hover:shadow-lg
          "
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
            />
          </svg>
          Download QR
        </button>
      )}

      {/* Back to Websites */}
      <a
        href="/admin/websites"
        className="
          inline-flex items-center gap-2 
          px-5 py-2.5 
          bg-white hover:bg-slate-50 
          text-slate-700 font-medium rounded-xl
          border border-slate-200
          transition-all duration-200
          hover:scale-105
        "
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back to Websites
      </a>
    </div>
  );
}

