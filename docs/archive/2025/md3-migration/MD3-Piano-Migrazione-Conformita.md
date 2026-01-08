# Piano di Migrazione e Conformità Material 3 (MD3) Expressive

## Obiettivo
Portare l’intera applicazione DocenteDoc AI alla piena conformità con Material 3 (MD3) Expressive, garantendo coerenza visiva, accessibilità, e modernità secondo le linee guida ufficiali Google.

---

## 1. Checklist di Conformità MD3 per Componenti/View

- **Bottoni**: Tutti i pulsanti devono usare `M3Button` con variante appropriata (filled, outlined, tonal, elevated, text)
- **Dialog/Modali**: Azioni e chiusure con `M3Button`, layout e colori MD3
- **Card**: Elevazione, shape, palette MD3
- **Input/TextField**: Stili, label, focus ring MD3
- **Liste/Tabella**: Palette, shape, spacing MD3; azioni con `M3Button`
- **Snackbar/Toast**: Colori, shape, animazioni MD3
- **Icone**: Solo Material Symbols o icone custom MD3
- **Colori**: Solo CSS token MD3 (`var(--md-sys-color-*)`)
- **Tipografia**: Solo token MD3 (`var(--md-sys-typescale-*)`)
- **Spacing**: Solo token MD3 (`var(--md-sys-spacing-*)`)
- **Motion**: Transizioni e animazioni conformi MD3
- **Accessibilità**: Contrasto, focus, aria-label, navigazione tastiera
- **Responsive**: Layout mobile-first, breakpoint MD3

---

## 2. Milestone di Refactoring e Review

1. **Audit Iniziale**
   - [x] Analisi componenti, stili, foundations (vedi markdown allegati)
   - [x] Sostituzione pulsanti legacy con `M3Button`
   - [x] Rimozione CSS legacy
2. **Refactoring Progressivo**
   - [x] Aggiornamento Card (M3ExpressiveCard) con token box-shadow MD3
   - [x] Aggiornamento Dialog
   - [x] Aggiornamento Input/TextField (già conforme MD3: palette, shape, spacing, accessibilità)
   - [x] Aggiornamento Snackbar/Toast (palette, elevation, motion, accessibilità conformi MD3)
   - [x] Revisione palette colori e tipografia (design system centralizzato, solo token MD3)
   - [x] Applicazione spacing, shape, elevation MD3 (design system e componenti principali)
   - [x] Revisione motion e transizioni
3. **Testing e QA**
   - [x] Test UI/UX (manuale e automatico)
   - [x] Verifica accessibilità (WCAG 2.1 AA)
   - [x] Test responsive
4. **Review Finale**
   - [ ] Checklist di conformità per ogni view
   - [ ] Validazione con utenti/tester

---

## 3. Eccezioni e Note
- **Tabella orario**: Struttura non MD3, ma palette, shape e azioni conformi MD3
- **Componenti custom**: Devono seguire token e logica MD3

**Nota:** Il design system (src/design-system/index.ts) è ora completamente MD3: palette, tipografia e spacing sono centralizzati e usano solo token MD3. Tutti i componenti che usano questi token sono automaticamente allineati.

---

## 4. Documentazione di Riferimento
- [MD3-Applicabilita-Analisi.md](MD3-Applicabilita-Analisi.md)
- [MD3-Stili-Applicabilita-Analisi.md](MD3-Stili-Applicabilita-Analisi.md)
- [MD3-Foundations-Applicabilita-Analisi.md](MD3-Foundations-Applicabilita-Analisi.md)

---

## 5. Prossimi Passi
---

## 7. Sintesi Review Finale e Stato Milestone

- Tutte le macro-view risultano conformi MD3, accessibilità e responsive
- Criticità residue: solo tabella orario (struttura non MD3, palette e azioni conformi) e rubriche custom (da validare manualmente)
- Vedi report dettagliato: [MD3-ReviewFinale-Report.md](MD3-ReviewFinale-Report.md)
- Pronto per validazione finale e rilascio
---

## 6. Checklist Finale di Review MD3, Accessibilità e Responsive

- [ ] Tutti i pulsanti usano `M3Button` e hanno aria-label ove necessario
- [ ] Card, Dialog, Snackbar, Input usano solo token MD3 per colori, shape, elevation, spacing
- [ ] Contrasto colori conforme WCAG 2.1 AA su testo, icone, azioni
- [ ] Focus visibile e navigazione tastiera su tutti gli elementi interattivi
- [ ] Icone solo Material Symbols o custom MD3, con testo alternativo
- [ ] Layout mobile-first e responsive su tutte le view principali
- [ ] Test manuale con screen reader su view e modali principali
- [ ] Nessun componente legacy o classe CSS non MD3
- [ ] Animazioni e motion conformi MD3 (transizioni, feedback)
- [ ] Validazione checklist per ogni view prima del rilascio
1. Applicare checklist MD3 a Dialog, Input, Snackbar e altri componenti secondari
2. Procedere con refactoring progressivo secondo milestone
3. Testing accessibilità e responsive
4. Review e validazione finale
