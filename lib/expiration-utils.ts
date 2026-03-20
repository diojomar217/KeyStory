export type ExpirationMode = '3_months' | '6_months' | '1_year' | 'custom';

export const calculateExpirationDate = (mode: ExpirationMode, customDate?: string): string => {
  const now = new Date();

  if (mode === 'custom') {
    if (!customDate) {
      throw new Error('Custom expiration date is required');
    }
    const parsed = new Date(customDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error('Invalid custom expiration date');
    }
    if (parsed <= now) {
      throw new Error('Expiration date must be in the future');
    }
    return parsed.toISOString();
  }

  const result = new Date(now);
  switch (mode) {
    case '3_months':
      result.setMonth(result.getMonth() + 3);
      break;
    case '6_months':
      result.setMonth(result.getMonth() + 6);
      break;
    case '1_year':
      result.setFullYear(result.getFullYear() + 1);
      break;
    default:
      result.setMonth(result.getMonth() + 6);
  }

  return result.toISOString();
};

export const getDaysRemaining = (expiresAt?: string | null): number | null => {
  if (!expiresAt) return null;
  const then = new Date(expiresAt);
  if (Number.isNaN(then.getTime())) return null;
  const now = new Date();
  const ms = then.getTime() - now.getTime();
  if (ms < 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const getExpirationLabel = (expiresAt?: string | null): string => {
  if (!expiresAt) return 'No expiration set';
  const then = new Date(expiresAt);
  if (Number.isNaN(then.getTime())) return 'Invalid expiration';
  return then.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};