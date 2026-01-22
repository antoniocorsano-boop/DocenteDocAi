# MD3 Quick Reference Guide

**Date:** January 17, 2026  
**Status:** 🔍 ACTIVE - Developer Reference  
**Framework:** PHASE_2_MD3_FRAMEWORK.md

---

## Essential MD3 Tokens

### Color System

```css
/* Primary Colors */
--md-sys-color-primary: /* Primary brand color */ --md-sys-color-on-primary:
  /* Text on primary */
  --md-sys-color-primary-container: /* Primary background */
  --md-sys-color-on-primary-container: /* Text on primary container */
  /* Secondary Colors */ --md-sys-color-secondary: /* Secondary brand color */
  --md-sys-color-on-secondary: /* Text on secondary */
  --md-sys-color-secondary-container: /* Secondary background */
  /* Surface Colors */ --md-sys-color-surface: /* Main background */
  --md-sys-color-surface-container: /* Card/container background */
  --md-sys-color-surface-container-high: /* Elevated surface */
  --md-sys-color-surface-container-low: /* Subtle surface */
  --md-sys-color-on-surface: /* Text on surface */
  --md-sys-color-on-surface-variant: /* Secondary text */ /* Semantic Colors */
  --md-sys-color-error: /* Error states */
  --md-sys-color-on-error: /* Text on error */
  --md-sys-color-warning: /* Warning states */
  --md-sys-color-success: /* Success states */;
```

### Spacing System

```css
--md-sys-spacing-0: 0px --md-sys-spacing-1: 4px /* Small gaps */
  --md-sys-spacing-2: 8px /* Component padding */ --md-sys-spacing-3: 12px
  /* Medium gaps */ --md-sys-spacing-4: 16px /* Standard padding */
  --md-sys-spacing-5: 20px /* Large gaps */ --md-sys-spacing-6: 24px
  /* Container padding */ --md-sys-spacing-8: 32px /* Section spacing */
  --md-sys-spacing-12: 48px /* Major sections */;
```

### Shape System

```css
--md-sys-shape-corner-none: 0px --md-sys-shape-corner-extra-small: 4px
  --md-sys-shape-corner-small: 8px --md-sys-shape-corner-medium: 12px
  --md-sys-shape-corner-large: 16px --md-sys-shape-corner-extra-large: 28px
  --md-sys-shape-corner-full: 9999px;
```

---

## Common Conversion Patterns

### 1. Background Colors

```tsx
// Tailwind → MD3
className="bg-white" → backgroundColor: 'var(--md-sys-color-surface)'
className="bg-gray-50" → backgroundColor: 'var(--md-sys-color-surface-container-low)'
className="bg-gray-100" → backgroundColor: 'var(--md-sys-color-surface-container)'
className="bg-blue-500" → backgroundColor: 'var(--md-sys-color-primary)'
```

### 2. Text Colors

```tsx
// Tailwind → MD3
className="text-gray-900" → color: 'var(--md-sys-color-on-surface)'
className="text-gray-600" → color: 'var(--md-sys-color-on-surface-variant)'
className="text-blue-600" → color: 'var(--md-sys-color-primary)'
className="text-white" → color: 'var(--md-sys-color-on-primary)' // when on primary background
```

### 3. Spacing

```tsx
// Tailwind → MD3
className="p-2" → padding: 'var(--md-sys-spacing-2)'
className="p-4" → padding: 'var(--md-sys-spacing-4)'
className="m-2" → margin: 'var(--md-sys-spacing-2)'
className="gap-4" → gap: 'var(--md-sys-spacing-4)'
```

### 4. Borders & Shapes

```tsx
// Tailwind → MD3
className="rounded" → borderRadius: 'var(--md-sys-shape-corner-medium)'
className="rounded-lg" → borderRadius: 'var(--md-sys-shape-corner-large)'
className="border" → border: '1px solid var(--md-sys-color-outline)'
```

### 5. Layout Patterns

```tsx
// Flexbox
className="flex items-center justify-between gap-4"
→ style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--md-sys-spacing-4)'
}}

// Grid
className="grid grid-cols-3 gap-6"
→ style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--md-sys-spacing-6)'
}}
```

---

## Component-Specific Patterns

### Cards

```tsx
<div style={{
  backgroundColor: 'var(--md-sys-color-surface-container)',
  borderRadius: 'var(--md-sys-shape-corner-large)',
  padding: 'var(--md-sys-spacing-6)',
  border: '1px solid var(--md-sys-color-outline-variant)'
}}>
```

