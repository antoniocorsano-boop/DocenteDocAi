# Material Design 3 (Material You) Skill

## 🎯 Purpose

This skill provides comprehensive guidance on Material Design 3 (also known as Material You), Google's latest design system that emphasizes personalization, accessibility, and modern UI patterns.

## 📦 What is Material Design 3?

Material Design 3 is Google's latest design language that introduces:

- **Dynamic Color**: Adaptive color palettes based on user preferences
- **Enhanced Accessibility**: WCAG 2.1 AA compliance by default
- **Flexible Theming**: Token-based theming system
- **Modern Components**: Updated component designs with better customization
- **Personalization**: User-centric design that adapts to preferences

## 🎨 When to Use This Skill

Use Material Design 3 guidance when:

- Implementing a new application with Material Design
- Migrating from Material Design 2 to Material Design 3
- Creating custom themes using Material Design 3 tokens
- Implementing dynamic color theming
- Building accessible, modern UI components
- Following Material You design principles
- Working with Material Design 3 typography and spacing systems

## 🛠️ Core Concepts

### 1. Color System

Material Design 3 introduces a sophisticated color system:

**Color Roles:**

- **Primary**: Main brand color for prominent actions
- **Secondary**: Supporting color for less prominent actions
- **Tertiary**: Accent color for highlights and contrasts
- **Error**: Color for error states
- **Surface**: Background colors for components
- **On-colors**: Contrasting text/icon colors (on-primary, on-secondary, etc.)

**Color Variants:**

- Container colors (e.g., `primary-container`)
- On-container colors (e.g., `on-primary-container`)
- Surface variants (surface-dim, surface-bright, surface-container)

### 2. Dynamic Color

Material Design 3's signature feature:

- Generate color schemes from source colors
- Support both light and dark themes
- Automatic contrast adjustments
- System-level color extraction (from wallpaper on supported platforms)

### 3. Typography

Five typography scales:

- **Display**: Largest text (display-large, display-medium, display-small)
- **Headline**: Section headers (headline-large to headline-small)
- **Title**: Subsection titles (title-large to title-small)
- **Body**: Main content (body-large, body-medium, body-small)
- **Label**: UI labels (label-large to label-small)

### 4. Elevation

Three elevation strategies:

- **Shadow**: Traditional elevation with shadows
- **Overlay**: Tonal surface overlays
- **Combined**: Shadow + overlay for enhanced depth perception

### 5. Shape

Rounded corner system with scales:

- **None**: 0dp (sharp corners)
- **Extra Small**: 4dp
- **Small**: 8dp
- **Medium**: 12dp
- **Large**: 16dp
- **Extra Large**: 28dp

## 📚 Implementation with CSS Custom Properties (Token-based)

### Color Tokens

```css
/* Access theme colors via CSS custom properties */
.my-component {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.my-component:hover {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

/* Surface variants */
.surface {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}

.surface-container {
  background-color: var(--md-sys-color-surface-container);
}
```

### Typography Tokens

```css
/* Using typography tokens */
.heading {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  letter-spacing: var(--md-sys-typescale-headline-large-tracking);
}

.body-text {
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height);
}

.label {
  font-family: var(--md-sys-typescale-label-small-font);
  font-size: var(--md-sys-typescale-label-small-size);
}
```

### Elevation Tokens

```css
.elevated-card {
  /* Level 1 elevation */
  box-shadow: var(--md-sys-elevation-level1);
}

.elevated-card:hover {
  /* Level 2 elevation on hover */
  box-shadow: var(--md-sys-elevation-level2);
}
```

### Shape Tokens

```css
.rounded-component {
  border-radius: var(--md-sys-shape-corner-medium);
}

.pill-shape {
  border-radius: var(--md-sys-shape-corner-full);
}
```

## 🎯 Best Practices

### 1. Theme Consistency

- Use design tokens (`var(--md-sys-*)`) instead of hardcoded values
- Maintain consistent color usage across components
- Follow Material Design 3 color role guidelines
- Never hardcode colors, spacing, or typography values

### 2. Accessibility

