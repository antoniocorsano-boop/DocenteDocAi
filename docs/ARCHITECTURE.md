
# Architettura del Sistema: OrarioDoc AI

Documentazione tecnica per sviluppatori e manutentori.

---

## 🏗️ Stack Tecnologico

*   **Core:** React 18 + TypeScript.
*   **Styling:** Architettura CSS Modulare nativa (M3 Expressive).
*   **AI:** Google GenAI SDK.
*   **Persistence:** LocalStorage + IndexedDB + Google Drive API.

---

## 🧩 Componenti Core & Design System

### 1. M3 Expressive Components (`components/M3Components.tsx`)
Nuova libreria di componenti atomici per garantire coerenza visiva:
*   **`ActionTile`:** Tessera orizzontale compatta con icona, titolo, sottotitolo e variante colore semantica (Primary, Secondary, Tertiary). Sostituisce le card eterogenee.
*   **`SectionHeader`:** Intestazioni di sezione standardizzate.

### 2. Operations Center (`components/OperationsCenter.tsx`)
Implementa il pattern **"Process Definition"**:
*   Ogni funzionalità è definita come oggetto `ProcessDef` (metadati, step, target).
*   La UI renderizza dinamicamente la griglia o la vista dettaglio.
*   Separa la logica di *navigazione* dalla logica di *presentazione*.

### 3. Suggestion Engine (`utils/suggestionUtils.ts`)
Un motore logico puro che analizza lo stato dell'app (`students`, `slots`, `udas`) e restituisce un `suggestionId`.
*   Guida l'utente attraverso il ciclo di vita (Setup -> Planning -> Daily).
*   Pilota il badge di notifica sull'Header.

---

## 💾 Strategia Dati

1.  **LocalStorage (Sync):** Stato leggero (JSON).
2.  **IndexedDB (Async):** Stato pesante (Blob/Text).
3.  **Google Drive (Cloud):** Backup remoto del dump completo JSON.

---

## 📂 Struttura Cartelle Aggiornata

*   `components/`: UI React.
    *   `M3Components.tsx`: Libreria UI atomica.
    *   `OperationsCenter.tsx`: Hub centrale.
*   `utils/`: Helper puri.
    *   `suggestionUtils.ts`: Logica proattiva.
*   `services/`: Logica di business (AI, Drive, DB).
*   `design-system/`: Token CSS.

---

*Aggiornato al: Versione 3.6 Expressive*