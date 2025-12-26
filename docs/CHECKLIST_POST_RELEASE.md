# Checklist Post-Release DocenteDoc AI (Automatica)

Questa checklist può essere usata e aggiornata automaticamente ad ogni release.

- [ ] **Verifica Deploy**
  - [ ] App online e accessibile su Vercel (link pubblico)
  - [ ] Nessun errore 404/500 sulle principali view

- [ ] **Test Funzionali**
  - [ ] Navigazione tra tutte le pagine principali
  - [ ] Modali, Snackbar, Tooltip, Loader funzionanti
  - [ ] Responsive su mobile/tablet/desktop

- [ ] **Accessibilità**
  - [ ] Test con screen reader (NVDA/VoiceOver)
  - [ ] Focus visibile e navigazione da tastiera
  - [ ] Contrasto colori conforme WCAG 2.1 AA

- [ ] **Performance**
  - [ ] Tempo di caricamento < 2s su connessione media
  - [ ] Nessun warning/lentezza in console browser

- [ ] **Documentazione**
  - [ ] CHANGELOG.md aggiornato
  - [ ] Guida migrazione e README/documentazione aggiornata
  - [ ] Screenshot e demo aggiornati

- [ ] **Backup & Sicurezza**
  - [ ] Backup Google Drive funzionante (se attivo)
  - [ ] Nessun dato sensibile in chiaro

- [ ] **Comunicazione**
  - [ ] Annuncio release agli utenti/tester
  - [ ] Aggiorna eventuali canali (sito, social, email)

---

> Puoi copiare questa checklist in ogni nuova release e spuntare i punti completati. Per automazione, integra step di test E2E e validazione CI/CD.

Ultimo aggiornamento: 26/12/2025
