# Deploy Vercel – DocenteDoc AI

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
