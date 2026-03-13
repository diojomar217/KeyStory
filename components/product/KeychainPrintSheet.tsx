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
  pairsPerRow?: number;
  showGuides?: boolean;
  autoFit?: boolean;
  accentColor?: string;
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

function InsertPair({
  index,
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption,
  gap,
  qrSizePx,
  accentColor,
  showGuides,
  qrDesign,
}: {
  index: number;
  widthMm: number;
  heightMm: number;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  coverPhotoUrl?: string;
  coupleNames: string;
  caption?: string;
  gap: number;
  qrSizePx: number;
  accentColor?: string;
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
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !qrDataUrl || !qrRef.current) return;

    const defaultDesign = {
      dotsColor: accentColor || '#e11d48',
      backgroundColor: '#ffffff',
      cornersColor: accentColor || '#e11d48',
      dotsType: 'rounded' as const,
      cornersType: 'extra-rounded' as const,
      cornersDotType: 'dot' as const,
      logoUrl: '/heart-icon.svg',
    };
    const design = qrDesign || defaultDesign;

    const qrCode = new QRCodeStyling({
      width: qrSizePx,
      height: qrSizePx,
      type: 'canvas',
      data: qrDataUrl!,
      imageOptions: { crossOrigin: 'anonymous', margin: 4 },
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
    });

    qrRef.current.innerHTML = '';
    qrRef.current.style.width = `${qrSizePx}px`;
    qrRef.current.style.height = `${qrSizePx}px`;
    qrCode.append(qrRef.current);

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [isClient, qrDataUrl, qrSizePx, accentColor, qrDesign]);

  return (
    <div
      className="Print-card"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        gap: `${gap}mm`,
        backgroundColor: '#ffffff',
        border: showGuides ? '1px dashed #cbd5e1' : 'none',
        borderRadius: '2px',
        padding: showGuides ? '0.5mm' : '0', // Reduced from 1mm
        width: `${widthMm * 2 + gap}mm`, // Exact width: QR + Photo + gap
        height: `${heightMm}mm`, // Exact height from dropdown
        boxSizing: 'border-box',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* QR Code Side */}
      <div style={{ 
        width: `${widthMm}mm`, 
        height: `${heightMm}mm`, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRight: showGuides ? '1px solid #cbd5e1' : 'none',
        padding: showGuides ? '2mm' : '1mm', // Increased space between content and border
      }}>
        {qrDataUrl && isClient ? (
          <div key={`${qrDataUrl}-${qrDesign?.dotsColor}-${qrDesign?.backgroundColor}-${qrDesign?.cornersColor}-${qrDesign?.dotsType}-${qrDesign?.cornersType}-${qrDesign?.cornersDotType}-${qrDesign?.logoUrl}`} ref={qrRef} style={{ width: qrSizePx, height: qrSizePx }} />
        ) : qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="QR" 
            style={{ 
              width: qrSizePx, 
              height: qrSizePx, 
              objectFit: 'contain',
              imageRendering: 'pixelated'
            }} 
          />
        ) : (
          <div style={{ width: qrSizePx, height: qrSizePx, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '6pt', color: '#94a3b8' }}>No QR</span>
          </div>
        )}
        {caption && <span style={{ fontSize: '4pt', color: '#475569', display: 'block', lineHeight: '1', marginTop: 'auto' }}>{caption}</span>}
      </div>
      {/* Photo Side */}
      <div style={{ 
        width: `${widthMm}mm`, 
        height: `${heightMm}mm`, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: showGuides ? '2mm' : '1mm', // Increased space between content and border
      }}>
        <div style={{ width: qrSizePx, height: qrSizePx, borderRadius: '2px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
          {coverPhotoUrl ? (
            <img src={coverPhotoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '6pt' }}>No Photo</div>
          )}
        </div>
        {coupleNames && <span style={{ fontSize: '4pt', color: '#1e293b', fontWeight: 600, display: 'block', lineHeight: '1', marginTop: 'auto' }}>{coupleNames}</span>}
      </div>
    </div>
  );
}

