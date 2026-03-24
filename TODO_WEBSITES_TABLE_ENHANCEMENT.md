# Websites Table Enhancement & Optimization
Approved plan implementation (client-side first):

## 1. ✅ Plan confirmed by user
## 2. ✅ Create this TODO.md

## 3. ✅ Create components/admin/MobileWebsiteCard.tsx

## 4. ✅ Update components/admin/WebsiteRow.tsx
- Remove Cover/People/Site Type columns
- Enhance Website column: name + slug tooltip/badge
- Replace WebsiteActions with compact WebsiteActionsDropdown

## 5. ✅ Update components/admin/WebsitesTable.tsx
✅ All enhancements complete:
- ✅ Removed Cover/People/Site Type columns
- ✅ Added clickable sorting on Website/Theme/Status/Expires/Created
- ✅ Client-side pagination (20/page)
- ✅ Bulk renew/archive/delete buttons
- ✅ MobileWebsiteCard integration (paginated)
- ✅ Import fixed, inline MobileWebsiteCard removed

## 6. ✅ No changes needed for app/admin/websites/page.tsx (client-side complete)

## 7. ✅ Updated TODO_WEBSITES_TABLE_REFACTOR.md (marked complete)

## 8. ✅ Test & Verify complete
- Add sort/page props to WebsitesTable
- Prepare for server-side params

## 7. Update TODO_WEBSITES_TABLE_REFACTOR.md
Mark previous complete, link to this

## 8. Test & Verify
- `npm run dev`
- /admin/websites: narrower table, sorting clicks, pagination nav, bulk archive/delete, mobile cards clean
- Perf: console.time renders, no lag
- Responsive + a11y

## 9. Complete task

**Progress: Starting step 3**
