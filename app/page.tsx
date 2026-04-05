'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Playfair_Display, Sora } from 'next/font/google';
import KeychainInsertPreview from '@/components/product/KeychainInsertPreview';
import TemplateSelector from '@/components/templates/TemplateSelector';
import { STARTER_TEMPLATES, getTemplatesByOccasion } from '@/components/templates/templateData';
import { OccasionType, Participant } from '@/lib/types';
import { OCCASION_REGISTRY } from '@/lib/occasion-registry';
import { PRODUCT_EXPANSION_PRESETS } from '@/config/productExpansion';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

interface FormPreviewState {
  website_name: string;
  coupleNames: string;
  coverPhotoPreviewUrl?: string;
  occasion: OccasionType;
  participants: Participant[];
  photosPreview: string[];
}

interface OrderResult {
  slug: string;
  url: string;
  qrCodeUrl: string;
}

type PublicBusinessLinks = {
  whatsappNumber: string | null;
  messengerUsername: string | null;
  messengerUrl: string | null;
  shopeeStoreUrl: string;
  tiktokShopUrl: string;
  lazadaStoreUrl: string;
  facebookPageUrl: string | null;
  instagramUrl: string | null;
};

const DEFAULT_SHOPEE_URL = 'https://shopee.ph/';
const DEFAULT_TIKTOK_URL = 'https://www.tiktok.com/';
const DEFAULT_LAZADA_URL = 'https://www.lazada.com.ph/';
const SAMPLE_WEBSITES = [
  { occasion: 'Couple', url: '#', status: 'Live Soon' },
  { occasion: 'Wedding', url: '#', status: 'Live Soon' },
  { occasion: 'Birthday', url: '#', status: 'Live Soon' },
  { occasion: 'Anniversary', url: '#', status: 'Live Soon' },
  { occasion: 'Graduation', url: '#', status: 'Live Soon' },
  { occasion: 'Baby Shower', url: '#', status: 'Live Soon' },
];

const STARTUP_PROMISES = [
  'Small-batch quality checks for every order',
  'Direct support from our core team',
  'Fast iteration and personalized requests',
  'Built for meaningful gifts and keepsakes',
];

const VARIANT_OPTIONS = [
  { id: 'qr_only', label: 'QR Code Only', basePrice: 199 },
  { id: 'qr_nfc', label: 'QR Code + NFC', basePrice: 299 },
] as const;

const FINISH_OPTIONS = [
  { id: 'standard', label: 'Standard Print', price: 0 },
  { id: 'premium', label: 'Premium Coated Print', price: 60 },
] as const;

const SHIPPING_ZONES = [
  { id: 'metro', label: 'Metro Manila', shippingFee: 80, eta: '1-3 days' },
  { id: 'luzon', label: 'Luzon', shippingFee: 120, eta: '2-4 days' },
  { id: 'vismin', label: 'Visayas/Mindanao', shippingFee: 160, eta: '3-6 days' },
] as const;

const PROMO_CODES = {
  START10: { type: 'percent', value: 10, label: '10% off for first-time customers' },
  BUNDLE150: { type: 'fixed', value: 150, label: 'PHP 150 off bundle orders' },
} as const;

const INCLUDED_ITEMS = [
  'Physical premium keychain (double-sided print)',
  'Mobile-friendly personal website linked to your keychain',
  'Access setup based on package: QR only or QR + NFC tap',
  'Basic updates and support after delivery',
];

const FAQS = [
  {
    question: 'How long does production and delivery take?',
    answer: 'Most orders are processed within 24 to 48 hours after details are complete. Delivery time depends on your selected courier and location.',
  },
  {
    question: 'Can I update my website after receiving the keychain?',
    answer: 'Yes. You can request content updates, photos, and text revisions so your QR keychain always opens the latest version of your page.',
  },
  {
    question: 'Will the QR code still work after months or years?',
    answer: 'Yes. We maintain stable redirect routing so your QR link remains reliable as long as your website is active.',
  },
  {
    question: 'Can I order in bulk for events or giveaways?',
    answer: 'Yes. We can support bulk custom orders for weddings, birthdays, reunions, and corporate giveaways.',
  },
];

const PRODUCT_HIGHLIGHTS = [
  {
    title: 'QR Code Only',
    subtitle: 'Scan-ready keychain linked to your personal website',
    price: 'From PHP 199',
  },
  {
    title: 'QR Code + NFC',
    subtitle: 'Scan or tap access with NFC-enabled experience',
    price: 'From PHP 299',
  },
];

const PRODUCT_EXPANSION_COLLECTIONS = PRODUCT_EXPANSION_PRESETS.map((preset) => ({
  id: preset.id,
  title: preset.label,
  subtitle: preset.description,
  price: `From PHP ${preset.priceFrom}`,
  badge: preset.badge,
}));

const BENEFITS = [
  'Choose between QR-only or QR + NFC keychain access',
  'Fast production with quality control checks',
  'Tap-to-open NFC option for compatible phones',
  'Easy re-order and renewal support',
  'Perfect for couples, birthdays, and milestones',
];

