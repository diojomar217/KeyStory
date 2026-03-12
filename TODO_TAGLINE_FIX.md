# TODO: Fix Tagline in Edit Website Form

## Status: COMPLETED

## Root Cause
The Edit Website form (`app/admin/websites/[id]/edit/page.tsx`) was missing:
1. Tagline in form type definition
2. Tagline in initial state
3. Tagline mapping from fetched order
4. Tagline input JSX in the form
5. Tagline in submit payload
6. Tagline in API PUT handler
7. Tagline in database storage

## Important Note
The tagline is stored in the `config` JSON field in the database (not as a direct column) to maintain compatibility with the existing database schema.

## Changes Made

### Step 1: Add tagline to Edit form type and state (app/admin/websites/[id]/edit/page.tsx) ✅
- Added tagline to LocalForm type
- Added tagline to initial state

### Step 2: Map tagline from fetched order (app/admin/websites/[id]/edit/page.tsx) ✅
- Mapped tagline from order.config?.tagline

### Step 3: Add Tagline input JSX (app/admin/websites/[id]/edit/page.tsx) ✅
- Added Tagline input below Love Message, above Song Link
- Matched styling from Create form
- Added maxLength={120}
- Added helper text

### Step 4: Include tagline in submit payload (app/admin/websites/[id]/edit/page.tsx) ✅
- Added tagline to the PUT request body

### Step 5: Add tagline to API PUT handler (app/api/admin/route.ts) ✅
- Added tagline to the config object in the update handler

## Completion
- [x] Step 1: Add tagline to Edit form type and state  
- [x] Step 2: Map tagline from fetched order
- [x] Step 3: Add Tagline input JSX
- [x] Step 4: Include tagline in submit payload
- [x] Step 5: Add tagline to API PUT handler

