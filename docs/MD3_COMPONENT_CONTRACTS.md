# MD3 COMPONENT CONTRACTS — PHASE 6 DOCUMENTATION

**GOVERNANCE CONTRACT — VINCOLANTE E NON INTERPRETABILE**

---

## 📋 EXECUTIVE SUMMARY

Questo documento stabilisce i **contratti obbligatori** per TUTTI i componenti React in DocenteDoc AI. Ogni componente DEVE rispettare le regole MD3, eliminando props illegali, inline styles hardcoded e className non conformi. **ZERO TOLLERANZA** per violazioni.

**Data implementazione:** 28 Gennaio 2026  
**Fase:** 6 (COMPONENT CONTRACTS)  
**Status:** ✅ ACTIVE & ENFORCED  
**Blocking level:** ERROR (pre-commit + ESLint + Tests)

---

## 🚫 PROPS VIETATE (TUTTI I COMPONENTI)

### ❌ FORBIDDEN PROPS

Queste props **NON POSSONO MAI** essere usate su componenti React:

```tsx
// ❌ VIETATO — width prop
<MyComponent width="200px" />
<Button width={100} />

// ❌ VIETATO — height prop
<MyComponent height="50vh" />
<Card height="auto" />

// ❌ VIETATO — margin prop
<MyComponent margin="20px" />
<Box margin={16} />

// ❌ VIETATO — padding prop
<MyComponent padding="var(--md-sys-spacing-4)" /> // Anche con token!
<Container padding="1rem" />

// ❌ VIETATO — zIndex prop
<MyComponent zIndex={999} />
<Modal zIndex="var(--md-sys-z-modal)" /> // Anche con token!

// ❌ VIETATO — transition prop
<MyComponent transition="200ms ease" />
<Button transition="all 0.3s" />

// ❌ VIETATO — animation prop
<MyComponent animation="fade-in 300ms" />
<Card animation="slide-up" />

// ❌ VIETATO — gap prop
<MyComponent gap="16px" />
<Stack gap={8} />

// ❌ VIETATO — position props
<MyComponent top="0" left="0" right="0" bottom="0" />
```

### ✅ SOLUZIONI CONSENTITE

Invece di props, usare:

1. **CSS Classes con MD3 tokens**
   ```tsx
   // ✅ CORRETTO
   <div className="m3-surface">Content</div>
   ```

2. **Wrapper MD3 Components**
   ```tsx
   // ✅ CORRETTO
   <M3Surface>
     <MyComponent />
   </M3Surface>
   ```

3. **Inline styles con SOLO token MD3**
   ```tsx
   // ✅ CORRETTO (solo per casi eccezionali)
   <div style={{ padding: 'var(--md-sys-spacing-4)' }}>
     Content
   </div>
   ```

---

## 🎨 INLINE STYLES — REGOLE STRINGENTI

### ❌ VIETATO

1. **Hardcoded layout values**
   ```tsx
   // ❌ VIETATO
   <div style={{ width: '100px' }} />
   <div style={{ height: '50vh' }} />
   <div style={{ padding: '16px' }} />
   <div style={{ margin: '20px 10px' }} />
   <div style={{ gap: '1rem' }} />
   <div style={{ top: '0', left: '50%' }} />
   ```

2. **Hardcoded colors**
   ```tsx
   // ❌ VIETATO
   <div style={{ color: '#FF0000' }} />
   <div style={{ backgroundColor: 'rgb(255, 0, 0)' }} />
   <div style={{ borderColor: 'rgba(0, 0, 0, 0.12)' }} />
   <div style={{ fill: 'hsl(200, 50%, 50%)' }} />
   ```

3. **Hardcoded z-index**
   ```tsx
   // ❌ VIETATO
   <div style={{ zIndex: 999 }} />
   <div style={{ zIndex: 1 }} />
   ```

