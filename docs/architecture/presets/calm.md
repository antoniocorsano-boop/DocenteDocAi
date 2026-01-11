# Calm Preset

## Preset Name and Description

Calm: Soft colors, generous spacing, slow motion, relaxed typography for a serene experience.

## Emotional Intent / Usage Scenario

Intended for serene, low-stress interfaces like meditation apps or reading experiences. Evokes tranquility and focus.

## Tokens Applied

- **Colors**: Base MD3 system colors (no overrides).
- **Spacing**: Generous (e.g., '4': '20px', '5': '24px', '6': '32px').
- **Typography**: Light weights (300), larger sizes (e.g., heading1: 32px, body1: 16px).
- **Motion**: Slow easing and durations (e.g., short1: 50ms, long4: 1000ms).

## Mapping to MD3 Layers

- **System (sys)**: Colors unchanged.
- **Reference (ref)**: Spacing and typography derived.
- **Component (comp)**: No specific overrides.
- **Motion**: Slow easing (e.g., cubic-bezier(0.4, 0, 0.6, 1)).
- **Elevation**: No overrides.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use for calming interfaces | Apply with energetic presets |
| Ensure generous touch targets | Override with fast motion |
| Test for accessibility | Hardcode spacing values |

## Rationale

Generous spacing and slow motion reduce cognitive load, promoting calmness. Light typography feels soft and inviting.