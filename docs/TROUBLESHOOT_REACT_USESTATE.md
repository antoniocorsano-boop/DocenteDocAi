# BUG: React/useState undefined in Vite + Vercel SPA

## Sintomo
- Errore JS: `Cannot read properties of undefined (reading 'useState')` su chunk vendor.
- Pagina bianca, React non si inizializza.

## Causa
- I chunk JS non vengono caricati in ordine: React non è disponibile quando vendor/main lo richiedono.
- Il browser non garantisce l'ordine di caricamento dei chunk dinamici.

## Soluzione
1. **Forzare preload dei chunk JS in ordine corretto in `index.html`:**
   - Preload React prima di vendor/main:
     ```html
     <link rel="modulepreload" href="/assets/react-vendor-...js">
     <link rel="modulepreload" href="/assets/vendor-...js">
     <link rel="modulepreload" href="/assets/main-...js">
     <script type="module" src="/src/main.tsx"></script>
     ```
   - Usa i nomi reali dei file generati in `dist/assets`.
2. **Verifica ordine di caricamento con uno script JS in console:**
   ```js
   Array.from(document.scripts).map(s => s.src)
   ```
   - React deve essere caricato prima di vendor/main.
3. **Documenta la procedura nel README o in una sezione troubleshooting.**

## Note
- Questo problema può verificarsi con Vite, Rollup, Webpack e qualsiasi bundler che usa chunk splitting.
- Il preload garantisce che le dipendenze siano disponibili prima dell'esecuzione.
- Se cambi i nomi dei chunk (nuova build), aggiorna i preload in `index.html`.

---
Ultimo aggiornamento: 2025-12-30
