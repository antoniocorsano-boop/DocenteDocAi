# Component Mapping: Tool Selection Guide

**Quick Reference:** Which tool should I use for this component?

---

## 📌 TL;DR Decision Table

| Component Type | Tool | Example | Status |
|---|---|---|---|
| **Button (any variant)** | M3Button | `<M3Button variant="filled">` | ✅ Use this |
| **Card** | M3Card | `<M3Card title="...">` | ✅ Use this |
| **Dialog / Modal** | M3Dialog | `<M3Dialog open={open}>` | ✅ Use this |
| **Chip / Tag** | M3Chip | `<M3Chip label="Tag">` | ✅ Use this |
| **Text Input** | TextField | `<TextField label="Name">` | ✅ Use this |
| **Icon Button** | M3IconButton | `<M3IconButton icon="edit">` | ✅ Use this |
| **List Item** | M3ListItem | `<M3ListItem>` | ✅ Use this |
| **Bottom App Bar** | M3BottomAppBar | Navigation drawer | ✅ Use this |
| **Popover Menu** | M3Popover | Dropdown actions | 🔜 Coming Soon |
| **Dropdown Menu** | M3Menu | Select from options | 🔜 Coming Soon |
| **Layout (flex/grid)** | Tailwind | `className="flex gap-6"` | ✅ Use this |
| **Responsive Design** | Tailwind | `md:grid-cols-2` | ✅ Use this |
| **Colors** | M3 Tokens | `className="text-primary"` | ✅ Use this |
| **Spacing** | M3 Scale | `className="p-6 gap-4"` | ✅ Use this |

---

## Standard Components (M3 - Available Now)

### UI Components

| Component | File | Props | Example | Notes |
|---|---|---|---|---|
| **M3Button** | `ui/M3Button.tsx` | variant, color, size, disabled, onClick | `<M3Button variant="filled">Click</M3Button>` | 5 variants: filled, outlined, text, tonal, elevated |
| **M3Card** | `ui/M3Card.tsx` | title, description, children, onClick | `<M3Card title="Title"><p>Content</p></M3Card>` | Container for content |
| **M3ExpressiveCard** | `ui/M3ExpressiveCard.tsx` | title, description, children | Similar to M3Card | More visual emphasis |
| **M3Dialog** | `ui/M3Dialog.tsx` | open, onClose, title, children | `<M3Dialog open={true}><form/></M3Dialog>` | Modal dialog |
| **M3Chip** | `ui/M3Chip.tsx` | label, onDelete, variant | `<M3Chip label="Tag" onDelete={handler} />` | Compact element |
| **TextField** | `ui/TextField.tsx` | label, value, onChange, error | `<TextField label="Name" value={name} />` | Text input field |
| **M3IconButton** | `ui/M3IconButton.tsx` | icon, onClick, aria-label | `<M3IconButton icon="edit" aria-label="Edit" />` | Icon-only button |
| **M3AnimatedIcon** | `ui/M3AnimatedIcon.tsx` | icon, animated | Animated icon element | Special effects |
| **M3ListItem** | `ui/M3ListItem.tsx` | primary, secondary, children | `<M3ListItem primary="Item">Details</M3ListItem>` | List element |
| **M3BottomAppBar** | `ui/M3BottomAppBar.tsx` | children, fab | Navigation bar | Mobile navigation |
| **M3RatingBar** | `ui/M3RatingBar.tsx` | value, onChange, max | `<M3RatingBar value={4} />` | Star rating |
| **M3DatePicker** | `ui/M3DatePicker.tsx` | value, onChange | `<M3DatePicker value={date} />` | Date selection |
| **TabGroup** | `ui/TabGroup.tsx` | tabs, active, onChange | `<TabGroup tabs={['A', 'B']} />` | Tab navigation |
| **Avatar** | `ui/Avatar.tsx` | src, name, size | `<Avatar name="John" />` | User avatar |

### Custom UI Components

