# MD3 GOLD MANIFESTO

## PREAMBLE

This manifesto establishes **Material Design 3 (MD3) Gold Governance** as the permanent, non-negotiable foundation for all visual design and implementation in the DocenteDoc AI codebase. MD3 Gold represents the highest standard of design system compliance, characterized by zero tolerance for hardcoded visual values and absolute adherence to MD3 CSS tokens.

**Effective Date:** January 29, 2026  
**Governance Level:** GOLD (Zero Violations)  
**Enforcement:** Mandatory and Binding

---

## ARTICLE I: MD3 AS SINGLE SOURCE OF TRUTH

Material Design 3 is declared the **exclusive design system** for DocenteDoc AI. All visual properties—layout, spacing, motion, typography, color, elevation, and interaction—must derive exclusively from MD3 specifications and CSS custom properties.

**No exceptions. No compromises. No alternatives.**

---

## ARTICLE II: FORBIDDEN HARDCODED VALUES

The following hardcoded values are **absolutely prohibited** in all code, stylesheets, and components:

### Layout & Spacing

- **Pixels:** `px` units (e.g., `width: 16px`)
- **Percentages:** `%` units (e.g., `height: 100%`)
- **Viewport Units:** `vh`, `vw`, `vmin`, `vmax` (e.g., `height: 70vh`)
- **Relative Units:** `rem`, `em` (e.g., `font-size: 0.875rem`)
- **Auto Margins:** `margin: auto`

### Motion & Animation

- **Durations:** Raw time values (e.g., `0.2s`, `200ms`, `1s`)
- **Easings:** Raw easing functions (e.g., `ease`, `linear`, `ease-in-out`)
- **Combined Motion:** Raw transition/animation strings (e.g., `all 0.2s ease`)

### Structure & Positioning

- **Z-Index:** Numeric values (e.g., `z-index: 10`, `z-index: 100`)
- **Grid Units:** `fr` units (e.g., `grid-template-columns: 1fr 2fr`)
- **Flexbox Values:** Raw numeric flex values (e.g., `flex: 1`)

### Typography

- **Font Sizes:** Raw size values (e.g., `font-size: 14px`, `font-size: 1rem`)
- **Line Heights:** Raw line-height values (e.g., `line-height: 1.5`)

**Violation of any forbidden value constitutes a critical design system breach.**

---

## ARTICLE III: ALLOWED MD3 TOKEN CATEGORIES

All visual properties must use **only** the following MD3 CSS custom property categories:

### Spacing System

- `var(--md-sys-spacing-*)` - Standard spacing tokens (1 through 12)
- `var(--md-sys-margin-*)` - Margin-specific tokens
- `var(--md-sys-padding-*)` - Padding-specific tokens

### Motion System

- `var(--md-sys-motion-duration-*)` - Duration tokens (short, medium, long, extra-long)
- `var(--md-sys-motion-easing-*)` - Easing tokens (standard, emphasized, decelerated, accelerated)

### Typography System

- `var(--md-sys-typescale-*-font-size)` - Font size tokens
- `var(--md-sys-typescale-*-line-height)` - Line height tokens
- `var(--md-sys-typescale-*-font-weight)` - Font weight tokens
- `var(--md-sys-typescale-*-letter-spacing)` - Letter spacing tokens

### Z-Index Hierarchy

- `var(--md-sys-z-*)` - Z-index tokens (tooltip, fixed, sticky, etc.)

### Grid System

- `var(--md-sys-grid-fr-*)` - Grid fraction tokens

### Viewport System

- `var(--md-sys-viewport-*)` - Viewport dimension tokens (height-full, width-full, etc.)

### Layout Primitives

- `var(--md-sys-percent-*)` - Percentage tokens (0 through 100)

**All tokens must be validated against the official MD3 specification.**

---

## ARTICLE IV: DEVELOPER RESPONSIBILITIES

### Code Authors

- **MUST** use MD3 tokens exclusively for all visual properties
- **MUST** run ESLint validation before committing changes
- **MUST** achieve zero ESLint violations for design system rules
- **MUST** reference this manifesto in pull request descriptions
- **MUST** flag missing tokens to design system maintainers

### Code Reviewers

- **MUST** reject any change containing hardcoded visual values
- **MUST** verify MD3 token usage in all visual modifications
- **MUST** enforce zero-tolerance policy for violations
- **MUST** escalate systemic token gaps to design system team

