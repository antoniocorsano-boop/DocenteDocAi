# Copilot Instructions — DocenteDoc AI

## MD3 GOVERNANCE & COMPLIANCE CONTRACT — VINCOLANTE

**È obbligatorio rispettare integralmente il documento “MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md” presente nella root del repository.**

- Ogni output, refactor, suggerimento o generazione di codice deve essere conforme a TUTTE le regole vincolanti del contratto.
- Ogni violazione, anche parziale, è da considerarsi bug bloccante.
- In caso di dubbio, il contratto ha priorità su ogni altra istruzione o policy.

---

Questo repository segue **Material Design 3 (MD3)** come **unico design system** e il contratto di governance MD3 come fonte normativa.

## STRICT RULES (DO NOT VIOLATE)

- È vietato ogni comportamento, output o refactor che violi anche una sola regola del contratto MD3.
- Non usare mai `className` in produzione (eccetto icone MD3 documentate).
- Non usare mai valori hardcoded (`px`, `rem`, `%`, `hex`, `rgba`).
- Usare solo token MD3 (`var(--md-sys-*)`).
- Non introdurre mai utility CSS custom.

## EXPRESSIVE STYLE

- Expressive is **opt-in only**
- Use expressive variants only on approved components
- Never apply expressive styles to:
  - navigation
  - critical forms
  - admin workflows

## COMPONENT USAGE

- Usare solo componenti MD3 o wrapper MD3 approvati dal contratto.
- Modificare solo a livello di design-system, mai localmente.
- In caso di dubbio, consultare e rispettare il contratto MD3.

## GOVERNANCE

- Ogni modifica di layout è una modifica di design system e deve rispettare il contratto MD3.
- Se un token non esiste, proporre l’aggiunta secondo le regole del contratto.
- Ogni eccezione deve essere documentata e approvata come da contratto.

Il contratto “MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md” è la fonte normativa unica e vincolante.

Per ogni audit critico di conformità MD3, utilizzare il prompt ufficiale in .github/prompt-audit-critico-md3.md.

## MD3 REMEDIATION WORKFLOW (OBBLIGATORIO)

Quando Copilot lavora su DocenteDoc AI:

### STEP 1 – HARD VIOLATIONS

Copilot DEVE:

- eliminare qualsiasi valore hardcoded (px, rem, %, hex, rgba)
- sostituirli esclusivamente con token MD3 (`--md-sys-*`)
- NON modificare il layout visivo
- verificare la piena conformità a ogni regola del contratto MD3

Copilot NON DEVE:

- introdurre nuovi token senza dichiararlo e senza approvazione
- cambiare spacing o dimensioni percepite
- violare anche una sola regola del contratto MD3

### STEP 2 – STRUCTURAL CLEANUP

(solo se richiesto esplicitamente e sempre nel rispetto del contratto)

### STEP 3 – EXPRESSIVE / MOTION

(solo se richiesto esplicitamente e sempre nel rispetto del contratto)
