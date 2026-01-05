# Design Token Export & Component Checklist

**Version:** 1.0  
**Date:** 5 Gennaio 2026  
**Purpose:** Standardize token usage across all components

---

## 1. Color Tokens Export (CSS Variables)

### Primary Role Palette
```css
/* Light Mode */
:root {
  --sys-primary: #6750a4;
  --sys-on-primary: #ffffff;
  --sys-primary-container: #eaddff;
  --sys-on-primary-container: #21005d;
}

/* Dark Mode */
[data-theme="dark"] {
  --sys-primary: #d0bcff;
  --sys-on-primary: #371e73;
  --sys-primary-container: #4f378a;
  --sys-on-primary-container: #eaddff;
}
```

### Secondary Role Palette
```css
:root {
  --sys-secondary: #625b71;
  --sys-on-secondary: #ffffff;
  --sys-secondary-container: #e8def8;
  --sys-on-secondary-container: #1d192b;
}

[data-theme="dark"] {
  --sys-secondary: #ccc7db;
  --sys-on-secondary: #332d41;
  --sys-secondary-container: #4a4458;
  --sys-on-secondary-container: #e8def8;
}
```

### Tertiary Role Palette
```css
:root {
  --sys-tertiary: #7d5260;
  --sys-on-tertiary: #ffffff;
  --sys-tertiary-container: #ffd8e4;
  --sys-on-tertiary-container: #31111d;
}

[data-theme="dark"] {
  --sys-tertiary: #ffb3c6;
  --sys-on-tertiary: #492532;
  --sys-tertiary-container: #633b48;
  --sys-on-tertiary-container: #ffd8e4;
}
```

### Semantic Neutral Palette
```css
:root {
  /* Error */
  --sys-error: #f2b8b5;
  --sys-on-error: #601410;
  --sys-error-container: #8c1d18;
  --sys-on-error-container: #f9dedc;

  /* Neutral (Grayscale) */
  --sys-background: #fffbfe;
  --sys-on-background: #1c1b1f;
  --sys-surface: #fffbfe;
  --sys-on-surface: #1c1b1f;

  /* Surface Tints */
  --sys-surface-dim: #ded8df;
  --sys-surface-bright: #fffbfe;
  --sys-surface-container-lowest: #ffffff;
  --sys-surface-container-low: #f7f2fa;
  --sys-surface-container: #f3eff4;
  --sys-surface-container-high: #ece6f0;
  --sys-surface-container-highest: #e6e0e9;

  /* Outlines & Borders */
  --sys-outline: #79747e;
  --sys-outline-variant: #cac7d0;
  --sys-surface-variant: #e7e0ec;
  --sys-on-surface-variant: #49454e;

  /* Disabled States */
  --sys-surface-disabled: rgba(28, 27, 31, 0.12);
  --sys-on-surface-disabled: rgba(28, 27, 31, 0.38);
}

[data-theme="dark"] {
  --sys-background: #1c1b1f;
  --sys-on-background: #e6e1e6;
  --sys-surface: #1c1b1f;
  --sys-on-surface: #e6e1e6;
  /* ... dark variants ... */
}
```

---

## 2. Typography Tokens Export

```css
:root {
  /* Display Styles */
  --typography-display-large: 57px/64px 400 'Roboto', sans-serif;
  --typography-display-medium: 45px/52px 400 'Roboto', sans-serif;
  --typography-display-small: 36px/44px 400 'Roboto', sans-serif;

  /* Headline Styles */
  --typography-headline-large: 32px/40px 400 'Roboto', sans-serif;
  --typography-headline-medium: 28px/36px 400 'Roboto', sans-serif;
  --typography-headline-small: 24px/32px 400 'Roboto', sans-serif;

  /* Title Styles */
  --typography-title-large: 22px/28px 400 'Roboto', sans-serif;
  --typography-title-medium: 16px/24px 500 'Roboto', sans-serif;
  --typography-title-small: 14px/20px 500 'Roboto', sans-serif;

  /* Label Styles */
  --typography-label-large: 14px/20px 500 'Roboto', sans-serif;
  --typography-label-medium: 12px/16px 500 'Roboto', sans-serif;
  --typography-label-small: 11px/16px 500 'Roboto', sans-serif;

  /* Body Styles */
  --typography-body-large: 16px/24px 400 'Roboto', sans-serif;
  --typography-body-medium: 14px/20px 400 'Roboto', sans-serif;
  --typography-body-small: 12px/16px 400 'Roboto', sans-serif;
}

/* CSS Classes for Quick Usage */
.m3-display-large { font: var(--typography-display-large); }
.m3-headline-large { font: var(--typography-headline-large); }
.m3-title-large { font: var(--typography-title-large); }
.m3-label-large { font: var(--typography-label-large); }
.m3-body-large { font: var(--typography-body-large); }
.m3-body-medium { font: var(--typography-body-medium); }
.m3-body-small { font: var(--typography-body-small); }
```

---

## 3. Spacing & Sizing Tokens

