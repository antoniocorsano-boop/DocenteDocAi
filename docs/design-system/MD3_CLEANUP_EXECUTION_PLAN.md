# MD3 CLEANUP EXECUTION PLAN
**Generated**: January 28, 2026  
**Target**: DocenteDoc AI - Full MD3 Compliance  
**Contract**: MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md

---

## ✅ PHASE 0 — SECURITY LOCKDOWN

### Status: COMPLETE
- Anti-regression protections active
- Truth audit functional
- No action required

**Verification**:
```bash
# Check contract exists
ls MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
```

---

## 🔄 PHASE 1 — TOKEN REMEDIATION

### 1.1 Add Missing Border Tokens

**File**: `src/theme.css`  
**Action**: Add after line 159 (spacing tokens section)

```css
/* MD3 Border Width System */
--md-sys-border-width-none: 0px;
--md-sys-border-width-thin: 1px;
--md-sys-border-width-normal: 1px;
--md-sys-border-width-medium: 2px;
--md-sys-border-width-thick: 4px;
```

**Verification**:
```bash
grep "md-sys-border-width-thin" src/theme.css
# Expected output: --md-sys-border-width-thin: 1px;
```

---

### 1.2 Add Viewport Tokens

**File**: `src/theme.css`  
**Action**: Add after border tokens

```css
/* MD3 Viewport System */
--md-sys-viewport-height-full: 100vh;
--md-sys-viewport-width-full: 100vw;
--md-sys-viewport-height-screen: 100dvh; /* Dynamic viewport */
--md-sys-viewport-width-screen: 100dvw;
```

**Verification**:
```bash
grep "viewport-height-full" src/theme.css
# Expected: --md-sys-viewport-height-full: 100vh;
```

---

### 1.3 Add Grid/Fractional Tokens

**File**: `src/theme.css`  
**Action**: Add after viewport tokens

```css
/* MD3 Grid System */
--md-sys-grid-fr-1: 1fr;
--md-sys-grid-fr-2: 2fr;
--md-sys-grid-fr-3: 3fr;
--md-sys-grid-fr-4: 4fr;
--md-sys-grid-auto: auto;
--md-sys-grid-min-content: min-content;
--md-sys-grid-max-content: max-content;
```

**Verification**:
```bash
grep "md-sys-grid-fr-1" src/theme.css
# Expected: --md-sys-grid-fr-1: 1fr;
```

---

### 1.4 Add Margin/Auto Tokens

**File**: `src/theme.css`  
**Action**: Add after grid tokens

```css
/* MD3 Margin System */
--md-sys-margin-auto: auto;
--md-sys-margin-none: 0;
```

**Verification**:
```bash
grep "md-sys-margin-auto" src/theme.css
# Expected: --md-sys-margin-auto: auto;
```

---

### 1.5 Add Percentage Tokens

**File**: `src/theme.css`  
**Action**: Add after margin tokens

```css
/* MD3 Percentage System */
--md-sys-percent-full: 100%;
--md-sys-percent-half: 50%;
--md-sys-percent-third: 33.333%;
--md-sys-percent-quarter: 25%;
```

**Verification**:
```bash
grep "md-sys-percent-full" src/theme.css
# Expected: --md-sys-percent-full: 100%;
```

---

### Phase 1 Checklist

- [ ] Border tokens added
- [ ] Viewport tokens added
- [ ] Grid tokens added
- [ ] Margin tokens added
- [ ] Percentage tokens added
- [ ] No syntax errors in theme.css
- [ ] All tokens follow `--md-sys-*` naming convention

**Phase 1 Validation**:
```bash
npm run dev
# Check browser console - no CSS variable undefined errors
```

---

## 🔄 PHASE 2 — LAYOUT BASE LAYER

### 2.1 Freeze App.tsx Responsibility

**File**: `src/components/App.tsx`  
**Current Role**: Mounting, providers, modals  
**Action**: Ensure NO layout styles in App.tsx beyond component composition

**Verification**:
```bash
grep "style={{" src/components/App.tsx | wc -l
# Count should be minimal (only necessary inline MD3 token references)
```

**Warning**: ⚠️ App.tsx should delegate layout to AppLayout.md3.tsx

