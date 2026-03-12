# Section + Template Rendering Engine Refactor

## Overview
Refactor the Love Story Website Builder into a scalable, registry-driven architecture.

---

## ✅ COMPLETED - Core Infrastructure Created

### Created Files:

1. **`lib/section-renderer-registry.ts`** - Maps sections to renderer components with props builders
2. **`lib/section-validation.ts`** - Registry-driven validation rules
3. **`lib/index.ts`** - Main export file for easy imports
4. **`components/love/DynamicSectionRenderer.tsx`** - Dynamic section renderer component

### Key Architecture Components:

#### 1. Section Registry (lib/section-registry.tsx) - ALREADY EXISTS
- Comprehensive metadata with requirements
- Template definitions with previews
- Helper functions for template management
- Backward compatibility helpers

#### 2. Section Renderer Registry (lib/section-renderer-registry.ts)
- Maps 20+ sections to React components
- Props builder functions per section
- Template selection support

#### 3. Dynamic Section Renderer (components/love/DynamicSectionRenderer.tsx)
- Renders sections dynamically from config
- Supports both old and new template formats
- Handles all section-specific props

#### 4. Validation (lib/section-validation.ts)
- Registry-driven validation rules
- Warning/error/info message support
- Legacy helpers for backward compatibility

---

## 📋 NEXT STEPS - Files to Modify

### 1. LovePageClient.tsx (Priority: HIGH)
Replace hardcoded section rendering with dynamic renderer:
```typescript
// Instead of large if/else chains:
{sections.map(section => (
  <DynamicSectionRenderer
    key={section}
    section={section}
    config={config}
    {...data}
  />
))}
```

### 2. SectionSelector.tsx (Priority: MEDIUM)
- Use SECTION_REGISTRY instead of SECTION_TOGGLES
- Use registry metadata for section info

### 3. SectionPreviews.tsx (Priority: MEDIUM)
- Replace switch statement with registry-driven rendering

### 4. SummaryPanel.tsx (Priority: LOW)
- Use validation functions from section-validation.ts

---

## Benefits

- **Scalable**: Adding new sections = updating registry only
- **Maintainable**: No hardcoded if/switch statements
- **Flexible**: Template selection driven by registry
- **Validatable**: Validation is metadata-driven
- **Backward Compatible**: Supports both old and new config formats

