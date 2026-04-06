'use client';
import dynamic from 'next/dynamic';
const PayMongoButton = dynamic(() => import('../ui/PayMongoButton'), { ssr: false });


import Link from 'next/link';
import { useMemo } from 'react';
import { BusinessContactSettings } from '@/lib/business-contact-settings';

interface ArchivedStateViewProps {
  slug: string;
  siteName?: string;
  expiresAt?: string;
  siteType?: string;
  status?: 'archived' | 'expired';
  settings?: BusinessContactSettings;
}

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/[\s()+-]/g, '').replace(/^\+/, '');
}

function formatMessengerUrl(settings: BusinessContactSettings, message: string): string | null {
  const encodedMessage = encodeURIComponent(message);
  if (settings.messengerUrl) {
    if (settings.messengerUrl.includes('?')) {
      return `${settings.messengerUrl}&text=${encodedMessage}`;
    }
    return `${settings.messengerUrl}?text=${encodedMessage}`;
  }
  if (settings.messengerUsername) {
    return `https://m.me/${settings.messengerUsername}?text=${encodedMessage}`;
  }
  return null;
}

function formatWhatsAppUrl(settings: BusinessContactSettings, message: string): string | null {
  const raw = settings.whatsappNumber;
  if (!raw) return null;
  const normalized = normalizeWhatsAppNumber(raw);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function formatEmailUrl(settings: BusinessContactSettings, message: string): string | null {
  const email = settings.supportEmail;
  if (!email) return null;
  const subject = encodeURIComponent('Restore site request');
  return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
}

export default function ArchivedStateView({ slug, siteName, expiresAt, siteType, status = 'archived', settings }: ArchivedStateViewProps) {
  const normalizedSettings: BusinessContactSettings = {
    whatsappNumber: null,
    messengerUsername: null,
    messengerUrl: null,
    supportEmail: null,
    businessName: null,
    restorePriceLabel: 'Restore for only ₱49',
    shopeeStoreUrl: null,
    tiktokShopUrl: null,
    lazadaStoreUrl: null,
    facebookPageUrl: null,
    instagramUrl: null,
    supportMessageTemplate: null,
    ...settings,
  };

  const baseLabel = siteName || slug || 'your memory';
  const formattedExpiration = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const rawMessage = normalizedSettings.supportMessageTemplate
    ? normalizedSettings.supportMessageTemplate
      .replace('{slug}', slug)
      .replace('{siteName}', baseLabel)
      .replace('{siteType}', siteType || '')
      .replace('{expiresAt}', formattedExpiration || '')
    : `Hi! I want to restore my website (slug: ${slug})`;

  const whatsappLink = formatWhatsAppUrl(normalizedSettings, rawMessage);
  const messengerLink = formatMessengerUrl(normalizedSettings, rawMessage);
  const emailLink = formatEmailUrl(normalizedSettings, rawMessage);

  const safePrimaryLink = messengerLink || whatsappLink || emailLink || '#';

  const anyContactAvailable = Boolean(whatsappLink || messengerLink || emailLink);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-100 p-6">
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl shadow-2xl border border-rose-100 dark:border-zinc-700 p-10 max-w-xl text-center">
        <p className="text-5xl leading-none">❤️</p>
        <h1 className="mt-4 text-3xl font-bold text-rose-700 dark:text-rose-300">
          {status === 'archived' ? 'This memory is safely stored ❤️' : 'Your memory is still important ❤️'}
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {status === 'archived'
            ? 'This page has been archived to save storage, but you can restore it anytime.'
            : 'This page has expired, but we can help bring it back quickly.'}
        </p>

        {/* PayMongo Payment Button */}
        <div className="mt-6 flex flex-col items-center">
          <PayMongoButton
            amount={49}
            websiteName={siteName || slug}
            customerName={''}
            customerEmail={normalizedSettings.supportEmail || ''}
            className="mb-2"
          />
          <span className="text-xs text-slate-500">Restore instantly via GCash, Card, or GrabPay</span>
        </div>

        <div className="mt-5 space-y-1 text-slate-500 dark:text-slate-400 text-sm">
          <p><span className="font-semibold text-slate-700 dark:text-slate-200">Memory:</span> {baseLabel}</p>
          {siteType && <p><span className="font-semibold text-slate-700 dark:text-slate-200">Type:</span> {siteType}</p>}
          {formattedExpiration && <p><span className="font-semibold text-slate-700 dark:text-slate-200">Original expiration:</span> {formattedExpiration}</p>}
          {normalizedSettings.businessName && <p><span className="font-semibold text-slate-700 dark:text-slate-200">Business:</span> {normalizedSettings.businessName}</p>}
        </div>

       

        <div className="mt-8 text-left">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">Need help? Message us</p>
          {!anyContactAvailable && (
            <p className="mt-3 text-sm text-slate-500">Please contact support to restore this memory.</p>
          )}

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => console.log('contact-whatsapp', { slug })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                WhatsApp
              </a>
            )}
            {messengerLink && (
              <a
                href={messengerLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => console.log('contact-messenger', { slug })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Messenger
              </a>
            )}
            {emailLink && (
              <a
                href={emailLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => console.log('contact-email', { slug })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Email
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-rose-600">Browse sample stories</Link>
        </div>
      </div>
    </main>
  );
}
