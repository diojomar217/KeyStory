'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStatCard, { TotalWebsitesCard, WebsitesThisMonthCard, PublishedWebsitesCard } from '@/components/admin/DashboardStatCard';
import EmptyState from '@/components/admin/EmptyState';

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [interactionCounts, setInteractionCounts] = useState<Array<{ event_type: string; count: number }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{event_type:string; source:string | null; created_at:string}>>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-summary');
        if (!res.ok) throw new Error('Failed to fetch dashboard summary');
        const data = await res.json();
        setDashboardStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setTotalVisits(data.totalVisits || 0);
        setTotalQrScans(data.totalQrScans || 0);
        setTotalInteractions(data.totalInteractions || 0);
        setInteractionCounts(data.interactionCounts || []);
        setRecentActivity(data.recentActivity || []);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchDashboardStats();
    fetchAnalytics();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatActivityTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return 'Page View';
      case 'qr_scan':
        return 'QR Scan';
      case 'section_view':
        return 'Section View';
      case 'share_click':
        return 'Share Click';
      case 'download_card':
        return 'Keepsake Download';
      case 'music_play':
        return 'Music Play';
      case 'opening_reveal':
        return 'Opening Reveal';
      default:
        return eventType
          .split('_')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
    }
  };

  const totalWebsites = dashboardStats?.totalWebsites || 0;
  const thisMonthCount = dashboardStats?.thisMonthCount || 0;
  const publishedWebsites = dashboardStats?.publishedWebsites || 0;
  const expiringSoon = dashboardStats?.expiringSoon || 0;
  const expiredSites = dashboardStats?.expiredSites || 0;
  const pendingGuestMessages = dashboardStats?.pendingGuestMessages || 0;
  const sitesWithPendingGuestMessages = dashboardStats?.sitesWithPendingGuestMessages || 0;
  const recentWebsites = dashboardStats?.recentWebsites || [];
  const recentActivityLogs = dashboardStats?.recentActivity || [];
  const topInteraction = interactionCounts[0] || null;
  const backendErrors = Array.isArray(dashboardStats?.errors)
    ? dashboardStats.errors.filter((err: any) => {
        if (!err) return false;
        if (typeof err === 'string') return err.trim() !== '';
        if (typeof err === 'object') {
          return Boolean(err.message || err.hint || err.code || err.details);
        }
        return true;
      })
    : [];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
              <div className="h-4 w-1/3 bg-slate-200 rounded mb-4" />
              <div className="h-8 w-1/2 bg-slate-300 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton for Expiring/Expired */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
              <div className="h-4 w-1/3 bg-slate-200 rounded mb-4" />
              <div className="h-8 w-1/2 bg-slate-300 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton for Recent Websites */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-3 w-1/3 bg-slate-100 rounded" />
                  <div className="h-3 w-1/4 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Backend Errors */}
      {backendErrors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-4">
          <strong>Backend Errors:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            {backendErrors.map((err: any, idx: number) => (
              <li key={idx}>
                {typeof err === 'string'
                  ? err
                  : err.message || err.details || 'Unexpected backend error'}
                {err.context && (
                  <span className="ml-2 text-rose-600">[{err.context}]</span>
                )}
                {err.hint && <span className="ml-2 italic text-rose-500">({err.hint})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
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
        <DashboardStatCard
          title="Pending Guest Messages"
          value={pendingGuestMessages}
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m-7 6 2.8-2.8a2 2 0 011.414-.586H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h1v4z" />
            </svg>
          }
          iconBgColor="bg-gradient-to-br from-fuchsia-100 to-pink-100"
          iconColor="text-fuchsia-600"
          action={{
            label: sitesWithPendingGuestMessages > 0
              ? `${sitesWithPendingGuestMessages} site${sitesWithPendingGuestMessages === 1 ? '' : 's'} need review`
              : 'View websites',
            href: sitesWithPendingGuestMessages > 0 
              ? '/admin/websites?guestMessageFilter=pending' 
              : '/admin/websites',
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Visits</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalVisits}</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total QR Scans</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalQrScans}</h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Interactions</p>
          <h3 className="text-3xl font-bold text-slate-900">{totalInteractions}</h3>
          <p className="mt-2 text-xs text-slate-500">Excludes page views and QR scans</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Top Interaction</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {topInteraction ? formatEventLabel(topInteraction.event_type) : 'No data yet'}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {topInteraction ? `${topInteraction.count} total events` : 'Public engagement will appear here'}
          </p>
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
              {recentActivityLogs.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No recent activity yet.</p>
              ) : (
                recentActivityLogs.slice(0, 5).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">•</span>
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatActivityTime(item.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
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

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Engagement Snapshot</h3>
            <p className="mt-2 text-sm text-slate-500">Most common public interactions across all live site visits.</p>
            <div className="mt-4 space-y-3">
              {interactionCounts.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No interaction data yet.</p>
              ) : (
                interactionCounts.slice(0, 4).map((item) => (
                  <div key={item.event_type} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
                    <span className="text-sm font-medium text-slate-700">{formatEventLabel(item.event_type)}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Recent Analytics</p>
              <div className="mt-3 space-y-2">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-slate-500">No recent analytics events yet.</p>
                ) : (
                  recentActivity.slice(0, 4).map((event, idx) => (
                    <div key={`${event.created_at}-${event.event_type}-${idx}`} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{formatEventLabel(event.event_type)}</p>
                        <p className="text-xs text-slate-500">
                          {event.source ? `Source: ${event.source}` : 'Tracked from public site'}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-slate-400">{formatActivityTime(event.created_at)}</span>
                    </div>
                  ))
                )}
              </div>
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
            {recentWebsites.map((order: any) => {
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

