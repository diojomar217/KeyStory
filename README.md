# Couple QR Website Generator MVP

A full-stack web application for generating personalized couple websites with QR codes.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database)
- Cloudinary (image storage)
- Node `qrcode` library (QR code generation)
- Hosted on Vercel (free tier)
- QR code generation using the `qrcode` package

## Features
- Customer form to create a couple website with full customization options:
  - choose a color theme
  - select which sections (home, gallery, timeline) to include
  - pick layout templates for each section
  - add timeline events to populate the timeline section
- QR codes generated and stored per order
- Dynamic couple page that adapts to chosen sections, displays timer, gallery, timeline, and optional music
- Admin dashboard for order management

## Reliability Tooling
- Rate limiting on high-volume API routes (auth, order creation, analytics, guest messages).
- Admin audit logs via `admin_audit_logs` table and `/api/admin/audit-logs` endpoint.
- Background job queue (`background_jobs`) with retry backoff and processor endpoint.
- Upload retry jobs to recover failed Cloudinary data URL uploads.
- Web vitals collection endpoint with performance budget alerts.
- Optional webhook-based error alerting using `ALERT_WEBHOOK_URL`.

## Setup
1. Install dependencies:
   ```bash
   npm install
   # also add required libs
   npm install @supabase/supabase-js uuid qrcode cloudinary
   npm install -D @types/uuid
   ```
2. Configure environment variables for Supabase and Cloudinary (including `NEXT_PUBLIC_BASE_URL`).
3. Create the `orders` table in Supabase using `supabase-orders-table.sql`.
4. Ensure Cloudinary credentials are set and images will be uploaded server-side using the provided utility.
4. Run the development server:
   ```bash
   npm run dev
   ```

5. Apply reliability SQL schemas in Supabase:
   - `supabase-admin-audit-logs-table.sql`
   - `supabase-background-jobs-table.sql`
   - `supabase-web-vitals-table.sql`

6. Optional cron jobs:
   ```bash
   npm run job:auto-archive
   npm run job:cleanup-stale-orders
   npm run job:renewal-reminders
   npm run job:process-queue
   ```

## Vercel Deployment Notes
- Required env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
   - `PAYMONGO_SECRET_KEY`

- PayMongo flow notes:
   - Orders are created first with database `status: pending` and workflow `config.fulfillment.status: pending_payment`.
   - After PayMongo redirect success, backend verifies checkout session before marking order `ship`.
   - `/api/paymongo/webhook` can also sync successful payments even if the customer never returns to the site.
   - Transaction ID is saved from checkout session and shown in admin orders + customer tracking page.
- Optional reliability env vars:
   - `FEATURE_STRICT_RATE_LIMITING`
   - `FEATURE_AUDIT_LOGS`
   - `FEATURE_RETRY_FAILED_UPLOADS`
   - `FEATURE_BACKGROUND_JOB_QUEUE`
   - `NEXT_PUBLIC_FEATURE_WEB_VITALS`
   - `FEATURE_MONITORING_ALERTS`
   - `ALERT_WEBHOOK_URL`
   - `PAYMONGO_WEBHOOK_TOKEN` for protecting the PayMongo webhook endpoint
   - `PENDING_ORDER_ABANDON_MINUTES` to control when stale pending orders are auto-marked abandoned
   - `ORDER_CLEANUP_SECRET` or `CRON_SECRET` for unattended stale-order cleanup calls
   - `ORDER_CLEANUP_URL` to point the cleanup script at your deployed cleanup endpoint
- Archive storage on Vercel production:
   - Do not use `ARCHIVE_PROVIDER=local`.
   - Use `ARCHIVE_PROVIDER=s3` for durable archive/restore workflows.
   - Set S3 env vars:
      - `AWS_S3_ARCHIVE_BUCKET`
      - `AWS_REGION` (or `AWS_DEFAULT_REGION`)
      - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (or provide IAM role credentials)
      - Optional: `AWS_S3_ARCHIVE_PREFIX` (default: `keystory-archives`)
      - Optional: `AWS_S3_ENDPOINT` and `AWS_S3_FORCE_PATH_STYLE=true` (S3-compatible providers)

## Folder Structure
- `/app` - Next.js App Router pages
- `/components` - React components
- `/lib` - Utility functions (Supabase, Cloudinary, QR code)
- `/api` - API routes

## To Do
- Integrate Supabase and Cloudinary
- Implement all required features
- Polish UI/UX

---

This MVP is mobile-friendly and designed for a simple, romantic experience.
