"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BusinessContactSettings } from '@/lib/business-contact-settings';

const PayMongoButton = dynamic(
  () =>
    import('../ui/PayMongoButton').then((mod) => mod.default) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

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

function formatMessengerUrl(
  settings: BusinessContactSettings,
  message: string
): string | null {
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

function formatWhatsAppUrl(
  settings: BusinessContactSettings,
  message: string
): string | null {
  const raw = settings.whatsappNumber;
  if (!raw) return null;

  const normalized = normalizeWhatsAppNumber(raw);
  if (!normalized) return null;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function formatEmailUrl(
  settings: BusinessContactSettings,
  message: string
): string | null {
  const email = settings.supportEmail;
  if (!email) return null;

  const subject = encodeURIComponent('Restore memory request');
  return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
}

function ShieldCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3l7 3v5c0 4.5-2.9 8.7-7 10-4.1-1.3-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m9.5 12 1.7 1.7 3.8-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10V8a4 4 0 118 0v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.3 2.2 2.2 4.8-5.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArchivedStateView({
  slug,
  siteName,
  expiresAt,
  siteType,
  status = 'archived',
  settings,
}: ArchivedStateViewProps) {
  const normalizedSettings: BusinessContactSettings = {
    whatsappNumber: null,
    messengerUsername: null,
    messengerUrl: null,
    supportEmail: null,
    businessName: null,
    restorePriceLabel: 'Restore access for only PHP 49',
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
    ? new Date(expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const rawMessage = normalizedSettings.supportMessageTemplate
    ? normalizedSettings.supportMessageTemplate
        .replace('{slug}', slug)
        .replace('{siteName}', baseLabel)
        .replace('{siteType}', siteType || '')
        .replace('{expiresAt}', formattedExpiration || '')
    : `Hi! I want to restore my memory page (slug: ${slug}).`;

  const whatsappLink = formatWhatsAppUrl(normalizedSettings, rawMessage);
  const messengerLink = formatMessengerUrl(normalizedSettings, rawMessage);
  const emailLink = formatEmailUrl(normalizedSettings, rawMessage);

  const anyContactAvailable = Boolean(
    whatsappLink || messengerLink || emailLink
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const payment = searchParams?.get?.('payment');
      if (payment === 'success') {
        setShowSuccessBanner(true);
        setVerifying(true);

        // remove the query param so UI stays clean (replace state)
        const url = new URL(window.location.href);
        url.searchParams.delete('payment');
        url.searchParams.delete('orderId');
        router.replace(url.pathname + url.search);

        (async () => {
          try {
            const res = await fetch('/api/paymongo/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug }),
            });
            const json = await res.json().catch(() => ({}));
            if (res.ok && json?.success) {
              setVerifyMessage('Payment successful — restoring your page now.');
              // Give the user a moment to read the message, then navigate to the site
              setTimeout(() => {
                try {
                  router.replace(`/site/${slug}`);
                } catch (e) {
                  // ignore navigation errors
                }
              }, 900);
            } else {
              setVerifyMessage('Payment recorded. Verifying on the server — this may take a few moments.');
            }
          } catch (e) {
            setVerifyMessage('Verification request failed. We will update your page when payment is processed.');
          } finally {
            setVerifying(false);
          }
        })();
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title =
    status === 'archived'
      ? 'This memory is archived'
      : 'This memory has expired';

  const subtitle =
    status === 'archived'
      ? 'Your page is currently hidden from public view, but it is safely stored and ready to restore anytime.'
      : 'Your page is no longer active, but your memory is still securely stored and can be restored instantly after payment.';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f8_0%,#fff1f2_35%,#ffffff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid min-h-[calc(100vh-4rem)] items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          {/* LEFT SIDE */}
          <section className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700">
              <span className="text-sm">❤️</span>
              Memory Restore
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>

            {showSuccessBanner && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-700" />
                  <div>
                    <div className="font-semibold">{verifying ? 'Verifying payment…' : verifyMessage ? 'Payment successful' : 'Payment successful'}</div>
                    <div className="text-sm">{verifying ? 'Please wait while we verify your payment on the server.' : verifyMessage || 'Thanks — your restore is being processed. If it does not appear shortly, contact support.'}</div>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              {subtitle}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold">Secure payment</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Checkout is handled securely through PayMongo.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <ClockIcon className="h-5 w-5 text-rose-600" />
                  <p className="text-sm font-semibold">Instant restore</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Once payment is completed, your page can be restored right away.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <LockIcon className="h-5 w-5 text-sky-600" />
                  <p className="text-sm font-semibold">Memory protected</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your story stays stored even when public access has expired.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-5 sm:p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Restore Summary
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">
                    {baseLabel}
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Status:</span>{' '}
                      {status === 'archived' ? 'Archived' : 'Expired'}
                    </p>
                    {siteType && (
                      <p>
                        <span className="font-medium text-slate-800">Type:</span>{' '}
                        {siteType}
                      </p>
                    )}
                    {formattedExpiration && (
                      <p>
                        <span className="font-medium text-slate-800">
                          Previous expiration:
                        </span>{' '}
                        {formattedExpiration}
                      </p>
                    )}
                    {normalizedSettings.businessName && (
                      <p>
                        <span className="font-medium text-slate-800">Handled by:</span>{' '}
                        {normalizedSettings.businessName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="min-w-[180px] rounded-2xl border border-rose-100 bg-white p-4 text-left shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    What you get
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>Restore page access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>Secure hosted memory page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <span>Receipt sent to your email</span>
                    </li>
                  </ul>

                  <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Restore fee</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">PHP 49</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Need help with your restore?
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Contact support if you have payment or restore concerns.
                  </p>
                </div>
              </div>

              {!anyContactAvailable && (
                <p className="mt-4 text-sm text-slate-600">
                  Please contact support to restore this memory.
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {messengerLink && (
                  <a
                    href={messengerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    Messenger
                  </a>
                )}

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    WhatsApp
                  </a>
                )}

                {emailLink && (
                  <a
                    href={emailLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span>Secure checkout</span>
              <span className="hidden sm:inline">•</span>
              <span>Instant payment link</span>
              <span className="hidden sm:inline">•</span>
              <Link href="/" className="font-medium text-slate-600 hover:text-rose-600">
                Browse sample stories
              </Link>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] sm:p-5 lg:sticky lg:top-8">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Checkout
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Restore access
                  </h2>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Verified secure
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {baseLabel}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Restore payment
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Amount due</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      PHP 49
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <PayMongoButton
  amount={49}
  websiteName={siteName || slug}
  customerName=""
  customerEmail=""
  className="w-full"
    successPath={`/site/${slug}`}
    cancelPath={`/site/${slug}`}
    flowType="extension"
    slug={slug}
/>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Payments are processed securely via PayMongo. We do not store your
                card or wallet details on this page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}