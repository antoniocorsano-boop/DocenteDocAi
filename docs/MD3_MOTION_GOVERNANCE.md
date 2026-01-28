# MD3 MOTION GOVERNANCE — PHASE 5 DOCUMENTATION

**GOVERNANCE CONTRACT — VINCOLANTE E NON INTERPRETABILE**

---

## 📋 EXECUTIVE SUMMARY

Questo documento stabilisce le regole **OBBLIGATORIE** per l'uso dei motion tokens Material Design 3 in DocenteDoc AI. **OGNI** valore temporale o easing deve usare ESCLUSIVAMENTE token MD3. Nessuna eccezione è ammessa.

**Data implementazione:** 28 gennaio 2026  
**Fase:** 5 (MOTION & DURATION)  
**Status:** ✅ ACTIVE & ENFORCED  
**Blocking level:** ERROR (pre-commit + ESLint)

---

## 🚫 REGOLE ASSOLUTE (NON VIOLABILI)

### ❌ VIETATO

1. **Valori temporali hardcoded**
   ```css
   /* ❌ VIETATO */
   transition: all 200ms;
   animation-duration: 0.3s;
   transition-delay: 150ms;
   animation: fade-in 500ms;
   ```

2. **Easing functions hardcoded**
   ```css
   /* ❌ VIETATO */
   transition: transform 200ms ease-in-out;
   animation: slide 300ms cubic-bezier(0.4, 0, 0.2, 1);
   transition-timing-function: linear;
   animation-timing-function: ease;
   ```

3. **`transition: all` (anti-pattern performance)**
   ```css
   /* ❌ VIETATO — Specificare proprietà esplicite */
   transition: all 200ms;
   ```

4. **Inline style con valori temporali**
   ```tsx
   /* ❌ VIETATO */
   <div style={{ transition: '200ms ease', animationDuration: '300ms' }} />
   ```

5. **Fallback CSS hardcoded**
   ```css
   /* ❌ VIETATO */
   transition-duration: var(--md-sys-motion-duration-medium, 250ms);
   ```

### ✅ OBBLIGATORIO

1. **Solo token MD3 motion**
   ```css
   /* ✅ CORRETTO */
   transition: transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard);
   animation-duration: var(--md-sys-motion-duration-long);
   ```

2. **Proprietà esplicite (no `all`)**
   ```css
   /* ✅ CORRETTO */
   transition: 
     transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard),
     opacity var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
   ```

3. **Inline style con token MD3**
   ```tsx
   /* ✅ CORRETTO */
   <div style={{ 
     transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)` 
   }} />
   ```

---

## 🎨 MD3 MOTION TOKEN SYSTEM

### Duration Tokens

| Token | Valore | Uso consentito |
|-------|--------|----------------|
| `--md-sys-motion-duration-short` | 100ms | Micro-interactions (hover, ripple, chip) |
| `--md-sys-motion-duration-medium` | 250ms | UI standard (dialog, card, tooltip) |
| `--md-sys-motion-duration-long` | 400ms | Emphasized motion (drawer, navigation, modal) |
| `--md-sys-motion-duration-extra-long` | 600ms | Hero animations (page transitions) |

### Easing Tokens

| Token | Curva | Uso consentito |
|-------|-------|----------------|
| `--md-sys-motion-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose, balanced motion |
| `--md-sys-motion-easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Emphasized enters/exits (M3 signature) |
| `--md-sys-motion-easing-decelerated` | `cubic-bezier(0, 0, 0.2, 1)` | Gentle entrances |
| `--md-sys-motion-easing-accelerated` | `cubic-bezier(0.4, 0, 1, 1)` | Quick exits |

---

## 📚 USAGE GUIDELINES

### Button Hover (Micro-Interaction)

```css
.button {
  transition: 
    background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard),
    box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
}
```

### Modal Open (Standard Transition)

```css
.modal {
  animation: modal-fade-in var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized);
}

@keyframes modal-fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Drawer Slide (Emphasized Motion)

```css
.drawer {
  transition: 
    transform var(--md-sys-motion-duration-long) var(--md-sys-motion-easing-emphasized);
}
```

### Hero Animation (Page Transition)

```css
.page-transition {
  animation: page-slide-in var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-emphasized);
}
```

---

