---
title: "0001 - App tokens for legacy colors"
status: Draft
date: 2026-01-31
authors: ["DocenteDoc AI — Migration Bot"]
---

# Summary

This RFC proposes a conservative, governance-friendly set of `--app-*` CSS tokens that act
as an application compatibility layer for legacy color values used across the codebase.
These tokens are aliases that map to existing MD3 system tokens where possible, or to
approved app-level fallbacks when a semantic mapping is required.

# Motivation

- The repository contains many legacy HEX and semantic color usages sourced in
  `src/design-system/legacy-colors.ts`. We must avoid editing that file (source-of-truth)
  while still removing ad-hoc color literals across components.
- A small set of conservative `--app-*` aliases lets us remediate component code by
  pointing color references to stable variables, keeping changes reversible and reviewable.

# Proposal

Introduce the following minimal token aliases in `src/theme.css` under the `:root` block:

- `--app-color-primary` → `var(--md-sys-color-primary)`
- `--app-color-on-primary` → `var(--md-sys-color-on-primary)`
- `--app-color-primary-container` → `var(--md-sys-color-primary-container)`
- `--app-color-on-primary-container` → `var(--md-sys-color-on-primary-container)`
- `--app-color-surface` → `var(--md-sys-color-surface)`
- `--app-color-on-surface` → `var(--md-sys-color-on-surface)`
- `--app-color-surface-variant` → `var(--md-sys-color-surface-variant)`
- `--app-color-on-surface-variant` → `var(--md-sys-color-on-surface-variant)`
- `--app-spacing-touch` → `var(--md-sys-spacing-11)` (44px semantic touch target)

These token names are intentionally conservative and semantic. They are already present
in the working branch as aliases (see `src/theme.css`) to avoid mass edits of components
before governance review.

# Rollout Plan

1. Ship this RFC as a draft and solicit governance review.
2. Use targeted migration PRs that replace specific component usages with `var(--app-*)`.
3. Run the governance scanner on each PR and attach `reports/*` and `audit/*` artifacts.
4. After governance approval, iterate to remove `LEGACY_COLORS` consumers where safe.

# Exceptions

- Files used for PDF generation and story/test snapshots are excluded from automated
  substitutions (`src/design-system/pdf-colors.ts`, stories, tests). These exceptions
  are documented in `docs/MD3_GOVERNANCE_EXCEPTIONS.md`.

# Security / Accessibility

- Tokens map to MD3 tokens which preserve contrast and WCAG behavior. Any new app token
  that reduces contrast must be escalated via RFC and accessible remediation steps.

# Approval

Request: governance council review + approval to use the `--app-*` compatibility layer
for incremental migrations. After approval, token names become stable and used by
future migration PRs.

---

References: `docs/MD3_GOVERNANCE_EXCEPTIONS.md`, `src/theme.css`, `src/design-system/legacy-colors.ts`.

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
