# Orbit Jarvis Copilot — Blueprint Definitivo

> Versione: 1.2 — Marzo 2026  
> Stato: ✅ Pilota operativo — pronto per testing e onboarding

---

## 1. Obiettivo principale

Creare un **agente intelligente contestuale**, disponibile **al momento giusto**, che:

- **Prevede e suggerisce azioni** basate su ruolo, contesto, impegni e storico attività.
- **Integra tutte le intelligenze del sistema**: CognitiveLayer, CapabilitySystem, TrustChain.
- Fornisce **accesso sicuro e contestuale** al mondo esterno: file, email, screenshot, deliverables.
- Mantiene **UX minimale e fluida**, senza menu complessi o interruzioni.
- Traccia tutto, garantendo **audit, trust e compliance**.

---

## 2. Principi Architetturali

| Principio                          | Descrizione                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| **Contestualità dinamica**         | L'agente si attiva solo quando rilevante (orario, entry, task, evento).        |
| **Ephemeral OrchestrationContext** | Contesto calcolato al volo, aggrega: suggerimenti, capabilities, trust status. |
| **Intelligenza multi-modulo**      | Usa CognitiveLayer, CapabilitySystem e TrustChain in sinergia.                 |
| **Feedback micro**                 | Toast rapidi, overlay radiale, tooltip "Non disponibile" per azioni bloccate.  |
| **Interazione naturale**           | Orbital overlay, gesture, hotkey, drag&drop, clipboard.                        |
| **Audit completo**                 | Ogni azione genera record in TrustChain e permette retrotracciabilità.         |

---

## 3. Componenti Principali

### 3.1 Copilot Core

- **Funzione:** cervello centrale che decide _cosa può o deve fare l'utente_.
- **Inputs:** UserContext (ruolo, impegni, preferenze), entry selezionata, storico attività, eventi esterni.
- **Outputs:** OrchestrationContext → lista azioni contestuali con stato enabled/disabled.
- **Integrazione:** richiama `generateSuggestions()`, `listCapabilities()`, `verifyChain()`.

### 3.2 ThumbMenu / Orbit Overlay

- Radiale, piccolo, denso — orbit radius ~82px, FAB 40px.
- Azioni animate scale+fade, hover micro-glow.
- Chips disabilitati opacity 0.4, tooltip brevissimi.
- Overlay persistente ma invisibile finché non rileva contesto rilevante.
- **Hotkey / Gesture** per attivazione rapida.

### 3.3 Event Capture / External Hooks

- **File Upload / Drag & Drop**
- **Clipboard Capture**
- **Screenshot / Camera Input**
- **Email / Web Integration**

Ogni input genera evento → Copilot valuta suggerimenti e azioni contestuali.

### 3.4 UI Contestuale

- `UserWorkspace`: mostra solo contenuti rilevanti, minimal header, entry list densa.
- `SystemPanel`: stato live, tracciabilità, sections Attività / Funzionalità / Tracciabilità.
- `OnboardingOverlay`: copy minimal, azioni rapide, dialog più piccolo.
- Feedback: micro-toast `"Registrato."` / `"Non disponibile."`.

### 3.5 Trust + Audit Layer

- Ogni azione genera **TrustRecord**.
- Verifica capabilities prima dell'esecuzione.
- Log in TrustChain, visibile ad admin soltanto.
- Garantisce compliance, tracciabilità, sicurezza dati.

---

## 4. Logica di Attivazione Intelligente

```
Evento (lezione, task, file, email, clipboard)
  → Copilot Core costruisce OrchestrationContext
    → Filtra azioni per ruolo e capability
    → Se azione attivabile   → ThumbMenu orbitale si mostra
    → Se azione non disponibile → chip opacity 0.4 + tooltip

Utente clic → executeAction() → crea TrustRecord
```

**Profili di attivazione:**

| Ruolo             | Contesto di attivazione                         |
| ----------------- | ----------------------------------------------- |
| **Docente**       | Solo su orario lezioni o materiale didattico    |
| **Collaboratore** | Task amministrativi, approvazioni, workflow     |
| **Admin**         | Visione completa, override capabilities e trust |

---

## 5. Sinergia tra Intelligenze

