'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GuestMessageRecord } from '@/lib/types';

const statusOptions = ['all', 'pending', 'approved', 'rejected'] as const;

type StatusFilter = (typeof statusOptions)[number];

export default function GuestMessagesAdminPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<GuestMessageRecord[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/guest-messages?site_id=${encodeURIComponent(siteId)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed fetching messages');
      }
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchMessages();
    }
  }, [siteId]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/guest-messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not update message');
      }
      await fetchMessages();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Error updating status.');
    } finally {
      setBusy(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this guest message permanently?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/guest-messages/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not delete message');
      }
      await fetchMessages();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Error deleting message.');
    } finally {
      setBusy(false);
    }
  };

  const filteredMessages = messages.filter((msg) => (filter === 'all' ? true : msg.status === filter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest Messages Moderation</h1>
          <p className="text-sm text-slate-500">Manage submitted messages for this website.</p>
        </div>
        <div className="inline-flex gap-2">
          <button
            onClick={() => router.push(`/admin/websites/${siteId}/edit`)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >Back to Edit</button>
          <button
            onClick={fetchMessages}
            disabled={busy}
            className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-60"
          >Refresh</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Filter by status</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as StatusFilter)}
          className="w-full sm:w-56 rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>}

      {loading ? (
        <div className="flex h-40 items-center justify-center">Loading guest messages …</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">No messages match this filter.</td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">{msg.name}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xl line-clamp-2">{msg.message}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        msg.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        msg.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(msg.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => updateStatus(msg.id, 'approved')}
                        disabled={busy || msg.status === 'approved'}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                      >Approve</button>
                      <button
                        onClick={() => updateStatus(msg.id, 'rejected')}
                        disabled={busy || msg.status === 'rejected'}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                      >Reject</button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        disabled={busy}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                      >Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
