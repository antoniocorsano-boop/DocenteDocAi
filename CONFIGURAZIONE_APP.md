# DocenteDoc AI - Configurazione e Installazione

## Requisiti
- Node.js 18+
- npm 9+
- Ambiente Windows, Mac o Linux

## Installazione
1. Clona la repository:
   ```bash
   git clone <repo-url>
   cd docentedoc-ai
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia in sviluppo:
   ```bash
   npm run dev
   ```
   L'app sarà disponibile su http://localhost:5173/

4. Build produzione:
   ```bash
   npm run build
   ```
   I file saranno generati in `dist/`

5. Deploy Vercel:
   ```bash
   npx vercel --prod --yes
   ```

## File Fondamentali
- `vite.config.ts` — Configurazione Vite, alias, chunk splitting
- `tsconfig.json` — Configurazione TypeScript, typeRoots
- `package.json` — Dipendenze e script
- `src/` — Codice sorgente React/TypeScript
- `index.html` — Entrypoint app


## Note
- React e React DOM sono deduplicati tramite alias in Vite
- Tutte le type definitions sono installate e risolte tramite `typeRoots`
- Chunk splitting ottimizzato in `vite.config.ts`
- Alias speciale per `scheduler` in `vite.config.ts`:
   - `scheduler: 'scheduler/cjs/scheduler.production.min.js'`
   - Questo forza l'import corretto del pacchetto Scheduler (interop CJS/ESM) e risolve errori di runtime in produzione con React 18
- Per problemi di build, controlla sempre i log Vite e la configurazione degli alias
