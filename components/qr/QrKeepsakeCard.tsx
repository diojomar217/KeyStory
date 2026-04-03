'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

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
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
    transformOrigin: 'center center',
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
}: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

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
      width: size.qr,
      height: size.qr,
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
  }, [qrDataUrl, isClient, qrConfig.color, qrConfig.qrDesign, qrConfig.style, size.qr]);

  const imageBlock = photoUrl ? (
    <div
      className="overflow-hidden border border-slate-200 bg-slate-50"
      style={{
        width: `${size.photo}px`,
        height: `${size.photo}px`,
        borderRadius: '10px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <img
        src={photoUrl}
        alt="Keepsake"
        className="absolute left-1/2 top-1/2 h-full w-full object-cover"
        style={{
          ...getPhotoStyle(photoTransform),
          minWidth: '100%',
          minHeight: '100%',
        }}
        draggable={false}
      />
    </div>
  ) : (
    <div
      className="flex items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-slate-400"
      style={{
        width: `${size.photo}px`,
        height: `${size.photo}px`,
        borderRadius: '10px',
        fontSize: cardSize === 'small' ? '9px' : '10px',
        flexShrink: 0,
      }}
    >
      No photo
    </div>
  );

  const qrBlock = (
    <div
      className="bg-white"
      style={{
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #d9d9d9',
        flexShrink: 0,
      }}
    >
      <div
        ref={qrRef}
        style={{
          width: `${size.qr}px`,
          height: `${size.qr}px`,
        }}
      />
    </div>
  );

  if (qrConfig.cardStyle === 'polaroid') {
    return (
      <div
        className="relative bg-white print:shadow-none"
        style={{
          width: size.w,
          height: size.h,
          borderRadius: size.radius,
          padding: size.padding,
          border: '1px solid #d4d4d8',
          overflow: 'hidden',
        }}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Polaroid keepsake"
                className="absolute left-1/2 top-1/2 h-full w-full object-cover"
                style={{
                  ...getPhotoStyle(photoTransform),
                  minWidth: '100%',
                  minHeight: '100%',
                }}
                draggable={false}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No photo
              </div>
            )}
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div
                className="truncate font-semibold text-slate-900"
                style={{ fontSize: size.title, lineHeight: 1.1 }}
              >
                {customerName} &amp; {partnerName}
              </div>
              <div
                className="truncate text-slate-500"
                style={{ fontSize: size.footer, marginTop: '2px' }}
              >
                {qrConfig.subtitle}
              </div>
            </div>
            {qrBlock}
          </div>
        </div>
      </div>
    );
  }

  if (qrConfig.cardStyle === 'minimal_card') {
    return (
      <div
        className="relative bg-white print:shadow-none"
        style={{
          width: size.w,
          height: size.h,
          borderRadius: size.radius,
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
        className="relative overflow-hidden print:shadow-none"
        style={{
          width: size.w,
          height: size.h,
          borderRadius: size.radius,
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
        className="relative bg-white print:shadow-none"
        style={{
          width: size.w,
          height: size.h,
          borderRadius: size.radius,
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
      className="relative overflow-hidden print:shadow-none"
      style={{
        width: size.w,
        height: size.h,
        borderRadius: size.radius,
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