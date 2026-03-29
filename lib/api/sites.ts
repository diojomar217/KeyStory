// Shared API utility for site CRUD operations
import { Site } from '@/lib/supabase';

const API_BASE = '/api/admin';

export async function getSite(id: string): Promise<Site | null> {
  const res = await fetch(`${API_BASE}?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch site');
  const data = await res.json();
  return data.site || null;
}

export async function updateSite(payload: any): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update site');
  return await res.json();
}

export async function createSite(payload: any): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create site');
  return await res.json();
}

export async function deleteSite(id: string): Promise<any> {
  const res = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete site');
  return await res.json();
}

// Add getSiteBySlug if needed for public view
