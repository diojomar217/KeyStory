'use client';

import { useState } from 'react';
import { Site } from '@/lib/supabase';

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
  type NfcNoticeTone = 'success' | 'error' | 'info';

  const [open, setOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [nfcNotice, setNfcNotice] = useState<{ tone: NfcNoticeTone; text: string } | null>(null);

  const slug = order.website_name || order.slug || '';
  const id = order.id!;
  const siteStatus = (order.status || 'active').toLowerCase();
  const canWriteNfc = siteStatus !== 'archived' && siteStatus !== 'expired';

  const pushNfcNotice = (tone: NfcNoticeTone, text: string) => {
    setNfcNotice({ tone, text });
    window.setTimeout(() => setNfcNotice(null), 6000);
  };

  const getNfcUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://key-story.vercel.app';
    return `${origin}/r/${slug}`;
  };

  const renewSite = async (duration: '6_months' | '1_year') => {
    setIsRenewing(true);
    try {
      const res = await fetch(`/api/admin/sites/${id}/renew`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });
      if (res.ok) {
        onRefresh();
        alert('Site renewed successfully!');
      } else {
        throw new Error('Renew failed');
      }
    } catch (error) {
      alert('Renew failed: ' + error);
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
        onRefresh();
        alert('Site archived!');
      } else {
        throw new Error('Archive failed');
      }
    } catch (error) {
      alert('Archive failed: ' + error);
    } finally {
      setIsArchiving(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetch(`/api/site/${slug}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('PDF download failed');
    }
  };

  const writeNfcTag = async () => {
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
          pushNfcNotice('info', 'Web NFC is not supported here. Link copied so you can encode with another NFC tool.');
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
      if (!ReaderCtor) {
        throw new Error('NDEFReader is unavailable');
      }

      const ndef = new ReaderCtor();
      await ndef.write(nfcUrl);
      setOpen(false);
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
    if (!slug) {
      pushNfcNotice('error', 'Missing website slug to copy NFC URL.');
      return;
    }

    const nfcUrl = getNfcUrl();
    try {
      await navigator.clipboard.writeText(nfcUrl);
      pushNfcNotice('success', 'NFC URL copied to clipboard.');
    } catch (_error) {
      pushNfcNotice('error', `Could not copy automatically. URL: ${nfcUrl}`);
    }
  };

  return (
    <div className="relative">
      {/* Primary actions: View, Edit */}
      <div className="flex gap-1">
        <a href={`/site/${slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View">
          <ViewIcon className="w-4 h-4" />
        </a>
        <a href={`/admin/websites/${id}/edit`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
          <EditIcon className="w-4 h-4" />
        </a>
        {/* Dropdown toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
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
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
          {/* Quick actions */}
          <a href={`/admin/websites/${id}/keychain-print`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="QR Card">
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Keychain Inserts
          </a>
          <a href={`/admin/websites/${id}/qr-card`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="QR Card">
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Card
          </a>
          <button
            onClick={writeNfcTag}
            disabled={isWritingNfc || !canWriteNfc}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Write NFC Tag"
          >
            <span aria-hidden="true">📶</span>
            {isWritingNfc ? 'Writing NFC...' : 'Write NFC Tag'}
          </button>
          <button
            onClick={copyNfcUrl}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            title="Copy NFC URL"
          >
            <span aria-hidden="true">🔗</span>
            Copy NFC URL
          </button>
          <p className="px-3 pb-1 pt-0.5 text-[11px] leading-relaxed text-slate-500">
            NFC direct write works best on Android Chrome over HTTPS.
          </p>
          {nfcNotice && (
            <p
              className={`mx-2 mb-1 rounded-md px-2 py-1.5 text-[11px] font-medium ${
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
          <button onClick={downloadPdf} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Download PDF">
            📄 Memory Book PDF
          </button>
          <a href={`/admin/websites/${id}/analytics`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Analytics">
            📊
            Analytics
          </a>
          <a href={`/admin/websites/${id}/guest-messages`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Guest Messages">
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

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1"></div>

          {/* Status actions */}
          {siteStatus !== 'archived' ? (
            <>
              <button
                onClick={() => renewSite('6_months')}
                disabled={isRenewing}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                🔄 Renew 6 months
              </button>
              <button
                onClick={() => renewSite('1_year')}
                disabled={isRenewing}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 transition-colors disabled:opacity-50"
              >
                🔄 Renew 1 year
              </button>
              <button
                onClick={archiveSite}
                disabled={isArchiving}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                📦 Archive site
              </button>
            </>
          ) : (
            <button
              onClick={archiveSite}
              disabled={isArchiving}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              ↺ Restore site
            </button>
          )}

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1"></div>

          {/* Delete */}
          <button
            onClick={() => onDelete(id)}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
