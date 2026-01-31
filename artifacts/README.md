This folder contains artifacts produced by the automated conservative MD3 token migration run against `src/design-system`.

Contents:

- scripts/wrap-hex-colors.cjs - hex color wrapper script
- scripts/wrap-rgb-colors.cjs - rgb color wrapper (CSS/markup files only)
- scripts/ast-transformer.cjs - AST-aware transformer for .ts/.tsx files (string/template literals only)
- tmp/governance-check-result-design-system.json - governance scan output (9 violations found)
- reports/components-migration-diff.patch - comprehensive migration patch for components
- backups: all `.preappfix.bak` files found under `src/design-system/`

Review instructions:

1. Inspect the transformer and wrapper scripts in `scripts/`.
2. Review `tmp/governance-check-result-design-system.json` for the exact violations list.
3. Validate a representative sample of `.preappfix.bak` files to confirm transformations.
4. Examine `reports/components-migration-diff.patch` for the complete migration changes.
5. Do not merge this folder into main branches; it's intended for Governance review and audit.

Local review commands:

```bash
# create a sandbox branch
git checkout -b review/artifacts-md3

# inspect the artifacts
ls scripts/wrap-*.cjs scripts/ast-transformer.cjs
cat tmp/governance-check-result-design-system.json

# run the governance scanner locally
node scripts/governance-check.cjs --path "src/design-system/**/*.ts?(x)" --mode warn

# view a sample backup
diff src/design-system/utils.ts.preappfix.bak src/design-system/utils.ts
```

Revert guidance:

- Each `.preappfix.bak` file provides the previous content and can be restored by copying it back to the original path.
- To revert all changes: `find src/design-system -name "*.preappfix.bak" -exec sh -c 'cp "$1" "${1%.preappfix.bak}"' _ {} \;`

Status: ✅ All artifacts complete and ready for governance review.
