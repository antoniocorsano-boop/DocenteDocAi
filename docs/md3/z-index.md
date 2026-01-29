# MD3 Z-Index Governance

## Overview

This document defines the z-index layering policy for DocenteDoc AI, ensuring consistent and predictable UI layering across all components.

## Single Source of Truth

All z-index values are defined in `src/styles/md3-z-index.css`. This file is the **single source of truth** for layering and must never be bypassed.

## Allowed Tokens

The following MD3 z-index tokens are permitted:

| Token | Value | Semantic Meaning |
|-------|-------|------------------|
| `--md-sys-z-base` | 0 | Base layer (default) |
| `--md-sys-z-raised` | 10 | Raised elements (cards, buttons) |
| `--md-sys-z-nav` | 100 | Navigation elements (bottom nav, side nav) |
| `--md-sys-z-app-bar` | 200 | App bars and headers |
| `--md-sys-z-sticky` | 300 | Sticky elements |
| `--md-sys-z-snackbar` | 400 | Snackbars and toasts |
| `--md-sys-z-modal` | 500 | Modal dialogs and overlays |
| `--md-sys-z-tooltip` | 600 | Tooltips and dropdowns |

## Usage

Always use CSS variables in your components:

```tsx
// ✅ CORRECT
<div style={{ zIndex: 'var(--md-sys-z-modal)' }} />

// ❌ FORBIDDEN - numeric values
<div style={{ zIndex: 500 }} />

// ❌ FORBIDDEN - legacy tokens
<div style={{ zIndex: 'var(--z-modal)' }} />
```

## Forbidden Patterns

### Numeric Z-Index Values
```tsx
// ❌ BLOCKED by ESLint rule 'no-numeric-zindex'
<div style={{ zIndex: 100 }} />
<div style={{ zIndex: '200' }} />
```

### Legacy --z-* Tokens
```tsx
// ❌ BLOCKED by ESLint rule 'no-legacy-z-tokens'
<div style={{ zIndex: 'var(--z-modal)' }} />
<div style={{ zIndex: 'var(--z-nav)' }} />
```

### JavaScript Constants
```tsx
// ❌ BLOCKED by ESLint rule 'no-numeric-zindex'
const Z_INDEX = { modal: 500 };
<div style={{ zIndex: Z_INDEX.modal }} />
```

## Modal Stacking

For modal stacking, use the utility functions in `src/design-system/zIndex.ts`:

```tsx
import { getModalZIndex, getModalContentZIndex } from '../design-system/zIndex';

// Modal at level 0: z-index = var(--md-sys-z-modal)
const modalZIndex = getModalZIndex(0); // 'var(--md-sys-z-modal)'

// Modal content: z-index = var(--md-sys-z-tooltip)
const contentZIndex = getModalContentZIndex(0); // 'var(--md-sys-z-tooltip)'
```

## CI Enforcement

Z-index regressions are **impossible without breaking CI** due to:

1. **ESLint Rules**: `no-numeric-zindex` and `no-legacy-z-tokens` fail builds
2. **Unit Tests**: Anti-regression tests in `__tests__/m3-regression.test.ts`
3. **Single Source**: All tokens centralized in one file

## Adding New Layers

To add a new z-index layer:

1. Add the token to `src/styles/md3-z-index.css`
2. Update this documentation
3. Update the test suite in `__tests__/m3-regression.test.ts`
4. Ensure the value fits the semantic hierarchy

## Migration Notes

- **Legacy tokens** (`--z-*`) are forbidden and will break CI
- **Numeric values** are forbidden and will break CI
- All components must use `var(--md-sys-z-*)` syntax
- Migration completed: 2026-01-29</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\docs\md3\z-index.md