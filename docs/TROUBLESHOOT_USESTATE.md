# Schermo bianco in produzione: Cannot read properties of undefined (useState)

Sintomo: in alcuni ambienti di produzione la pagina può restituire uno schermo bianco e in console comparire l'errore:

```
Cannot read properties of undefined (reading 'useState')
```

Causa: si tratta in genere di una condizione di gara tra l'inizializzazione del runtime React (dispatcher dei hook) e l'esecuzione di moduli che al top-level invocano hook (ad es. store zustand importati in modo eager). La combinazione di chunking (dipendenze React in chunk separati) e di Service Worker che servono asset cached obsoleti può esacerbare la condizione.

Risoluzione rapida:

- Disabilitare temporaneamente il Service Worker (`VITE_ENABLE_SW=false`) e svuotare le cache del browser (Application → Clear storage), poi ricaricare con Hard Refresh.
- Verificare che il chunk `vendor-react` includa `react`, `react-dom`, `scheduler`, `react/jsx-runtime` e `use-sync-external-store`/shim (configurazione in `vite.config.ts` → `manualChunks`).
- Usare lazy-loading per gli store che usano hook: non importarli al top-level. Chiamare `preloadAllStores()` solo dopo che React è inizializzato (vedi `src/main.tsx` e `src/stores/lazyStores.ts`).
- Bump automatico del `CACHE_NAME` del service worker ad ogni deploy per invalidare asset vecchi.

Debug suggerito:

1. Aprire la pagina in Incognito con SW disabilitato; se la pagina funziona, invalidare SW e ri-deploy.
2. Raccogliere la prima riga di errore e lo stack dalla Console.
3. Eseguire lo snippet diagnostico in Console per ispezionare il chunk React (se disponibile):

```js
(async () => {
  try {
    console.log('dynamic import start');
    const mod = await import('/assets/vendor-react-C8z8Z-S_.js');
    console.log('vendor-react exports keys:', Object.keys(mod));
    console.log('vendor-react.r value:', mod.r);
  } catch (err) {
    console.error('dynamic-import-error', err);
  }
})();
```

File correlati:

- `src/main.tsx` — bootstrap asincrono e preload degli store
- `src/stores/lazyStores.ts` — accessor/lazy getters per gli store
- `vite.config.ts` — `manualChunks` per raggruppare moduli React
- `dist/service-worker.js` — `CACHE_NAME` per invalidazione

Note:
- Aggiungere smoke test CI che eseguano la build di produzione e aprano la root URL per verificare assenza di errori JS su load.
