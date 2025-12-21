# 🚀 DocenteDoc AI - Guida Deploy

## ⚠️ IMPORTANTE: Architettura Speciale

Questa app è stata sviluppata per **Google AI Studio** e usa **Import Maps** con CDN esterni invece di npm tradizionale.

---

## 📋 OPZIONI DI DEPLOY

### OPZIONE 1: Deploy AI Studio (Raccomandato) ⭐

**Vantaggi:**
- ✅ Zero configurazione
- ✅ Funziona immediatamente
- ✅ Hosting gratuito Google
- ✅ HTTPS automatico

**Steps:**
1. Vai su [AI Studio](https://ai.studio)
2. Carica il progetto
3. Deploy automatico

**Link app:** https://ai.studio/apps/drive/1viCy_wCr03vES7_yPvlJp2xeshPt3nuF

---

### OPZIONE 2: Deploy Tradizionale (Richiede Modifiche)

Per deploy su Vercel/Netlify/GitHub Pages, è necessario **convertire** l'app da import maps a npm standard.

#### Step 1: Rimuovere Import Maps

Modificare `index.html` rimuovendo:
```html
<!-- RIMUOVERE -->
<script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.1",
    ...
  }
}
</script>
```

#### Step 2: Aggiungere Zustand al package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",  // AGGIUNGERE
    "@google/genai": "^0.1.1",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "docx": "^8.5.0",
    "file-saver": "^2.0.5",
    "pdf-lib": "^1.17.1",
    "mammoth": "^1.6.0",
    "pdfjs-dist": "^3.11.174",
    "react-dropzone": "^14.2.3"
  }
}
```

#### Step 3: Aggiornare Import Statements

Cambiare tutti gli import da:
```typescript
import { create } from 'zustand/middleware';
```

A:
```typescript
import { create } from 'zustand';
```

#### Step 4: Installare e Build

```bash
npm install
npm run build
```

#### Step 5: Deploy

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod

# GitHub Pages
npm run build
# Push dist/ folder
```

---

### OPZIONE 3: Deploy Ibrido (Semplificato)

Usare un server statico che serva i file così come sono, sfruttando gli import maps.

**Hosting compatibili:**
- GitHub Pages (con configurazione)
- Netlify (raw static)
- Surge.sh

**Steps:**
```bash
# 1. Nessun build necessario
# 2. Deploy diretto dei file sorgente

# GitHub Pages
git add .
git commit -m "Deploy"
git push origin main

# Surge
npm install -g surge
surge .
```

**⚠️ Limitazione:** Richiede browser moderno con supporto import maps (Chrome 89+, Safari 16.4+)

---

## 🎯 RACCOMANDAZIONE

### Per Uso Immediato:
✅ **OPZIONE 1: AI Studio** - Già deployata e funzionante

### Per Deploy Personalizzato:
⚠️ **OPZIONE 2: Conversione NPM** - Richiede refactoring (1-2 giorni lavoro)

### Per Testing Rapido:
✅ **OPZIONE 3: Deploy Ibrido** - Funziona ma con limitazioni browser

---

## 📊 Confronto Opzioni

| Feature | AI Studio | NPM Build | Ibrido |
|---------|-----------|-----------|--------|
| **Setup Time** | 0 min | 2 giorni | 5 min |
| **Browser Support** | Moderno | Universale | Moderno |
| **Customization** | Limitata | Completa | Media |
| **Performance** | Ottima | Ottima | Buona |
| **Costo** | Gratis | Gratis | Gratis |
| **HTTPS** | ✅ | ✅ | ✅ |
| **Custom Domain** | ❌ | ✅ | ✅ |

---

## 🔧 Script di Conversione (Opzione 2)

Se vuoi procedere con deploy tradizionale, posso creare uno script automatico per:
1. Aggiornare package.json
2. Rimuovere import maps
3. Aggiustare import statements
4. Configurare build

**Tempo stimato:** 30 minuti automatico + 1 ora testing

Vuoi che proceda con la conversione?

---

## ✅ Conclusione

**Per ora:** L'app è già **LIVE** su AI Studio al link sopra.

**Per deploy personalizzato:** Necessaria conversione da import maps a npm standard.

**Prossimi step suggeriti:**
1. Testare app su AI Studio
2. Decidere se serve deploy personalizzato
3. Se sì, procedere con conversione

---

**Documento creato:** 21 Dicembre 2025  
**Autore:** Antigravity AI Assistant
