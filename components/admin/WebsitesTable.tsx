'use client';

import { useState, useMemo, useCallback } from 'react';

// Reusable sortable header component
function SortableHeader({
  column,
  label,
  sortBy,
  sortDirection,
  onSortChange,
}: {
  column: string;
  label: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}) {
  const isActive = sortBy === column;
  const ariaSort = isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';
  return (
    <th
      className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors duration-150 ${isActive ? 'text-rose-600' : 'text-slate-600'} hover:bg-rose-50`}
      onClick={() => onSortChange(column)}
      aria-sort={ariaSort}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSortChange(column); }}
      title={`Sort by ${label}`}
      role="columnheader"
    >
      {label}
      {isActive && (
        <span className="ml-1 inline-block align-middle text-base font-bold text-rose-600">
          {sortDirection === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </th>
  );
}
import { Site } from '@/lib/supabase';
import SearchInput from './SearchInput';
import WebsiteRow from './WebsiteRow';
import MobileWebsiteCard from './MobileWebsiteCard';


interface WebsitesTableProps {
  orders: Site[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'active' | 'expired' | 'archived';
  onStatusFilterChange: (status: 'all' | 'active' | 'expired' | 'archived') => void;
  onRefresh?: () => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  loading?: boolean;
}

import type { ThemeKey } from '@/config/themeConfig';
type ThemeFilter = 'all' | ThemeKey;
type StatusFilter = 'all' | 'active' | 'expired' | 'archived';

const getStatusFromOrder = (order: Site) => {
  const status = (order.status || 'active').toLowerCase();
  if (status === 'archived') return 'archived';
  const expiresAt = order.expires_at ? new Date(order.expires_at) : null;
  if (status === 'expired' || (expiresAt && expiresAt.getTime() < Date.now())) return 'expired';
  return 'active';
};

export default function WebsitesTable({
  orders,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onDelete,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  sortBy,
  sortDirection,
  onSortChange,
  loading = false,
}: WebsitesTableProps) {
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const refreshData = () => {
    if (onRefresh) onRefresh();
  };

  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((order) => order.id!));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const bulkRenew = async (duration: '6_months' | '1_year') => {
    if (selectedIds.length === 0) return;

    const results = await Promise.all(
      selectedIds.map(async (id) => {
        const res = await fetch(`/api/admin/sites/${id}/renew`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration }),
        });
        return { id, ok: res.ok, status: res.status, body: await res.text() };
      })
    );

    const failed = results.filter((item) => !item.ok);
    if (failed.length > 0) {
      console.error('Bulk renew failed', failed);
      alert(`Renew completed with ${failed.length} failures. Check console for details.`);
    } else {
      alert(`All selected sites renewed for ${duration === '6_months' ? '6 months' : '1 year'}.`);
    }

    refreshData();
    setSelectedIds([]);
  };

  const bulkArchive = async () => {
    if (selectedIds.length === 0 || !confirm(`Archive ${selectedIds.length} site${selectedIds.length !== 1 ? 's' : ''}?`)) return;

    const results = await Promise.all(
      selectedIds.map(async (id) => {
        const res = await fetch(`/api/admin/sites/${id}/archive`, {
          method: 'PATCH',
        });
        return { id, ok: res.ok };
      })
    );

    const failed = results.filter((r) => !r.ok);
    alert(failed.length ? `${failed.length} archive failures` : 'Archive complete');
    refreshData();
    setSelectedIds([]);
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} site${selectedIds.length !== 1 ? 's' : ''}? This cannot be undone!`)) return;

    const results = await Promise.all(
      selectedIds.map(async (id) => {
        const res = await fetch('/api/admin', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        return { id, ok: res.ok };
      })
    );

    const failed = results.filter((r) => !r.ok);
    alert(failed.length ? `${failed.length} delete failures` : 'Delete complete');
    refreshData();
    setSelectedIds([]);
  };


  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-4"><div className="h-4 w-4 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
      <td className="px-4 py-4 text-right"><div className="h-4 w-16 bg-slate-200 rounded ml-auto" /></td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[220px] max-w-md">
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
            <div className="h-10 w-36 bg-slate-200 rounded" />
            <div className="h-10 w-36 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
          <div className="h-4 w-48 bg-slate-200 rounded" />
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex flex-col gap-2 animate-pulse">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="p-8 text-center">No websites found.</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-wrap gap-3">
          {/* Search Input */}
          <div className="flex-1 min-w-[220px] max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search by name, customer, partner, or slug..."
            />
          </div>

          {/* Theme Filter */}
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as ThemeFilter)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer hover:border-slate-300"
          >
            <option value="all">All Themes</option>
            <option value="romantic_classic">Romantic Classic</option>
            <option value="cute_pastel">Cute Pastel</option>
            <option value="minimal_modern">Minimal Modern</option>
            <option value="dark_elegant">Dark Elegant</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer hover:border-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Action and Results Count */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 space-y-3 text-sm text-slate-500">
        <div className="flex items-center justify-between gap-2">
          <div>
            Showing {orders.length} of {total} website{total !== 1 ? 's' : ''} (page {page})
            {searchQuery || themeFilter !== 'all' || statusFilter !== 'all' ? ' (filtered)' : ''}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => bulkRenew('6_months')} disabled={selectedIds.length === 0} className="px-3 py-1 rounded-lg text-white bg-blue-600 disabled:bg-slate-300">Renew Selected 6m</button>
            <button type="button" onClick={() => bulkRenew('1_year')} disabled={selectedIds.length === 0} className="px-3 py-1 rounded-lg text-white bg-sky-600 disabled:bg-slate-300">Renew Selected 1y</button>
            <button type="button" onClick={bulkArchive} disabled={selectedIds.length === 0} className="px-3 py-1 rounded-lg text-white bg-slate-600 disabled:bg-slate-300 hover:bg-slate-700">Archive Selected</button>
            <button type="button" onClick={bulkDelete} disabled={selectedIds.length === 0} className="px-3 py-1 rounded-lg text-white bg-red-600 disabled:bg-slate-300 hover:bg-red-700">Delete Selected</button>
          </div>
        </div>
        {selectedIds.length > 0 && <div className="text-xs text-slate-600">{selectedIds.length} selected</div>}
      </div>

      {/* Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-4">
                <input type="checkbox" checked={isAllSelected} onChange={e => toggleSelectAll(e.target.checked)} className="h-4 w-4 accent-rose-600" />
              </th>
              <SortableHeader column="website_name" label="Website" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
              <SortableHeader column="site_type" label="Theme" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
              <SortableHeader column="status" label="Status" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
              <SortableHeader column="expires_at" label="Expires" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
              <SortableHeader column="created_at" label="Created" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
              <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order: Site) => (
              <WebsiteRow
                key={order.id}
                order={order}
                onDelete={onDelete}
                selected={selectedIds.includes(order.id || '')}
                onSelect={checked => { if (order.id) toggleSelectOne(order.id, checked); }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {orders.map((order: Site) => (
          <MobileWebsiteCard
            key={order.id}
            order={order}
            onDelete={onDelete}
            selected={selectedIds.includes(order.id || '')}
            onSelect={checked => { if (order.id) toggleSelectOne(order.id, checked); }}
          />
        ))}
      </div>
    </div>
  );
}