---

### 2.2 Centralize Layout in AppLayout.md3.tsx

**File**: `src/components/AppLayout.md3.tsx`  
**Action**: Review and ensure all layout uses MD3 tokens

**Check existing code**:
```tsx
// ✅ COMPLIANT
style={{ height: 'var(--md-sys-viewport-height-full)' }}

// ❌ NON-COMPLIANT
style={{ height: '100vh' }}
```

**Verification**:
```bash
grep -E "(px|vh|vw|rem|em|%)" src/components/AppLayout.md3.tsx
# Should return ZERO hardcoded values
```

---

### 2.3 Audit Critical Layout Properties

**Files to check**:
- `src/components/AppLayout.md3.tsx`
- `src/components/Header.tsx`
- `src/components/NavigationRail.tsx`

**Properties requiring MD3 tokens**:
- `height` → `var(--md-sys-viewport-height-full)` or `var(--md-sys-spacing-*)`
- `width` → `var(--md-sys-percent-full)` or `var(--md-sys-spacing-*)`
- `max-width` → `var(--md-sys-spacing-*)` 
- `grid-template-columns` → `var(--md-sys-grid-fr-*)`
- `padding` → `var(--md-sys-spacing-*)`
- `margin` → `var(--md-sys-spacing-*)` or `var(--md-sys-margin-auto)`

**Verification per file**:
```bash
# Check each file for hardcoded values
grep -n -E "\b[0-9]+(px|vh|vw|rem|em|%)\b" src/components/AppLayout.md3.tsx
# Expected: no matches
```

---

### Phase 2 Checklist

- [ ] App.tsx limited to composition only
- [ ] AppLayout.md3.tsx centralized
- [ ] All height values use MD3 tokens
- [ ] All width values use MD3 tokens
- [ ] All grid values use MD3 tokens
- [ ] All spacing uses --md-sys-spacing-*
- [ ] Safe-area insets handled (if mobile)
- [ ] Z-index references --z-* tokens

**Phase 2 Validation**:
```bash
npm run build
# Expected: Build succeeds, no CSS warnings
```

---

## 🔄 PHASE 3 — STRUCTURAL DIV ELIMINATION

### 3.1 Identify Structural DIVs

**Action**: Find all `<div>` with layout-critical inline styles

```bash
grep -rn "div style={{" src/components/App.tsx
```

**Target patterns**:
- `<div style={{ padding: ... }}>`
- `<div style={{ display: 'grid' }}>`
- `<div style={{ position: 'fixed' }}>`
- `<div style={{ background: ... }}>`

---

### 3.2 Replace DIVs with MD3 Components

**Mapping**:

| Current | MD3 Component | Token Usage |
|---------|---------------|-------------|
| `<div style={{ padding }}>` | `<M3Surface>` | Use surface variants |
| `<div style={{ display: 'grid' }}>` | `<LayoutGrid>` | MD3 grid system |
| `<div style={{ position: 'fixed' }}>` | `<Overlay>` or `<Portal>` | Z-index tokens |
| `<div style={{ display: 'flex' }}>` | `<FlexContainer>` | MD3 spacing |

**Example Fix**:

**Before** (App.tsx line 92):
```tsx
<div style={{ display: 'flex', flex: '1 1 auto', minHeight: 'var(--md-sys-spacing-0)' }}>
```

**After**:
```tsx
<FlexContainer 
  direction="row" 
  flex="1" 
  minHeight="none"
  background="surface"
>
```

**Action**: Create wrapper components if they don't exist

**File**: `src/components/ui/FlexContainer.tsx`
```tsx
import React from 'react';

interface FlexContainerProps {
  direction?: 'row' | 'column';
  flex?: string;
  minHeight?: 'none' | keyof typeof SPACING_MAP;
  background?: 'surface' | 'surface-container';
  children: React.ReactNode;
}

const SPACING_MAP = {
  none: 'var(--md-sys-spacing-0)',
};

export const FlexContainer: React.FC<FlexContainerProps> = ({
  direction = 'row',
  flex = '1 1 auto',
  minHeight = 'none',
  background = 'surface',
  children
}) => (
  <div style={{
    display: 'flex',
    flexDirection: direction,
    flex,
    minHeight: minHeight === 'none' ? SPACING_MAP.none : SPACING_MAP[minHeight],
    background: `var(--md-sys-color-${background})`
  }}>
    {children}
  </div>
);
```

