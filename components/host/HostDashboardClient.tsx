"use client";

import React, { useEffect, useMemo, useState } from 'react';
import type { RsvpRecord } from '@/lib/db/rsvps';
import StatsCards from './StatsCards';
import Filters from './Filters';
import GuestList from './GuestList';

type FilterKey = 'all' | 'yes' | 'no' | 'godparent';
type SortKey = 'recent' | 'oldest' | 'name';

export default function HostDashboardClient({ initialRsvps, slug }: { initialRsvps: RsvpRecord[]; slug: string }) {
  const [rsvps, setRsvps] = useState<RsvpRecord[]>(initialRsvps || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('recent');

  useEffect(() => {
    let mounted = true;
    async function refresh() {
      try {
        setLoading(true);
        const res = await fetch(`/api/rsvp?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!mounted) return;
        if (data && Array.isArray(data.rsvps)) {
          setRsvps(data.rsvps);
        } else if (data && data.error) {
          setError(data.error.toString());
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load RSVPs');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // initial refresh
    refresh();
    // poll occasionally (optional)
    const iv = setInterval(refresh, 30 * 1000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [slug]);

  const totals = useMemo(() => {
    const total = rsvps.length;
    const yes = rsvps.filter((r) => r.attendance === 'yes').length;
    const no = rsvps.filter((r) => r.attendance === 'no').length;
    const maybe = rsvps.filter((r) => r.attendance === 'maybe').length;
    const companions = rsvps.reduce((acc, r) => acc + (r.companions || 0), 0);
    return { total, yes, no, maybe, companions };
  }, [rsvps]);

  const processed = useMemo(() => {
    let list = [...(rsvps || [])];
    if (filter === 'yes') list = list.filter((r) => r.attendance === 'yes');
    if (filter === 'no') list = list.filter((r) => r.attendance === 'no');
    if (filter === 'godparent') list = list.filter((r) => (r.godparent_confirmation || '').toLowerCase() === 'yes');

    if (sort === 'recent') {
      list.sort((a, b) => (b.created_at ? new Date(b.created_at).getTime() : 0) - (a.created_at ? new Date(a.created_at).getTime() : 0));
    } else if (sort === 'oldest') {
      list.sort((a, b) => (a.created_at ? new Date(a.created_at).getTime() : 0) - (b.created_at ? new Date(b.created_at).getTime() : 0));
    } else if (sort === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [rsvps, filter, sort]);

  function exportCsv(rows: RsvpRecord[]) {
    try {
      const escapeCell = (v: any) => {
        if (v === null || v === undefined) return '';
        const s = String(v);
        return `"${s.replace(/"/g, '""')}"`;
      };

      const header = ['Name', 'Attendance', 'Companions', 'Godparent', 'Message', 'Created At'];
      const lines = [header.map(escapeCell).join(',')];
      for (const r of rows) {
        const cols = [r.name, r.attendance, r.companions || 0, r.godparent_confirmation || '', r.message || '', r.created_at || ''];
        lines.push(cols.map(escapeCell).join(','));
      }

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug || 'rsvps'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export CSV failed', err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        {loading && <div className="mb-4 text-sm text-slate-500">Refreshing…</div>}
        <StatsCards totals={totals} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Filters active={filter} onChange={(f) => setFilter(f)} />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-slate-400 mr-2">Sort</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSort('recent')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === 'recent' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Most Recent
            </button>
            <button
              type="button"
              onClick={() => setSort('oldest')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === 'oldest' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Oldest
            </button>
            <button
              type="button"
              onClick={() => setSort('name')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === 'name' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Name
            </button>
          </div>

          <button
            type="button"
            onClick={() => exportCsv(processed)}
            className="ml-3 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm"
          >
            Export CSV
          </button>

          <div className="ml-4 text-xs text-slate-400">Showing <strong className="text-slate-700">{processed.length}</strong> guests</div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg">Error loading RSVPs: {error}</div>
      )}

      <div>
        <GuestList rsvps={processed} />
      </div>

      <footer className="pt-6 text-center text-xs text-slate-400">Made with love 💖</footer>
    </div>
  );
}