### Design System Maintainers

- **MUST** extend token system for validated design needs
- **MUST** maintain token documentation and validation rules
- **MUST** ensure token consistency across all components
- **MUST** provide migration guidance for new requirements

---

## ARTICLE V: COPILOT BEHAVIORAL RULES

### Binding Contract

This manifesto constitutes a **binding contract** for all AI-assisted development. Copilot **MUST** treat these rules as non-negotiable constraints.

### Prohibited Behaviors

- **NEVER** suggest hardcoded visual values
- **NEVER** invent new token names or values
- **NEVER** propose workarounds for missing tokens
- **NEVER** accept hardcoded values as "temporary" solutions
- **NEVER** relax MD3 requirements for any reason

### Required Behaviors

- **ALWAYS** use existing MD3 tokens for visual properties
- **ALWAYS** flag missing tokens instead of creating hardcoded values
- **ALWAYS** reference this manifesto in governance-related responses
- **ALWAYS** enforce zero-tolerance policy in code suggestions
- **ALWAYS** validate token usage against allowed categories

### Response Protocol

When encountering design requirements without matching tokens:

1. **FLAG** the gap to design system maintainers
2. **REFUSE** to implement with hardcoded values
3. **REFERENCE** this manifesto as authority
4. **PROVIDE** guidance on proper token extension process

---

## ARTICLE VI: DEFINITION OF DONE (DoD)

### Code Changes

- [ ] **Zero ESLint Violations:** All design system rules pass without errors
- [ ] **MD3 Token Usage:** All visual properties use approved MD3 tokens
- [ ] **Build Success:** Application builds without errors
- [ ] **Functional Verification:** Visual behavior matches design intent
- [ ] **Manifesto Reference:** Pull request explicitly references this manifesto

### Component Development

- [ ] **Token-First Design:** All visual decisions start with available tokens
- [ ] **No Hardcoded Values:** Complete absence of forbidden value types
- [ ] **ESLint Clean:** Component passes all design system linting rules
- [ ] **Documentation:** Component usage documents token dependencies

### Feature Implementation

- [ ] **Design System Compliance:** Feature uses only MD3-approved patterns
- [ ] **Token Coverage:** All visual aspects covered by existing tokens
- [ ] **Regression Prevention:** No introduction of hardcoded values
- [ ] **Governance Acknowledgment:** Implementation references manifesto

### Release Criteria

- [ ] **Gold Standard:** Entire codebase maintains 0 MD3 violations
- [ ] **Build Validation:** Successful production build with MD3 tokens
- [ ] **Audit Clean:** No hardcoded values detected in audit
- [ ] **Documentation Updated:** Manifesto referenced in release notes

---

## ARTICLE VII: ENFORCEMENT & COMPLIANCE

### Violation Consequences

- **Critical Priority:** Any hardcoded visual value blocks deployment
- **Immediate Action:** Violations require immediate remediation
- **No Exceptions:** Zero-tolerance policy applies to all team members
- **Escalation Path:** Unresolved violations escalate to project leadership

### Monitoring & Validation

- **Automated Checks:** ESLint rules enforce compliance in CI/CD
- **Regular Audits:** Quarterly MD3 compliance audits required
- **Regression Detection:** Build failures on hardcoded value introduction
- **Documentation Review:** All changes validated against manifesto

### Future Evolution

- **Token Extension:** New tokens added only through formal design system process
- **Rule Updates:** Manifesto amendments require consensus approval
- **Backward Compatibility:** Legacy violations eliminated, not grandfathered
- **Continuous Improvement:** Governance strengthened based on lessons learned

---

## SIGNATURE & COMMITMENT

This manifesto represents the collective commitment of the DocenteDoc AI development team to maintain the highest standards of design system excellence. By adopting MD3 Gold Governance, we ensure visual consistency, maintainability, and future-proofing of our application.

**Signed:** DocenteDoc AI Development Team  
**Date:** January 29, 2026  
**Status:** ACTIVE AND BINDING

---

_This document serves as the permanent governance framework for MD3 compliance. All development activities must align with these principles. Reference this manifesto in all design system discussions, code reviews, and implementation decisions._</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_GOLD_MANIFESTO.md
