# DocenteDoc AI - File Fondamentali (Tracking)

Questa lista tiene traccia dei file chiave per la configurazione e il funzionamento dell'app. Aggiorna questo file ogni volta che modifichi uno di questi file.

## File Chiave
- vite.config.ts
- tsconfig.json
- package.json
- index.html
- src/

## Ultima revisione: 30/12/2025


### Modifiche recenti
- Alias `scheduler` forzato su entry CJS in vite.config.ts per fixare errore runtime in produzione (React 18)
- Deduplicazione React/React DOM in vite.config.ts
- typeRoots aggiunto in tsconfig.json
- Cleanup e reinstallazione dipendenze
- Build e dev testati con successo