```css
:root {
  /* Spacing Scale */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-7: 1.75rem;  /* 28px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-9: 2.25rem;  /* 36px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */

  /* Shape/Border Radius Scale */
  --shape-none: 0px;
  --shape-xs: 4px;
  --shape-sm: 8px;
  --shape-md: 12px;
  --shape-lg: 16px;
  --shape-xl: 28px;
  --shape-2xl: 32px;
  --shape-full: 9999px;

  /* Dynamic radius multiplier (for theme override) */
  --sys-radius-multiplier: 1;

  /* Elevation/Shadow Scale */
  --elevation-0: none;
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --elevation-2: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  --elevation-3: 0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10);
  --elevation-4: 0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05);
  --elevation-5: 0 20px 40px rgba(0, 0, 0, 0.20);

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1310;
  --z-popover: 1500;
  --z-tooltip: 1600;
}
```

---

## 4. Component Checklist Template

### For Every New/Modified Component

```markdown
## [ComponentName] Checklist

### Design System Compliance
- [ ] Uses `--sys-*` tokens for colors (primary, secondary, error, etc.)
- [ ] Uses `--typography-*` tokens for font styling
- [ ] Uses `--spacing-*` tokens for padding/margin/gaps
- [ ] Uses `--shape-*` tokens for border-radius
- [ ] Uses `--elevation-*` for shadows (if applicable)
- [ ] Uses `--z-*` for z-index (if applicable)

### Responsive Design
- [ ] Mobile-first approach (min-width breakpoints)
- [ ] Tailwind breakpoints: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`
- [ ] Touch targets ≥ 48px (44px absolute minimum)
- [ ] Font sizes readable on mobile (≥ 14px for body)

### Accessibility (WCAG 2.1 AA)
- [ ] Semantic HTML (`<button>`, `<input>`, `<form>`, `<nav>`, etc.)
- [ ] All interactive elements keyboard-accessible (Tab, Enter, Space, Escape)
- [ ] ARIA labels: `aria-label`, `aria-labelledby`, `aria-describedby` (if needed)
- [ ] ARIA roles: `role="button"`, `role="dialog"`, etc. (if needed)
- [ ] Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- [ ] Focus indicator visible (outline, ring, etc.)
- [ ] No auto-play audio/video without user control
- [ ] Heading hierarchy (`<h1>`, `<h2>`, `<h3>`, etc.) is correct

### Dark Mode Support
- [ ] Test with `[data-theme="dark"]` selector
- [ ] All token values work in dark mode
- [ ] No hardcoded colors (always use tokens)
- [ ] Images/icons have sufficient contrast in dark mode

### TypeScript & Code Quality
- [ ] Props interface with JSDoc comments
- [ ] `React.FC<PropsType>` syntax
- [ ] No `any` types (use generics if needed)
- [ ] Error boundaries for risky operations
- [ ] ESLint: 0 errors, 0 warnings

### Testing
- [ ] Unit tests ≥ 80% coverage (Vitest)
- [ ] Component tests for interactions (Testing Library)
- [ ] E2E tests for critical user flows (Playwright)
- [ ] Accessibility tests (axe, WAVE)
- [ ] Responsive tests (mobile, tablet, desktop)

### Performance
- [ ] No inline styles (use classNames or CSS modules)
- [ ] No unnecessary re-renders (React.memo, useMemo)
- [ ] Bundle size impact logged
- [ ] Lazy-loaded if heavy (> 50KB)
- [ ] CSS classes minified

### Documentation
- [ ] JSDoc comment on component
- [ ] Props documented with types and defaults
- [ ] Example usage in Storybook (or README)
- [ ] Breaking changes noted in CHANGELOG
- [ ] Visual demo (screenshot/video for UI components)

### Design System Override (if applicable)
- [ ] Documented in code comment (WHY it's overridden)
- [ ] Approved by design/architecture team
- [ ] Added to DESIGN_SYSTEM_CONSOLIDATION.md exceptions
- [ ] Linked to issue/ticket in code

### Git Commit
- [ ] Commit message: `feat:` or `refactor:` prefix
- [ ] Reference issue: `closes #123`
- [ ] All changes staged correctly
- [ ] Tests pass locally
- [ ] Linting passes: `npm run lint:fix`
```

---

## 5. Token Usage Examples

### Button Component
```tsx
// ✅ CORRECT
<button
  className="
    m3-button-filled
    px-6 py-3
    bg-primary text-on-primary
    rounded-lg
    hover:bg-primary/90
    disabled:bg-surface-disabled disabled:text-on-surface-disabled
    transition-colors
    font-label-large
  "
>
  Click Me
</button>

// ❌ WRONG
<button
  style={{
    backgroundColor: '#6750a4',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
  }}
>
  Click Me
</button>
```

### Card Component
```tsx
// ✅ CORRECT
<div className="
  bg-surface-container
  border border-outline-variant
  rounded-lg
  p-6
  shadow-elevation-1
">
  <h2 className="m3-title-large text-on-surface">Title</h2>
  <p className="m3-body-medium text-on-surface-variant">
    Subtitle
  </p>
</div>

// ❌ WRONG
<div style={{ 
  backgroundColor: '#f3eff4',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
}}>
  {/* content */}
</div>
```

### Modal/Dialog
```tsx
// ✅ CORRECT
<div className="
  fixed inset-0
  bg-black/40
  flex items-center justify-center
  z-modal
">
  <div className="
    bg-surface
    rounded-2xl
    p-8
    max-w-sm
    gap-6
    flex flex-col
  ">
    <h2 className="m3-headline-small text-on-surface">
      Confirm Action
    </h2>
    <p className="m3-body-medium text-on-surface-variant">
      Are you sure?
    </p>
    <div className="flex gap-3 justify-end">
      <button className="m3-button-text">Cancel</button>
      <button className="m3-button-filled">Confirm</button>
    </div>
  </div>
</div>
```

---

## 6. Breakpoint Reference

For Tailwind & CSS Media Queries

```css
/* Mobile First (Min-width) */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }

