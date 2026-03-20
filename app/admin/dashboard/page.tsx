'use client';

import { useEffect, useState } from 'react';
import { Site } from '@/lib/supabase';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStatCard, { TotalWebsitesCard, WebsitesThisMonthCard, PublishedWebsitesCard } from '@/components/admin/DashboardStatCard';
import EmptyState from '@/components/admin/EmptyState';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Array<{event_type:string; source:string | null; created_at:string}>>([]);

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setTotalVisits(data.totalVisits || 0);
      setTotalQrScans(data.totalQrScans || 0);
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

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

  const now = new Date();
  const totalWebsites = orders.length;
  const thisMonthCount = orders.filter(o => {
    const created = new Date(o.created_at || '');
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const areExpired = (site: typeof orders[number]) => {
    const status = (site.status || 'active').toString().toLowerCase();
    if (status === 'archived' || status === 'expired') return true;
    if (!site.expires_at) return false;
    return new Date(site.expires_at).getTime() < Date.now();
  };

  const activeSites = orders.filter(site => !areExpired(site)).length;
  const expiredSites = orders.filter(areExpired).length;
  const expiringSoon = orders.filter(site => {
    const status = (site.status || 'active').toString().toLowerCase();
    if (status !== 'active') return false;
    if (!site.expires_at) return false;
    const expires = new Date(site.expires_at).getTime();
    const days = (expires - Date.now()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 30;
  }).length;

  const publishedWebsites = activeSites;
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
        <PublishedWebsitesCard count={publishedWebsites} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Expiring Soon (30d)</p>
          <h3 className="text-3xl font-bold text-rose-900">{expiringSoon}</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Expired Sites</p>
          <h3 className="text-3xl font-bold text-rose-900">{expiredSites}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Visits</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalVisits}</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total QR Scans</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalQrScans}</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Recent Analytics Events</p>
          <p className="mt-3 text-sm text-slate-700">{recentActivity.slice(0, 4).map((event, idx) => (
            <span key={idx} className="block">{new Date(event.created_at).toLocaleString()} - {event.event_type}</span>
          ))}</p>
        </div>
      </div>

      {/* Helpful Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Next Steps</h3>
            <p className="text-sm text-slate-500 mt-2">Guided actions to keep your site moving forward.</p>
            <ul className="mt-4 space-y-2">
              {[
                'Finish setting up your website',
                'Generate QR keepsake',
                'Publish your website',
                'Share your website link',
              ].map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="text-sm text-slate-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Website Activity</h3>
            <p className="text-sm text-slate-500 mt-2">Recent actions from your site network.</p>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Website created', timestamp: '2h ago' },
                { label: 'QR generated', timestamp: '5h ago' },
                { label: 'Guest message received', timestamp: '1d ago' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">•</span>
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-xs text-slate-400">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Website Stats</h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total Websites</p>
              <p className="text-xl font-semibold text-slate-900">{totalWebsites}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Created This Month</p>
              <p className="text-xl font-semibold text-slate-900">{thisMonthCount}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Published Websites</p>
              <p className="text-xl font-semibold text-slate-900">{publishedWebsites}</p>
            </div>
          </div>
        </div>
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
            {recentWebsites.map((order) => {
              const siteType = order.site_type || (order.config?.occasion || 'General');
              const siteSlug = order.slug || order.website_name || '';
              return (
                <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                        {((order.website_name || order.slug || 'W')[0] || 'W').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {order.website_name || order.slug || 'Untitled Website'}
                        </p>
                        <p className="text-sm text-slate-500">{siteType}</p>
                        <p className="text-xs text-slate-400">Created: {formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/websites/${order.id}/edit`}
                        className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/site/${siteSlug}`}
                        className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg hover:bg-slate-200"
                        target="_blank"
                      >
                        Preview
                      </Link>
                      <a
                        href={`/site/${siteSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-white bg-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-700"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

