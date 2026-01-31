Title: MD3: Replace hardcoded values in `src/components/accessibility/SkipLink.css`

## Description

File: `src/components/accessibility/SkipLink.css` — violations: 1

What: Replace hardcoded typography/weight with MD3 tokens (e.g., `var(--md-sys-typography-*)` or token fallback).

Why: Accessibility surface — critical for keyboard navigation and A11Y compliance.

Suggested changes

- Replace `font-weight: 500` with a semantic token or token fallback.
- Validate contrast and focus styles after change.

Testing

- Backup exists: `src/components/accessibility/SkipLink.css.preappfix.bak`.
- Apply changes in sandbox branch and run accessibility checks + visual diff.

Notes

- Include `.preappfix.bak` and reference `reports/blocking-violations.csv` in PR.
