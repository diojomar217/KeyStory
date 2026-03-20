import { Site } from '@/lib/supabase';

export function isExpired(site: Site): boolean {
  const status = (site.status || '').toString().toLowerCase();

  if (status === 'archived') return false;
  if (status === 'expired') return true;

  if (!site.expires_at) return false;

  const expiresAt = new Date(site.expires_at);
  if (Number.isNaN(expiresAt.getTime())) return false;

  return expiresAt.getTime() < Date.now();
}

export function isArchived(site: Site): boolean {
  const status = (site.status || '').toString().toLowerCase();
  if (status === 'archived') return true;
  if (site.config?.archive?.archived === true) return true;
  return false;
}

export function expiredDaysAgo(site: Site): number | null {
  if (!site.expires_at) return null;
  const expiresAt = new Date(site.expires_at);
  if (Number.isNaN(expiresAt.getTime())) return null;
  const diffMs = Date.now() - expiresAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function needsAutoArchive(site: Site, graceDays = 7): boolean {
  if (isArchived(site)) return false;
  if (!isExpired(site)) return false;

  const ago = expiredDaysAgo(site);
  if (ago === null) return false;
  return ago >= graceDays;
}
