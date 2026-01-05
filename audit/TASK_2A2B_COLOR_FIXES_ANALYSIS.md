# Task 2A.2b - Hardcoded Colors Fix Analysis

**Date:** 5 Gennaio 2026
**Status:** Analysis for 46 Remaining Color Violations

---

## 📊 Files with Violations Breakdown

### PRIORITY 1: PDF/Data Generation (ExportModal.tsx)
**File:** `src/components/ExportModal.tsx`  
**Violations:** 20 errors  
**Type:** PDF color palette for reports  
**Context:**
```typescript
const HEADER_BG = '#6750A4';         // PDF header background
const HEADER_COLOR = '#FFFFFF';       // PDF header text
const EVEN_ROW_BG = '#F3EDF7';        // PDF even rows
const trendColor = ...                // Dynamic trend colors (#388E3C, #D32F2F, #757575)
const levelColors = {                 // Competency level badge colors
  'A': { bg: '#FFD700', text: '#000000' },
  'B': { bg: '#C0C0C0', text: '#000000' },
  'C': { bg: '#66BB6A', text: '#FFFFFF' },
  'D': { bg: '#EF5350', text: '#FFFFFF' },
}
```

**Fix Strategy:** 
- These are PDF-specific colors (not CSS)
- Best practice: Extract to design-system/pdf-colors.ts or constants
- Add eslint-disable comment for data palette exception
- Move colors to a centralized object with token mapping

**Complexity:** MEDIUM (requires new utility file)

---

