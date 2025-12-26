# Roadmap Refactoring UI DocenteDoc AI (Material Design 3)

## Obiettivo
Portare l’interfaccia utente di DocenteDoc AI agli standard Material Design 3 (Expressive/Web), migliorando estetica, accessibilità, coerenza e usabilità.

---

## Step 1: Analisi e Priorità
- [x] Analizza componenti chiave: AppBar, Sidebar, Card, Button, Dialog, Form, List, Table
- [x] Identifica componenti legacy e personalizzati
- [x] Mappa le dipendenze di stile (theme.css, design-system/)
- [x] Definisci priorità: componenti ad alto impatto visivo prima

## Step 2: Aggiornamento Design Tokens
- [x] Aggiorna `theme.css` con nuovi token M3 (colori, tipografia, spacing)
- [x] Allinea design-system/ ai nuovi token
- [x] Documenta i token in README design-system

## Step 3: Refactoring Componenti
- [x] Refactoring AppBar/Header secondo M3
- [x] Refactoring Sidebar/Menu con navigation drawer M3
- [x] Refactoring Card, Button, Dialog, List, Table
- [x] Aggiorna props e interfacce in `types.ts` se necessario
- [x] Rimuovi stili legacy e classi obsolete
- [x] Micro-interazioni: Tooltip, Snackbar, Loader, Badge
- [x] Validazione Problems panel e accessibility

## Step 4: Responsive & Accessibility
- [x] Testa layout mobile-first (breakpoint, touch target)
- [x] Migliora contrasto, focus, aria-label, tabIndex
- [x] Verifica WCAG 2.1 AA compliance

## Step 5: Validazione e Testing
- [x] Testa UI con utenti (feedback docenti)
- [x] Esegui test automatici (unit, E2E)
- [x] Correggi bug e incongruenze

## Step 6: Documentazione e Release
- [ ] Aggiorna screenshot e demo
- [ ] Documenta le modifiche in CHANGELOG.md
- [ ] Prepara guida di migrazione per componenti custom
- [ ] Rilascia nuova versione (deploy Vercel)

---

## Note Operative
- Segui Material Design 3 Web Guidelines: https://m3.material.io/
- Usa solo componenti React funzionali
- Mantieni la UI in italiano
- Priorità: privacy, accessibilità, performance

---

## File Coinvolti
- src/components/*
- src/design-system/*
- src/theme.css
- src/types.ts
- src/stores/*
- docs/PIANO_M3_DESIGN.md

---

## Timeline Stimata
- Analisi & Priorità: 1 giorno
- Aggiornamento Token: 1 giorno
- Refactoring Componenti: 3-5 giorni
- Responsive & Accessibility: 2 giorni
- Testing & Validazione: 2 giorni
- Documentazione & Release: 1 giorno

**Totale stimato: 8-12 giorni lavorativi**

---

## Owner: Team UI/UX + Dev
## Ultimo aggiornamento: 26/12/2025 (UI, accessibilità, micro-interazioni completate)
