
# Guida Configurazione Google Drive Sync

Questa guida spiega come ottenere il **Google Client ID** e la **API Key (Browser API Key)** necessari per abilitare il backup su cloud in OrarioDoc AI e il selettore di cartelle di Google Drive.

## 1. Concetti Fondamentali

Perché servono queste configurazioni?
1.  **Sicurezza:** Google richiede che ogni app sia registrata e identificata prima di poter accedere ai dati dell'utente (es. Google Drive).
2.  **OAuth 2.0 (Client ID):** Questo protocollo standard gestisce l'autenticazione dell'utente. L'app non vede mai la password dell'utente. Invece, l'app chiede a Google: *"Posso usare il Drive di questo utente?"* e Google chiede all'utente: *"OrarioDoc AI vuole scrivere file sul tuo Drive. Acconsenti?"*. Il **Client ID** identifica univocamente la tua app per questa autorizzazione.
3.  **API Key (Browser API Key per Picker):** Questa chiave è un identificativo del tuo progetto Google Cloud utilizzato per accedere a determinate API client-side, come il **Google Picker** (il selettore di file/cartelle visivo che compare nell'app). È una chiave diversa dal Client ID e **non è la Gemini API Key** per l'AI generativa.

---

## 2. Procedura Passo-Passo su Google Cloud

### Passo A: Crea o Seleziona un Progetto
1.  Vai su [Google Cloud Console](https://console.cloud.google.com/).
2.  Accedi con il tuo account Google.
3.  In alto a sinistra, clicca sul menu a discesa dei progetti. Seleziona un progetto esistente o clicca **"Nuovo progetto"** per crearne uno (es. `OrarioDoc Backup`).
4.  Clicca su **Crea**.

### Passo B: Abilita le API Necessarie
1.  Nel menu laterale (hamburger menu), vai su **API e servizi** > **Libreria**.
2.  Cerca e abilita le seguenti API:
    *   `Google Drive API`
    *   `Google Picker API` (se disponibile, altrimenti `Google Drive API` è solitamente sufficiente per il Picker)
3.  Clicca sul risultato e poi sul pulsante blu **Abilita** per ciascuna.

### Passo C: Configura la Schermata di Consenso OAuth
Questo definisce cosa vedrà l'utente quando clicca "Connetti".

1.  Nel menu laterale, vai su **API e servizi** > **Schermata di consenso OAuth**.
2.  **User Type:** Seleziona **Esterno** (a meno che tu non abbia una G-Suite aziendale, in quel caso puoi usare Interno).
3.  Clicca **Crea**.
4.  **Informazioni App:**
    *   Nome app: `OrarioDoc AI`
    *   Email assistenza: La tua email.
    *   Logo: (Opzionale)
    *   Email recapiti sviluppatore: La tua email.
5.  Clicca **Salva e continua**.
6.  **Ambiti (Scopes):**
    *   Clicca su **Aggiungi o Rimuovi Ambiti**.
    *   Cerca e seleziona: `.../auth/drive.file` (Permette all'app di vedere e modificare *solo* i file e le cartelle che essa stessa ha creato nel tuo Drive, non tutto il Drive).
    *   Clicca **Aggiorna** e poi **Salva e continua**.
7.  **Utenti di Test (Fondamentale):**
    *   Poiché l'app non è verificata da Google, funzionerà **SOLO** per gli utenti che elenchi qui.
    *   Clicca **+ AGGIUNGI UTENTI**.
    *   Inserisci la tua email (e quella di eventuali colleghi che testeranno l'app).
    *   Clicca **Salva e continua**.

### Passo D: Crea le Credenziali: ID Client OAuth
1.  Nel menu laterale, vai su **API e servizi** > **Credenziali**.
2.  In alto, clicca **+ CREA CREDENZIALI** > **ID client OAuth**.
3.  **Tipo di applicazione:** Seleziona **Applicazione web**.
4.  **Nome:** `OrarioDoc Web Client`.
5.  **Origini JavaScript autorizzate (MOLTO IMPORTANTE):**
    *   Qui devi inserire l'indirizzo esatto da cui usi l'app.
    *   **Esempi:**
        *   Se sei in locale: `http://localhost:5173` (o la porta che usi, es. 8080, 3000).
        *   Se l'app è pubblicata (es. su Vercel, Cloud Run): `https://tua-scuola-app.vercel.app` o `https://tuo-id.region.run.app`.
    *   *Nota:* Non mettere lo slash finale (`/`).
6.  **URI di reindirizzamento:** Puoi lasciarlo vuoto per questo tipo di flusso (popup), oppure inserire lo stesso valore delle "Origini JavaScript autorizzate".
7.  Clicca **Crea**.
8.  Apparirà una finestra con "Il tuo ID client". **Copia questo codice.**

### Passo E: Crea le Credenziali: API Key (Browser API Key per Picker)
1.  Nel menu laterale, vai su **API e servizi** > **Credenziali**.
2.  In alto, clicca nuovamente **+ CREA CREDENZIALI** > **Chiave API**.
3.  Una chiave API verrà creata automaticamente. **Copia questa chiave.**
4.  **Restrizioni (MOLTO IMPORTANTE per la sicurezza):**
    *   Clicca su **"Limita chiave"**.
    *   **Restrizioni Applicazioni:**
        *   Seleziona `Riferimenti HTTP (siti web)`.
        *   Aggiungi gli **stessi URL** che hai usato per le "Origini JavaScript autorizzate" nel Passo D.5. Assicurati di includere wildcard (`*`) se usi sottodomini o porte variabili (es. `http://localhost:5173/*`, `https://*.run.app/*`).
    *   **Restrizioni API:**
        *   Seleziona `Limita chiave` e scegli le API `Google Drive API` e `Google Picker API`.
5.  Clicca **Salva**.

### Passo F: Inserisci le Credenziali in OrarioDoc AI
1.  Apri **OrarioDoc AI**.
2.  Vai su **Impostazioni** > **Dati & Sync** > **Configurazione Avanzata Google Drive**.
3.  Nel campo "Google Client ID (OAuth)", incolla il codice ottenuto nel **Passo D.8**.
4.  Nel campo "API Key Google Cloud (per Picker)", incolla la chiave ottenuta nel **Passo E.3**.
5.  Le impostazioni verranno salvate automaticamente. Ora puoi connettere Google Drive e usare il selettore di cartelle.

---

## 3. Risoluzione Problemi Comuni

*   **Errore "Accesso bloccato: l'app non ha completato la verifica":** Hai dimenticato di aggiungere la tua email negli "Utenti di Test" (Passo C.7).
*   **Errore "Origin mismatch" (il popup si chiude subito):** L'indirizzo che hai messo in "Origini JavaScript autorizzate" (Passo D.5) e/o nelle "Restrizioni Applicazioni" della chiave API (Passo E.4) non corrisponde esattamente a quello nella barra degli indirizzi del browser (controlla `http` vs `https` e la porta).
*   **Errore "L'app non è verificata":** È normale in fase di test. Clicca su "Avanzate" > "Procedi verso OrarioDoc AI (non sicuro)" per continuare.
*   **Errore "The API developer key is invalid" (quando apri il selettore cartelle):** Questo significa che la **API Key (Browser API Key)** che hai inserito è errata, è stata revocata o non ha le restrizioni API corrette nella Google Cloud Console (Passo E.4). Verifica che sia la chiave corretta e che le API "Google Drive API" e "Google Picker API" siano abilitate e non ci siano restrizioni applicative troppo stringenti.
