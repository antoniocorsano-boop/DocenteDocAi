# Integrazioni Esterne — DocenteDoc AI

Guida alla configurazione delle integrazioni multi-superficie: Google Classroom, Google Drive, Telegram Bot e WhatsApp Cloud API.

---

## Indice

1. [Variabili d'ambiente](#variabili-dambiente)
2. [Telegram Bot](#telegram-bot)
3. [WhatsApp Cloud API](#whatsapp-cloud-api)
4. [Google Classroom](#google-classroom)
5. [Google Drive](#google-drive)
6. [Test locale con vercel dev + ngrok](#test-locale)
7. [Architettura multi-superficie](#architettura-multi-superficie)

---

## Variabili d'ambiente

Aggiungi queste variabili in **Vercel Dashboard → Settings → Environment Variables** (mai committare nel repository).

Per il test locale, crea un file `.env.local` nella root:

```bash
# ─── Telegram ─────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN=123456789:ABCdef...          # da @BotFather
TELEGRAM_WEBHOOK_SECRET=stringa-random-sicura  # es. openssl rand -hex 20

# ─── WhatsApp Cloud API (Meta) ────────────────────────────────────────────────
WHATSAPP_TOKEN=EAAx...                          # access token Meta
WHATSAPP_PHONE_ID=123456789012345              # Phone Number ID da Meta dashboard
WHATSAPP_VERIFY_TOKEN=docentedoc-wh-2026       # stringa custom (identica nel pannello Meta)

# ─── Google OAuth (già presenti) ─────────────────────────────────────────────
VITE_ENABLE_GSI_DEV=true
VITE_GSI_CLIENT_ID=...                         # Client ID Google OAuth

# ─── AI (server-side, già presenti) ──────────────────────────────────────────
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
```

---

## Telegram Bot

**Costo:** completamente gratuito, nessun limite di messaggi.

### Setup (una tantum)

1. Apri Telegram e scrivi a **@BotFather**
2. Invia `/newbot` → scegli nome e username → copia il **Bot Token**
3. Aggiungi `TELEGRAM_BOT_TOKEN` nelle variabili d'ambiente
4. Genera un segreto random per la sicurezza:
   ```bash
   openssl rand -hex 20
   ```
5. Aggiungi `TELEGRAM_WEBHOOK_SECRET` nelle variabili d'ambiente

### Registrazione webhook (dopo il deploy)

```bash
# Sostituisci <TOKEN> e <SECRET> con i valori reali
curl "https://api.telegram.org/bot<TOKEN>/setWebhook\
?url=https://tuo-dominio.vercel.app/api/webhook-telegram\
&secret_token=<SECRET>"

# Verifica
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### Comandi disponibili nel bot

| Comando / Messaggio                 | Effetto                           |
| ----------------------------------- | --------------------------------- |
| `/start`                            | Benvenuto + guide introduttiva    |
| `/help`                             | Lista comandi disponibili         |
| `"crea classe 2B"`                  | Intent: `create_class`            |
| `"aggiungi studente Mario Bianchi"` | Intent: `add_student`             |
| `"importa studenti"`                | Intent: `import_students`         |
| `"crea UDA di matematica"`          | Intent: `create_uda`              |
| `"backup Drive"`                    | Intent: `drive_sync`              |
| `"importa da Classroom"`            | Intent: `classroom_import`        |
| Qualsiasi testo in italiano         | Parsing NL → risposta contestuale |
| File CSV/Excel                      | Guida importazione studenti       |

### Endpoint

| Metodo | URL                     | Descrizione                                         |
| ------ | ----------------------- | --------------------------------------------------- |
| `POST` | `/api/webhook-telegram` | Aggiornamenti Telegram (configurato via setWebhook) |

---

## WhatsApp Cloud API

**Costo:** gratuito fino a **1.000 conversazioni al mese** (Business Initiated). Sufficienti per un pilota scolastico.

### Setup (una tantum)

1. Crea un account su [developers.facebook.com](https://developers.facebook.com)
2. Crea una nuova **App** di tipo **Business**
3. Aggiungi il prodotto **WhatsApp** all'app
4. Dalla dashboard WhatsApp ottieni:
   - **Access Token** (temporaneo → poi genera uno permanente con Meta Business)
   - **Phone Number ID** (nella sezione "API Setup")
5. Aggiungi `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_VERIFY_TOKEN` nelle variabili d'ambiente

### Configurazione webhook Meta

Nel pannello Meta → **WhatsApp → Configuration → Webhooks**:

| Campo               | Valore                                                |
| ------------------- | ----------------------------------------------------- |
| Callback URL        | `https://tuo-dominio.vercel.app/api/webhook-whatsapp` |
| Verify Token        | Stesso valore di `WHATSAPP_VERIFY_TOKEN`              |
| Subscription fields | ✅ `messages`                                         |

### Flusso di verifica (automatico)

Al salvataggio Meta invia una richiesta GET con `hub.verify_token`. L'endpoint risponde con `hub.challenge` solo se il token corrisponde. Il codice in `api/webhook-whatsapp.ts` gestisce questo automaticamente.

### Comandi supportati

Gli stessi 12 intent del Telegram Bot (vedere tabella sopra). I messaggi interattivi usano i **pulsanti WhatsApp** (max 3 per messaggio) come suggerimenti rapidi.

### Endpoints

| Metodo | URL                     | Descrizione                       |
| ------ | ----------------------- | --------------------------------- |
| `GET`  | `/api/webhook-whatsapp` | Verifica webhook Meta (challenge) |
| `POST` | `/api/webhook-whatsapp` | Messaggi in arrivo da WhatsApp    |

---

## Google Classroom

**Costo:** gratuito con account Google Workspace for Education.

### Setup

1. Abilita **Google Classroom API** in [console.cloud.google.com](https://console.cloud.google.com)
2. Lo stesso **OAuth Client ID** usato per Drive funziona anche per Classroom (scope aggiuntivo: `https://www.googleapis.com/auth/classroom.courses.readonly`)
3. Il connettore è in `src/integrations/connectors/classroom.ts`
4. La UI di collegamento è in **Impostazioni → Integrazioni → Dati scolastici**

### Scopes OAuth richiesti

```
https://www.googleapis.com/auth/classroom.courses.readonly
https://www.googleapis.com/auth/classroom.rosters.readonly
```

---

## Google Drive

**Costo:** gratuito (quota Google Drive dell'utente).

### Setup

Già configurato. Vedi [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md) per dettagli completi.

Il connettore multi-superficie è in `src/integrations/connectors/drive.ts` (re-export di `src/services/googleDriveService.ts`).

---

## Test locale

### Prerequisiti

```bash
npm install -g vercel     # CLI Vercel
# oppure usa: npx vercel
```

### Avvio

```bash
# 1. Crea .env.local con le variabili d'ambiente (vedi sezione sopra)

# 2. Avvia il dev server Vercel (include le Edge Functions in api/)
vercel dev
# → App su http://localhost:3000
# → Edge Functions disponibili su http://localhost:3000/api/*

# 3. In un altro terminale: esponi l'endpoint via ngrok
ngrok http 3000
# → Ottieni URL tipo https://abc123.ngrok.io
```

### Registra i webhook in locale

**Telegram:**

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook\
?url=https://abc123.ngrok.io/api/webhook-telegram\
&secret_token=<SECRET>"
```

**WhatsApp:**  
Nel pannello Meta, aggiorna temporaneamente la Callback URL con `https://abc123.ngrok.io/api/webhook-whatsapp`.

### Test senza webhook esterni (ChatSimulator)

Per sviluppare senza ngrok, usa il `commandInterpreter` direttamente:

```typescript
import {
  parseIntent,
  buildConfirmationMessage,
} from "@/integrations/commandInterpreter";

const intent = parseIntent("crea classe 2B", "app");
console.log(buildConfirmationMessage(intent));
// → "Creo la classe "2B". Vuoi procedere?"
```

---

## Architettura multi-superficie

```
┌─────────────────────────────────────────────────────────────┐
│                      DocenteDoc AI                          │
│                                                             │
│  ┌──────────────┐   ┌────────────────┐   ┌──────────────┐  │
│  │  App (React) │   │  Telegram Bot  │   │  WhatsApp    │  │
│  │  + Copilot   │   │  (gratuito)    │   │  (1k/mese)   │  │
│  └──────┬───────┘   └───────┬────────┘   └──────┬───────┘  │
│         │                   │                    │          │
│         └───────────────────┴────────────────────┘          │
│                             │                               │
│                   commandInterpreter.ts                     │
│              (parseIntent → ParsedIntent)                   │
│                             │                               │
│                   useIntegrationStore                       │
│              (events[], ConnectionStatus)                   │
│                             │                               │
│         ┌───────────────────┼────────────┐                  │
│         ▼                   ▼            ▼                  │
│  Google Classroom    Google Drive    AI Services            │
└─────────────────────────────────────────────────────────────┘
```

### File di riferimento

| File                                               | Ruolo                      |
| -------------------------------------------------- | -------------------------- |
| `api/webhook-telegram.ts`                          | Edge Function Telegram     |
| `api/webhook-whatsapp.ts`                          | Edge Function WhatsApp     |
| `src/integrations/commandInterpreter.ts`           | Parser NL → intent         |
| `src/integrations/connectors/classroom.ts`         | Classroom API              |
| `src/integrations/connectors/drive.ts`             | Drive connector            |
| `src/integrations/chat/telegramAdapter.ts`         | Adapter Telegram           |
| `src/integrations/chat/whatsappAdapter.ts`         | Adapter WhatsApp           |
| `src/stores/useIntegrationStore.ts`                | Stato connessioni + eventi |
| `src/components/ConnectButton.tsx`                 | UI "pulsante magico"       |
| `src/components/settings/SettingsIntegrations.tsx` | Pannello Settings          |
