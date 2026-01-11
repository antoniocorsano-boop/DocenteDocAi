# Minimal Preset

## Preset Name and Description

Minimal: Monochrome colors, sparse spacing, subtle motion, clean typography for simplicity.

## Emotional Intent / Usage Scenario

For minimalist apps or clean interfaces. Promotes clarity and focus on content.

## Tokens Applied

- **Colors**: Base MD3 system colors (no overrides).
- **Spacing**: Sparse (e.g., '1': '4px', '2': '8px', '3': '12px').
- **Typography**: Normal weights (400), standard sizes.
- **Motion**: Subtle easing and standard durations (e.g., short2: 100ms, medium2: 300ms).

## Mapping to MD3 Layers

- **System (sys)**: Colors unchanged.
- **Reference (ref)**: Spacing and typography derived.
- **Component (comp)**: No specific overrides.
- **Motion**: Standard easing (e.g., cubic-bezier(0.4, 0, 0.2, 1)).
- **Elevation**: No overrides.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use for clean interfaces | Combine with energetic presets |
| Ensure sparse layouts | Override with bouncy motion |
| Validate content focus | Hardcode minimal values |

## Rationale

Sparse spacing reduces visual noise. Subtle motion supports understated interactions.