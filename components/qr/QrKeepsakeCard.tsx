'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Theme } from '@/lib/types';

export type QrCardStyle = 'none' | 'love_card' | 'birthday_card' | 'minimal_card' | 'polaroid';

export type QrConfig = {
  color?: string;
  background?: string;
  style?: 'square' | 'dots' | 'rounded';
  cardStyle?: QrCardStyle;
  title?: string;
  subtitle?: string;
  showNames?: boolean;
};

interface QrKeepsakeCardProps {
  theme?: Theme;
  siteType?: 'couple' | 'birthday' | string;
  customerName?: string;
  partnerName?: string;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  slug?: string;
  config?: QrConfig;
  cardSize?: 'small' | 'large';
}

export default function QrKeepsakeCard({
  theme = 'romantic_classic',
  siteType = 'couple',
  customerName = 'Your Name',
  partnerName = 'Partner Name',
  qrDataUrl,
  qrCodeUrl,
  slug,
  config,
  cardSize = 'large',
}: QrKeepsakeCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [isClient, setIsClient] = useState(false);

  const qrConfig = {
    color: '#e11d48',
    background: '#ffffff',
    style: 'rounded' as const,
    cardStyle: siteType === 'birthday' ? 'birthday_card' : 'love_card' as const,
    title: siteType === 'birthday' ? 'Scan the birthday surprise 🎉' : 'Scan our love story ❤️',
    subtitle: 'Open the memory website',
    showNames: siteType !== 'birthday',
    ...config,
  };

  const isDataImageUrl = (value?: string) => typeof value === 'string' && value.startsWith('data:image');

  const getQrTarget = () => {
    if (qrDataUrl && !isDataImageUrl(qrDataUrl)) return qrDataUrl;
    if (qrCodeUrl && !isDataImageUrl(qrCodeUrl) && /^https?:\/\//.test(qrCodeUrl)) return qrCodeUrl;
    if (slug && typeof window !== 'undefined') return `${window.location.origin}/site/${slug}`;
    if (slug) return `/site/${slug}`;
    return undefined;
  };

  const targetQrDataUrl = getQrTarget();

  const cardDimensions = cardSize === 'small'
    ? { width: '5.5cm', height: '4cm' }
    : { width: '6.2cm', height: '4.1cm' };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!qrRef.current || !targetQrDataUrl) return;

    const dots = qrConfig.style === 'square' ? 'classy' : qrConfig.style === 'dots' ? 'dots' : 'rounded';
    const corners = qrConfig.style === 'rounded' ? 'extra-rounded' : 'square';

    const qrcode = new QRCodeStyling({
      width: 220,
      height: 220,
      type: 'canvas',
      data: targetQrDataUrl,
      imageOptions: { crossOrigin: 'anonymous', margin: 6 },
      dotsOptions: { color: qrConfig.color || '#e11d48', type: dots as any },
      cornersSquareOptions: { color: qrConfig.color || '#e11d48', type: corners as any },
      cornersDotOptions: { color: qrConfig.color || '#e11d48', type: corners as any },
      backgroundOptions: { color: qrConfig.background || '#ffffff' },
      qrOptions: { errorCorrectionLevel: 'H' },
    });

    qrCodeRef.current = qrcode;
    qrRef.current.innerHTML = '';
    qrcode.append(qrRef.current);

  }, [qrDataUrl, qrConfig.color, qrConfig.background, qrConfig.style]);

  if (!targetQrDataUrl) return null;

  const styleClasses: Record<QrCardStyle, string> = {
    love_card: 'bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-200 text-rose-900',
    birthday_card: 'bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 border-2 border-orange-200 text-orange-900',
    minimal_card: 'bg-white border border-slate-200 text-slate-900',
    polaroid: 'bg-white border-2 border-slate-300 shadow-xl text-slate-900',
    none: 'bg-white text-slate-900',
  };

  return (
    <div
      className={`relative rounded-2xl shadow-lg overflow-hidden ${styleClasses[(qrConfig.cardStyle || 'none') as QrCardStyle]}`}
      style={{ ...cardDimensions, minWidth: cardDimensions.width, minHeight: cardDimensions.height, padding: '0.8rem' }}
    >
      <div className="h-full w-full flex flex-col justify-between">
        <div className="text-center">
          <p className="text-xs uppercase font-bold tracking-widest opacity-70">{qrConfig.subtitle}</p>
          <h3 className="text-lg font-extrabold mt-1">{qrConfig.title}</h3>
          {qrConfig.showNames && (
            <p className="text-sm mt-1 opacity-80">{customerName} & {partnerName}</p>
          )}
        </div>

        <div className="mx-auto my-2 w-fit">
          <div
            ref={qrRef}
            className="rounded-lg overflow-hidden"
            style={{ width: '220px', height: '220px' }}
          />
        </div>

        <div className="text-center text-xs opacity-70">
          <p>Scan to revisit</p>
          {slug && <p className="truncate">/site/{slug}</p>}
        </div>
      </div>

      <div className="absolute right-2 top-2 text-[10px] text-slate-400">{cardSize === 'small' ? '5.5x4cm' : '6.2x4.1cm'}</div>
    </div>
  );
}