| Modulo                   | Contributo                                                         |
| ------------------------ | ------------------------------------------------------------------ |
| **CognitiveLayer**       | Suggerisce prossime azioni, collega contenuti, suggerisce workflow |
| **CapabilitySystem**     | Controlla che solo le azioni abilitate possano essere eseguite     |
| **TrustChain**           | Registra tutto in audit e log tracciabile                          |
| **OrchestrationContext** | Aggrega tutto, calcolato al volo, non persistente (ephemeral)      |
| **GovernanceDashboard**  | Solo per verifica amministrativa e compliance GDPR                 |

---

## 6. UX / UI Premium

- Design minimal e denso: icone piccole, spazi ridotti, testi brevi.
- Overlay orbitale attivo solo quando serve → mai menu statici.
- Azioni contestuali predittive: mostra ciò che serve _prima ancora che clicchi_.
- Micro-feedback continuo → utente percepisce controllo senza distrazione.
- Estetica Jarvis: fluttuante, intelligente, leggibile, action-first.

**Token MD3 applicati:**

```
font-weight: var(--md-sys-typescale-weight-medium)   /* 500, no 600+ */
font-size:   var(--md-sys-typescale-body-medium-size) /* 13-14px */
transition:  120-180ms ease
animation:   scale(0.82→1) + fade
```

---

## 7. Roadmap Implementativa

| Fase       | Descrizione                                        | Durata      |
| ---------- | -------------------------------------------------- | ----------- |
| **Fase 1** | Copilot Core + OrchestrationContext                | 2 settimane |
| **Fase 2** | ThumbMenu / Orbit Overlay                          | 1 settimana |
| **Fase 3** | Event Capture (file, screenshot, clipboard, email) | 2 settimane |
| **Fase 4** | UI Contestuale UserWorkspace + OnboardingOverlay   | 1 settimana |
| **Fase 5** | Trust + Capability + Audit Layer integration       | 1 settimana |
| **Fase 6** | Testing Pilota, UX micro-feedback, regolazioni     | 1 settimana |
| **Fase 7** | Admin Panel + GovernanceDashboard integration      | 1 settimana |

**Totale stimato:** ~9 settimane

---

## 8. Stato implementazione attuale (Marzo 2026)

| Componente                                                          | File                                                | Stato         |
| ------------------------------------------------------------------- | --------------------------------------------------- | ------------- |
| OrchestrationContext                                                | `src/modules/orchestration/types.ts`                | ✅ Completato |
| buildContext()                                                      | `src/modules/orchestration/orchestrationService.ts` | ✅ Completato |
| executeAction()                                                     | `src/modules/orchestration/orchestrationService.ts` | ✅ Completato |
| ThumbMenu                                                           | `src/components/ui/ThumbMenu.tsx`                   | ✅ Completato |
| ThumbMenu keyboard nav                                              | `src/components/ui/ThumbMenu.tsx`                   | ✅ Completato |
| useThumbMenu                                                        | `src/hooks/useThumbMenu.ts`                         | ✅ Completato |
| useJarvisKeyboard                                                   | `src/hooks/useJarvisKeyboard.ts`                    | ✅ Completato |
| JarvisIndicator micro-dot                                           | `src/components/ui/JarvisIndicator.tsx`             | ✅ Completato |
| AccountLinkingPanel                                                 | `src/components/workspace/AccountLinkingPanel.tsx`  | ✅ Completato |
| UserWorkspace                                                       | `src/components/workspace/UserWorkspace.tsx`        | ✅ Completato |
| OnboardingOverlay                                                   | `src/components/workspace/OnboardingOverlay.tsx`    | ✅ Completato |
| SystemPanel                                                         | `src/components/admin/SystemPanel.tsx`              | ✅ Completato |
| seedDemoContent                                                     | `src/utils/seedDemoContent.ts`                      | ✅ Completato |
| CognitiveLayer                                                      | `src/modules/cognitiveLayer/`                       | ✅ Completato |
| CapabilitySystem                                                    | `src/modules/capabilitySystem/`                     | ✅ Completato |
| TrustLayer                                                          | `src/modules/trustLayer/`                           | ✅ Completato |
| Event Capture (file, clipboard, immagini)                           | `UserWorkspace.tsx`                                 | ✅ Completato |
| Event Capture (screenshot paste)                                    | `UserWorkspace.tsx`                                 | ✅ Completato |
| Account linking OAuth (Drive, Gmail, Classroom, WhatsApp, Telegram) | `AccountLinkingPanel.tsx`                           | ✅ Completato |
| GovernanceDashboard integration                                     | `src/components/governance/`                        | ✅ Parziale   |

