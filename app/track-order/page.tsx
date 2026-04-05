'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type TrackedOrder = {
  id: string;
  slug: string;
  websiteName: string;
  status: string;
  createdAt: string;
  transactionId: string;
};

const getStatusTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'paid') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (normalized === 'pack') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (normalized === 'ship') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (normalized === 'delivered') return 'bg-purple-50 text-purple-700 border-purple-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

export default function TrackOrderPage() {
  const params = useSearchParams();
  const initialTx = params.get('transactionId') || '';

  const [transactionId, setTransactionId] = useState(initialTx);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const statusTone = useMemo(() => getStatusTone(order?.status || ''), [order?.status]);

  const trackOrder = async (tx: string) => {
    const trimmed = tx.trim();
    if (!trimmed) {
      setError('Please enter a transaction ID.');
      setOrder(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/track?transactionId=${encodeURIComponent(trimmed)}`);
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Order not found');
      }

      setOrder(result.order);
    } catch (err) {
      setOrder(null);
      setError((err as Error).message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTx) {
      trackOrder(initialTx);
    }
  }, [initialTx]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await trackOrder(transactionId);
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10 text-[#0f172a] md:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Order Tracking</p>
            <h1 className="mt-2 text-3xl font-black">Track Your Order</h1>
            <p className="mt-2 text-sm text-[#475569]">Enter your transaction ID to view the latest order status.</p>
          </div>
          <Link href="/" className="inline-flex rounded-full border border-[#0f172a]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a]">
            Back to Home
          </Link>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[#0f172a]/10 bg-white p-5 shadow-sm">
          <label htmlFor="tx-id" className="text-sm font-semibold text-slate-700">Transaction ID</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="tx-id"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. csn_..."
              className="w-full rounded-xl border border-[#0f172a]/20 px-3 py-2.5"
            />
            <button type="submit" disabled={loading} className="rounded-full bg-[#0f172a] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
        </form>

        {order && (
          <section className="rounded-2xl border border-[#0f172a]/10 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900">{order.websiteName || 'Order'}</h2>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone}`}>
                {order.status}
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <p><strong>Created:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</p>
              <p><strong>Website Slug:</strong> {order.slug}</p>
              <p>
                <strong>Website:</strong>{' '}
                <a href={`/site/${order.slug}`} className="font-semibold text-rose-700 underline underline-offset-4" target="_blank" rel="noreferrer">
                  Open Website
                </a>
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
