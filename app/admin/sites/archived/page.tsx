'use client';

import { useEffect, useState } from 'react';
import { Site } from '@/lib/supabase';
import { isArchived } from '@/lib/site-status';
import WebsitesTable from '@/components/admin/WebsitesTable';
import EmptyState from '@/components/admin/EmptyState';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';

export default function ArchivedSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'archived'>('archived');
  const [guestMessageFilter, setGuestMessageFilter] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    fetchArchivedSites();
  }, []);

  const fetchArchivedSites = async () => {
    try {
      const res = await fetch('/api/orders?status=archived&limit=100&offset=0');
      if (!res.ok) throw new Error('Failed to load sites');
      const data = await res.json();
      const archived = (data.orders || []).filter((site: Site) => isArchived(site));
      setSites(archived);
    } catch (error) {
      console.error('Failed to fetch archived sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const site = sites.find((s) => s.id === id);
    setDeletingName(site?.website_name || site?.slug || 'this site');
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete website');
      }
      setSites((prev) => prev.filter((site) => site.id !== deletingId));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete archived site failed:', error);
      alert('Unable to delete archived site');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeletingName('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Archived Sites</h1>
        <p className="mt-1 text-slate-500">Review archived sites and perform restore or delete actions.</p>
      </div>

      {sites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState
            title="No archived sites yet"
            description="Sites will appear here once they expire and are archived."
            actionLabel="View active sites"
            actionHref="/admin/websites"
          />
        </div>
      ) : (
        <WebsitesTable
          orders={sites}
          total={sites.length}
          page={1}
          limit={sites.length}
          onPageChange={() => {}}
          onLimitChange={() => {}}
          onDelete={handleDelete}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          guestMessageFilter={guestMessageFilter}
          onGuestMessageFilterChange={setGuestMessageFilter}
          onRefresh={fetchArchivedSites}
          sortBy={"created_at"}
          sortDirection={"desc"}
          onSortChange={() => {}}
          loading={loading}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Archived Site?"
        message="This action will permanently delete the archived site and cannot be undone."
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        itemName={deletingName}
      />
    </div>
  );
}