### Buttons

```tsx
<button style={{
  backgroundColor: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
  borderRadius: 'var(--md-sys-shape-corner-large)',
  padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-6)'
}}>
```

### Form Fields

```tsx
<input
  style={{
    backgroundColor: "var(--md-sys-color-surface-container)",
    border: "1px solid var(--md-sys-color-outline)",
    borderRadius: "var(--md-sys-shape-corner-medium)",
    padding: "var(--md-sys-spacing-4)",
    color: "var(--md-sys-color-on-surface)",
  }}
/>
```

### Dialogs/Modals

```tsx
<div style={{
  backgroundColor: 'var(--md-sys-color-surface-container-high)',
  borderRadius: 'var(--md-sys-shape-corner-extra-large)',
  padding: 'var(--md-sys-spacing-8)',
  border: '1px solid var(--md-sys-color-outline)'
}}>
```

---

## Typography with M3Typography

```tsx
// Instead of className="text-xl font-bold"
<M3Typography variant="headline-small" style={{ fontWeight: 'bold' }}>
  Title
</M3Typography>

// Instead of className="text-sm text-gray-600"
<M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
  Subtitle
</M3Typography>
```

### Available Variants

- `display-large` / `display-medium` / `display-small`
- `headline-large` / `headline-medium` / `headline-small`
- `title-large` / `title-medium` / `title-small`
- `body-large` / `body-medium` / `body-small`
- `label-large` / `label-medium` / `label-small`

---

## Responsive Design

### Media Query Approach

```tsx
// Use CSS custom properties for responsive values
<div style={{
  width: 'var(--md-responsive-width, 100%)'
}}>

// In CSS or style tag:
@media (min-width: 768px) {
  --md-responsive-width: 50%;
}
```

### Component-Level Responsive

```tsx
// Use React state or CSS-in-JS for responsive behavior
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

<div style={{
  width: isMobile ? '100%' : '50%',
  padding: isMobile ? 'var(--md-sys-spacing-4)' : 'var(--md-sys-spacing-6)'
}}>
```

---

## Accessibility Considerations

### Focus Indicators

```tsx
<button style={{
  // Base styles
  borderRadius: 'var(--md-sys-shape-corner-large)',

  // Focus styles
  ':focus': {
    outline: `2px solid var(--md-sys-color-primary)`,
    outlineOffset: '2px'
  }
}}>
```

### Color Contrast

- Always use `on-*` colors for text on colored backgrounds
- Test contrast ratios meet WCAG guidelines
- Use semantic color tokens for proper contrast

### Touch Targets

```tsx
// Minimum 44px touch targets
<button style={{
  minWidth: '44px',
  minHeight: '44px',
  padding: 'var(--md-sys-spacing-3)'
}}>
```

---

## Pre-Commit Hook Errors & Fixes

### "Unexpected className with Tailwind utilities"

**Fix:** Convert to inline styles

```tsx
// Error
<div className="flex gap-4 bg-blue-500">

// Fix
<div style={{
  display: 'flex',
  gap: 'var(--md-sys-spacing-4)',
  backgroundColor: 'var(--md-sys-color-primary)'
}}>
```

### "Invalid color token usage"

**Fix:** Use proper CSS custom property syntax

```tsx
// Error
color: "md-sys-color-primary";

// Fix
color: "var(--md-sys-color-primary)";
```

### "Missing MD3 spacing tokens"

**Fix:** Replace arbitrary values

```tsx
// Error
padding: "16px";

// Fix
padding: "var(--md-sys-spacing-4)";
```

---

## Tools & Resources

### Development Tools

- **ESLint:** `npm run lint` - Check for violations
- **Build:** `npm run build` - Validate compilation
- **Pre-commit:** Automatic validation on commit

### Reference Materials

- `PHASE_2_MD3_FRAMEWORK.md` - Complete framework
- `MD3_TEAM_GUIDE.md` - Team best practices
- `MD3_COMPONENT_INVENTORY.md` - Component status

### Getting Help

1. Check existing MD3 components for patterns
2. Review this quick reference
3. Ask team lead for complex conversions
4. Document new patterns for the team

---

**Reference Status:** 🔍 ACTIVE - Developer Tool  
**Last Updated:** January 17, 2026  
**Next Review:** Monthly or when new patterns discovered</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_QUICK_REFERENCE.md
