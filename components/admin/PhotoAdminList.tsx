"use client";

import React, { useState } from 'react';

type Photo = {
  id: string;
  image_url: string;
  guest_name?: string | null;
  caption?: string | null;
  created_at?: string;
};

export default function PhotoAdminList({ initial }: { initial: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initial || []);

  async function doAction(id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch(`/api/guest-photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) setPhotos((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  async function doDelete(id: string) {
    try {
      const res = await fetch(`/api/guest-photos/${id}`, { method: 'DELETE' });
      if (res.ok) setPhotos((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  if (!photos.length) return <div className="p-4">No pending photos</div>;

  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="flex flex-col sm:flex-row items-start gap-4 border p-3 rounded">
          <img src={photo.image_url} alt={photo.caption || 'pending'} className="w-full sm:w-48 h-auto rounded" />
          <div className="flex-1">
            <div className="text-sm text-gray-700">{photo.guest_name}</div>
            <div className="text-sm text-gray-500">{photo.caption}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => doAction(photo.id, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
              <button onClick={() => doAction(photo.id, 'reject')} className="bg-yellow-600 text-white px-3 py-1 rounded">Reject</button>
              <button onClick={() => doDelete(photo.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
