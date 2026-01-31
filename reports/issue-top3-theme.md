Title: MD3: Replace hardcoded values in `src/theme.css` (high priority)

## Description

File: `src/theme.css` — violations: 157

What: Replace global hardcoded theme values with MD3 system tokens. This is a broad, high-impact tranche.

Why: `src/theme.css` is a core styling file; fixing it yields large reductions in blocking violations across the repo.

Suggested changes

- Replace color, spacing, and typography literals with `var(--md-sys-*)` tokens.
- Add conservative fallbacks using `--app-legacy-*` where mapping is unclear.

Testing

- Backup exists: `src/theme.css.preappfix.bak` (verify copy).
- Create sandbox: `git checkout -b md3/fix-theme` and apply incremental changes file-by-file.
- Run full test suite and visual regression on main screens.

Notes

- Because this is broad, split into smaller PRs per category (colors, spacing, typography).
