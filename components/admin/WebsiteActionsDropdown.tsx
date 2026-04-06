'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Site } from '@/lib/supabase';
import { getDaysUntilExpiration, getEffectiveSiteStatus } from '@/lib/site-status';

interface WebsiteActionsDropdownProps {
  order: Site;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  pendingGuestMessages?: number;
}

const ViewIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

export default function WebsiteActionsDropdown({ order, onDelete, onRefresh, pendingGuestMessages = 0 }: WebsiteActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const slug = order.website_name || order.slug || '';
  const id = order.id!;
  const siteStatus = getEffectiveSiteStatus(order as Site);
  const daysRemaining = getDaysUntilExpiration(order.expires_at || null);
  const isBusy = isRenewing || isArchiving;

  const hostingTone = useMemo(() => {
    if (siteStatus === 'archived') return 'bg-slate-100 text-slate-700 border-slate-200';
    if (siteStatus === 'expired') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (siteStatus === 'pending') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }, [siteStatus]);

  const hostingSummary = useMemo(() => {
    if (typeof daysRemaining !== 'number') return 'No expiration date set';
    if (daysRemaining >= 0) return `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
    const overdue = Math.abs(daysRemaining);
    return `${overdue} day${overdue === 1 ? '' : 's'} overdue`;
  }, [daysRemaining]);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const readErrorMessage = async (res: Response, fallback: string) => {
    try {
      const data = await res.json();
      return data?.message || fallback;
    } catch {
      return fallback;
    }
  };

  const renewSite = async (duration: '3_months' | '6_months' | '1_year') => {
    setIsRenewing(true);
    try {
      const res = await fetch(`/api/admin/sites/${id}/renew`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });
      if (res.ok) {
        setOpen(false);
        onRefresh();
        const monthsLabel = duration === '3_months' ? '3 months' : duration === '6_months' ? '6 months' : '1 year';
        alert(`Hosting renewed for ${monthsLabel}.`);
      } else {
        throw new Error(await readErrorMessage(res, 'Renew failed'));
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Renew failed');
    } finally {
      setIsRenewing(false);
    }
  };

  const archiveSite = async () => {
    if (!confirm('Archive this site?')) return;
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/sites/${id}/archive`, { method: 'PATCH' });
      if (res.ok) {
        setOpen(false);
        onRefresh();
        alert('Site archived successfully.');
      } else {
        throw new Error(await readErrorMessage(res, 'Archive failed'));
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Archive failed');
    } finally {
      setIsArchiving(false);
    }
  };

  const restoreSite = async () => {
    if (!confirm('Restore this archived site?')) return;
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/sites/${id}/restore`, { method: 'PATCH' });
      if (res.ok) {
        setOpen(false);
        onRefresh();
        alert('Site restored successfully.');
      } else {
        throw new Error(await readErrorMessage(res, 'Restore failed'));
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Restore failed');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Primary actions: View, Edit */}
      <div className="flex gap-1">
        <a href={`/site/${slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View" onClick={() => setOpen(false)}>
          <ViewIcon className="w-4 h-4" />
        </a>
        <a href={`/admin/websites/${id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit" onClick={() => setOpen(false)}>
          <EditIcon className="w-4 h-4" />
        </a>
        {/* Dropdown toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={open}
          disabled={isBusy}
          className={`relative p-1.5 rounded-lg transition-all ${open ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'} disabled:opacity-60`}
          title="More actions"
        >
          <MoreIcon className="w-4 h-4" />
          {pendingGuestMessages > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-bold leading-4 text-white">
              {pendingGuestMessages > 9 ? '9+' : pendingGuestMessages}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[250px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl z-50">
          <div className="border-b border-slate-100 bg-slate-50/70 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hosting Status</p>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${hostingTone}`}>
                {siteStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">{hostingSummary}</p>
          </div>

          {/* Quick actions */}
          <div className="px-2 py-1">
            <p className="px-1 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Studios and Insights</p>
            <a href={`/admin/websites/${id}/insert-print`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Print Studio" onClick={() => setOpen(false)}>
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Print Studio
            </a>
            <a
              href={`/admin/websites/${id}/nfc-lock`}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              title="NFC Studio"
              onClick={() => setOpen(false)}
            >
            <span aria-hidden="true">📶</span>
            NFC Studio
            </a>
            <a href={`/admin/websites/${id}/analytics`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Analytics" onClick={() => setOpen(false)}>
            📊
            Analytics
            </a>
            <a href={`/admin/websites/${id}/guest-messages`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Guest Messages" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">💬</span>
              <span>Guest Messages</span>
            </span>
            {pendingGuestMessages > 0 && (
              <span className="inline-flex items-center rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-700">
                {pendingGuestMessages} pending
              </span>
            )}
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1"></div>

          {/* Status actions */}
          <div className="px-2 py-1">
            <p className="px-1 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hosting Controls</p>
            {siteStatus !== 'archived' ? (
              <>
              <button
                onClick={() => renewSite('3_months')}
                disabled={isRenewing || isArchiving}
                className="w-full rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {isRenewing ? '...' : 'Extend 3 months'}
              </button>
              <button
                onClick={() => renewSite('6_months')}
                disabled={isRenewing || isArchiving}
                className="w-full rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {isRenewing ? '...' : 'Renew 6 months'}
              </button>
              <button
                onClick={() => renewSite('1_year')}
                disabled={isRenewing || isArchiving}
                className="w-full rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-sky-50 transition-colors disabled:opacity-50"
              >
                {isRenewing ? '...' : 'Renew 1 year'}
              </button>
              <button
                onClick={archiveSite}
                disabled={isRenewing || isArchiving}
                className="w-full rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {isArchiving ? 'Archiving...' : 'Archive site'}
              </button>
              </>
            ) : (
              <button
                onClick={restoreSite}
                disabled={isRenewing || isArchiving}
                className="w-full rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                {isArchiving ? 'Restoring...' : 'Restore site'}
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1"></div>

          {/* Delete */}
          <button
            onClick={() => {
              setOpen(false);
              onDelete(id);
            }}
            disabled={isBusy}
            className="mx-2 mb-2 w-[calc(100%-1rem)] rounded-lg text-left flex items-center gap-2 px-2 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
