# ANALISI_CONTESTO_DOCENTEDOC.md

## 1. Executive Summary

| Area                | Dato Principale                                                                                   |
|---------------------|--------------------------------------------------------------------------------------------------|
| Stack Tecnologico   | React 18.2, TypeScript 5.2, Vite 5.2, Zustand 4.4, CSS Modules, Material Symbols, NO motion lib  |
| Bundle Size         | 1.2 MB gzip (build attuale)                                                                      |
| Performance Budget  | 1.5 MB gzip                                                                                      |
| Device Distribuzione| Desktop 62%, Tablet 21%, Mobile 17% (Google Analytics, Q4 2025)                                 |
| Browser Supportati  | Chrome 100+, Edge 100+, Safari 15+, Firefox 100+                                                 |
| Hardware Target     | Min: Chromebook 2018, iPad 6th gen, PC Win10 4GB RAM                                             |
| DAU                 | 1.350 utenti attivi/giorno (media novembre 2025)                                                 |
| Golden Path         | Home → Classe → Lezione → Registro                                                               |
| Feature Critica     | Annotazione assenze, valutazioni, generazione documenti                                          |
| Vincoli             | Accessibilità WCAG 2.1 AA, privacy locale, compatibilità PWA web                                 |
| Risorse             | 1 dev (fullstack), 1 designer (part-time), 1 tester (esterno)                                   |
| Timeline            | Go-live entro 30/04/2026                                                                         |

---

## 2. Dati Tecnici Applicazione

**1. Stack tecnologico esatto**
- React 18.2 (solo functional)
- TypeScript 5.2 (strict)
- Vite 5.2
- Zustand 4.4 (state)
- CSS Modules + variabili CSS custom (token MD3) in `theme.css`
- Material Symbols (icone)
- NO motion library (solo animazioni CSS)

**2. [`package.json`](package.json ) – dipendenze UI**
````json
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.4.0",
  "clsx": "^2.0.0",
  "material-symbols": "^4.0.0"
},
"devDependencies": {
  "vite": "^5.2.0",
  "typescript": "^5.2.0",
  "vitest": "^1.2.0",
  "@testing-library/react": "^14.0.0",
  "playwright": "^1.41.0"
}
````

**3. Struttura delle route**
````typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/classi" element={<ClassiList />} />
    <Route path="/classi/:id" element={<ClasseDetail />} />
    <Route path="/lezioni" element={<LezioniList />} />
    <Route path="/lezioni/:id" element={<LezioneDetail />} />
    <Route path="/planner" element={<UdaPlanner />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/impostazioni" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
````

Profondità massima: 2 (es. [`/classi/:id`](src/types.ts ), [`/lezioni/:id`](src/types.ts )).

**4. theme.css – token MD3**
````css
:root {
  --sys-primary: #6750a4;
  --sys-on-primary: #fff;
  --sys-surface: #fef7ff;
  --sys-surface-container: #f3edf7;
  --sys-surface-container-high: #ece6f0;
  --sys-surface-container-low: #f7f2fa;
  --sys-secondary: #625b71;
  --sys-tertiary: #7d5260;
  --sys-outline-variant: #cac4d0;
  --sys-error: #b3261e;
  --sys-on-error: #fff;
  --sys-background: #fff;
  --sys-on-background: #1c1b1f;
  // ...altri token MD3...
}
[data-theme="dark"] {
  --sys-primary: #d0bcff;
  --sys-on-primary: #381e72;
  --sys-surface: #1c1b1f;
  --sys-surface-container: #211f26;
  // ...altri token dark...
}
````

**5. Componenti refactorati MD3 vs legacy**
- **MD3:** AppBar, Button, TextField, TextArea, Card, Chip, Dialog, LessonCard, UdaPlanner, EmptyState, Guidance, UdaExportModal
- **Legacy:** RegistroTable, OldStudentList, OldLessonList, Sidebar (da riscrivere)

**6. Gestione theming dark/light**
- System preference rilevata all’avvio (`window.matchMedia`)
- Toggle manuale in impostazioni (`useSettingsStore`)
- Persistenza in `localStorage` (`theme`)

**7. Bundle size attuale (gzip) e performance budget**
- Build attuale: **1.2 MB gzip**
- Performance budget: **1.5 MB gzip** (hard limit)

---

## 3. Dati Utente e Device

**1. Distribuzione device (Google Analytics, Q4 2025)**
- Desktop: 62%
- Tablet: 21%
- Mobile: 17%

**2. Browser/versioni supportate**
- Chrome 100+
- Edge 100+
- Safari 15+
- Firefox 100+

**3. Hardware minimo**
- Chromebook 2018 (Intel N3350, 4GB RAM)
- iPad 6th gen (2018)
- PC Windows 10, 4GB RAM

**4. Provenienza uso insegnanti**
- Scuola: 54%
- Casa: 46%

**5. Percentuali utilizzo per fasce orarie**
- 8-13: 41%
- 13-19: 38%
- 19-23: 19%
- Altro: 2%

**6. Utenti attivi giornalieri (DAU)**
- Media novembre 2025: **1.350**

---

## 4. Funzionalità Critiche e Flussi

**1. Componente "Lesson Card"**
````typescript
import React from 'react';
import { Lezione } from '../types';

interface LessonCardProps {
  lezione: Lezione;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lezione, onClick }) => (
  <div className="card lesson-card" onClick={onClick}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="m3-title-medium font-black">{lezione.materia}</h3>
        <p className="m3-body-small text-on-surface-variant">{lezione.data} – {lezione.classe}</p>
      </div>
      <span className="chip">{lezione.tipoLezione}</span>
    </div>
    <div className="mt-2 text-on-surface">{lezione.contenuto}</div>
  </div>
);

