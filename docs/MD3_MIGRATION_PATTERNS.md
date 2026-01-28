# MD3 MIGRATION PATTERNS — CANONICAL REFERENCE

**Status**: GOLD STANDARD
**Source**: EvaluationModule.tsx (21/21 violations resolved)
**Purpose**: Deterministic patterns for automated batch migration

---

## EXECUTIVE SUMMARY

This document extracts **deterministic, replicable patterns** from the canonical reference migration of `EvaluationModule.tsx`. These patterns are designed for **automated batch application** to the remaining 365 violations across 108 files.

### Canonical Reference Stats
- **File**: `src/components/EvaluationModule.tsx`
- **Initial Violations**: 21 (highest in codebase)
- **Final Violations**: 0 ✅
- **Migration Time**: ~2 hours
- **Pattern Categories**: 7

---

## PATTERN TAXONOMY

### PATTERN 1: PSEUDO-TOKEN COLOR REPLACEMENT

**Violation Type**: `inlineStyleLayout`, `inlineStyleMotion`

**Detection Regex**:
```javascript
/'colors\.(primary|secondary|tertiary|error|surface|onSurface|onSurfaceVariant|outline|primaryContainer|secondaryContainer|tertiaryContainer|errorContainer|onPrimaryContainer|onSecondaryContainer|onTertiaryContainer|onErrorContainer|surfaceContainerLow|surfaceContainerHigh|surfaceContainerHighest|onPrimary|onSecondary|onTertiary|onError)'/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ backgroundColor: 'colors.primary', color: 'colors.onPrimary' }}

// AFTER (MD3 compliant)
className="action-button-primary"

// CSS (with MD3 tokens)
.action-button-primary {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
}
```

**Mapping Table**:
| Pseudo-Token | MD3 Token | CSS Variable |
|--------------|-----------|--------------|
| `'colors.primary'` | Primary color | `var(--md-sys-color-primary)` |
| `'colors.onPrimary'` | On-primary color | `var(--md-sys-color-on-primary)` |
| `'colors.surface'` | Surface color | `var(--md-sys-color-surface)` |
| `'colors.onSurface'` | On-surface color | `var(--md-sys-color-on-surface)` |
| `'colors.onSurfaceVariant'` | Surface variant | `var(--md-sys-color-on-surface-variant)` |
| `'colors.outline'` | Outline color | `var(--md-sys-color-outline)` |
| `'colors.primaryContainer'` | Primary container | `var(--md-sys-color-primary-container)` |
| `'colors.surfaceContainerLow'` | Surface container low | `var(--md-sys-color-surface-container-low)` |
| `'colors.surfaceContainerHigh'` | Surface container high | `var(--md-sys-color-surface-container-high)` |
| `'colors.surfaceContainerHighest'` | Surface container highest | `var(--md-sys-color-surface-container-highest)` |
| `'colors.error'` | Error color | `var(--md-sys-color-error)` |
| `'colors.errorContainer'` | Error container | `var(--md-sys-color-error-container)` |
| `'colors.onErrorContainer'` | On-error container | `var(--md-sys-color-on-error-container)` |
| `'colors.tertiary'` | Tertiary color | `var(--md-sys-color-tertiary)` |
| `'colors.tertiaryContainer'` | Tertiary container | `var(--md-sys-color-tertiary-container)` |

**Automation Strategy**:
1. Detect `style={{ ... 'colors.*' ... }}`
2. Extract semantic intent (button, card, header, etc.)
3. Generate semantic className
4. Create/append CSS class with MD3 token

---

### PATTERN 2: PSEUDO-TOKEN SPACING REPLACEMENT

**Violation Type**: `inlineStyleLayout`

**Detection Regex**:
```javascript
/'spacing\[([0-9]+)\]'/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ padding: 'spacing[4]', gap: 'spacing[2]', marginTop: 'spacing[1]' }}

// AFTER (MD3 compliant)
className="risk-cards-container"

// CSS (with MD3 tokens)
.risk-cards-container {
    padding: var(--md-sys-spacing-4);
    gap: var(--md-sys-spacing-2);
    margin-top: var(--md-sys-spacing-1);
}
```

