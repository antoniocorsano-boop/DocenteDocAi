# MD3 Platinum: Semantic Token Layer

## Definition

**MD3 Platinum** extends MD3 Gold by introducing a **semantic token layer** that provides application-specific naming for MD3 system tokens. This creates a domain-specific abstraction layer while maintaining 100% compliance with MD3 Gold governance.

### Architecture

```
┌─────────────────┐
│   Components    │ ← Use semantic tokens (--app-*)
│   (Business)    │
└─────────────────┘
        ↓
┌─────────────────┐
│ Semantic Layer  │ ← Pure aliases (--app-* → --md-sys-*)
│   (--app-*)     │
└─────────────────┘
        ↓
┌─────────────────┐
│   MD3 System    │ ← Raw MD3 tokens (--md-sys-*)
│   (--md-sys-*)  │
└─────────────────┘
```

### Principles

1. **Pure Aliases**: Semantic tokens are CSS custom property aliases, not new values
2. **Domain-Specific**: Token names reflect application concepts, not generic MD3 names
3. **Non-Breaking**: Existing components continue to work during migration
4. **Gold Compliant**: All semantic tokens map to approved MD3 tokens

---

## Semantic Token Categories

### Spacing Tokens
Application-specific spacing relationships:

| Semantic Token | MD3 Token | Purpose |
|----------------|-----------|---------|
| `--app-spacing-container` | `--md-sys-spacing-4` | Container padding |
| `--app-spacing-section` | `--md-sys-spacing-6` | Section spacing |
| `--app-spacing-element` | `--md-sys-spacing-3` | Element gaps |
| `--app-spacing-component` | `--md-sys-spacing-2` | Component internals |
| `--app-spacing-touch` | `--md-sys-spacing-5` | Touch target minimums |

### Motion Tokens
Application interaction patterns:

| Semantic Token | MD3 Token | Purpose |
|----------------|-----------|---------|
| `--app-motion-standard` | `--md-sys-motion-duration-medium` | Standard transitions |
| `--app-motion-quick` | `--md-sys-motion-duration-short` | Quick feedback |
| `--app-motion-slow` | `--md-sys-motion-duration-long` | Dramatic changes |
| `--app-easing-standard` | `--md-sys-motion-easing-standard` | Default easing |
| `--app-easing-emphasized` | `--md-sys-motion-easing-emphasized` | Important actions |

### Z-Index Hierarchy
Application layering semantics:

| Semantic Token | MD3 Token | Purpose |
|----------------|-----------|---------|
| `--app-z-base` | `--md-sys-z-base` | Base layer |
| `--app-z-content` | `--md-sys-z-content` | Content layer |
| `--app-z-overlay` | `--md-sys-z-overlay` | Temporary overlays |
| `--app-z-modal` | `--md-sys-z-modal` | Modal dialogs |
| `--app-z-tooltip` | `--md-sys-z-tooltip` | Tooltips/popovers |
| `--app-z-dropdown` | `--md-sys-z-tooltip` | Dropdowns/menus |

### Layout Tokens
Application layout patterns:

| Semantic Token | MD3 Token | Purpose |
|----------------|-----------|---------|
| `--app-layout-full` | `--md-sys-percent-100` | Full dimensions |
| `--app-layout-half` | `--md-sys-percent-50` | Half dimensions |
| `--app-layout-quarter` | `--md-sys-percent-25` | Quarter dimensions |
| `--app-layout-auto` | `--md-sys-margin-auto` | Auto margins |

### Typography Scale
Application text hierarchy:

| Semantic Token | MD3 Token | Purpose |
|----------------|-----------|---------|
| `--app-text-display` | `--md-sys-typescale-display-large-font-size` | Page titles |
| `--app-text-headline` | `--md-sys-typescale-headline-large-font-size` | Section headers |
| `--app-text-title` | `--md-sys-typescale-title-large-font-size` | Component titles |
| `--app-text-body` | `--md-sys-typescale-body-large-font-size` | Primary content |
| `--app-text-label` | `--md-sys-typescale-label-large-font-size` | Form labels |
| `--app-text-caption` | `--md-sys-typescale-body-small-font-size` | Secondary text |

---

## Implementation

### CSS Definition File
Create `src/design-system/semantic-tokens.css`:

