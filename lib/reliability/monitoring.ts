import { featureFlags } from '@/lib/reliability/feature-flags';

type MonitoringPayload = {
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
  level?: 'error' | 'warn';
};

const postAlert = async (payload: MonitoringPayload): Promise<void> => {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl || !featureFlags.monitoringAlerts()) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[${payload.level || 'error'}] ${payload.source}: ${payload.message}`,
        metadata: payload.metadata || {},
        at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.warn('Failed to send alert webhook', err);
  }
};

export const captureError = async (source: string, error: unknown, metadata?: Record<string, unknown>) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${source}]`, error, metadata || {});
  await postAlert({ source, message, metadata, level: 'error' });
};

export const captureWarning = async (source: string, message: string, metadata?: Record<string, unknown>) => {
  console.warn(`[${source}]`, message, metadata || {});
  await postAlert({ source, message, metadata, level: 'warn' });
};