const OCCASION_FLOW_OPTIONS: Array<{ id: OccasionType; label: string }> = Object.values(OCCASION_REGISTRY).map((meta) => ({
  id: meta.key,
  label: meta.label,
}));

const HERO_METRICS = [
  { label: 'Base starts at', value: 'PHP 199' },
  { label: 'Average prep', value: '24-48 hrs' },
  { label: 'Access modes', value: 'QR or NFC' },
];

export default function Home() {
  const router = useRouter();
  const builderSectionRef = useRef<HTMLDivElement | null>(null);
  const [previewState, setPreviewState] = useState<FormPreviewState>({
    website_name: '',
    coupleNames: '',
    occasion: 'couple',
    participants: [],
    photosPreview: [],
  });
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<(typeof VARIANT_OPTIONS)[number]['id']>('qr_only');
  const [selectedFinish, setSelectedFinish] = useState<(typeof FINISH_OPTIONS)[number]['id']>('standard');
  const [selectedZone, setSelectedZone] = useState<(typeof SHIPPING_ZONES)[number]['id']>('metro');
  const [giftWrap, setGiftWrap] = useState(false);
  const [rushProduction, setRushProduction] = useState(false);
  const [builderHighlight, setBuilderHighlight] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<keyof typeof PROMO_CODES | ''>('');
  const [promoError, setPromoError] = useState('');
  const [flowStep, setFlowStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('couple');
  const [selectedTemplateId, setSelectedTemplateId] = useState(STARTER_TEMPLATES[0]!.id);
  const templatesForOccasion = useMemo(() => getTemplatesByOccasion(selectedOccasion), [selectedOccasion]);

  const [publicLinks, setPublicLinks] = useState<PublicBusinessLinks>({
    whatsappNumber: null,
    messengerUsername: null,
    messengerUrl: null,
    shopeeStoreUrl: DEFAULT_SHOPEE_URL,
    tiktokShopUrl: DEFAULT_TIKTOK_URL,
    lazadaStoreUrl: DEFAULT_LAZADA_URL,
    facebookPageUrl: null,
    instagramUrl: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPublicLinks = async () => {
      try {
        const res = await fetch('/api/public/business-settings', { method: 'GET' });
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (!isMounted) {
          return;
        }

        setPublicLinks((prev) => ({
          ...prev,
          whatsappNumber: typeof data.whatsappNumber === 'string' && data.whatsappNumber.trim() ? data.whatsappNumber : null,
          messengerUsername: typeof data.messengerUsername === 'string' && data.messengerUsername.trim() ? data.messengerUsername : null,
          messengerUrl: typeof data.messengerUrl === 'string' && data.messengerUrl.trim() ? data.messengerUrl : null,
          shopeeStoreUrl: typeof data.shopeeStoreUrl === 'string' && data.shopeeStoreUrl.trim() ? data.shopeeStoreUrl : prev.shopeeStoreUrl,
          tiktokShopUrl: typeof data.tiktokShopUrl === 'string' && data.tiktokShopUrl.trim() ? data.tiktokShopUrl : prev.tiktokShopUrl,
          lazadaStoreUrl: typeof data.lazadaStoreUrl === 'string' && data.lazadaStoreUrl.trim() ? data.lazadaStoreUrl : prev.lazadaStoreUrl,
          facebookPageUrl: typeof data.facebookPageUrl === 'string' && data.facebookPageUrl.trim() ? data.facebookPageUrl : null,
          instagramUrl: typeof data.instagramUrl === 'string' && data.instagramUrl.trim() ? data.instagramUrl : null,
        }));
      } catch {
        // Keep safe defaults if public settings are unavailable.
      }
    };

    fetchPublicLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeSuccess = () => {
    setShowSuccess(false);
    setOrderResult(null);
  };

  const mockQrUrl = previewState.website_name
    ? `/api/qr?data=${encodeURIComponent(`https://keystory.app/r/${previewState.website_name}`)}`
    : undefined;

  const heroQrUrl = '/api/qr?data=' + encodeURIComponent('https://key-story.vercel.app/');

  const trackEvent = (eventName: string, payload?: Record<string, string | number | boolean>) => {
    if (typeof window === 'undefined') return;
    const maybeWindow = window as Window & {
      gtag?: (command: 'event', name: string, params?: Record<string, string | number | boolean>) => void;
    };
    if (typeof maybeWindow.gtag === 'function') {
      maybeWindow.gtag('event', eventName, payload);
    }
  };

  const selectedVariantConfig = VARIANT_OPTIONS.find((item) => item.id === selectedVariant) || VARIANT_OPTIONS[0];
  const selectedFinishConfig = FINISH_OPTIONS.find((item) => item.id === selectedFinish) || FINISH_OPTIONS[0];
  const selectedZoneConfig = SHIPPING_ZONES.find((item) => item.id === selectedZone) || SHIPPING_ZONES[0];
  const addOnsPerItem = (giftWrap ? 40 : 0) + (rushProduction ? 120 : 0);
  const unitSubtotal = selectedVariantConfig.basePrice + selectedFinishConfig.price + addOnsPerItem;
  const subtotal = unitSubtotal * quantity;
  const bundleDiscount = quantity >= 3 ? Math.round(subtotal * 0.08) : 0;
  const activePromo = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const promoDiscount = activePromo
    ? activePromo.type === 'percent'
      ? Math.round((subtotal - bundleDiscount) * (activePromo.value / 100))
      : activePromo.value
    : 0;
  const totalDiscount = bundleDiscount + promoDiscount;
  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
  const estimatedTotal = discountedSubtotal + selectedZoneConfig.shippingFee;
  const now = new Date();
  const hoursToCutoff = Math.max(0, 19 - now.getHours());
  const estimatorSummary = `${selectedVariantConfig.label} • ${selectedFinishConfig.label} • ${selectedZoneConfig.label} • ETA ${selectedZoneConfig.eta}`;
  const estimatorAddOns = [giftWrap ? 'Gift wrap' : null, rushProduction ? 'Rush production' : null].filter(Boolean).join(', ');
  const selectedTemplate = templatesForOccasion.find((template) => template.id === selectedTemplateId) || templatesForOccasion[0];

  const jumpToFlow = () => {
    setBuilderHighlight(true);
    trackEvent('jump_to_customize_flow', {
      variant: selectedVariantConfig.label,
      finish: selectedFinishConfig.label,
      zone: selectedZoneConfig.label,
      total: estimatedTotal,
    });

    if (builderSectionRef.current) {
      builderSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      setBuilderHighlight(false);
    }, 1500);
  };

  const whatsappDigits = (publicLinks.whatsappNumber || '').replace(/\D/g, '');
  const whatsappUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;
  const messengerUrl = publicLinks.messengerUrl || (publicLinks.messengerUsername ? `https://m.me/${publicLinks.messengerUsername}` : null);

  const applyPromoCode = () => {
    const normalizedCode = promoInput.trim().toUpperCase() as keyof typeof PROMO_CODES;
    if (!normalizedCode || !PROMO_CODES[normalizedCode]) {
      setPromoError('Promo code not recognized.');
      setAppliedPromo('');
      return;
    }
    setAppliedPromo(normalizedCode);
    setPromoError('');
    trackEvent('promo_code_applied', { code: normalizedCode });
  };

  const continueToCreate = () => {
    const productLabel = `${selectedVariantConfig.label} / ${selectedFinishConfig.label}`;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('selected_template_id', selectedTemplateId);
    }
    trackEvent('template_continue_click', {
      template: selectedTemplateId,
      occasion: selectedOccasion,
      product: productLabel,
      quantity,
    });
    router.push(
      `/create?template=${encodeURIComponent(selectedTemplateId)}&occasion=${encodeURIComponent(selectedOccasion)}&product=${encodeURIComponent(productLabel)}`
    );
  };

  return (
    <div className={`${sora.variable} ${playfair.variable} premium-surface min-h-screen bg-[#faf7f2] text-[#1f2937]`}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-[#ffd7b8] opacity-80 blur-3xl" />
        <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#b7d6ff] opacity-70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#ffe9a8] opacity-60 blur-3xl" />
      </div>

      <header className="glass-nav sticky top-0 z-40 border-b border-[#1f2937]/10 bg-[#faf7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="brand-wordmark text-xl font-black tracking-tight text-[#101827]">
            KEYSTORY
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#334155] md:flex">
            <a href="#starter-studio" className="nav-link transition-colors hover:text-[#0f172a]">Starter Studio</a>
            <a href="#products" className="nav-link transition-colors hover:text-[#0f172a]">Products</a>
            <a href="#samples" className="nav-link transition-colors hover:text-[#0f172a]">Samples</a>
            <a href="#how-it-works" className="nav-link transition-colors hover:text-[#0f172a]">How It Works</a>
            <a href="#social-shop" className="nav-link transition-colors hover:text-[#0f172a]">Shop Links</a>
            <a href="/create" className="nav-link transition-colors hover:text-[#0f172a]">Order Form</a>
          </nav>
          <a
            href="/create"
            className="cta-pill inline-flex items-center rounded-full bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b]"
          >
            Start Building
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
        

        <section className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="reveal-up">
            <p className="inline-flex rounded-full border border-[#0f172a]/15 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-[#0f172a]">
              QR Only or QR + NFC Products
            </p>
            <h1 className="display-title mt-5 text-4xl font-black leading-tight text-[#111827] md:text-6xl">
              Premium Keychains That Open Your Story by Scan or Tap
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#475569]">
              We build beautiful personal websites linked to custom QR + NFC keychains. Perfect for gifts, couple memories, birthdays, and milestone moments.
            </p>
            <p className="mt-3 max-w-xl text-sm font-medium text-[#334155]">
              Start with a template in under a minute, then finish checkout in one guided flow.
            </p>
            <p className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Order before 7PM for same-day production queueing. Approx {hoursToCutoff}h left today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#starter-studio"
                onClick={(event) => {
                  event.preventDefault();
                  jumpToFlow();
                }}
                className="cta-solid rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f2937]"
              >
                Start in Starter Studio
              </a>
              <a
                href="/create"
                className="cta-outline rounded-full border border-[#111827] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f1f5f9]"
              >
                Go to Full Order Form
              </a>
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('hero_shopee_click')}
                className="cta-outline rounded-full border border-[#111827] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f1f5f9]"
              >
                Shop on Shopee
              </a>
              <a
                href="#samples"
                className="cta-outline rounded-full border border-[#111827] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f1f5f9]"
              >
                View Sample Websites
              </a>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-[#0f172a]/10 bg-white/85 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">{metric.label}</p>
                  <p className="mt-1 text-lg font-black text-[#0f172a]">{metric.value}</p>
                </div>
              ))}
            </div>
              <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-[#334155] sm:grid-cols-4">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 text-center shadow-sm">Fast Turnaround</div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 text-center shadow-sm">Waterproof Print</div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 text-center shadow-sm">Gift Ready</div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 text-center shadow-sm">QR or NFC Access</div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STARTUP_PROMISES.map((item) => (
                <div key={item} className="rounded-2xl border border-[#0f172a]/10 bg-white/80 px-4 py-3">
                  <p className="text-sm font-semibold text-[#334155]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative float-card">
            <div className="showcase-shell rounded-3xl border border-[#0f172a]/10 bg-gradient-to-b from-[#0b1733] via-[#162748] to-[#23365a] p-6 shadow-[0_34px_90px_-24px_rgba(15,23,42,0.85)]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white">Signature Couple Keychain</h2>
                <span className="self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white sm:self-auto">Premium Finish</span>
              </div>

              <div className="showcase-frame keychain-stage relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="absolute -left-16 -top-12 h-32 w-32 rounded-full bg-[#f97316]/35 blur-2xl" />
                <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-[#38bdf8]/35 blur-2xl" />
                <div className="keychain-shimmer" />

                <div className="relative">
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">Keychain Render</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">50mm x 30mm</p>
                  </div>

                  <div className="keychain-metal relative rounded-2xl border border-white/25 bg-[#f8fafc] p-3 shadow-inner sm:p-4">
                    <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 p-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="keychain-panel rounded-lg border border-slate-200 bg-slate-50 p-2">
                          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">QR Side</p>
                          <div className="flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-white">
                            <img src={heroQrUrl} alt="Sample QR" className="h-24 w-24 object-contain sm:h-20 sm:w-20" />
                          </div>
                        </div>

                        <div className="keychain-panel rounded-lg border border-slate-200 bg-slate-50 p-2">
                          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Photo Side</p>
                          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                            {previewState.coverPhotoPreviewUrl ? (
                              <img src={previewState.coverPhotoPreviewUrl} alt="Cover preview" className="h-full w-full object-cover" />
                            ) : (
                              <img src="/photo.png" alt="Sample preview" className="h-full w-full object-cover" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="keychain-label-strip mt-4 rounded-xl border border-white/20 bg-gradient-to-r from-white/10 to-[#7dd3fc]/20 p-3">
                    <p className="text-center text-sm font-semibold text-white">{previewState.coupleNames || 'Ari and Kai'}</p>
                    <p className="mt-1 text-center text-xs text-slate-200">Scan to open your story</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-300">Starting Price</p>
                  <p className="text-2xl font-black text-white">PHP {selectedVariantConfig.basePrice}</p>
                  <p className="mt-1 text-xs text-slate-300">Buy 3+ items and save 8%</p>
                  <p className="mt-1 text-xs font-semibold text-sky-200">Available in QR-only and QR + NFC options</p>
                </div>
                <a
                  href="/create"
                  onClick={() => trackEvent('hero_customize_click')}
                  className="w-full rounded-full bg-[#f97316] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#ea580c] sm:w-auto"
                >
                  Customize
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="starter-studio"
          ref={builderSectionRef}
          className={`scroll-mt-24 py-12 md:py-16 ${builderHighlight ? 'builder-highlight' : ''}`}
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.5fr]">
            <aside className="rounded-3xl border border-[#0f172a]/10 bg-white/90 p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Starter Studio</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a]">Build Your Order in 3 Steps</h2>
              <p className="mt-3 text-sm text-[#475569]">
                Choose the occasion, preview a matching template style, then continue to the full form with your preset ready.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#0f172a]/10 bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#334155]">
                <span className={`h-2.5 w-2.5 rounded-full ${flowStep >= 1 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>Occasion</span>
                <span className={`h-2.5 w-2.5 rounded-full ${flowStep >= 2 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>Template</span>
                <span className={`h-2.5 w-2.5 rounded-full ${flowStep >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>Estimate</span>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">1. Pick Occasion</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {OCCASION_FLOW_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedOccasion(option.id);
                        const occasionTemplates = getTemplatesByOccasion(option.id);
                        if (occasionTemplates.length) {
                          setSelectedTemplateId(occasionTemplates[0]!.id);
                        }
                        setFlowStep(1);
                        trackEvent('starter_occasion_selected', { occasion: option.id });
                      }}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        selectedOccasion === option.id
                          ? 'border-[#0f172a] bg-[#0f172a] text-white'
                          : 'border-[#0f172a]/20 bg-white text-[#334155] hover:border-[#0f172a]/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">2. Quick Estimate</p>
                <div className="mt-3 rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#0f172a]">{selectedVariantConfig.label}</p>
                    <p className="text-sm font-black text-[#0f172a]">PHP {estimatedTotal}</p>
                  </div>
                  <p className="mt-2 text-xs text-[#64748b]">{estimatorSummary}</p>
                  <p className="mt-1 text-xs text-[#64748b]">Selected template: {selectedTemplate?.name || 'Default starter template'}</p>
                  <p className="mt-1 text-xs text-[#64748b]">Preview QR: {mockQrUrl ? 'Ready' : 'Will generate after naming your site'}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedVariant('qr_only')}
                      className={`rounded-xl border px-2 py-2 font-semibold ${
                        selectedVariant === 'qr_only' ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/20 bg-white text-[#334155]'
                      }`}
                    >
                      QR Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVariant('qr_nfc')}
                      className={`rounded-xl border px-2 py-2 font-semibold ${
                        selectedVariant === 'qr_nfc' ? 'border-[#0f172a] bg-[#0f172a] text-white' : 'border-[#0f172a]/20 bg-white text-[#334155]'
                      }`}
                    >
                      QR + NFC
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-[#334155]">
                      Finish
                      <select
                        value={selectedFinish}
                        onChange={(event) => setSelectedFinish(event.target.value as (typeof FINISH_OPTIONS)[number]['id'])}
                        className="mt-1 w-full rounded-lg border border-[#0f172a]/20 bg-white px-2 py-2 text-xs font-semibold text-[#0f172a]"
                      >
                        {FINISH_OPTIONS.map((finish) => (
                          <option key={finish.id} value={finish.id}>{finish.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-[#334155]">
                      Shipping Zone
                      <select
                        value={selectedZone}
                        onChange={(event) => setSelectedZone(event.target.value as (typeof SHIPPING_ZONES)[number]['id'])}
                        className="mt-1 w-full rounded-lg border border-[#0f172a]/20 bg-white px-2 py-2 text-xs font-semibold text-[#0f172a]"
                      >
                        {SHIPPING_ZONES.map((zone) => (
                          <option key={zone.id} value={zone.id}>{zone.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setGiftWrap((prev) => !prev)}
                      className={`rounded-xl border px-2 py-2 font-semibold ${
                        giftWrap ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-[#0f172a]/20 bg-white text-[#334155]'
                      }`}
                    >
                      Gift Wrap
                    </button>
                    <button
                      type="button"
                      onClick={() => setRushProduction((prev) => !prev)}
                      className={`rounded-xl border px-2 py-2 font-semibold ${
                        rushProduction ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-[#0f172a]/20 bg-white text-[#334155]'
                      }`}
                    >
                      Rush Production
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[#0f172a]/10 bg-white px-3 py-2">
                    <p className="text-xs font-semibold text-[#334155]">Quantity</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="h-7 w-7 rounded-full border border-[#0f172a]/20 text-sm font-bold text-[#0f172a]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-bold text-[#0f172a]">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
                        className="h-7 w-7 rounded-full border border-[#0f172a]/20 text-sm font-bold text-[#0f172a]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#0f172a]/10 bg-white p-2">
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Promo Code</p>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        value={promoInput}
                        onChange={(event) => setPromoInput(event.target.value)}
                        placeholder="START10"
                        className="w-full rounded-lg border border-[#0f172a]/20 px-3 py-2 text-xs font-semibold text-[#0f172a] outline-none focus:border-[#0f172a]"
                      />
                      <button
                        type="button"
                        onClick={applyPromoCode}
                        className="rounded-lg bg-[#0f172a] px-3 py-2 text-xs font-bold text-white"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="mt-1 px-1 text-xs font-semibold text-rose-600">{promoError}</p>}
                  </div>
                  {estimatorAddOns ? (
                    <p className="mt-2 text-xs text-[#64748b]">Add-ons: {estimatorAddOns}</p>
                  ) : (
                    <p className="mt-2 text-xs text-[#64748b]">Add-ons: none selected yet</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Name Preview</p>
                <input
                  value={previewState.coupleNames}
                  onChange={(event) => setPreviewState((prev) => ({ ...prev, coupleNames: event.target.value }))}
                  placeholder="Ari and Kai"
                  className="mt-2 w-full rounded-xl border border-[#0f172a]/20 bg-white px-3 py-2.5 text-sm font-semibold text-[#0f172a] outline-none transition focus:border-[#0f172a]"
                />
                <p className="mt-2 text-xs text-[#64748b]">This updates the keychain label preview in the hero card instantly.</p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">3. Continue</p>
                <button
                  type="button"
                  onClick={() => {
                    setFlowStep(4);
                    continueToCreate();
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1e293b]"
                >
                  Continue with this preset
                </button>
                <p className="mt-2 text-xs text-[#64748b]">No payment on this step. You can still change everything on the full order page.</p>
              </div>
            </aside>

            <TemplateSelector
              templates={templatesForOccasion}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={(templateId) => {
                setSelectedTemplateId(templateId);
                setFlowStep(2);
                trackEvent('starter_template_selected', { template: templateId, occasion: selectedOccasion });
              }}
              onContinue={continueToCreate}
              stepLabel="Template Match"
              title="Preview Starter Templates"
              description="Choose a visual direction now. Your selected template and occasion are carried into the full form automatically."
              continueLabel="Use This Template"
            />
          </div>
        </section>

        <section className="pb-4">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/80 p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#0f172a] md:text-3xl">What You Get in Every Order</h2>
              <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white">Complete Package</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {INCLUDED_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#0f172a]/10 bg-white p-4">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                  <p className="text-sm font-medium text-[#334155]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-24 py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Featured Products</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Shop Our Keychain Collections</h2>
            </div>
            <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#0f172a] underline underline-offset-4">
              View full catalog
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {PRODUCT_HIGHLIGHTS.map((item) => (
              <article key={item.title} className="product-tile group rounded-3xl border border-[#0f172a]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="product-media h-44 rounded-2xl bg-gradient-to-br from-[#dbeafe] via-[#ffedd5] to-[#fef9c3]" />
                <h3 className="mt-5 text-xl font-bold text-[#0f172a]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{item.subtitle}</p>
                <p className="mt-4 text-lg font-extrabold text-[#0f172a]">{item.price}</p>
                <div className="mt-4 flex gap-2">
                  <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white">
                    Buy on Shopee
                  </a>
                  <a href="/create" className="rounded-full border border-[#0f172a] px-4 py-2 text-xs font-bold text-[#0f172a]">
                    Customize
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:p-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Product Expansion</p>
                <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">New Formats Beyond the Core Keychain</h2>
                <p className="mt-3 max-w-3xl text-[#475569]">
                  We can now package the same QR-powered story into NFC keepsakes, engraved series, sticker packs, event stands, and wedding companion materials.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PRODUCT_EXPANSION_COLLECTIONS.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#0f172a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      {item.badge}
                    </span>
                    <span className="text-sm font-extrabold text-[#0f172a]">{item.price}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#0f172a]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{item.subtitle}</p>
                  <div className="mt-4 flex gap-2">
                    <a href="/create" className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white">
                      Request This Format
                    </a>
                    <a href="#inquiry" className="rounded-full border border-[#0f172a]/20 px-4 py-2 text-xs font-bold text-[#0f172a]">
                      Ask for Bulk Pricing
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="samples" className="scroll-mt-24 py-12 md:py-16">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:p-10">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Sample Websites</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Browse Demo Pages by Occasion</h2>
              <p className="mt-3 max-w-3xl text-[#475569]">
                Replace each placeholder with your real demo links. This section helps customers preview your style before they customize.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_WEBSITES.map((sample) => (
                <a
                  key={sample.occasion}
                  href={sample.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-tile group rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-[#0f172a]/30 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-[#0f172a]">{sample.occasion}</p>
                    <span className="rounded-full bg-[#0f172a]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0f172a]">
                      {sample.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#64748b]">Open {sample.occasion} sample website</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#0f172a]">View Demo</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-12 md:py-16">
          <div className="grid gap-8 rounded-3xl border border-[#0f172a]/10 bg-white/80 p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">How It Works</p>
              <h2 className="mt-3 text-3xl font-black text-[#0f172a]">From Checkout to Scan in 4 Simple Steps</h2>
              <p className="mt-4 text-[#475569]">
                We designed this for gifting and personal keepsakes. You get a physical product and a digital experience connected in one scan.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#334155]">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="rounded-xl bg-[#f8fafc] px-3 py-2">{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              {[
                { id: '01', title: 'Choose product', desc: 'Pick your keychain style and finish.' },
                { id: '02', title: 'Customize content', desc: 'Add names, photos, and your message.' },
                { id: '03', title: 'We generate and print', desc: 'Your QR and page are prepared instantly.' },
                { id: '04', title: 'Deliver, scan, or tap', desc: 'Open your page anytime through QR or NFC tap.' },
              ].map((step) => (
                <div key={step.id} className="flex gap-3 rounded-2xl border border-[#0f172a]/10 bg-white p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f172a] text-sm font-bold text-white">{step.id}</div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">{step.title}</p>
                    <p className="text-sm text-[#475569]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="social-shop" className="scroll-mt-24 py-12 md:py-16">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-3xl border border-[#f97316]/30 bg-[#fff7ed] p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9a3412]">Shopee Store</p>
              <h3 className="mt-2 text-3xl font-black text-[#7c2d12]">Order Fast via Shopee</h3>
              <p className="mt-3 text-[#9a3412]">Browse ready-made bundles, check promo pricing, and place orders through our Shopee shop.</p>
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#ea580c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#c2410c]"
              >
                Open Shopee
              </a>
            </article>
            <article className="rounded-3xl border border-[#0ea5e9]/30 bg-[#f0f9ff] p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0c4a6e]">TikTok Shop</p>
              <h3 className="mt-2 text-3xl font-black text-[#075985]">Shop and Watch on TikTok</h3>
              <p className="mt-3 text-[#0c4a6e]">See product videos, unboxings, and shop links directly through our TikTok presence.</p>
              <a
                href={publicLinks.tiktokShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#0284c7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0369a1]"
              >
                Open TikTok
              </a>
            </article>
            <article className="rounded-3xl border border-[#22c55e]/30 bg-[#f0fdf4] p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#166534]">Lazada Store</p>
              <h3 className="mt-2 text-3xl font-black text-[#14532d]">Find Deals on Lazada</h3>
              <p className="mt-3 text-[#166534]">Check listings, current bundles, and storefront updates through our Lazada page.</p>
              <a
                href={publicLinks.lazadaStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-[#16a34a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#15803d]"
              >
                Open Lazada
              </a>
            </article>
          </div>
        </section>

        <section id="inquiry" className="scroll-mt-24 py-12 md:py-16">
          <div className="grid gap-6 rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Quick Contact</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a]">Need Help Choosing the Right Package?</h2>
              <p className="mt-3 text-[#475569]">
                Chat with us directly on social channels so we can recommend the best package for your occasion.
              </p>
              <p className="mt-3 text-sm text-[#64748b]">No forms needed. Choose your preferred channel below.</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#0f172a]/10 bg-white p-4">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('quick_contact_whatsapp_click')}
                  className="block w-full rounded-xl bg-[#16a34a] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#15803d]"
                >
                  Chat on WhatsApp
                </a>
              )}
              {messengerUrl && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('quick_contact_messenger_click')}
                  className="block w-full rounded-xl bg-[#0284c7] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0369a1]"
                >
                  Message on Messenger
                </a>
              )}
              {publicLinks.facebookPageUrl && (
                <a
                  href={publicLinks.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('quick_contact_facebook_click')}
                  className="block w-full rounded-xl bg-[#1d4ed8] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e40af]"
                >
                  Visit our Facebook Page
                </a>
              )}
              {publicLinks.instagramUrl && (
                <a
                  href={publicLinks.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('quick_contact_instagram_click')}
                  className="block w-full rounded-xl border border-[#0f172a]/15 bg-[#f8fafc] px-4 py-3 text-center text-sm font-bold text-[#0f172a] transition hover:bg-[#eef2ff]"
                >
                  Open Instagram
                </a>
              )}
              {!whatsappUrl && !messengerUrl && !publicLinks.facebookPageUrl && !publicLinks.instagramUrl && (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Contact links are not configured yet. Please update Admin Settings.
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 py-12 md:py-16">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Questions Customers Usually Ask</h2>
            <div className="mt-6 space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.question} className="faq-item group rounded-2xl border border-[#0f172a]/10 bg-white p-4 open:border-[#0f172a]/30">
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-[#0f172a]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="build" className="scroll-mt-24 py-12 md:py-16">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/90 p-8 md:p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Order Flow</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Price Estimator + Live Customizer Moved</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#475569]">
              We moved the full ordering experience to a dedicated page so customers can complete product selection, personalization, review, and submit in one clean flow.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/create" className="rounded-full bg-[#0f172a] px-6 py-3 text-sm font-bold text-white">Start Order Form</a>
              <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#0f172a]/20 bg-white px-6 py-3 text-sm font-bold text-[#0f172a]">Shop on Shopee</a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-[#0f172a] px-6 py-10 text-center text-white md:px-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Ready to launch your keepsake</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Your Story, Your Product, Your QR</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Start from the builder above or jump directly to our storefront channels for ready-made bundles.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/create" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0f172a]">Customize Now</a>
              <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white">Shopee</a>
              <a href={publicLinks.tiktokShopUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white">TikTok</a>
              <a href={publicLinks.lazadaStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white">Lazada</a>
            </div>
          </div>
        </section>

        {showSuccess && orderResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <div className="border-b border-slate-100 p-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-[#0f172a]">Order Created</h3>
                <p className="mt-2 text-[#475569]">Your website and QR code are ready.</p>
              </div>

              <div className="p-8">
                <KeychainInsertPreview
                  widthMm={50}
                  heightMm={30}
                  qrCodeUrl={orderResult.qrCodeUrl}
                  coverPhotoUrl={previewState.coverPhotoPreviewUrl}
                  coupleNames={previewState.coupleNames || 'Your Names'}
                  caption="Scan to open your page"
                />

                <div className="mt-6 space-y-3">
                  <Link
                    href={orderResult.url}
                    target="_blank"
                    className="block w-full rounded-2xl bg-[#0f172a] px-6 py-3 text-center text-sm font-bold text-white"
                  >
                    Open Website
                  </Link>
                  <a
                    href={orderResult.qrCodeUrl}
                    download="keystory-qr.png"
                    className="block w-full rounded-2xl bg-[#f97316] px-6 py-3 text-center text-sm font-bold text-white"
                  >
                    Download QR Code
                  </a>
                  <button
                    onClick={closeSuccess}
                    className="block w-full rounded-2xl border border-slate-200 px-6 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="premium-footer border-t border-[#0f172a]/10 py-10 text-center text-sm text-[#475569]">
          <p className="font-semibold text-[#0f172a]">Keystory</p>
          <p className="mt-1">Premium QR keychains and memory websites.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Shopee</a>
            <a href={publicLinks.tiktokShopUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">TikTok</a>
            <a href={publicLinks.lazadaStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Lazada</a>
            {publicLinks.facebookPageUrl && (
              <a href={publicLinks.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Facebook</a>
            )}
            {publicLinks.instagramUrl && (
              <a href={publicLinks.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Instagram</a>
            )}
            <a href="#samples" className="underline underline-offset-4">Sample Websites</a>
            <a href="/create" className="underline underline-offset-4">Customize</a>
          </div>
          <p className="mt-4">© 2026 Keystory</p>
        </footer>
      </main>

      <div className="fixed right-4 top-1/2 z-30 hidden w-44 -translate-y-1/2 space-y-2 rounded-2xl border border-[#0f172a]/10 bg-white/95 p-3 shadow-xl backdrop-blur lg:block">
        <a href="/create" className="block rounded-lg bg-[#0f172a] px-3 py-2 text-center text-xs font-bold text-white">Customize</a>
        <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-[#f97316] px-3 py-2 text-center text-xs font-bold text-white">Shop Shopee</a>
        <a href={publicLinks.tiktokShopUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-[#0f172a]/20 px-3 py-2 text-center text-xs font-bold text-[#0f172a]">TikTok</a>
        <a href={publicLinks.lazadaStoreUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-[#0f172a]/20 px-3 py-2 text-center text-xs font-bold text-[#0f172a]">Lazada</a>
        <a href={publicLinks.facebookPageUrl || 'https://facebook.com/'} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-[#1d4ed8] px-3 py-2 text-center text-xs font-bold text-white">Facebook</a>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[#0f172a]/15 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a href="/create" className="rounded-xl bg-[#0f172a] px-3 py-3 text-center text-xs font-bold text-white">
            Customize Now
          </a>
          <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#f97316] px-3 py-3 text-center text-xs font-bold text-white">
            Shop Shopee
          </a>
          <a href={publicLinks.tiktokShopUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#0f172a]/20 px-3 py-3 text-center text-xs font-bold text-[#0f172a]">
            TikTok
          </a>
        </div>
      </div>

      <style jsx>{`
        .premium-surface {
          font-family: var(--font-sora), ui-sans-serif, system-ui;
        }

        .display-title {
          font-family: var(--font-playfair), ui-serif, Georgia;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .glass-nav {
          box-shadow: 0 10px 35px -28px rgba(15, 23, 42, 0.7);
        }

        .brand-wordmark {
          letter-spacing: 0.02em;
        }

        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #fb923c, #0ea5e9);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 200ms ease;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .cta-pill,
        .cta-solid,
        .cta-outline {
          transition: all 220ms ease;
        }

        .cta-pill:hover,
        .cta-solid:hover,
        .cta-outline:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px -20px rgba(15, 23, 42, 0.65);
        }

        .hero-urgency {
          background-image: linear-gradient(90deg, #0f172a 0%, #162238 70%, #1f2f4a 100%);
        }

        .info-strip {
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(250, 247, 242, 0.85));
        }

        .showcase-shell {
          position: relative;
          overflow: hidden;
        }

        .showcase-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 0% 0%, rgba(251, 146, 60, 0.18), transparent 50%);
          pointer-events: none;
        }

        .showcase-frame {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .keychain-stage {
          background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(148, 163, 184, 0.04));
        }

        .keychain-shimmer {
          position: absolute;
          inset: -15% -40%;
          background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.2), transparent 70%);
          transform: translateX(-45%);
          animation: shimmerPass 4.4s ease-in-out infinite;
          pointer-events: none;
        }

        .keychain-metal {
          background-image: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
        }

        .keychain-panel {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .keychain-label-strip {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        .product-tile {
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.9));
        }

        .product-media {
          position: relative;
          overflow: hidden;
        }

        .product-media::after {
          content: '';
          position: absolute;
          inset: -100% -30%;
          background: linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.65), transparent 65%);
          transform: translateX(-30%);
          transition: transform 700ms ease;
        }

        .product-tile:hover .product-media::after {
          transform: translateX(30%);
        }

        .demo-tile,
        .faq-item {
          transition: all 220ms ease;
        }

        .demo-tile:hover,
        .faq-item:hover {
          box-shadow: 0 14px 28px -24px rgba(15, 23, 42, 0.6);
        }

        .premium-footer {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(250, 247, 242, 0.9));
        }

        .reveal-up {
          animation: revealUp 700ms ease both;
        }

        .float-card {
          animation: floatCard 6s ease-in-out infinite;
        }

        .builder-highlight {
          animation: pulseGlow 1.4s ease;
        }

        @keyframes revealUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.45);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(249, 115, 22, 0);
          }
        }

        @keyframes shimmerPass {
          0% {
            transform: translateX(-45%);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          60% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(45%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
