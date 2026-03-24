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

  const rawScale = qrScale ?? 1;
  const clampedScale = Math.max(0.92, Math.min(1.08, rawScale));
  const safeAreaScale = getSafeAreaScale(shape);

  const shouldUseStyledQr = isClient && !!qrDataUrl;

  const heartCaptionFont = Math.max(6, Math.min(8, widthMm * 0.14));
  const defaultCaptionFont = Math.max(7, Math.min(11, widthMm * 0.22));

  const qrSize =
    shape === 'heart'
      ? Math.min(widthPx, heightPx) * safeAreaScale * 0.55 * clampedScale
      : Math.min(widthPx * 0.817, heightPx * 0.741) * clampedScale;

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
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [shouldUseStyledQr, qrDataUrl, qrSize, qrDesign]);

  const heartOuterStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const heartGuideStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    clipPath: HEART_CLIP_PATH,
    border: showGuides ? '2px dashed rgba(0,0,0,0.45)' : 'none',
    background: 'transparent',
    pointerEvents: 'none',
    zIndex: 2,
  };

  const heartBodyStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    clipPath: HEART_CLIP_PATH,
    backgroundColor: '#fdf9f3',
    border: printMode ? 'none' : '2px solid #e8d7c5',
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
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${qrSize}px`,
    height: `${qrSize}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
  };

  const rectContainerStyle: CSSProperties = {
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

  const rectFrameStyle: CSSProperties = {
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

  if (shape === 'heart') {
    return (
      <div style={heartOuterStyle}>
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
                  textShadow: '0 1px 0 rgba(255,255,255,0.7)',
                  wordBreak: 'break-word',
                }}
              >
                {caption}
              </p>
            </div>
          )}

          <div style={heartQrWrapStyle}>
            {shouldUseStyledQr ? (
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
            ) : qrCodeUrl ? (
              <div
                className="relative bg-white"
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
        </div>
      </div>
    );
  }

  return (
    <div style={rectContainerStyle}>
      <div style={rectFrameStyle}>
        <div
          className="flex-shrink-0"
          style={{
            width: '100%',
            height: '78%',
            padding: '2px',
            backgroundColor: '#ffffff',
            border: '1px solid #d8cfc3',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {shouldUseStyledQr ? (
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

        {caption && (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '6px',
              padding: '8px 10px',
              backgroundColor: '#fffefb',
              borderBottomLeftRadius: '0.55rem',
              borderBottomRightRadius: '0.55rem',
              minHeight: '22%',
              boxSizing: 'border-box',
            }}
          >
            <p
              className="text-slate-900 font-semibold"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                letterSpacing: '0.04em',
                fontSize: `${defaultCaptionFont}px`,
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