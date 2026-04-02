# Technical and Reliability Plan (111-120)

## 111) Image optimization pipeline
- Current: Cloudinary uploads already use automatic format and quality defaults.
- Added: retry pipeline for failed data URL uploads through background jobs.
- Action: keep hero image at higher quality and gallery images eco profile.

## 112) CDN caching strategy
- Add immutable cache headers for static assets.
- Add stale-while-revalidate for public site routes.
- Keep API routes non-cacheable unless explicitly safe.

## 113) Background job queue
- Added `background_jobs` table schema.
- Added queue claiming, retry backoff, and completion helpers.
- Added processing endpoint and script for cron execution.

## 114) Retry system for failed uploads
- Added exponential retry helper.
- Failed Cloudinary uploads can now be queued and replayed against stored site config.

## 115) Rate limiting and abuse controls
- Added in-memory IP based rate limiter utility.
- Applied to public high-volume API endpoints (auth, analytics, guest messages, order create).

## 116) Audit logs for admin actions
- Added `admin_audit_logs` table schema and insertion helper.
- Admin update, archive, restore, and job processing actions should log success/failure.

## 117) Feature flags for staged rollout
- Added env-based feature flags under `lib/reliability/feature-flags.ts`.
- Use for staged enable/disable of queue, monitoring alerts, and web vitals.

## 118) Error monitoring and alerting
- Added capture helper with optional webhook forwarding via `ALERT_WEBHOOK_URL`.
- Use from API catches for actionable error visibility.

## 119) Backup and recovery plan
- Existing archive and restore flows remain the primary backup strategy.
- Keep archive cron active and test monthly restore drills.
- Future hardening: cloud provider backup target and encryption at rest.

## 120) Performance budget and page-speed tracking
- Added explicit budget thresholds.
- Added web vitals API endpoint + table for trend tracking and budget breach alerts.

## Suggested env variables
- `FEATURE_STRICT_RATE_LIMITING=1`
- `FEATURE_AUDIT_LOGS=1`
- `FEATURE_RETRY_FAILED_UPLOADS=1`
- `FEATURE_BACKGROUND_JOB_QUEUE=1`
- `NEXT_PUBLIC_FEATURE_WEB_VITALS=1`
- `FEATURE_MONITORING_ALERTS=1`
- `ALERT_WEBHOOK_URL=https://...`