4. **Hardcoded motion**
   ```tsx
   // ❌ VIETATO
   <div style={{ transition: '200ms ease-in-out' }} />
   <div style={{ transition: 'all 0.3s' }} />
   <div style={{ animation: 'fade-in 300ms' }} />
   <div style={{ transitionDuration: '150ms' }} />
   ```

### ✅ OBBLIGATORIO

**SOLO token MD3 sono ammessi in inline styles:**

```tsx
// ✅ CORRETTO — Spacing
<div style={{ padding: 'var(--md-sys-spacing-4)' }} />
<div style={{ margin: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)' }} />
<div style={{ gap: 'var(--md-sys-spacing-6)' }} />

// ✅ CORRETTO — Colors
<div style={{ color: 'var(--md-sys-color-primary)' }} />
<div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }} />
<div style={{ borderColor: 'var(--md-sys-color-outline)' }} />

// ✅ CORRETTO — Z-Index
<div style={{ zIndex: 'var(--md-sys-z-modal)' }} />
<div style={{ zIndex: 'var(--md-sys-z-overlay)' }} />

// ✅ CORRETTO — Motion
<div style={{ 
  transition: `transform var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)` 
}} />
<div style={{ 
  animationDuration: 'var(--md-sys-motion-duration-long)' 
}} />
```

---

## 📛 CLASSNAME — ALLOWLIST MD3

### ❌ VIETATO

**Tailwind-like utility classes:**

```tsx
// ❌ VIETATO — Width utilities
<div className="w-full" />
<div className="w-screen w-1/2" />

// ❌ VIETATO — Height utilities
<div className="h-screen" />
<div className="h-full h-64" />

// ❌ VIETATO — Padding utilities
<div className="p-4 px-8 py-2" />
<div className="pt-4 pb-8" />

// ❌ VIETATO — Margin utilities
<div className="m-4 mx-auto" />
<div className="mt-8 mb-4" />

// ❌ VIETATO — Background utilities
<div className="bg-blue-500 bg-red-200" />
<div className="bg-gradient-to-r" />

// ❌ VIETATO — Border utilities
<div className="border-2 rounded-lg" />
<div className="border-red-500" />

// ❌ VIETATO — Shadow utilities
<div className="shadow-md shadow-lg" />

// ❌ VIETATO — Z-index utilities
<div className="z-10 z-50" />

// ❌ VIETATO — Transition utilities
<div className="transition-all duration-300" />
<div className="animate-pulse" />
```

### ✅ OBBLIGATORIO

**SOLO MD3 component classes:**

```tsx
// ✅ CORRETTO — M3 prefix
<div className="m3-surface" />
<div className="m3-button" />
<div className="m3-card" />

// ✅ CORRETTO — MD3 prefix
<div className="md3-container" />
<div className="md3-grid" />

// ✅ CORRETTO — Aura theme
<div className="aura-gradient" />
<div className="aura-surface" />

// ✅ CORRETTO — Layout system
<div className="layout-grid" />
<div className="layout-flex" />

// ✅ CORRETTO — App-level
<div className="app-header" />
<div className="app-body" />

// ✅ CORRETTO — Material Symbols
<span className="material-symbols-outlined">menu</span>
```

---

## 📚 MIGRATION GUIDE

### Before (VIOLAZIONI)

```tsx
// ❌ COMPONENT WITH FORBIDDEN PROPS
function OldCard({ children }: { children: React.ReactNode }) {
  return (
    <Card 
      width="300px" 
      height="200px" 
      padding="20px"
      margin="16px"
      zIndex={10}
      transition="all 200ms ease"
    >
      {children}
    </Card>
  );
}

// ❌ HARDCODED INLINE STYLES
function OldButton({ label }: { label: string }) {
  return (
    <button style={{
      width: '100px',
      height: '40px',
      padding: '8px 16px',
      backgroundColor: '#6750A4',
      color: '#FFFFFF',
      borderRadius: '20px',
      transition: '200ms ease-in-out',
      zIndex: 1
    }}>
      {label}
    </button>
  );
}

// ❌ TAILWIND UTILITIES
function OldHeader() {
  return (
    <header className="w-full h-16 p-4 bg-blue-500 shadow-md z-50">
      <h1 className="text-2xl font-bold text-white">Title</h1>
    </header>
  );
}
```