/* Touch Targets */
@media (hover: none) and (pointer: coarse) {
  /* mobile/tablet: increase touch targets */
}
```

**Device Sizes:**
- `sm`: Small phones (320-640px) — default Tailwind
- `md`: Tablets, medium phones (768px+)
- `lg`: Desktops, large tablets (1024px+)
- `xl`: Large desktops (1280px+)
- `2xl`: Extra large screens (1536px+)

---

## 7. State Tokens

### Interactive States
```css
:root {
  /* Hover */
  --state-hover-opacity: 0.08;
  
  /* Focused */
  --state-focus-opacity: 0.12;
  --state-focus-ring: 2px solid var(--sys-primary);
  
  /* Pressed/Active */
  --state-pressed-opacity: 0.16;
  
  /* Disabled */
  --state-disabled-opacity: 0.38;
  
  /* Transition Duration */
  --transition-short: 150ms;
  --transition-medium: 250ms;
  --transition-long: 500ms;
}
```

### Usage Example
```tsx
<button
  className="
    transition-colors duration-transition-medium
    hover:bg-primary/[--state-hover-opacity]
    focus-visible:outline-focus-ring
    active:bg-primary/[--state-pressed-opacity]
    disabled:opacity-[--state-disabled-opacity]
  "
>
  Stateful Button
</button>
```

---

## 8. Validation Script

```bash
#!/bin/bash
# validate-design-tokens.sh

# Check for hardcoded colors
grep -r "#[0-9a-fA-F]\{6\}" src/ \
  --include="*.tsx" --include="*.ts" \
  --exclude-dir=node_modules \
  && echo "❌ Hardcoded colors found!" || echo "✅ No hardcoded colors"

# Check for inline styles
grep -r "style={{" src/ \
  --include="*.tsx" \
  --exclude-dir=node_modules \
  | head -5 && echo "⚠️ Some inline styles found, review needed"

# Check for token usage
grep -r "var(--sys-" src/ \
  --include="*.tsx" --include="*.css" \
  | wc -l | xargs echo "✅ Token usage count:"
```

---

## 9. Common Mistakes & Fixes

| Mistake | ❌ Example | ✅ Fix |
|---------|-----------|--------|
| Hardcoded color | `color: '#6750a4'` | `color: var(--sys-primary)` |
| Arbitrary padding | `p-5` or `p-7` | `p-4` or `p-6` (spacing scale) |
| Custom border-radius | `rounded-md` | `rounded-lg` (via --shape tokens) |
| Inline opacity | `opacity-75` | Use token or semantic color |
| Custom shadow | `shadow-custom` | Use `--elevation-*` tokens |
| No dark mode | Only light styles | Add `[data-theme="dark"]` variants |
| Hardcoded z-index | `z-50` | Use `--z-modal`, `--z-popover`, etc. |
| Missing a11y labels | `<div role="button">` | Add `aria-label` + `tabIndex={0}` |

---

## 10. Quick Reference Card (Print-Friendly)

```
╔════════════════════════════════════════════════════════════╗
║           DocenteDoc AI - Design Token Quick Ref          ║
╠════════════════════════════════════════════════════════════╣
║ COLORS: --sys-primary, --sys-error, --sys-background     ║
║ TYPE: --typography-body-large, --typography-label-large  ║
║ SPACE: --spacing-4, --spacing-6, --spacing-8             ║
║ SHAPE: --shape-lg, --shape-xl (used for rounded-*)      ║
║ SHADOW: --elevation-1, --elevation-2, --elevation-3      ║
║ Z-INDEX: --z-modal (1310), --z-popover (1500)            ║
║                                                            ║
║ BREAKPOINTS: sm:640px md:768px lg:1024px xl:1280px        ║
║ ALWAYS: Use CSS variables, test dark mode, mobile-first  ║
║                                                            ║
║ CHECKLIST: colors ✓ type ✓ space ✓ a11y ✓ responsive ✓   ║
╚════════════════════════════════════════════════════════════╝
```

---

**Version:** 1.0  
**Last Updated:** 5 Gennaio 2026  
**Maintained By:** Design System Team  
**Review Cycle:** Quarterly
