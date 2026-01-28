# MD3 CI/CD GATE — PHASE 7 DOCUMENTATION

**Status**: ✅ ACTIVE & ENFORCED  
**Last Updated**: 2026-01-28  
**Version**: 1.0.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [CI/CD Pipeline Architecture](#cicd-pipeline-architecture)
3. [Audit Layers](#audit-layers)
4. [Pre-Commit Hook](#pre-commit-hook)
5. [GitHub Actions Workflow](#github-actions-workflow)
6. [Reading Audit Reports](#reading-audit-reports)
7. [Legacy File Management](#legacy-file-management)
8. [Escalation Procedure](#escalation-procedure)
9. [Troubleshooting](#troubleshooting)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OVERVIEW

The **MD3 CI/CD Gate** is a multi-layer enforcement system that **blocks any commit or Pull Request violating MD3 governance**.

### Enforcement Levels

| Level | When | Blocks | Output |
|-------|------|--------|--------|
| **Pre-Commit** | Local commit | ✅ Yes | Terminal |
| **CI/CD Pipeline** | Push/PR | ✅ Yes | GitHub Actions |
| **Manual Audit** | On-demand | ℹ️ Info | JSON reports |

### What is Enforced

- ✅ **Theme Tokens**: No hardcoded colors, spacing, typography
- ✅ **Motion Tokens**: No hardcoded transitions, animations
- ✅ **Component Contracts**: No inline styles, forbidden props
- ✅ **Z-Index Governance**: No numeric z-index values
- ✅ **Test Suite**: All MD3 tests must pass

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CI/CD PIPELINE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         GIT COMMIT                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-COMMIT HOOK                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ lint-staged  │ Theme Audit  │ Motion Audit │ Component    │ │
│  │              │              │              │ Audit        │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                    ❌ BLOCKS COMMIT IF FAIL                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ (commit allowed)
┌─────────────────────────────────────────────────────────────────┐
│                      GIT PUSH                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS WORKFLOW                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              JOB 1: md3-audit                              │ │
│  │  • Theme Audit       → JSON report                         │ │
│  │  • Motion Audit      → JSON report                         │ │
│  │  • Component Audit   → JSON report                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              JOB 2: md3-tests                              │ │
│  │  • Motion Governance Tests                                 │ │
│  │  • Component Contract Tests                                │ │
│  │  • Expressive Validation Tests                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              JOB 3: build-validation                       │ │
│  │  • npm run build                                           │ │
│  │  • Ensures MD3-compliant build succeeds                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                    ❌ BLOCKS PR MERGE IF FAIL                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ (all jobs pass)
┌─────────────────────────────────────────────────────────────────┐
│                     ✅ MERGE ALLOWED                             │
└─────────────────────────────────────────────────────────────────┘
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## AUDIT LAYERS

### Layer 1: Theme Audit

**Script**: `scripts/md3-theme-audit.cjs`  
**Command**: `npm run md3:theme:audit`  
**Report**: `audit/theme-violations.json`

**Detects**:
- Hardcoded colors (`#hex`, `rgb()`, `rgba()`, `hsl()`)
- Hardcoded spacing (`px`, `rem`, `em`, `%`)
- Hardcoded typography (`font-size`, `font-weight`)
- Non-MD3 CSS variables (`--custom-*`)
- Tailwind utility classes

**Allowed**:
- Files: `src/theme.css`, `index.css`, `src/global-styles.css`
- Reason: Token definition files

### Layer 2: Motion Audit

**Script**: `scripts/md3-motion-audit.cjs`  
**Command**: `npm run md3:motion:audit`  
**Report**: `audit/motion-violations.json`

**Detects**:
- Hardcoded duration (`200ms`, `0.3s`)
- Hardcoded easing (`ease`, `linear`, `cubic-bezier()`)
- `transition: all` (performance anti-pattern)
- Inline style temporal values
- Non-MD3 motion variables

**Required**:
- Use `var(--md-sys-motion-duration-*)` for duration
- Use `var(--md-sys-motion-easing-*)` for easing

### Layer 3: Component Contract Audit

**Script**: `scripts/md3-component-contract-audit.cjs`  
**Command**: `npm run md3:component:audit`  
**Report**: `reports/md3-component-contract-violations.json`

**Detects**:
- Inline styles with hardcoded values
- Forbidden props (`width`, `height`, `margin`, `padding`, `zIndex`)
- className with utility classes
- Direct style manipulation (`.style.*`)

**Required**:
- Components use only MD3 classes or tokens
- No inline styles except with tokens
- No forbidden props on components

### Layer 4: Z-Index Audit

**Script**: `scripts/md3-zindex-audit.cjs`  
**Command**: `npm run md3:zindex:audit`

**Detects**:
- Numeric z-index values

**Required**:
- Use `var(--md-sys-z-*)` tokens only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PRE-COMMIT HOOK

**Location**: `.husky/pre-commit`

### Execution Flow

```bash
1. lint-staged (ESLint, Prettier)
   ↓
2. MD3 Compliance Check (if staged files in src/)
   ↓
3. Z-Index Governance Audit
   ↓
4. Motion Governance Audit
   ↓
5. Component Contract Audit
   ↓
6. Theme Governance Audit
   ↓
✅ COMMIT ALLOWED (or ❌ BLOCKED)
```

### Local Override (NOT RECOMMENDED)

If you **absolutely must** commit despite violations:

```bash
git commit --no-verify -m "your message"
```

⚠️ **WARNING**: CI/CD will still block the PR. Use only for WIP branches.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## GITHUB ACTIONS WORKFLOW

**File**: `.github/workflows/md3-cicd-gate.yml`

### Triggers

- **Push** to `main`, `develop`, `feature/**`
- **Pull Request** to `main`, `develop`
- **Paths**: `src/**/*.{tsx,ts,css,jsx,js}`

### Jobs

#### 1. `md3-audit`

**Duration**: ~2-5 minutes  
**Runs**: All audit scripts  
**Output**: JSON reports uploaded as artifacts  

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run theme audit
5. Run motion audit
6. Run component audit
7. Generate summary
8. Upload violation reports
9. Comment on PR (if applicable)
10. **Block merge** if violations detected

#### 2. `md3-tests`

**Duration**: ~3-7 minutes  
**Runs**: MD3 test suite  

**Tests**:
- `md3-motion-governance.test.ts`
- `md3-component-contracts.test.tsx`
- `md3-expressive-validation.test.tsx`

**Blocks**: If any test fails

#### 3. `build-validation`

**Duration**: ~5-10 minutes  
**Requires**: Jobs 1 & 2 pass  

**Steps**:
1. Install dependencies
2. Run `npm run build`
3. Verify build succeeds

### PR Comments

When violations are detected, the workflow posts a comment:

```markdown
## 🔒 MD3 Governance Audit Report

### ❌ VIOLATIONS DETECTED

This PR **BLOCKS MERGE** due to MD3 governance violations.

#### Audit Results:

- ❌ **Theme Audit** (colors, spacing, typography)
- ✅ **Motion Audit** (transitions, animations)
- ❌ **Component Contract Audit** (inline styles, props)

#### 🛠️ How to Fix:
1. Download violation reports from workflow artifacts
2. Review violations in detail
3. Replace hardcoded values with MD3 tokens (`var(--md-sys-*)`)
4. Run local audits: `npm run md3:audit:all`
5. Commit fixes and push

#### 📖 Documentation:
- [MD3 Governance Contract](../blob/main/MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md)
- [MD3 Motion Governance](../blob/main/docs/MD3_MOTION_GOVERNANCE.md)
- [MD3 Component Contracts](../blob/main/docs/MD3_COMPONENT_CONTRACTS.md)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## READING AUDIT REPORTS

### JSON Report Structure

All audit reports follow this structure:

```json
{
  "timestamp": "2026-01-28T10:30:00.000Z",
  "summary": {
    "totalFiles": 450,
    "blockingViolations": 12,
    "warnings": 45,
    "exempt": 3
  },
  "blocking": [
    {
      "file": "src/components/MyComponent.tsx",
      "type": "hardcodedHexColor",
      "line": 42,
      "match": "#ff0000",
      "context": "  backgroundColor: '#ff0000',",
      "classification": {
        "type": "blocking-violation",
        "blocking": true,
        "severity": "error",
        "message": "New violation — blocks CI/CD"
      }
    }
  ],
  "warnings": [
    {
      "file": "src/components/legacy/OldComponent.tsx",
      "type": "hardcodedSpacing",
      "line": 15,
      "match": "16px",
      "context": "  padding: 16px;",
      "classification": {
        "type": "legacy-warning",
        "blocking": false,
        "severity": "warning",
        "message": "Legacy file: documented for migration",
        "tracked": true,
        "migrationPlan": "MD3_CLEANUP_EXECUTION_PLAN.md"
      }
    }
  ],
  "exempt": [...]
}
```

### How to Read

1. **Check `summary.blockingViolations`**  
   If > 0, the build/PR is blocked.

2. **Review `blocking` array**  
   These MUST be fixed before merge.

3. **Review `warnings` array**  
   Legacy files — tracked for future remediation, not blocking.

4. **Check `classification.message`**  
   Tells you why a violation is blocking or not.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## LEGACY FILE MANAGEMENT

### Registry File

**Location**: `md3-legacy-registry.json`

### Structure

```json
{
  "legacyFiles": [
    {
      "path": "src/components/legacy/**",
      "reason": "Legacy components scheduled for migration",
      "tracked": true,
      "migrationPlan": "MD3_CLEANUP_EXECUTION_PLAN.md"
    }
  ],
  "exemptions": [
    {
      "file": "src/theme.css",
      "reason": "Token definition file",
      "permanent": true
    }
  ]
}
```

### Classification

| Type | Blocking | Displayed As | Action Required |
|------|----------|--------------|-----------------|
| **Blocking** | ✅ Yes | 🔴 Error | Must fix before merge |
| **Legacy Warning** | ❌ No | 🟡 Warning | Tracked for future remediation |
| **Exempt** | ❌ No | ℹ️ Info | Allowed by design |

### Adding Legacy Files

To mark a file as legacy (warning only):

1. Edit `md3-legacy-registry.json`
2. Add entry to `legacyFiles` array:

```json
{
  "path": "src/components/MyLegacyComponent.tsx",
  "reason": "Documented in Phase 8 cleanup plan",
  "tracked": true,
  "migrationPlan": "MD3_CLEANUP_EXECUTION_PLAN.md"
}
```

3. Commit and push
4. File violations will now be warnings, not blocking

⚠️ **NOTE**: New violations cannot be added to legacy. Only existing documented violations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ESCALATION PROCEDURE

### When Violations Are Detected

```
STEP 1: Download violation reports from GitHub Actions artifacts
         ↓
STEP 2: Review violations in JSON report
         ↓
STEP 3: Attempt to fix using MD3 tokens
         ↓
STEP 4a: Fix successful → Commit & push → CI passes ✅
         │
STEP 4b: Cannot fix → Escalate to MD3 governance team
```

### Escalation Process

If you believe a violation is:
- **False positive**: Open issue with file path and context
- **Unavoidable**: Propose exemption with justification
- **Legacy code**: Document in `md3-legacy-registry.json`

**Contact**:
- GitHub Issues: Tag `md3-governance`
- Team Lead: Review in daily standup
- Documentation: Update `MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md`

### Emergency Override

**ONLY for production hotfixes**:

1. Create hotfix branch
2. Document override in commit message:
   ```
   fix: critical bug [MD3_OVERRIDE]
   
   Reason: Production down, users affected
   Violations: hardcoded color in src/components/Alert.tsx
   Remediation: Tracked in issue #1234
   ```
3. Merge with admin override
4. Create follow-up issue for MD3 compliance
5. Fix within 48 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## TROUBLESHOOTING

### Pre-Commit Hook Not Running

**Symptoms**: Commits succeed despite violations

**Solutions**:
1. Ensure Husky is installed: `npm run prepare`
2. Check `.husky/pre-commit` is executable (Unix): `chmod +x .husky/pre-commit`
3. Verify Husky hook: `ls -la .git/hooks/pre-commit`

### CI/CD Passes Locally But Fails in GitHub

**Causes**:
- Different Node.js version
- Missing dependencies
- Environment-specific files

**Solutions**:
1. Use Node.js 20 (same as CI): `nvm use 20`
2. Clean install: `rm -rf node_modules && npm ci`
3. Run all audits: `npm run md3:audit:all`

### False Positives

**Example**: Token usage flagged as violation

**Check**:
1. Is file in `md3-legacy-registry.json` exemptions?
2. Is pattern matching token definition lines?

**Fix**:
1. Add file to exemptions if legitimate
2. Update violation regex if false positive

### Legacy File Not Recognized

**Symptoms**: Legacy file violations block CI/CD

**Solutions**:
1. Verify path in `md3-legacy-registry.json` uses `/` not `\`
2. Check pattern syntax (use `**` for recursive)
3. Run: `node scripts/md3-legacy-checker.cjs <file-path>`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## COMMANDS REFERENCE

### Local Audit

```bash
# Run all audits
npm run md3:audit:all

# Individual audits
npm run md3:theme:audit
npm run md3:motion:audit
npm run md3:component:audit
npm run md3:zindex:audit

# Generate badge
node scripts/md3-generate-badge.cjs

# Check if file is legacy
node scripts/md3-legacy-checker.cjs src/components/MyComponent.tsx
```

### Test Suite

```bash
# Run all MD3 tests
npm test -- md3

# Individual tests
npm test -- md3-motion-governance.test.ts
npm test -- md3-component-contracts.test.tsx
npm test -- md3-expressive-validation.test.tsx
```

### Build

```bash
# Validate build (same as CI)
npm run build
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## RELATED DOCUMENTATION

- [MD3 Governance Contract](MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md)
- [MD3 Motion Governance](docs/MD3_MOTION_GOVERNANCE.md)
- [MD3 Component Contracts](docs/MD3_COMPONENT_CONTRACTS.md)
- [MD3 Z-Index Governance](docs/MD3_Z_INDEX_GOVERNANCE.md)
- [MD3 Cleanup Execution Plan](MD3_CLEANUP_EXECUTION_PLAN.md)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PHASE 7 COMPLETE — CI/CD GATE ACTIVE**

All commits and PRs are now protected by MD3 governance enforcement.

Any violation blocks merge. Legacy files generate warnings.

**This pipeline ensures 100% MD3 compliance for all new code.**
