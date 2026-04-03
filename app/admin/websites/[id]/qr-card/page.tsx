'use client';

import { useEffect, useMemo, useState, use } from 'react';
import { DEFAULT_THEME } from '@/config/defaults';
import { Site } from '@/lib/supabase';
import { getSite, updateSite } from '@/lib/api/sites';
import type { ThemeKey } from '@/config/themeConfig';
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
  cx,
  FieldLabel,
  PhotoTransformControls,
  SectionCard,
  SegmentedButton,
} from '@/components/product/BuilderUI';
import { QrKeepsakeCard, QrCardStyle, QrVisualDesign } from '@/components/qr/QrKeepsakeCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

type CardPrintConfig = {
  cardStyle: QrCardStyle;
  cardSize: 'small' | 'large';
  title: string;
  subtitle: string;
  showNames: boolean;
  copies: number;
  photoIndex: number;
  photoTransform: PhotoTransform;
  useCustomQr: boolean;
  qrPreset: QrPreset;
  qrDesign: SharedQrDesign;
};

function getCardSizeMm(cardSize: 'small' | 'large') {
  return cardSize === 'small'
    ? { widthMm: 55, heightMm: 40 }
    : { widthMm: 62, heightMm: 41 };
}

function QrCardPrintSheet({
  config,
  cardsPerRow,
  cardGapMm,
  showGuides,
  customerName,
  partnerName,
  qrDataUrl,
  photoUrl,
}: any) {
  const items = Array.from({ length: config.copies });

  const guideInsetMm = showGuides ? 0.5 : 0;
  const guideLenMm = 2.5;

  return (
    <div
      className="grid justify-center"
      style={{
        gridTemplateColumns: `repeat(${cardsPerRow}, max-content)`,
        gap: `${Math.max(1.2, cardGapMm)}mm`,
      }}
    >
      {items.map((_: any, idx: number) => (
        <div
          key={idx}
          className="relative"
          style={{
            padding: showGuides ? `${guideInsetMm}mm` : 0,
          }}
        >
          {showGuides && (
            <>
              {/* CUTLINES */}
              {['tl','tr','bl','br'].map((pos, i) => {
                const s: any = {
                  position: 'absolute',
                  width: `${guideLenMm}mm`,
                  height: `${guideLenMm}mm`,
                };

                if (pos === 'tl') {
                  s.top = 0; s.left = 0;
                  s.borderTop = '1px solid black';
                  s.borderLeft = '1px solid black';
                }
                if (pos === 'tr') {
                  s.top = 0; s.right = 0;
                  s.borderTop = '1px solid black';
                  s.borderRight = '1px solid black';
                }
                if (pos === 'bl') {
                  s.bottom = 0; s.left = 0;
                  s.borderBottom = '1px solid black';
                  s.borderLeft = '1px solid black';
                }
                if (pos === 'br') {
                  s.bottom = 0; s.right = 0;
                  s.borderBottom = '1px solid black';
                  s.borderRight = '1px solid black';
                }

                return <span key={i} style={s} />;
              })}
            </>
          )}

          <QrKeepsakeCard
            customerName={customerName}
            partnerName={partnerName}
            qrDataUrl={qrDataUrl}
            config={config}
            cardSize={config.cardSize}
            photoUrl={photoUrl}
            photoTransform={config.photoTransform}
          />
        </div>
      ))}
    </div>
  );
}

