# DocenteDoc AI — DESIGN SYSTEM POLICY (MD3)

## 1. Source of Truth

Material Design 3 (MD3) è **l’unico design system autorizzato** in DocenteDoc AI.
Ogni decisione di UI/UX, layout, motion e stile **DEVE** derivare dai token MD3.

---

## 2. Regole Vincolanti (NON NEGOZIABILI)

### ❌ Vietato

* `className` nel codice di produzione
* Valori hardcoded (`px`, `rem`, `%`, `hex`, `rgba`, `box-shadow` custom)
* Utility CSS (Tailwind o simili)
* Override locali non documentati

### ✅ Obbligatorio

* Uso esclusivo di token MD3 (`var(--md-sys-*)`)
* Componenti wrapper MD3
* Refactor **nel design system**, non nella singola pagina

> **Regola d’oro:** ogni fix di layout è un fix di design system.

---

## 3. Architettura a Layer

* **sys** → immutabile (color, type, spacing, shape)
* **ref** → mapping semantico
* **comp** → componenti MD3
* **motion** → easing e durata MD3
* **elevation** → solo token MD3

---

## 4. MD3 Expressive — Policy Ufficiale

### Principio guida

**CALMA AFFIDABILE**: l’espressività è regolata, semantica e contestuale.

### Regole

* Expressive è **sempre opt-in** (`expressive={true}`)
* Mai expressive di default
* Vietato expressive su:

  * navigazione primaria
  * form critici
  * workflow amministrativi

### Ammesso su

* card narrative
* dashboard data-visual
* achievement / feedback positivi

---

## 5. Glassmorphism

Consentito **solo se**:

1. background statico
2. contrasto AA mantenuto
3. fallback per `prefers-reduced-transparency`

---

## 6. Motion Expressive

* Easing expressive ammesso solo per:

  * entry
  * reveal
  * micro-feedback positivi

> Se l’utente può sbagliare → motion neutra.

---

## 7. Gestione Eccezioni

Le eccezioni:

* devono essere **inevitabili**
* **documentate** (file, riga, motivo)
* **isolate** dal design system

---

## 8. Enforcement

* Violazioni MD3 bloccano le PR
* Il design system è il perimetro operativo

📌 Questo file è il riferimento ufficiale per sviluppatori e Copilot.
