'use client';

import { Order } from '@/lib/supabase';
import WebsiteActions from './WebsiteActions';

interface WebsiteRowProps {
  order: Order;
  onDelete: (id: string) => void;
}

// Icons for placeholder
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function WebsiteRow({ order, onDelete }: WebsiteRowProps) {
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

  // Get cover photo from config or photos array
  const coverPhoto = order.config?.cover_photo || order.photos?.[0];
  const websiteName = order.website_name || order.slug;

  return (
    <tr className="hover:bg-slate-50 transition-colors duration-150">
      {/* Cover Photo */}
      <td className="px-4 py-3">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
          {coverPhoto ? (
            <img
              src={typeof coverPhoto === 'string' ? coverPhoto : ''}
              alt={websiteName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-rose-300" />
            </div>
          )}
        </div>
      </td>

      {/* Website Name */}
      <td className="px-4 py-3">
        <span className="font-semibold text-slate-900">
          {websiteName}
        </span>
      </td>

      {/* Couple Names */}
      <td className="px-4 py-3">
        <span className="font-medium text-slate-700">
          {order.customer_name} ❤️ {order.partner_name}
        </span>
      </td>

      {/* Theme */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getThemeColor(order.config?.theme || order.theme)}`}>
          {getThemeLabel(order.config?.theme || order.theme)}
        </span>
      </td>

      {/* Created Date */}
      <td className="px-4 py-3 text-slate-500">
        {formatDate(order.created_at)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <WebsiteActions
          slug={order.website_name || order.slug}
          id={order.id!}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

