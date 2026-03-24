'use client';

import { useState, useMemo, useCallback } from 'react';
import { Site } from '@/lib/supabase';
import SearchInput from './SearchInput';
import WebsiteRow from './WebsiteRow';
import MobileWebsiteCard from './MobileWebsiteCard';


interface WebsitesTableProps {
  orders: Site[];
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'active' | 'expired' | 'archived';
  onStatusFilterChange: (status: 'all' | 'active' | 'expired' | 'archived') => void;
  onRefresh?: () => void;
}

type ThemeFilter = 'all' | 'romantic_classic' | 'cute_pastel' | 'minimal_modern' | 'dark_elegant';
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
  onDelete,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}: WebsitesTableProps) {
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'website' | 'theme' | 'status' | 'expires' | 'created'>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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

  const sortOrders = useCallback((a: Site, b: Site) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'website':
        aVal = (a.website_name || a.slug || '').toLowerCase();
        bVal = (b.website_name || b.slug || '').toLowerCase();
        break;
      case 'theme':
        aVal = (a.config?.theme || a.theme || '').toLowerCase();
        bVal = (b.config?.theme || b.theme || '').toLowerCase();
        break;
      case 'status':
        aVal = getStatusFromOrder(a);
        bVal = getStatusFromOrder(b);
        break;
      case 'expires':
        aVal = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
        bVal = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
        break;
      case 'created':
      default:
        aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
        bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
        break;
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }, [sortBy, sortDirection]);

  // Filter orders based on search and theme
  const sortedFilteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const customerName = order.config?.people?.primary || (order as any).customer_name || '';
      const partnerName = order.config?.people?.secondary || (order as any).partner_name || '';
      const matchesSearch = 
        searchQuery === '' ||
        (order.website_name || order.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTheme = 
        themeFilter === 'all' || 
        (order.config?.theme || order.theme) === themeFilter;

      const siteStatus = getStatusFromOrder(order);
      const matchesStatus = statusFilter === 'all' || statusFilter === siteStatus;
      
      return matchesSearch && matchesTheme && matchesStatus;
    });
    return filtered.sort(sortOrders);
  }, [orders, searchQuery, themeFilter, statusFilter, sortOrders]);

  const totalPages = Math.ceil(sortedFilteredOrders.length / itemsPerPage);
  const paginatedOrders = sortedFilteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    onSearchChange('');
    setThemeFilter('all');
  };

  if (orders.length === 0) {
    return null;
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
            className="
              px-4 py-2.5 bg-white border border-slate-200 rounded-xl 
              text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
              transition-all cursor-pointer hover:border-slate-300
            "
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
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'expired' | 'archived')}
            className="
              px-4 py-2.5 bg-white border border-slate-200 rounded-xl 
              text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
              transition-all cursor-pointer hover:border-slate-300
            "
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
            Showing {paginatedOrders.length} of {sortedFilteredOrders.length} website{paginatedOrders.length !== 1 ? 's' : ''} (page {currentPage} of {totalPages})
            {searchQuery || themeFilter !== 'all' || statusFilter !== 'all' ? ' (filtered)' : ''}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => bulkRenew('6_months')}
              disabled={selectedIds.length === 0}
              className="px-3 py-1 rounded-lg text-white bg-blue-600 disabled:bg-slate-300"
            >
              Renew Selected 6m
            </button>
            <button
              type="button"
              onClick={() => bulkRenew('1_year')}
              disabled={selectedIds.length === 0}
              className="px-3 py-1 rounded-lg text-white bg-sky-600 disabled:bg-slate-300"
            >
              Renew Selected 1y
            </button>
            <button
              type="button"
              onClick={bulkArchive}
              disabled={selectedIds.length === 0}
              className="px-3 py-1 rounded-lg text-white bg-slate-600 disabled:bg-slate-300 hover:bg-slate-700"
            >
              Archive Selected
            </button>
            <button
              type="button"
              onClick={bulkDelete}
              disabled={selectedIds.length === 0}
              className="px-3 py-1 rounded-lg text-white bg-red-600 disabled:bg-slate-300 hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div className="text-xs text-slate-600">{selectedIds.length} selected</div>
        )}
      </div>

      {/* Table or Card View */}
      {sortedFilteredOrders.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No results found</h3>
          <p className="text-slate-500">
            {searchQuery 
              ? `No websites matching "${searchQuery}"`
              : themeFilter !== 'all' 
              ? 'No websites with this theme'
              : statusFilter !== 'all'
              ? 'No websites with this status'
              : 'No websites found'
            }
          </p>
          {(searchQuery || themeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="h-4 w-4 accent-rose-600"
                />
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                      setSortBy('website');
                      setSortDirection(sortBy === 'website' && sortDirection === 'asc' ? 'desc' as const : 'asc' as const);
                    }} title="Sort by name">
                    Website {sortBy === 'website' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                      setSortBy('theme');
                      setSortDirection(sortBy === 'theme' && sortDirection === 'asc' ? 'desc' as const : 'asc' as const);
                    }} title="Sort by theme">
                    Theme {sortBy === 'theme' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                      setSortBy('status');
                      setSortDirection(sortBy === 'status' && sortDirection === 'asc' ? 'desc' as const : 'asc' as const);
                    }} title="Sort by status">
                    Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                      setSortBy('expires');
                      setSortDirection(sortBy === 'expires' && sortDirection === 'asc' ? 'desc' as const : 'asc' as const);
                    }} title="Sort by expires">
                    Expires {sortBy === 'expires' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none" onClick={() => {
                      setSortBy('created');
                      setSortDirection(sortBy === 'created' && sortDirection === 'asc' ? 'desc' as const : 'asc' as const);
                    }} title="Sort by created">
                    Created {sortBy === 'created' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((order: Site) => (
                  <WebsiteRow
                    key={order.id}
                    order={order}
                    onDelete={onDelete}
                    selected={selectedIds.includes(order.id || '')}
                    onSelect={(checked) => {
                      if (order.id) toggleSelectOne(order.id, checked);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginatedOrders.map((order: Site) => (
              <MobileWebsiteCard
                key={order.id}
                order={order}
                onDelete={onDelete}
                selected={selectedIds.includes(order.id || '')}
                onSelect={(checked) => {
                  if (order.id) toggleSelectOne(order.id, checked);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