**Shortcut tastiera attive:**

| Shortcut                 | Azione                                                     |
| ------------------------ | ---------------------------------------------------------- |
| `Ctrl+J`                 | Apri/chiudi ThumbMenu sull'ultima entry                    |
| `ArrowUp / ArrowLeft`    | Naviga chip precedente nel ThumbMenu                       |
| `ArrowDown / ArrowRight` | Naviga chip successivo nel ThumbMenu                       |
| `Enter`                  | Esegui azione selezionata                                  |
| `Escape`                 | Chiudi ThumbMenu                                           |
| `Ctrl+U`                 | Naviga al workspace (dispatch `jarvis:navigate-workspace`) |
| `Ctrl+Shift+D`           | Mostra stato TrustChain nel toast                          |
| `Ctrl+Enter`             | Invia testo nell'input area                                |

---

## 9. Diagramma Architetturale

### Moduli principali

| Modulo                   | Ruolo                                                                               | Output chiave                                                     |
| ------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **CognitiveLayer**       | Analizza input (file, testo, attività, registro) e genera suggerimenti intelligenti | `CognitiveSuggestion[]`                                           |
| **CapabilitySystem**     | Controlla permessi e funzionalità attivabili per utente/ruolo                       | `Capability[]` con stato LOCKED/UNLOCKED                          |
| **TrustChain**           | Tiene traccia di ogni azione / decisione, audit log                                 | `TrustRecord[]`                                                   |
| **OrchestrationService** | Aggrega tutti i moduli, costruisce OrchestrationContext in tempo reale              | `OrchestrationContext { suggestions, capabilities, trustStatus }` |
| **Orbit Jarvis Copilot** | Layer decisionale + visual minimal, decide cosa mostrare, quando e come             | ThumbMenu / micro-indicatori, azioni contestuali                  |
| **UI Layer**             | Overlay radiale, indicatori, Toasts, pannelli admin                                 | ThumbMenu, SystemPanel, UserWorkspace                             |

### Flusso dati e decisionale

```
[Input esterno] ─────────┐
                         ▼
                  CognitiveLayer
                         ▼
                  generateSuggestions()
                         ▼
               OrchestrationService <──── CapabilitySystem
                         │                      ▲
                         │                      │
                         ▼                      │
                OrchestrationContext            │
                  { suggestions,               │
                    capabilities,              │
                    trustStatus }              │
                         │                      │
                         ▼                      │
                 Orbit Jarvis Copilot ----------┘
                         │
            ┌────────────┴──────────────┐
            ▼                           ▼
    ThumbMenu Overlay          Micro-indicator / Dot
    (orbitale, radiale)       (in corner UI, badge)
            │                           │
            ▼                           ▼
    User selects / CTA         Jarvis highlights suggestion
            │
            ▼
    executeAction()
            │
            ▼
       CapabilitySystem (check)
            │
            ▼
       TrustChain (record)
            │
            ▼
      Outcome: UI + audit log
```

### Gestione contesti utente

| Ruolo                     | Trigger di attivazione                                    |
| ------------------------- | --------------------------------------------------------- |
| **Docente**               | Orario lezioni, allegati registro, screenshot, email      |
| **Collaboratore / Admin** | Ticket, task, workflow esterni                            |
| **Utente generico**       | Azioni contestuali suggerite (simple overlay + micro-dot) |

> **Principio:** Jarvis **vive in background** e si rende visibile solo quando c'è qualcosa di rilevante.

### Design visuale minimale