| Component | File | Purpose | Example |
|---|---|---|---|
| **ActionTile** | `ui/ActionTile.tsx` | Quick action button | `<ActionTile label="Appello" icon="check" />` |
| **AiMemoryChip** | `ui/AiMemoryChip.tsx` | AI context display | `<AiMemoryChip memory={...} />` |
| **CategoryCard** | `ui/CategoryCard.tsx` | Category selection | `<CategoryCard title="Math" />` |
| **InfoCard** | `ui/InfoCard.tsx` | Information display | `<InfoCard title="Info">Content</InfoCard>` |
| **UseCaseCard** | `ui/UseCaseCard.tsx` | Use case showcase | `<UseCaseCard title="Use Case" />` |

---

## Components Coming Soon (M3)

| Component | Priority | ETA | Current Solution |
|---|---|---|---|
| **M3Popover** | 🔴 HIGH | Week 1 | MUI Popover ⚠️ (avoid) |
| **M3Menu** | 🔴 HIGH | Week 1 | MUI Menu ⚠️ (avoid) |
| **M3Tooltip** | 🟡 MEDIUM | Week 2 | Plain div + Tailwind |
| **M3Drawer** | 🟡 MEDIUM | Week 2-3 | Custom or plain div |
| **M3Select** | 🟡 MEDIUM | Week 3 | TextField or custom |

---

## Layout & Utilities (Tailwind)

### Flexbox Layout

```tsx
// Flex container
<div className="flex">              // display: flex
<div className="flex-col">          // flex-direction: column
<div className="items-center">      // align-items: center
<div className="justify-between">   // justify-content: space-between
<div className="gap-6">             // gap: 24px (M3 token)

// Example
<div className="flex items-center justify-between gap-6">
  {/* Content */}
</div>
```

### Grid Layout

```tsx
// Grid container
<div className="grid">              // display: grid
<div className="grid-cols-3">       // grid-template-columns: repeat(3, minmax(0, 1fr))
<div className="gap-4">             // gap: 16px (M3 token)

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

### Spacing (M3 Scale)

```tsx
// Padding
<div className="p-3">   // padding: 12px
<div className="p-4">   // padding: 16px
<div className="p-5">   // padding: 20px
<div className="p-6">   // padding: 24px

// Margin
<div className="m-6">   // margin: 24px
<div className="mb-4">  // margin-bottom: 16px
<div className="mt-6">  // margin-top: 24px

// Gap (children spacing)
<div className="gap-4"> // gap: 16px
<div className="gap-6"> // gap: 24px

// Space between children
<div className="space-y-4">  // vertical spacing
<div className="space-x-6">  // horizontal spacing
```

### Responsive Breakpoints

```tsx
// Mobile first (default)
<div className="text-sm">  // Mobile: small text

// Tablet (md: breakpoint ~768px)
<div className="md:text-base">  // Tablet: base size

// Desktop (lg: breakpoint ~1024px)
<div className="lg:text-lg">  // Desktop: large

// Example: responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Adapts to screen size */}
</div>

// Example: responsive padding
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding increases on larger screens */}
</div>
```

### Overflow & Sizing

```tsx
<div className="overflow-y-auto">     // Vertical scroll
<div className="overflow-hidden">      // No scroll
<div className="max-h-[400px]">        // Max height
<div className="max-w-full">          // Max width
<div className="w-full">              // Full width
<div className="h-screen">            // Full height
```

### Display & Visibility

```tsx
<div className="hidden md:block">     // Hidden on mobile, visible on tablet+
<div className="flex md:hidden">      // Visible on mobile, hidden on tablet+
<div className="invisible">           // Hidden (takes space)
<div className="opacity-0">           // Transparent
<div className="opacity-50">          // 50% transparent
```

---

## Colors (M3 Semantic Tokens)

### Primary Brand Colors

```tsx
className="text-primary"          // Main brand color (e.g., purple)
className="bg-primary-container"  // Light background (e.g., light purple)
className="text-on-primary"       // Text on primary (e.g., white)

// Example
<div className="bg-primary text-on-primary p-6">
  {/* Purple background with white text */}
