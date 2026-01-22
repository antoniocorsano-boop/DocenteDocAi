# MD3 Team Guide: Compliance & Best Practices

**Date:** January 17, 2026  
**Status:** 📚 ACTIVE - Team Enablement Resource  
**Framework:** PHASE_2_MD3_FRAMEWORK.md

---

## Quick Start

**New Components:** Always use MD3 tokens  
**Existing Code:** Convert when modifying  
**Questions:** Check this guide first

---

## MD3 Token System

### Color Tokens

```tsx
// ✅ CORRECT - Use MD3 color tokens
<div style={{
  backgroundColor: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
  borderColor: 'var(--md-sys-color-outline)'
}}>

// ❌ WRONG - Don't use old patterns
<div style={{ backgroundColor: '#1976d2' }}>
<div className="bg-blue-500">
```

### Spacing Tokens

```tsx
// ✅ CORRECT - Use MD3 spacing
<div style={{
  padding: 'var(--md-sys-spacing-4)',
  margin: 'var(--md-sys-spacing-8)',
  gap: 'var(--md-sys-spacing-6)'
}}>

// ❌ WRONG - Don't use arbitrary values
<div style={{ padding: '16px', gap: '1rem' }}>
```

### Shape Tokens

```tsx
// ✅ CORRECT - Use MD3 shapes
<div style={{
  borderRadius: 'var(--md-sys-shape-corner-large)',
  borderWidth: 'var(--md-sys-shape-corner-small)'
}}>

// ❌ WRONG - Don't use arbitrary values
<div style={{ borderRadius: '8px' }}>
```

---

## Common Patterns & Solutions

### 1. Flexbox Layouts

```tsx
// BEFORE (Tailwind)
<div className="flex items-center justify-between gap-4">

// AFTER (MD3)
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--md-sys-spacing-4)'
}}>
```

### 2. Grid Layouts

```tsx
// BEFORE (Tailwind)
<div className="grid grid-cols-3 gap-6">

// AFTER (MD3)
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--md-sys-spacing-6)'
}}>
```

### 3. Responsive Design

```tsx
// BEFORE (Tailwind)
<div className="w-full md:w-1/2 lg:w-1/3">

// AFTER (MD3) - Use CSS media queries
<div style={{
  width: '100%'
}} className="md:w-1/2 lg:w-1/3">
// Or inline responsive styles with CSS custom properties
```

### 4. Typography

```tsx
// BEFORE (Tailwind)
<h1 className="text-2xl font-bold">

// AFTER (MD3) - Use M3Typography component
<M3Typography variant="headline-large">
  Title
</M3Typography>
```

### 5. Background Colors

```tsx
// BEFORE (Tailwind)
<div className="bg-gray-100">

// AFTER (MD3)
<div style={{
  backgroundColor: 'var(--md-sys-color-surface-container-low)'
}}>
```

---

## Code Review Checklist

### ✅ Must-Have (Blocking)

- [ ] No `className` with Tailwind utilities
- [ ] All colors use `var(--md-sys-color-*)`
- [ ] All spacing uses `var(--md-sys-spacing-*)`
- [ ] All shapes use `var(--md-sys-shape-*)`
- [ ] Build passes without errors
- [ ] Pre-commit hooks pass

### ⚠️ Should-Have (Review Comments)

- [ ] Consistent with existing MD3 patterns
- [ ] Uses M3Typography for text
- [ ] Proper ARIA labels
- [ ] Touch targets meet accessibility standards
- [ ] Component follows MD3 elevation system

### 📝 Nice-to-Have (Suggestions)

- [ ] Uses semantic color names
- [ ] Follows MD3 motion principles
- [ ] Includes proper focus indicators
- [ ] Responsive design tested

---

## Pre-Commit Hook Usage

### What It Does

- Automatically checks for MD3 violations
- Prevents commits with Tailwind className
- Validates token usage
- Catches common mistakes

### When It Runs

- On every `git commit`
- Before code reaches main branch
- During CI/CD pipeline

### If It Fails

```bash
# Check what failed
npm run lint

# Fix the issues, then commit again
git add .
git commit -m "fix: MD3 compliance issues"
```

### Common Hook Errors

