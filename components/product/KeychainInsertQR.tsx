'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { getInsertDimensions } from './KeychainSizeConfig';

interface KeychainInsertQRProps {
  widthMm: number;
  heightMm: number;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  caption?: string;
  scale?: number;
  qrScale?: number;
  printMode?: boolean;
  showGuides?: boolean;
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

export default function KeychainInsertQR({
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  caption = 'Scan our love story',
  scale = 1,
  qrScale = 1,
  printMode = false,
  showGuides = true,
  qrDesign,
}: KeychainInsertQRProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate dimensions
  const dimensions = getInsertDimensions(widthMm, heightMm, scale);
  
  // Strong clamp: keep the QR scaling tightly controlled.
  const rawScale = qrScale ?? 1;
  const MIN_QR_SCALE = 0.97;
  const MAX_QR_SCALE = 1.03;
  const clampedScale = Math.max(MIN_QR_SCALE, Math.min(MAX_QR_SCALE, rawScale));
  const effectiveQrScale = clampedScale;
  const qrSize = Math.min(
    Number(dimensions.width.replace('px', '')) * 0.817,
    Number(dimensions.height.replace('px', '')) * 0.741
  ) * effectiveQrScale;

    const shouldUseStyledQr = isClient && !!qrDataUrl;

  // Generate QR code
    useEffect(() => {
    if (!shouldUseStyledQr || !qrRef.current) return;

    const defaultDesign = {
      dotsColor: '#e11d48',
      backgroundColor: '#ffffff',
      cornersColor: '#e11d48',
      dotsType: 'rounded' as const,
      cornersType: 'extra-rounded' as const,
      cornersDotType: 'dot' as const,
      logoUrl: '/heart-icon.svg',
    };
    const design = qrDesign || defaultDesign;

    const qrCode = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type: 'canvas',
            data: qrDataUrl!,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 4,
      },
      dotsOptions: {
        color: design.dotsColor,
        type: design.dotsType,
      },
      backgroundOptions: {
        color: design.backgroundColor,
      },
      cornersSquareOptions: {
        color: design.cornersColor,
        type: design.cornersType,
      },
      cornersDotOptions: {
        color: design.cornersColor,
        type: design.cornersDotType,
      },
      image: design.logoUrl,
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
      // only include logo if provided (prevents invalid URL from breaking QR render)
      ...(design.logoUrl ? { image: design.logoUrl } : {}),
    });

    // Clear the container and append the new QR code
    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
    }, [shouldUseStyledQr, qrDataUrl, qrSize, qrDesign]);

  const polaroidContainerStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: '#ffffff',
    border: showGuides ? '0.3mm dashed #444' : 'none',
    boxShadow: 'none',
    borderRadius: '0.8rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '4px',
    paddingBottom: '10px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  };

  const frameStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fdf9f3',
    border: printMode ? 'none' : '2px solid #e8d7c5',
    borderRadius: '0.55rem',
    padding: '4px',
    boxShadow: printMode ? 'none' : '0 10px 24px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <div style={polaroidContainerStyle}>
      <div style={frameStyle}>
      {/* QR Code */}
      <div className="flex-shrink-0" style={{ width: '100%', height: '78%', padding: '2px', backgroundColor: '#ffffff', border: '1px solid #d8cfc3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {qrDataUrl ? (
          <div
            key={`${qrDataUrl}-${qrDesign?.dotsColor}-${qrDesign?.backgroundColor}-${qrDesign?.cornersColor}-${qrDesign?.dotsType}-${qrDesign?.cornersType}-${qrDesign?.cornersDotType}-${qrDesign?.logoUrl}`}
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
        <div style={{
          width: '100%',
          textAlign: 'center' as const,
          marginTop: '6px',
          padding: '8px 10px',
          backgroundColor: '#fffefb',
          borderBottomLeftRadius: '0.55rem',
          borderBottomRightRadius: '0.55rem',
          minHeight: '22%',
          boxSizing: 'border-box',
        }}>
          <p
            className="text-slate-900 font-semibold"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: '0.04em',
              fontSize: Math.max(7, Math.min(11, widthMm * 0.22)) + 'px',
              lineHeight: 1.25,
              maxWidth: '100%',
              margin: 0,
              textShadow: '0 1px 0 rgba(255,255,255,0.65)',
            }}
          >
            {caption}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}

