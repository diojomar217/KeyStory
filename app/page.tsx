'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Playfair_Display, Sora } from 'next/font/google';

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

type SampleWebsiteItem = {
  occasion: string;
  url: string;
  status: 'Live Soon' | 'Ready';
  description: string;
  accent: string;
  badge: string;
};

type MoreFormatItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  accent: string;
};

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const DEFAULT_SHOPEE_URL = 'https://shopee.ph/';
const DEFAULT_TIKTOK_URL = 'https://www.tiktok.com/';
const DEFAULT_LAZADA_URL = 'https://www.lazada.com.ph/';

const BASE_URL = (() => {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_URL) || 'http://localhost:3000';
})();

const SAMPLE_WEBSITES: SampleWebsiteItem[] = [
  {
    occasion: 'Couple',
    url: `${BASE_URL}/site/couple-demo`,
    status: 'Ready',
    description: 'Romantic layout with love letter, timeline, gallery, and music.',
    accent: 'from-rose-500 to-pink-500',
    badge: '❤️',
  },
  {
    occasion: 'Wedding',
    url: `${BASE_URL}/site/wedding-demo`,
    status: 'Ready',
    description: 'Elegant invite style with RSVP, schedule, and venue details.',
    accent: 'from-amber-400 to-rose-400',
    badge: '💍',
  },
  {
    occasion: 'Birthday',
    url: `${BASE_URL}/site/birthday-demo`,
    status: 'Ready',
    description: 'Fun birthday page with countdown, gallery, and surprise message.',
    accent: 'from-fuchsia-500 to-orange-400',
    badge: '🎂',
  },
  {
    occasion: 'Anniversary',
    url: `${BASE_URL}/site/anniversary-demo`,
    status: 'Ready',
    description: 'Memory-focused design with milestones and storytelling.',
    accent: 'from-pink-500 to-red-400',
    badge: '🥂',
  },
  {
    occasion: 'Graduation',
    url: `${BASE_URL}/site/graduation-demo`,
    status: 'Ready',
    description: 'Celebrate achievements, photos, and congratulatory messages.',
    accent: 'from-sky-500 to-indigo-500',
    badge: '🎓',
  },
  {
    occasion: 'Baby Shower',
    url: `${BASE_URL}/site/baby-shower-demo`,
    status: 'Live Soon',
    description: 'Soft pastel event page for invites, wishlist, and greetings.',
    accent: 'from-cyan-400 to-pink-300',
    badge: '🍼',
  },
  {
    occasion: 'Debut',
    url: `${BASE_URL}/site/debut-demo`,
    status: 'Live Soon',
    description: 'Modern debut layout with event details and photo story.',
    accent: 'from-violet-500 to-pink-500',
    badge: '✨',
  },
  {
    occasion: 'Family',
    url: `${BASE_URL}/site/family-demo`,
    status: 'Live Soon',
    description: 'Warm family-themed page for reunions and shared memories.',
    accent: 'from-emerald-500 to-teal-500',
    badge: '🏡',
  },
  {
    occasion: 'Proposal',
    url: `${BASE_URL}/site/proposal-demo`,
    status: 'Live Soon',
    description: 'Romantic proposal page with memories and future plans.',
    accent: 'from-red-500 to-pink-500',
    badge: '💖',
  },
  {
    occasion: "Valentine's Day",
    url: `${BASE_URL}/site/valentines-demo`,
    status: 'Live Soon',
    description: 'Sweet Valentine theme with gallery and playlist.',
    accent: 'from-rose-500 to-red-500',
    badge: '💌',
  },
];

const INCLUDED_ITEMS = [
  'Double-sided premium keychain',
  'Personal website linked to your QR',
  'QR only or QR + NFC access',
  'Basic support after delivery',
];

const PRODUCT_HIGHLIGHTS = [
  {
    title: 'QR Code Only',
    subtitle: 'Scan-ready keychain linked to your personal website.',
    price: 'From PHP 199',
  },
  {
    title: 'QR Code + NFC',
    subtitle: 'Tap or scan access with NFC-enabled experience.',
    price: 'From PHP 299',
  },
];

