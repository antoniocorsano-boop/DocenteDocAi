
# 🛡️ Fase 6: Release Candidate & Hardening - Piano Esecutivo

**Stato Attuale:** RC1 (Release Candidate 1) - **IN CORSO (Week 4)**
**Obiettivo:** Trasformare il prototipo funzionale in un prodotto stabile, sicuro e performante ("Production Ready").

---

## 1. 📊 Analisi Strategica: Valore vs Rischio

Ogni intervento è stato valutato in base all'impatto sull'utente finale e al rischio tecnico di regressione.

### 1.1 Refactoring dello Stato (Il "God Object")
*   **Problema:** L'intera app dipende da un singolo hook `useAppEngine`. Ogni modifica (es. un voto) rischia di re-renderizzare componenti non correlati (es. calendario).
*   **🟢 Impatto (Alto):** Performance e fluidità, specialmente su dispositivi mobili o con molti dati storici. Manutenibilità del codice a lungo termine.
*   **🔴 Rischio (Critico):** "Operazione a cuore aperto". Rischio elevato di rompere collegamenti logici esistenti (es. salvataggio automatico).
*   **Strategia:** Migrazione incrementale verso **Zustand** (store atomici).

### 1.2 Sicurezza Kiosk Mode (Web Lock API)
*   **Problema:** La sicurezza attuale è basata solo sulla UI (CSS/FullScreen). Uno studente esperto può aggirarla.
*   **🟢 Impatto (Medio):** Aumento della fiducia del docente nel lasciare il dispositivo in mano agli studenti.
*   **🔴 Rischio (Medio):** Limitazioni tecniche dei browser (PWA non possono bloccare il tasto Home). Rischio di promettere una sicurezza "assoluta" impossibile da garantire via web.
*   **Strategia:** Implementare `navigator.wakeLock` e logging degli eventi di "uscita/distrazione" invece del blocco totale.

### 1.3 Resilienza AI (Retry & Error Handling)
*   **Problema:** Errori di rete o timeout delle API Gemini causano crash o messaggi di errore generici.
*   **🟢 Impatto (Alto):** Percezione di affidabilità. L'app non sembra "rotta" se l'AI fallisce temporaneamente.
*   **🔴 Rischio (Basso):** Facile da implementare.
*   **Strategia:** Wrapper per le chiamate API con *Exponential Backoff* (ritenta dopo 1s, 2s, 5s).

### 1.4 Testing E2E (Playwright)
*   **Problema:** Ad ogni rilascio, è necessario testare manualmente tutti i flussi.
*   **🟢 Impatto (Molto Alto):** Sicurezza nel rilasciare aggiornamenti senza rompere le funzioni core (Login, Voti, Backup).
*   **🔴 Rischio (Medio):** Costo di manutenzione dei test se la UI cambia spesso.
*   **Strategia:** Coprire solo i "Critical Path" (Login, CRUD Voti, Backup).

---

## 2. ⚠️ Rischi Strutturali e Mitigazione

| Rischio | Descrizione | Strategia di Mitigazione |
| :--- | :--- | :--- |
| **Quota Storage Browser** | IndexedDB ha limiti variabili. Una KB troppo grande può bloccare il salvataggio. | Monitoraggio `navigator.storage.estimate()` e avvisi preventivi all'utente. |
| **Dipendenza Drive** | Cambiamenti alle API Google o ai permessi OAuth possono rompere il backup. | Mantenere sempre attivo l'Export/Import manuale JSON come salvagente. |
| **Evoluzione Modelli AI** | I modelli (es. Gemini Flash) cambiano/deprecano. I prompt potrebbero smettere di funzionare. | Astrarre le chiamate AI in un servizio centralizzato per cambiare modello facilmente. |

---

## 3. 📅 Piano Esecutivo: 4 Sprint Settimanali

L'obiettivo è completare la Fase 6 in un mese solare.

### 🏁 Week 1: La Rete di Sicurezza (Safety Net) - COMPLETATA
*Obiettivo: Assicurarsi che se rompiamo qualcosa, ce ne accorgiamo subito.*
1.  **[FATTO] Setup Playwright:** Installazione e configurazione ambiente di test E2E.
2.  **[FATTO] Smoke Tests:** Scrittura di 3 test critici (Login, Creazione Lezione, Export Backup).
3.  **[FATTO] AI Resilience:** Implementazione del wrapper `callAiWithRetry` con gestione errori elegante.
4.  **[FATTO] Code Audit:** Pulizia di `any` residui in TypeScript e standardizzazione ESLint.

### 🏗️ Week 2: Refactoring "Soft" (Architettura I) - COMPLETATA
*Obiettivo: Iniziare il refactoring dalle parti periferiche a basso rischio.*
1.  **[FATTO] Setup Zustand:** Installazione libreria e creazione struttura store.
2.  **[FATTO] Migrazione UI State:** Spostare stati dei modali (`isModalOpen`), toast e loader in un `useUIStore`.
3.  **[FATTO] Migrazione Settings:** Spostare `TimetableSettings`, `ThemeState`, `AiSettings` fuori da `useAppEngine`.
4.  **[DA FARE] Test Regressione:** Verificare che temi e configurazioni funzionino come prima.

### 🫀 Week 3: Refactoring "Core" (Architettura II - Critica) - COMPLETATA
*Obiettivo: Migrare i dati didattici sensibili.*
1.  **[FATTO] Data Store:** Creare `useDataStore` per `students`, `lessons`, `evaluations`.
2.  **[FATTO] Middleware Persistenza:** Implementare la logica di auto-salvataggio (IndexedDB/Drive) come middleware di Zustand (reagisce alle modifiche dello store).
3.  **[FATTO] Ottimizzazione Render:** Applicare `React.memo` (via `useMemo` in `useAppEngine`) per stabilizzare le props passate ai componenti.
4.  **Fix Regressioni:** Esecuzione continua dei test E2E creati nella Week 1.

### 🔒 Week 4: Polish & Security (Rilascio) - IN CORSO
*Obiettivo: Rifinitura finale e hardening.*
1.  **[FATTO] Kiosk Mode Hardening:** Implementazione `Wake Lock API`, Fullscreen API e listener `visibilitychange` per loggare i tentativi di uscita degli studenti.
2.  **Accessibilità (a11y):** Audit colori e navigazione tastiera.
3.  **Performance Profiling:** Verifica FPS e tempi di caricamento.
4.  **Release 4.0.0:** Aggiornamento versione, changelog e build di produzione.

---

## 4. Stack Tecnico Consigliato

*   **State Management:** `Zustand` (Leggero, performante, hook-based).
*   **Testing E2E:** `Playwright` (Moderno, veloce, supporta WebKit/Chromium).
*   **AI Resilience:** Pattern custom o libreria `p-retry`.
*   **Storage:** `idb-keyval` (già in uso, confermato) + `LocalForage` (alternativa se servono driver più robusti).

---
*Ultimo aggiornamento: Kiosk Mode Hardening Completato*