**Verification**:
```bash
# Check no raw divs with inline styles remain
grep -c "div style={{" src/components/App.tsx
# Target: 0 or minimal (only for Z_INDEX references)
```

---

### 3.3 Audit All Components

**Files to process**:
```bash
find src/components -name "*.tsx" -exec grep -l "div style={{" {} \;
```

**For each file**:
1. Identify layout-critical divs
2. Replace with MD3 components
3. Verify token usage
4. Test rendering

**Warning**: ⚠️ Do NOT change semantic HTML (`<header>`, `<main>`, `<nav>`)

---

### Phase 3 Checklist

- [ ] Structural divs identified
- [ ] FlexContainer created (if needed)
- [ ] LayoutGrid created (if needed)
- [ ] All padding divs → M3Surface
- [ ] All grid divs → LayoutGrid
- [ ] All fixed divs → Portal/Overlay
- [ ] Visual regression test passed
- [ ] No layout breaks

**Phase 3 Validation**:
```bash
npm run dev
# Manually test: all views render correctly
```

---

## ✅ PHASE 4 — Z-INDEX CENTRALIZATION (COMPLETED)

### Status: ✅ COMPLETE (105 violations detected, anti-regression active)

---

### ✅ STEP 1: Token System Created

**File**: `src/design-system/tokens/md3-z-index.css`

```css
:root {
  --md-sys-z-base: 0;
  --md-sys-z-content: 100;
  --md-sys-z-overlay: 200;
  --md-sys-z-modal: 300;
  --md-sys-z-tooltip: 400;
  --md-sys-z-snackbar: 500;
}
```

**Import**: Added to `src/theme.css`

---

### ✅ STEP 2: Audit Eseguito

**Script**: `scripts/md3-zindex-audit.cjs`

**Risultati**:
- 📂 421 file scansionati
- 🚫 **105 VIOLAZIONI RILEVATE**
- 📄 28 file con z-index numerico

**Top Violazioni**:
1. `src/layout.css` → 25 violazioni
2. `src/modules.css` → 18 violazioni
3. `src/components/AssistantFab.tsx` → 6 violazioni
4. `src/design-system/zIndex.ts` → 9 violazioni
5. `src/nka/` → 5 violazioni

---

### ✅ STEP 3: ESLint Rule Creata

**File**: `eslint-rules/no-numeric-zindex.mjs`

**Configurazione**: `eslint.config.mjs`
```javascript
'custom/no-numeric-zindex': 'error'
```

**Blocca**:
- ❌ `zIndex: 1000`
- ❌ `z-index: 500`
- ❌ `Z_INDEX.modal`
- ✅ `zIndex: "var(--md-sys-z-modal)"` → OK

---

### ✅ STEP 4: Pre-Commit Hook Attivo

**File**: `.husky/pre-commit`

**Hook**:
```bash
node ./scripts/md3-zindex-audit.cjs
```

**Comportamento**:
- ✅ Clean → COMMIT OK
- ❌ Violations → **COMMIT BLOCKED**

---

### ✅ STEP 5: Test Anti-Regressione

**File**: `__tests__/m3-regression.test.ts`

**Suite**: `MD3 Z-INDEX GOVERNANCE — STEP 4 ANTI-REGRESSION`

**Test**:
- 6 test aggiunti
- Verifica token MD3 nel DOM
- Blocca z-index numerici
- Richiede `var(--md-sys-z-*)`

---

### 📊 METRICHE PHASE 4

| Metrica | Valore |
|---------|--------|
| File scansionati | 421 |
| Violazioni | 105 |
| File violati | 28 |
| Token creati | 6 |
| ESLint rules | 1 (ERROR) |
| Test | 6 |
| Pre-commit hook | ✅ Attivo |

---

### 🔒 PROTEZIONI ATTIVE

1. ✅ Audit pre-commit (blocca commit)
2. ✅ ESLint ERROR real-time
3. ✅ Vitest test suite
4. ✅ Token system centralizzato

