'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Site } from '@/lib/supabase';
import SearchInput from '@/components/admin/SearchInput';

type OrderStatus = 'pending_payment' | 'paid' | 'pack' | 'ship' | 'delivered' | 'abandoned';
const ORDER_STATUSES: OrderStatus[] = ['pending_payment', 'paid', 'pack', 'ship', 'delivered', 'abandoned'];

const getOrderStatus = (order: Site): OrderStatus => {
  const fulfillmentStatus = (order.config?.fulfillment?.status || '').toLowerCase();
  if (ORDER_STATUSES.includes(fulfillmentStatus as OrderStatus)) {
    return fulfillmentStatus as OrderStatus;
  }

  const rawStatus = (order.status || '').toLowerCase();
  if (ORDER_STATUSES.includes(rawStatus as OrderStatus)) {
    return rawStatus as OrderStatus;
  }

  if (rawStatus === 'active') {
    return order.config?.payment?.status === 'paid' ? 'ship' : 'paid';
  }

  if (rawStatus === 'pending') {
    if (order.config?.payment?.status === 'abandoned') {
      return 'abandoned';
    }

    return 'pending_payment';
  }

  return 'pending_payment';
};

const mapWorkflowStatusToSiteStatus = (status: OrderStatus): Site['status'] => {
  switch (status) {
    case 'pending_payment':
    case 'abandoned':
      return 'pending';
    case 'paid':
    case 'pack':
    case 'ship':
    case 'delivered':
      return 'active';
    default:
      return 'pending';
  }
};

const getWebsiteLink = (order: Site) => {
  if (!order.slug) return null;
  return `/site/${order.slug}`;
};

const getPrintStudioLink = (order: Site) => {
  if (!order.id) return null;
  return `/admin/websites/${order.id}/insert-print`;
};

const getNfcStudioLink = (order: Site) => {
  if (!order.id) return null;
  return `/admin/websites/${order.id}/nfc-lock`;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchOrders = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);

    try {
      let query = '?limit=100&sortBy=created_at&sortDirection=desc';
      if (searchQuery.trim()) {
        query += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const response = await fetch(`/api/orders${query}`);
      const result = await response.json();
      const fetchedOrders: Site[] = result.orders || [];

      const filteredOrders = statusFilter === 'all'
        ? fetchedOrders
        : fetchedOrders.filter((order) => getOrderStatus(order) === statusFilter);

      setOrders(filteredOrders);
      setTotal(result.total || filteredOrders.length);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setUpdatingOrderId(id);
    const previous = orders;

    setOrders((current) => current.map((order) => (
      order.id === id
        ? {
            ...order,
            status: mapWorkflowStatusToSiteStatus(status),
            config: {
              ...(order.config || {}),
              fulfillment: {
                ...(order.config?.fulfillment || {}),
                status,
              },
            },
          }
        : order
    )));

    const targetOrder = previous.find((order) => order.id === id);

    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: mapWorkflowStatusToSiteStatus(status),
          config: {
            ...(targetOrder?.config || {}),
            fulfillment: {
              ...(targetOrder?.config?.fulfillment || {}),
              status,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Status update failed', error);
      setOrders(previous);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return orders.reduce<Record<OrderStatus, number>>((acc, order) => {
      const status = getOrderStatus(order);
      acc[status] += 1;
      return acc;
    }, { pending_payment: 0, paid: 0, pack: 0, ship: 0, delivered: 0, abandoned: 0 });
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-slate-500">Track payment and fulfillment flow from paid to delivered.</p>
        </div>
        <div className="text-sm text-slate-500">Total orders: <span className="font-semibold text-slate-700">{total}</span></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[220px] max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by website, slug, or customer..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderStatus)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer hover:border-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="pack">Pack</option>
              <option value="ship">Ship</option>
              <option value="delivered">Delivered</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-700">Pending Payment: {statusCounts.pending_payment}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">Paid: {statusCounts.paid}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">Pack: {statusCounts.pack}</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">Ship: {statusCounts.ship}</span>
            <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-700">Delivered: {statusCounts.delivered}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">Abandoned: {statusCounts.abandoned}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No orders found for current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Created</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Website</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Slug</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Occasion</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Payment</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Transaction ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Website Link</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Studios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-slate-600">{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{order.website_name || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{order.slug}</td>
                    <td className="px-4 py-3 text-slate-600">{order.site_type || order.config?.occasion || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{order.customer_name || order.config?.orderDetails?.fullName || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{order.config?.payment?.status || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{order.config?.payment?.transactionId || '-'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={getOrderStatus(order)}
                        disabled={updatingOrderId === order.id}
                        onChange={(event) => {
                          if (!order.id) return;
                          updateOrderStatus(order.id, event.target.value as OrderStatus);
                        }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:opacity-60"
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="paid">Paid</option>
                        <option value="pack">Pack</option>
                        <option value="ship">Ship</option>
                        <option value="delivered">Delivered</option>
                        <option value="abandoned">Abandoned</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {getWebsiteLink(order) ? (
                        <a
                          href={getWebsiteLink(order)!}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Open Website
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No link</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.id ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={getPrintStudioLink(order)!}
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Print Studio
                          </a>
                          <a
                            href={getNfcStudioLink(order)!}
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            NFC Studio
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
