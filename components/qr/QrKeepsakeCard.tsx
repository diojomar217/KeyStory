'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { ThemeKey } from '@/config/themeConfig';
import { getCardStyleClasses } from '@/lib/theme-color-helpers';
import { optimizeCloudinaryDeliveryUrl } from '@/lib/cloudinary-url';

export type QrCardStyle =
  | 'none'
  | 'love_card'
  | 'birthday_card'
  | 'minimal_card'
  | 'polaroid';

export type QrVisualDesign = {
  dotsColor: string;
  backgroundColor: string;
  cornersColor: string;
  dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  cornersType: 'square' | 'dot' | 'extra-rounded';
  cornersDotType: 'dot' | 'square';
  logoUrl?: string;
};

export type QrConfig = {
  color?: string;
  background?: string;
  style?: 'square' | 'dots' | 'rounded';
  cardStyle?: QrCardStyle;
  title?: string;
  subtitle?: string;
  showNames?: boolean;
  qrDesign?: QrVisualDesign;
};

type PhotoTransform = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

type Props = {
  customerName?: string;
  partnerName?: string;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  slug?: string;
  config?: QrConfig;
  cardSize?: 'small' | 'large';
  photoUrl?: string;
  photoTransform?: PhotoTransform;
  theme?: unknown;
  siteType?: string;
};

function getPhotoStyle(transform?: PhotoTransform) {
  const zoom = transform?.zoom ?? 1;
  const offsetX = transform?.offsetX ?? 0;
  const offsetY = transform?.offsetY ?? 0;

  return {
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
    objectPosition: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
  } as const;
}

