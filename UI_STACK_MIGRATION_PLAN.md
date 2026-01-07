# UI Stack: Technical Debt & Quick-Win Fixes

**Companion to:** UI_STACK_CRITICAL_REVIEW.md  
**Timeline:** Quick wins (1-2 days), Full migration (2-3 weeks)

---

## Quick Wins (This Sprint)

### 1. Add ESLint Rule: Prevent New MUI Imports

**Effort:** 30 minutes  
**Impact:** Stops accumulation of debt

```js
// eslint.config.mjs - Add new rule:
{
  files: ['src/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material',
            message: 'Use M3 components instead. See CONTRIBUTING.md for component mapping.'
          },
          {
            name: '@emotion/react',
            message: 'Use CSS classes or CSS variables instead. Emotion conflicts with Tailwind.'
          },
          {
            name: '@emotion/styled',
            message: 'Use CSS modules or Tailwind instead.'
          }
        ]
      }
    ]
  }
}
```

**Verify:**
```bash
npm run lint  # Should flag any new MUI imports
```

### 2. Document Current State in CONTRIBUTING.md

**Effort:** 1 hour  
**Impact:** Onboards developers, prevents future confusion

```markdown
# Contributing Guide - UI Stack Policy

## Architecture Decision: Material Design 3 + Tailwind

This project uses a consolidated UI stack:

### ✅ ALLOWED
- **M3 Components** (`src/components/ui/M3*.tsx`)
  - M3Button, M3Card, M3Dialog, M3Chip, etc.
  - Use for all semantic UI components
  
- **Tailwind CSS** (layout, spacing, responsive)
  - `flex`, `gap-6`, `max-h-[400px]`, responsive `md:`, `lg:` prefixes
  - Color classes: `text-primary`, `bg-surface` (mapped to M3 tokens)
  - Spacing classes: `p-6`, `px-4`, `py-3` (mapped to M3 spacing)

### ❌ FORBIDDEN
- `@mui/material` imports (full library unused)
- `@emotion/react` or `@emotion/styled` (conflicts with Tailwind)
- Hardcoded colors: `bg-blue-500`, `#6750A4`, `rgba(0,0,0,0.1)`
- Arbitrary Tailwind colors not in M3 system

### Component Decision Tree

Need a button?
```
START
  └─ Is it a standard button (filled, outlined, text)?
      ├─ YES → Use M3Button
      └─ NO → Check if MUI has special behavior
              (probably doesn't, use M3Button anyway)
```

Need a popover/dropdown?
```
START
  └─ Is it a popover menu?
      ├─ YES → Use M3Popover (COMING SOON)
      └─ NO → Use M3Button + custom positioning
```

Need layout/spacing?
```
START
  └─ Use Tailwind utilities
      ├─ flex, grid, gap-*, p-*, m-*
      ├─ md:, lg: responsive prefixes
      └─ M3 color aliases: text-primary, bg-surface
```

### Color Usage

```tsx
// ✅ CORRECT: M3 semantic colors via Tailwind alias
<div className="text-primary bg-surface p-6">

// ✅ CORRECT: M3 semantic colors via CSS variable
<div style={{ color: 'var(--md-sys-color-primary)' }}>

// ❌ WRONG: Tailwind built-in colors
<div className="text-blue-500">

// ❌ WRONG: Hardcoded hex/RGB
<div style={{ color: '#6750A4' }}>
```

### Spacing Usage

```tsx
// ✅ CORRECT: M3 spacing scale via Tailwind
<div className="p-6 gap-4 max-h-[400px]">

// ✅ CORRECT: M3 spacing via CSS variable
<div style={{ padding: 'var(--md-sys-spacing-6)' }}>

// ❌ WRONG: Arbitrary Tailwind spacing
<div className="p-5">  {/* Not in M3 scale */}

// ❌ WRONG: Hardcoded pixel values
<div style={{ padding: '24px' }}>
```

### When to Create New M3 Components

If a UI pattern appears 2+ times or is complex:
1. Create `src/components/ui/M3NewComponent.tsx`
2. Extend with Tailwind if layout-specific
3. Export from `src/components/ui/index.ts`
4. Add Storybook story
5. Add unit tests

Example: M3Popover (needed for 3+ popovers in app)
```tsx
// src/components/ui/M3Popover.tsx
export interface M3PopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}

export const M3Popover: React.FC<M3PopoverProps> = ({ ... }) => {
  // Positioning logic, M3 styling, etc.
};
```

### Testing

- Mock M3 components simply: `vi.mock('./ui', () => ({ M3Button: () => <button /> }))`
- Don't mock Tailwind classes (they don't need mocking)
- No need to mock @mui/material (should be gone soon)
```

### 3. Create Component Mapping Chart

**Effort:** 2 hours  
**Impact:** Clear reference for "which tool handles this"

Create `docs/COMPONENT_MAPPING.md`:

```markdown
# Component Mapping: Tool Selection

## Standard Components (Use M3)