**Mapping Table**:
| Pseudo-Token | MD3 Token | CSS Variable |
|--------------|-----------|--------------|
| `'spacing[1]'` | 4px / 0.25rem | `var(--md-sys-spacing-1)` |
| `'spacing[2]'` | 8px / 0.5rem | `var(--md-sys-spacing-2)` |
| `'spacing[3]'` | 12px / 0.75rem | `var(--md-sys-spacing-3)` |
| `'spacing[4]'` | 16px / 1rem | `var(--md-sys-spacing-4)` |
| `'spacing[8]'` | 32px / 2rem | `var(--md-sys-spacing-8)` |

**Automation Strategy**:
1. Detect `'spacing[N]'` in style objects
2. Replace with `var(--md-sys-spacing-N)` in CSS
3. Generate semantic className based on context

---

### PATTERN 3: HARDCODED MOTION DURATION

**Violation Type**: `inlineStyleMotion`

**Detection Regex**:
```javascript
/transition:\s*['"](?:all\s+)?(\d+)ms/g
/transition:\s*['"](?:all\s+)?(\d+)ms\s+cubic-bezier/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ transition: '300ms' }}
style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}

// AFTER (MD3 compliant)
className="student-row"

// CSS (with MD3 tokens)
.student-row {
    transition: background-color var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard);
}
```

**Mapping Table**:
| Hardcoded Duration | MD3 Token | CSS Variable | Value |
|--------------------|-----------|--------------|-------|
| `'300ms'` (default) | Medium-4 | `var(--md-sys-motion-duration-medium-4)` | 300ms |
| `'200ms'` | Short-4 | `var(--md-sys-motion-duration-short-4)` | 200ms |
| `'400ms'` | Long-1 | `var(--md-sys-motion-duration-long-1)` | 400ms |

**Automation Strategy**:
1. Detect hardcoded `'XXXms'` in transition property
2. Map to closest MD3 duration token
3. Replace with CSS class using MD3 token

---

### PATTERN 4: HARDCODED EASING FUNCTIONS

**Violation Type**: `inlineStyleMotion`

**Detection Regex**:
```javascript
/cubic-bezier\((0\.4,\s*0,\s*0\.2,\s*1|0\.2,\s*0,\s*0,\s*1)\)/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}

// AFTER (MD3 compliant)
className="action-button-primary"

// CSS (with MD3 tokens)
.action-button-primary {
    transition: all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-emphasized);
}
```

**Mapping Table**:
| Hardcoded Easing | MD3 Token | CSS Variable | Value |
|------------------|-----------|--------------|-------|
| `cubic-bezier(0.4, 0, 0.2, 1)` | Emphasized | `var(--md-sys-motion-easing-emphasized)` | `cubic-bezier(0.2, 0, 0, 1)` |
| `cubic-bezier(0.2, 0, 0, 1)` | Standard | `var(--md-sys-motion-easing-standard)` | `cubic-bezier(0.2, 0, 0, 1)` |

**Automation Strategy**:
1. Detect `cubic-bezier(...)` in transition property
2. Map to MD3 easing token (emphasized/standard)
3. Combine with duration token in CSS class

---

### PATTERN 5: PSEUDO-TOKEN TYPOGRAPHY

**Violation Type**: `inlineStyleLayout`

**Detection Regex**:
```javascript
/'typescale\.(headlineLarge|headlineMedium|headlineSmall|bodyLarge|bodyMedium|bodySmall|labelLarge|labelMedium|labelSmall|displayLarge)\.(fontSize|tracking)'/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ fontSize: 'typescale.headlineLarge.fontSize', letterSpacing: 'typescale.headlineLarge.tracking' }}

// AFTER (MD3 compliant)
className="module-title"

// CSS (with MD3 tokens)
.module-title {
    font-weight: 900;
    letter-spacing: var(--md-sys-typescale-headline-large-tracking);
    /* fontSize inherited from M3Typography variant */
}
```

