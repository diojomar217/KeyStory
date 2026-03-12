# Keychain QR Printing - Number of Copies Feature

## Task
Improve the keychain QR printing feature to allow admin to control the number of copies and generate only the required amount of printable inserts.

## Status: COMPLETED ✓

## Steps:
- [x] 1. Update KeychainPrintSheet.tsx to accept copies prop and generate dynamic grid
- [x] 2. Update keychain-print/page.tsx to add Number of Copies input control
- [x] 3. Add print-specific CSS styles to hide admin UI

## Implementation Notes:
- Default copies: 12
- Columns: 3 (fixed)
- Rows: calculated dynamically (Math.ceil(copies / columns))
- Print only generates required inserts, not overflow to extra pages

## Changes Made:

### 1. KeychainPrintSheet.tsx
- Changed `copies` prop from optional to required
- Added `columns` prop with default value of 3
- Dynamic row calculation: `Math.ceil(copies / columns)`
- Dynamic page generation based on actual copies needed
- Uses `useMemo` for insert indices array
- Shows actual page count in preview info

### 2. keychain-print/page.tsx
- Added `copies` state with default value of 12
- Added Number of Copies input field (1-100 range)
- Calculates and displays grid info (columns × rows = copies)
- Passes `copies` and `columns` props to KeychainPrintSheet
- Enhanced print CSS to hide admin sidebar, headers, buttons, inputs
- Added proper page break rules for clean printing

