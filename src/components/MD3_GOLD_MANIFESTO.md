# 📜 MD3 Gold Manifesto — DocenteDoc AI

## Status
**Compliance Level:** 🥇 MD3 Gold  
**Hardcoded values:** ❌ Zero  
**Design Source of Truth:** ✅ Material Design 3 Tokens

---

## 1. Principio Fondamentale (Non Negoziabile)

In DocenteDoc AI **Material Design 3 è legge**.

Nessun valore visivo può essere:
- hardcoded
- arbitrario
- “temporaneo”
- “solo per ora”

Se non esiste un token MD3, **non esiste il valore**.

---

## 2. Cosa è Vietato (Sempre)

È vietato introdurre nel codice:

- `px`, `%`, `vw`, `vh`
- `ease`, `linear`, `ease-in-out`
- `z-index` numerici
- `rem`, `em`
- `margin: auto`
- `1fr`, `2fr`
- durate come `200ms`, `0.2s`, `1s`

Qualsiasi violazione è **build-breaking**.

---

## 3. Cosa è Consentito (Solo Questo)

Tutti i valori devono derivare da token MD3:

### Layout & Spacing
- `var(--md-sys-spacing-*)`
- `var(--md-sys-margin-*)`
- `var(--md-sys-percent-*)`
- `var(--md-sys-viewport-*)`

### Motion
- `var(--md-sys-motion-duration-*)`
- `var(--md-sys-motion-easing-*)`

### Typography
- `var(--md-sys-typescale-*-font-size)`
- `var(--md-sys-typescale-*-line-height)`
- `var(--md-sys-typescale-*-font-weight)`

### Layering
- `var(--md-sys-z-*)`

### Grid
- `var(--md-sys-grid-fr-*)`

---

## 4. Responsabilità degli Sviluppatori

Ogni sviluppatore è responsabile di:
- mantenere la compliance MD3
- rifiutare shortcut visivi
- refactorare immediatamente violazioni introdotte

**“Funziona” non è sufficiente.  
Deve essere MD3-compliant.**

---

## 5. Copilot Governance Rule

Copilot **deve**:
- proporre solo token MD3
- rifiutare valori hardcoded
- refactorare automaticamente violazioni MD3

Ogni suggerimento non conforme va rigenerato.

---

## 6. Definition of Done (DoD)

Una feature è **DONE** solo se:
- ESLint MD3 = 0 errori
- Nessun valore hardcoded
- UI consistente con MD3
- Build verde

---

## 7. Regola Finale

> **Se devi chiederti “posso usarlo?”  
> allora non puoi.**

MD3 non è uno stile.  
È un **contratto**.

---

📌 *Questo manifesto protegge la codebase da regressioni visive, debito tecnico e incoerenza UI.*