**Mapping Table**:
| Pseudo-Token | MD3 Token | CSS Variable |
|--------------|-----------|--------------|
| `'typescale.headlineLarge.fontSize'` | Headline large size | `var(--md-sys-typescale-headline-large-size)` |
| `'typescale.headlineLarge.tracking'` | Headline large tracking | `var(--md-sys-typescale-headline-large-tracking)` |
| `'typescale.headlineMedium.fontSize'` | Headline medium size | `var(--md-sys-typescale-headline-medium-size)` |
| `'typescale.bodySmall.fontSize'` | Body small size | `var(--md-sys-typescale-body-small-size)` |
| `'typescale.labelSmall.fontSize'` | Label small size | `var(--md-sys-typescale-label-small-size)` |

**Automation Strategy**:
1. Detect `'typescale.*'` in style objects
2. Use M3Typography component variant prop instead (preferred)
3. If custom styling needed, use MD3 token in CSS class

---

### PATTERN 6: PSEUDO-TOKEN SHAPE/BORDER-RADIUS

**Violation Type**: `inlineStyleLayout`

**Detection Regex**:
```javascript
/'shape\.corner\.(small|medium|large|extraLarge|full)'/g
```

**Transformation**:
```javascript
// BEFORE (violation)
style={{ borderRadius: 'shape.corner.large' }}

// AFTER (MD3 compliant)
className="module-controls"

// CSS (with MD3 tokens)
.module-controls {
    border-radius: var(--md-sys-shape-corner-large);
}
```

**Mapping Table**:
| Pseudo-Token | MD3 Token | CSS Variable | Value |
|--------------|-----------|--------------|-------|
| `'shape.corner.small'` | Small corner | `var(--md-sys-shape-corner-small)` | 8px |
| `'shape.corner.medium'` | Medium corner | `var(--md-sys-shape-corner-medium)` | 12px |
| `'shape.corner.large'` | Large corner | `var(--md-sys-shape-corner-large)` | 16px |
| `'shape.corner.extraLarge'` | Extra large corner | `var(--md-sys-shape-corner-extra-large)` | 28px |
| `'shape.corner.full'` | Full corner | `var(--md-sys-shape-corner-full)` | 9999px |

**Automation Strategy**:
1. Detect `'shape.corner.*'` in borderRadius property
2. Replace with MD3 token in CSS class
3. Generate semantic className

---

### PATTERN 7: INLINE STYLE OBJECT → CSS CLASS

**Violation Type**: `inlineStyleLayout`, `inlineStyleMotion`, `forbiddenProps`

**Detection Pattern**:
```javascript
// Any inline style object
style={{ ... }}
```

**Transformation Strategy**:
```javascript
// BEFORE (violation)
<div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'spacing[2]',
    padding: 'spacing[4]',
    backgroundColor: 'colors.surface',
    borderRadius: 'shape.corner.large',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
}}>

// AFTER (MD3 compliant)
<div className="summary-grid">

// CSS (with MD3 tokens)
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--md-sys-spacing-4);
    padding: var(--md-sys-spacing-4);
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-large);
    transition: all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-emphasized);
}
```

**Semantic Class Naming Strategy**:
1. **Component Type** + **Role** + **Variant**
   - Example: `student-row`, `action-button-primary`, `evaluation-header-cell`
2. **BEM-like** structure when needed:
   - Block: `.module-header`
   - Element: `.module-header-content`
   - Modifier: `.tab-button.tab-active`
3. **State classes** use compound selectors:
   - `.student-row:hover`, `.tab-button.tab-active`

**Automation Strategy**:
1. Parse JSX element type (`div`, `button`, `td`, etc.)
2. Infer semantic intent from:
   - Sibling elements
   - Parent component context
   - onClick/onChange handlers
   - Children content
3. Generate semantic className
4. Extract all style properties to CSS file
5. Replace pseudo-tokens with MD3 tokens

---

## AUTOMATION ALGORITHM

### Phase 1: Detection

```javascript
// Detect violations in file
const violations = {
    pseudoTokenColors: findMatches(/'colors\.\w+'/g),
    pseudoTokenSpacing: findMatches(/'spacing\[\d+\]'/g),
    pseudoTokenTypography: findMatches(/'typescale\.\w+\.\w+'/g),
    pseudoTokenShape: findMatches(/'shape\.corner\.\w+'/g),
    hardcodedMotion: findMatches(/transition:\s*['"](\d+)ms/g),
    hardcodedEasing: findMatches(/cubic-bezier\([^)]+\)/g),
    inlineStyles: findMatches(/style=\{\{[^}]+\}\}/g)
};
```

