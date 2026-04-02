'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  getInsertDimensions,
  type KeychainShape,
  getSafeAreaScale,
} from './KeychainSizeConfig';

interface KeychainInsertQRProps {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
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

const HEART_CLIP_PATH = `polygon(
  50% 94%,
  44% 88%,
  37% 81%,
  28% 72%,
  19% 62%,
  12% 51%,
  9% 40%,
  9% 28%,
  13% 18%,
  21% 10%,
  31% 8%,
  40% 11%,
  50% 20%,
  60% 11%,
  69% 8%,
  79% 10%,
  87% 18%,
  91% 28%,
  91% 40%,
  88% 51%,
  81% 62%,
  72% 72%,
  63% 81%,
  56% 88%
)`;

function CropMarks({
  show,
  color = '#222',
  length = '2.2mm',
  thickness = '0.25mm',
}: {
  show: boolean;
  color?: string;
  length?: string;
  thickness?: string;
}) {
  if (!show) return null;

  const common: CSSProperties = {
    position: 'absolute',
    backgroundColor: color,
    pointerEvents: 'none',
    zIndex: 20,
  };

  return (
    <>
      {/* Top Left */}
      <div style={{ ...common, top: 0, left: 0, width: length, height: thickness }} />
      <div style={{ ...common, top: 0, left: 0, width: thickness, height: length }} />

      {/* Top Right */}
      <div style={{ ...common, top: 0, right: 0, width: length, height: thickness }} />
      <div style={{ ...common, top: 0, right: 0, width: thickness, height: length }} />

      {/* Bottom Left */}
      <div style={{ ...common, bottom: 0, left: 0, width: length, height: thickness }} />
      <div style={{ ...common, bottom: 0, left: 0, width: thickness, height: length }} />

      {/* Bottom Right */}
      <div style={{ ...common, bottom: 0, right: 0, width: length, height: thickness }} />
      <div style={{ ...common, bottom: 0, right: 0, width: thickness, height: length }} />
    </>
  );
}

export default function KeychainInsertQR({
  widthMm,
  heightMm,
  shape = 'rectangle',
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dimensions = getInsertDimensions(widthMm, heightMm, scale);
  const widthPx = Number(dimensions.width.replace('px', ''));
  const heightPx = Number(dimensions.height.replace('px', ''));

  const safeAreaScale = getSafeAreaScale(shape);
  const clampedScale = Math.max(0.9, Math.min(1.1, qrScale ?? 1));
  const shouldUseStyledQr = isClient && !!qrDataUrl;

  const defaultCaptionFont = Math.max(7, Math.min(10.5, widthMm * 0.19));
  const heartCaptionFont = Math.max(6, Math.min(8, widthMm * 0.14));

  const qrSize =
    shape === 'heart'
      ? Math.min(widthPx, heightPx) * safeAreaScale * 0.55 * clampedScale
      : Math.min(widthPx * 0.68, heightPx * 0.48) * clampedScale;

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
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
      ...(design.logoUrl ? { image: design.logoUrl } : {}),
    });

    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);

    return () => {
      if (qrRef.current) qrRef.current.innerHTML = '';
    };
  }, [shouldUseStyledQr, qrDataUrl, qrSize, qrDesign]);

  const renderQr = () => {
    if (shouldUseStyledQr) {
      return (
        <div
          ref={qrRef}
          style={{
            width: qrSize,
            height: qrSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      );
    }

    if (qrCodeUrl) {
      return (
        <div className="relative bg-white" style={{ width: qrSize, height: qrSize }}>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-center bg-slate-100"
        style={{ width: qrSize, height: qrSize }}
      >
        <span className="text-slate-400 text-xs">No QR</span>
      </div>
    );
  };

  if (shape === 'heart') {
    const heartOuterStyle: CSSProperties = {
      width: dimensions.width,
      height: dimensions.height,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    };

    const heartGuideStyle: CSSProperties = {
      position: 'absolute',
      inset: 0,
      clipPath: HEART_CLIP_PATH,
      border: showGuides && !printMode ? '2px dashed rgba(0,0,0,0.45)' : 'none',
      background: 'transparent',
      pointerEvents: 'none',
      zIndex: 2,
    };

    const heartBodyStyle: CSSProperties = {
      position: 'absolute',
      inset: 0,
      clipPath: HEART_CLIP_PATH,
      backgroundColor: '#fffefb',
      border: printMode ? 'none' : '1px solid #e8d7c5',
      boxShadow: printMode ? 'none' : '0 10px 24px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      zIndex: 1,
    };

    const heartSafeAreaStyle: CSSProperties = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${safeAreaScale * 100}%`,
      height: `${safeAreaScale * 100}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 3,
    };

    const heartCaptionWrapStyle: CSSProperties = {
      position: 'absolute',
      top: '14%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '56%',
      textAlign: 'center',
      padding: '2px 4px',
    };

    const heartQrWrapStyle: CSSProperties = {
      position: 'absolute',
      left: '50%',
      top: '52%',
      transform: 'translate(-50%, -50%)',
      width: `${qrSize}px`,
      height: `${qrSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: printMode ? 'none' : '0 4px 10px rgba(0,0,0,0.06)',
    };

    return (
      <div style={heartOuterStyle}>
        <CropMarks show={printMode && showGuides} />
        <div style={heartBodyStyle} />
        {showGuides && <div style={heartGuideStyle} />}

        <div style={heartSafeAreaStyle}>
          {caption && (
            <div style={heartCaptionWrapStyle}>
              <p
                className="text-slate-900 font-semibold"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  letterSpacing: '0.03em',
                  fontSize: `${heartCaptionFont}px`,
                  lineHeight: 1.15,
                  margin: 0,
                  color: '#1f2937',
                  textShadow: printMode ? 'none' : '0 1px 0 rgba(255,255,255,0.7)',
                  wordBreak: 'break-word',
                }}
              >
                {caption}
              </p>
            </div>
          )}

          <div style={heartQrWrapStyle}>{renderQr()}</div>
        </div>
      </div>
    );
  }

  const containerStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: '#ffffff',
    border: showGuides && !printMode ? '0.3mm dashed #444' : 'none',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'visible',
    padding: 0,
    boxShadow: 'none',
  };

  const polaroidStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fffefb',
    border: printMode ? 'none' : '1px solid #e7ddd2',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    overflow: 'hidden',
    paddingTop: printMode ? '1mm' : '4%',
    paddingLeft: printMode ? '1mm' : '4%',
    paddingRight: printMode ? '1mm' : '4%',
    paddingBottom: printMode ? '1.4mm' : '6%',
    rowGap: printMode ? '0.8mm' : 0,
  };

  const qrFrameStyle: CSSProperties = {
    width: '100%',
    minHeight: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #ddd2c6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: printMode ? '0.8mm' : '3%',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const captionWrapStyle: CSSProperties = {
    width: '100%',
    textAlign: 'center',
    paddingTop: printMode ? '0.2mm' : '6%',
    paddingLeft: printMode ? '0.6mm' : '4%',
    paddingRight: printMode ? '0.6mm' : '4%',
    paddingBottom: 0,
    backgroundColor: '#fffefb',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <CropMarks show={printMode && showGuides} />
      <div style={polaroidStyle}>
        <div style={qrFrameStyle}>{renderQr()}</div>

        {caption && (
          <div style={captionWrapStyle}>
            <p
              className="text-slate-900 font-semibold"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                letterSpacing: '0.03em',
                fontSize: `${defaultCaptionFont}px`,
                lineHeight: 1.12,
                margin: 0,
                textShadow: printMode ? 'none' : '0 1px 0 rgba(255,255,255,0.65)',
                wordBreak: 'break-word',
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