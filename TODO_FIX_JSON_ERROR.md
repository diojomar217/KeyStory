# TODO: Fix JSON Parsing Error in Admin Pages

## Task
Fix the "Unexpected token '<', '<!DOCTYPE' is not valid JSON" error in Next.js App Router + TypeScript project.

## Steps to Complete:

- [x] 1. Create `/api/orders/route.ts` with GET handler
- [x] 2. Update `/admin/dashboard/page.tsx` to use `/api/orders` and check response.ok
- [x] 3. Update `/admin/websites/page.tsx` to use `/api/orders` and check response.ok
- [x] 4. Test the API endpoint at http://localhost:3000/api/orders
- [x] 5. Verify admin pages load correctly without JSON parsing errors

