'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type ActivityItem = { event_type: string; source: string | null; created_at: string };
type InteractionCount = { event_type: string; count: number };

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean | null>(null);
  const [toggling, setToggling] = useState(false);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [visitsThisWeek, setVisitsThisWeek] = useState(0);
  const [visitsThisMonth, setVisitsThisMonth] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [interactionCounts, setInteractionCounts] = useState<InteractionCount[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    // fetch analytics flag
    try {
      const flagRes = await fetch(`/api/admin/sites/${encodeURIComponent(siteId)}/analytics`);
      const flagData = await flagRes.json();
      if (flagRes.ok) {
        setAnalyticsEnabled(!!flagData.analytics_enabled);
      }
    } catch (e) {
      // non-fatal; defaults apply
    }

    try {
      const res = await fetch(`/api/admin/analytics?site_id=${encodeURIComponent(siteId)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
      setTotalVisits(data.totalVisits || 0);
      setTotalQrScans(data.totalQrScans || 0);
      setLastVisited(data.lastVisited || null);
      setVisitsThisWeek(data.visitsThisWeek || 0);
      setVisitsThisMonth(data.visitsThisMonth || 0);
      setTotalInteractions(data.totalInteractions || 0);
      setInteractionCounts(data.interactionCounts || []);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!siteId) return;
    fetchAnalytics();
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Analytics</h1>
          <p className="text-sm text-slate-500">Track visits, QR engagement, and public interaction events for this site.</p>
        </div>
          <div className="flex gap-2 items-center">
            <Link
              href={`/admin/websites/${siteId}/edit`}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >Back to Edit</Link>
            <button
              onClick={fetchAnalytics}
              className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
            >Refresh</button>

            <div className="ml-2 flex items-center gap-3">
              <div className="text-sm text-slate-500">Analytics</div>
              <button
                disabled={toggling || analyticsEnabled === null}
                onClick={async () => {
                  if (analyticsEnabled === null) return;
                  setToggling(true);
                  const next = !analyticsEnabled;
                  try {
                    const res = await fetch(`/api/admin/sites/${encodeURIComponent(siteId)}/analytics`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ enabled: next }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setAnalyticsEnabled(!!data.analytics_enabled);
                    } else {
                      console.error('Failed to update analytics flag', data);
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setToggling(false);
                  }
                }}
                className={`rounded-xl px-3 py-2 text-sm ${analyticsEnabled ? 'bg-green-600 text-white' : 'border border-slate-300 bg-white'}`}
              >
                {analyticsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Total Visits</p>
          <p className="text-3xl font-bold text-slate-900">{totalVisits}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Total QR Scans</p>
          <p className="text-3xl font-bold text-slate-900">{totalQrScans}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Last Visit</p>
          <p className="text-lg font-semibold text-slate-800">{lastVisited ? new Date(lastVisited).toLocaleString() : 'No visits yet'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Visits This Week</p>
          <p className="text-2xl font-bold text-slate-900">{visitsThisWeek}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Visits This Month</p>
          <p className="text-2xl font-bold text-slate-900">{visitsThisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Tracked Interactions</p>
          <p className="text-2xl font-bold text-slate-900">{totalInteractions}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500 uppercase">Top Interaction</p>
          <p className="text-lg font-semibold text-slate-800">{interactionCounts[0] ? `${interactionCounts[0].event_type} (${interactionCounts[0].count})` : 'No interactions yet'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Interaction Breakdown</h2>
        {interactionCounts.length === 0 ? (
          <p className="text-sm text-slate-500">No tracked interactions yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {interactionCounts.map((item) => (
              <div key={item.event_type} className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase text-slate-500">{item.event_type}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet for this site.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {recentActivity.map((item, idx) => (
              <li key={`${item.created_at}-${idx}`} className="flex justify-between rounded-lg bg-slate-50 p-2">
                <span>{new Date(item.created_at).toLocaleString()}</span>
                <span className="font-semibold text-slate-800">{item.event_type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
