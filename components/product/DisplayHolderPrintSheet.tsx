'use client';

import type { KeychainShape } from './KeychainSizeConfig';
import { computePrintLayout } from '@/lib/printSheetUtils';
import DisplayHolderTemplateRenderer, { type SiteData } from '@/components/product/DisplayHolderTemplateRenderer';

interface DisplayHolderPrintSheetProps {
  widthMm: number;
  heightMm: number;
  shape?: KeychainShape;
  coupleNames: string;
  caption?: string;
  copies: number;
  pairsPerRow?: number;
  showGuides?: boolean;
  template?: any;
  site?: SiteData;
}

function CropMarks({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <>
      <div className="absolute top-0 left-0 w-[6px] h-[1px] bg-black" />
      <div className="absolute top-0 left-0 w-[1px] h-[6px] bg-black" />

      <div className="absolute top-0 right-0 w-[6px] h-[1px] bg-black" />
      <div className="absolute top-0 right-0 w-[1px] h-[6px] bg-black" />

      <div className="absolute bottom-0 left-0 w-[6px] h-[1px] bg-black" />
      <div className="absolute bottom-0 left-0 w-[1px] h-[6px] bg-black" />

      <div className="absolute bottom-0 right-0 w-[6px] h-[1px] bg-black" />
      <div className="absolute bottom-0 right-0 w-[1px] h-[6px] bg-black" />
    </>
  );
}

function InsertSingle({
  widthMm,
  heightMm,
  showGuides,
  coupleNames,
  template,
  caption,
  site,
}: {
  widthMm: number;
  heightMm: number;
  showGuides?: boolean;
  coupleNames: string;
  template?: any;
  caption?: string;
  site?: SiteData;
}) {
  return (
    <div
      style={{
        width: `${widthMm}mm`,
        height: `${heightMm}mm`,
        position: 'relative',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <CropMarks show={!!showGuides} />

      <DisplayHolderTemplateRenderer
        site={
          site || {
            occasionType: 'couple',
            customerName: coupleNames,
          }
        }
        templateStyle={template || 'premium'}
        qrCaption={caption}
        widthMm={widthMm}
        heightMm={heightMm}
      />
    </div>
  );
}

export default function DisplayHolderPrintSheet({
  widthMm,
  heightMm,
  coupleNames,
  caption = '',
  copies,
  pairsPerRow = 2,
  showGuides = true,
  template,
  site,
}: DisplayHolderPrintSheetProps) {
  const { pages, actualPairsPerRow, pairWidthMm, rowHeightMm } =
    computePrintLayout({
      widthMm,
      heightMm,
      copies,
      pairsPerRow,
      sheetMode: 'qr-only',
    });

  return (
    <div>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="mb-4">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${actualPairsPerRow}, ${pairWidthMm}mm)`,
              gridAutoRows: `${rowHeightMm}mm`,
              gap: '1mm',
            }}
          >
            {pageItems.map((i) => (
              <InsertSingle
                key={i}
                widthMm={widthMm}
                heightMm={heightMm}
                showGuides={showGuides}
                coupleNames={coupleNames}
                template={template}
                caption={caption}
                site={site} // ✅ FIXED
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}