---

### 📋 TODO - REMEDIATION (105 violations)

**File da migrare**:
1. `src/modules.css` (18 violations)
2. `src/layout.css` (25 violations)
3. `src/components/AssistantFab.tsx` (6 violations)
4. **DEPRECARE** `src/design-system/zIndex.ts` (9 violations)
5. `src/nka/` (5 violations)

**Comando**:
```bash
npm run md3:zindex:audit
```

---

### ⚠️ BREAKING CHANGES

**Deprecare**:
- ❌ `src/design-system/zIndex.ts`
- ❌ `--z-nav`, `--z-modal`, `--z-modal-backdrop`

**Usare solo**:
- ✅ `--md-sys-z-base`
- ✅ `--md-sys-z-content`
- ✅ `--md-sys-z-overlay`
- ✅ `--md-sys-z-modal`
- ✅ `--md-sys-z-tooltip`
- ✅ `--md-sys-z-snackbar`

---

### Phase 4 Checklist

- [x] z-index.css created
- [x] All z-index tokens defined
- [x] Tokens imported in theme.css
- [x] Audit script created (md3-zindex-audit.cjs)
- [x] 105 violations detected
- [x] ESLint rule configured (ERROR)
- [x] Pre-commit hook active
- [x] Test suite added (6 tests)
- [x] NPM command added (md3:zindex:audit)
- [ ] Remediation 105 violations (NEXT)

**Phase 4 Validation**:
```bash
npm run build
# Check: No TypeScript errors
# Test: Open modal, FAB, tooltip - verify stacking order
```

---

## 🔄 PHASE 5 — RENDERING SAFETY CHECK

### 5.1 Browser DevTools Audit

**Action**: Open browser DevTools

**Steps**:
1. Open http://localhost:5173/
2. Press F12
3. Go to Console tab
4. Filter for "CSS"

**Expected**: ✅ Zero CSS warnings  
**If warnings exist**: Document each, trace to source, fix with MD3 token

**Verification**:
```
Console → No messages matching:
- "CSS variable ... is undefined"
- "Invalid property value"
- "Unknown property"
```

---

### 5.2 Computed Styles Validation

**Action**: Check computed CSS values

**Steps**:
1. DevTools → Elements tab
2. Select root `<div id="root">`
3. Go to Computed tab
4. Search for each MD3 token variable

**Check these properties**:
- `--md-sys-spacing-4` → Should resolve to `16px`
- `--md-sys-color-surface` → Should resolve to hex/rgb
- `--md-sys-border-width-thin` → Should resolve to `1px`
- `--md-sys-viewport-height-full` → Should resolve to `100vh`

**Expected**: All tokens have computed values (not empty)

**Verification script**:
```js
// Paste in browser console
const root = document.documentElement;
const tokens = [
  '--md-sys-spacing-4',
  '--md-sys-color-surface',
  '--md-sys-border-width-thin',
  '--md-sys-viewport-height-full',
  '--md-sys-z-fab'
];
tokens.forEach(token => {
  const value = getComputedStyle(root).getPropertyValue(token);
  console.log(`${token}: ${value || '❌ UNDEFINED'}`);
});
```

---

### 5.3 Responsive Layout Test

**Action**: Test viewport resize stability

**Steps**:
1. Open app in browser
2. DevTools → Toggle device toolbar (Ctrl+Shift+M)
3. Test these breakpoints:
   - 320px (mobile)
   - 768px (tablet)
   - 1024px (desktop)
   - 1920px (large desktop)

**Expected behavior**:
- ✅ No layout breaks
- ✅ No horizontal scroll
- ✅ Content remains readable
- ✅ Navigation remains accessible

**Verification checklist**:
- [ ] Header stays visible at all sizes
- [ ] Navigation rail adapts or hides
- [ ] Content area scrolls properly
- [ ] FAB remains accessible
- [ ] Modals center correctly

---

### 5.4 Missing Token Detection

**Action**: Scan for undefined CSS variables

**Terminal command**:
```bash
# Check for hardcoded values that should be tokens
grep -rn -E "\b[0-9]+(px|vh|vw|rem|em)\b" src/components/*.tsx | grep -v "node_modules"
```