**"Unexpected className with Tailwind utilities"**

- Convert to inline styles with MD3 tokens

**"Invalid color token usage"**

- Use `var(--md-sys-color-*)` format

**"Missing MD3 spacing tokens"**

- Replace arbitrary values with `var(--md-sys-spacing-*)`

---

## Component Classification

### 🟢 MD3 Compliant

- Uses only MD3 tokens
- No Tailwind className
- Follows MD3 guidelines
- **Action:** Maintain and use as examples

### 🟡 Mixed Usage

- Some MD3 tokens, some legacy
- Partial Tailwind usage
- **Action:** Convert when modifying

### 🔴 Legacy Components

- Heavy Tailwind usage
- Custom CSS classes
- **Action:** Migrate during refactoring

---

## Development Workflow

### 1. Starting New Components

```tsx
// Always start with MD3 foundation
import { M3Typography } from "./components/M3Typography";

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: "var(--md-sys-color-surface)",
        padding: "var(--md-sys-spacing-4)",
        borderRadius: "var(--md-sys-shape-corner-medium)",
      }}
    >
      <M3Typography variant="body-large">Content</M3Typography>
    </div>
  );
}
```

### 2. Modifying Existing Components

```tsx
// When you touch legacy code, migrate it
function LegacyComponent() {
  // BEFORE: Don't leave it like this
  // return <div className="bg-blue-500 p-4 rounded">

  // AFTER: Convert to MD3
  return (
    <div style={{
      backgroundColor: 'var(--md-sys-color-primary)',
      padding: 'var(--md-sys-spacing-4)',
      borderRadius: 'var(--md-sys-shape-corner-medium)'
    }}>
  );
}
```

### 3. Testing Changes

```bash
# Always test before committing
npm run build
npm run lint
npm test

# Check specific component
npm run test -- --testPathPattern=MyComponent
```

---

## Common Mistakes & Fixes

### Mistake 1: Hardcoded Colors

```tsx
// ❌ WRONG
<div style={{ backgroundColor: '#1976d2' }}>

// ✅ CORRECT
<div style={{ backgroundColor: 'var(--md-sys-color-primary)' }}>
```

### Mistake 2: Arbitrary Spacing

```tsx
// ❌ WRONG
<div style={{ padding: '16px', margin: '8px' }}>

// ✅ CORRECT
<div style={{
  padding: 'var(--md-sys-spacing-4)',
  margin: 'var(--md-sys-spacing-2)'
}}>
```

### Mistake 3: Mixed Styles

```tsx
// ❌ WRONG
<div
  className="flex gap-4"
  style={{ backgroundColor: 'var(--md-sys-color-surface)' }}
>

// ✅ CORRECT
<div style={{
  display: 'flex',
  gap: 'var(--md-sys-spacing-4)',
  backgroundColor: 'var(--md-sys-color-surface)'
}}>
```

### Mistake 4: Wrong Token Format

```tsx
// ❌ WRONG
<div style={{ color: 'md-sys-color-primary' }}>

// ✅ CORRECT
<div style={{ color: 'var(--md-sys-color-primary)' }}>
```

---

## Resources & Support

### Documentation

- `PHASE_2_MD3_FRAMEWORK.md` - Complete framework
- `PHASE_2_MIGRATION_STRATEGY.md` - Migration approach
- `MD3_QUICK_REFERENCE.md` - Token reference

### Tools

- ESLint for error checking
- Pre-commit hooks for validation
- Build system for compilation testing

### Getting Help

1. Check this guide first
2. Review existing MD3 components
3. Ask team lead for complex cases
4. Document new patterns discovered

---

## Success Metrics

### Individual Success

- ✅ Pre-commit hooks pass consistently
- ✅ New components are MD3 compliant
- ✅ Code reviews pass MD3 checklist
- ✅ No build failures due to style issues

### Team Success

- 📈 ESLint errors decreasing weekly
- 📈 MD3 component coverage increasing
- 📈 Team confidence with MD3 system
- 📈 Development velocity maintained

---

**Guide Status:** 📚 ACTIVE - Team Resource  
**Last Updated:** January 17, 2026  
**Next Review:** Monthly or when major changes occur</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_TEAM_GUIDE.md
