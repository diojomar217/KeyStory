export function sanitizePath(input: string | undefined, fallback = '/create') {
  const raw = String(input || '').trim();
  if (!raw) return fallback;

  // If an absolute URL was provided, take only the pathname + search
  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      return parsed.pathname + parsed.search;
    }
  } catch (e) {
    // fallthrough to normalization
  }

  // Disallow protocol-relative or double-slash paths
  if (raw.startsWith('//')) return fallback;

  // Ensure it starts with a single '/'
  if (!raw.startsWith('/')) return '/' + raw.replace(/^\/+/, '');

  return raw;
}

export function buildReturnUrl(
  baseUrl: string,
  path: string,
  paymentStatus: 'success' | 'cancelled',
  orderId?: string
) {
  const url = new URL(path, baseUrl);
  url.searchParams.set('payment', paymentStatus);
  if (orderId) url.searchParams.set('orderId', orderId);
  return url.toString();
}

export function addMonthsToIso(iso: string | null | undefined, months = 6) {
  const now = iso ? new Date(iso) : new Date();
  const next = new Date(now);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}
