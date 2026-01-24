# Copilot Instructions — DocenteDoc AI

This repository follows **Material Design 3 (MD3)** as the **only design system**.

## STRICT RULES (DO NOT VIOLATE)

* Never use `className` in production code
* Never use hardcoded values (`px`, `rem`, `%`, `hex`, `rgba`)
* Always use MD3 tokens (`var(--md-sys-*)`)
* Never introduce custom CSS utilities

## EXPRESSIVE STYLE

* Expressive is **opt-in only**
* Use expressive variants only on approved components
* Never apply expressive styles to:

  * navigation
  * critical forms
  * admin workflows

## COMPONENT USAGE

* Prefer existing MD3 wrapper components
* Modify components at the design-system level, not locally
* If unsure, reuse or extend an existing MD3 component

## GOVERNANCE

* Every layout fix is a design system fix
* If a token does not exist, propose adding it
* Exceptions must be documented

Follow `DESIGN_SYSTEM_POLICY.md` as the source of truth.

## MD3 REMEDIATION WORKFLOW (OBBLIGATORIO)

Quando Copilot lavora su DocenteDoc AI:

### STEP 1 – HARD VIOLATIONS
Copilot DEVE:
- eliminare qualsiasi valore hardcoded (px, rem, %, hex, rgba)
- sostituirli esclusivamente con token MD3 (`--md-sys-*`)
- NON modificare il layout visivo

Copilot NON DEVE:
- introdurre nuovi token senza dichiararlo
- cambiare spacing o dimensioni percepite

### STEP 2 – STRUCTURAL CLEANUP
(solo se richiesto esplicitamente)

### STEP 3 – EXPRESSIVE / MOTION
(solo se richiesto esplicitamente)