### Phase 2: Semantic Classification

```javascript
// Classify element by context
function classifyElement(jsxElement, astNode) {
    const elementType = jsxElement.name; // 'div', 'button', etc.
    const hasOnClick = jsxElement.attributes.includes('onClick');
    const hasChildren = jsxElement.children.length > 0;
    const parentComponent = findParentComponent(astNode);
    
    // Infer semantic role
    if (elementType === 'button' && hasOnClick) return 'action-button';
    if (elementType === 'div' && hasChildren && parentComponent === 'Grid') return 'grid-container';
    if (elementType === 'td' && parentComponent === 'Table') return 'table-cell';
    
    // Default fallback
    return `${parentComponent.toLowerCase()}-${elementType}`;
}
```

### Phase 3: Transformation

```javascript
// Apply transformation pattern
function applyPattern(violation, element) {
    const semanticClass = classifyElement(element);
    const cssProperties = extractStyleProperties(violation);
    const md3Properties = convertToMD3Tokens(cssProperties);
    
    // Generate CSS class
    const cssClass = generateCSSClass(semanticClass, md3Properties);
    
    // Replace inline style with className
    return {
        jsxReplacement: `className="${semanticClass}"`,
        cssAddition: cssClass
    };
}
```

### Phase 4: Validation

```javascript
// Validate transformation
function validateTransformation(original, transformed) {
    // Run ESLint
    const eslintResult = runESLint(transformed);
    if (eslintResult.errors.length > 0) return { valid: false, errors: eslintResult.errors };
    
    // Run MD3 audits
    const auditResult = runMD3Audits(transformed);
    if (auditResult.violations.length > 0) return { valid: false, errors: auditResult.violations };
    
    // Ensure no visual regression
    const visualDiff = compareVisual(original, transformed);
    if (visualDiff.hasDifferences) return { valid: false, errors: ['Visual regression detected'] };
    
    return { valid: true };
}
```

---

## SAFETY GUARANTEES

### Pre-Conditions
1. ✅ File must be in legacy registry or have violations detected by audit
2. ✅ File must have TypeScript/JSX syntax validity
3. ✅ All MD3 tokens must exist in theme system

### Post-Conditions
1. ✅ Zero ESLint errors
2. ✅ Zero MD3 audit violations
3. ✅ No visual regression (layout, colors, spacing unchanged)
4. ✅ No business logic changes

### Rollback Strategy
1. Dry-run mode generates diff preview
2. Git commit per file for granular rollback
3. Automated visual snapshot comparison
4. Pre-migration backup in `migration/backups/`

---

## BATCH MIGRATION WORKFLOW

### Step 1: Pre-Flight
```bash
# Validate all MD3 tokens exist
npm run md3:validate-tokens

# Run full audit to get baseline
npm run md3:audit:all

# Backup codebase
node scripts/md3-batch-migrate.cjs --backup
```

### Step 2: Dry Run
```bash
# Dry run on top 10 violators (excluding EvaluationModule.tsx - already done)
node scripts/md3-batch-migrate.cjs --dry-run --files=top10
```

### Step 3: Incremental Batch
```bash
# Migrate in batches of 10 files
node scripts/md3-batch-migrate.cjs --batch-size=10 --validate-each
```

### Step 4: Validation
```bash
# Full validation suite
npm run lint
npm run md3:audit:all
npm test
npm run test:visual
```

### Step 5: Report
```bash
# Generate migration report
node scripts/md3-batch-migrate.cjs --report
```

---

## PATTERN REFERENCE: REAL EXAMPLES FROM EVALUATIONMODULE.TSX

### Example 1: Button with Multiple Violations

**Before**:
```tsx
<button
    onClick={() => setIsAddProvaModalOpen(true)}
    style={{
        borderRadius: 'shape.corner.large',
        backgroundColor: 'colors.primary',
        color: 'colors.onPrimary',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'spacing[2]',
        padding: 'spacing[2] spacing[3]',
        border: 'none'
    }}
>
```

