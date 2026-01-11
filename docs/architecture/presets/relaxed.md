# Relaxed Preset

## Preset Name and Description

Relaxed: Warm colors, comfortable spacing, gentle motion, easy typography for leisure.

## Emotional Intent / Usage Scenario

For leisure apps like social media or entertainment. Creates a comfortable, laid-back feel.

## Tokens Applied

- **Colors**: Base MD3 system colors (no overrides).
- **Spacing**: Comfortable (e.g., '3': '14px', '4': '18px', '5': '22px').
- **Typography**: Normal weights (400), standard sizes.
- **Motion**: Gentle easing and medium durations (e.g., short2: 130ms, medium2: 380ms).

## Mapping to MD3 Layers

- **System (sys)**: Colors unchanged.
- **Reference (ref)**: Spacing and typography derived.
- **Component (comp)**: No specific overrides.
- **Motion**: Gentle easing (e.g., cubic-bezier(0.4, 0, 0.6, 1)).
- **Elevation**: No overrides.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use for leisure interfaces | Apply to urgent tasks |
| Ensure comfortable reading | Override with fast motion |
| Test for relaxation | Hardcode gentle easing |

## Rationale

Comfortable spacing and gentle motion promote relaxation. Easy typography feels approachable.