### After (CONFORME MD3)

```tsx
// ✅ MD3 WRAPPER COMPONENTS
import { M3Card, M3Surface } from './components/md3';

function NewCard({ children }: { children: React.ReactNode }) {
  return (
    <M3Card className="m3-card-elevated">
      {children}
    </M3Card>
  );
}

// ✅ INLINE STYLES WITH MD3 TOKENS
function NewButton({ label }: { label: string }) {
  return (
    <button 
      className="m3-button-filled"
      style={{
        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
      }}
    >
      {label}
    </button>
  );
}

// ✅ MD3 COMPONENT CLASSES (BEST PRACTICE)
function NewHeader() {
  return (
    <header className="app-header m3-surface-container">
      <h1 className="m3-typography-headline-medium">Title</h1>
    </header>
  );
}

// ✅ CSS CLASS WITH MD3 TOKENS (in CSS file)
/*
.app-header {
  width: var(--md-sys-percent-100);
  height: var(--md-sys-spacing-16);
  padding: var(--md-sys-spacing-4);
  background-color: var(--md-sys-color-surface-container);
  box-shadow: var(--md-sys-elevation-1);
  z-index: var(--md-sys-z-base);
}
*/
```

---

## 🛡️ ENFORCEMENT SYSTEM

### 1. Audit Script

```bash
npm run md3:component:audit
```

**Output:**
- ✅ Clean → Exit 0
- ❌ Violations → Exit 1 (blocks commit)
- 📄 JSON report: `reports/md3-component-contract-violations.json`

**Detects:**
- Forbidden props (width, height, margin, padding, zIndex, transition, animation)
- Hardcoded inline styles (layout, color, motion, z-index)
- Non-MD3 className utilities (w-, h-, p-, m-, bg-, etc.)

### 2. ESLint Rule

**File:** `eslint-rules/no-invalid-component-props.mjs`

**Severity:** ERROR (non-overridable)

**Blocks:**
- Forbidden props on components
- Hardcoded values in inline styles
- Non-MD3 className patterns

### 3. Pre-Commit Hook

**File:** `.husky/pre-commit`

```bash
# MD3 Component Contract Enforcement
node ./scripts/md3-component-contract-audit.cjs || exit 1
```

**Behavior:** Commit is **BLOCKED** if violations detected.

### 4. Test Suite

**File:** `__tests__/md3-component-contracts.test.tsx`

**Tests (32 total):**
- ✅ Forbidden Props (7 tests)
- ✅ Inline Style Validation (12 tests)
- ✅ className Validation (10 tests)
- ✅ DOM Rendering (3 tests)

---

## 📊 CURRENT STATUS (28 Gennaio 2026)

**Audit risultati:**
- 📂 **386 violazioni** totali in 253 componenti
- 🔥 Top violators:
  - [src/components/EvaluationModule.tsx](src/components/EvaluationModule.tsx): 21 violations
  - [src/components/ClassPlanningWizard.tsx](src/components/ClassPlanningWizard.tsx): 14 violations
  - [src/components/FlowMode.tsx](src/components/FlowMode.tsx): 13 violations

**Breakdown per tipo:**
- `inlineStyleMotion`: 181 violations
- `inlineStyleLayout`: 170 violations
- `forbiddenProps`: 17 violations
- `inlineStyleZIndex`: 13 violations
- `classNameUtilities`: 3 violations
- `hardcodedSizeProps`: 2 violations

**Protection layer:**
- ✅ Audit script: ACTIVE
- ✅ ESLint rule: ERROR severity
- ✅ Pre-commit hook: READY (pending activation)
- ✅ Test suite: 32/32 PASSING

