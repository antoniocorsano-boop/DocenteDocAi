Title: design-system — conservative MD3 token migration (artifacts-only)

## Summary

- This PR contains conservative, reversible artifacts produced by automated replacement runs against `src/design-system`.
- It is artifacts-only: backups and tooling are included so Governance can review without changing runtime behavior.

## What's included

- `scripts/wrap-hex-colors.cjs` — hex wrapper used in runs
- `scripts/wrap-rgb-colors.cjs` — rgb wrapper (restricted to styles/markup)
- `scripts/ast-transformer.cjs` — AST-aware transformer used for `.ts/.tsx` (string/template literals only)
- `tmp/governance-check-result-design-system.json` — governance scan output
- `.preappfix.bak` files for every modified file under `src/design-system/`

## Reviewer instructions

1. Inspect the transformer and wrapper scripts in `scripts/`.
2. Validate a sample backup, e.g. `src/design-system/utils.ts.preappfix.bak`.
3. Run the governance scanner locally and review `tmp/governance-check-result-design-system.json`.

## Local review commands

```bash
# create a sandbox branch
git checkout -b review/artifacts-md3
# inspect the artifacts (no source changes applied)
ls scripts tmp src/design-system/*.preappfix.bak
# run the governance scanner locally
node scripts/governance-check.cjs src/design-system > tmp/gov-local.json
```

## Notes

- This PR intentionally does not alter production code; it provides reversible artifacts and patch guidance.
- The MD3 theme audit currently blocks merges until Governance approves exemptions or targeted fixes; DO NOT bypass hooks without council approval.

## Contact

Tag `@design-governance` and attach `reports/components-migration-diff.patch` if reviewers want the components tranche patch.