**Expected**: Zero matches (all values should use var())

**If matches found**:
1. Document file and line number
2. Identify appropriate MD3 token
3. Replace hardcoded value
4. Verify visually

**Auto-fix template**:
```bash
# For each match, replace:
# Before: padding: "16px"
# After:  padding: "var(--md-sys-spacing-4)"
```

---

### 5.5 Build Verification

**Action**: Full production build test

```bash
npm run build
```

**Expected output**:
```
✓ built in XXXms
✓ XX modules transformed
```

**Check for warnings**:
- ❌ "Unused CSS variable"
- ❌ "Invalid CSS value"
- ❌ "Missing dependency"

**Verification**:
```bash
npm run build 2>&1 | grep -i "warn\|error"
# Expected: No output (or only safe warnings)
```

---

### Phase 5 Checklist

- [ ] Browser console clean (no CSS errors)
- [ ] All tokens resolve to values
- [ ] Layout stable at all breakpoints
- [ ] No horizontal scroll
- [ ] No undefined CSS variables
- [ ] Production build succeeds
- [ ] No build warnings
- [ ] Visual regression test passed

**Phase 5 Validation**:
```bash
# Full validation sequence
npm run build && npm run dev
# Manual: Test all views, resize browser, check console
```

---

## 🔄 PHASE 6 — FREEZE & DOCUMENTATION

### 6.1 Create Governance Document

**File**: `docs/md3-governance.md` (create)

```markdown
# MD3 Governance - Non-Negotiable Rules

## Token Usage
**MANDATORY**: All layout, color, spacing MUST use MD3 tokens.

### Allowed
✅ `var(--md-sys-spacing-4)`
✅ `var(--md-sys-color-surface)`
✅ `var(--md-sys-border-width-thin)`

### FORBIDDEN
❌ `padding: "16px"`
❌ `color: "#ffffff"`
❌ `border: "1px solid gray"`
❌ Any hardcoded numeric value

## Required Tokens

### Spacing
- `--md-sys-spacing-0` through `--md-sys-spacing-20`
- `--md-sys-margin-auto`

### Colors
- `--md-sys-color-surface`
- `--md-sys-color-primary`
- `--md-sys-color-on-surface`
- (All MD3 color tokens)

### Border
- `--md-sys-border-width-thin`
- `--md-sys-border-width-normal`

### Viewport
- `--md-sys-viewport-height-full`
- `--md-sys-viewport-width-full`

### Grid
- `--md-sys-grid-fr-1` through `--md-sys-grid-fr-4`

### Z-Index
- `--md-sys-z-*` (centralized in z-index.css)

## Component Rules

### NEVER
- Do NOT use `<div>` with layout-critical inline styles
- Do NOT introduce custom CSS classes for layout
- Do NOT use `className` for spacing
- Do NOT hardcode colors, spacing, or dimensions

### ALWAYS
- Use MD3 Surface components
- Reference tokens via `var()`
- Centralize layout in AppLayout.md3.tsx
- Follow contract: MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md

## Exceptions
**ZERO exceptions allowed.**

Every violation is a blocking bug.

## Enforcement
1. Pre-commit hook: Scan for hardcoded values
2. CI/CD: Build fails on token violations
3. Code review: Reject any non-MD3 code
```

**Verification**:
```bash
cat docs/md3-governance.md | grep "FORBIDDEN"
# Should display forbidden patterns
```

---

### 6.2 Update Contract Reference

**File**: `MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md`  
**Action**: Add reference to execution plan

**Add at bottom**:
```markdown
## Execution Plan
Detailed implementation steps: `MD3_CLEANUP_EXECUTION_PLAN.md`
Governance rules: `docs/md3-governance.md`
```

**Verification**:
```bash
grep "MD3_CLEANUP_EXECUTION_PLAN" MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
```

---

### 6.3 Create Validation Script

**File**: `scripts/validate-md3.sh` (create)