- Ensure minimum 4.5:1 contrast ratio for text
- Use semantic color roles (primary, secondary, error)
- Support both light and dark themes
- Provide sufficient touch target sizes (48x48dp minimum)

### 3. Responsive Design

- Use Material Design 3 breakpoints
- Adapt layouts for different screen sizes
- Test on mobile, tablet, and desktop viewports

### 4. Token Naming Convention

All MD3 tokens follow the pattern: `--md-sys-{category}-{name}`

Categories:

- `color`: Color tokens (e.g., `--md-sys-color-primary`)
- `typescale`: Typography tokens (e.g., `--md-sys-typescale-body-medium-size`)
- `elevation`: Elevation tokens (e.g., `--md-sys-elevation-level1`)
- `shape`: Shape tokens (e.g., `--md-sys-shape-corner-medium`)
- `motion`: Motion/animation tokens (e.g., `--md-sys-motion-duration-medium`)
- `state`: State layer tokens (e.g., `--md-sys-state-hover-opacity`)

### 5. Component Design

- Prefer composition over customization
- Use MD3 component patterns (FAB, Cards, Chips, Navigation)
- Follow state layer guidelines (hover, focus, pressed, dragged)
- Implement proper ripple effects

## 🔧 Common Patterns

### Custom Component with M3 Tokens

```css
/* Filled Button */
.m3-button-filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  border: none;
  cursor: pointer;
  padding: var(--md-sys-spacing-2) var(--md-sys-spacing-6);
}

.m3-button-filled:hover {
  box-shadow: var(--md-sys-elevation-level1);
}

/* Outlined Button */
.m3-button-outlined {
  background-color: transparent;
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-primary);
  border-radius: var(--md-sys-shape-corner-full);
}

/* Card */
.m3-card {
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level1);
  padding: var(--md-sys-spacing-4);
}

.m3-card:hover {
  box-shadow: var(--md-sys-elevation-level2);
}
```

### State Layers

```css
/* State layer implementation */
.interactive-element {
  position: relative;
}

.interactive-element::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  background-color: var(--md-sys-color-on-surface);
  transition: opacity var(--md-sys-motion-duration-short)
    var(--md-sys-motion-easing-standard);
}

.interactive-element:hover::before {
  opacity: var(--md-sys-state-hover-state-layer-opacity, 0.08);
}

.interactive-element:focus-visible::before {
  opacity: var(--md-sys-state-focus-state-layer-opacity, 0.12);
}

.interactive-element:active::before {
  opacity: var(--md-sys-state-pressed-state-layer-opacity, 0.12);
}
```

## 🐛 Troubleshooting

| Issue                         | Solution                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Colors not applying           | Ensure CSS custom properties are defined in :root or theme provider           |
| Theme tokens undefined        | Check that your theme CSS file is loaded before components                    |
| Dark theme not working        | Verify dark theme class is applied to parent element and tokens are redefined |
| Typography not loading        | Include design fonts (e.g., Roboto) in your HTML head                         |
| Accessibility contrast issues | Use Material's built-in color roles instead of custom colors                  |
| Tokens not inheriting         | Ensure custom properties are defined at the correct scope level               |

## 📖 References

- [Material Design 3 Official Guidelines](https://m3.material.io/)
- [Material Design Color System](https://m3.material.io/styles/color/system/overview)
- [Material Design Typography](https://m3.material.io/styles/typography/overview)
- [Material Design Elevation](https://m3.material.io/styles/elevation/overview)
- [Material Design Shape](https://m3.material.io/styles/shape/overview)
- [Accessibility Guidelines](https://m3.material.io/foundations/accessible-design/overview)

## 💡 Migration from Material Design 2

Key changes when migrating from M2 to M3:

1. Replace hardcoded color values with `--md-sys-color-*` tokens
2. Update component styles to use design tokens
3. Migrate custom themes to new token-based theming
4. Update typography to M3 typescale tokens
5. Replace elevation values with `--md-sys-elevation-*` custom properties
6. Test accessibility with new contrast requirements
7. Adopt new shape system with `--md-sys-shape-*` tokens
