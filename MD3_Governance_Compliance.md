# Material Design 3 Expressive — Governance & Compliance Specification

## 0. Purpose

This document defines the **single source of truth** for Material Design 3 (MD3) Expressive compliance within this codebase.

Its purpose is to:

* Eliminate ambiguity
* Prevent architectural drift
* Align humans, tooling, and AI assistants (Copilot) under the same rules
* Guarantee long-term MD3 pervasiveness

Any behavior not explicitly allowed in this document is **forbidden by default**.

---

## 1. Core Principle — Single Source of Visual Truth

> **All visual decisions MUST originate from MD3 tokens and flow through the theme system.**

There must be **no alternative authorities** such as:

* Runtime JavaScript decisions
* Local component logic deciding appearance
* CSS utilities
* Inline hardcoded values
* Documentation examples contradicting the system

If a visual behavior is not representable via tokens, **it must not exist**.

---

## 2. Token Architecture (Authoritative)

### 2.1 Token Layers

The system exposes exactly the following token layers:

* **sys** — System colors (foundational, semantic)
* **ref** — Reference scales

  * spacing
  * typography
  * shape
* **motion** — Duration and easing
* **elevation** — Shadow levels

No additional layers may be invented.

### 2.2 Responsibilities

| Layer     | Responsibility             | Mutable by Presets | Consumable by Components |
| --------- | -------------------------- | ------------------ | ------------------------ |
| sys       | Semantic color roles       | ✅                  | ✅                        |
| ref       | Spacing, typography, shape | ✅                  | ✅                        |
| motion    | Motion timing & easing     | ❌                  | ✅                        |
| elevation | Depth & hierarchy          | ❌                  | ✅                        |

### 2.3 CSS Variables

CSS variables are:

* **Allowed ONLY** inside token definitions
* **Forbidden** in components, presets, or runtime logic

---

## 3. Theme Access Model

### 3.1 useTheme()

`useTheme()` returns:

```
{
  layers: {
    sys,
    ref,
    motion,
    elevation
  },
  updateOverrides,
  resetOverrides
}
```

### 3.2 Correct Consumption Pattern

Components MUST:

```
const { layers } = useTheme();
const { sys, ref, motion, elevation } = layers;
```

### 3.3 Forbidden Patterns

❌ `const { sys } = useTheme()`
❌ Accessing tokens without `layers`
❌ Bypassing `useTheme()`
❌ Creating local theme objects

---

## 4. Component Rules (STRICT)

### 4.1 What Components MAY Do

* Read tokens from `useTheme().layers`
* Select between predefined tokens (variant mapping)
* Apply tokens via **static inline styles**

### 4.2 What Components MUST NOT Do

❌ Use `className`
❌ Use Tailwind or utility CSS
❌ Use hardcoded values (`px`, `rem`, `%`, hex, rgba)
❌ Reference CSS variables
❌ Mutate styles at runtime
❌ Use `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur` to change styles
❌ Decide visual outcomes via JavaScript conditionals

---

## 5. Interaction Governance (Critical)

### 5.1 Forbidden Interaction Patterns

The following are **explicitly forbidden**:

* Runtime style mutation
* Imperative interaction handling
* JavaScript-driven hover/focus/active visuals

Examples of violations:

```
onMouseEnter={() => setStyle(...) }
onFocus={() => element.style.outline = ... }
```

### 5.2 Allowed Interaction Model

All interaction states MUST be:

* Pre-expressed via tokens
* Declarative
* Static

If an interaction cannot be expressed declaratively, it must be removed.

---

## 6. Presets & Overrides

### 6.1 Preset Purpose

Presets are **behavioral modifiers**, NOT color palettes.

They exist to modulate:

* Emotional tone
* Visual rhythm
* Hierarchy

### 6.2 Allowed Overrides

Presets MAY override:

* `sys.colors`
* `ref.spacing`
* `ref.typography`
* `ref.shape`

### 6.3 Forbidden Overrides

❌ `motion`
❌ `elevation`
❌ Custom keys
❌ CSS variables
❌ Undefined placeholders

Overrides MUST be `Partial<TokenLayers>` and strictly typed.

---

## 7. Documentation Governance

### 7.1 Documentation Is Code

Documentation is treated as a **first-class authority**.

If documentation contradicts the system, it is considered a **blocking defect**.

### 7.2 Forbidden Documentation Content

Documentation MUST NOT:

* Show runtime style mutation
* Show imperative interaction examples
* Show deprecated patterns

All legacy examples MUST be clearly marked:

```
⚠️ DEPRECATED — GOVERNANCE VIOLATION
```

---

## 8. Enforcement Model

### 8.1 Tooling

* TypeScript enforces structure
* CI enforces violations
* Lint enforces surface rules

### 8.2 Known Gaps

* TypeScript cannot enforce semantic MD3 rules
* Governance relies on human and AI discipline

This document fills that gap.

---

## 9. Common Error Patterns & Resolution

### 9.1 "Property does not exist"

Cause:

* Accessing non-existent tokens

Resolution:

* Align component with token definitions
* Extend tokens ONLY if MD3 allows it

### 9.2 "Object literal may only specify known properties"

Cause:

* Invalid preset overrides

Resolution:

* Restrict overrides to known token layers

---

## 10. System Status Definition

A system is considered **MD3 Expressive Compliant** ONLY if:

* MD3 is the sole visual authority
* All components are token-mediated
* No imperative styling exists
* Documentation is aligned
* Presets are behavioral, not cosmetic

Partial compliance is considered **non-compliance**.

---

## 11. Final Authority Statement

> If there is a conflict between:
>
> * code
> * documentation
> * tooling
> * AI suggestions

**This document wins.**

Any deviation requires an explicit governance update.
