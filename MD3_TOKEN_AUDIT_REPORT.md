# MD3 Design Token Coverage and Usage Audit

**Generated:** 2026-03-03T19:55:48.715Z
**MD3 Gold Compliance:** Analysis Only (No Changes Made)

## 📊 Summary

- **Files Analyzed:** 486
- **Lines of Code:** 97.775
- **MD3 Tokens Used:** 5556
- **Semantic Tokens Used:** 39
- **Hardcoded Violations:** 2619
- **Semantic Adoption Rate:** 0.7%

## 📈 Token Usage by Category

| Category   | MD3 Used | Semantic Used | Total Usage | Semantic % |
| ---------- | -------- | ------------- | ----------- | ---------- |
| spacing    | 33       | 3             | 3824        | 0.2%       |
| color      | 81       | 19            | 3082        | 1.5%       |
| typography | 142      | 0             | 1351        | 0.0%       |
| motion     | 12       | 4             | 669         | 2.1%       |
| elevation  | 5        | 0             | 176         | 0.0%       |
| shape      | 10       | 0             | 661         | 0.0%       |
| zIndex     | 11       | 1             | 105         | 1.9%       |
| layout     | 33       | 2             | 512         | 0.8%       |

## 📦 Unused Defined Tokens

- `--md-sys-backdrop-light`
- `--md-sys-backdrop-medium`
- `--md-sys-backdrop-dark`
- `--md-sys-spacing-0-5`
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
- `--md-sys-layout-grid-min-card`
- `--md-sys-layout-grid-min-large`
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
- `--md-sys-border-width-accent`
- `--md-sys-border-width-thick`
- `--md-sys-special-viewport-height`
- `--md-sys-motion-duration-short2`
- `--md-sys-motion-duration-short4`
- `--md-sys-motion-spring-expressive-fast-spatial`
- `--md-sys-motion-spring-expressive-fast-spatial-duration`
- `--md-sys-motion-spring-expressive-default-spatial`
- `--md-sys-motion-spring-expressive-default-spatial-duration`
- `--md-sys-motion-spring-expressive-slow-spatial`
- `--md-sys-motion-spring-expressive-slow-spatial-duration`
- `--md-sys-motion-spring-expressive-fast-effects`
- `--md-sys-motion-spring-expressive-fast-effects-duration`
- `--md-sys-motion-spring-expressive-default-effects`
- `--md-sys-motion-spring-expressive-default-effects-duration`
- `--md-sys-motion-spring-expressive-slow-effects`
- `--md-sys-motion-spring-expressive-slow-effects-duration`
- `--md-sys-motion-spring-standard-fast-spatial`
- `--md-sys-motion-spring-standard-fast-spatial-duration`
- `--md-sys-motion-spring-standard-default-spatial`
- `--md-sys-motion-spring-standard-default-spatial-duration`
- `--md-sys-motion-spring-standard-slow-spatial`
- `--md-sys-motion-spring-standard-slow-spatial-duration`
- `--md-sys-elevation1`
- `--md-sys-elevation2`
- `--md-sys-elevation3`
- `--md-sys-state-opacity-disabled`
- `--md-sys-state-opacity-scrim`
- `--md-sys-state-opacity-tooltip`
- `--md-sys-state-opacity-icon-muted`
- `--md-sys-state-opacity-tint-hairline`
- `--md-sys-state-opacity-tint-thin`
- `--md-sys-state-opacity-tint-faint`
- `--md-sys-state-opacity-tint-subtle`
- `--md-sys-state-opacity-tint-moderate`
- `--md-sys-state-opacity-empty`
- `--md-sys-state-opacity-placeholder`
- `--md-sys-state-opacity-secondary`
- `--md-sys-state-opacity-supporting`
- `--md-sys-state-opacity-caption`
- `--md-sys-state-opacity-hover-overlay`
- `--md-sys-breakpoint-compact`
- `--md-sys-breakpoint-medium`
- `--md-sys-breakpoint-expanded`
- `--md-sys-tooltip-arrow-size`
- `--md-sys-layout-content-max-width`
- `--md-sys-breakpoint-sm`
- `--md-sys-breakpoint-xl`
- `--md-sys-chart-height-large`
- `--md-sys-chart-height-medium`

## 💡 Recommendations

### 1. Address hardcoded value violations [CRITICAL]

**Category:** MD3_COMPLIANCE
**Description:** 2619 hardcoded values found (px, rem, z-index, etc.)
**Impact:** Critical MD3 Gold compliance violations
**Effort:** HIGH

### 2. Increase semantic token adoption in spacing [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.2% of spacing usage uses semantic tokens
**Impact:** 3812 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 3. Increase semantic token adoption in color [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 1.5% of color usage uses semantic tokens
**Impact:** 2992 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 4. Increase semantic token adoption in typography [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of typography usage uses semantic tokens
**Impact:** 1351 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 5. Increase semantic token adoption in motion [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 2.1% of motion usage uses semantic tokens
**Impact:** 641 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 6. Increase semantic token adoption in elevation [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of elevation usage uses semantic tokens
**Impact:** 176 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 7. Increase semantic token adoption in shape [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.0% of shape usage uses semantic tokens
**Impact:** 661 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 8. Increase semantic token adoption in zIndex [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 1.9% of zIndex usage uses semantic tokens
**Impact:** 101 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 9. Increase semantic token adoption in layout [HIGH]

**Category:** SEMANTIC_ADOPTION
**Description:** Only 0.8% of layout usage uses semantic tokens
**Impact:** 504 direct MD3 tokens could be abstracted
**Effort:** MEDIUM

### 10. Consider adding semantic tokens for elevation [LOW]

**Category:** SEMANTIC_EXPANSION
**Description:** No semantic elevation tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 176 usages
**Effort:** MEDIUM

### 11. Consider adding semantic tokens for shape [LOW]

**Category:** SEMANTIC_EXPANSION
**Description:** No semantic shape tokens defined, all usage is direct MD3
**Impact:** Could improve consistency for 661 usages
**Effort:** MEDIUM
