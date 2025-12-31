# Come usare Google Fonts localmente in Vite/React

1. **Scarica i font**
   - Vai su https://gwfh.mranftl.com/
   - Cerca il font desiderato (es: Roboto, Open Sans, ecc.)
   - Scegli i pesi e stili necessari
   - Scarica il pacchetto ZIP

2. **Copia i file**
   - Estrai i file `.woff2` (e `.woff` se vuoi compatibilità massima)
   - Copia i file nella cartella `public/fonts/` del tuo progetto

3. **Aggiungi il CSS dei font**
   - Dal sito Google Webfonts Helper copia il CSS generato (esempio sotto)
   - Incolla il CSS in un nuovo file, es: `src/fonts.css`
   - Esempio:
     ```css
     @font-face {
       font-family: 'Roboto';
       font-style: normal;
       font-weight: 400;
       src: url('/fonts/roboto-v30-latin-regular.woff2') format('woff2');
       font-display: swap;
     }
     @font-face {
       font-family: 'Roboto';
       font-style: normal;
       font-weight: 700;
       src: url('/fonts/roboto-v30-latin-700.woff2') format('woff2');
       font-display: swap;
     }
     /* Aggiungi altri pesi/stili se servono */
     ```

4. **Importa il CSS dei font**
   - In `src/index.css` o `src/App.tsx` aggiungi:
     ```js
     import './fonts.css';
     ```

5. **Usa il font nel CSS**
   - Esempio:
     ```css
     body {
       font-family: 'Roboto', Arial, sans-serif;
     }
     ```

6. **Rimuovi ogni link a Google Fonts da HTML**
   - Elimina `<link href="https://fonts.googleapis.com/..." rel="stylesheet">` da `index.html`

7. **Verifica**
   - Ricostruisci e controlla che i font siano caricati da `/fonts/` e non da URL esterni.

---
**Vantaggi:**
- Nessun problema CSP
- Funziona offline/PWA
- Privacy e performance migliori

---
Se vuoi posso generare il CSS per un font specifico, basta dirmi quale!