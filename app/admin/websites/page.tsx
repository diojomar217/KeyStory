'use client';

import { useEffect, useState } from 'react';
import { Site } from '@/lib/supabase';
import WebsitesTable from '@/components/admin/WebsitesTable';
import EmptyState from '@/components/admin/EmptyState';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';

export default function WebsitesPage() {
  const [orders, setOrders] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const order = orders.find(o => o.id === id);
    setDeletingName(order?.website_name || order?.slug || 'this website');
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

      if (res.ok) {
        setOrders(orders.filter(o => o.id !== deletingId));
        setDeleteModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete website');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete website');
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Websites
          </h1>
          <p className="mt-1 text-slate-500">
            Manage all generated love story websites
          </p>
        </div>

        {/* Create Button */}
        <a
          href="/admin/websites/create"
          className="
            inline-flex items-center gap-2 px-5 py-2.5 
            bg-gradient-to-r from-rose-600 to-pink-600 
            text-white font-medium rounded-xl 
            hover:from-rose-700 hover:to-pink-700 
            shadow-md hover:shadow-lg 
            transition-all duration-200
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Website
        </a>
      </div>

      {/* Main Content */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState
            title="No websites yet"
            description="Create your first love story website."
            actionLabel="Create Website"
            actionHref="/admin/websites/create"
          />
        </div>
      ) : (
        <WebsitesTable
          orders={orders}
          onDelete={handleDelete}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Website?"
        message="This action cannot be undone. The website and all its data will be permanently removed."
        confirmLabel="Delete Website"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        itemName={deletingName}
      />
    </div>
  );
}

