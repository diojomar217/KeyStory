'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import KeychainTypeSelector from '@/components/product/KeychainTypeSelector';
import KeychainInsertPreview from '@/components/product/KeychainInsertPreview';
import KeychainPrintSheet from '@/components/product/KeychainPrintSheet';
import { Site } from '@/lib/supabase';
import { KeychainSize, KEYCHAIN_SIZES } from '@/components/product/KeychainSizeConfig';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function KeychainPrintPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const QR_LOGO_OPTIONS = [
    { label: 'None', value: undefined },
    { label: 'Heart', value: '/heart-icon.svg' },
    { label: 'File', value: '/file.svg' },
    { label: 'Globe', value: '/globe.svg' },
    { label: 'Window', value: '/window.svg' },
    { label: 'Vercel', value: '/vercel.svg' },
  ];

  const QR_PRESETS: Record<QrPreset, InsertConfig['qrDesign']> = {
    classic: {
      dotsColor: '#000000',
      backgroundColor: '#ffffff',
      cornersColor: '#000000',
      dotsType: 'square',
      cornersType: 'square',
      cornersDotType: 'square',
      logoUrl: '/heart-icon.svg',
    },
    modern: {
      dotsColor: '#6366f1',
      backgroundColor: '#ffffff',
      cornersColor: '#6366f1',
      dotsType: 'rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      logoUrl: '/heart-icon.svg',
    },
    minimal: {
      dotsColor: '#374151',
      backgroundColor: '#f9fafb',
      cornersColor: '#374151',
      dotsType: 'dots',
      cornersType: 'dot',
      cornersDotType: 'dot',
      logoUrl: '/heart-icon.svg',
    },
    elegant: {
      dotsColor: '#7c3aed',
      backgroundColor: '#ffffff',
      cornersColor: '#7c3aed',
      dotsType: 'classy',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      logoUrl: '/heart-icon.svg',
    },
    bold: {
      dotsColor: '#dc2626',
      backgroundColor: '#ffffff',
      cornersColor: '#dc2626',
      dotsType: 'extra-rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'square',
      logoUrl: '/heart-icon.svg',
    },
  };

  const [order, setOrder] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Full Print option state
  const [fullPrint, setFullPrint] = useState(false);
  // Multi-insert config state
  type QrPreset = 'classic' | 'modern' | 'minimal' | 'elegant' | 'bold';

  type InsertConfig = {
    size: KeychainSize;
    customWidth: number;
    customHeight: number;
    caption: string;
    copies: number;
    photoIndex: number;
    useCustomQr: boolean;
    qrPreset: QrPreset;
    qrDesign: {
      dotsColor: string;
      backgroundColor: string;
      cornersColor: string;
      dotsType: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
      cornersType: 'square' | 'dot' | 'extra-rounded';
      cornersDotType: 'dot' | 'square';
      logoUrl?: string;
    };
  };

  const [insertConfigs, setInsertConfigs] = useState<InsertConfig[]>([
    {
      size: KEYCHAIN_SIZES[1],
      customWidth: 50,
      customHeight: 35,
      caption: 'Scan our love story',
      copies: 12,
      photoIndex: 0,
      useCustomQr: false,
      qrPreset: 'classic',
      qrDesign: {
        dotsColor: '#e11d48',
        backgroundColor: '#ffffff',
        cornersColor: '#e11d48',
        dotsType: 'rounded',
        cornersType: 'extra-rounded',
        cornersDotType: 'dot',
      }
    }
  ]);
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [pairsPerRow, setPairsPerRow] = useState(2);
  const [showGuides, setShowGuides] = useState(true);
  const [autoFit, setAutoFit] = useState(true);
  const [qrScale, setQrScale] = useState(1);
  const [scanWarning, setScanWarning] = useState<string | null>(null);

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
        setOrder((data.site || data.order) as Site);
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

  const getActualDimensions = (config: { size: KeychainSize; customWidth: number; customHeight: number }) => {
    if (config.size.label === 'Custom Size') {
      return { widthMm: config.customWidth, heightMm: config.customHeight };
    }
    return { widthMm: config.size.width_mm, heightMm: config.size.height_mm };
  };

  const config = order?.config || {};
  const customerName = config?.people?.primary || order?.customer_name || 'Your Name';
  const partnerName = config?.people?.secondary || order?.partner_name || 'Partner Name';
  const coupleNames = `${customerName} & ${partnerName}`;

  const photos = Array.isArray(config?.media?.photos)
    ? config.media.photos
    : order?.photos || [];
  // Safely extract cover photo index - ensure it's a number
  const coverPhotoIndex = typeof config.cover_photo_index === 'number' ? config.cover_photo_index : 0;

  const websiteUrl = order?.website_name
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${order.website_name}`
    : undefined;

    const qrDataUrl =
  typeof config.qr_data_url === 'string' && config.qr_data_url.trim() !== ''
    ? config.qr_data_url
    : websiteUrl;
  const qrCodeUrl = order?.qr_code_url;

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

  const activeConfig = insertConfigs[activeConfigIndex] ?? insertConfigs[0];
  const { widthMm, heightMm } = getActualDimensions(activeConfig);
  const activePhotoUrl = photos[activeConfig.photoIndex] || '';

  // Scanability validation
  const validateScanability = (dotsColor: string, bgColor: string): string | null => {
    const getLuminance = (hex: string) => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lumDots = getLuminance(dotsColor);
    const lumBg = getLuminance(bgColor);
    const ratio = lumBg > lumDots ? lumBg / lumDots : lumDots / lumBg;

    if (ratio < 3) return '⚠️ Low contrast - QR may not scan reliably';
    if (ratio < 4.5) return '⚠️ Poor contrast - test scanning before printing';
    return null;
  };

  const activeWarning = activeConfig.useCustomQr ? validateScanability(activeConfig.qrDesign.dotsColor, activeConfig.qrDesign.backgroundColor) : null;

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2mm; /* Reduced from default */
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: #ffffff !important;
          }
          /* Hide all non-print UI */
          .print:hidden {
            display: none !important;
          }
          /* Show only print content */
          .print:block {
            display: block !important;
          }
          .print:flex {
            display: flex !important;
          }
          .print:mt-0 {
            margin-top: 0 !important;
          }
          /* Print sheet styling */
          .print-sheet, .Print-sheet {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .print-page, .Print-page {
            page-break-after: always;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .print-page:last-child, .Print-page:last-child {
            page-break-after: avoid;
          }
          .print-insert {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Remove borders from print sheet grid */
          .print-sheet-grid, .Print-grid {
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0.5mm !important; /* Tight grid spacing */
          }
          /* Ensure print cards maintain their dimensions */
          .Print-card {
            height: auto !important; /* Let aspect ratio control height */
            min-height: 0 !important;
            max-height: none !important;
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
          .print:w-full {
            width: 100% !important;
          }
          .print:max-w-none {
            max-width: none !important;
          }
          /* Remove margins and padding for print */
          .print:p-0 {
            padding: 0 !important;
          }
          .print:m-0 {
            margin: 0 !important;
          }
          /* Ensure proper print layout */
          .print:overflow-visible {
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
              {coupleNames} • {activeConfig.size.label} ({widthMm}mm × {heightMm}mm)
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
            <h2 className="text-lg font-semibold mb-2">Select Insert Sizes, Captions & Quantities</h2>
            <div className="space-y-4">
              {insertConfigs.map((cfg, idx) => {
                const { widthMm: configWidth, heightMm: configHeight } = getActualDimensions(cfg);
                const photoUrl = photos[cfg.photoIndex] || '';
                return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveConfigIndex(idx)}
                          className={`text-sm font-semibold ${activeConfigIndex === idx ? 'text-rose-700' : 'text-slate-700 hover:text-rose-600'}`}
                        >
                          Insert {idx + 1}
                        </button>
                        <span className="text-xs text-slate-500">({configWidth}mm × {configHeight}mm)</span>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => setInsertConfigs(insertConfigs.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      <KeychainTypeSelector
                        selectedSize={cfg.size}
                        onSizeChange={(size) => {
                          const newConfigs = [...insertConfigs];
                          newConfigs[idx].size = size;
                          setInsertConfigs(newConfigs);
                        }}
                        customWidth={cfg.customWidth}
                        customHeight={cfg.customHeight}
                        onCustomWidthChange={(w) => {
                          const newConfigs = [...insertConfigs];
                          newConfigs[idx].customWidth = w;
                          setInsertConfigs(newConfigs);
                        }}
                        onCustomHeightChange={(h) => {
                          const newConfigs = [...insertConfigs];
                          newConfigs[idx].customHeight = h;
                          setInsertConfigs(newConfigs);
                        }}
                      />

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Caption
                          <input
                            type="text"
                            value={cfg.caption}
                            onChange={(e) => {
                              const newConfigs = [...insertConfigs];
                              newConfigs[idx].caption = e.target.value;
                              setInsertConfigs(newConfigs);
                            }}
                            placeholder="Caption"
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                            maxLength={30}
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Copies
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={cfg.copies}
                            onChange={(e) => {
                              const newConfigs = [...insertConfigs];
                              newConfigs[idx].copies = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                              setInsertConfigs(newConfigs);
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Photo
                          <select
                            value={cfg.photoIndex}
                            onChange={(e) => {
                              const newConfigs = [...insertConfigs];
                              newConfigs[idx].photoIndex = Number(e.target.value);
                              setInsertConfigs(newConfigs);
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          >
                            {photos.map((url: string, pidx: number) => (
                              <option key={pidx} value={pidx}>
                                Photo {pidx + 1}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      {/* Custom QR Section */}
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={cfg.useCustomQr}
                            onChange={(e) => {
                              const newConfigs = [...insertConfigs];
                              newConfigs[idx].useCustomQr = e.target.checked;
                              setInsertConfigs(newConfigs);
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                          />
                          <label className="text-sm font-semibold text-slate-800">Use Custom QR Code</label>
                        </div>

                        {cfg.useCustomQr && (
                          <div className="space-y-4">
                            {/* QR Design */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-slate-800">QR Code Design</h4>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newConfigs = [...insertConfigs];
                                    newConfigs[idx].qrDesign = {
                                      dotsColor: '#e11d48',
                                      backgroundColor: '#ffffff',
                                      cornersColor: '#e11d48',
                                      dotsType: 'rounded',
                                      cornersType: 'extra-rounded',
                                      cornersDotType: 'dot',
                                    };
                                    setInsertConfigs(newConfigs);
                                  }}
                                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                                >
                                  Reset
                                </button>
                              </div>

                              <div className="mb-4">
                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  QR Template
                                  <select
                                    value={cfg.qrPreset}
                                    onChange={(e) => {
                                      const selected = e.target.value as QrPreset;
                                      if (!(selected in QR_PRESETS)) return;
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrPreset: selected, qrDesign: { ...QR_PRESETS[selected] } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                                  >
                                    <option value="classic">Classic Black</option>
                                    <option value="modern">Modern Blue</option>
                                    <option value="minimal">Minimal Gray</option>
                                    <option value="elegant">Elegant Purple</option>
                                    <option value="bold">Bold Red</option>
                                  </select>
                                </label>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Dots Color
                                  <input
                                    type="color"
                                    value={cfg.qrDesign.dotsColor}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, dotsColor: e.target.value } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 h-8 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                  />
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Background Color
                                  <input
                                    type="color"
                                    value={cfg.qrDesign.backgroundColor}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, backgroundColor: e.target.value } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 h-8 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                  />
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Corners Color
                                  <input
                                    type="color"
                                    value={cfg.qrDesign.cornersColor}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, cornersColor: e.target.value } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 h-8 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                  />
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Dots Style
                                  <select
                                    value={cfg.qrDesign.dotsType}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, dotsType: e.target.value as any } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                                  >
                                    <option value="rounded">Rounded</option>
                                    <option value="dots">Dots</option>
                                    <option value="classy">Classy</option>
                                    <option value="classy-rounded">Classy Rounded</option>
                                    <option value="square">Square</option>
                                    <option value="extra-rounded">Extra Rounded</option>
                                  </select>
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Corners Style
                                  <select
                                    value={cfg.qrDesign.cornersType}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, cornersType: e.target.value as any } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                                  >
                                    <option value="square">Square</option>
                                    <option value="dot">Dot</option>
                                    <option value="extra-rounded">Extra Rounded</option>
                                  </select>
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Corner Dots Style
                                  <select
                                    value={cfg.qrDesign.cornersDotType}
                                    onChange={(e) => {
                                      const newConfigs = insertConfigs.map((config, i) =>
                                        i === idx
                                          ? { ...config, qrDesign: { ...config.qrDesign, cornersDotType: e.target.value as any } }
                                          : config
                                      );
                                      setInsertConfigs(newConfigs);
                                    }}
                                    className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                                  >
                                    <option value="dot">Dot</option>
                                    <option value="square">Square</option>
                                  </select>
                                </label>
                              </div>

                              <label className="flex flex-col text-sm font-semibold text-slate-800 mt-3">
                                Logo (optional)
                                <select
                                  value={cfg.qrDesign.logoUrl || ''}
                                  onChange={(e) => {
                                    const value = e.target.value || undefined;
                                    const newConfigs = insertConfigs.map((config, i) =>
                                      i === idx
                                        ? { ...config, qrDesign: { ...config.qrDesign, logoUrl: value } }
                                        : config
                                    );
                                    setInsertConfigs(newConfigs);
                                  }}
                                  className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                                >
                                  {QR_LOGO_OPTIONS.map((option) => (
                                    <option key={option.label} value={option.value || ''}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            <p className="text-xs text-slate-500">
                              Leave QR Image URL empty to auto-generate from data. Upload your QR image to a hosting service and paste the URL here.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-100 rounded-xl text-rose-700 font-medium hover:bg-rose-200"
                onClick={() => setInsertConfigs([
                  ...insertConfigs,
                  {
                    size: KEYCHAIN_SIZES[1],
                    customWidth: 50,
                    customHeight: 35,
                    caption: 'Scan our love story',
                    copies: 12,
                    photoIndex: 0,
                    useCustomQr: false,                    qrPreset: 'classic',                    qrDesign: {
                      dotsColor: '#e11d48',
                      backgroundColor: '#ffffff',
                      cornersColor: '#e11d48',
                      dotsType: 'rounded',
                      cornersType: 'extra-rounded',
                      cornersDotType: 'dot',
                    }
                  },
                ])}
              >
                Add Insert
              </button>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Print Options</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Pairs per row</label>
                    <select
                      value={pairsPerRow}
                      onChange={(e) => setPairsPerRow(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-slate-900"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">QR size preset</label>
                    <select
                      id="qr-scale-select"
                      value={qrScale}
                      onChange={(e) => setQrScale(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-slate-900"
                    >
                      <option value={0.97}>Small</option>
                      <option value={1}>Medium</option>
                      <option value={1.03}>Large</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Show print guides</label>
                    <input
                      type="checkbox"
                      checked={showGuides}
                      onChange={(e) => setShowGuides(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Full Print (maximize paper usage)</label>
                    <input
                      type="checkbox"
                      checked={fullPrint}
                      onChange={e => setFullPrint(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Auto-fit to page</label>
                    <input
                      type="checkbox"
                      checked={autoFit}
                      onChange={(e) => setAutoFit(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <button
                    onClick={handlePrint}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md"
                  >
                    Print Inserts
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center mt-3">
                  Tip: Use Ctrl+P (or Cmd+P on Mac) to print. <br />
                  Page 1 = QR codes • Page 2 = Photos
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Screen-only: Live Preview */}
            {activeWarning && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">{activeWarning}</p>
              </div>
            )}
            <KeychainInsertPreview
              widthMm={widthMm}
              heightMm={heightMm}
              shape={activeConfig.size.shape}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              coverPhotoUrl={activePhotoUrl}
              coupleNames={coupleNames}
              caption={activeConfig.caption}
              qrScale={qrScale}
              qrDesign={activeConfig.useCustomQr ? activeConfig.qrDesign : undefined}
            />

            {/* Screen-only: Print Sheet Preview container */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Print Sheet Preview</h3>
              {insertConfigs.map((cfg, idx) => {
                const { widthMm: cfgWidth, heightMm: cfgHeight } = getActualDimensions(cfg);
                const photoUrl = photos[cfg.photoIndex] || '';
                return <KeychainPrintSheet
                  key={idx}
                  widthMm={cfgWidth}
                  heightMm={cfgHeight}
                  shape={cfg.size.shape}
                  qrDataUrl={qrDataUrl}
                  qrCodeUrl={qrCodeUrl}
                  coverPhotoUrl={photoUrl}
                  coupleNames={coupleNames}
                  caption={cfg.caption}
                  copies={cfg.copies}
                  pairsPerRow={pairsPerRow}
                  showGuides={showGuides}
                  autoFit={autoFit}
                  qrScale={qrScale}
                  qrDesign={cfg.useCustomQr ? cfg.qrDesign : undefined}
                />;
              })}
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
          width: '100%',
        }}
      >
        {insertConfigs.map((cfg, idx) => {
          const { widthMm: cfgWidth, heightMm: cfgHeight } = getActualDimensions(cfg);
          const photoUrl = photos[cfg.photoIndex] || '';

          return (
            <KeychainPrintSheet
              key={idx}
              widthMm={cfgWidth}
              heightMm={cfgHeight}
              shape={cfg.size.shape}
              qrDataUrl={qrDataUrl}
              qrCodeUrl={qrCodeUrl}
              coverPhotoUrl={photoUrl}
              coupleNames={coupleNames}
              caption={cfg.caption}
              copies={cfg.copies}
              pairsPerRow={pairsPerRow}
              showGuides={showGuides}
              autoFit={autoFit}
              qrScale={qrScale}
              qrDesign={cfg.useCustomQr ? cfg.qrDesign : undefined}
            />
          );
        })}
              {insertConfigs.map((cfg, idx) => {
                const { widthMm: cfgWidth, heightMm: cfgHeight } = getActualDimensions(cfg);
                const photoUrl = photos[cfg.photoIndex] || '';
                return (
                  <KeychainPrintSheet
                    key={idx}
                    widthMm={cfgWidth}
                    heightMm={cfgHeight}
                    shape={cfg.size.shape}
                    qrDataUrl={qrDataUrl}
                    qrCodeUrl={qrCodeUrl}
                    coverPhotoUrl={photoUrl}
                    coupleNames={coupleNames}
                    caption={cfg.caption}
                    copies={cfg.copies}
                    pairsPerRow={pairsPerRow}
                    showGuides={showGuides}
                    autoFit={autoFit}
                    qrScale={qrScale}
                    qrDesign={cfg.useCustomQr ? cfg.qrDesign : undefined}
                    fullPrint={fullPrint}
                  />
                );
              })}
      </div>
    </>
  );
}
