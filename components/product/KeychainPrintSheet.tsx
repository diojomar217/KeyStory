'use client';

import KeychainInsertQR from './KeychainInsertQR';
import KeychainInsertPhoto from './KeychainInsertPhoto';
import { mmToPx, type KeychainShape } from './KeychainSizeConfig';

interface KeychainPrintSheetProps {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
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
  qrScale?: number;
}

function InsertPair({
  index,
  widthMm,
  heightMm,
  shape = 'rectangle',
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption,
  gap,
  qrDesign,
  showGuides,
  qrScale,
}: {
  index: number;
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  coverPhotoUrl?: string;
  coupleNames: string;
  caption?: string;
  gap: number;
  qrScale?: number;
  qrDesign?: {
    dotsColor: string;
    backgroundColor: string;
    cornersColor: string;
    dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    cornersType: 'square' | 'dot' | 'extra-rounded';
    cornersDotType: 'dot' | 'square';
    logoUrl?: string;
  };
  showGuides?: boolean;
}) {
  return (
    <div
      className="Print-card"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        gap: `${gap}mm`,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        borderRadius: '3mm',
        padding: '0',
        width: `${widthMm * 2 + gap + 1}mm`,
        height: `${heightMm + 3}mm`,
        boxSizing: 'border-box',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      <div style={{ width: `${widthMm}mm`, height: `${heightMm}mm`, border: 'none', borderRadius: '3mm', padding: '0', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
        <KeychainInsertQR
          widthMm={widthMm}
          heightMm={heightMm}
          shape={shape}
          qrDataUrl={qrDataUrl}
          qrCodeUrl={qrCodeUrl}
          caption={caption}
          qrDesign={qrDesign}
          scale={1}
          qrScale={qrScale}
          printMode={true}
          showGuides={showGuides}
        />
      </div>

      <div style={{ width: `${widthMm}mm`, height: `${heightMm}mm`, border: 'none', borderRadius: '3mm', padding: '0', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
        <KeychainInsertPhoto
          widthMm={widthMm}
          heightMm={heightMm}
          shape={shape}
          coverPhotoUrl={coverPhotoUrl}
          coupleNames={coupleNames}
          scale={1}
          printMode={true}
          showGuides={showGuides}
        />
      </div>
    </div>
  );
}

export default function KeychainPrintSheet({
  widthMm,
  heightMm,
  shape = 'rectangle',
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
  qrScale = 1,
  qrDesign,
}: KeychainPrintSheetProps) {
  const numCopies = copies;
  const insertWidth = widthMm;
  const insertHeight = heightMm;
  const gap = 1; // Reduced from 2mm for tighter print layout

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
          .Print-page { height: auto !important; overflow: visible !important; }
          .Print-grid {
            display: grid !important;
            grid-template-columns: repeat(${pairsPerRow}, minmax(0, 1fr)) !important;
            grid-auto-rows: auto !important;
            gap: 1mm !important; /* Gap for cards */
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
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
            background-color: #ffffff !important; /* Fill to avoid gray non-ink boundary */
            box-shadow: none !important; /* Remove drop shadow for cut-ready print */
            border: none !important;
            box-sizing: border-box !important; /* Border included in dimensions */
          }
          .Print-card > div {
            border: none !important;
            border-radius: 3mm !important;
            padding: 2mm !important;
            box-sizing: border-box !important;
          }
          .no-print { display: none !important; }
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
              shape={shape} 
              qrDataUrl={qrDataUrl} 
              qrCodeUrl={qrCodeUrl}
              coverPhotoUrl={coverPhotoUrl} 
              coupleNames={coupleNames} 
              caption={caption} 
              gap={gap} 
              showGuides={showGuides}              qrScale={qrScale}              qrDesign={qrDesign}
            />
          ))}
        </div>
      </div>
      <div className="print:hidden text-center mt-4 text-sm text-slate-500">
        <p>Printing {numCopies} inserts ({pairsPerRow} pairs/row × {numRows} rows)</p>
        <p className="text-xs mt-1">Each insert has QR code and photo side by side</p>
        <p className="text-xs mt-1 text-rose-600">
          Cut lines are indicated by dashed borders, final corner radius: 3mm
        </p>
      </div>
    </div>
  );
}

