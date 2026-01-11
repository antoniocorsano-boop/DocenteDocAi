# Token Layers

## Layer Hierarchy

MD3 Expressive uses a hierarchical token system:

1. **System Tokens (sys)**: Core MD3 tokens (colors, typography, spacing).
2. **Reference Tokens (ref)**: Derived values for consistency.
3. **Component Tokens (comp)**: Component-specific overrides.
4. **Motion Tokens**: Easing and duration for animations.
5. **Shape Tokens**: Corner radii and contours.
6. **Elevation Tokens**: Shadow and depth effects.

## Emotional Overrides

Emotional presets override tokens across layers:
- Colors: Primary, secondary, surface variants.
- Spacing: Compact to generous scales.
- Motion: Fast to slow easing/durations.
- Typography: Weight and size variations.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use CSS custom properties for all tokens | Hardcode pixel values or hex colors |
| Layer overrides hierarchically | Mix token layers in a single file |
| Validate token usage with ESLint | Ignore token layer boundaries |

## Rationale

Layering prevents conflicts and enables expressive overrides. Hardcoded values break adaptability and violate MD3 principles.