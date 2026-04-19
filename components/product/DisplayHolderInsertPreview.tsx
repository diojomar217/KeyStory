'use client';

import React, { useRef, useState } from 'react';
import DisplayHolderTemplateRenderer, { type SiteData } from '@/components/product/DisplayHolderTemplateRenderer';

interface Props {
  widthMm: number;
  heightMm: number;
  site: SiteData;
  template?: string;
  caption?: string;
  showGuides?: boolean;
}

export default function DisplayHolderInsertPreview({ widthMm, heightMm, site, template, caption }: Props) {
  const [isDownloadingPhoto, setIsDownloadingPhoto] = useState(false);
  const [isExportingPanel, setIsExportingPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const photoUrl = site?.selectedPhotoUrl || site?.media?.photos?.[0] || '';

  async function downloadImage(url: string) {
    if (!url) return;
    try {
      setIsDownloadingPhoto(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      const blob = await res.blob();
      const contentType = res.headers.get('content-type') || '';
      const extFromType = contentType.split('/')[1] || '';
      let filename = 'photo';
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.split('/').pop() || '';
        if (path.includes('.')) filename = path;
        else if (extFromType) filename = `photo.${extFromType}`;
      } catch (e) {
        if (extFromType) filename = `photo.${extFromType}`;
      }

      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      // fallback: open image in new tab
      try {
        window.open(url, '_blank');
      } catch (e) {
        // noop
      }
    } finally {
      setIsDownloadingPhoto(false);
    }
  }

  async function downloadPanel() {
    if (!panelRef.current) return;
    try {
      setIsExportingPanel(true);
      const html2canvasModule = (await import('html2canvas')) as any;
      const html2canvas = html2canvasModule?.default || html2canvasModule;
      if (!html2canvas) throw new Error('html2canvas not available');

      // capture the panel element at higher scale for better quality
      const canvas: HTMLCanvasElement = await html2canvas(panelRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to export image');

      const filenameBase = (site?.eventName || site?.customerName || 'display-holder').replace(/\s+/g, '-').toLowerCase();
      const filename = `${filenameBase}.png`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // html2canvas may not be installed or cross-origin images blocked — fallback: open in new tab
      try {
        const openUrl = window.location.href;
        window.open(openUrl, '_blank');
      } catch (e) {
        // noop
      }
      // Optionally show instructions to install html2canvas
      // alert('To enable panel export, install html2canvas: `npm i html2canvas`.');
    } finally {
      setIsExportingPanel(false);
    }
  }
  const cardWrapStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.8rem',
    boxShadow: 'none',
    padding: '8px',
    width: 'fit-content',
  };

  const mmToPx = (mm: number) => mm * 3.7795275591;
  const targetPx = 180; // target preview width in px
  const pxWidth = mmToPx(widthMm || 105);
  const scale = Math.min(1, targetPx / Math.max(1, pxWidth));

  return (
    <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Live Preview
      </h3>

      <div className="flex flex-wrap gap-8 justify-center items-start">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-slate-700">Display Holder Panel</p>
            {photoUrl ? (
              <button
                type="button"
                onClick={() => downloadImage(photoUrl)}
                disabled={isDownloadingPhoto || isExportingPanel}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border text-sm text-slate-700 hover:bg-slate-50"
              >
                {isDownloadingPhoto ? 'Downloading...' : 'Download Photo'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={downloadPanel}
              disabled={isExportingPanel || isDownloadingPhoto}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border text-sm text-slate-700 hover:bg-slate-50"
            >
              {isExportingPanel ? 'Exporting...' : 'Download Panel'}
            </button>
          </div>
          <div style={cardWrapStyle}>
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <div ref={panelRef} style={{ width: `${widthMm}mm`, height: `${heightMm}mm`, boxSizing: 'border-box' }}>
                  <DisplayHolderTemplateRenderer
                    site={site}
                    templateStyle={(template as any) || 'premium'}
                    qrCaption={caption}
                    widthMm={widthMm}
                    heightMm={heightMm}
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
