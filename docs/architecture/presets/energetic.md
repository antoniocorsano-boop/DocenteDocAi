# Energetic Preset

## Preset Name and Description

Energetic: Vibrant colors, tight spacing, fast motion, bold typography for an exciting vibe.

## Emotional Intent / Usage Scenario

For high-energy interfaces like games or fitness apps. Energizes users and encourages action.

## Tokens Applied

- **Colors**: Base MD3 system colors (no overrides).
- **Spacing**: Tight (e.g., '1': '2px', '2': '6px', '4': '12px').
- **Typography**: Bold weights (600-700), standard sizes.
- **Motion**: Fast easing and durations (e.g., short1: 25ms, short4: 200ms).

## Mapping to MD3 Layers

- **System (sys)**: Colors unchanged.
- **Reference (ref)**: Spacing and typography derived.
- **Component (comp)**: No specific overrides.
- **Motion**: Fast easing (e.g., cubic-bezier(0.4, 0, 0.2, 1)).
- **Elevation**: No overrides.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Use for action-oriented interfaces | Combine with calm presets |
| Maintain fast interactions | Override with slow motion |
| Ensure readability | Hardcode motion values |

## Rationale

Tight spacing and fast motion create urgency and excitement. Bold typography emphasizes boldness.