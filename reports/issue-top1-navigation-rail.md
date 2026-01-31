Title: MD3: Replace hardcoded values in `src/components/navigation-rail.css` (priority)

## Description

File: `src/components/navigation-rail.css` — violations: 8

What: Replace hardcoded spacing/typography values with MD3 system tokens. Prefer token fallbacks such as `var(--md-sys-*)` and avoid direct numeric values.

Why: This file affects Header/Home/Top Navigation surfaces — high user impact. Fixing it reduces critical blocking violations and improves theme consistency.

Suggested changes

- Identify each hardcoded rule (see `reports/blocking-violations.csv`) and replace with the appropriate `--md-sys-*` token.
- Where a direct token mapping is unclear, add a conservative fallback: `var(--app-legacy-<hash>, <original-value>)` and open an RFC for exact token choices.

Testing

- Backup exists: `src/components/navigation-rail.css.preappfix.bak` (verify locally).
- Create sandbox branch: `git checkout -b md3/fix-navigation-rail` and apply changes.
- Run `npm ci && npm test` and visual diff for Header/Home/Nav pages.

Notes

- Do not bypass pre-commit hooks; include generated artifacts and `.preappfix.bak` with the PR for Governance review.