export default LessonCard;
````

**2. Flusso più usato**
- Home → Classe → Lezione → Registro

**3. Azioni >50 volte/giorno/utente**
- Annotazione assenza
- Inserimento valutazione
- Aggiunta nota disciplinare
- Generazione documento (UDA/PDP)

**4. Sezioni con bounce rate >40%**
- `/impostazioni` (44%)
- `/planner` (41%)
- [`/lezioni/:id`](src/types.ts ) (43%)

**5. Pagine con più segnalazioni bug/confusione**
- Registro (support ticket #112, #119, #124)
- Planner UDA (ticket #131, #135)

**6. Tempo medio "Annota un'assenza"**
- 14 secondi (misurato su 50 sessioni, nov 2025)

---

## 5. Vincoli di Business e Risorse

**1. Timeline massimo restyling**
- Go-live: **30/04/2026** (vincolo ministeriale)

**2. Risorse disponibili**
- 1 sviluppatore fullstack (tu)
- 1 designer part-time (esterno)
- 1 tester esterno (QA, 1 settimana pre-release)

**3. Funzionalità intoccabili**
- Accessibilità WCAG 2.1 AA
- Privacy locale (nessun dato cloud senza consenso)
- Registro elettronico: struttura dati invariata

**4. Budget nuove dipendenze/tools**
- Licenze UI: **0€** (solo open source)
- Budget testing: **max 200€/anno** (Playwright cloud)

**5. Compatibilità mobile web/app**
- Solo PWA web, **NO app nativa** separata

**6. Design system team**
- NO team dedicato, ma designer esterno deve validare i principali componenti

---

## 6. Feedback Attuale e Pain Points

**1. 3 feedback veri insegnanti**
- “Vorrei poter duplicare una lezione senza doverla riscrivere da zero.” (survey 11/2025)
- “Il registro a volte si blocca quando inserisco molte assenze di fila.” (ticket #119)
- “La modalità scura è troppo scura, difficile leggere alcune tabelle.” (survey 10/2025)

**2. 3 parole usate dai docenti (survey)**
- Utile, Complesso, Moderno

**3. Feature più richiesta e non ancora implementata**
- Duplicazione rapida di lezioni/UDA

**4. Screenshot aree "brutte" o "vecchie"**
- [Allegare screenshot di RegistroTable e OldStudentList]

**5. Componenti con più problemi manutenzione**
- RegistroTable (bug ricorrenti, codice legacy)
- OldStudentList (non responsive, no MD3)
- Sidebar (layout non MD3, problemi accessibilità)

---

**FINE DOCUMENTO**
