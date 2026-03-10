'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import KeychainTypeSelector from '@/components/product/KeychainTypeSelector';
import KeychainInsertPreview from '@/components/product/KeychainInsertPreview';
import KeychainPrintSheet from '@/components/product/KeychainPrintSheet';
import { Order } from '@/lib/supabase';
import { KeychainSize, KEYCHAIN_SIZES } from '@/components/product/KeychainSizeConfig';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KeychainPrintPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<KeychainSize>(KEYCHAIN_SIZES[1]);
  const [customWidth, setCustomWidth] = useState(50);
  const [customHeight, setCustomHeight] = useState(35);
  const [caption, setCaption] = useState('Scan our love story');
  const [copies, setCopies] = useState(12);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin?id=${id}`);
      const data = await res.json();

      if (data.order) {
        setOrder(data.order);
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

  const getActualDimensions = () => {
    if (selectedSize.label === 'Custom Size') {
      return { widthMm: customWidth, heightMm: customHeight };
    }
    return { widthMm: selectedSize.width_mm, heightMm: selectedSize.height_mm };
  };

  // Calculate columns and rows based on copies
  const columns = 3;
  const rows = Math.ceil(copies / columns);

  const config = order?.config || {};
  const coupleNames = order ? `${order.customer_name} & ${order.partner_name}` : '';
  const qrDataUrl = config.qr_data_url;
  const qrCodeUrl = order?.qr_code_url;
  
  const photos = order?.photos || [];
  const coverPhotoIndex = config.cover_photo_index ?? 0;
  const coverPhotoUrl = photos[coverPhotoIndex] || photos[0] || '';
  
  const websiteUrl = order?.website_name 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/love/${order.website_name}`
    : undefined;

  const handlePrint = () => {
    window.print();
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

  const { widthMm, heightMm } = getActualDimensions();

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Hide all non-print UI */
          .print\\:hidden {
            display: none !important;
          }
          /* Show only print content */
          .print\\:block {
            display: block !important;
          }
          .print\\:flex {
            display: flex !important;
          }
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          /* Print sheet styling */
          .print-sheet {
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-page {
            page-break-after: always;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-page:last-child {
            page-break-after: avoid;
          }
          .print-insert {
            page-break-inside: avoid;
            border: none !important;
            box-shadow: none !important;
          }
          /* Remove borders from print sheet grid */
          .print-sheet-grid {
            border: none !important;
            margin: 0 !important;
            padding: 3mm !important;
          }
          /* Hide admin layout elements */
          nav,
          aside,
          .admin-sidebar,
          [class*="sidebar"],
          header,
          .header,
          [class*="header"] {
            display: none !important;
          }
          /* Hide all interactive elements */
          button,
          input,
          select,
          textarea,
          .no-print,
          a {
            display: none !important;
          }
          /* Print content takes full width */
          .print\\:w-full {
            width: 100% !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          /* Remove margins and padding for print */
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          /* Ensure proper print layout */
          .print\\:overflow-visible {
            overflow: visible !important;
          }
        }
      `}</style>

      {/* Screen-only Header - Hidden when printing */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Keychain Print Maker
            </h1>
            <p className="text-slate-500 mt-1">
              {coupleNames} • {selectedSize.label} ({widthMm}mm × {heightMm}mm)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/admin/websites/${id}/qr-card`} className="text-rose-600 hover:text-rose-700 font-medium">
              ← QR Card
            </a>
            <a href="/admin/websites" className="text-slate-600 hover:text-slate-700 font-medium">
              Back to Websites
            </a>
          </div>
        </div>
      </div>

      {/* Screen-only Content - Entire preview area - Hidden when printing */}
      <div className="print:hidden">
        {/* Screen-only Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <KeychainTypeSelector
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              customWidth={customWidth}
              customHeight={customHeight}
              onCustomWidthChange={setCustomWidth}
              onCustomHeightChange={setCustomHeight}
            />

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Caption</h3>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                maxLength={30}
              />
              <p className="text-xs text-slate-500 mt-2">
                This text appears below the QR code ({30 - caption.length} characters remaining)
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Number of Copies</h3>
              <div className="flex items-center gap-3">
                <label htmlFor="copies" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Number of Copies:
                </label>
                <input
                  type="number"
                  id="copies"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-24 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 text-center font-semibold"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Grid: {columns} columns × {rows} rows = {copies} inserts
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Print Options</h3>
              <button
                onClick={handlePrint}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md mb-3"
              >
                Print Inserts
              </button>
              <p className="text-xs text-slate-500 text-center">
                Tip: Use Ctrl+P (or Cmd+P on Mac) to print. <br />
                Page 1 = QR codes • Page 2 = Photos
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Couple:</span>
                  <span className="text-slate-900 font-medium">{coupleNames}</span>
                </div>
                {websiteUrl && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">URL:</span>
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline truncate max-w-[150px]">
                      {order.website_name}
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Insert Size:</span>
                  <span className="text-slate-900">{widthMm}mm × {heightMm}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shape:</span>
                  <span className="text-slate-900 capitalize">{selectedSize.shape}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Screen-only: Live Preview */}
            <KeychainInsertPreview
              widthMm={widthMm}
              heightMm={heightMm}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              coverPhotoUrl={coverPhotoUrl}
              coupleNames={coupleNames}
              caption={caption}
            />

            {/* Screen-only: Print Sheet Preview container */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Print Sheet Preview</h3>
              <KeychainPrintSheet
                widthMm={widthMm}
                heightMm={heightMm}
                qrDataUrl={qrDataUrl}
                qrCodeUrl={qrCodeUrl}
                coverPhotoUrl={coverPhotoUrl}
                coupleNames={coupleNames}
                caption={caption}
                copies={copies}
                columns={columns}
              />
            </div>

            <div className="text-center text-sm text-slate-500">
              <p className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
                💡 <strong>Printing Tip:</strong> When printing, ensure "Background graphics" 
                is enabled in print settings for best results. These inserts are designed 
                for double-sided clear acrylic keychains.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only: Actual Print Sheet - Only visible when printing */}
      <div 
        className="hidden print:block" 
        style={{ 
          margin: 0, 
          padding: 0, 
          position: 'absolute', 
          top: 0, 
          left: 0,
          width: '100%'
        }}
      >
        <KeychainPrintSheet
          widthMm={widthMm}
          heightMm={heightMm}
          qrDataUrl={qrDataUrl}
          qrCodeUrl={qrCodeUrl}
          coverPhotoUrl={coverPhotoUrl}
          coupleNames={coupleNames}
          caption={caption}
          copies={copies}
          columns={columns}
        />
      </div>
    </>
  );
}

