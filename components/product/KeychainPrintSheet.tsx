'use client';

import KeychainInsertQR from './KeychainInsertQR';
import KeychainInsertPhoto from './KeychainInsertPhoto';
import { computePrintLayout } from '@/lib/printSheetUtils';
import type { KeychainShape } from './KeychainSizeConfig';

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
  accentColor?: string;
  sheetMode?: 'front-back-pair' | 'qr-only';
  backSideVariant?: 'photo' | 'engraved';
  backSideSubtitle?: string;
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
  photoTransform?: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
}

function PairCropMarks({
  show,
  showCenterMarks = true,
}: {
  show: boolean;
  showCenterMarks?: boolean;
}) {
  if (!show) return null;

  const isPrint =
    typeof window !== 'undefined' ? window.matchMedia('print').matches : false;

  const THICKNESS = isPrint ? '0.1mm' : '1px';
  const LENGTH = isPrint ? '1.6mm' : '7px';

  const mark = {
    position: 'absolute' as const,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
    pointerEvents: 'none' as const,
  };

  const centerOffset = isPrint ? '0.05mm' : '0.5px';

  return (
    <>
      <div style={{ ...mark, top: 0, left: 0, width: LENGTH, height: THICKNESS }} />
      <div style={{ ...mark, top: 0, left: 0, width: THICKNESS, height: LENGTH }} />

      <div style={{ ...mark, top: 0, right: 0, width: LENGTH, height: THICKNESS }} />
      <div style={{ ...mark, top: 0, right: 0, width: THICKNESS, height: LENGTH }} />

      <div style={{ ...mark, bottom: 0, left: 0, width: LENGTH, height: THICKNESS }} />
      <div style={{ ...mark, bottom: 0, left: 0, width: THICKNESS, height: LENGTH }} />

      <div style={{ ...mark, bottom: 0, right: 0, width: LENGTH, height: THICKNESS }} />
      <div style={{ ...mark, bottom: 0, right: 0, width: THICKNESS, height: LENGTH }} />

      {showCenterMarks && (
        <>
          <div
            style={{
              ...mark,
              top: 0,
              left: `calc(50% - ${centerOffset})`,
              width: THICKNESS,
              height: isPrint ? '1.8mm' : '7px',
            }}
          />
          <div
            style={{
              ...mark,
              bottom: 0,
              left: `calc(50% - ${centerOffset})`,
              width: THICKNESS,
              height: isPrint ? '1.8mm' : '7px',
            }}
          />
        </>
      )}
    </>
  );
}

