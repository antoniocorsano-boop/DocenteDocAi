<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DocenteDoc AI

> Nota: per regole di design, codice, test e collaborazione segui la fonte canonica [.github/copilot-instructions_v2.md](.github/copilot-instructions_v2.md) (MD3 custom-first, token-only, Tailwind solo layout, coverage ≥80%, file protetti).

Assistente AI per docenti basato su Google Gemini e architettura Local-First.

## ✨ Aura Design System (M3 Expressive)

L'applicazione utilizza il nuovo **Aura Design System**, un'evoluzione di Material Design 3 focalizzata sull'espressività e la chiarezza visiva:

- **Glassmorphism**: Utilizzo estensivo di `backdrop-blur-2xl` e trasparenze per un'interfaccia leggera e moderna.
- **Aura Aesthetic**: Palette cromatica dinamica con gradienti soffusi e "Aura Ornaments" (glow effects).
- **High-Radius Corners**: Angoli arrotondati fino a `48px` per un look organico e accogliente.
- **Centralized UI**: Tutti i componenti core sono centralizzati in `src/components/ui/` per massima coerenza.

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


## Deploy su Vercel (owner: antonio.corsano@gmail.com)

### 1. Deploy automatico (raccomandato)
- Effettua il push su main/master: Vercel esegue il deploy automatico.

### 2. Deploy manuale via dashboard
- Vai su: https://vercel.com/dashboard → docentedoc-ai
- Tab Deployments → Click sull’ultima build → “Redeploy”

### 3. Deploy da terminale (owner/account associato)
```bash
npx vercel --prod --yes
```
- Se richiesto, effettua login con Google (antonio.corsano@gmail.com).
- Se compare errore di permessi, assicurati che il progetto sia associato al tuo account/team e che tu sia owner.

### Checklist post-deploy
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] F12 Console: No errors
- [ ] No "document is undefined"
- [ ] Service Worker ✓ registrato
- [ ] manifest.json = 200
- [ ] Navigazione e feature OK

### Troubleshooting
- Se vedi errori di permessi: controlla che il progetto sia nel team/account giusto su Vercel.
- Se vedi errori “document is undefined”: assicurati che la build sia aggiornata (polyfill attivo).
- Consulta i log su Vercel Dashboard → Deployments → Logs.

---

## Deploying to Netlify

Quick steps to deploy the `dist/` build to Netlify using the CLI. The repository includes helper scripts in `scripts/`.

1. Create a Netlify personal access token and get your `SITE_ID`.
2. Build the project:

```bash
npm run build
```

3. Run the deploy script (POSIX):

```bash
NETLIFY_AUTH_TOKEN=your_token NETLIFY_SITE_ID=your_site_id ./scripts/deploy-netlify.sh
```

Or on Windows PowerShell:

```powershell
#$env:NETLIFY_AUTH_TOKEN = 'your_token'
#$env:NETLIFY_SITE_ID = 'your_site_id'
./scripts/deploy-netlify.ps1
```

The scripts use `npx netlify` under the hood and will build the app if `dist/` is missing.

---

## Resolving React `useState` Undefined Error

### Issue
The application encountered a `useState` undefined error due to incorrect chunk loading order. React was not properly initialized before other chunks were executed.

### Resolution Steps
1. **Verify React Version Compatibility**:
   - Ensure React and React DOM versions are compatible.
   - Confirmed React `18.2.0` and React DOM `18.2.0` in `package.json`.

2. **Inspect Chunk Loading Order**:
   - Verified that React (`react-vendor-Do1_TdCA.js`) was included in the vendor chunk.
   - Ensured React was loaded before other chunks.

3. **Update `index.html`**:
   - Modified the `index.html` file to explicitly load React before other chunks:
     ```html
     <script type="module" src="/assets/react-vendor-Do1_TdCA.js"></script>
     <script type="module" src="/assets/vendor-BbBeWqvy.js"></script>
     <script type="module" src="/assets/main-ztJSW1IK.js"></script>
     ```

4. **Test Locally**:
   - Ran the application locally using `npm run dev`.
   - Verified that the error was resolved.

5. **Redeploy**:
   - Deployed the updated application to Vercel using `npx vercel --prod --yes`.
   - Confirmed the fix on the production URL.

### Outcome
The `useState` undefined error was successfully resolved, and the application is now functioning correctly in both local and production environments.