export default function QRCardPage({ params }: PageProps) {
  const { id } = use(params);

  const createDefaultCardConfig = (): CardPrintConfig => ({
    cardStyle: 'love_card',
    cardSize: 'large',
    title: 'Scan our love story ❤️',
    subtitle: 'Our digital keepsake',
    showNames: true,
    copies: 6,
    photoIndex: 0,
    photoTransform: createDefaultPhotoTransform(),
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
  });

  const [order, setOrder] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cardConfigs, setCardConfigs] = useState<CardPrintConfig[]>([createDefaultCardConfig()]);
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);

  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [showGuides, setShowGuides] = useState(true);
  const [cardGapMm, setCardGapMm] = useState(4);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const siteData = await getSite(id);

      if (siteData) {
        setOrder(siteData);

        const incomingQr = siteData.config?.qr || {};
        const initial = createDefaultCardConfig();

        setCardConfigs([
          {
            ...initial,
            cardStyle:
              incomingQr.cardStyle ||
              (siteData.site_type === 'birthday' ? 'birthday_card' : 'love_card'),
            title:
              incomingQr.title ||
              (siteData.site_type === 'birthday'
                ? 'Scan the birthday surprise 🎉'
                : 'Scan our love story ❤️'),
            subtitle: incomingQr.subtitle || 'Our digital keepsake',
            showNames:
              typeof incomingQr.showNames === 'boolean'
                ? incomingQr.showNames
                : siteData.site_type !== 'birthday',
            qrDesign: {
              ...initial.qrDesign,
              ...(incomingQr.qrDesign || {}),
            },
          },
        ]);
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

  const updateCardConfig = (index: number, updater: (config: CardPrintConfig) => CardPrintConfig) => {
    setCardConfigs((prev) => prev.map((cfg, i) => (i === index ? updater(cfg) : cfg)));
  };

  const duplicateCardConfig = (index: number) => {
    const configToDuplicate = cardConfigs[index];
    if (!configToDuplicate) return;

    const duplicated = duplicateConfig(configToDuplicate);

    setCardConfigs((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });

    setActiveConfigIndex(index + 1);
  };

  const removeCardConfig = (index: number) => {
    setCardConfigs((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });

    setActiveConfigIndex((prev) => {
      if (cardConfigs.length <= 1) return 0;
      if (prev > index) return prev - 1;
      if (prev === index) return Math.max(0, prev - 1);
      return prev;
    });
  };

  const resetPhotoTransform = (index: number) => {
    updateCardConfig(index, (prev) => ({
      ...prev,
      photoTransform: createDefaultPhotoTransform(),
    }));
  };

  const handleSave = async () => {
    if (!order?.id) return;

    setIsSaving(true);
    setSaveMsg(null);

    try {
      const activeCard = cardConfigs[activeConfigIndex] ?? cardConfigs[0];

      const qrToSave = {
        title: activeCard.title,
        subtitle: activeCard.subtitle,
        showNames: activeCard.showNames,
        cardStyle: activeCard.cardStyle,
        qrDesign: activeCard.useCustomQr ? activeCard.qrDesign : undefined,
      };

      const updatedConfig = { ...order.config, qr: qrToSave };

      const data = await updateSite({
        id: order.id,
        config: updatedConfig,
        website_name: order.website_name,
        site_type: order.site_type,
        status: order.status,
      });

      if (!data?.success) {
        throw new Error(data.message || 'Unable to save');
      }

      setOrder((prev) => (prev ? { ...prev, config: updatedConfig } : prev));
      setSaveMsg('Saved successfully.');
    } catch (err) {
      console.error(err);
      setSaveMsg('Save failed.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeConfig = cardConfigs[activeConfigIndex] ?? cardConfigs[0];

  const config = order?.config || {};
  const theme: ThemeKey = (config.theme as ThemeKey) || DEFAULT_THEME;
  const customerName = config?.people?.primary || order?.customer_name || 'Your Name';
  const partnerName = config?.people?.secondary || order?.partner_name || 'Partner Name';
  const coupleNames = `${customerName} & ${partnerName}`;

  const photos = Array.isArray(config?.media?.photos) ? config.media.photos : [];
  const websiteUrl = order?.website_name
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${order.website_name}`
    : undefined;

  const qrRedirectUrl = order?.website_name
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${order.website_name}`
    : undefined;

  const qrDataUrl =
    typeof config.qr_data_url === 'string' && config.qr_data_url.trim() !== ''
      ? config.qr_data_url
      : qrRedirectUrl || websiteUrl;

  const qrCodeUrl = order?.qr_code_url;
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
        cardWidthMm: 0,
        cardHeightMm: 0,
        estimatedCardsPerRow: 0,
        estimatedRowsPerPage: 0,
        estimatedCardsPerPage: 0,
      };
    }

    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const outerMarginMm = 8;
    const usableWidthMm = pageWidthMm - outerMarginMm * 2;
    const usableHeightMm = pageHeightMm - outerMarginMm * 2;

    const { widthMm, heightMm } = getCardSizeMm(activeConfig.cardSize);

    const estimatedCardsPerRow = Math.max(
      1,
      Math.min(cardsPerRow, Math.floor((usableWidthMm + cardGapMm) / (widthMm + cardGapMm)))
    );

    const estimatedRowsPerPage = Math.max(
      1,
      Math.floor((usableHeightMm + cardGapMm) / (heightMm + cardGapMm))
    );

    return {
      cardWidthMm: widthMm,
      cardHeightMm: heightMm,
      estimatedCardsPerRow,
      estimatedRowsPerPage,
      estimatedCardsPerPage: estimatedCardsPerRow * estimatedRowsPerPage,
    };
  }, [activeConfig, cardsPerRow, cardGapMm]);

  const totalCopiesAcrossConfigs = cardConfigs.reduce((sum, cfg) => sum + cfg.copies, 0);

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
            margin: 8mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
            background: #ffffff !important;
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

          .qr-print-root {
            display: block !important;
            width: 100% !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .qr-print-page-break {
            break-after: page;
            page-break-after: always;
          }

          .qr-print-sheet {
            margin-bottom: 8mm;
          }
        }
      `}</style>

      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">QR Card Print Maker</h1>
            <p className="text-slate-500 mt-1">
              {coupleNames} • {activeConfig.cardStyle.replace('_', ' ')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/admin/websites/${id}/insert-print`}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              ← Insert Print Studio
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
            <h2 className="text-lg font-semibold mb-2">Select Card Designs, Copies & QR Style</h2>

            <div className="space-y-4">
              {cardConfigs.map((cfg, idx) => {
                const { widthMm, heightMm } = getCardSizeMm(cfg.cardSize);

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
                          Card {idx + 1}
                        </button>
                        <span className="text-xs text-slate-500">
                          ({widthMm}mm × {heightMm}mm)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-sky-600 hover:text-sky-700 text-sm"
                          onClick={() => duplicateCardConfig(idx)}
                        >
                          Duplicate
                        </button>

                        <button
                          type="button"
                          className={`text-sm ${
                            cardConfigs.length <= 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          onClick={() => removeCardConfig(idx)}
                          disabled={cardConfigs.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Card Style
                          <select
                            value={cfg.cardStyle}
                            onChange={(e) => {
                              updateCardConfig(idx, (prev) => ({
                                ...prev,
                                cardStyle: e.target.value as QrCardStyle,
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                          >
                            <option value="love_card">Love Card</option>
                            <option value="birthday_card">Birthday Card</option>
                            <option value="minimal_card">Minimal Card</option>
                            <option value="polaroid">Polaroid</option>
                            <option value="none">Plain</option>
                          </select>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Card Size
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <SegmentedButton
                              active={cfg.cardSize === 'small'}
                              label="Small"
                              sublabel="5.5 × 4"
                              onClick={() =>
                                updateCardConfig(idx, (prev) => ({ ...prev, cardSize: 'small' }))
                              }
                            />
                            <SegmentedButton
                              active={cfg.cardSize === 'large'}
                              label="Large"
                              sublabel="6.2 × 4.1"
                              onClick={() =>
                                updateCardConfig(idx, (prev) => ({ ...prev, cardSize: 'large' }))
                              }
                            />
                          </div>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Title
                          <input
                            type="text"
                            value={cfg.title}
                            onChange={(e) => {
                              updateCardConfig(idx, (prev) => ({
                                ...prev,
                                title: e.target.value,
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                            maxLength={50}
                          />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-slate-800">
                          Subtitle
                          <input
                            type="text"
                            value={cfg.subtitle}
                            onChange={(e) => {
                              updateCardConfig(idx, (prev) => ({
                                ...prev,
                                subtitle: e.target.value,
                              }));
                            }}
                            className="mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
                            maxLength={50}
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
                              updateCardConfig(idx, (prev) => ({
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
                              updateCardConfig(idx, (prev) => ({
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

                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={cfg.showNames}
                          onChange={(e) => {
                            updateCardConfig(idx, (prev) => ({
                              ...prev,
                              showNames: e.target.checked,
                            }));
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        Show couple names
                      </label>

                      <PhotoTransformControls
                        zoom={cfg.photoTransform.zoom}
                        offsetX={cfg.photoTransform.offsetX}
                        offsetY={cfg.photoTransform.offsetY}
                        onZoomChange={(value) =>
                          updateCardConfig(idx, (prev) => ({
                            ...prev,
                            photoTransform: { ...prev.photoTransform, zoom: value },
                          }))
                        }
                        onOffsetXChange={(value) =>
                          updateCardConfig(idx, (prev) => ({
                            ...prev,
                            photoTransform: { ...prev.photoTransform, offsetX: value },
                          }))
                        }
                        onOffsetYChange={(value) =>
                          updateCardConfig(idx, (prev) => ({
                            ...prev,
                            photoTransform: { ...prev.photoTransform, offsetY: value },
                          }))
                        }
                        onReset={() => resetPhotoTransform(idx)}
                      />

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={cfg.useCustomQr}
                            onChange={(e) => {
                              updateCardConfig(idx, (prev) => ({
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
                                    updateCardConfig(idx, (prev) => ({
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

                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                      updateCardConfig(idx, (prev) => ({
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
                                    updateCardConfig(idx, (prev) => ({
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
                              Test scan first if you use light colors or decorative presets.
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
                  setCardConfigs((prev) => [...prev, createDefaultCardConfig()]);
                  setActiveConfigIndex(cardConfigs.length);
                }}
              >
                Add Card Design
              </button>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Print Options</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Same print-style workflow as your keychain editor.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Cards per row</label>
                    <select
                      value={cardsPerRow}
                      onChange={(e) => setCardsPerRow(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-slate-900"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-slate-700">Gap</label>
                    <select
                      value={cardGapMm}
                      onChange={(e) => setCardGapMm(Number(e.target.value))}
                      className="border rounded px-2 py-1 text-slate-900"
                    >
                      <option value={2}>2 mm</option>
                      <option value={3}>3 mm</option>
                      <option value={4}>4 mm</option>
                      <option value={5}>5 mm</option>
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
                    Print Cards
                  </button>

                 

                  {saveMsg ? (
                    <div
                      className={cx(
                        'rounded-lg border px-4 py-3 text-sm font-semibold',
                        saveMsg.includes('success')
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                      )}
                    >
                      {saveMsg}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Estimated Layout</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Card size</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.cardWidthMm} × {estimatedSummary.cardHeightMm} mm
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Cards / row</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedCardsPerRow}
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Rows / page</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedRowsPerPage}
                      </p>
                    </div>

                    <div className="rounded-md bg-white border border-slate-200 px-3 py-2">
                      <p className="text-slate-500">Cards / page</p>
                      <p className="font-semibold text-slate-900">
                        {estimatedSummary.estimatedCardsPerPage}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    Total copies across all card designs: <strong>{totalCopiesAcrossConfigs}</strong>
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

            <SectionCard title="Live Preview" subtitle="Preview the active QR card design.">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-center overflow-x-auto overflow-y-visible">
                  <div className="shrink-0">
                    <QrKeepsakeCard
                      theme={theme}
                      siteType={order.site_type as 'couple' | 'birthday' | string}
                      customerName={customerName}
                      partnerName={partnerName}
                      qrDataUrl={qrDataUrl}
                      qrCodeUrl={qrCodeUrl}
                      slug={order.website_name || order.slug}
                      config={{
                        title: activeConfig.title,
                        subtitle: activeConfig.subtitle,
                        showNames: activeConfig.showNames,
                        cardStyle: activeConfig.cardStyle,
                        qrDesign: activeConfig.useCustomQr ? (activeConfig.qrDesign as QrVisualDesign) : undefined,
                      }}
                      cardSize={activeConfig.cardSize}
                      photoUrl={activePhotoUrl}
                      photoTransform={activeConfig.photoTransform}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Print Sheet Preview" subtitle="Preview all cards as they will be repeated on paper.">
              <div className="space-y-8">
                {cardConfigs.map((cfg, idx) => {
                  const photoUrl = photos[cfg.photoIndex] || '';

                  return (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">Card Design {idx + 1}</h4>
                          <p className="text-xs text-slate-500">
                            {cfg.cardStyle.replace('_', ' ')} • {cfg.copies} copies
                          </p>
                        </div>
                      </div>

                      <QrCardPrintSheet
                        config={cfg}
                        cardsPerRow={cardsPerRow}
                        cardGapMm={cardGapMm}
                        showGuides={showGuides}
                        customerName={customerName}
                        partnerName={partnerName}
                        qrDataUrl={qrDataUrl}
                        qrCodeUrl={qrCodeUrl}
                        photoUrl={photoUrl}
                      />
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <div className="hidden print:block qr-print-root">
        {cardConfigs.map((cfg, idx) => {
          const photoUrl = photos[cfg.photoIndex] || '';

          return (
            <div
              key={idx}
              className={idx < cardConfigs.length - 1 ? 'qr-print-page-break qr-print-sheet' : 'qr-print-sheet'}
            >
              <QrCardPrintSheet
                config={cfg}
                cardsPerRow={cardsPerRow}
                cardGapMm={cardGapMm}
                showGuides={showGuides}
                customerName={customerName}
                partnerName={partnerName}
                qrDataUrl={qrDataUrl}
                qrCodeUrl={qrCodeUrl}
                photoUrl={photoUrl}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}