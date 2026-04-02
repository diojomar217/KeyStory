'use client';

import { useEffect } from 'react';
import { featureFlags } from '@/lib/reliability/feature-flags';

type Metric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
};

const supportsSendBeacon = (): boolean => typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function';

export default function WebVitalsReporter() {
  useEffect(() => {
    if (!featureFlags.webVitalsTracking()) return;

    let cancelled = false;

    const start = async () => {
      const mod = await import('web-vitals');
      if (cancelled) return;

      const sendMetric = (metric: Metric) => {
        const payload = JSON.stringify({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          delta: metric.delta,
          rating: metric.rating || 'good',
          path: window.location.pathname,
          user_agent: navigator.userAgent,
        });

        if (supportsSendBeacon()) {
          navigator.sendBeacon('/api/analytics/web-vitals', payload);
          return;
        }

        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Best-effort only.
        });
      };

      mod.onLCP(sendMetric);
      mod.onINP(sendMetric);
      mod.onCLS(sendMetric);
      mod.onTTFB(sendMetric);
      mod.onFCP(sendMetric);
    };

    start().catch(() => {
      // Best-effort only.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
