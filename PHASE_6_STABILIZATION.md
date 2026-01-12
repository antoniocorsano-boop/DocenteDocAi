# Phase 6: Stabilization Mode - New Code MD3 Compliance

**Started:** January 12, 2026
**Objective:** Lock in 45.8% improvement (4,838 errors) and prevent regression on NEW code
**Duration:** Ongoing (indefinite stabilization)
**Target:** Zero NEW MD3 violations in pull requests

---

## 🎯 Stabilization Principles

### 1. **Pre-Commit Enforcement**

- ✅ Husky pre-commit hook configured
- ✅ ESLint --fix runs automatically on staged files
- ✅ Blocks commits with ESLint violations
- ✅ Manual testing: `git commit` will fail if violations exist

### 2. **Baseline Lock**

- **Target Error Count:** ≤ 4,838 errors
- **Action:** If errors increase, investigate immediately
- **Monthly Review:** Report trends and identify regression patterns

### 3. **New Code Standard**

- ✅ Only inline styles with MD3 tokens (`--md-sys-*` variables)
- ✅ NO `className` except:
  - `material-symbols-outlined` (Material Icons)
  - Custom utility classes pre-approved by design team
- ✅ No Tailwind CSS imports
- ✅ No hardcoded colors/spacing/typography

---

## 📋 New Code Compliance Checklist

### For All New Components

```tsx
// ✅ COMPLIANT
import { M3Typography } from "./ui";

export const MyComponent = () => (
  <div
    style={{
      backgroundColor: "var(--md-sys-color-surface)",
      padding: "var(--md-sys-spacing-4)",
      borderRadius: "var(--md-sys-shape-corner-medium)",
    }}
  >
    <M3Typography variant="body-large">Content here</M3Typography>
    <span className="material-symbols-outlined">settings</span>
  </div>
);

// ❌ VIOLATION - Will block commit
export const BadComponent = () => (
  <div className="p-4 bg-blue-500 rounded">Text here</div>
);
```

### Pre-Commit Hook Testing

```bash
# This will trigger ESLint pre-commit check:
$ git commit -m "feat: new component"

# If ESLint fails, you'll see:
# ✖ 3 problems (3 errors, 0 warnings)
# husky - pre-commit hook exited with code 1

# Fix with:
$ npm run lint -- --fix

# Then commit again:
$ git commit -m "feat: new component"
```

---

## 🔍 Monitoring Strategy

### Weekly Check

```bash
# Monday morning check (suggested):
$ npm run lint 2>&1 | grep 'problems'

# Expected output:
# ✔ 4,838 problems (4,836 errors, 2 warnings)
# ↑ If errors increase → Investigate immediately
```

### Git Diff Review

```bash
# Before merging PRs, check for className violations:
$ git diff main..your-branch -- '*.tsx' | grep -E 'className=|Tailwind|tailwind'

# If any Tailwind found → Request revisions
```

---

## 📝 Design System Enforcement

### ESLint Rules Active

1. **design-system/no-classname** (except material-symbols-outlined)
   - Blocks all className usage except icons
   - Auto-fixable: No (requires manual conversion)

2. **design-system/no-tailwind-classes**
   - Blocks Tailwind utility prefixes (px-, py-, bg-, etc.)
   - Auto-fixable: Partial (suggests inline styles)

3. **design-system/no-hardcoded-colors**
   - Blocks hex, rgb, rgba colors outside var()
   - Auto-fixable: No (requires MD3 token mapping)

4. **design-system/enforce-token-usage**
   - Requires all spacing/sizing use var(--md-sys-\*)
   - Auto-fixable: No

5. **design-system/no-new-css-files**
   - Blocks creation of new .css files
   - Encourages CSS-in-JS or inline styles

### Rule Configuration

All rules configured in:

- **eslint-rules/\*** (custom rule definitions)
- **eslint.config.mjs** (rule severity and options)
- **.husky/pre-commit** (runs on every commit)

---

## 🚀 Regression Prevention

### If Error Count Increases

**Step 1: Identify Changed Files**

```bash
$ npm run lint -- --format=json > lint-new.json
$ diff lint-baseline.json lint-new.json
```

**Step 2: Review Recent Commits**

```bash
$ git log --oneline -10
$ git diff HEAD~5..HEAD -- '*.tsx' | grep className
```

**Step 3: Revert Violating PRs**

```bash
$ git revert <commit-hash> --no-edit
$ npm run lint  # Verify error count restored
```

---

## 📊 Target Metrics (Stabilization Phase)

| Metric                   | Target     | Current | Status     |
| ------------------------ | ---------- | ------- | ---------- |
| **Error Count**          | ≤ 4,838    | 4,838   | ✅ Locked  |
| **New Violations**       | 0 per week | TBD     | 🔄 Monitor |
| **Pre-commit Pass Rate** | 100%       | TBD     | 🔄 Monitor |
| **PR Review Time**       | <5 min     | TBD     | 🔄 Monitor |

---

## 👥 Team Communication

### For Developers

**"As of January 12, 2026:**

- All NEW code MUST follow MD3 compliance standard
- Pre-commit hook will block non-compliant commits
- If you see ESLint errors, run `npm run lint -- --fix` before committing
- Questions? Contact: @design-system-team"

### For Reviewers

**Pull Request Checklist:**

```
- [ ] No new className attributes (except material-symbols-outlined)
- [ ] All colors use var(--md-sys-color-*)
- [ ] All spacing uses var(--md-sys-spacing-*)
- [ ] All border-radius uses var(--md-sys-shape-corner-*)
- [ ] Lint passes: npm run lint
```

### For Product Management

**Monthly Status Report:**

```
✅ Stabilization: Lock at 4,838 errors (45.8% improvement from 8,925 baseline)
📊 Monitoring: Weekly lint checks for regressions
🎯 Next Review: [Next Month Date] for Phase 7 decision
```

---

## 🔧 How Pre-Commit Hooks Work

### 1. Automatic Execution

When you run `git commit`:

```
1. Husky pre-commit hook activates
2. ESLint scans staged files (*.tsx, *.ts)
3. If violations found → Commit BLOCKED
4. If clean → Commit proceeds
```

### 2. Manual Verification

```bash
# Test the hook manually:
$ npm run lint

# Expected for clean code:
# ✔ 4,838 problems (4,836 errors, 2 warnings)
# ^ Same as or better than baseline
```

### 3. Bypass (Emergency Only)

```bash
# Force commit if absolutely necessary (use sparingly):
$ git commit --no-verify

# ⚠️ This skips ALL pre-commit checks - use with caution!
# Document why in commit message if used.
```

---

## 📅 Stabilization Milestones

| Date         | Milestone      | Action                                 |
| ------------ | -------------- | -------------------------------------- |
| Jan 12, 2026 | Phase 6 Start  | Lock 4,838 errors, activate monitoring |
| Jan 19, 2026 | Week 1 Review  | Check for regressions                  |
| Feb 12, 2026 | Month 1 Review | Analyze trends, plan Phase 7           |
| Q1 2026      | Quarter Review | Assess stabilization success           |

---

## ✅ Phase 6 Setup Checklist

- [x] Current error count documented: 4,838 errors
- [x] ESLint rules verified and configured
- [x] Pre-commit hooks active (husky configured)
- [x] Team communication ready
- [x] Monitoring strategy defined
- [x] Regression response plan documented

**Stabilization Mode: ACTIVE** ✨
