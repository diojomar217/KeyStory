'use client';

import { useEffect, useMemo, useState, use } from 'react';
import KeychainTypeSelector from '@/components/product/KeychainTypeSelector';
import KeychainInsertPreview from '@/components/product/KeychainInsertPreview';
import KeychainPrintSheet from '@/components/product/KeychainPrintSheet';
import { Site } from '@/lib/supabase';
import { getSite } from '@/lib/api/sites';
import { KeychainSize, KEYCHAIN_SIZES, findKeychainSize } from '@/components/product/KeychainSizeConfig';
import {
  createDefaultPhotoTransform,
  duplicateConfig,
  PhotoTransform,
  QrPreset,
  QR_LOGO_OPTIONS,
  QR_PRESETS,
  SharedQrDesign,
  validateScanability,
} from '@/components/product/print-builder-shared';
import {
  PRODUCT_EXPANSION_PRESETS,
  getProductExpansionPreset,
  type ProductExpansionPreset,
} from '@/config/productExpansion';

interface PageProps {
  params: Promise<{ id: string }>;
}

type InsertConfig = {
  productPresetId: ProductExpansionPreset['id'];
  size: KeychainSize;
  customWidth: number;
  customHeight: number;
  caption: string;
  subtitle: string;
  copies: number;
  photoIndex: number;
  photoTransform: PhotoTransform;
  sheetMode: 'front-back-pair' | 'qr-only';
  backSideVariant: 'photo' | 'engraved';
  useCustomQr: boolean;
  qrPreset: QrPreset;
  qrDesign: SharedQrDesign;
};

const buildInsertConfigFromPreset = (presetId: ProductExpansionPreset['id']): InsertConfig => {
  const preset = getProductExpansionPreset(presetId) || PRODUCT_EXPANSION_PRESETS[0];
  const size = findKeychainSize(preset.sizeLabel) || KEYCHAIN_SIZES[1];

  return {
    productPresetId: preset.id,
    size,
    customWidth: size.width_mm || 35,
    customHeight: size.height_mm || 50,
    caption: preset.defaultCaption,
    subtitle: preset.defaultSubtitle,
    copies: preset.defaultCopies,
    photoIndex: 0,
    photoTransform: createDefaultPhotoTransform(),
    sheetMode: preset.sheetMode,
    backSideVariant: preset.backSideVariant,
    useCustomQr: false,
    qrPreset: 'classic',
    qrDesign: {
      dotsColor: '#e11d48',
      backgroundColor: '#ffffff',
      cornersColor: '#e11d48',
      dotsType: 'rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      logoUrl: '/heart-icon.svg',
    },
  };
};

