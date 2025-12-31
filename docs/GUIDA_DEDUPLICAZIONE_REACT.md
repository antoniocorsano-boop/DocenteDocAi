# Guida: deduplicazione React/ReactDOM/scheduler in Vite

**Obiettivo:** Evitare errori runtime come `Cannot read properties of undefined (reading 'unstable_scheduleCallback')` dovuti a più copie di React, ReactDOM o scheduler nel bundle.

---

## 1. Assicurati di avere UNA sola versione di React, ReactDOM e scheduler

- In `package.json`:
  ```json
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "scheduler": "^0.23.0" // (aggiungi se manca)
  ```
- Esegui:
  ```sh
  npm install
  ```

## 2. Controlla che non ci siano duplicati

- Esegui:
  ```sh
  npm ls react react-dom scheduler
  ```
- Tutte le dipendenze devono puntare alla stessa versione e percorso.

## 3. Configura Vite per deduplicare

In `vite.config.ts`:
```js
resolve: {
  alias: {
    react: require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    scheduler: require.resolve('scheduler'),
    // ...altro
  },
},
optimizeDeps: {
  include: ['react', 'react-dom', 'scheduler'],
},
```

## 4. Elimina cache e reinstalla

- Elimina `node_modules` e `package-lock.json`:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```

## 5. Ricostruisci e ridistribuisci

- Ricostruisci:
  ```sh
  npm run build
  ```
- Ridistribuisci su Vercel:
  ```sh
  npx vercel --prod --yes
  ```

## 6. Se usi monorepo/workspace

- Assicurati che tutte le sub-app puntino alla stessa versione di React/ReactDOM/scheduler.
- Usa sempre `nohoist` o `peerDependencies` se necessario.

---

**Nota:**
- Non installare React/ReactDOM come dipendenza di una libreria custom locale: devono essere solo `peerDependencies`.
- Se usi `@types/react` e `@types/react-dom`, assicurati che siano allineati alla versione di React.

---

**Verifica finale:**
- In produzione, nel DevTools > Sources > `react` e `scheduler` devono apparire una sola volta.
- Nessun errore runtime relativo a `unstable_scheduleCallback`.

---
Se vuoi posso controllare il tuo `package.json` o generare la sezione alias pronta per il tuo progetto.