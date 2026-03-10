'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/supabase';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStatCard, { TotalWebsitesCard, WebsitesThisMonthCard, QuickActionsCard } from '@/components/admin/DashboardStatCard';
import EmptyState from '@/components/admin/EmptyState';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalWebsites = orders.length;
  const thisMonthCount = orders.filter(o => {
    const created = new Date(o.created_at || '');
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const recentWebsites = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminHeader 
        title="Dashboard" 
        showCreateButton
        createButtonLabel="Create Website"
        createButtonHref="/admin/websites/create"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalWebsitesCard count={totalWebsites} />
        <WebsitesThisMonthCard count={thisMonthCount} />
        <QuickActionsCard />
      </div>

      {/* Recent Websites */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recently Created Websites</h2>
            <Link 
              href="/admin/websites" 
              className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
            >
              View All 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {recentWebsites.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No websites yet"
              description="Create your first couple website to get started."
              actionLabel="Create Website"
              actionHref="/admin/websites/create"
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentWebsites.map((order) => (
              <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {order.customer_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.website_name || order.slug}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customer_name} & {order.partner_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {formatDate(order.created_at)}
                    </span>
                    <a
                      href={`/love/${order.website_name || order.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="View website"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

