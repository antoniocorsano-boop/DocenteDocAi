
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

### 1. M3 Expressive & Aura UI
Libreria di componenti atomici e molecolari basata su Material Design 3 con estetica Aura (glassmorphism).
*   **`AiThinkingGem`**: Indicatore di stato per processi AI.
*   **`InfoCard`**: Card informativa con supporto per contesti pedagogici.

### 2. AI Service Layer (`services/aiService.ts`)
Architettura a due livelli per l'intelligenza artificiale:
*   **Tiered Models**: Uso di `gemini-3-pro-preview` per ragionamento complesso e `gemini-3-flash-preview` per velocità.
*   **Centralized Prompts**: Tutti i prompt sono gestiti in `aiPrompts.ts` con pattern Task-Context-Output.
*   **Context Injection**: Le chiamate AI ricevono automaticamente dati su BES/DSA e contesto di vista.

### 3. State Management (Zustand)
Attualmente basato su un unico store centrale `useDataStore`.
*   ⚠️ **Rischio Architetturale**: Lo store sta diventando un "God Object". È pianificato un refactoring per suddividere lo stato in domini (Studenti, Didattica, Configurazione).

---

## 💾 Strategia Dati & Inclusione

1.  **Local-First**: Tutti i dati sensibili (PDP/PEI) risiedono sul dispositivo.
2.  **Inclusion Logic**: La logica BES/DSA è trasversale e influenza ogni suggerimento AI.
3.  **Google Drive (Cloud)**: Backup cifrato del dump JSON.

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