</div>
```

### Secondary & Tertiary

```tsx
className="text-secondary"
className="bg-secondary-container"
className="text-tertiary"
className="bg-tertiary-container"
```

### Surface Colors

```tsx
className="bg-surface"            // Main background (e.g., light gray/off-white)
className="bg-surface-container"  // Raised surface (e.g., lighter gray)
className="bg-surface-container-high"   // Even more raised
className="text-on-surface"       // Main text (e.g., dark gray)
className="text-on-surface-variant"     // Secondary text (lighter gray)
```

### Error & Status

```tsx
className="text-error"            // Error/danger color (e.g., red)
className="bg-error-container"    // Light error background
className="text-on-error"         // Text on error
```

### Outline & Dividers

```tsx
className="border-outline"        // Border color
className="text-outline-variant"  // Divider/outline (lighter)
```

### With Opacity

```tsx
className="bg-primary/20"         // 20% opacity (light highlight)
className="text-on-surface/60"    // 60% opacity (secondary text)
className="bg-primary/50"         // 50% opacity
```

---

## Decision Flowchart

```
START: I need to build a component
│
├─ Is it a standard UI element?
│  │ (Button, Card, Dialog, Chip, etc.)
│  └─ YES → Use M3Component (e.g., M3Button)
│
├─ Is it a popover/dropdown menu?
│  │
│  └─ YES → Use M3Popover or M3Menu (coming soon)
│        → Currently, use MUI as last resort (will be deprecated)
│
├─ Is it a form input field?
│  │
│  └─ YES → Use TextField or M3Select
│
├─ Is it layout (rows, columns, spacing)?
│  │
│  └─ YES → Use Tailwind classes (flex, grid, gap, p, m)
│
├─ Is it responsive design?
│  │
│  └─ YES → Use Tailwind breakpoints (md:, lg:, xl:)
│
├─ Is it a color?
│  │
│  └─ YES → Use M3 semantic color (text-primary, bg-surface)
│        → NEVER use hardcoded #RRGGBB or rgb()
│
└─ Something else?
   │
   ├─ Does pattern appear 2+ times? → Extract to new M3Component
   ├─ Is it custom logic? → Build in component folder
   └─ Is it layout? → Use Tailwind classes
```

---

## ⚠️ LEGACY / DEPRECATED

### Don't Use These Anymore

| Old Way | New Way | Why |
|---|---|---|
| `@mui/material` Button | M3Button | Smaller bundle, consistent design |
| `@mui/material` Card | M3Card | Same reason |
| `@emotion/styled` | Tailwind classes | Avoids CSS-in-JS runtime cost |
| Hardcoded `#6750A4` | `text-primary` class | Semantic, respects dark mode |
| Hardcoded `padding: 18px` | `p-4` or `p-6` class | Uses M3 scale |

### Migration Checklist

If you find MUI/Emotion code:

- [ ] Replace `@mui/material` imports with M3 equivalents
- [ ] Replace `@emotion/*` with Tailwind or CSS variables
- [ ] Replace hardcoded colors with M3 tokens
- [ ] Replace hardcoded spacing with M3 scale
- [ ] Test in mobile + desktop
- [ ] Check accessibility (aria-labels, semantic HTML)

---

## Examples

### Bad (Multi-system, inconsistent)

```tsx
import { Button, Card } from '@mui/material';
import styled from '@emotion/styled';

const StyledCard = styled.div`
  background: #f5f5f5;
  padding: 18px;
`;

export const MyComponent = () => {
  return (
    <StyledCard>
      {/* ❌ Emotion CSS-in-JS */}
      <Button sx={{ color: '#6750A4' }}>
        {/* ❌ MUI Button, hardcoded color */}
      </Button>
    </StyledCard>
  );
};
```

### Good (M3 + Tailwind, consistent)

```tsx
import { M3Button, M3Card } from './ui';

export const MyComponent = () => {
  return (
    <M3Card title="Title">
      {/* ✅ M3 component, uses M3 tokens */}
      <M3Button variant="filled" onClick={handler}>
        {/* ✅ M3 Button, semantic props */}
      </M3Button>
    </M3Card>
  );
};
```

---

## Quick Links

- **CONTRIBUTING.md:** Developer guidelines & policy
- **docs/DESIGN_TOKENS_M3.md:** Complete token reference
- **src/components/ui/index.ts:** All available components
- **Storybook:** `npm run storybook` → Interactive component gallery

---

**Last updated:** January 6, 2026  
**Status:** ACTIVE REFERENCE  
**Keep this handy when coding!**
