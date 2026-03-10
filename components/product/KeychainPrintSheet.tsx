'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { mmToPx } from './KeychainSizeConfig';

interface KeychainPrintSheetProps {
  widthMm: number;
  heightMm: number;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  coverPhotoUrl?: string;
  coupleNames: string;
  caption?: string;
  copies: number;
  columns?: number;
}

export default function KeychainPrintSheet({
  widthMm,
  heightMm,
  qrDataUrl,
  coverPhotoUrl,
  coupleNames,
  caption = 'Scan our love story',
  copies,
}: KeychainPrintSheetProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const numCopies = copies;
  const insertWidth = widthMm;
  const insertHeight = heightMm;
  const gap = 2;
  const qrSizePx = mmToPx(Math.min(widthMm, heightMm)) * 0.4;

  useEffect(() => {
    if (!isClient || !qrDataUrl || !qrRef.current) return;

    const qrCode = new QRCodeStyling({
      width: qrSizePx,
      height: qrSizePx,
      type: 'canvas',
      data: qrDataUrl,
      imageOptions: { crossOrigin: 'anonymous', margin: 2 },
      dotsOptions: { color: '#e11d48', type: 'rounded' },
      backgroundOptions: { color: '#ffffff' },
      cornersSquareOptions: { color: '#e11d48', type: 'extra-rounded' },
      cornersDotOptions: { color: '#e11d48', type: 'dot' },
      image: '/heart-icon.svg',
      qrOptions: { errorCorrectionLevel: 'H' },
    });

    qrRef.current.innerHTML = '';
    qrRef.current.style.width = `${qrSizePx}px`;
    qrRef.current.style.height = `${qrSizePx}px`;
    qrCode.append(qrRef.current);
  }, [isClient, qrDataUrl, qrSizePx]);

  const insertIndices = useMemo(() => Array.from({ length: numCopies }, (_, i) => i), [numCopies]);

  const combinedWidth = insertWidth * 2 + gap;
  const usableWidth = 200;
  const colsThatFit = Math.max(1, Math.floor(usableWidth / combinedWidth));

  return (
    <div className="Print-sheet">
      <div className="Print-page">
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colsThatFit}, ${combinedWidth}mm)`,
          gridTemplateRows: `repeat(${Math.ceil(numCopies / colsThatFit)}, ${insertHeight}mm)`,
          gap: `${gap}mm`,
          width: '100%',
          maxWidth: '210mm',
          margin: '0 auto',
          padding: '5mm',
        }}>
          {insertIndices.map((index) => {
            const qrContent = index === 0 ? (
              <div ref={qrRef} />
            ) : qrDataUrl && qrRef.current ? (
              <div dangerouslySetInnerHTML={{ __html: qrRef.current.innerHTML }} style={{ width: qrSizePx, height: qrSizePx }} />
            ) : null;

            return (
              <div key={`insert-${index}`} style={{
                width: `${combinedWidth}mm`,
                height: `${insertHeight}mm`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${gap}mm`,
                backgroundColor: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '2px',
                pageBreakInside: 'avoid',
              }}>
                <div style={{
                  width: `${insertWidth}mm`,
                  height: `${insertHeight}mm`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {qrContent}
                  {caption && <span style={{ fontSize: '4pt', color: '#475569', marginTop: '0.5mm' }}>{caption}</span>}
                </div>
                <div style={{
                  width: `${insertWidth}mm`,
                  height: `${insertHeight}mm`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ width: qrSizePx, height: qrSizePx, borderRadius: '2px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                    {coverPhotoUrl ? (
                      <img src={coverPhotoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '6pt' }}>No Photo</div>
                    )}
                  </div>
                  {coupleNames && <span style={{ fontSize: '4pt', color: '#1e293b', marginTop: '0.5mm', fontWeight: 600 }}>{coupleNames}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="print:hidden text-center mt-4 text-sm text-slate-500">
        <p>Printing {numCopies} inserts ({colsThatFit} cols x {Math.ceil(numCopies / colsThatFit)} rows)</p>
        <p className="text-xs mt-1">Each insert has QR code and photo side by side</p>
      </div>
    </div>
  );
}

