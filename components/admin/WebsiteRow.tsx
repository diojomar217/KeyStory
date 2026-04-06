'use client';
import { DEFAULT_THEME } from '@/config/defaults';
import { Site } from '@/lib/supabase';
import WebsiteActionsDropdown from './WebsiteActionsDropdown';
import { getDaysUntilExpiration, getEffectiveSiteStatus } from '@/lib/site-status';

interface WebsiteRowProps {
  order: Site;
  onDelete: (id: string) => void;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  pendingGuestMessages?: number;
}

// Icons for placeholder
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function WebsiteRow({ order, onDelete, selected, onSelect, pendingGuestMessages = 0 }: WebsiteRowProps) {
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

  // Normalized site properties
  const siteType = order.site_type || 'couple';
  const customerName = order.config?.people?.primary || order.customer_name || '';
  const partnerName = order.config?.people?.secondary || order.partner_name || '';

  const peopleDisplay = siteType === 'birthday'
    ? customerName || 'Birthday Guest'
    : partnerName
      ? `${customerName || 'Your Name'} & ${partnerName || 'Partner Name'}`
      : customerName || 'Your Name';

  // Get cover photo from config.media or fallback older fields
  const coverPhoto = order.config?.media?.photos?.[0] || order.config?.cover_photo || order.photos?.[0] || '';
  const websiteName = order.website_name || order.slug;

  const themeValue = (order.config?.theme as string) || (order.theme as string) || DEFAULT_THEME;
  const status = getEffectiveSiteStatus(order);
  const expiresAt = order.expires_at ? new Date(order.expires_at) : null;

  const statusLabel =
    status === 'archived'
      ? 'Archived'
      : status === 'expired'
        ? 'Expired'
        : status === 'pending'
          ? 'Pending'
          : 'Active';
  const statusClass =
    statusLabel === 'Active' ? 'bg-emerald-100 text-emerald-700' :
    statusLabel === 'Expired' ? 'bg-amber-100 text-amber-800' :
    statusLabel === 'Pending' ? 'bg-blue-100 text-blue-700' :
    'bg-slate-100 text-slate-700';

  const daysRemaining = getDaysUntilExpiration(order.expires_at || null);
  const hasDaysRemaining = typeof daysRemaining === 'number';
  const isExpiringSoon = hasDaysRemaining && daysRemaining >= 0 && daysRemaining <= 7;
  const expiresLabel = expiresAt ? `${formatDate(expiresAt.toISOString())}${hasDaysRemaining ? ` (${daysRemaining >= 0 ? `${daysRemaining}d` : `${Math.abs(daysRemaining)}d overdue`})` : ''}` : '-' ;

  return (
    <tr className="hover:bg-slate-50 transition-colors duration-150">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4 accent-rose-600"
        />
      </td>
      {/* Website Name + Slug */}
      <td className="px-4 py-3 max-w-[200px]">
        <div>
          <span className="font-semibold text-slate-900 block truncate" title={websiteName}>
            {websiteName}
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600" title={`/${order.slug}`}>
              /{order.slug}
            </span>
            {pendingGuestMessages > 0 && (
              <span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-700">
                {pendingGuestMessages} pending message{pendingGuestMessages === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Theme */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getThemeColor(themeValue)}`}>
          {getThemeLabel(themeValue)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
          {statusLabel}
        </span>
      </td>

      {/* Expires At */}
      <td className="px-4 py-3 text-slate-500">
        <div className="flex items-center gap-2">
          <span>{expiresAt ? expiresLabel : '—'}</span>
          {isExpiringSoon && statusLabel === 'Active' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4" />
                <circle cx="12" cy="16" r="1" />
                <path d="M21 12A9 9 0 1 1 3 12" />
              </svg>
              expiring soon
            </span>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-4 py-3 text-slate-500">
        {formatDate(order.created_at)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <WebsiteActionsDropdown
          order={order}
          onDelete={onDelete}
          onRefresh={() => window.location.reload()}
          pendingGuestMessages={pendingGuestMessages}
        />
      </td>
    </tr>
  );
}