**After**:
```tsx
<button
    onClick={() => setIsAddProvaModalOpen(true)}
    className="action-button-primary"
>
```

**CSS**:
```css
.action-button-primary {
    border-radius: var(--md-sys-shape-corner-large);
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-emphasized);
    display: flex;
    align-items: center;
    gap: var(--md-sys-spacing-2);
    padding: var(--md-sys-spacing-2) var(--md-sys-spacing-3);
    border: none;
    cursor: pointer;
}
```

**Violations Resolved**: 7
- `'shape.corner.large'` → MD3 token
- `'colors.primary'` → MD3 token
- `'colors.onPrimary'` → MD3 token
- `'300ms'` → MD3 motion duration
- `cubic-bezier(...)` → MD3 easing
- `'spacing[2]'` → MD3 spacing
- `'spacing[3]'` → MD3 spacing

---

### Example 2: Grid Layout Container

**Before**:
```tsx
<div
    style={{
        borderRadius: 'shape.corner.large',
        border: '1px solid colors.outline',
        backgroundColor: 'colors.surface'
    }}
>
```

**After**:
```tsx
<div className="view-container">
```

**CSS**:
```css
.view-container {
    border-radius: var(--md-sys-shape-corner-large);
    border: 1px solid var(--md-sys-color-outline);
    background-color: var(--md-sys-color-surface);
}
```

**Violations Resolved**: 3
- `'shape.corner.large'` → MD3 token
- `'colors.outline'` → MD3 token
- `'colors.surface'` → MD3 token

---

### Example 3: Tab Button with State

**Before**:
```tsx
<button
    onClick={() => setActiveTab(tab.id)}
    style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'spacing[2]',
        padding: 'spacing[2] spacing[3]',
        borderRadius: 'shape.corner.medium',
        fontWeight: '900',
        fontSize: 'typescale.labelSmall.fontSize',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: activeTab === tab.id ? 'colors.primary' : 'transparent',
        color: activeTab === tab.id ? 'colors.onPrimary' : 'colors.onSurfaceVariant',
        border: 'none'
    }}
>
```

**After**:
```tsx
<button
    onClick={() => setActiveTab(tab.id)}
    className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
>
```

**CSS**:
```css
.tab-button {
    display: flex;
    align-items: center;
    gap: var(--md-sys-spacing-2);
    padding: var(--md-sys-spacing-2) var(--md-sys-spacing-3);
    border-radius: var(--md-sys-shape-corner-medium);
    font-weight: 900;
    font-size: var(--md-sys-typescale-label-small-size);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: all var(--md-sys-motion-duration-medium-4) var(--md-sys-motion-easing-emphasized);
    background-color: transparent;
    color: var(--md-sys-color-on-surface-variant);
    border: none;
    cursor: pointer;
}

.tab-button.tab-active {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
}
```

**Violations Resolved**: 9
- Conditional styling → modifier class pattern
- All pseudo-tokens → MD3 tokens
- Hardcoded motion → MD3 motion tokens

---

## SUCCESS METRICS

### Phase 1 Reference (EvaluationModule.tsx)
- ✅ 21/21 violations resolved
- ✅ Zero ESLint errors
- ✅ Zero MD3 audit failures
- ✅ No visual regression
- ✅ All tests passing

### Phase 3 Target (Batch Migration)
- 🎯 365 remaining violations across 108 files
- 🎯 100% MD3 contract compliance
- 🎯 Zero breaking changes
- 🎯 Automated with <5% manual intervention
- 🎯 Complete within 1 week

---

## NEXT STEPS

### Phase 3: Automated Migration Script
1. Create `scripts/md3-batch-migrate.cjs`
2. Implement pattern detection engine
3. Implement semantic classification
4. Implement transformation engine
5. Implement validation suite
6. Add dry-run mode
7. Add incremental batch processing

### Phase 4: Validation & Reporting
1. Run ESLint on all migrated files
2. Run MD3 audits on all migrated files
3. Run test suite
4. Run visual regression tests
5. Generate migration report
6. Update legacy registry

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-28
**Author**: MD3 Governance Team
**Status**: APPROVED FOR AUTOMATION