```bash
#!/bin/bash
# MD3 Compliance Validator

echo "🔍 MD3 Compliance Check"

# Check for hardcoded values
echo "Scanning for hardcoded values..."
VIOLATIONS=$(grep -rn -E "\b[0-9]+(px|vh|vw|rem|em)\b" src/components/*.tsx | grep -v "node_modules" | wc -l)

if [ $VIOLATIONS -gt 0 ]; then
  echo "❌ Found $VIOLATIONS hardcoded values"
  grep -rn -E "\b[0-9]+(px|vh|vw|rem|em)\b" src/components/*.tsx | grep -v "node_modules"
  exit 1
fi

# Check for required tokens
echo "Checking required tokens..."
REQUIRED_TOKENS=(
  "md-sys-spacing-4"
  "md-sys-color-surface"
  "md-sys-border-width-thin"
  "md-sys-viewport-height-full"
)

for token in "${REQUIRED_TOKENS[@]}"; do
  if ! grep -q "$token" src/theme.css; then
    echo "❌ Missing token: $token"
    exit 1
  fi
done

echo "✅ MD3 Compliance: PASS"
exit 0
```

**Make executable**:
```bash
chmod +x scripts/validate-md3.sh
```

**Verification**:
```bash
./scripts/validate-md3.sh
# Expected: ✅ MD3 Compliance: PASS
```

---

### 6.4 Add Pre-Commit Hook

**File**: `.husky/pre-commit` (update or create)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run MD3 validation
npm run validate:md3 || exit 1
```

**File**: `package.json` (add script)

```json
{
  "scripts": {
    "validate:md3": "bash scripts/validate-md3.sh"
  }
}
```

**Verification**:
```bash
npm run validate:md3
# Expected: ✅ MD3 Compliance: PASS
```

---

### Phase 6 Checklist

- [ ] docs/md3-governance.md created
- [ ] All rules documented
- [ ] Required tokens listed
- [ ] Forbidden patterns listed
- [ ] Contract updated with references
- [ ] Validation script created
- [ ] Pre-commit hook added
- [ ] Package.json script added

**Phase 6 Validation**:
```bash
# Test validation
npm run validate:md3

# Test pre-commit
git add .
git commit -m "test: MD3 validation"
# Should run validation automatically
```

---

## FINAL VALIDATION CHECKLIST

### Code Compliance
- [ ] theme.css contains all required tokens
- [ ] No hardcoded px/vh/vw/rem/em in components
- [ ] All spacing uses --md-sys-spacing-*
- [ ] All colors use --md-sys-color-*
- [ ] All borders use --md-sys-border-*
- [ ] All z-index use --md-sys-z-*
- [ ] App.tsx limited to composition
- [ ] AppLayout.md3.tsx centralized layout
- [ ] No structural divs with inline styles
- [ ] TypeScript builds without errors

### Rendering Validation
- [ ] Browser console clean (no CSS errors)
- [ ] All CSS variables resolve
- [ ] Layout stable at all breakpoints
- [ ] No horizontal scroll
- [ ] Modals layer correctly
- [ ] FAB positioned correctly
- [ ] Navigation accessible at all sizes

### Documentation
- [ ] docs/md3-governance.md exists
- [ ] Contract updated
- [ ] Validation script works
- [ ] Pre-commit hook active

### Testing
- [ ] `npm run build` succeeds
- [ ] `npm run dev` works
- [ ] `npm run validate:md3` passes
- [ ] Visual regression test passed
- [ ] All routes render correctly

### Governance
- [ ] Zero hardcoded values remain
- [ ] Zero className for spacing
- [ ] Zero custom layout CSS
- [ ] Zero exceptions granted
- [ ] Contract followed 100%

---

## EXECUTION SUMMARY

**Total Phases**: 6  
**Status**: Ready for execution  

**Estimated Time**:
- Phase 1: 30 minutes
- Phase 2: 1 hour
- Phase 3: 2 hours
- Phase 4: 1 hour
- Phase 5: 1 hour
- Phase 6: 30 minutes

**Total**: ~6 hours

**Blockers**: None  
**Dependencies**: MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md

---

## NEXT STEPS

1. Execute Phase 1 (Token Remediation)
2. Validate Phase 1
3. Proceed to Phase 2
4. Continue sequentially through Phase 6
5. Run final validation checklist
6. Document completion

**Critical**: Do NOT skip phases. Each phase builds on previous.

---

**END OF EXECUTION PLAN**
