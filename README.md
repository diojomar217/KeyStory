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
- Customer form to create a couple website
- QR codes generated and stored per order
- Dynamic couple page with gallery, timer, and music
- Admin dashboard for order management

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