| Need | Component | Example | Status |
|------|-----------|---------|--------|
| Button | M3Button | `<M3Button variant="filled">` | ✅ Exists |
| Filled Button | M3Button variant="filled" | Primary action | ✅ Exists |
| Outlined Button | M3Button variant="outlined" | Secondary action | ✅ Exists |
| Text Button | M3Button variant="text" | Tertiary action | ✅ Exists |
| Card | M3Card | Content container | ✅ Exists |
| Dialog | M3Dialog | Modal form | ✅ Exists |
| Chip | M3Chip | Tag/filter | ✅ Exists |
| TextField | TextField | Form input | ✅ Exists |
| Icon Button | M3IconButton | Action icon | ✅ Exists |
| List Item | M3ListItem | Menu item | ✅ Exists |
| Bottom App Bar | M3BottomAppBar | Mobile navigation | ✅ Exists |
| Rating Bar | M3RatingBar | Star rating | ✅ Exists |

## Complex Components (Need M3 Creation)

| Need | Current Solution | Better M3 Solution | Priority | ETA |
|------|------------------|-------------------|----------|-----|
| Popover Menu | MUI Popover ⚠️ | M3Popover (NEW) | HIGH | Week 1 |
| Dropdown Menu | MUI Menu ⚠️ | M3Menu (NEW) | HIGH | Week 1 |
| Tooltip | N/A | M3Tooltip | MEDIUM | Week 2 |
| Drawer/Sidebar | N/A | M3Drawer | MEDIUM | Week 3 |
| Date Picker | N/A | M3DatePicker (exists, check) | LOW | Q2 |
| Data Table | N/A | M3DataTable | LOW | Q3 |

## Layout & Responsive (Use Tailwind)

| Need | Classes | Example |
|------|---------|---------|
| Flexbox | `flex items-center gap-4` | `<div className="flex items-center gap-4">` |
| Grid | `grid grid-cols-2 md:grid-cols-3` | Responsive layout |
| Spacing | `p-6 m-4 gap-8` | M3 spacing scale |
| Responsive | `md:p-4 lg:p-6` | Breakpoint utilities |
| Overflow | `overflow-y-auto max-h-[400px]` | Scrollable container |
| Display | `hidden md:block` | Responsive visibility |
| Text Style | `font-bold text-sm uppercase` | Text modifiers (non-color) |

## Colors (Use M3 Aliases)

| Need | Tailwind Class | CSS Variable | Example |
|------|----------------|--------------|---------|
| Primary Text | `text-primary` | `var(--md-sys-color-primary)` | Labels, links |
| Surface | `bg-surface` | `var(--md-sys-color-surface)` | Background |
| On Surface | `text-on-surface` | `var(--md-sys-color-on-surface)` | Main text |
| Surface Container | `bg-surface-container` | `var(--md-sys-color-surface-container)` | Cards |
| Error | `text-error` | `var(--md-sys-color-error)` | Validation |

## Decision Rules

```
┌─────────────────────────────────────────────┐
│ What am I building?                         │
└─────────────────────────────────────────────┘
         │
    ┌────┴────────────────────┬──────────────────┐
    │                          │                  │
    v                          v                  v
Standard UI Element     Layout/Responsive      Text Styling
    │                          │                  │
    v                          v                  v
Use M3 Component       Use Tailwind Utils    Use Tailwind Classes
(Button, Card, etc.)   (flex, grid, gap)     + M3 Color Aliases
```
```

---

## Medium Wins (Next 1-2 Weeks)

### 4. Create M3Popover Component

**Files to create:**
- `src/components/ui/M3Popover.tsx` (80 lines)
- `src/components/ui/M3Popover.stories.tsx` (60 lines)
- `__tests__/M3Popover.test.tsx` (120 lines)

**Implementation:** (See Section 6.3 of main review)

### 5. Create M3Menu Component

**Files to create:**
- `src/components/ui/M3Menu.tsx` (100 lines)
- `src/components/ui/M3Menu.stories.tsx` (80 lines)
- `__tests__/M3Menu.test.tsx` (150 lines)

### 6. Migrate Popover Components

**Files to update:**
- EventActionPopover.tsx
- QuickNotePopover.tsx
- NotificationsPopover.tsx
- StudentActionMenu.tsx

**Per file:** ~30 minutes refactor

---

## Big Win (Cleanup & Migration)

### 7. Remove MUI Dependencies

**Step 1: Update package.json**
```bash
npm uninstall @mui/material @emotion/react @emotion/styled
```

**Step 2: Update import statements**
```tsx
// BEFORE
import { Popover, Box, Button } from '@mui/material';

// AFTER
import { M3Popover, M3Button } from './ui';
```

**Step 3: Update Storybook setup**
```tsx
// .storybook/preview.ts - Remove MUI provider if present
// Remove: ThemeProvider, createTheme, MUI theme config
```

**Step 4: Update ESLint**
```js
// eslint.config.mjs - Remove MUI-specific rules
// Remove: @mui/material rule checks
```

**Step 5: Verify bundle size**
```bash
npm run build
# Check dist/ size reduction (~500 KB)
```

---

## Metrics to Track

### Before Migration
```
$ npm run build

