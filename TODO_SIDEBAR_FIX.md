# Sidebar Fix TODO

## Task: Fix collapsible sidebar width animation

### Steps:
- [x] 1. Update AdminSidebar.tsx - Fix width classes (w-64 expanded, w-16 collapsed)
- [x] 2. Update AdminSidebar.tsx - Fix label visibility (show icons only when collapsed)
- [x] 3. Update AdminSidebar.tsx - Add transition-all duration-300
- [x] 4. Verify AdminLayout.tsx has proper flex layout for main content

### Details:
- Expanded: w-64
- Collapsed: w-16
- Transition: transition-all duration-300
- When collapsed: hide labels, show icons only
- When expanded: show icons and labels
- Main content should expand when sidebar collapses

### Changes Made:
1. Sidebar width: Changed from w-72 lg:w-64 + lg:w-20 to w-64 + w-16
2. Logo section: Removed lg: prefixes to apply to all screen sizes when collapsed
3. Navigation labels: Fixed to use w-0 opacity-0 when collapsed (not lg:hidden)
4. Logout button: Fixed to use justify-center and hide text when collapsed
5. AdminLayout already had flex layout with flex-1 on main content