const MORE_FORMATS: MoreFormatItem[] = [
  {
    id: 'wallet-insert',
    title: 'Wallet Insert',
    subtitle: 'Slim printed keepsake with QR link.',
    price: 'From PHP 149',
    badge: '💳',
    accent: 'from-amber-200 via-orange-100 to-rose-100',
  },
  {
    id: 'nfc-keepsake',
    title: 'NFC Keepsake',
    subtitle: 'Tap-enabled version for supported phones.',
    price: 'From PHP 299',
    badge: '📶',
    accent: 'from-sky-200 via-cyan-100 to-blue-100',
  },
  {
    id: 'event-stand',
    title: 'Event QR Stand',
    subtitle: 'Perfect for tables, booths, and receptions.',
    price: 'From PHP 249',
    badge: '🪧',
    accent: 'from-emerald-200 via-teal-100 to-cyan-100',
  },
  {
    id: 'wedding-suite',
    title: 'Wedding QR Suite',
    subtitle: 'For invites, RSVP, and event access.',
    price: 'From PHP 399',
    badge: '💍',
    accent: 'from-rose-200 via-pink-100 to-fuchsia-100',
  },
  {
    id: 'sticker-pack',
    title: 'Sticker Pack',
    subtitle: 'Mini QR stickers for gifts and packaging.',
    price: 'From PHP 99',
    badge: '🏷️',
    accent: 'from-yellow-200 via-amber-100 to-orange-100',
  },
  {
    id: 'photo-card',
    title: 'Photo Card',
    subtitle: 'Pocket-size memory card with QR link.',
    price: 'From PHP 129',
    badge: '🖼️',
    accent: 'from-indigo-200 via-sky-100 to-cyan-100',
  },
];

const HOW_IT_WORKS_STEPS = [
  { id: '01', title: 'Choose product', desc: 'Pick your keychain style and finish.' },
  { id: '02', title: 'Customize content', desc: 'Add names, photos, and your message.' },
  { id: '03', title: 'We generate and print', desc: 'Your QR and page are prepared instantly.' },
  { id: '04', title: 'Deliver, scan, or tap', desc: 'Open your page anytime through QR or NFC tap.' },
];

const FAQS = [
  {
    question: 'How long does production and delivery take?',
    answer:
      'Most orders are processed within 24 to 48 hours after details are complete. Delivery time depends on your selected courier and location.',
  },
  {
    question: 'Can I update my website after receiving the keychain?',
    answer:
      'Yes. You can request content updates, photos, and text revisions so your QR keychain always opens the latest version of your page.',
  },
  {
    question: 'Will the QR code still work after months or years?',
    answer:
      'Yes. We maintain stable redirect routing so your QR link remains reliable as long as your website is active.',
  },
  {
    question: 'Can I order in bulk for events or giveaways?',
    answer:
      'Yes. We can support bulk custom orders for weddings, birthdays, reunions, and corporate giveaways.',
  },
];

const STARTUP_PROMISES = [
  'Small-batch quality checks for every order',
  'Direct support from our core team',
  'Fast iteration and personalized requests',
  'Built for meaningful gifts and keepsakes',
];

