type FlagValue = '1' | 'true' | 'yes' | 'on';

const truthyValues: FlagValue[] = ['1', 'true', 'yes', 'on'];

const normalize = (value: string | undefined): string => (value || '').trim().toLowerCase();

export const isFlagEnabled = (flagName: string, defaultValue = false): boolean => {
  const raw = process.env[flagName];
  if (raw === undefined) return defaultValue;
  return truthyValues.includes(normalize(raw) as FlagValue);
};

export const featureFlags = {
  strictRateLimiting: () => isFlagEnabled('FEATURE_STRICT_RATE_LIMITING', true),
  auditLogs: () => isFlagEnabled('FEATURE_AUDIT_LOGS', true),
  retryFailedUploads: () => isFlagEnabled('FEATURE_RETRY_FAILED_UPLOADS', true),
  backgroundJobQueue: () => isFlagEnabled('FEATURE_BACKGROUND_JOB_QUEUE', true),
  webVitalsTracking: () => isFlagEnabled('NEXT_PUBLIC_FEATURE_WEB_VITALS', true),
  monitoringAlerts: () => isFlagEnabled('FEATURE_MONITORING_ALERTS', true),
};
