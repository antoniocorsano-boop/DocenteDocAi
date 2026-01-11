# M3_HOME_REF.md

## Design Intent

The Home page is the canonical reference for Material 3 Expressive in this app. It communicates calm authority, clarity, and emotional restraint. All design choices prioritize trustworthiness and visual calm within 3 seconds.

## Spacing, Typography, and Surface Rules

- **Spacing:** Only Material 3 spacing tokens (`var(--md-sys-spacing-*)`) and `.m3-p-*`, `.m3-m-*` utilities are used. No hardcoded pixel values.
- **Shape:** Border-radius is set exclusively via M3 shape tokens (`var(--md-sys-shape-corner-*)`).
- **Elevation:** Only `shadow-elevation-1` and `shadow-elevation-2` are used for cards/containers.
- **Surface:** All backgrounds and containers use M3 surface tokens (`--md-sys-color-surface`, `--md-sys-color-surface-container`, etc.).
- **Typography:**
  - Headline: `m3-headline-large`, `m3-headline-medium`
  - Body: `m3-body-large`, `m3-body-medium`
  - Labels: `m3-label-small`, `m3-label-large` only where needed
  - No decorative uppercase; uppercase is reserved for labels and always with reduced opacity

## CTA Hierarchy Rules

- **Primary CTA:** Only one visually dominant CTA per view, always a filled `M3Button`.
- **Secondary Actions:** Tonal or outlined `M3Button` only, visually subordinate to the primary CTA.
- **No competing CTAs:** Remove or demote any element that visually competes with the main CTA.

## Explicit Anti-Patterns (MUST NOT be reintroduced)

- Hardcoded spacing, color, or border-radius values
- Tailwind classes for spacing/color/shape (unless mapped to M3 tokens)
- Decorative gradients, overlays, or non-functional animations
- Multiple visually dominant CTAs
- Non–Material Symbols icons or non-outlined icons
- Excessive font weight or decorative uppercase outside labels
- Visual noise: drop shadows, borders, or effects not defined by M3
- Non-M3 color tokens for backgrounds, text, or surfaces

## Reference Implementation

See `src/components/Home.tsx` for the canonical implementation. All new views must follow these rules and reference this file for structure, spacing, and visual hierarchy.
