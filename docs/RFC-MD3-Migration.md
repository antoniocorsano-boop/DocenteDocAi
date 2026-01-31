# RFC: Conservative MD3 Token Migration

Status: Draft

## Summary

This RFC proposes a conservative, reversible migration strategy to replace legacy `--app-*`, `--sys-*`, and typography tokens with `--md-sys-*` tokens across `src/**` while avoiding snapshot/test churn.

## Scope

- Seed mapping: `reports/mapping.json` (minimal, reviewable set).
- Scripts: replacer utilities live in `scripts/` (for reviewer-run automation).
- Short-term exemptions: `md3-legacy-registry.json` contains 14-day exemptions for snapshots/tests and targeted CSS files to unblock commits.

## Rollout Plan

1. Review seed mapping and extend as needed.
2. Run replacer locally on a feature branch; backups saved as `*.preappfix.bak`.
3. Commit artifacts (mapping + RFC + scripts + registry exemptions) for governance review.
4. After approval, run replacer for remaining files and update snapshots in a follow-up PR.

## Rollback

Each changed file has a `.preappfix.bak` backup alongside it; revert by restoring the backup.

## Notes

- This RFC intentionally avoids automatic changes to `__tests__` and `__snapshots__` in the first pass.
- The `reports/mapping.json` file is a conservative starting point and should be expanded where audit failures indicate missing mappings.
