# MD3 BATCH MIGRATION — QUICK REFERENCE

**Script**: `scripts/md3-batch-migrate.cjs`
**Status**: ✅ READY FOR EXECUTION
**Pattern Source**: [MD3_MIGRATION_PATTERNS.md](./MD3_MIGRATION_PATTERNS.md)

---

## QUICK START

### 1. Preview Current State
```bash
node scripts/md3-batch-migrate.cjs --report
```

Shows top 20 violators with violation counts (excluding already migrated files).

---

### 2. Dry Run (Preview Changes)
```bash
# Test on single file
node scripts/md3-batch-migrate.cjs --dry-run --file=src/components/ChipInputList.tsx

# Test on batch of 5 files
node scripts/md3-batch-migrate.cjs --dry-run --batch-size=5

# Test on default batch (10 files)
node scripts/md3-batch-migrate.cjs --dry-run
```

Shows what would be changed WITHOUT modifying files.

---

### 3. Execute Migration

**Single File**:
```bash
node scripts/md3-batch-migrate.cjs --file=src/components/ChipInputList.tsx
```

**Batch (5 files)**:
```bash
node scripts/md3-batch-migrate.cjs --batch-size=5
```

**Default Batch (10 files)**:
```bash
node scripts/md3-batch-migrate.cjs
```

**Skip Validation** (faster, not recommended):
```bash
node scripts/md3-batch-migrate.cjs --no-validate
```

---

## WHAT THE SCRIPT DOES

### Pattern Detection (7 Types)

1. **Pseudo-token Colors**  
   `'colors.primary'` → `'var(--md-sys-color-primary)'`

2. **Pseudo-token Spacing**  
   `'spacing[4]'` → `'var(--md-sys-spacing-4)'`

3. **Hardcoded Motion Durations**  
   `'300ms'` → `'var(--md-sys-motion-duration-medium-4)'`

4. **Hardcoded Easing Functions**  
   `'cubic-bezier(0.4, 0, 0.2, 1)'` → `'var(--md-sys-motion-easing-emphasized)'`

5. **Pseudo-token Typography**  
   `'typescale.headlineLarge.fontSize'` → `'var(--md-sys-typescale-headline-large-size)'`

6. **Pseudo-token Shapes**  
   `'shape.corner.large'` → `'var(--md-sys-shape-corner-large)'`

7. **Inline Style Objects** (manual review needed for complex cases)

---

## SAFETY FEATURES

### Automatic Backups
Every file is backed up to `migration/backups/` before modification with timestamp:
```
migration/backups/ChipInputList.tsx.2026-01-28T16-30-45-123Z.bak
```

### Post-Migration Validation
After each file migration:
1. ✅ ESLint check (syntax, code quality)
2. ✅ MD3 compliance check (no remaining violations)
3. ✅ Git staging (ready for commit)

### Skip Criteria
Files are automatically skipped if:
- Already migrated (in `CONFIG.skipFiles`)
- Too many violations (>50, needs manual migration)
- Exempt (e.g., `src/theme.css`, `index.css`)

---

## WORKFLOW

### Recommended Incremental Approach

**Step 1: Dry Run First**
```bash
node scripts/md3-batch-migrate.cjs --dry-run --batch-size=5
```
Review output, ensure patterns are correct.

**Step 2: Migrate Small Batch**
```bash
node scripts/md3-batch-migrate.cjs --batch-size=5
```

**Step 3: Validate**
```bash
npm run lint
npm run md3:component:audit
npm test
```

**Step 4: Commit**
```bash
git add -A
git commit -m "chore: MD3 batch migration (batch 1 - 5 files)"
```

**Step 5: Repeat**
Continue with next batches until all files are migrated.

---

## CURRENT STATUS

### Completed
- ✅ **EvaluationModule.tsx** - 21/21 violations (reference implementation)
- ✅ Pattern extraction complete (7 deterministic patterns)
- ✅ Automation script created and tested

### Remaining
- 🎯 **372 violations** across **109 files**
- 📊 **Top 10 violators**: 14-7 violations each
- 🔧 **Estimated time**: ~2-3 hours for all files (in batches)

---

## MIGRATION REPORT

After each run, a detailed report is generated:
```
reports/md3-batch-migration-{timestamp}.json
```

Contains:
- Files migrated
- Violations fixed (by type)
- Success/failure status
- Backup paths
- Validation results

---

## TROUBLESHOOTING

### "No files to migrate! All clean."
All eligible files already migrated. Run with `--report` to see current state.

### ESLint Validation Fails
File has syntax errors or code quality issues. Review manually:
```bash
npx eslint src/components/FileName.tsx
```

### Remaining Violations After Migration
Complex inline styles require manual refactoring (see EvaluationModule.tsx reference).

### Restore from Backup
```bash
cp migration/backups/FileName.tsx.{timestamp}.bak src/components/FileName.tsx
```

---

## ADVANCED USAGE

### Migrate Specific Files Only
```bash
# Migrate top 3 violators
node scripts/md3-batch-migrate.cjs --batch-size=3

# Migrate single file
node scripts/md3-batch-migrate.cjs --file=src/components/Settings.tsx
```

### Generate Migration Report Only
```bash
node scripts/md3-batch-migrate.cjs --report
```

### Skip Validation (Fast Mode)
```bash
node scripts/md3-batch-migrate.cjs --batch-size=10 --no-validate
```
⚠️ **Warning**: Skips post-migration checks. Run full validation afterward:
```bash
npm run lint
npm run md3:component:audit
```

---

## NEXT STEPS

1. **Dry run** on batch of 5: `node scripts/md3-batch-migrate.cjs --dry-run --batch-size=5`
2. **Execute** migration: `node scripts/md3-batch-migrate.cjs --batch-size=5`
3. **Validate**: `npm run lint && npm run md3:component:audit && npm test`
4. **Commit**: `git commit -m "chore: MD3 batch migration (batch 1)"`
5. **Repeat** until all files migrated

---

**Documentation**: [MD3_MIGRATION_PATTERNS.md](./MD3_MIGRATION_PATTERNS.md)  
**Reference Implementation**: [EvaluationModule.tsx](../src/components/EvaluationModule.tsx)  
**CI/CD Gate**: [MD3_CI_CD_GATE.md](./MD3_CI_CD_GATE.md)