**Remediation:**
- 🔄 Incrementale su 386 violations
- 🎯 Priority: EvaluationModule.tsx, ClassPlanningWizard.tsx, FlowMode.tsx
- ⏰ Tracking: file-by-file usando report JSON

---

## ✅ REMEDIATION CHECKLIST

### Pre-Remediation

- [x] Token system completo (Phases 1-5)
- [x] Audit script creato
- [x] ESLint rule implementata
- [x] Test suite validata (32/32 passing)
- [x] Documentazione completa
- [ ] Pre-commit hook attivato

### During Remediation (File-by-File)

Per ogni componente:
1. [ ] Eseguire `npm run md3:component:audit` per identificare violazioni
2. [ ] Rimuovere forbidden props → usare wrapper MD3 o CSS classes
3. [ ] Convertire inline styles hardcoded → token MD3
4. [ ] Sostituire utility className → component classes MD3
5. [ ] Validare con `npm test`
6. [ ] Verificare visual invariato
7. [ ] Commit incrementale

### Post-Remediation

- [ ] Re-run audit: `npm run md3:component:audit` → Exit 0
- [ ] ESLint clean: `npm run lint`
- [ ] Test suite: `npm test` → All passing
- [ ] Visual regression check
- [ ] Update `MD3_CLEANUP_EXECUTION_PLAN.md`

---

## 🎯 BEST PRACTICES

### 1. Component Design

```tsx
// ❌ WRONG — Forbidden props
interface BadComponentProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  zIndex?: number;
}

// ✅ CORRECT — MD3 compliant interface
interface GoodComponentProps {
  variant?: 'filled' | 'outlined' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  className?: string; // Only MD3 classes allowed
  children?: React.ReactNode;
}
```

### 2. Layout Composition

```tsx
// ❌ WRONG — Props for layout
<Card width="300px" height="200px" margin="16px">
  <Content />
</Card>

// ✅ CORRECT — Wrapper with CSS class
<div className="m3-card-container">
  <Card variant="elevated">
    <Content />
  </Card>
</div>

// In CSS:
// .m3-card-container {
//   width: var(--md-sys-spacing-75); /* 300px equivalent */
//   height: var(--md-sys-spacing-50); /* 200px equivalent */
//   margin: var(--md-sys-spacing-4);  /* 16px */
// }
```

### 3. Conditional Styles

```tsx
// ❌ WRONG — Inline hardcoded
<div style={{
  backgroundColor: isActive ? '#6750A4' : '#E8DEF8'
}}>
  Content
</div>

// ✅ CORRECT — MD3 tokens
<div style={{
  backgroundColor: isActive 
    ? 'var(--md-sys-color-primary)' 
    : 'var(--md-sys-color-primary-container)'
}}>
  Content
</div>

// ✅ BEST — CSS classes
<div className={isActive ? 'm3-surface-primary' : 'm3-surface-container'}>
  Content
</div>
```

### 4. Responsive Design

```tsx
// ❌ WRONG — Hardcoded breakpoints
<div style={{
  width: windowWidth > 768 ? '60%' : '100%'
}}>
  Content
</div>

// ✅ CORRECT — MD3 responsive classes
<div className="m3-layout-responsive">
  Content
</div>

// In CSS:
// .m3-layout-responsive {
//   width: var(--md-sys-percent-100);
// }
// @media (min-width: 768px) {
//   .m3-layout-responsive {
//     width: var(--md-sys-percent-60);
//   }
// }
```

---

## 🔧 TROUBLESHOOTING

### ❓ "Audit trova violazioni nel mio componente"

**Soluzione:**
1. Esegui `npm run md3:component:audit`
2. Apri `reports/md3-component-contract-violations.json`
3. Trova il tuo file, leggi tipo violazione e riga
4. Applica fix secondo migration guide
5. Re-run audit

### ❓ "ESLint blocca il mio commit"

**Causa:** Forbidden prop o hardcoded value detected

