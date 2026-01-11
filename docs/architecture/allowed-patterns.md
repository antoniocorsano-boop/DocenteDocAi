# Allowed vs Forbidden Patterns

## Allowed Patterns

- Inline styles using `var(--md-sys-color-primary)`.
- M3Typography for all text elements.
- M3Button and M3Card for UI components.
- Theme overrides via useTheme hook.
- ARIA labels on interactive elements.

## Forbidden Patterns

- `className` attributes.
- Tailwind CSS utilities.
- Hardcoded `px`, `rem`, `%`, `hex`, `rgba` values.
- `style` without MD3 tokens.
- Legacy design system components.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Wrap components with M3ThemeProvider in tests | Use className for styling |
| Apply ARIA on DOM elements | Bypass token system |
| Use token-based focus indicators | Hardcode accessibility features |

## Rationale

Forbidden patterns introduce inconsistency and break MD3's token-driven design. Allowed patterns ensure maintainability and accessibility.