export default function Home() {
  const [sampleFilter, setSampleFilter] = useState<'All' | string>('All');
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
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        setPublicLinks((prev) => ({
          ...prev,
          whatsappNumber:
            typeof data.whatsappNumber === 'string' && data.whatsappNumber.trim()
              ? data.whatsappNumber
              : null,
          messengerUsername:
            typeof data.messengerUsername === 'string' && data.messengerUsername.trim()
              ? data.messengerUsername
              : null,
          messengerUrl:
            typeof data.messengerUrl === 'string' && data.messengerUrl.trim()
              ? data.messengerUrl
              : null,
          shopeeStoreUrl:
            typeof data.shopeeStoreUrl === 'string' && data.shopeeStoreUrl.trim()
              ? data.shopeeStoreUrl
              : prev.shopeeStoreUrl,
          tiktokShopUrl:
            typeof data.tiktokShopUrl === 'string' && data.tiktokShopUrl.trim()
              ? data.tiktokShopUrl
              : prev.tiktokShopUrl,
          lazadaStoreUrl:
            typeof data.lazadaStoreUrl === 'string' && data.lazadaStoreUrl.trim()
              ? data.lazadaStoreUrl
              : prev.lazadaStoreUrl,
          facebookPageUrl:
            typeof data.facebookPageUrl === 'string' && data.facebookPageUrl.trim()
              ? data.facebookPageUrl
              : null,
          instagramUrl:
            typeof data.instagramUrl === 'string' && data.instagramUrl.trim()
              ? data.instagramUrl
              : null,
        }));
      } catch {
        // keep defaults
      }
    };

    fetchPublicLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const sampleFilters = ['All', ...SAMPLE_WEBSITES.map((item) => item.occasion)];

  const visibleSamples = useMemo(() => {
    if (sampleFilter === 'All') return SAMPLE_WEBSITES;
    return SAMPLE_WEBSITES.filter((item) => item.occasion === sampleFilter);
  }, [sampleFilter]);

  const messengerUrl =
    publicLinks.messengerUrl ||
    (publicLinks.messengerUsername
      ? `https://m.me/${publicLinks.messengerUsername}`
      : publicLinks.facebookPageUrl || 'https://facebook.com/');

  const heroQrUrl = '/api/qr?data=' + encodeURIComponent('https://key-story.vercel.app/');

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
            <a href="#products" className="nav-link transition-colors hover:text-[#0f172a]">Products</a>
            <a href="#samples" className="nav-link transition-colors hover:text-[#0f172a]">Samples</a>
            <a href="#how-it-works" className="nav-link transition-colors hover:text-[#0f172a]">How It Works</a>
            <a href="#shop-links" className="nav-link transition-colors hover:text-[#0f172a]">Shop Links</a>
            <a href="/create" className="nav-link transition-colors hover:text-[#0f172a]">Customize</a>
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

            <h1 className="display-title mt-5 text-4xl font-black leading-[0.95] text-[#111827] md:text-6xl">
              Turn Your Memories
              <br />
              Into Something You
              <br />
              Can Hold ❤️
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#475569]">
              Turn your memories into a personalized website—linked to a custom QR or NFC keychain you can carry anywhere.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-outline rounded-full border border-[#111827] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f1f5f9]"
              >
                Shop on Shopee
              </a>
              <a
                href="/create"
                className="cta-solid rounded-full bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f2937]"
              >
                Build Your Keychain
              </a>
              <a
                href="#samples"
                className="cta-outline rounded-full border border-[#111827] bg-white px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f1f5f9]"
              >
                View Sample Websites
              </a>
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
                <span className="self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white sm:self-auto">
                  Premium Finish
                </span>
              </div>

              <div className="showcase-frame keychain-stage relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="absolute -left-16 -top-12 h-32 w-32 rounded-full bg-[#f97316]/35 blur-2xl" />
                <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-[#38bdf8]/35 blur-2xl" />
                <div className="keychain-shimmer" />

                <div className="relative">
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">Keychain Render</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">50MM X 30MM</p>
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
                            <img src="/photo.png" alt="Sample preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="keychain-label-strip mt-4 rounded-xl border border-white/20 bg-gradient-to-r from-white/10 to-[#7dd3fc]/20 p-3">
                    <p className="text-center text-sm font-semibold text-white">Ari and Kai</p>
                    <p className="mt-1 text-center text-xs text-slate-200">Scan to open your story</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-300">Starting Price</p>
                  <p className="text-2xl font-black text-white">PHP 199</p>
                  <p className="mt-1 text-xs text-slate-300">Buy 3+ items and save 8%</p>
                  <p className="mt-1 text-xs font-semibold text-sky-200">Available in QR-only and QR + NFC options</p>
                </div>
                <a
                  href="/create"
                  className="w-full rounded-full bg-[#f97316] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#ea580c] sm:w-auto"
                >
                  Customize
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-6">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/80 p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#0f172a] md:text-3xl">What You Get in Every Order</h2>
              <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white">Complete Package</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {INCLUDED_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#0f172a]/10 bg-white px-4 py-4">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                  <p className="text-sm font-medium text-[#334155]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-24 py-12 md:py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Featured Products</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Shop Our Keychain Collections</h2>
            </div>
            <a
              href={publicLinks.shopeeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#0f172a] underline underline-offset-4"
            >
              View full catalog
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {PRODUCT_HIGHLIGHTS.map((item) => (
              <article
                key={item.title}
                className="product-tile group rounded-3xl border border-[#0f172a]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="product-media h-44 rounded-2xl bg-gradient-to-br from-[#dbeafe] via-[#ffedd5] to-[#fef9c3]" />
                <h3 className="mt-5 text-xl font-bold text-[#0f172a]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#475569]">{item.subtitle}</p>
                <p className="mt-4 text-lg font-extrabold text-[#0f172a]">{item.price}</p>

                <div className="mt-4 flex gap-2">
                  <a
                    href={publicLinks.shopeeStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white"
                  >
                    Buy on Shopee
                  </a>
                  <a
                    href="/create"
                    className="rounded-full border border-[#0f172a] px-4 py-2 text-xs font-bold text-[#0f172a]"
                  >
                    Customize
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">More Formats</p>
                <h3 className="mt-1 text-2xl font-black text-[#0f172a]">Explore More Product Styles</h3>
              </div>
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full border border-[#0f172a]/15 bg-white px-4 py-2 text-xs font-bold text-[#0f172a] transition hover:bg-[#f8fafc] sm:inline-flex"
              >
                View All Products
              </a>
            </div>

            <div className="product-carousel -mx-4 overflow-x-auto px-4 pb-2">
              <div className="flex gap-4 min-w-max">
                {MORE_FORMATS.map((item) => (
                  <article
                    key={item.id}
                    className="w-[260px] shrink-0 rounded-3xl border border-[#0f172a]/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`h-32 rounded-2xl bg-gradient-to-br ${item.accent} p-[1px]`}>
                      <div className="flex h-full w-full flex-col justify-between rounded-[15px] bg-white/80 p-4">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl">{item.badge}</span>
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f172a]">
                            Format
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#0f172a]">{item.title}</p>
                      </div>
                    </div>

                    <h4 className="mt-4 text-lg font-black text-[#0f172a]">{item.title}</h4>
                    <p className="mt-2 text-sm text-[#475569]">{item.subtitle}</p>
                    <p className="mt-3 text-sm font-extrabold text-[#0f172a]">{item.price}</p>

                    <div className="mt-4">
                      <a
                        href="/create"
                        className="inline-flex rounded-full border border-[#0f172a]/15 px-4 py-2 text-xs font-bold text-[#0f172a] transition hover:bg-[#f8fafc]"
                      >
                        Request This Format
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:hidden">
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-[#0f172a]/15 bg-white px-4 py-2 text-xs font-bold text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                View All Products
              </a>
            </div>
          </div>
        </section>

        <section id="samples" className="scroll-mt-24 py-12 md:py-14">
          <div className="samples-shell relative overflow-hidden rounded-[2rem] border border-[#0f172a]/10 bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] md:p-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 right-12 h-40 w-40 rounded-full bg-[#fed7aa] opacity-60 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#dbeafe] opacity-60 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f172a]/10 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]">
                <span>Sample Websites</span>
              </div>

              <h2 className="display-title mt-4 text-4xl font-black leading-tight text-[#0f172a] md:text-5xl">
                Preview Real Demo Styles Before You Customize
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569] md:text-lg">
                Browse demo pages by occasion and quickly find the look that matches your story.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {sampleFilters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSampleFilter(item)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
                      sampleFilter === item
                        ? 'bg-[#0f172a] text-white shadow-lg'
                        : 'border border-[#0f172a]/10 bg-white text-[#334155] hover:border-[#0f172a]/25 hover:bg-[#f8fafc]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSamples.map((sample) => (
                  <article
                    key={sample.occasion}
                    className="group relative overflow-hidden rounded-3xl border border-[#0f172a]/10 bg-white/95 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${sample.accent}`} />

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#0f172a]/10 bg-[#f8fafc] text-xl shadow-sm">
                          {sample.badge}
                        </div>
                        <h3 className="text-xl font-black text-[#0f172a]">{sample.occasion}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                          {sample.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                          sample.status === 'Ready'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {sample.status}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <a
                        href={sample.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#111827]"
                      >
                        View Demo
                      </a>
                      <a
                        href="/create"
                        className="inline-flex items-center rounded-full border border-[#0f172a]/15 px-4 py-2 text-xs font-bold text-[#0f172a] transition hover:bg-[#f8fafc]"
                      >
                        Use This Style
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-12 md:py-14">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/80 p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">How It Works</p>
                <h2 className="mt-3 text-3xl font-black text-[#0f172a]">From Checkout to Scan in 4 Simple Steps</h2>
                <p className="mt-4 max-w-xl text-[#475569]">
                  You get a physical keepsake and a digital experience connected in one scan.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#334155]">
                    Choose between QR-only or QR + NFC access
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#334155]">
                    Fast production with quality control checks
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#334155]">
                    Perfect for couples, birthdays, and milestones
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {HOW_IT_WORKS_STEPS.map((step) => (
                  <div key={step.id} className="flex gap-3 rounded-2xl border border-[#0f172a]/10 bg-white p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f172a] text-sm font-bold text-white">
                      {step.id}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f172a]">{step.title}</p>
                      <p className="text-sm text-[#475569]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="shop-links" className="scroll-mt-24 py-12 md:py-14">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Shop Links</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Choose Where You Want to Order</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <article className="rounded-3xl border border-[#f97316]/30 bg-[#fff7ed] p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9a3412]">Recommended</p>
              <h3 className="mt-2 text-3xl font-black text-[#7c2d12]">Order Fast via Shopee</h3>
              <p className="mt-4 text-[#9a3412]">
                Browse ready-made bundles, promo pricing, and your most direct order path.
              </p>
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
              <h3 className="mt-2 text-2xl font-black text-[#075985]">Shop on TikTok</h3>
              <p className="mt-4 text-[#0c4a6e]">
                See videos, unboxings, and current product posts.
              </p>
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
              <h3 className="mt-2 text-2xl font-black text-[#14532d]">Find Deals on Lazada</h3>
              <p className="mt-4 text-[#166534]">
                Check listings, bundles, and storefront updates.
              </p>
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

        <section id="inquiry" className="scroll-mt-24 py-12 md:py-14">
          <div className="grid gap-6 rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Quick Contact</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a]">Need Help Choosing the Right Package?</h2>
              <p className="mt-3 text-[#475569]">
                Chat with us directly so we can recommend the best option for your occasion.
              </p>
              <p className="mt-3 text-sm text-[#64748b]">No forms needed. Choose your preferred channel below.</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#0f172a]/10 bg-white p-4">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0284c7] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0369a1]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.91 1.592 5.502 4.09 7.19V22l3.318-1.82c.885.244 1.82.37 2.792.37 5.523 0 10-4.145 10-9.25S17.523 2 12 2zm.9 12.65l-2.55-2.72-4.35 2.72 4.95-5.26 2.6 2.72 4.3-2.72-4.95 5.26z" />
                </svg>
                Message on Messenger
              </a>

              {whatsappDigits(publicLinks.whatsappNumber) && (
                <a
                  href={`https://wa.me/${whatsappDigits(publicLinks.whatsappNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-[#16a34a] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#15803d]"
                >
                  Chat on WhatsApp
                </a>
              )}

              {publicLinks.instagramUrl && (
                <a
                  href={publicLinks.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl border border-[#0f172a]/15 bg-[#f8fafc] px-4 py-3 text-center text-sm font-bold text-[#0f172a] transition hover:bg-[#eef2ff]"
                >
                  Open Instagram
                </a>
              )}

              {publicLinks.facebookPageUrl && (
                <a
                  href={publicLinks.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-[#1d4ed8] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#1e40af]"
                >
                  Visit our Facebook Page
                </a>
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 py-12 md:py-14">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-white/85 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#475569]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a] md:text-4xl">Questions Customers Usually Ask</h2>

            <div className="mt-6 space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="faq-item group rounded-2xl border border-[#0f172a]/10 bg-white p-4 open:border-[#0f172a]/30"
                >
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-[#0f172a]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-14">
          <div className="rounded-3xl border border-[#0f172a]/10 bg-[#0f172a] px-6 py-10 text-center text-white md:px-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Ready to launch your keepsake</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Your Story, Your Product, Your QR</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Start building your personalized keychain website or order through our storefront channels.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/create" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0f172a]">
                Customize Now
              </a>
              <a
                href={publicLinks.shopeeStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white"
              >
                Shopee
              </a>
            </div>
          </div>
        </section>

        <footer className="premium-footer border-t border-[#0f172a]/10 py-10 text-center text-sm text-[#475569]">
          <p className="font-semibold text-[#0f172a]">Keystory</p>
          <p className="mt-1">Premium QR keychains and memory websites.</p>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a href={publicLinks.shopeeStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Shopee
            </a>
            <a href={publicLinks.tiktokShopUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              TikTok
            </a>
            <a href={publicLinks.lazadaStoreUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Lazada
            </a>
            <a href="#samples" className="underline underline-offset-4">
              Sample Websites
            </a>
            <a href="/create" className="underline underline-offset-4">
              Customize
            </a>
          </div>

          <p className="mt-4">© 2026 Keystory</p>
        </footer>
      </main>

      <div className="fixed right-4 top-1/2 z-30 hidden w-40 -translate-y-1/2 space-y-2 rounded-2xl border border-[#0f172a]/10 bg-white/95 p-3 shadow-xl backdrop-blur lg:block">
        <a
          href="/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#020617]"
        >
          ✨ Customize
        </a>

        <a
          href={publicLinks.shopeeStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#EE4D2D] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 7h12l-1 13H7L6 7zm3-3a3 3 0 016 0h-2a1 1 0 00-2 0H9z" />
          </svg>
          Shopee
        </a>

        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.6 5.5 4.1 7.2V22l3.3-1.8c.9.2 1.8.3 2.8.3 5.5 0 10-4.1 10-9.2S17.5 2 12 2zm.9 12.6l-2.5-2.7-4.4 2.7 5-5.3 2.6 2.7 4.3-2.7-5 5.3z" />
          </svg>
          Message
        </a>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[#0f172a]/15 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a href="/create" className="rounded-xl bg-[#0f172a] px-3 py-3 text-center text-xs font-bold text-white">
            Customize
          </a>
          <a
            href={publicLinks.shopeeStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#f97316] px-3 py-3 text-center text-xs font-bold text-white"
          >
            Shopee
          </a>
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[#0f172a]/20 px-3 py-3 text-center text-xs font-bold text-[#0f172a]"
          >
            Message
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
          line-height: 1.02;
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
          background-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.92));
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

        .product-carousel {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.2) transparent;
        }

        .product-carousel::-webkit-scrollbar {
          height: 8px;
        }

        .product-carousel::-webkit-scrollbar-track {
          background: transparent;
        }

        .product-carousel::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.16);
          border-radius: 999px;
        }

        .samples-shell {
          background-image: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.92));
        }

        .faq-item {
          transition: all 220ms ease;
        }

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

function whatsappDigits(value: string | null) {
  return (value || '').replace(/\D/g, '');
}