| Elemento           | Caratteristiche                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| ThumbMenu          | Orbitale, radiale, animazione scale+fade, chip azioni con tooltip brevissimi, disabled opacity 0.4 |
| Micro-indicator    | Dot colorato, piccolo badge su corner, indica nuove azioni o suggerimenti                          |
| Toast              | Minimal: `"Registrato."` / `"Non disponibile."`                                                    |
| Banner SystemPanel | `"Sistema attivo · Tutte le attività tracciate"`                                                   |

### Ciclo eventi esterni

1. **Upload file / screenshot** → Jarvis riceve input → CognitiveLayer → `buildContext()` → ThumbMenu/indicator aggiornati.
2. **Interazione registro / email** → trigger automazione → esito contestuale.
3. **Task esterno** → Jarvis decide se mostrare direttamente la CTA o suggerimento.

### Estensioni future

| Feature                  | Descrizione                                     |
| ------------------------ | ----------------------------------------------- |
| **Machine Learning**     | Jarvis impara preferenze, anticipa suggerimenti |
| **Multi-tenancy**        | Contesto separato per ambiti diversi            |
| **Gestione notifiche**   | Minimal pop-up solo quando rilevante            |
| **Integrazione esterna** | API per strumenti cloud o sistemi didattici     |

> **Sintesi:** Non serve rifare il codice esistente. Orbit Jarvis è un **layer decisionale e visual minimal** sopra i moduli già presenti. Tutte le azioni rimangono tracciate in TrustChain e filtrate da CapabilitySystem. L'utente percepisce libertà e leggerezza — informazioni intelligenti solo quando servono.

---

## 10. Sintesi operativa finale

### Visione

Orbit Jarvis Copilot è un sistema **intelligente, contestuale e modulare** che comprende il contesto dell'utente e anticipa azioni possibili. Si attiva su input interni (documenti, registro, deliverables) o esterni (email, upload, screenshot) e garantisce tracciabilità e audit automatici su tutte le azioni eseguite.

### Chiavi d'accesso per ruolo

| Ruolo             | Attivatore principale                                         |
| ----------------- | ------------------------------------------------------------- |
| **Docente**       | Orario lezioni + upload file/screenshot + registro/esterni    |
| **Collaboratore** | Task assegnati + input esterni + workflow                     |
| **Admin**         | Supervisione completa + sblocco capability + audit TrustChain |

> Ogni ruolo attiva naturalmente ThumbMenu e contesto Jarvis — nessun menù superfluo.

### Roadmap breve / medio / lungo

| Termine   | Obiettivo                                                                                   |
| --------- | ------------------------------------------------------------------------------------------- |
| **Breve** | Pilota completo: ThumbMenu, SystemPanel, UserWorkspace, keyboard nav, account linking       |
| **Medio** | Multi-dominio, ruoli avanzati, shortcut estese, elaborazione input esterni (email, API)     |
| **Lungo** | AI predittiva contestuale, UX multi-device, integrazione workflow esterni, ML su preferenze |

### Garanzie di tracciabilità

- Tutti i dati restano sotto custodia sicura (client-side + TrustChain locale).
- Ogni azione genera `TrustRecord` con timestamp, autore e payload.
- Audit notarizzato disponibile per contratti e compliance.
- Contesto ephemeral: calcolato on-demand, zero persistenza non necessaria.

### Commit milestones

| Commit              | Descrizione                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| Orchestration batch | 74 file — layer orchestrazione completo                                 |
| `7aafa7d1`          | JarvisIndicator micro-dot + event capture (file, clipboard, immagini)   |
| `d56b931f`          | AccountLinkingPanel OAuth (Drive, Gmail, Classroom, WhatsApp, Telegram) |
| `c945bc11`          | Keyboard navigation ThumbMenu + `useJarvisKeyboard` global shortcuts    |

---

## 11. Riferimenti tecnici

- `buildContext(inputId, opts)` → `OrchestrationContext | null`
- `executeAction(ctaType, suggestion, opts)` → `ExecuteActionResult`
- `isCapabilityEnabled(tenantId, capabilityId)` → `boolean`
- `createTrustRecord(params)` → `Promise<TrustRecord>`
- `verifyChain(tenantId)` → `Promise<ChainVerificationResult>`
- `useUIStore.getState().actions.showToast(msg, type)` — types: `'success' | 'error' | 'info'`
- `tenantRegistry.getContext()` — singleton, no props threading
