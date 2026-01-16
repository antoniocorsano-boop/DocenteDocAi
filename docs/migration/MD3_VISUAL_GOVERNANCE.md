# MD3 Visual Governance — Single Source of Visual Truth

## Executive Declaration

**MD3 is the Single Source of Visual Truth for this codebase.**

No other visual authority is permitted. All visual decisions must originate from and flow through the MD3 token system.

## Absolute Prohibitions

### ❌ className (Tailwind or CSS) = FORBIDDEN

- No `className` attributes in components
- No Tailwind utility classes
- No CSS class-based styling

### ❌ hardcoded px/rem/hex = FORBIDDEN

- No hardcoded `px`, `rem`, `%`, `hex`, `rgba` values
- No numeric literals for spacing, sizing, colors

### ❌ onMouseEnter/onFocus/onBlur for visual effects = FORBIDDEN

- No imperative interaction handling for visual changes
- No runtime style mutation via event handlers

### ❌ runtime mutation of style = FORBIDDEN

- No direct DOM manipulation for visual properties
- No JavaScript-driven style changes

## Legacy Code Status

**Existing code using forbidden patterns is LEGACY CONGELATO (Frozen Legacy).**

- Legacy code remains functional but is not to be extended or modified
- No new features may be added to legacy components
- Legacy components are scheduled for eventual replacement with MD3-compliant implementations

## New Code Requirements

**All new code MUST:**

- Use `useTheme().layers.*` for all visual properties
- Apply tokens via static inline `style` objects
- Express interaction states declaratively through MD3 token variants
- Never introduce forbidden patterns

## MD3 is the Single Source of Visual Truth

> **All visual decisions MUST originate from MD3 tokens and flow through the theme system.**

There must be **no alternative authorities** such as:

- Runtime JavaScript decisions
- Local component logic deciding appearance
- CSS utilities
- Inline hardcoded values
- Documentation examples contradicting the system

If a visual behavior is not representable via tokens, **it must not exist**.

## Enforcement

This governance document supersedes all other styling guidelines.

Violations will be treated as critical bugs requiring immediate rollback.

**Copilot and all AI assistants must enforce these rules without exception.**