export default function KeychainPrintSheet({
  widthMm,
  heightMm,
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption = 'Scan our love story',
  copies,
  pairsPerRow = 2,
  showGuides = true,
  autoFit = true,
  accentColor = '#e11d48',
  qrDesign,
}: KeychainPrintSheetProps) {
  const numCopies = copies;
  const insertWidth = widthMm;
  const insertHeight = heightMm;
  const gap = 1; // Reduced from 2mm for tighter print layout
  const qrSizePx = mmToPx(Math.min(widthMm, heightMm) - 4 - (caption || coupleNames ? 3 : 0)); // Account for 2mm padding on each side, plus 3mm for text when present

  // Pair width = QR side + Photo side
  const pairWidth = insertWidth * 2 + gap;
  const rowWidth = pairWidth * pairsPerRow + gap;

  // Print page size (A4 width minus margins)
  const pageWidthMm = 210 - 5; // 5mm total margin (2.5mm each side)
  const scale = autoFit ? Math.min(1, pageWidthMm / rowWidth) : 1;

  // Calculate how many rows we need
  const numRows = Math.ceil(numCopies / pairsPerRow);

  // Calculate row height including gap and card margin
  const rowHeight = insertHeight + gap + 0.5; // Added 0.5mm for card bottom margin

  return (
    <div className="Print-sheet" style={{ padding: '0' }}>
      <style jsx global>{`
        @media print {
          @page { margin: 2mm; } /* Reduced from 5mm */
          html, body { margin: 0; padding: 0; }
          .Print-sheet { width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .Print-page { height: ${numRows * rowHeight}mm !important; overflow: hidden !important; }
          .Print-grid { 
            display: grid !important; 
            grid-template-columns: repeat(${pairsPerRow}, minmax(0, 1fr)) !important; 
            grid-auto-rows: ${rowHeight}mm !important;
            gap: 1mm !important; /* Increased gap to ensure borders are visible */
            width: 100% !important; 
            height: ${numRows * rowHeight}mm !important;
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important;
            border: none !important; /* Remove grid border, use individual card borders */
            box-sizing: border-box !important;
          }
          .Print-card { 
            page-break-inside: avoid !important; 
            break-inside: avoid !important; 
            margin: 0 0 0.5mm 0 !important; /* Add bottom margin for border visibility */
            padding: 0 !important; /* Remove padding to maximize printable area */
            width: ${widthMm * 2 + gap}mm !important; /* Exact width matching print size */
            height: ${heightMm}mm !important; /* Exact height matching print size */
            background-color: transparent !important; /* Transparent background for clear acrylic */
            box-sizing: border-box !important; /* Border included in dimensions */
          }
          .Print-card > div:first-child {
            padding: 2mm !important; /* Increased space between QR code and border in print */
            ${showGuides ? 'border-right: 1px solid #666666 !important;' : ''}
          }
          .Print-card > div:last-child {
            padding: 2mm !important; /* Increased space between photo and border in print */
          }
          .no-print { display: none !important; }
          ${showGuides ? `
          .Print-card { 
            border: 1px solid #000000 !important;
          }
          ` : ''}
        }
      `}</style>
      <div className="Print-page">
        <div className="Print-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${pairsPerRow}, minmax(0, 1fr))`, 
          gridAutoRows: `${rowHeight}mm`,
          gap: `${gap}mm`, 
          width: '100%', 
          justifyContent: 'center',
          margin: 0,
          padding: 0,
        }}>
          {Array.from({ length: numCopies }, (_, i) => i).map((index) => (
            <InsertPair 
              key={`insert-pair-${index}`} 
              index={index} 
              widthMm={insertWidth} 
              heightMm={insertHeight} 
              qrDataUrl={qrDataUrl} 
              qrCodeUrl={qrCodeUrl}
              coverPhotoUrl={coverPhotoUrl} 
              coupleNames={coupleNames} 
              caption={caption} 
              gap={gap} 
              qrSizePx={qrSizePx} 
              accentColor={accentColor}
              showGuides={showGuides}
              qrDesign={qrDesign}
            />
          ))}
        </div>
      </div>
      <div className="print:hidden text-center mt-4 text-sm text-slate-500">
        <p>Printing {numCopies} inserts ({pairsPerRow} pairs/row × {numRows} rows)</p>
        <p className="text-xs mt-1">Each insert has QR code and photo side by side</p>
      </div>
    </div>
  );
}