### PRIORITY 2: Component Style Fallbacks (Multiple Files)
**File:** `src/components/AssistantFab.tsx`  
**Violations:** 5 errors  
**Type:** CSS fallback colors in template literals  
**Context:**
```typescript
<style>{`
  .assistant-fab-root {
    background: var(--sys-primary, #6750A4);
    color: var(--sys-on-primary, #fff);
  }
  ...
`}</style>
```

**Fix Strategy:**
- Remove fallback colors (rely on CSS variables only)
- Ensure CSS variables are defined in design-system
- These fallbacks are just insurance, not actual colors

**Complexity:** LOW (simple remove fallbacks)

---

### PRIORITY 3: Component Props with Fallbacks (ProgettazioneHub.tsx)
**File:** `src/components/ProgettazioneHub.tsx`  
**Violations:** 9 errors  
**Type:** CSS variable with HEX fallback  
**Context:**
```typescript
<M3ExpressiveCard
  color="var(--md-sys-color-secondary-container, #e8def8)"
/>
```

**Fix Strategy:**
- Replace with proper token variable
- Map --md-sys-* to --sys-* tokens
- Remove HEX fallbacks

**Complexity:** LOW (property replacement)

---

### PRIORITY 4: Data Defaults (Settings.tsx)
**File:** `src/components/Settings.tsx`  
**Violations:** 3 errors  
**Type:** Data default fallback colors  
**Context:**
```typescript
primary: theme.colors.primary ?? '#000000',
secondary: theme.colors.secondary ?? '#000000',
tertiary: theme.colors.tertiary ?? '#000000'
```

**Fix Strategy:**
- These are fallbacks for missing data
- Use token variable as fallback instead of #HEX
- Map to appropriate token: `var(--sys-primary)`, etc.

**Complexity:** LOW (variable replacement)

---

### PRIORITY 5: App.tsx
**File:** `src/components/App.tsx`  
**Violations:** 1 error  
**Type:** Inline color style  
**Context:**
```typescript
backgroundColor: '#fff0f0'  // Light pink background
```

**Fix Strategy:**
- Replace with token or surface color
- Analyze intent of pink color (notification? highlight?)

**Complexity:** LOW (single color)

---

## 🎯 Fix Execution Order

```
STEP 1: High-Impact, Low-Risk
├─ AssistantFab.tsx (5 errors, LOW effort)
├─ Settings.tsx (3 errors, LOW effort)
└─ App.tsx (1 error, LOW effort)
   └─ Result: 9 violations → 0 (easy wins)

STEP 2: Medium-Complexity
├─ ProgettazioneHub.tsx (9 errors, LOW effort)
└─ Result: 0 → 9 (property updates)

STEP 3: Complex, Requires Infrastructure
├─ Create design-system/pdf-colors.ts
├─ ExportModal.tsx (20 errors, MEDIUM effort)
└─ Result: 20 violations → 0 with new utility
```

---

## 📋 Fix Details by File

### Fix 1: AssistantFab.tsx (Remove fallbacks from CSS)

```diff
- background: var(--sys-primary, #6750A4);
- color: var(--sys-on-primary, #fff);
+ background: var(--sys-primary);
+ color: var(--sys-on-primary);
```

**Lines affected:** 219 (and surrounding styles)

---

### Fix 2: Settings.tsx (Replace fallbacks with tokens)

```diff
- primary: theme.colors.primary ?? '#000000',
- secondary: theme.colors.secondary ?? '#000000',
- tertiary: theme.colors.tertiary ?? '#000000'
+ primary: theme.colors.primary ?? 'var(--sys-primary)',
+ secondary: theme.colors.secondary ?? 'var(--sys-secondary)',
+ tertiary: theme.colors.tertiary ?? 'var(--sys-tertiary)'
```

**Lines affected:** 288-290

---

### Fix 3: App.tsx (Replace with token)

```diff
- backgroundColor: '#fff0f0'
+ backgroundColor: 'var(--sys-surface-variant)'
```

**Line affected:** 466

---

### Fix 4: ProgettazioneHub.tsx (Replace md-sys tokens)

Multiple lines need replacement of pattern:
```
var(--md-sys-color-X, #HEX)
↓
var(--sys-X)
```

**Specific replacements:**
- `var(--md-sys-color-secondary-container, #e8def8)` → `var(--sys-secondary-container)`
- `var(--md-sys-color-tertiary-container, #ffd8e4)` → `var(--sys-tertiary-container)`
- `var(--md-sys-color-surface-container, #f7f2fa)` → `var(--sys-surface-container)`
- `var(--md-sys-color-surface-container, #e3f2fd)` → `var(--sys-surface-container)`

**Lines affected:** 538, 547, 556, 567, 576, 585, 594, 603, 612

---

### Fix 5: ExportModal.tsx (Create utility + update calls)

**New file:** `src/design-system/pdf-colors.ts`
```typescript
/**
 * PDF REPORT COLOR PALETTE
 * Colors used specifically for PDF generation via jsPDF.
 * These are NOT CSS colors—they are HEX values for document rendering.
 */

export const PDF_COLORS = {
  // Header styling
  header: {
    background: '#6750A4',  // Primary color
    text: '#FFFFFF',        // High contrast text
  },
  
  // Table styling
  table: {
    evenRowBg: '#F3EDF7',   // Light purple (secondary-container variant)
    borderColor: 200,       // Grayscale for borders
  },
  
  // Trend indicators
  trend: {
    positive: '#388E3C',    // Green (success)
    negative: '#D32F2F',    // Red (error)
    stable: '#757575',      // Gray (neutral)
  },
  
  // Competency level badges
  competencyLevels: {
    A: { bg: '#FFD700', text: '#000000' },  // Gold
    B: { bg: '#C0C0C0', text: '#000000' },  // Silver
    C: { bg: '#66BB6A', text: '#FFFFFF' },  // Green
    D: { bg: '#EF5350', text: '#FFFFFF' },  // Red
  },
} as const;
```

**In ExportModal.tsx:**
```typescript
import { PDF_COLORS } from '../design-system/pdf-colors';

// Replace hardcoded values with:
const HEADER_BG = PDF_COLORS.header.background;
const HEADER_COLOR = PDF_COLORS.header.text;
const EVEN_ROW_BG = PDF_COLORS.table.evenRowBg;
const trendColor = summary.trend === 'up' ? PDF_COLORS.trend.positive : ...;
const levelColors = PDF_COLORS.competencyLevels;
```

**Add eslint-disable comment:**
```typescript
/* eslint-disable design-system/no-hardcoded-colors */
/**
 * PDF REPORT COLOR UTILITIES
 * These colors are used exclusively for PDF document generation via jsPDF.
 * These are NOT CSS colors and are not subject to the component styling rules.
 * Not affected by dark mode or theme switching (PDFs are always same colors).
 */
export const PDF_COLORS = { ... }
```

---

## 🔍 Token Mapping Reference

For ProgettazioneHub replacements, use this mapping:
```
--md-sys-color-secondary-container → --sys-secondary-container
--md-sys-color-tertiary-container → --sys-tertiary-container
--md-sys-color-surface-container → --sys-surface-container
```

For App.tsx pink color:
```
#fff0f0 → var(--sys-surface) or var(--sys-surface-variant)
(depends on actual visual intent - check design system)
```

For Settings.tsx fallbacks:
```
#000000 → var(--sys-primary)
(or map to appropriate error color if this is for missing data)
```

---

## ✅ Expected Outcomes

**After all fixes:**
- AssistantFab.tsx: 5 → 0 errors
- Settings.tsx: 3 → 0 errors
- App.tsx: 1 → 0 errors
- ProgettazioneHub.tsx: 9 → 0 errors
- ExportModal.tsx: 20 → 0 errors (new PDF utility)

**Total:** 38 errors fixed directly + 8 other errors from ESLint rules violations

**Final eslint output:** 92 → ~50 violations (majority remaining are spacing warnings)

---

## 🚀 Implementation Plan

1. **Phase 1 (Easy wins):** Fix 3 files with simple replacements (AssistantFab, Settings, App)
2. **Phase 2 (Property updates):** Fix ProgettazioneHub with token variable updates
3. **Phase 3 (New infrastructure):** Create PDF colors utility and refactor ExportModal

**Estimated time:** 1-2 hours total

