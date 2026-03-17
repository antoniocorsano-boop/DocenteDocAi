# Deploy Vercel – DocenteDoc AI

---

## Variabili d'ambiente

### Server-side (Vercel Dashboard → Settings → Environment Variables)

Queste variabili vengono usate solo dall'Edge Function `api/ai.ts` — **mai esposte al browser**.

| Variabile           | Obbligatoria | Descrizione                               |
| ------------------- | ------------ | ----------------------------------------- |
| `GEMINI_API_KEY`    | ✅           | Chiave API Google Gemini (AI pipeline)    |
| `ANTHROPIC_API_KEY` | ✅           | Chiave API Anthropic Claude (AI pipeline) |

### Client-side (build-time, prefisso `VITE_`)

Questi valori vengono incorporati nell'applicazione al momento della build.
Impostali in Vercel Dashboard oppure in `.env.local` per lo sviluppo locale.

| Variabile                          | Obbligatoria | Default                                  | Descrizione                                                            |
| ---------------------------------- | ------------ | ---------------------------------------- | ---------------------------------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID`            | ✅ prod      | `872214867934-...` (hard-coded fallback) | Client ID Google OAuth per Drive e GSI                                 |
| `VITE_GOOGLE_API_KEY`              | ⚠️           | —                                        | Google API Key (richiesta per alcune API Drive)                        |
| `VITE_ENABLE_GSI_DEV`              | dev-only     | `false`                                  | Abilita Google Sign-In in development                                  |
| `VITE_GSI_CLIENT_ID`               | dev-only     | —                                        | Client ID Google OAuth per dev locale                                  |
| `VITE_GEMINI_API_KEY`              | dev-only     | —                                        | Fast-path AI in dev (bypassa il proxy `/api/ai`)                       |
| `VITE_AI_BETA`                     | opzionale    | `false`                                  | Abilita funzionalità AI in beta/staging                                |
| `VITE_ALLOWED_HOSTS`               | opzionale    | —                                        | Whitelist host separati da virgola                                     |
| `VITE_OTEL_EXPORTER_OTLP_ENDPOINT` | opzionale    | —                                        | Endpoint tracing OpenTelemetry (es. `http://localhost:4318/v1/traces`) |
| `VITE_TEST_MODE`                   | test-only    | `false`                                  | Bypassare logiche di backup/engine nei test E2E                        |

### Configurazione minima per produzione Vercel

```
# Vercel Dashboard → Project → Settings → Environment Variables
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...
VITE_GOOGLE_CLIENT_ID=...
```

### File `.env.local` per sviluppo locale

Copia `.env.example` come `.env.local` e compila i valori:

```bash
cp .env.example .env.local
```

> `.env.local` è in `.gitignore` — non committarlo mai.

---

## Deploy con dati utente (Antonio Corsano)

Se il deploy da CLI fallisce per permessi:

1. Assicurati che git sia configurato con i tuoi dati:
   ```
   git config user.name "Antonio Corsano"
   git config user.email "antonio.corsano@gmail.com"
   ```
2. Fai un commit (anche vuoto):
   ```
   git commit --allow-empty -m "chore: trigger deploy with correct git author"
   git push
   ```
3. Esegui il deploy:
   ```
   npx vercel --prod --yes
   ```
4. Se la CLI fallisce ancora, usa la Vercel Dashboard:
   - https://vercel.com/dashboard → Progetto docentedoc-ai → Tab Deployments → ⋮ → Redeploy
   - Attendi "Ready" e aggiorna la pagina di produzione.

---

## Problema frequente: vendor-react Uncaught TypeError: Cannot read properties of undefined (reading 'default')

Se dopo il deploy vedi questo errore in console:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'default')
    at vendor-react-*.js
```

**Soluzione:**

1. Assicurati che tutte le dipendenze React siano allineate (una sola versione di react, react-dom, scheduler):
   ```
   npm ls react react-dom scheduler
   ```
2. Forza la deduplica in vite.config.ts aggiungendo:
   ```js
   resolve: {
     alias: {
       react: require('path').resolve(__dirname, 'node_modules/react'),
       'react-dom': require('path').resolve(__dirname, 'node_modules/react-dom'),
     },
   },
   ```
3. Ricostruisci e ridistribuisci:
   ```
   npm run build
   npx vercel --prod --yes
   ```
4. Fai Hard Refresh e svuota la cache nel browser.
