'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import QRCard from '@/components/product/QRCard';
import PrintableCardLayout from '@/components/product/PrintableCardLayout';
import PrintActions from '@/components/product/PrintActions';
import { Order } from '@/lib/supabase';
import { Theme } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QRCardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Get theme from order config
  const config = order.config || {};
  const theme: Theme = (config.theme as Theme) || 'romantic_classic';
  const qrDataUrl = config.qr_data_url;
  const qrCodeUrl = order.qr_code_url;
  
  // Get website URL
  const websiteUrl = order.website_name 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/love/${order.website_name}`
    : undefined;

  return (
    <>
      {/* Header - Hidden when printing */}
      <div className="print:hidden mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Printable QR Card</h1>
            <p className="text-slate-500 mt-1">
              {order.customer_name} & {order.partner_name}
            </p>
          </div>
          <a 
            href="/admin/websites" 
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Websites
          </a>
        </div>
      </div>

      {/* QR Card Display */}
      <div className="print:p-0">
        <PrintableCardLayout>
          <QRCard
            theme={theme}
            customerName={order.customer_name}
            partnerName={order.partner_name}
            anniversaryDate={order.anniversary_date}
            qrCodeUrl={qrCodeUrl}
            qrDataUrl={qrDataUrl}
            websiteUrl={websiteUrl}
            layout="classic"
            size="medium"
            className="mx-auto"
          />
        </PrintableCardLayout>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="print:hidden mt-8 flex flex-wrap gap-4 justify-center">
        {/* Keychain Print Link */}
        <a
          href={`/admin/websites/${id}/keychain-print`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium rounded-xl transition-all duration-200 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Keychain Inserts
        </a>

        {/* Print Actions */}
        <PrintActions
          customerName={order.customer_name}
          partnerName={order.partner_name}
          qrDataUrl={qrDataUrl}
          qrCodeUrl={qrCodeUrl}
        />
      </div>

      {/* Help text - Hidden when printing */}
      <div className="print:hidden text-center mt-6 text-sm text-slate-500">
        <p>Tip: Use Ctrl+P (or Cmd+P on Mac) to print this card.</p>
        <p className="mt-1">The card is optimized for standard paper sizes.</p>
      </div>
    </>
  );
}