```css
/* MD3 Platinum: Semantic Token Layer */
/* Pure aliases to MD3 system tokens */

:root {
  /* Spacing */
  --app-spacing-container: var(--md-sys-spacing-4);
  --app-spacing-section: var(--md-sys-spacing-6);
  --app-spacing-element: var(--md-sys-spacing-3);
  --app-spacing-component: var(--md-sys-spacing-2);
  --app-spacing-touch: var(--md-sys-spacing-5);

  /* Motion */
  --app-motion-standard: var(--md-sys-motion-duration-medium);
  --app-motion-quick: var(--md-sys-motion-duration-short);
  --app-motion-slow: var(--md-sys-motion-duration-long);
  --app-easing-standard: var(--md-sys-motion-easing-standard);
  --app-easing-emphasized: var(--md-sys-motion-easing-emphasized);

  /* Z-Index */
  --app-z-base: var(--md-sys-z-base);
  --app-z-content: var(--md-sys-z-content);
  --app-z-overlay: var(--md-sys-z-overlay);
  --app-z-modal: var(--md-sys-z-modal);
  --app-z-tooltip: var(--md-sys-z-tooltip);
  --app-z-dropdown: var(--md-sys-z-tooltip);

  /* Layout */
  --app-layout-full: var(--md-sys-percent-100);
  --app-layout-half: var(--md-sys-percent-50);
  --app-layout-quarter: var(--md-sys-percent-25);
  --app-layout-auto: var(--md-sys-margin-auto);

  /* Typography */
  --app-text-display: var(--md-sys-typescale-display-large-font-size);
  --app-text-headline: var(--md-sys-typescale-headline-large-font-size);
  --app-text-title: var(--md-sys-typescale-title-large-font-size);
  --app-text-body: var(--md-sys-typescale-body-large-font-size);
  --app-text-label: var(--md-sys-typescale-label-large-font-size);
  --app-text-caption: var(--md-sys-typescale-body-small-font-size);
}
```

### Import Order
Update `src/index.css` or main CSS file:

```css
/* MD3 System Tokens (base layer) */
@import './design-system/md3-tokens.css';

/* MD3 Platinum Semantic Layer */
@import './design-system/semantic-tokens.css';

/* Component styles use --app-* tokens */
@import './components/styles.css';
```

---

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Create `semantic-tokens.css` with initial mapping
2. Import semantic tokens in main CSS
3. Update 2-3 core components to use semantic tokens
4. Verify no visual regressions

### Phase 2: Component Migration (Week 3-6)
1. Identify component categories:
   - **Semantic Candidates**: Business components (buttons, cards, forms)
   - **Infrastructure**: Layout, theme, utility components (keep MD3 direct)
2. Migrate components incrementally:
   - Start with leaf components (buttons, inputs)
   - Progress to composite components (forms, cards)
   - End with page-level components
3. Update component library documentation

### Phase 3: Consolidation (Week 7-8)
1. Audit remaining MD3 direct usage
2. Establish semantic token governance
3. Update developer documentation
4. Create migration guide for new components

### Component Classification

#### Use Semantic Tokens (`--app-*`)
- Business components (Button, Card, Modal, Form, etc.)
- Page-level components
- Feature-specific components
- User-facing UI elements

#### May Use Raw MD3 Tokens (`--md-sys-*`)
- Infrastructure components (Layout, ThemeProvider)
- Design system primitives (M3Button, M3Dialog base)
- Utility components (spacing helpers, grid systems)
- CSS custom properties definitions

### Migration Pattern

**Before (MD3 Direct):**
```tsx
<div style={{
  padding: 'var(--md-sys-spacing-4)',
  transition: 'all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
  zIndex: 'var(--md-sys-z-modal)'
}}>
```

**After (Semantic):**
```tsx
<div style={{
  padding: 'var(--app-spacing-container)',
  transition: `all var(--app-motion-standard) var(--app-easing-standard)`,
  zIndex: 'var(--app-z-modal)'
}}>
```

---

## Governance

### Semantic Token Rules
1. **Pure Aliases**: Semantic tokens must only reference existing MD3 tokens
2. **No New Values**: Never introduce numeric values in semantic definitions
3. **Domain Alignment**: Token names must reflect application concepts
4. **Documentation**: Every semantic token must be documented with purpose

### Development Guidelines
1. **New Components**: Always use semantic tokens (`--app-*`)
2. **Infrastructure**: May use MD3 tokens directly when appropriate
3. **Migration**: Gradual, component-by-component approach
4. **Testing**: Visual regression tests for each migrated component

### Quality Assurance
1. **Build Verification**: Semantic tokens must resolve to valid MD3 tokens
2. **Visual Testing**: No visual changes during migration
3. **ESLint Rules**: May need updates to recognize semantic tokens
4. **Documentation**: Keep semantic token registry current

---

## Benefits

1. **Domain Clarity**: Token names reflect application concepts
2. **Maintainability**: Centralized semantic definitions
3. **Flexibility**: Easy to adjust mappings without changing components
4. **Consistency**: Enforced semantic usage across teams
5. **Future-Proof**: Semantic layer can adapt to MD3 evolution

---

*MD3 Platinum maintains MD3 Gold compliance while providing semantic clarity for application development.*</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_PLATINUM_SEMANTIC_LAYER.md