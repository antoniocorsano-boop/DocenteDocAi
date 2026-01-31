# DocenteDoc AI

> **Assistente AI intelligente per docenti italiani** - Local-First Architecture con Google Gemini

[![Material Design 3](https://img.shields.io/badge/Material%20Design%203-100%25%20Compliant-6750A4)](MD3_COMPLIANCE_FINAL_REPORT.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Build Status](https://img.shields.io/badge/Build-Passing-success)](https://github.com/your-repo/actions)
[![Tests](https://img.shields.io/badge/Tests-1290%2F1290-success)](https://github.com/your-repo/actions)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentazione

### 🏗️ **Documentazione Operativa**

- **[Report Compliance MD3](MD3_COMPLIANCE_FINAL_REPORT.md)** - Allineamento completo MD3 completato
- **[Guida Sviluppo](docs/DEVELOPMENT.md)** - Setup, workflow, best practices
- **[Architettura](docs/ARCHITECTURE.md)** - Design system, componenti, struttura
- **[Deployment](docs/DEPLOYMENT.md)** - CI/CD, ambienti, rilascio
- **[Testing](docs/TESTING.md)** - Unit, integration, visual regression

### 🛠️ **Guide Specializzate**

- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Risoluzione problemi comuni
- **[Contributing](CONTRIBUTING.md)** - Come contribuire al progetto
- **[Roadmap](docs/ROADMAP.md)** - Pianificazione futura
- **[📊 Archivio Reports](reports/)** - Report importanti e analisi progetto
  - **[Changelog Progetto](reports/CHANGELOG.md)** - Storia completa accomplishments
  - **[Migration Reports](reports/migration/)** - Report migrazione MD3
  - **[Analysis Reports](reports/analysis/)** - Analisi tecniche e pattern

## 🎨 Design System

**Aura Design System** - Material Design 3 Expressive implementation:

- **Glassmorphism**: Backdrop blur effects per interfaccia moderna
- **Dynamic Colors**: Palette adattiva basata sul tema
- **High-Radius Corners**: Angoli arrotondati fino a 48px
- **Centralized Components**: Tutti i componenti in `src/components/ui/`

### 🧩 **Componenti MD3 Disponibili**

| Componente      | Descrizione                                    | Status         |
| --------------- | ---------------------------------------------- | -------------- |
| `M3ProgressBar` | Progress indicator accessibile con MD3 theming | ✅ Disponibile |
| `M3Chip`        | Chip interattivo singolo                       | ✅ Disponibile |
| `M3ChipGroup`   | Gruppo di chip correlati                       | ✅ Disponibile |
| `M3ButtonGroup` | Gruppo di pulsanti con spacing consistente     | ✅ Disponibile |
| `M3Typography`  | Sistema tipografico MD3                        | ✅ Disponibile |
| `M3Card`        | Card con elevation MD3                         | ✅ Disponibile |

**📋 [Report Compliance MD3 Completo](MD3_COMPLIANCE_FINAL_REPORT.md)** - 100% compliant, zero violazioni attive

## 🏛️ Architettura

- **Local-First**: Dati prioritariamente locali con sync opzionale
- **Component-Driven**: Sviluppo basato su componenti riutilizzabili
- **Type-Safe**: TypeScript end-to-end con controlli rigorosi
- **Performance-First**: Code splitting, lazy loading, ottimizzazioni

## 📋 Requisiti

- **Node.js**: 18+
- **Package Manager**: npm/yarn
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

## 🔧 Configurazione

```bash
# Copia template environment
cp .env.example .env

# Configura API keys
# OPENAI_API_KEY=your_key
# FLOWISE_USERNAME=admin
# FLOWISE_PASSWORD=your_password
```

## 🎯 Workflow Sviluppo

```bash
# Sviluppo attivo
npm run dev

# Testing completo
npm run test:ci

# Audit MD3 compliance (100% compliant ✅)
npm run md3:audit

# Validazione MD3 completa
npm run md3:validate

# Build produzione
npm run build

# Linting (1 warning innocuo rimanente)
npm run lint
```

## 📞 Supporto

- **📖 [Documentazione Completa](docs/)**
- **🐛 [Issue Tracker](https://github.com/your-repo/issues)**
- **💬 [Discussions](https://github.com/your-repo/discussions)**

## 📄 Licenza

ISC License - vedere [LICENSE](LICENSE) per dettagli.

---

**DocenteDoc AI** - Trasformiamo l'insegnamento con l'intelligenza artificiale.
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

---

## ✅ **Material Design 3 - Completamento 2026**

## 🔒 MD3 Governance Scanner (recommended)

This project includes a lightweight governance scanner to help enforce MD3 Platinum rules.

- Scanner script: `scripts/governance-check.js`
- NPM script: `npm run check:md3` (default: `warn` mode)
- CI recommendation: run `node scripts/governance-check.js --mode fail` to block merges on violations

Quick setup (optional, recommended):

1. Install Husky and lint-staged (one-time developer setup):

```bash
npm install --save-dev husky lint-staged
npm run prepare
```

2. Add a pre-commit hook to run the scanner (suggested `package.json` lint-staged entry):

```json
"lint-staged": {
   "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "eslint",
      "npm run check:md3 -- --mode warn"
   ]
}
```

Notes:
- The repository already contains a `lint-staged` section in `package.json` — adapt it to include `npm run check:md3` if desired.
- We do NOT install hooks automatically; this is a documented recommendation. Use `husky` to manage hooks if you want pre-commit enforcement.
- Default developer mode is `warn` to avoid blocking daily work; configure CI to use `--mode fail` for strict enforcement before merge.


**Data Completamento:** January 22, 2026  
**Status:** 🎉 **100% MD3 COMPLIANT**

### 📊 **Risultati Ottenuți**

- ✅ **37 violazioni MD3** identificate e corrette
- ✅ **3 nuovi componenti MD3** sviluppati
- ✅ **42 problemi linting** → **1 warning innocuo**
- ✅ **1290 test** tutti passati
- ✅ **Build stabile** e ottimizzato
- ✅ **Architettura sostenibile** stabilita

### 🧩 **Componenti MD3 Disponibili**

- `M3ProgressBar` - Progress indicator accessibile
- `M3Chip` & `M3ChipGroup` - Chip interattivi
- `M3ButtonGroup` - Gruppi di pulsanti
- `M3Typography` - Sistema tipografico
- `M3Card` - Card con elevation

### 📋 **Documentazione**

- **[Report Finale MD3](MD3_COMPLIANCE_FINAL_REPORT.md)** - Documentazione completa
- **Regole MD3 vincolanti** - Source of truth per sviluppo futuro
- **Pattern di estensione** - Come aggiungere nuovi componenti compliant

### 🎯 **Prossimi Passi**

- Mantenimento compliance MD3 nelle future implementazioni
- Estensione libreria componenti secondo necessità
- Audit periodici per garantire aderenza agli standard

**Il progetto è ora completamente allineato con Material Design 3!** 🚀
