MD3 Governance — Exceptions & Temporary Remediations

Purpose
- Document explicit exceptions made during the conservative MD3 remediation pass and the rationale for temporary measures.

Scope of exceptions
- `src/design-system/legacy-colors.ts`: Centralized legacy hex values used as `LEGACY_COLORS` for conservative remediation. These are temporary; the goal is to replace them with proper `--app-*` tokens or update the theme via RFC.
- PDF utilities and export helpers: PDF rendering depends on color literals and exact values; these files are excluded from automated changes.
- Visual regression snapshots / story snapshots: Excluded to avoid noisy diffs during automated passes.

Rationale
- Conservative, reversible edits reduce noise and help reviewers focus on tokenization strategy without changing the canonical theme files.
- Centralizing legacy colors reduces duplication and provides a single point for future token substitution.

Planned follow-ups
1. Submit RFC requesting new `--app-*` tokens for any persistent semantic colors identified in the audit.
2. Replace `LEGACY_COLORS` usages with approved `--app-*` tokens once RFC is approved.
3. Add an automated migration script to convert `LEGACY_COLORS` imports into `var(--app-*)` usages after tokens are available.

Files excluded from automated remediation
- Any file matching: `**/*.pdf.ts`, `**/pdf-**/*`, `**/*.stories.*`, `**/__tests__/**`, `**/__snapshots__/**`.

How to request an exception change
- Open an RFC in the `docs/rfcs/` folder describing the required token or exception removal, include `reports/governance-top50.csv` and `tmp/governance-check-result.json` as evidence, and route to the MD3 Governance Council.

Notes for reviewers
- These exceptions are intentionally conservative and reversible. If a reviewer prefers, we can revert `LEGACY_COLORS` centralization and instead apply token placeholders, but that requires token creation via RFC.