export function QrKeepsakeCard({
  customerName = 'Your Name',
  partnerName = 'Partner Name',
  qrDataUrl,
  config,
  cardSize = 'large',
  photoUrl,
  photoTransform,
  theme,
}: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Get theme-based card style
  const cardStyleClass = (() => {
    if (!theme || typeof theme !== 'object' || !('key' in theme)) {
      return 'rounded-lg';
    }
    try {
      return getCardStyleClasses(theme as unknown as ThemeKey);
    } catch {
      return 'rounded-lg';
    }
  })();

  const qrConfig = {
    color: '#e11d48',
    background: '#ffffff',
    style: 'rounded' as const,
    cardStyle: 'love_card' as const,
    title: 'Scan our love story ❤️',
    subtitle: 'Our digital keepsake',
    showNames: true,
    ...config,
  };

  const qrPixelSize =
    qrConfig.cardStyle === 'polaroid'
      ? cardSize === 'small'
        ? 50
        : 56
      : undefined;

  const size = useMemo(() => {
    return cardSize === 'small'
      ? {
          w: '5.5cm',
          h: '4cm',
          qr: 66,
          radius: '12px',
          padding: '7px',
          title: '11px',
          subtitle: '6.3px',
          names: '7.4px',
          footer: '6.3px',
          photo: 46,
          gap: '7px',
        }
      : {
          w: '6.2cm',
          h: '4.1cm',
          qr: 72,
          radius: '12px',
          padding: '8px',
          title: '12px',
          subtitle: '6.6px',
          names: '7.8px',
          footer: '6.6px',
          photo: 52,
          gap: '8px',
        };
  }, [cardSize]);

  const optimizedPhotoUrl = useMemo(() => {
    if (!photoUrl) return '';
    const target = cardSize === 'small' ? 240 : 300;
    return optimizeCloudinaryDeliveryUrl(photoUrl, {
      quality: 'auto:good',
      width: target,
      height: target,
      crop: 'fill',
    });
  }, [photoUrl, cardSize]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!qrRef.current || !qrDataUrl || !isClient) return;

    const visualDesign = {
      dotsColor: qrConfig.qrDesign?.dotsColor ?? qrConfig.color,
      backgroundColor: qrConfig.qrDesign?.backgroundColor ?? '#ffffff',
      cornersColor: qrConfig.qrDesign?.cornersColor ?? qrConfig.color,
      dotsType: qrConfig.qrDesign?.dotsType ?? (qrConfig.style === 'square' ? 'square' : 'rounded'),
      cornersType: qrConfig.qrDesign?.cornersType ?? 'extra-rounded',
      cornersDotType: qrConfig.qrDesign?.cornersDotType ?? 'dot',
      logoUrl: qrConfig.qrDesign?.logoUrl,
    };

    const qr = new QRCodeStyling({
      width: qrPixelSize ?? size.qr,
      height: qrPixelSize ?? size.qr,
      data: qrDataUrl,
      type: 'canvas',
      dotsOptions: {
        color: visualDesign.dotsColor,
        type: visualDesign.dotsType,
      },
      backgroundOptions: {
        color: visualDesign.backgroundColor,
      },
      cornersSquareOptions: {
        color: visualDesign.cornersColor,
        type: visualDesign.cornersType,
      },
      cornersDotOptions: {
        color: visualDesign.cornersColor,
        type: visualDesign.cornersDotType,
      },
      image: visualDesign.logoUrl,
      // Keep imageOptions defined to avoid runtime crashes in older qr-code-styling internals.
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.28,
        margin: 4,
        crossOrigin: 'anonymous',
      },
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    qrRef.current.innerHTML = '';
    qr.append(qrRef.current);
  }, [
    qrDataUrl,
    isClient,
    qrConfig.cardStyle,
    qrConfig.color,
    qrConfig.qrDesign,
    qrConfig.style,
    qrPixelSize,
    size.qr,
  ]);

  const imageBlock = optimizedPhotoUrl ? (
    <div
      className={`overflow-hidden bg-slate-50 border border-slate-200 ${cardStyleClass}`}
      style={{
        width: `${size.photo}px`,
        height: `${size.photo}px`,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={optimizedPhotoUrl}
        alt="Keepsake"
        className="object-cover"
        style={{
          ...getPhotoStyle(photoTransform),
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        draggable={false}
      />
    </div>
  ) : (
    <div
      className={`flex items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-slate-400 ${cardStyleClass}`}
      style={{
        width: `${size.photo}px`,
        height: `${size.photo}px`,
        fontSize: cardSize === 'small' ? '9px' : '10px',
        flexShrink: 0,
      }}
    >
      No photo
    </div>
  );

  const qrBlock = (
    <div
      className={cardStyleClass}
      style={{
        padding: '4px',
        border: '1px solid #d9d9d9',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={qrRef}
        style={{
          width: `${qrPixelSize ?? size.qr}px`,
          height: `${qrPixelSize ?? size.qr}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );

  if (qrConfig.cardStyle === 'polaroid') {
    return (
      <div
        className={`relative bg-white print:shadow-none ${cardStyleClass}`}
        style={{
          width: size.w,
          height: size.h,
          padding: size.padding,
          border: '1px solid #d4d4d8',
          overflow: 'hidden',
        }}
      >
        <div className="flex h-full flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {optimizedPhotoUrl ? (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  src={optimizedPhotoUrl}
                  alt="Polaroid keepsake"
                  className="object-cover"
                  style={{
                    ...getPhotoStyle(photoTransform),
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No photo
              </div>
            )}

            <div className="absolute bottom-2 right-2">{qrBlock}</div>
          </div>

          <div className="mt-2 min-w-0">
            <div
              className="truncate uppercase tracking-[0.12em] text-slate-500"
              style={{ fontSize: size.footer }}
            >
              {qrConfig.subtitle}
            </div>
            <div className="min-w-0">
              <div
                className="truncate font-semibold text-slate-900"
                style={{ fontSize: size.title, lineHeight: 1.1 }}
              >
                {customerName} &amp; {partnerName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (qrConfig.cardStyle === 'minimal_card') {
    return (
      <div
        className={`relative bg-white print:shadow-none ${cardStyleClass}`}
        style={{
          width: size.w,
          height: size.h,
          padding: size.padding,
          border: '1px solid #d4d4d8',
          overflow: 'hidden',
        }}
      >
        <div className="flex h-full items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div
              className="uppercase text-slate-400"
              style={{
                fontSize: size.subtitle,
                letterSpacing: '0.14em',
                marginBottom: '4px',
              }}
            >
              {qrConfig.subtitle}
            </div>
            <div
              className="font-semibold text-slate-900"
              style={{ fontSize: size.title, lineHeight: 1.08, marginBottom: '4px' }}
            >
              {qrConfig.title}
            </div>
            {qrConfig.showNames && (
              <div
                className="text-slate-600"
                style={{ fontSize: size.names, lineHeight: 1.1, marginBottom: '6px' }}
              >
                {customerName} &amp; {partnerName}
              </div>
            )}
            {photoUrl && imageBlock}
          </div>

          {qrBlock}
        </div>
      </div>
    );
  }

  if (qrConfig.cardStyle === 'birthday_card') {
    return (
      <div
        className={`relative overflow-hidden print:shadow-none ${cardStyleClass}`}
        style={{
          width: size.w,
          height: size.h,
          border: '1px solid #f1c4d7',
          background: '#fffafc',
        }}
      >
        <div className="absolute right-2 top-1 text-[10px]">🎉</div>
        <div className="absolute left-2 top-1 text-[10px]">🎂</div>

        <div
          className="flex h-full items-center"
          style={{ gap: size.gap, padding: size.padding }}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div
              className="uppercase text-slate-500"
              style={{
                fontSize: size.subtitle,
                letterSpacing: '0.14em',
                marginBottom: '4px',
              }}
            >
              Birthday surprise
            </div>
            <div
              className="font-semibold text-slate-900"
              style={{ fontSize: size.title, lineHeight: 1.08, marginBottom: '4px' }}
            >
              {qrConfig.title}
            </div>
            {qrConfig.showNames && (
              <div
                className="text-slate-600"
                style={{ fontSize: size.names, lineHeight: 1.1, marginBottom: '6px' }}
              >
                {customerName}
              </div>
            )}
            {photoUrl && imageBlock}
          </div>

          {qrBlock}
        </div>
      </div>
    );
  }

  if (qrConfig.cardStyle === 'none') {
    return (
      <div
        className={`relative bg-white print:shadow-none ${cardStyleClass}`}
        style={{
          width: size.w,
          height: size.h,
          padding: size.padding,
          border: '1px solid #d4d4d8',
          overflow: 'hidden',
        }}
      >
        <div className="flex h-full items-center justify-center gap-2">
          {photoUrl && imageBlock}
          {qrBlock}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden print:shadow-none ${cardStyleClass}`}
      style={{
        width: size.w,
        height: size.h,
        background: qrConfig.background || '#fffafc',
        border: '1px solid #e9c7d2',
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdfd_0%,#fff8fa_100%)] print:hidden" />

      <div
        className="relative flex h-full"
        style={{ gap: size.gap, padding: size.padding }}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div
            className="uppercase text-slate-500"
            style={{
              fontSize: size.subtitle,
              letterSpacing: '0.16em',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}
          >
            {qrConfig.subtitle}
          </div>

          <div
            className="font-semibold text-slate-900"
            style={{
              fontSize: size.title,
              lineHeight: 1.08,
              marginBottom: '4px',
            }}
          >
            {qrConfig.title}
          </div>

          {qrConfig.showNames && (
            <div
              className="text-slate-600"
              style={{
                fontSize: size.names,
                lineHeight: 1.1,
                marginBottom: '6px',
              }}
            >
              {customerName} &amp; {partnerName}
            </div>
          )}

          <div className="flex items-center gap-2">
            {imageBlock}
            <div
              className="text-slate-500"
              style={{
                fontSize: size.footer,
                lineHeight: 1.2,
                maxWidth: cardSize === 'small' ? '62px' : '72px',
              }}
            >
              Scan to open our story
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center">{qrBlock}</div>
      </div>
    </div>
  );
}