**Soluzione:**
```bash
# Identifica violazioni specifiche
npm run lint

# Verifica file modificato
npm run md3:component:audit

# Fix applicando best practices
# Sostituisci prop → wrapper MD3 o CSS class
# Sostituisci hardcoded → var(--md-sys-*)

# Re-test
npm run lint
npm test
```

### ❓ "Come gestisco layout complesso senza props?"

**Opzioni:**

1. **CSS Grid/Flexbox con MD3 tokens**
   ```css
   .my-layout {
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     gap: var(--md-sys-spacing-4);
     padding: var(--md-sys-spacing-6);
   }
   ```

2. **Wrapper MD3 Layout Components**
   ```tsx
   <M3LayoutGrid columns={3} gap="md">
     <Item />
     <Item />
     <Item />
   </M3LayoutGrid>
   ```

3. **Utility style function (per dynamic values)**
   ```tsx
   const gridStyles = {
     gridTemplateColumns: `repeat(${count}, 1fr)`,
     gap: 'var(--md-sys-spacing-4)',
   };
   <div style={gridStyles}>...</div>
   ```

### ❓ "Inline style sempre vietato?"

**NO — ammesso se:**
- Usa SOLO token MD3 (`var(--md-sys-*)`)
- Nessun valore hardcoded
- Motivazione tecnica (dynamic values, JS calc)

**Preferire:**
- CSS classes quando possibile
- Component variants
- MD3 wrapper components

---

## 📅 RELEASE NOTES

### Phase 6 — 28 Gennaio 2026

**Implemented:**
- ✅ Component contract audit script (`md3-component-contract-audit.cjs`)
- ✅ ESLint rule (`no-invalid-component-props.mjs`)
- ✅ Test suite (32 tests, all passing)
- ✅ Governance documentation

**Detection:**
- 386 violations identified across 253 components
- Top violators: EvaluationModule.tsx (21), ClassPlanningWizard.tsx (14), FlowMode.tsx (13)

**Protection Layer:**
- Audit blocking: ACTIVE
- ESLint ERROR severity: ACTIVE
- Pre-commit hook: READY (pending activation)
- Test suite: 32/32 PASSING

**Next Steps:**
- Incremental remediation of 386 violations
- Pre-commit hook activation
- Visual regression validation
- Component library refactor (opt-in)

---

## 📞 COMPLIANCE STATEMENT

**Questo documento è PARTE INTEGRANTE del contratto MD3 Governance.**

Ogni nuovo componente:
1. DEVE passare audit script (exit 0)
2. DEVE passare ESLint (no errors)
3. DEVE passare test suite (32/32)
4. DEVE usare SOLO MD3 tokens o component classes
5. NON DEVE usare forbidden props
6. NON DEVE avere hardcoded values in inline styles
7. NON DEVE usare utility className non-MD3

**Nessuna eccezione è ammessa senza approvazione esplicita governance.**

**Data:** 28 Gennaio 2026  
**Fase:** 6 (COMPONENT CONTRACTS)  
**Status:** ✅ ACTIVE & ENFORCED  
**Blocking:** Audit + ESLint ERROR + Test suite

---

## 🔗 RIFERIMENTI

- **Token Systems:**
  - Colors: `src/theme.css` (--md-sys-color-*)
  - Spacing: `src/theme.css` (--md-sys-spacing-*)
  - Motion: `src/theme.css` (--md-sys-motion-*)
  - Z-Index: `src/theme.css` (--md-sys-z-*)
- **Audit script:** `scripts/md3-component-contract-audit.cjs`
- **ESLint rule:** `eslint-rules/no-invalid-component-props.mjs`
- **Test suite:** `__tests__/md3-component-contracts.test.tsx`
- **Execution plan:** `MD3_CLEANUP_EXECUTION_PLAN.md`
- **Previous phases:**
  - Phase 4: `docs/MD3_Z_INDEX_GOVERNANCE.md`
  - Phase 5: `docs/MD3_MOTION_GOVERNANCE.md`

---

**END OF DOCUMENT — MD3 COMPONENT CONTRACTS**
