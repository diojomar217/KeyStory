import React, { useEffect, useMemo, useState } from 'react';

interface PayMongoButtonProps {
  amount: number;
  websiteName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferredMethod?: 'gcash' | 'card' | 'grab_pay';
  orderId?: string;
  successPath?: string;
  cancelPath?: string;
  className?: string;
  flowType?: 'create' | 'extension';
  slug?: string;
}

type PaymentMethod = 'gcash' | 'card' | 'grab_pay';

const PAYMENT_METHODS: Array<{
  key: PaymentMethod;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    key: 'gcash',
    label: 'GCash',
    shortLabel: 'GC',
    description: 'Fast wallet checkout',
  },
  {
    key: 'card',
    label: 'Card',
    shortLabel: 'CC',
    description: 'Visa or Mastercard',
  },
  {
    key: 'grab_pay',
    label: 'GrabPay',
    shortLabel: 'GP',
    description: 'Pay with GrabPay',
  },
];

function LockIcon({ className = 'h-4 w-4' }: { className?: string }) {
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
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8.5 12.3 2.2 2.2 4.8-5.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MethodBadge({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-8 min-w-[40px] items-center justify-center rounded-lg border text-xs font-bold ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {label}
    </div>
  );
}

const PayMongoButton: React.FC<PayMongoButtonProps> = ({
  amount,
  websiteName,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  preferredMethod = 'gcash',
  orderId = '',
  successPath,
  cancelPath,
  className = '',
  flowType = 'create',
  slug,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const [name, setName] = useState(customerName || '');
  const [email, setEmail] = useState(customerEmail || '');
  const [preferred, setPreferred] = useState<PaymentMethod>(preferredMethod);

  useEffect(() => {
    try {
      if (!name) {
        const storedName = localStorage.getItem('ks_customer_name');
        if (storedName) setName(storedName);
      }

      if (!email) {
        const storedEmail = localStorage.getItem('ks_customer_email');
        if (storedEmail) setEmail(storedEmail);
      }
    } catch {
      // ignore localStorage issues
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatted = useMemo(
  () =>
    `PHP ${new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`,
  [amount]
);

  const selectedMethod = useMemo(
    () => PAYMENT_METHODS.find((item) => item.key === preferred),
    [preferred]
  );

  const handlePay = async () => {
    setError(null);
    setInfo(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address for your receipt.');
      return;
    }

    setLoading(true);

    try {
      // Debug: log outgoing checkout payload
      const payload = {
        amount,
        websiteName,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone,
        preferredMethod: preferred,
        orderId,
        successPath: successPath || undefined,
        cancelPath: cancelPath || undefined,
        flowType,
        ...(slug ? { slug } : {}),
      };
      try {
        console.log('[PAYMONGO/CLIENT] starting checkout', payload);
      } catch (e) {
        // ignore console errors in restricted envs
      }
      if (flowType === 'extension' && (!slug || !String(slug).trim())) {
        setError('Missing site identifier (slug) for extension payments.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/paymongo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      try {
        console.log('[PAYMONGO/CLIENT] checkout response', { ok: res.ok, status: res.status, body: data });
      } catch (e) {
        // ignore console errors
      }

      if (data.success && data.checkoutUrl) {
        try {
          localStorage.setItem('ks_customer_name', name.trim());
          localStorage.setItem('ks_customer_email', email.trim());
        } catch {
          // ignore localStorage issues
        }

        setCheckoutUrl(data.checkoutUrl);
        setInfo(
          'Checkout opened in a new tab. Complete the payment there to restore your page.'
        );

        try {
          window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
        } catch {
          setInfo(
            'Payment link created. Use the button below if the new tab did not open.'
          );
        }
      } else {
        setError(data.message || 'Unable to start payment.');
      }
    } catch {
      setError('Unable to start payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Secure Checkout
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Restore payment
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              <LockIcon className="h-4 w-4" />
              Protected
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">For</p>
              <p className="mt-1 max-w-[220px] truncate text-sm font-medium text-slate-900">
                {websiteName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">Amount</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {formatted}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6">
          {/* Payment Methods */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-900">
                Select payment method
              </p>

              <div className="hidden items-center gap-2 sm:flex">
                <MethodBadge label="VISA" />
                <MethodBadge label="MC" />
                <MethodBadge label="GC" active={preferred === 'gcash'} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => {
                const active = preferred === method.key;

                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPreferred(method.key)}
                    aria-pressed={active}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{method.label}</span>
                      <span
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                          active
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {method.shortLabel}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-xs leading-5 ${
                        active ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {method.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="mt-5 grid gap-4">
            <div>
              <label
                htmlFor="customer-name"
                className="block text-sm font-medium text-slate-900"
              >
                Full name
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Used for payment record and support verification.
              </p>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                aria-label="Full name"
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="receipt-email"
                className="block text-sm font-medium text-slate-900"
              >
                Email for receipt
              </label>
              <p className="mt-1 text-xs text-slate-500">
                We’ll use this to send your payment receipt and restore confirmation.
              </p>

              <input
                id="receipt-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                aria-label="Email address"
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                required
              />
            </div>
          </div>

          {/* Selected Method Info */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Paying with {selectedMethod?.label || 'your selected method'}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  You will be redirected to a secure PayMongo payment page to complete your checkout.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5">
            <button
              type="button"
              disabled={loading}
              onClick={handlePay}
              className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                loading
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading ? 'Preparing secure checkout…' : `Pay ${formatted} to restore`}
            </button>

            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Open checkout manually
              </a>
            )}
          </div>

          {/* Messages */}
          <div aria-live="polite" className="mt-4 space-y-2">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {info && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {info}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Processed securely by PayMongo</p>
              <p>We do not store your payment details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayMongoButton;