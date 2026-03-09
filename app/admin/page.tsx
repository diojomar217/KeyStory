// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Order } from '@/lib/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin').then(res => res.json()).then(data => {
      setOrders(data.orders || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
      headers: { 'Content-Type': 'application/json' },
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">Admin Dashboard</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Names</th>
            <th>Date</th>
            <th>Theme</th>
            <th>Sections</th>
            <th>Status</th>
            <th>QR</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-pink-50">
              <td>{order.website_name || order.slug}</td>
              <td>{order.customer_name} &amp; {order.partner_name}</td>
              <td>{order.anniversary_date}</td>
              <td className="capitalize">{(order.config as any)?.theme || 'default'}</td>
              <td>{((order.config as any)?.sections || []).join(', ')}</td>
              <td>{order.status}</td>
              <td><a href={order.qr_code_url} download target="_blank" rel="noopener noreferrer">Download</a></td>
              <td>
                <button className="btn btn-xs btn-success mr-2" onClick={() => order.id && updateStatus(order.id, 'printed')}>Printed</button>
                <button className="btn btn-xs btn-info" onClick={() => order.id && updateStatus(order.id, 'shipped')}>Shipped</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
