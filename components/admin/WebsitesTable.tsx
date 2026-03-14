'use client';

import { useState, useMemo } from 'react';
import { Site } from '@/lib/supabase';
import SearchInput from './SearchInput';
import WebsiteRow from './WebsiteRow';

interface WebsitesTableProps {
  orders: Site[];
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type ThemeFilter = 'all' | 'romantic_classic' | 'cute_pastel' | 'minimal_modern' | 'dark_elegant';

export default function WebsitesTable({
  orders,
  onDelete,
  searchQuery,
  onSearchChange,
}: WebsitesTableProps) {
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>('all');

  // Filter orders based on search and theme
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
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
      
      return matchesSearch && matchesTheme;
    });
  }, [orders, searchQuery, themeFilter]);

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
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
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
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-sm text-slate-500">
        Showing {filteredOrders.length} of {orders.length} website{orders.length !== 1 ? 's' : ''}
        {searchQuery || themeFilter !== 'all' ? ' (filtered)' : ''}
      </div>

      {/* Table or Card View */}
      {filteredOrders.length === 0 ? (
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
              : 'No websites with this theme'
            }
          </p>
          {(searchQuery || themeFilter !== 'all') && (
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
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">
                    Cover
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Site Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    People
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Theme
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <WebsiteRow
                    key={order.id}
                    order={order}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <MobileWebsiteCard
                key={order.id}
                order={order}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Mobile Card Component
function MobileWebsiteCard({ 
  order, 
  onDelete 
}: { 
  order: Site; 
  onDelete: (id: string) => void;
}) {
  const siteType = order.site_type || 'couple';
  const customerName = order.config?.people?.primary || (order as any).customer_name || '';
  const partnerName = order.config?.people?.secondary || (order as any).partner_name || '';
  const peopleDisplay = siteType === 'birthday'
    ? customerName || 'Birthday Guest'
    : partnerName
      ? `${customerName || 'Your Name'} & ${partnerName || 'Partner Name'}`
      : customerName || 'Your Name';
  const themeValue = (order.config?.theme as string) || (order as any).theme || 'romantic_classic';
  const coverPhoto = order.config?.media?.photos?.[0] || order.config?.cover_photo || order.photos?.[0] || '';
  const websiteName = order.website_name || order.slug;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getThemeLabel = (theme?: string) => {
    if (!theme) return 'Default';
    return theme.replace(/_/g, ' ');
  };

  const getThemeColor = (theme?: string) => {
    switch (theme) {
      case 'romantic_classic':
        return 'bg-rose-100 text-rose-700';
      case 'cute_pastel':
        return 'bg-pink-100 text-pink-700';
      case 'minimal_modern':
        return 'bg-slate-100 text-slate-700';
      case 'dark_elegant':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50/80 transition-colors">
      <div className="flex items-start gap-3">
        {/* Cover Photo */}
        <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
          {coverPhoto ? (
            <img
              src={typeof coverPhoto === 'string' ? coverPhoto : ''}
              alt={websiteName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-semibold text-slate-900 truncate">
                {websiteName}
              </p>
              <p className="text-sm text-slate-500">
                {peopleDisplay}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Type: {siteType}
              </p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getThemeLabel(themeValue)}`}>
              {getThemeLabel(themeValue)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {formatDate(order.created_at)}
            </span>
            <div className="flex items-center gap-1">
              <a
                href={`/site/${order.website_name || order.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
              <a
                href={`/admin/websites/${order.id}/edit`}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
              <button
                onClick={() => order.id && onDelete(order.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