export default function KeychainPrintPage({ params }: PageProps) {
  const { id } = use(params);

  const [order, setOrder] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [insertConfigs, setInsertConfigs] = useState<InsertConfig[]>([buildInsertConfigFromPreset('nfc_keychain')]);
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [pairsPerRow, setPairsPerRow] = useState(2);
  const [showGuides, setShowGuides] = useState(true);
  const [qrScale, setQrScale] = useState(1);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const site = await getSite(id);
      if (site) {
        setOrder(site as Site);
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

  const getActualDimensions = (config: {
    size: KeychainSize;
    customWidth: number;
    customHeight: number;
  }) => {
    if (config.size.label === 'Custom Size') {
      return { widthMm: config.customWidth, heightMm: config.customHeight };
    }
    return { widthMm: config.size.width_mm, heightMm: config.size.height_mm };
  };

  const updateInsertConfig = (index: number, updater: (config: InsertConfig) => InsertConfig) => {
    setInsertConfigs((prev) => prev.map((cfg, i) => (i === index ? updater(cfg) : cfg)));
  };

  const applyProductPreset = (index: number, presetId: ProductExpansionPreset['id']) => {
    const presetConfig = buildInsertConfigFromPreset(presetId);
    updateInsertConfig(index, (prev) => ({
      ...prev,
      productPresetId: presetConfig.productPresetId,
      size: presetConfig.size,
      customWidth: presetConfig.customWidth,
      customHeight: presetConfig.customHeight,
      caption: presetConfig.caption,
      subtitle: presetConfig.subtitle,
      copies: presetConfig.copies,
      sheetMode: presetConfig.sheetMode,
      backSideVariant: presetConfig.backSideVariant,
    }));
  };

  const removeInsertConfig = (index: number) => {
    setInsertConfigs((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });

    setActiveConfigIndex((prev) => {
      if (insertConfigs.length <= 1) return 0;
      if (prev > index) return prev - 1;
      if (prev === index) return Math.max(0, prev - 1);
      return prev;
    });
  };

  const duplicateInsertConfig = (index: number) => {
    const configToDuplicate = insertConfigs[index];
    if (!configToDuplicate) return;

    const duplicated = duplicateConfig(configToDuplicate);

    setInsertConfigs((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });

    setActiveConfigIndex(index + 1);
  };

  const resetPhotoTransform = (index: number) => {
    updateInsertConfig(index, (prev) => ({
      ...prev,
      photoTransform: createDefaultPhotoTransform(),
    }));
  };

  const config = order?.config || {};
  const customerName = config?.people?.primary || order?.customer_name || 'Your Name';
  const partnerName = config?.people?.secondary || order?.partner_name || 'Partner Name';
  const coupleNames = `${customerName} & ${partnerName}`;

  const photos = Array.isArray(config?.media?.photos) ? config.media.photos : order?.photos || [];
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

  const activeConfig = insertConfigs[activeConfigIndex] ?? insertConfigs[0];
  const { widthMm, heightMm } = activeConfig
    ? getActualDimensions(activeConfig)
    : { widthMm: 35, heightMm: 50 };

  const activePhotoUrl = photos[activeConfig?.photoIndex ?? 0] || '';

  const activeWarning =
    activeConfig?.useCustomQr
      ? validateScanability(
          activeConfig.qrDesign.dotsColor,
          activeConfig.qrDesign.backgroundColor
        )
      : null;

  const estimatedSummary = useMemo(() => {
    if (!activeConfig) {
      return {
        pairWidthMm: 0,
        estimatedPairsPerRow: 0,
        estimatedRowsPerPage: 0,
        estimatedPairsPerPage: 0,
      };
    }

    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const outerMarginMm = 2;
    const horizontalGapMm = 0.8;
    const verticalGapMm = 0.8;

    const usableWidthMm = pageWidthMm - outerMarginMm * 2;
    const usableHeightMm = pageHeightMm - outerMarginMm * 2;

    const pairWidthMm = activeConfig.sheetMode === 'qr-only' ? widthMm : widthMm * 2;
    const estimatedPairsPerRow = Math.max(
      1,
      Math.min(
        pairsPerRow,
        Math.floor((usableWidthMm + horizontalGapMm) / (pairWidthMm + horizontalGapMm))
      )
    );

    const estimatedRowsPerPage = Math.max(
      1,
      Math.floor((usableHeightMm + verticalGapMm) / (heightMm + verticalGapMm))
    );

    return {
      pairWidthMm,
      estimatedPairsPerRow,
      estimatedRowsPerPage,
      estimatedPairsPerPage: estimatedPairsPerRow * estimatedRowsPerPage,
    };
  }, [activeConfig, widthMm, heightMm, pairsPerRow]);

  const totalCopiesAcrossConfigs = insertConfigs.reduce((sum, cfg) => sum + cfg.copies, 0);

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

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 2mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: auto !important;
            height: auto !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          #__next {
            width: 210mm !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
            background: #ffffff !important;
          }

          #__next,
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: auto !important;
            height: auto !important;
            background: #ffffff !important;
            overflow: visible !important;
            max-height: none !important;
          }

          .h-screen,
          .min-h-screen,
          .overflow-hidden,
          .overflow-y-auto,
          .overflow-x-auto {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .max-w-7xl {
            max-width: none !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print\\:hidden,
          nav,
          aside,
          header,
          button,
          input,
          select,
          textarea,
          a.no-print {
            display: none !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print-root {
            display: block !important;
            width: 210mm !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            max-height: none !important;
          }
        }
      `}</style>

      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Print Maker</h1>
            
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/admin/websites/${id}/qr-card`}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              &larr; QR Card
            </a>
            <a href="/admin/websites" className="text-slate-600 hover:text-slate-700 font-medium">
              Back to Websites
            </a>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg font-semibold mb-2">Select Product Formats, Captions & Quantities</h2>

            <div className="space-y-4">
              {insertConfigs.map((cfg, idx) => {
                const { widthMm: configWidth, heightMm: configHeight } = getActualDimensions(cfg);

                return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveConfigIndex(idx)}
                          className={`text-sm font-semibold ${
                            activeConfigIndex === idx
                              ? 'text-rose-700'
                              : 'text-slate-700 hover:text-rose-600'
                          }`}
                        >
                          Insert {idx + 1}
                        </button>
                        <span className="text-xs text-slate-500">
                          ({configWidth}mm x {configHeight}mm)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-sky-600 hover:text-sky-700 text-sm"
                          onClick={() => duplicateInsertConfig(idx)}
                        >
                          Duplicate
                        </button>

                        <button
                          type="button"
                          className={`text-sm ${
                            insertConfigs.length <= 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          onClick={() => removeInsertConfig(idx)}
                          disabled={insertConfigs.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Product preset
                          <select
                            value={cfg.productPresetId}
                            onChange={(e) => applyProductPreset(idx, e.target.value as ProductExpansionPreset['id'])}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          >
                            {PRODUCT_EXPANSION_PRESETS.map((preset) => (
                              <option key={preset.id} value={preset.id}>
                                {preset.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p className="mt-2 text-xs text-slate-500">
                          {getProductExpansionPreset(cfg.productPresetId)?.description}
                        </p>
                      </div>

                      <KeychainTypeSelector
                        selectedSize={cfg.size}
                        onSizeChange={(size) => {
                          updateInsertConfig(idx, (prev) => ({ ...prev, size }));
                        }}
                        customWidth={cfg.customWidth}
                        customHeight={cfg.customHeight}
                        onCustomWidthChange={(w) => {
                          updateInsertConfig(idx, (prev) => ({ ...prev, customWidth: w }));
                        }}
                        onCustomHeightChange={(h) => {
                          updateInsertConfig(idx, (prev) => ({ ...prev, customHeight: h }));
                        }}
                      />

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Caption
                          <input
                            type="text"
                            value={cfg.caption}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                caption: e.target.value,
                              }));
                            }}
                            placeholder="Caption"
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                            maxLength={30}
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Back-side note
                          <input
                            type="text"
                            value={cfg.subtitle}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                subtitle: e.target.value,
                              }));
                            }}
                            placeholder="Back-side note"
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                            maxLength={60}
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Sheet mode
                          <select
                            value={cfg.sheetMode}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                sheetMode: e.target.value as InsertConfig['sheetMode'],
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          >
                            <option value="front-back-pair">Front + back pair</option>
                            <option value="qr-only">QR-only sheet</option>
                          </select>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Back side style
                          <select
                            value={cfg.backSideVariant}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                backSideVariant: e.target.value as InsertConfig['backSideVariant'],
                              }));
                            }}
                            disabled={cfg.sheetMode === 'qr-only'}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 disabled:bg-slate-100"
                          >
                            <option value="photo">Photo back</option>
                            <option value="engraved">Engraved back</option>
                          </select>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Copies
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={cfg.copies}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                copies: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)),
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Photo
                          <select
                            value={cfg.photoIndex}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                photoIndex: Number(e.target.value),
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          >
                            {photos.map((_: string, pidx: number) => (
                              <option key={pidx} value={pidx}>
                                Photo {pidx + 1}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-800">Photo Position</h4>
                          <button
                            type="button"
                            className="text-xs text-slate-500 hover:text-slate-700 underline"
                            onClick={() => resetPhotoTransform(idx)}
                          >
                            Reset
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3">
                          <label className="flex flex-col text-sm font-semibold text-slate-800">
                            Zoom
                            <input
                              type="range"
                              min="1"
                              max="2.2"
                              step="0.01"
                              value={cfg.photoTransform.zoom}
                              onChange={(e) => {
                                updateInsertConfig(idx, (prev) => ({
                                  ...prev,
                                  photoTransform: {
                                    ...prev.photoTransform,
                                    zoom: Number(e.target.value),
                                  },
                                }));
                              }}
                              className="mt-2"
                            />
                            <span className="mt-1 text-xs font-normal text-slate-500">
                              {cfg.photoTransform.zoom.toFixed(2)}x
                            </span>
                          </label>

                          <label className="flex flex-col text-sm font-semibold text-slate-800">
                            Move Left / Right
                            <input
                              type="range"
                              min="-40"
                              max="40"
                              step="1"
                              value={cfg.photoTransform.offsetX}
                              onChange={(e) => {
                                updateInsertConfig(idx, (prev) => ({
                                  ...prev,
                                  photoTransform: {
                                    ...prev.photoTransform,
                                    offsetX: Number(e.target.value),
                                  },
                                }));
                              }}
                              className="mt-2"
                            />
                            <span className="mt-1 text-xs font-normal text-slate-500">
                              {cfg.photoTransform.offsetX > 0 ? '+' : ''}
                              {cfg.photoTransform.offsetX}
                            </span>
                          </label>

                          <label className="flex flex-col text-sm font-semibold text-slate-800">
                            Move Up / Down
                            <input
                              type="range"
                              min="-40"
                              max="40"
                              step="1"
                              value={cfg.photoTransform.offsetY}
                              onChange={(e) => {
                                updateInsertConfig(idx, (prev) => ({
                                  ...prev,
                                  photoTransform: {
                                    ...prev.photoTransform,
                                    offsetY: Number(e.target.value),
                                  },
                                }));
                              }}
                              className="mt-2"
                            />
                            <span className="mt-1 text-xs font-normal text-slate-500">
                              {cfg.photoTransform.offsetY > 0 ? '+' : ''}
                              {cfg.photoTransform.offsetY}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={cfg.useCustomQr}
                            onChange={(e) => {
                              updateInsertConfig(idx, (prev) => ({
                                ...prev,
                                useCustomQr: e.target.checked,
                              }));
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                          />
                          <label className="text-sm font-semibold text-slate-800">
                            Use Custom QR Code
                          </label>
                        </div>

                        {cfg.useCustomQr && (
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-slate-800">QR Code Design</h4>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateInsertConfig(idx, (prev) => ({
                                      ...prev,
                                      qrDesign: {
                                        dotsColor: '#e11d48',
                                        backgroundColor: '#ffffff',
                                        cornersColor: '#e11d48',
                                        dotsType: 'rounded',
                                        cornersType: 'extra-rounded',
                                        cornersDotType: 'dot',
                                        logoUrl: '/heart-icon.svg',
                                      },
                                    }));
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

                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrPreset: selected,
                                        qrDesign: { ...QR_PRESETS[selected] },
                                      }));
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
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          dotsColor: e.target.value,
                                        },
                                      }));
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
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          backgroundColor: e.target.value,
                                        },
                                      }));
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
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          cornersColor: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="mt-1 border rounded px-2 py-1 h-8 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                  />
                                </label>

                                <label className="flex flex-col text-sm font-semibold text-slate-800">
                                  Dots Style
                                  <select
                                    value={cfg.qrDesign.dotsType}
                                    onChange={(e) => {
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          dotsType: e.target.value as SharedQrDesign['dotsType'],
                                        },
                                      }));
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
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          cornersType: e.target.value as SharedQrDesign['cornersType'],
                                        },
                                      }));
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
                                      updateInsertConfig(idx, (prev) => ({
                                        ...prev,
                                        qrDesign: {
                                          ...prev.qrDesign,
                                          cornersDotType: e.target.value as SharedQrDesign['cornersDotType'],
                                        },
                                      }));
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
                                    updateInsertConfig(idx, (prev) => ({
                                      ...prev,
                                      qrDesign: {
                                        ...prev.qrDesign,
                                        logoUrl: value,
                                      },
                                    }));
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
                              Leave QR Image URL empty to auto-generate from data.
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
                onClick={() => {
                  setInsertConfigs((prev) => [...prev, buildInsertConfigFromPreset('wallet_insert')]);
                  setActiveConfigIndex(insertConfigs.length);
                }}
              >
                Add Insert
              </button>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Print Options</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Simple and reliable settings for clean A4 printing.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">
                      {activeConfig.sheetMode === 'qr-only' ? 'Pieces per row' : 'Pairs per row'}
                    </label>
                    <select
                      value={pairsPerRow}
                      onChange={(e) => setPairsPerRow(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-slate-900"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
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

                  <button
                    onClick={handlePrint}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md"
                  >
                    Print Inserts
                  </button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Estimated Layout</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Pair width</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.pairWidthMm.toFixed(1)} mm
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Pairs / row</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedPairsPerRow}
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Rows / page</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedRowsPerPage}
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Pairs / page</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedPairsPerPage}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    Total copies across all inserts: <strong>{totalCopiesAcrossConfigs}</strong>
                  </p>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Tip: Use printer setting <strong>Actual Size</strong> or <strong>100%</strong>.
                  <br />
                  Avoid browser options like Fit to Printable Area.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
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
              sheetMode={activeConfig.sheetMode}
              backSideVariant={activeConfig.backSideVariant}
              backSideSubtitle={activeConfig.subtitle}
              printModeLabel={getProductExpansionPreset(activeConfig.productPresetId)?.label}
              qrScale={qrScale}
              qrDesign={activeConfig.useCustomQr ? activeConfig.qrDesign : undefined}
              photoTransform={activeConfig.photoTransform}
            />

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Print Sheet Preview</h3>

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
                    sheetMode={cfg.sheetMode}
                    backSideVariant={cfg.backSideVariant}
                    backSideSubtitle={cfg.subtitle}
                    qrScale={qrScale}
                    qrDesign={cfg.useCustomQr ? cfg.qrDesign : undefined}
                    photoTransform={cfg.photoTransform}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden print:block print-root">
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
              sheetMode={cfg.sheetMode}
              backSideVariant={cfg.backSideVariant}
              backSideSubtitle={cfg.subtitle}
              qrScale={qrScale}
              qrDesign={cfg.useCustomQr ? cfg.qrDesign : undefined}
              photoTransform={cfg.photoTransform}
            />
          );
        })}
      </div>
    </>
  );
}
