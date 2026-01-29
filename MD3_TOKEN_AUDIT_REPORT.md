# MD3 Design Token Coverage and Usage Audit

**Generated:** 2026-01-29T12:46:57.533Z
**MD3 Gold Compliance:** Analysis Only (No Changes Made)

## 📊 Summary

- **Files Analyzed:** 434
- **Lines of Code:** 89.978
- **MD3 Tokens Used:** 4543
- **Semantic Tokens Used:** 26
- **Hardcoded Violations:** 2609
- **Semantic Adoption Rate:** 0.6%

## 📈 Token Usage by Category

| Category | MD3 Used | Semantic Used | Total Usage | Semantic % |
|----------|----------|---------------|-------------|------------|
| spacing | 30 | 3 | 3514 | 0.2% |
| color | 68 | 13 | 2617 | 1.0% |
| typography | 123 | 3 | 901 | 0.7% |
| motion | 11 | 3 | 338 | 1.8% |
| elevation | 5 | 0 | 151 | 0.0% |
| shape | 10 | 0 | 597 | 0.0% |
| zIndex | 17 | 3 | 29 | 20.7% |
| layout | 31 | 2 | 533 | 0.8% |

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

## 💡 Recommendations

### 1. Address hardcoded value violations [CRITICAL]
**Category:** MD3_COMPLIANCE
**Description:** 2609 hardcoded values found (px, rem, z-index, etc.)
**Impact:** Critical MD3 Gold compliance violations
**Effort:** HIGH

### 2. Increase semantic token adoption in spacing [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.2% of spacing usage uses semantic tokens
**Impact:** 3502 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 3. Increase semantic token adoption in color [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 1.0% of color usage uses semantic tokens
**Impact:** 2565 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 4. Increase semantic token adoption in typography [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.7% of typography usage uses semantic tokens
**Impact:** 889 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 5. Increase semantic token adoption in motion [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 1.8% of motion usage uses semantic tokens
**Impact:** 326 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 6. Increase semantic token adoption in elevation [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of elevation usage uses semantic tokens
**Impact:** 151 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 7. Increase semantic token adoption in shape [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of shape usage uses semantic tokens
**Impact:** 597 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 8. Increase semantic token adoption in layout [HIGH]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.8% of layout usage uses semantic tokens
**Impact:** 525 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 9. Increase semantic token adoption in zIndex [MEDIUM]
**Category:** SEMANTIC_ADOPTION
**Description:** Only 20.7% of zIndex usage uses semantic tokens
**Impact:** 17 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 10. Consider adding semantic tokens for elevation [LOW]
**Category:** SEMANTIC_EXPANSION
**Description:** No semantic elevation tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 151 usages
**Effort:** MEDIUM

### 11. Consider adding semantic tokens for shape [LOW]
**Category:** SEMANTIC_EXPANSION
**Description:** No semantic shape tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 597 usages
**Effort:** MEDIUM
