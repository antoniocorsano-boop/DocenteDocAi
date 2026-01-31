# RFC 0001 — MD3 App Tokens for Legacy Colors

Status: Draft
Author: Automation / onboarding
Date: 2026-01-31

Summary

Propose a small set of `--app-*` semantic tokens to replace `LEGACY_COLORS` and other recurring legacy hex values used temporarily during the MD3 remediation pass. This enables safety-preserving refactorings and consistent theming without modifying core MD3 token files.

Motivation

- The governance scan found many hex literals and rgb(a) usages across `src/constants.ts` and `src/design-system`.
- To comply with MD3 Platinum constraints we must use semantic app tokens rather than hardcoded hex values.
- Creating `--app-*` tokens (application-level semantic tokens) is the least invasive governance-approved path: tokens can map to existing MD3 variables or be assigned palette values after review.

Proposal

Create the following app tokens (example names and initial mappings to `LEGACY_COLORS`):

- `--app-color-brand-primary`: maps to `LEGACY_COLORS.primary` (#6750A4)
- `--app-color-brand-on-primary`: maps to `LEGACY_COLORS.onPrimary`
- `--app-color-surface-muted`: maps to `LEGACY_COLORS.surfaceMuted`
- `--app-color-accent-1`: maps to `LEGACY_COLORS.accent1`
- `--app-color-accent-2`: maps to `LEGACY_COLORS.accent2`

(Replace names and mappings with exact entries from `reports/governance-top50.csv` during review.)

Impact

- Code: replace `LEGACY_COLORS.*` (temporary) usages with `var(--app-color-*)` where semantics match. Keep `LEGACY_COLORS` as a fallback during transition.
- Design system: no changes to core MD3 tokens; app tokens are defined in `src/theme.css` or `src/design-system/tokens.css` under app namespace.
- Tests/PDFs: excluded from automated mass edits; token rollout must be validated against visual snapshots and PDF rendering.

Migration Plan

1. Approve RFC and token names via MD3 Governance Council.
2. Add token definitions to `src/theme.css` (app namespace) with initial values mapped to `LEGACY_COLORS`.
3. Replace usages in `src/design-system` and `src/components` incrementally. Open small PRs per package (e.g., `design-system`, `ui`) for review.
4. Run visual regression and PDF snapshot validation.
5. Remove `LEGACY_COLORS` once all usages replaced and tokens finalized.

Tests and Validation

- `npm run check:md3` (fail) should show reduced hex/rgb violations for scoped files.
- Visual regression tests (Playwright snapshots) must pass or be approved if intentional.
- PDF render tests must be manually verified for color fidelity.

Alternatives

- Continue using `LEGACY_COLORS` indefinitely (not recommended).
- Directly modify core MD3 tokens (forbidden without RFC and governance approval).

Rollout

- Target release: next minor release after governance approval.
- Provide migration PRs with small atomic replacements and request design review.

Notes

Attach `reports/governance-top50.csv`, `reports/governance-check-fail-summary.csv`, and `reports/governance-check-fail.json` to the RFC for evidence.
