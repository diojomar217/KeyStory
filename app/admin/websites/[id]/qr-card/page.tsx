'use client';
import { DEFAULT_THEME } from '@/config/defaults';
import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import QRCard from '@/components/ui/QRCard';
import { QrKeepsakeCard, QrConfig } from '@/components/qr/QrKeepsakeCard';
import PrintableCardLayout from '@/components/product/PrintableCardLayout';
import PrintActions from '@/components/product/PrintActions';
import { toPng } from 'html-to-image';
import { Site } from '@/lib/supabase';
import type { ThemeKey } from '@/config/themeConfig';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QRCardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrConfig, setQrConfig] = useState<QrConfig>({
    color: '#e11d48',
    background: '#ffffff',
    style: 'rounded',
    cardStyle: 'love_card',
    title: 'Scan our love story ❤️',
    subtitle: 'Open the memory website',
    showNames: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [cardSize, setCardSize] = useState<'small' | 'large'>('large');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  // Restore original: no cardConfigs

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin?id=${id}`);
      const data = await res.json();

      if (data.site || data.order) {
        const siteData = data.site || data.order;
        setOrder(siteData);

        const incomingQr = siteData.config?.qr || {};
        setQrConfig((prev) => ({
          ...prev,
          ...incomingQr,
          cardStyle: incomingQr.cardStyle || (siteData.site_type === 'birthday' ? 'birthday_card' : 'love_card'),
          title:
            incomingQr.title ||
            (siteData.site_type === 'birthday'
              ? 'Scan the birthday surprise 🎉'
              : 'Scan our love story ❤️'),
          subtitle: incomingQr.subtitle || 'Open the memory website',
          showNames: typeof incomingQr.showNames === 'boolean' ? incomingQr.showNames : siteData.site_type !== 'birthday',
        }));
      } else {
        setError('Website not found');
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load website data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
        <p className="text-slate-500 mb-4">{error || 'Website not found'}</p>
        <a
          href="/admin/websites"
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          Back to Websites
        </a>
      </div>
    );
  }

  // Get theme from site config
  const config = order.config || {};
  const theme: ThemeKey = (config.theme as ThemeKey) || DEFAULT_THEME;

  const customerName = config?.people?.primary || order.customer_name || 'Your Name';
  const partnerName = config?.people?.secondary || order.partner_name || 'Partner Name';
  const anniversaryDate = config?.dates?.special_date || order.specialDate || order.anniversary_date || '';

  // Get website URL
  const websiteUrl = order.website_name 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${order.website_name}`
    : undefined;

  // Use QR redirect path if available to track scans
  const qrRedirectUrl = order.website_name
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${order.website_name}`
    : undefined;

  const qrDataUrl =
    typeof config.qr_data_url === 'string' && config.qr_data_url.trim() !== ''
      ? config.qr_data_url
      : qrRedirectUrl || websiteUrl;
  const qrCodeUrl = order.qr_code_url;

  return (
    <>
      {/* Header - Hidden when printing */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Printable QR Card</h1>
            <p className="text-slate-500 mt-1">
              {customerName} & {partnerName}
            </p>
          </div>
          <a 
            href="/admin/websites" 
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Websites
          </a>
        </div>
      </div>

      {/* QR Keepsake Customization Panel */}
      <div className="grid gap-8 md:grid-cols-2">

        <div className="space-y-4 p-4 rounded-2xl border border-slate-200 bg-white">
          <h2 className="text-lg font-semibold">QR Keepsake Settings</h2>

          <label className="block text-sm font-medium text-slate-700">Card Style</label>
          <select
            value={qrConfig.cardStyle}
            onChange={(e) => setQrConfig((prev) => ({ ...prev, cardStyle: e.target.value as QrConfig['cardStyle'] }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="love_card">Love Card</option>
            <option value="birthday_card">Birthday Card</option>
            <option value="minimal_card">Minimal Card</option>
            <option value="polaroid">Polaroid</option>
            <option value="none">Plain</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <button
              className={`px-3 py-2 border rounded-lg ${cardSize === 'small' ? 'bg-slate-200' : 'bg-white'}`}
              onClick={() => setCardSize('small')}
            >
              5.5cm x 4cm
            </button>
            <button
              className={`px-3 py-2 border rounded-lg ${cardSize === 'large' ? 'bg-slate-200' : 'bg-white'}`}
              onClick={() => setCardSize('large')}
            >
              6.2cm x 4.1cm
            </button>
          </div>

          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input
            value={qrConfig.title || ''}
            onChange={(e) => setQrConfig((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />

          <label className="block text-sm font-medium text-slate-700">Subtitle</label>
          <input
            value={qrConfig.subtitle || ''}
            onChange={(e) => setQrConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />

          <div className="flex items-center gap-2">
            <input
              id="showNames"
              type="checkbox"
              checked={qrConfig.showNames ?? true}
              onChange={(e) => setQrConfig((prev) => ({ ...prev, showNames: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="showNames" className="text-sm text-slate-700">Show names on card</label>
          </div>

          <label className="block text-sm font-medium text-slate-700">QR Dots Color</label>
          <input
            value={qrConfig.color || '#e11d48'}
            type="color"
            onChange={(e) => setQrConfig((prev) => ({ ...prev, color: e.target.value }))}
            className="h-9 w-16"
          />

          <label className="block text-sm font-medium text-slate-700">Card Background</label>
          <input
            value={qrConfig.background || '#ffffff'}
            type="color"
            onChange={(e) => setQrConfig((prev) => ({ ...prev, background: e.target.value }))}
            className="h-9 w-16"
          />

          <button
            onClick={async () => {
              if (!order?.id) return;
              setIsSaving(true);
              setSaveMsg(null);

              try {
                const updatedConfig = { ...order.config, qr: qrConfig };
                const res = await fetch('/api/admin', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: order.id, config: updatedConfig, website_name: order.website_name, site_type: order.site_type, status: order.status }),
                });

                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || 'Unable to save');

                setOrder((prev) => (prev ? { ...prev, config: updatedConfig } : prev));
                setSaveMsg('Saved successfully.');
              } catch (err: any) {
                console.error(err);
                setSaveMsg('Save failed.');
              } finally {
                setIsSaving(false);
                setTimeout(() => setSaveMsg(null), 3000);
              }
            }}
            disabled={isSaving}
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            {isSaving ? 'Saving...' : 'Save QR Keepsake'}
          </button>
          {saveMsg && <p className="mt-2 text-sm text-slate-700">{saveMsg}</p>}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
          <div ref={cardPreviewRef} className="mx-auto p-4 bg-slate-50 rounded-2xl">
            <QrKeepsakeCard
              theme={theme}
              siteType={order.site_type as 'couple' | 'birthday' | string}
              customerName={customerName}
              partnerName={partnerName}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              slug={order.website_name || order.slug}
              config={qrConfig}
              cardSize={cardSize}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={async () => {
                if (!cardPreviewRef.current) return;
                try {
                  const dataUrl = await toPng(cardPreviewRef.current, { pixelRatio: 3, backgroundColor: '#ffffff' });
                  const link = document.createElement('a');
                  link.href = dataUrl;
                  link.download = `${order?.website_name || 'qr-keepsake'}.png`;
                  link.click();
                } catch (err) {
                  console.error('PNG export failed', err);
                  alert('Unable to export PNG.');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Download PNG
            </button>

            <button
              onClick={async () => {
                if (!order?.website_name) return;
                setDownloadingPdf(true);
                try {
                  const response = await fetch(`/api/site/${order.website_name}/pdf`);
                  if (!response.ok) throw new Error('PDF generation failed');
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${order.website_name}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error(err);
                  alert('Unable to download PDF.');
                } finally {
                  setDownloadingPdf(false);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
              disabled={downloadingPdf}
            >
              {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="print:hidden mt-8 flex flex-wrap gap-4 justify-center">
        {/* Keychain Print Link */}
        <a
          href={`/admin/websites/${id}/keychain-print`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium rounded-xl transition-all duration-200 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Keychain Inserts
        </a>

        {/* Print Actions */}
        <PrintActions
          customerName={customerName}
          partnerName={partnerName}
          qrDataUrl={qrDataUrl}
          qrCodeUrl={qrCodeUrl}
        />
      </div>

      {/* Help text - Hidden when printing */}
      <div className="print:hidden text-center mt-6 text-sm text-slate-500">
        <p>Tip: Use Ctrl+P (or Cmd+P on Mac) to print these cards.</p>
        <p className="mt-1">Cards are optimized for standard paper sizes.</p>
      </div>
    </>
  );
}

