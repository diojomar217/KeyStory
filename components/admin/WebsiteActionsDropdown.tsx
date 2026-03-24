'use client';

import { useState } from 'react';
import { Site } from '@/lib/supabase';

interface WebsiteActionsDropdownProps {
  order: Site;
  onDelete: (id: string) => void;
  onRefresh: () => void;
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

export default function WebsiteActionsDropdown({ order, onDelete, onRefresh }: WebsiteActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const slug = order.website_name || order.slug || '';
  const id = order.id!;
  const siteStatus = (order.status || 'active').toLowerCase();

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
          className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          title="More actions"
        >
          <MoreIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
          {/* Quick actions */}
          <a href={`/admin/websites/${id}/qr-card`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="QR Card">
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Card
          </a>
          <button onClick={downloadPdf} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Download PDF">
            📄 Memory Book PDF
          </button>
          <a href={`/admin/websites/${id}/analytics`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" title="Analytics">
            📊
            Analytics
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