## 🔄 MIGRATION GUIDE

### Before (VIOLAZIONE)

```css
.card {
  transition: all 200ms ease-in-out;
}

.modal {
  animation: fade-in 300ms ease-out;
}

.button:hover {
  transition: background-color 0.2s;
}
```

### After (CONFORME MD3)

```css
.card {
  transition: 
    transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard),
    box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard);
}

.modal {
  animation: fade-in var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized);
}

.button:hover {
  transition: background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
}
```

---

## 🛡️ ENFORCEMENT SYSTEM

### 1. Audit Script

```bash
npm run md3:motion:audit
```

**Output:**
- ✅ Clean → Exit 0
- ❌ Violations → Exit 1 (blocks commit)

**Detects:**
- Hardcoded ms/s
- Hardcoded easing
- `transition: all`
- Non-MD3 variables
- Inline style violations

### 2. ESLint Rule

**File:** `eslint-rules/no-hardcoded-motion-values.mjs`

**Severity:** ERROR (non-overridable)

**Blocks:**
- Hardcoded duration/easing
- `transition: all`
- Non-MD3 motion variables

### 3. Pre-Commit Hook

**File:** `.husky/pre-commit`

```bash
# MD3 Motion Governance Enforcement
node ./scripts/md3-motion-audit.cjs || exit 1
```

**Behavior:** Commit is **BLOCKED** if violations detected.

### 4. Test Suite

**File:** `__tests__/md3-motion-governance.test.ts`

**Tests (8 total):**
- ✅ Hardcoded ms rejection
- ✅ Hardcoded s rejection
- ✅ Easing rejection
- ✅ `transition: all` rejection
- ✅ Token presence validation
- ✅ var() syntax enforcement

---

## 📊 CURRENT STATUS (28 Gennaio 2026)

**Audit risultati:**
- 📂 **909 violazioni** totali rilevate
- 🔥 Top violator: `src/layout.css` (148 violations)
- 📊 Breakdown:
  - `hardcodedDuration`: 360
  - `hardcodedEasing`: 234
  - `inlineStyleTemporal`: 185
  - `transitionAll`: 76
  - `nonMD3MotionVar`: 50
  - `hardcodedDelay`: 4

**Protection layer:**
- ✅ Audit script: ACTIVE
- ✅ ESLint rule: ERROR severity
- ✅ Pre-commit hook: BLOCKING
- ✅ Test suite: 8/8 PASSING

**Remediation:**
- 🔄 Incrementale su 909 violazioni
- 🎯 Priority: layout.css, modules.css, AnalyticsDashboard.tsx
- ⏰ Tracking: Fase 5 cleanup post-enforcement

---

## ✅ REMEDIATION CHECKLIST

### Pre-Remediation

- [x] Token system definito in `src/theme.css`
- [x] Audit script creato (`scripts/md3-motion-audit.cjs`)
- [x] ESLint rule implementata
- [x] Pre-commit hook attivo
- [x] Test suite validata (8/8 passing)
- [x] Documentazione completa

### During Remediation

Per ogni file:
1. [ ] Eseguire `npm run md3:motion:audit` per identificare violazioni
2. [ ] Sostituire valori hardcoded con token MD3
3. [ ] Sostituire `transition: all` con proprietà esplicite
4. [ ] Validare con `npm test`
5. [ ] Commit incrementale

### Post-Remediation

- [ ] Re-run audit: `npm run md3:motion:audit` → Exit 0
- [ ] ESLint clean: `npm run lint`
- [ ] Test suite: `npm test` → All passing
- [ ] Visual regression check
- [ ] Update `MD3_CLEANUP_EXECUTION_PLAN.md`

---

## 🎯 BEST PRACTICES

### 1. Semantic Duration Selection

```css
/* Micro-interaction (< 200ms) */
.chip:hover {
  transition: background-color var(--md-sys-motion-duration-short);
}

/* Standard UI (200-300ms) */
.card {
  transition: transform var(--md-sys-motion-duration-medium);
}

/* Emphasized motion (400-500ms) */
.drawer {
  transition: transform var(--md-sys-motion-duration-long);
}

/* Hero animation (600ms+) */
.page-transition {
  animation-duration: var(--md-sys-motion-duration-extra-long);
}
```

### 2. Easing Curve Selection

