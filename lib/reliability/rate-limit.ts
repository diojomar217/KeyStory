import { NextRequest, NextResponse } from 'next/server';

type RateLimitState = {
  count: number;
  windowStart: number;
};

export type RateLimitConfig = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

const store = new Map<string, RateLimitState>();

const getIp = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const parsed = forwarded.split(',')[0]?.trim();
  return parsed || 'unknown';
};

const pruneExpiredKeys = (now: number) => {
  if (store.size < 10000) return;
  for (const [key, value] of store.entries()) {
    if (now - value.windowStart > 15 * 60 * 1000) {
      store.delete(key);
    }
  }
};

export const checkRateLimit = (bucketKey: string, config: RateLimitConfig): { allowed: boolean; retryAfterSec: number; remaining: number } => {
  const now = Date.now();
  pruneExpiredKeys(now);

  const state = store.get(bucketKey);
  if (!state || now - state.windowStart >= config.windowMs) {
    store.set(bucketKey, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSec: 0, remaining: config.limit - 1 };
  }

  if (state.count >= config.limit) {
    const retryAfterMs = config.windowMs - (now - state.windowStart);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      remaining: 0,
    };
  }

  state.count += 1;
  store.set(bucketKey, state);
  return { allowed: true, retryAfterSec: 0, remaining: Math.max(0, config.limit - state.count) };
};

export const enforceRateLimit = (
  req: NextRequest,
  config: RateLimitConfig,
  customKey?: string,
): NextResponse | null => {
  const ip = getIp(req);
  const key = `${config.keyPrefix}:${customKey || ip}`;
  const result = checkRateLimit(key, config);

  if (result.allowed) return null;

  return NextResponse.json(
    {
      error: 'Rate limit exceeded. Please try again shortly.',
      retry_after_seconds: result.retryAfterSec,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSec),
      },
    },
  );
};
