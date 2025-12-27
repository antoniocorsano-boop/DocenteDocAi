<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DocenteDoc AI

Assistente AI per docenti basato su Flowise.

## Requisiti

- Node.js 18+
- npm o yarn

## Installazione

```bash
npm install
```

## Configurazione

Crea un file `.env` con le seguenti variabili:

```env
# API Keys
OPENAI_API_KEY=your_openai_key

# Flowise
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=your_password
```

## Avvio

```bash
npm start
```

### Enabling Google Sign-In (GSI) in development
By default the app **skips** loading Google Identity (GSI) in development to avoid noisy 403s when the OAuth Client ID is not configured for localhost. To enable GSI in dev set the following in a local `.env` file (not checked into git):

```bash
VITE_ENABLE_GSI_DEV=true
VITE_GSI_CLIENT_ID=your-dev-client-id.apps.googleusercontent.com
```

Then restart the dev server. The app will load GSI scripts and use `VITE_GSI_CLIENT_ID` as the client id when `VITE_ENABLE_GSI_DEV` is true.

### Running the GSI E2E test
You can run the new E2E test that verifies GSI loads in development. Provide a valid `VITE_GSI_CLIENT_ID` and enable the toggle when running the test.

POSIX/macOS/Linux:

```bash
VITE_ENABLE_GSI_DEV=true VITE_GSI_CLIENT_ID=your-dev-client-id npx playwright test e2e/gsi.spec.ts
```

Windows (PowerShell):

```powershell
$env:VITE_ENABLE_GSI_DEV = 'true'; $env:VITE_GSI_CLIENT_ID = 'your-dev-client-id'; npx playwright test e2e/gsi.spec.ts
```

The project also includes convenient npm scripts:
- `npm run e2e:gsi` (POSIX) and `npm run e2e:gsi:win` (Windows) which use a placeholder client id — replace it with your real dev client id in `.env` or the script before running.

### View names & Linting ✅

- Use canonical Italian view names when adding new views (examples: `calendario`, `uda`, `reportistica`, `didattica-inclusiva`, `consiglio-di-classe`).
- English aliases are accepted for backward compatibility but **prefer** the Italian canonical token.
- An ESLint rule enforces this: run `npm run lint` to validate strings in the codebase. If you introduce a new view name, update `ViewRouters.tsx` and adjust lint rules in `.eslintrc.cjs` if a new alias is required.

## Licenza

MIT

## Screenshot automation

Quick instructions to capture UI screenshots (uses Playwright + an embedded static server):

Build the project and run the script:

```bash
npm run build
node scripts/capture-screenshots.cjs
```

Screenshots are written to `docs/screenshots/`.

If you prefer to run the script in ESM environments, there's also a JS variant `scripts/capture-screenshots.js` which
expects `node --experimental-specifier-resolution=node` or being executed in an environment that supports ES modules.
