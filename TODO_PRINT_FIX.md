# Keychain Print Fix Plan

## Tasks:
- [x] 1. Update keychain-print/page.tsx - Separate screen-only vs print-only sections
- [x] 2. Update KeychainPrintSheet.tsx - Add proper print visibility classes (done via page CSS)
- [x] 3. Update AdminLayout.tsx - Add print:hidden to sidebar

## Completed Changes:

### 1. app/admin/websites/[id]/keychain-print/page.tsx
- **Screen-only content (with print:hidden):**
  - Header with title and navigation links
  - Control panel (KeychainTypeSelector, Caption input, Copies input, Print Options button, Info section)
  - Live Preview (KeychainInsertPreview)
  - Print Sheet Preview container
  - Help text tip

- **Print-only content (hidden on screen, visible during print):**
  - KeychainPrintSheet component in a `<div className="hidden print:block print:p-0 print:m-0">` wrapper

- **Enhanced Print CSS:**
  - Hide all .print\:hidden elements
  - Show .print\:block content
  - Remove borders from print inserts
  - Remove box shadows
  - Hide admin layout elements (nav, aside, header)
  - Hide interactive elements (buttons, inputs, links)

### 2. components/admin/AdminLayout.tsx
- Added print:hidden wrapper around AdminSidebar to hide it during print

### Result:
- **On screen:** Admin sees full preview UI with controls, live preview, and print sheet preview
- **When printing:** Only the actual printable QR/photo inserts appear (no preview, no controls, no admin UI)

