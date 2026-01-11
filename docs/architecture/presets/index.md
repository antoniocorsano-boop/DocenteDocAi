# Preset Catalog Index

## Purpose

This catalog documents all MD3 Expressive emotional presets, their token overrides, and usage guidelines. Presets enable emotional theming through coordinated token adjustments across layers.

## Preset Relationships

Presets are designed to be mutually exclusive but combinable for custom themes. They share a base MD3 theme and apply layered overrides:

- **Calm** and **Relaxed**: Low-energy presets with generous spacing and slow motion.
- **Energetic** and **Focused**: High-energy presets with tight spacing and fast motion.
- **Creative** and **Playful**: Variable, bouncy presets for inspiration and fun.
- **Professional** and **Minimal**: Neutral presets for clarity and simplicity.

## Recommended Usage

- Use presets for mood-based interfaces (e.g., calm for meditation apps).
- Avoid mixing conflicting presets (e.g., energetic + relaxed).
- Test accessibility in all presets.

## Conflicts and Guidelines

- **Conflicts**: Combining fast motion (energetic) with slow motion (calm) may confuse users.
- **Extending**: Add custom overrides on top of presets using theme manager.
- **Combining**: Merge presets by applying multiple overrides, but validate coherence.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Apply one preset at a time | Mix presets without testing |
| Use for emotional context | Hardcode preset values |
| Validate accessibility | Override without rationale |

## Rationale

Presets provide emotional design without violating MD3 layering. Relationships ensure consistent user experience.

## Copilot Instructions

Copilot must READ this file as architectural rules for preset usage.

## Preset Files

- [Calm](calm.md)
- [Energetic](energetic.md)
- [Creative](creative.md)
- [Focused](focused.md)
- [Relaxed](relaxed.md)
- [Professional](professional.md)
- [Playful](playful.md)
- [Minimal](minimal.md)