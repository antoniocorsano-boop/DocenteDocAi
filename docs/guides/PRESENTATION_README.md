# 🎬 DocenteDoc AI - Video di Presentazione

Questo progetto include strumenti automatizzati per creare video di presentazione e screenshot dell'applicazione DocenteDoc AI utilizzando Playwright.

## 📋 Prerequisiti

- Node.js e npm installati
- Playwright configurato (`npm install` include già Playwright)
- FFmpeg installato (opzionale, per generazione video di alta qualità)

## 🚀 Come Creare una Presentazione

### 1. Catturare gli Screenshot

Esegui il test Playwright per catturare screenshot automatici:

```bash
npm run test:presentation
```

Questo comando:
- Avvia il server di sviluppo
- Naviga attraverso l'applicazione
- Cattura 10 screenshot chiave delle funzionalità principali
- Salva gli screenshot nella cartella `presentation-screenshots/`

### 2. Generare il Video/HTML

Dopo aver catturato gli screenshot, genera la presentazione:

```bash
npm run presentation:video
```

Questo comando:
- **Con FFmpeg installato**: Crea un video MP4 di alta qualità
- **Senza FFmpeg**: Crea una presentazione HTML interattiva

## 📸 Screenshot Catturati

Il sistema cattura automaticamente questi screenshot:

1. **01-landing-hero.png** - Homepage con sezione hero e metriche
2. **02-quick-actions.png** - Azioni rapide (Appello, Valutazioni, Registro, Progettazione)
3. **03-ai-suggestion.png** - Suggerimenti IA attivi
4. **04-next-lesson.png** - Sezione prossima lezione
5. **05-appello-view.png** - Vista gestione presenze
6. **06-valutazioni-view.png** - Vista valutazioni e voti
7. **07-progettazione-view.png** - Vista pianificazione didattica
8. **08-settings-panel.png** - Pannello impostazioni
9. **09-mobile-view.png** - Vista responsive mobile
10. **10-scroll-demonstration.png** - Dimostrazione scrolling

## 🎬 Caratteristiche della Presentazione

### Video MP4 (con FFmpeg)
- **Durata**: ~25 secondi (2-3 secondi per slide)
- **Risoluzione**: 1920x1080 (Full HD)
- **Codec**: H.264 con ottimizzazioni web
- **Transizioni**: Dissolvenza automatica tra slide

### Presentazione HTML (fallback)
- **Navigazione**: Tasti freccia e pulsanti
- **Auto-play**: Riproduzione automatica ogni 3 secondi
- **Responsive**: Adattabile a qualsiasi schermo
- **Controlli**: Play/Pause, navigazione manuale

## 🛠️ Installazione FFmpeg (Opzionale)

### Windows (Chocolatey)
```bash
choco install ffmpeg
```

### Windows (Manuale)
1. Scarica FFmpeg da https://ffmpeg.org/download.html
2. Aggiungi al PATH di sistema

### macOS (Homebrew)
```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt install ffmpeg
```

## 📁 Struttura dei File

```
presentation-screenshots/
├── 01-landing-hero.png
├── 02-quick-actions.png
├── 03-ai-suggestion.png
├── ...
└── 10-scroll-demonstration.png

docentedoc-ai-presentation.mp4    # Video (se FFmpeg disponibile)
docentedoc-ai-presentation.html   # Presentazione HTML (fallback)
```

## 🎯 Utilizzo della Presentazione

### Per Presentazioni dal Vivo
- Usa la **versione HTML** per controllo interattivo
- Naviga con tasti freccia o mouse
- Modalità auto-play per dimostrazioni automatiche

### Per Video Marketing
- Usa il **video MP4** per piattaforme social
- Alta qualità e compressione ottimizzata
- Perfetto per YouTube, LinkedIn, ecc.

### Per Documentazione
- Gli **screenshot individuali** possono essere usati in documentazione
- Ogni immagine rappresenta una funzionalità chiave

## 🔧 Personalizzazione

### Modificare i Tempi di Visualizzazione
Modifica il file `scripts/generate-presentation-video.js`:
```javascript
const duration = index === screenshotFiles.length - 1 ? 3 : 2; // 3s per ultima slide, 2s per altre
```

### Aggiungere Nuove Slide
1. Aggiungi un nuovo test nel file `presentation-screenshots.spec.ts`
2. Assegna un numero sequenziale al nome del file
3. Aggiorna l'array `titles` nello script di generazione

### Cambiare Risoluzione
Modifica nel file di test:
```typescript
await page.setViewportSize({ width: 1920, height: 1080 }); // Cambia risoluzione qui
```

## 📊 Metriche e Statistiche

Dopo l'esecuzione, il sistema fornisce:
- Numero di screenshot catturati
- Tempo di generazione video
- Dimensioni file generate
- Statistiche di compressione

## 🐛 Troubleshooting

### Errore: "Dev server not found"
- Assicurati che la porta 5173 sia libera
- Verifica che `npm run dev` funzioni correttamente

### Errore: "Screenshot timeout"
- Aumenta i timeout nei test
- Verifica che l'applicazione carichi correttamente

### Video non si genera
- Installa FFmpeg
- Verifica che gli screenshot esistano
- Controlla i permessi di scrittura

## 📞 Supporto

Per problemi o domande:
1. Verifica i log della console durante l'esecuzione
2. Controlla che tutti i prerequisiti siano installati
3. Consulta la documentazione Playwright per configurazioni avanzate

---

**🎓 DocenteDoc AI** - Trasformiamo l'insegnamento con l'intelligenza artificiale.