# MD3 Design Token Coverage and Usage Audit

**Generated:** 2026-01-30T14:30:08.495Z
**MD3 Gold Compliance:** Analysis Only (No Changes Made)

## 📊 Summary

- **Files Analyzed:** 445
- **Lines of Code:** 92.838
- **MD3 Tokens Used:** 3257
- **Semantic Tokens Used:** 1428
- **Hardcoded Violations:** 2324
- **Semantic Adoption Rate:** 30.5%

## 📈 Token Usage by Category

| Category | MD3 Used | Semantic Used | Total Usage | Semantic % |
|----------|----------|---------------|-------------|------------|
| spacing | 30 | 5 | 4600 | 46.0% |
| color | 69 | 33 | 6046 | 65.8% |
| typography | 123 | 4 | 1602 | 55.2% |
| motion | 13 | 5 | 1012 | 62.1% |
| elevation | 5 | 0 | 157 | 0.0% |
| shape | 10 | 0 | 603 | 0.0% |
| zIndex | 12 | 4 | 124 | 32.3% |
| layout | 34 | 4 | 905 | 58.1% |

## 📦 Unused Defined Tokens

- `--md-sys-backdrop-light`
- `--md-sys-backdrop-medium`
- `--md-sys-backdrop-dark`
- `--md-sys-blur-small`
- `--md-sys-blur-medium`
- `--md-sys-blur-large`
- `--md-sys-blur-xl`
- `--md-sys-blur-2xl`
- `--md-sys-blur-20`
- `--md-sys-blur-16`
- `--md-sys-blur-25`
- `--md-sys-blur-30`
- `--md-sys-blur-40`
- `--md-sys-blur-48`
- `--md-sys-blur-120`
- `--md-sys-blur-150`
- `--md-sys-elevation-0`
- `--md-sys-elevation-1`
- `--md-sys-elevation-2`
- `--md-sys-elevation-3`
- `--md-sys-elevation-4`
- `--md-sys-elevation-5`
- `--md-sys-radius-0`
- `--md-sys-radius-1`
- `--md-sys-radius-2`
- `--md-sys-radius-3`
- `--md-sys-radius-4`
- `--md-sys-radius-5`
- `--md-sys-radius-6`
- `--md-sys-radius-7`
- `--md-sys-radius-full`
- `--md-sys-layout-grid-min`
- `--md-sys-layout-grid-min-wide`
- `--md-sys-layout-card-width`
- `--md-sys-layout-card-min-height`
- `--md-sys-layout-avatar-size`
- `--md-sys-layout-fab-size`
- `--md-sys-layout-button-min-width`
- `--md-sys-layout-popup-min-width`
- `--md-sys-layout-panel-max-width`
- `--md-sys-layout-dropzone-height`
- `--md-sys-layout-timetable-cell-min-height`
- `--md-sys-layout-workflow-card-min-width`
- `--md-sys-layout-120`
- `--md-sys-breakpoint-mobile`
- `--md-sys-breakpoint-tablet`
- `--md-sys-breakpoint-desktop`
- `--md-sys-breakpoint-large`
- `--md-sys-filter-grayscale-100`
- `--md-sys-border-width-none`
- `--md-sys-border-width-thin`
- `--md-sys-border-width-normal`
- `--md-sys-border-width-medium`
- `--md-sys-border-width-thick`
- `--md-sys-special-viewport-height`
- `--md-sys-elevation1`
- `--md-sys-elevation2`
- `--md-sys-elevation3`
- `--md-sys-state-opacity-disabled`
- `--md-sys-state-opacity-tooltip`
- `--md-sys-chart-height-large`
- `--md-sys-chart-height-medium`

## 💡 Recommendations

### 1. Address hardcoded value violations [CRITICAL]
**Category:** MD3_COMPLIANCE
**Description:** 2324 hardcoded values found (px, rem, z-index, etc.)
**Impact:** Critical MD3 Gold compliance violations
**Effort:** HIGH

### 2. Increase semantic token adoption in spacing [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 46.0% of spacing usage uses semantic tokens
**Impact:** 368 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 3. Increase semantic token adoption in elevation [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of elevation usage uses semantic tokens
**Impact:** 157 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 4. Increase semantic token adoption in shape [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of shape usage uses semantic tokens
**Impact:** 603 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 5. Increase semantic token adoption in zIndex [MEDIUM]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 32.3% of zIndex usage uses semantic tokens
**Impact:** 44 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 6. Consider adding semantic tokens for elevation [LOW]
**Category:** SEMANTIC_EXPANSION
**Description:** No semantic elevation tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 157 usages
**Effort:** MEDIUM

### 7. Consider adding semantic tokens for shape [LOW]
**Category:** SEMANTIC_EXPANSION
**Description:** No semantic shape tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 603 usages
**Effort:** MEDIUM
