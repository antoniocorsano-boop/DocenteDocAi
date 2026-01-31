This folder contains artifacts produced by the automated conservative MD3 token migration run against `src/design-system`.

Contents:

- scripts/wrap-hex-colors.cjs
- scripts/wrap-rgb-colors.cjs (updated to only target CSS/markup files)
- tmp/governance-check-result-design-system.json
- backups: all `.preappfix.bak` files found under `src/design-system/`

Review instructions:

1. Inspect `tmp/governance-check-result-design-system.json` for the exact violations list.
2. Validate a representative sample of `.preappfix.bak` files to confirm transformations.
3. Do not merge this folder into main branches; it's intended for Governance review and audit.

Revert guidance:

- Each `.preappfix.bak` file provides the previous content and can be restored by copying it back to the original path.

If you want me to create the PR branch and commit these artifacts, tell me and I will provide the exact `git` commands or perform the operations if you grant permission.