```css
/* Standard (balanced) */
.button {
  transition: transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard);
}

/* Emphasized entrance */
.modal {
  animation: modal-in var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized);
}

/* Decelerated (gentle entrance) */
.tooltip {
  animation: fade-in var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-decelerated);
}

/* Accelerated (quick exit) */
.toast-close {
  animation: fade-out var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-accelerated);
}
```

### 3. Performance Optimization

```css
/* ❌ VIETATO — `all` è costoso */
.element {
  transition: all var(--md-sys-motion-duration-medium);
}

/* ✅ CORRETTO — Proprietà specifiche */
.element {
  transition: 
    transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard),
    opacity var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard);
}
```

### 4. Accessibility

```css
/* Rispetta prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔧 TROUBLESHOOTING

### ❓ "Audit script trova violazioni nel mio file"

**Soluzione:** 
1. Esegui `npm run md3:motion:audit`
2. Identifica la riga esatta
3. Sostituisci valore hardcoded con token MD3
4. Re-run audit per conferma

### ❓ "ESLint blocca il mio commit"

**Causa:** Hardcoded motion value detected

**Soluzione:**
```bash
# Identifica violazioni
npm run lint

# Fix
# Sostituisci 200ms → var(--md-sys-motion-duration-medium)
# Sostituisci ease-in-out → var(--md-sys-motion-easing-standard)

# Re-test
npm run lint
```

### ❓ "Come scelgo il token giusto?"

**Guida rapida:**
- Hover, ripple → `short`
- Dialog, card → `medium`
- Drawer, navigation → `long`
- Page transition → `extra-long`

**Easing:**
- Default → `standard`
- Emphasized enter → `emphasized`
- Gentle entrance → `decelerated`
- Quick exit → `accelerated`

### ❓ "Posso usare token legacy `--motion-*`?"

**Durante migrazione:** Sì (mappati a MD3)

**Nuovo codice:** ❌ NO — Solo `--md-sys-motion-*`

**Deprecation:** Token legacy saranno rimossi in Phase 6

---

## 📅 RELEASE NOTES

### Phase 5 — 28 Gennaio 2026

**Implemented:**
- ✅ MD3 motion token system (4 duration + 4 easing)
- ✅ Audit script (`md3-motion-audit.cjs`)
- ✅ ESLint rule (`no-hardcoded-motion-values.mjs`)
- ✅ Pre-commit enforcement
- ✅ Test suite (8 tests)
- ✅ Governance documentation

**Detection:**
- 909 violations identified across codebase
- Top violators: layout.css (148), modules.css (78), theme.css (39)

**Protection Layer:**
- Audit blocking: ACTIVE
- ESLint ERROR severity: ACTIVE
- Pre-commit hook: ACTIVE
- Test suite: 8/8 PASSING

**Next Steps:**
- Incremental remediation of 909 violations
- Legacy token deprecation (Phase 6)
- Visual regression validation

---

## 📞 COMPLIANCE STATEMENT

**Questo documento è PARTE INTEGRANTE del contratto MD3 Governance.**

Ogni modifica a motion/animation/transition/duration/easing:
1. DEVE usare ESCLUSIVAMENTE token MD3
2. DEVE passare audit script (exit 0)
3. DEVE passare ESLint (no errors)
4. DEVE passare test suite (8/8)
5. DEVE passare pre-commit hook

**Nessuna eccezione è ammessa senza approvazione esplicita governance.**

**Data:** 28 Gennaio 2026  
**Fase:** 5 (MOTION & DURATION)  
**Status:** ✅ ACTIVE & ENFORCED  
**Blocking:** Pre-commit + ESLint ERROR + Test suite

---

## 🔗 RIFERIMENTI

- **MD3 Motion Specification:** https://m3.material.io/styles/motion/overview
- **Token definition:** `src/theme.css` (lines 655-710)
- **Audit script:** `scripts/md3-motion-audit.cjs`
- **ESLint rule:** `eslint-rules/no-hardcoded-motion-values.mjs`
- **Test suite:** `__tests__/md3-motion-governance.test.ts`
- **Execution plan:** `MD3_CLEANUP_EXECUTION_PLAN.md`

---

**END OF DOCUMENT — MD3 MOTION GOVERNANCE**