function InsertPair({
  widthMm,
  heightMm,
  shape = 'rectangle',
  qrDataUrl,
  qrCodeUrl,
  coverPhotoUrl,
  coupleNames,
  caption,
  sheetMode = 'front-back-pair',
  backSideVariant = 'photo',
  backSideSubtitle,
  qrDesign,
  showGuides,
  qrScale,
  photoTransform,
}: {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
  qrDataUrl?: string;
  qrCodeUrl?: string;
  coverPhotoUrl?: string;
  coupleNames: string;
  caption?: string;
  sheetMode?: 'front-back-pair' | 'qr-only';
  backSideVariant?: 'photo' | 'engraved';
  backSideSubtitle?: string;
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
  photoTransform?: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
}) {
  return (
    <div
      className="Print-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        gap: 0,
        backgroundColor: '#ffffff',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
        padding: 0,
        margin: 0,
        width: `${sheetMode === 'qr-only' ? widthMm : widthMm * 2}mm`,
        height: `${heightMm}mm`,
        boxSizing: 'border-box',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        overflow: 'visible',
      }}
    >
      <PairCropMarks show={!!showGuides} showCenterMarks={sheetMode !== 'qr-only'} />

      <div
        style={{
          width: `${widthMm}mm`,
          height: `${heightMm}mm`,
          border: 'none',
          padding: 0,
          margin: 0,
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
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
          showGuides={false}
        />
      </div>

      {sheetMode === 'front-back-pair' ? (
        <div
          style={{
            width: `${widthMm}mm`,
            height: `${heightMm}mm`,
            border: 'none',
            padding: 0,
            margin: 0,
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          <KeychainInsertPhoto
            widthMm={widthMm}
            heightMm={heightMm}
            shape={shape}
            coverPhotoUrl={coverPhotoUrl}
            coupleNames={coupleNames}
            variant={backSideVariant}
            subtitle={backSideSubtitle}
            scale={1}
            printMode={true}
            showGuides={false}
            photoTransform={photoTransform}
          />
        </div>
      ) : null}
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
  sheetMode = 'front-back-pair',
  backSideVariant = 'photo',
  backSideSubtitle,
  qrScale = 1,
  qrDesign,
  photoTransform,
}: KeychainPrintSheetProps) {
  const {
    pairWidthMm,
    usableWidthMm,
    usableHeightMm,
    actualPairsPerRow,
    rowHeightMm,
    rowsPerPage,
    totalRows,
    totalPages,
    pages,
  } = computePrintLayout({
    widthMm,
    heightMm,
    copies,
    pairsPerRow,
    sheetMode,
  });

  const outerMarginMm = 2;
  const horizontalGapMm = 0.8;
  const verticalGapMm = 0.8;

  return (
    <div
      className="Print-sheet"
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        background: '#ffffff',
      }}
    >
      <style jsx global>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            background: #ffffff !important;
          }

          .Print-sheet {
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .Print-sheet > .Print-page {
            width: 210mm !important;
            min-height: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            page-break-after: auto !important;
            break-after: auto !important;
            box-sizing: border-box !important;
          }

          .Print-sheet > .Print-page:not(:last-of-type) {
            page-break-after: always !important;
            break-after: page !important;
          }

          .Print-grid {
            display: grid !important;
            justify-content: start !important;
            align-content: start !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            transform: none !important;
          }

          .Print-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }

          .Print-card > div {
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {pages.map((pageItems, pageIndex) => (
        <div
          key={`print-page-${pageIndex}`}
          className="Print-page"
          style={{ background: '#ffffff' }}
        >
          <div
            className="Print-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${actualPairsPerRow}, ${pairWidthMm}mm)`,
              gridAutoRows: `${rowHeightMm}mm`,
              columnGap: `${horizontalGapMm}mm`,
              rowGap: `${verticalGapMm}mm`,
              width: 'fit-content',
              margin: `${outerMarginMm}mm`,
              padding: 0,
              justifyContent: 'start',
              alignContent: 'start',
              background: '#ffffff',
            }}
          >
            {pageItems.map((itemIndex) => (
              <InsertPair
                key={`insert-pair-${itemIndex}`}
                widthMm={widthMm}
                heightMm={heightMm}
                shape={shape}
                qrDataUrl={qrDataUrl}
                qrCodeUrl={qrCodeUrl}
                coverPhotoUrl={coverPhotoUrl}
                coupleNames={coupleNames}
                caption={caption}
                sheetMode={sheetMode}
                backSideVariant={backSideVariant}
                backSideSubtitle={backSideSubtitle}
                showGuides={showGuides}
                qrScale={qrScale}
                qrDesign={qrDesign}
                photoTransform={photoTransform}
              />
            ))}
          </div>
        </div>
      ))}

      <section className="print:hidden text-center mt-4 text-sm text-slate-500">
        <p>
          Printing {copies} {sheetMode === 'qr-only' ? 'panels' : 'inserts'} ({actualPairsPerRow} {sheetMode === 'qr-only' ? 'pieces' : 'pairs'}/row × {totalRows} rows)
        </p>
        <p className="text-xs mt-1">
          {sheetMode === 'qr-only'
            ? 'Each print shows a single QR-facing panel'
            : `Each insert has QR code and ${backSideVariant === 'engraved' ? 'engraved back' : 'photo side'} side by side`}
        </p>
        <p className="text-xs mt-1 text-rose-600">
          Print using Actual Size / 100% for best alignment
        </p>
      </section>
    </div>
  );
}