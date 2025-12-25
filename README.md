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

### View names & Linting ✅

- Use canonical Italian view names when adding new views (examples: `calendario`, `uda`, `reportistica`, `didattica-inclusiva`, `consiglio-di-classe`).
- English aliases are accepted for backward compatibility but **prefer** the Italian canonical token.
- An ESLint rule enforces this: run `npm run lint` to validate strings in the codebase. If you introduce a new view name, update `ViewRouters.tsx` and adjust lint rules in `.eslintrc.cjs` if a new alias is required.

## Licenza

MIT
