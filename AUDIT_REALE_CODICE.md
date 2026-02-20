# AUDIT REALE DEL CODICE — DocenteDoc AI
**Data audit:** 20 Febbraio 2026

---

## 📌 Scopo
Effettuare una fotografia reale dello stato del codice rispetto alla governance MD3 e alle regole interne di styling, basandosi sulle evidenze presenti in repository (output ESLint già tracciato).

---

## 🔍 Metodo di verifica
- Fonte primaria: `eslint-output.txt` (lint già eseguito e salvato nel repo).
- Verifica concentrata su violazioni MD3 per hardcoded values, `className` non ammessi e unità non conformi.

---

## ✅ Executive Summary
- **Stato complessivo:** ⚠️ Non conforme (violazioni MD3 presenti).
- **Tipologie principali di violazioni:**
  - Hardcoded layout values (`auto`, `100%`, `100vh`, `1fr`).
  - Valori motion hardcoded (`300ms`).
  - Uso di `className` nei componenti UI.
- **Impatto:** regressione del contratto MD3, rischio di blocco pipeline lint.

---

## 📂 Evidenze reali (estratte da `eslint-output.txt`)

### 1) Hardcoded layout values (auto, %, vh, fr)
**File coinvolti:**
- `src/components/ConsiglioClasse.tsx` (margin auto)
- `src/components/DidatticaInclusiva.tsx` (margin auto)
- `src/components/EditSlotModal.tsx` (gridTemplateColumns: `1fr`)
- `src/components/EditableContentCard.tsx` (width: `100%`)
- `src/components/ErrorBoundary.functional.tsx` (minHeight: `100vh`, width: `100%`)
- `src/components/ErrorLogsDashboard.tsx` (margin auto, `1fr`, width `100%`)

**Esempi reali (da output lint):**
- `marginLeft: auto` / `marginRight: auto`
- `width: 100%`
- `minHeight: 100vh`
- `gridTemplateColumns: 1fr`

### 2) Hardcoded motion values
**File coinvolti:**
- `src/components/ErrorLogsDashboard.tsx`

**Esempio reale (da output lint):**
- `transition: color 300ms`

### 3) `className` non consentito
**File coinvolti:**
- `src/components/EvaluationModule.tsx`

**Esempi reali (da output lint):**
- Multiple `className` su elementi UI, segnalati con `design-system/no-classname`.

---

## 🧭 Raccomandazioni operative (conformi al contratto MD3)

### Priorità 1 — Hardcoded layout values
Sostituire:
- `auto` → `var(--md-sys-margin-auto)`
- `100%` → `var(--md-sys-percent-100)`
- `100vh` → `var(--md-sys-viewport-full)`
- `1fr` → `var(--md-sys-grid-fr-1)`

### Priorità 2 — Motion tokens
Sostituire:
- `300ms` → `var(--md-sys-motion-duration-medium)`

### Priorità 3 — `className`
Rimuovere `className` e migrare a `style` inline con token MD3.

---

## ✅ Output atteso al termine remediation
- Lint MD3 privo di violazioni bloccanti.
- Conformità completa alle regole del contratto MD3.
- Nessun uso residuo di valori hardcoded o `className` nei componenti UI.

---

## 📌 Note
Questo report è basato su evidenze concrete già presenti nel repository e rappresenta uno snapshot reale dello stato del codice al momento dell’audit.
