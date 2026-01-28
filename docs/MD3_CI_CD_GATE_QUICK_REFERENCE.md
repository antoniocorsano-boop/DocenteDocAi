# MD3 CI/CD GATE — QUICK REFERENCE

**For Developers** | Last Updated: 2026-01-28

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## WHAT IS MD3 CI/CD GATE?

A **multi-layer enforcement system** that blocks commits and PRs violating MD3 governance.

**Result**: 100% MD3 compliance for all new code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## COMMON SCENARIOS

### ✅ My Commit Was Blocked — What Now?

```bash
# 1. Read the error message (shows violation type and file)
# Example:
# ❌ MD3 THEME GOVERNANCE FAILED
# 🚫 COMMIT BLOCKED: Hardcoded theme values detected
# 🔴 src/components/MyComponent.tsx:42
#    Type: hardcodedHexColor
#    Match: #ff0000

# 2. Fix the violation
# BEFORE:
const style = { color: '#ff0000' };

# AFTER:
const style = { color: 'var(--md-sys-color-error)' };

# 3. Commit again
git add src/components/MyComponent.tsx
git commit -m "fix: use MD3 color token"
```

### ✅ My PR Failed CI/CD — How to Fix?

```bash
# 1. Download violation reports from GitHub Actions artifacts
# 2. Open JSON report (e.g., theme-violations.json)
# 3. Fix all "blocking" violations (ignore "warnings" for now)
# 4. Run local audit
npm run md3:audit:all

# 5. Commit and push
git add .
git commit -m "fix: md3 compliance violations"
git push
```

### ✅ How to Check Before Committing?

```bash
# Run all audits locally
npm run md3:audit:all

# If all pass:
# ✅ AUDIT PASSED — No blocking violations

# If violations found:
# ❌ AUDIT FAILED — CI/CD BLOCKED
# (Fix violations shown in output)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## QUICK FIXES

### Hardcoded Colors

```tsx
// ❌ WRONG
<div style={{ color: '#ff0000' }}>Error</div>
<div style={{ backgroundColor: 'rgb(255, 0, 0)' }}>Error</div>

// ✅ CORRECT
<div style={{ color: 'var(--md-sys-color-error)' }}>Error</div>
<div style={{ backgroundColor: 'var(--md-sys-color-error-container)' }}>Error</div>
```

### Hardcoded Spacing

```tsx
// ❌ WRONG
<div style={{ padding: '16px', margin: '20px' }}>Content</div>

// ✅ CORRECT
<div style={{ padding: 'var(--md-sys-spacing-4)', margin: 'var(--md-sys-spacing-5)' }}>Content</div>
```

### Hardcoded Motion

```css
/* ❌ WRONG */
.element {
  transition: all 200ms ease-in-out;
  animation-duration: 300ms;
}

/* ✅ CORRECT */
.element {
  transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  animation-duration: var(--md-sys-motion-duration-medium1);
}
```

### Inline Styles

```tsx
// ❌ WRONG
<Component width="200px" padding="16px" />

// ✅ CORRECT
<Component className="m3-component" />
```

### Tailwind Classes

```tsx
// ❌ WRONG
<div className="w-full p-4 bg-blue-500 text-white">Content</div>

// ✅ CORRECT
<div className="m3-surface">Content</div>
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## USEFUL COMMANDS

```bash
# Run all audits
npm run md3:audit:all

# Individual audits
npm run md3:theme:audit
npm run md3:motion:audit
npm run md3:component:audit

# Run MD3 tests
npm test -- md3

# Check if file is legacy
node scripts/md3-legacy-checker.cjs src/components/MyComponent.tsx

# Generate compliance badge
node scripts/md3-generate-badge.cjs

# Build (same as CI)
npm run build
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## TOKEN REFERENCE

### Colors

```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-error
--md-sys-color-on-error
```

### Spacing

```css
--md-sys-spacing-1   /* 4px */
--md-sys-spacing-2   /* 8px */
--md-sys-spacing-3   /* 12px */
--md-sys-spacing-4   /* 16px */
--md-sys-spacing-5   /* 20px */
--md-sys-spacing-6   /* 24px */
--md-sys-spacing-8   /* 32px */
--md-sys-spacing-12  /* 48px */
```

### Motion

```css
/* Duration */
--md-sys-motion-duration-short1    /* 50ms */
--md-sys-motion-duration-short2    /* 100ms */
--md-sys-motion-duration-medium1   /* 250ms */
--md-sys-motion-duration-medium2   /* 300ms */
--md-sys-motion-duration-long1     /* 400ms */

/* Easing */
--md-sys-motion-easing-standard
--md-sys-motion-easing-emphasized
--md-sys-motion-easing-decelerate
--md-sys-motion-easing-accelerate
```

### Z-Index

```css
--md-sys-z-modal       /* 1300 */
--md-sys-z-snackbar    /* 1400 */
--md-sys-z-tooltip     /* 1500 */
--md-sys-z-drawer      /* 1200 */
--md-sys-z-app-bar     /* 1100 */
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## EMERGENCY BYPASS (USE WITH CAUTION)

```bash
# Skip pre-commit hook (NOT recommended)
git commit --no-verify -m "WIP: fixing violations"

# ⚠️ WARNING:
# - CI/CD will still block the PR
# - Only use for local WIP commits
# - Must fix before pushing
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## NEED HELP?

1. **Read error message** — shows file, line, and violation type
2. **Check documentation**:
   - [MD3 Governance Contract](../MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md)
   - [CI/CD Gate Docs](./MD3_CI_CD_GATE.md)
3. **Run local audit** — `npm run md3:audit:all`
4. **Ask team** — Tag `md3-governance` in issue/PR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TL;DR**: Use MD3 tokens (`var(--md-sys-*)`) for everything. No hardcoded values.