✔ src/main.tsx                                             123.45 KB │ gzip: 42.12 KB
  Total:                                                 487.32 KB │ gzip: 156.45 KB
  
Dependencies breakdown:
  @mui/material:      ~700 KB (unminified)
  @emotion/react:     ~150 KB
  @emotion/styled:    ~80 KB
  custom M3:          ~50 KB
  Tailwind:           ~15 KB (runtime only in this app)
```

### After Migration
```
$ npm run build

✔ src/main.tsx                                              95.23 KB │ gzip: 35.42 KB
  Total:                                                  387.12 KB │ gzip: 127.34 KB
  
Saved: ~100 KB gzip (19% reduction)
```

---

## Risk Mitigation

### Risk 1: Breaking Existing Popovers
**Mitigation:**
- Build M3Popover with identical API to MUI Popover
- Test thoroughly in Storybook before migrating
- Keep MUI temporarily in package.json while testing

### Risk 2: Styling Differences
**Mitigation:**
- Create visual regression tests
- Compare side-by-side before/after in Storybook
- Manual review by UI/UX before merge

### Risk 3: Missed MUI Usage
**Mitigation:**
- Use ESLint rule to catch remaining imports
- Run `grep -r "@mui/material" src/` before cleanup
- Add pre-commit hook to prevent re-introduction

---

## Success Criteria

### After Migration Complete
- [ ] `grep -r "@mui/material"` returns zero results
- [ ] `npm run build` shows 100+ KB gzip reduction
- [ ] All 4 popover components working identically
- [ ] Full test suite passing (npm test)
- [ ] ESLint passes (npm run lint)
- [ ] Visual regression tests pass
- [ ] Bundle analysis confirms ~500 KB total savings

---

## Timeline Estimate

| Phase | Tasks | Effort | Start | End |
|-------|-------|--------|-------|-----|
| **Quick Wins** | ESLint rule, docs, mapping | 3-4 hours | Week 1 Day 1 | Week 1 Day 1 |
| **Foundation** | M3Popover + M3Menu | 12-16 hours | Week 1 Day 2 | Week 2 Day 1 |
| **Migration** | Update 4 components | 4-6 hours | Week 2 Day 1 | Week 2 Day 2 |
| **Testing** | Regression + visual tests | 4-6 hours | Week 2 Day 2 | Week 2 Day 3 |
| **Cleanup** | Remove MUI, update config | 2-3 hours | Week 2 Day 3 | Week 2 Day 4 |
| **Total** | **Full migration** | **25-35 hours** | Week 1 | Week 2 |

**Team capacity:** 1 FTE working solo, or 0.5 FTE integrated with normal work

---

## Implementation Order

### Week 1
```
Mon: ESLint rule + Contributing.md updates
     ↓ (3-4 hours)
     
Tue-Wed: Build M3Popover + M3Menu + Storybook stories
         ↓ (12-16 hours)
         
Thu: Write tests, verify in Storybook
     ↓ (4-6 hours)
```

### Week 2
```
Mon-Tue: Migrate EventActionPopover, QuickNotePopover, NotificationsPopover
         ↓ (4-6 hours)
         
Tue-Wed: Test, visual regression checks, fix issues
         ↓ (4-6 hours)
         
Thu: Remove @mui/material, update config, final testing
     ↓ (2-3 hours)
     
Fri: Code review, merge, monitor
```

---

## Rollback Plan

If critical issues arise:

```bash
# Quick rollback (keep MUI temporarily)
git revert <migration-commit>

# Or, restore MUI temporarily
npm install @mui/material@7.3.6 @emotion/react@11.14.0 @emotion/styled@11.14.1

# Re-import Popover components
git checkout <old-popover-files>
```

**Estimated rollback time:** 30 minutes

---

## Handoff Documentation

After migration, update:
- [ ] CONTRIBUTING.md (decision tree, component mapping)
- [ ] COMPONENT_MAPPING.md (which tool for what)
- [ ] Package.json dependencies (remove MUI entries)
- [ ] ESLint config (MUI rules removed)
- [ ] Onboarding guide (2 systems instead of 3)

---

## Related Documents

- [UI_STACK_CRITICAL_REVIEW.md](UI_STACK_CRITICAL_REVIEW.md) - Full architectural analysis
- [CONTRIBUTING.md](#) - Developer guidelines (to be updated)
- [docs/DESIGN_SYSTEM_CONSOLIDATION.md](docs/DESIGN_SYSTEM_CONSOLIDATION.md) - M3 system overview

---

**Last updated:** January 6, 2026  
**Status:** READY FOR IMPLEMENTATION  
**Assigned to:** [Team Lead]  
**Deadline:** Complete by end of Q1 2026
