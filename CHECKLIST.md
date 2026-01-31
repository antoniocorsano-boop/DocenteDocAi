# CHECKLIST — MD3 Platinum Recovery

## FASE 1 - FREEZE & STABILIZZAZIONE

- [ ] **DEV** - Congelare modifiche non essenziali al design system
- [ ] **QA** - Validare build stabile senza errori MD3
- [ ] **LEAD/GOVERNANCE** - Approvare freeze temporaneo per recovery

**Rischi / punti di controllo:**

- Regressioni visive su Header/Home/Nav
- Build failures bloccanti

## FASE 2 - PULIZIA TECNICA MIRATA

- [ ] **DEV** - Rimuovere hardcoded values (px, rem, colors) da componenti critici
- [ ] **DEV** - Sostituire con token MD3 (`var(--md-sys-*)`, `var(--app-*)`)
- [ ] **QA** - Verificare compliance MD3 scanner
- [ ] **LEAD/GOVERNANCE** - Approvare esenzioni temporanee se necessarie

**Rischi / punti di controllo:**

- Perdita di funzionalità durante pulizia
- Conflitti con registry esistenti

## FASE 3 - RESTYLING UX CRITICO

- [ ] **DEV** - Restyling Header.tsx con MD3 tokens
- [ ] **DEV** - Restyling Home.tsx con MD3 tokens
- [ ] **DEV** - Restyling Navigation.tsx con MD3 tokens
- [ ] **DEV** - Restyling Card.tsx con MD3 tokens
- [ ] **QA** - Snapshot tests per tutti i componenti critici
- [ ] **QA** - Playwright tests per interazioni UX critiche

**Rischi / punti di controllo:**

- Cambiamenti visivi non desiderati
- Problemi di accessibilità

## FASE 4 - AUTOMAZIONE & GOVERNANCE

- [ ] **DEV** - Implementare pre-commit hooks MD3 compliance
- [ ] **DEV** - Automatizzare audit visual regression
- [ ] **QA** - Configurare CI/CD per controlli MD3
- [ ] **LEAD/GOVERNANCE** - Aggiornare governance charter per prevenzione

**Rischi / punti di controllo:**

- False positive/negative negli audit automatici
- Overhead governance eccessivo

## FASE 5 - MIGLIORAMENTI PROGRESSIVI

- [ ] **DEV** - Ottimizzazioni performance post-MD3
- [ ] **DEV** - Miglioramenti UX basati su feedback
- [ ] **QA** - Test end-to-end completi
- [ ] **LEAD/GOVERNANCE** - Valutare unfreeze parziale per evoluzioni

**Rischi / punti di controllo:**

- Introduzione di nuovo debito tecnico
- Deviazioni dalla compliance MD3
