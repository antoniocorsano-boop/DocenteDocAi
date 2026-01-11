# Focused Preset

## Preset Name and Description

Focused: Neutral colors, compact spacing, precise motion, clear typography for concentration.

## Emotional Intent / Usage Scenario

For productivity apps or dashboards requiring attention. Promotes clarity and efficiency.

## Tokens Applied

- **Colors**: Base MD3 system colors (no overrides).
- **Spacing**: Compact (e.g., '1': '3px', '2': '7px', '4': '14px').
- **Typography**: Medium weights (500-600), standard sizes.
- **Motion**: Precise easing and medium durations (e.g., short1: 40ms, medium4: 400ms).

## Mapping to MD3 Layers

- **System (sys)**: Colors unchanged.
- **Reference (ref)**: Spacing and typography derived.
- **Component (comp)**: No specific overrides.
- **Motion**: Standard easing (e.g., cubic-bezier(0.4, 0, 0.2, 1)).
- **Elevation**: No overrides.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use for task-focused interfaces | Combine with playful presets |
| Ensure compact layouts | Override with bouncy motion |
| Validate information density | Hardcode spacing |

## Rationale

Compact spacing reduces distractions. Precise motion supports efficient interactions.