'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type ActivityItem = { event_type: string; source: string | null; created_at: string };

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const [visitsThisWeek, setVisitsThisWeek] = useState(0);
  const [visitsThisMonth, setVisitsThisMonth] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

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
          <p className="text-sm text-slate-500">Track page visits and QR engagement for this site.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/websites/${siteId}/edit`}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >Back to Edit</Link>
          <button
            onClick={fetchAnalytics}
            className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
          >Refresh</button>
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
