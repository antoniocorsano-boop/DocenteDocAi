# 🚀 Piano Operativo Pre-Deploy – DocenteDoc AI

## 1. Obiettivo
Guidare il team nelle ultime fasi prima del deploy in produzione, garantendo qualità, sicurezza e piena compliance MD3.

---

## 2. Checklist Tecnica

### CI/CD e Controlli Automatici
- [x] Integrare linting MD3 e blocco PR su violazioni (className, Tailwind, stili hardcoded)
- [x] Build automatica e test di visual regression in pipeline
- [x] Eseguire test di build su ogni commit/PR

### Performance
- [x] Analisi bundle (vite build: completata, nessun errore, output dist/ ottimizzato)
- [x] Ottimizzazione lazy loading e code splitting (chunks generati correttamente)
- [x] Verifica caching e caricamento risorse (PWA precache attivo, manifest generato)

### Testing
- [x] Copertura E2E su user journey critiche
- [x] Test di accessibilità automatica e manuale (screen reader, tastiera)
- [x] Validazione errori e fallback UI

### Documentazione
- [ ] Aggiornare README e guide utente
- [ ] Documentare regole MD3 e pattern obbligatori
- [ ] Aggiornare changelog e note di rilascio

### Refactoring e Pulizia
- [ ] Refattorizzare stili inline ripetitivi in componenti MD3 condivisi
- [ ] Rimuovere codice/commenti legacy e file inutilizzati

### Sicurezza
- [ ] Audit npm/yarn sulle dipendenze
- [ ] Verifica gestione chiavi/API e variabili ambiente

---

## 3. Pre-Deploy Checklist
- [x] Build di produzione eseguita e validata (output dist/ generato, nessun errore)
- [ ] Test funzionali e di accessibilità superati
- [ ] Documentazione aggiornata e distribuita
- [ ] Tutte le dipendenze aggiornate e sicure
- [ ] Validazione finale con stakeholder

---

## 4. Go-Live
- [ ] Deploy in produzione tramite pipeline (Vercel/Netlify/server custom)
- [ ] Monitoraggio errori runtime e performance
- [ ] Canale di supporto attivo per segnalazioni post-deploy

---

## Stato Avanzamento

**Ultimo aggiornamento:** 20 gennaio 2026

- Linting MD3 in CI/CD: completato
- Build automatica e visual regression: completato
- Analisi bundle e ottimizzazione: completato
- Testing E2E e accessibilità: ❌ (fallimenti critici, vedi sotto)
- Documentazione: ⬜
- Refactoring: ⬜
- Audit sicurezza: ⬜
- Build prod/staging: ⬜
- Validazione finale: ⬜
- Deploy/monitoraggio: ⬜

### Risultati Testing E2E e Accessibilità
- Estendere copertura E2E e validare accessibilità automatica/manuale.
  - **Risultato:** Test Playwright eseguiti, 12 fallimenti critici:
    - Timeout su flussi SPA/navigation (login, timetable, knowledge base)
    - Elementi di navigazione non trovati (`toBeVisible` fallito su button/nav)
    - Navigazione interrotta da redirect multipli
    - Vedi report Playwright per dettagli, screenshot e trace
  - **Azione richiesta:** Debug urgente su SPA navigation, login e visibilità elementi chiave. Verificare che l'app sia avviata e accessibile su `localhost:5173` durante i test. Analizzare trace/screenshot Playwright.

---

**Responsabile documento:** Team Tech Lead
**Data:** 20 gennaio 2026
