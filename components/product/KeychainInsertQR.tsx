'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { getInsertDimensions } from './KeychainSizeConfig';

interface KeychainInsertQRProps {
  widthMm: number;
  heightMm: number;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  caption?: string;
  scale?: number;
}

export default function KeychainInsertQR({
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  caption = 'Scan our love story',
  scale = 1,
}: KeychainInsertQRProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate dimensions
  const dimensions = getInsertDimensions(widthMm, heightMm, scale);
  
  // QR code size - leave some padding
  const qrSize = Math.min(
    Number(dimensions.width.replace('px', '')) * 0.7,
    Number(dimensions.height.replace('px', '')) * 0.5
  );

  // Generate QR code
  useEffect(() => {
    if (!qrRef.current || !qrDataUrl || !isClient) return;

    const qrCode = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type: 'canvas',
      data: qrDataUrl,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 4,
      },
      dotsOptions: {
        color: '#e11d48', // rose-600
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '#e11d48',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#e11d48',
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

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [qrDataUrl, qrSize, isClient]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-300"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        padding: '4px',
      }}
    >
      {/* QR Code */}
      <div className="flex-shrink-0">
        {qrDataUrl && isClient ? (
          <div
            ref={qrRef}
            className="mx-auto"
            style={{ width: qrSize, height: qrSize }}
          />
        ) : qrCodeUrl ? (
          <div
            className="relative mx-auto bg-white"
            style={{ width: qrSize, height: qrSize }}
          >
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center bg-slate-100 rounded"
            style={{ width: qrSize, height: qrSize }}
          >
            <span className="text-slate-400 text-xs">No QR</span>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p
          className="text-slate-600 text-center font-medium mt-1"
          style={{
            fontSize: Math.max(6, Math.min(10, widthMm * 0.2)) + 'px',
            lineHeight: 1.2,
            maxWidth: '100%',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

