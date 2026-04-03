'use client';
import { useState } from 'react';
import { DEFAULT_THEME } from '@/config/defaults';
import { Site } from '@/lib/supabase';

interface MobileWebsiteCardProps {
  order: Site;
  onDelete: (id: string) => void;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  pendingGuestMessages?: number;
}

export default function MobileWebsiteCard({ 
  order, 
  onDelete,
  selected,
  onSelect,
  pendingGuestMessages = 0,
}: MobileWebsiteCardProps) {
  type NfcNoticeTone = 'success' | 'error' | 'info';

  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [nfcNotice, setNfcNotice] = useState<{ tone: NfcNoticeTone; text: string } | null>(null);
  const siteType = order.site_type || 'couple';
  const customerName = order.config?.people?.primary || (order as any).customer_name || '';
  const partnerName = order.config?.people?.secondary || (order as any).partner_name || '';
  const peopleDisplay = siteType === 'birthday'
    ? customerName || 'Birthday Guest'
    : partnerName
      ? `${customerName || 'Your Name'} & ${partnerName || 'Partner Name'}`
      : customerName || 'Your Name';
  const themeValue = (order.config?.theme as string) || (order as any).theme || DEFAULT_THEME;
  const coverPhoto = order.config?.media?.photos?.[0] || order.config?.cover_photo || order.photos?.[0] || '';
  const websiteName = order.website_name || order.slug;
  const siteStatus = (order.status || 'active').toLowerCase();
  const canWriteNfc = siteStatus !== 'archived' && siteStatus !== 'expired';

  const pushNfcNotice = (tone: NfcNoticeTone, text: string) => {
    setNfcNotice({ tone, text });
    window.setTimeout(() => setNfcNotice(null), 6000);
  };

  const getNfcUrl = () => {
    const slug = order.website_name || order.slug;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://key-story.vercel.app';
    return `${origin}/r/${slug}`;
  };

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

  const writeNfcTag = async () => {
    const slug = order.website_name || order.slug;
    if (!slug) {
      pushNfcNotice('error', 'Missing website slug for NFC writing.');
      return;
    }

    if (!canWriteNfc) {
      pushNfcNotice('info', 'NFC writing is disabled for archived or expired sites. Renew/restore this site first.');
      return;
    }

    const nfcUrl = getNfcUrl();

    if (typeof window === 'undefined' || !window.isSecureContext) {
      pushNfcNotice('error', 'NFC writing requires HTTPS (secure context).');
      return;
    }

    if (!('NDEFReader' in window)) {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(nfcUrl);
          pushNfcNotice('info', 'Web NFC is not supported here. Link copied for external NFC tools.');
          return;
        }
      } catch (_error) {
        // Fallback alert below when clipboard permission is blocked.
      }

      pushNfcNotice('info', `Web NFC is not supported on this device/browser. NFC URL: ${nfcUrl}`);
      return;
    }

    setIsWritingNfc(true);
    try {
      const ReaderCtor = (window as Window & { NDEFReader?: new () => { write: (data: string) => Promise<void> } }).NDEFReader;
      if (!ReaderCtor) throw new Error('NDEFReader is unavailable');

      const ndef = new ReaderCtor();
      await ndef.write(nfcUrl);
      pushNfcNotice('success', `NFC tag written: ${nfcUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown NFC write error';
      const hint = message.toLowerCase().includes('permission')
        ? 'NFC permission was denied.'
        : message.toLowerCase().includes('abort')
          ? 'NFC write was canceled.'
          : 'Keep the NFC tag near the phone and try again.';
      pushNfcNotice('error', `NFC write failed: ${hint}`);
    } finally {
      setIsWritingNfc(false);
    }
  };

  const copyNfcUrl = async () => {
    const slug = order.website_name || order.slug;
    if (!slug) {
      pushNfcNotice('error', 'Missing website slug to copy NFC URL.');
      return;
    }

    try {
      await navigator.clipboard.writeText(getNfcUrl());
      pushNfcNotice('success', 'NFC URL copied to clipboard.');
    } catch (_error) {
      pushNfcNotice('error', `Could not copy automatically. URL: ${getNfcUrl()}`);
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50/80 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <label className="inline-flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="h-4 w-4 accent-rose-600"
          />
          Select
        </label>
      </div>
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
              <p className="text-xs text-slate-400 mt-1">
                Status: {order.status || 'active'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Expires: {order.expires_at ? formatDate(order.expires_at) : '—'}
              </p>
              {pendingGuestMessages > 0 && (
                <p className="mt-2 inline-flex rounded-full bg-fuchsia-100 px-2 py-1 text-xs font-semibold text-fuchsia-700">
                  {pendingGuestMessages} pending guest message{pendingGuestMessages === 1 ? '' : 's'}
                </p>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getThemeColor(themeValue)}`}>
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
              <a
                href={`/admin/websites/${order.id}/guest-messages`}
                className="p-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"
                title="Guest Messages"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h8M8 14h5m-7 6 2.8-2.8a2 2 0 011.414-.586H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h1v4z" />
                </svg>
              </a>
              <button
                onClick={writeNfcTag}
                disabled={isWritingNfc || !canWriteNfc}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                title="Write NFC Tag"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M7.5 6.5a6.5 6.5 0 000 11M16.5 6.5a6.5 6.5 0 010 11M4.5 9.5a9.5 9.5 0 000 5M19.5 9.5a9.5 9.5 0 010 5" />
                </svg>
              </button>
              <button
                onClick={copyNfcUrl}
                className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                title="Copy NFC URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 010 5.656l-2 2a4 4 0 01-5.656-5.656l1-1m9.656 2.828a4 4 0 010-5.656l-2-2a4 4 0 10-5.656 5.656" />
                </svg>
              </button>
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
          <p className="mt-2 text-[11px] text-slate-500">NFC direct write works best on Android Chrome over HTTPS.</p>
          {nfcNotice && (
            <p
              className={`mt-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                nfcNotice.tone === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : nfcNotice.tone === 'error'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-sky-50 text-sky-700'
              }`}
            >
              {nfcNotice.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
