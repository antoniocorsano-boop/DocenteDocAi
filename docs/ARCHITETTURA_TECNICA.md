# Architettura Tecnica — DocenteDoc AI

> Documento generato automaticamente nel contesto del backlog C12.  
> Ultimo aggiornamento: 2026-03  
> Versione stack: React 18 + TypeScript + Vite + MUI v7 + Zustand

---

## 1. Visione d'insieme

DocenteDoc AI è una **SPA full-client** (Single-Page Application) per docenti italiani.
Non esiste un backend applicativo proprio: tutta la logica risiede nel browser, con l'eccezione
del proxy AI (`api/ai.ts` — Vercel Edge Function) che protegge le chiavi API lato server.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BROWSER (SPA React)                            │
│                                                                         │
│  ┌──────────────────┐  ┌───────────────────┐  ┌─────────────────────┐  │
│  │   UI Layer       │  │  Business Logic   │  │  Persistence Layer   │  │
│  │  (React + MUI)   │  │  (hooks + stores) │  │  (localStorage +    │  │
│  │  design-system/  │  │  src/services/    │  │   IndexedDB)         │  │
│  └────────┬─────────┘  └────────┬──────────┘  └────────┬────────────┘  │
│           │                     │                       │               │
│  ┌────────▼─────────────────────▼───────────────────────▼────────────┐  │
│  │               Self-Compliance Engine (Layer Zero)                  │  │
│  │  src/self-compliance/  ←  compliance DB, audit, escalation, DPIA  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Telemetria + OpenTelemetry                        │  │
│  │  src/tracing.ts  →  OTLP endpoint (opzionale in dev)             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS
                         ┌─────────▼─────────┐
                         │  Vercel Edge (CDN)  │
                         │  api/ai.ts          │  ← proxy Gemini / Anthropic
                         │  api/webhook-*      │  ← Telegram / WhatsApp
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │  Google Gemini API   │
                         │  Anthropic Claude    │
                         └─────────────────────┘
```

---

## 2. Struttura delle cartelle

```
src/
├── components/           # Componenti React organizzati per dominio
│   ├── assistant/        # TeacherAssistantPanel (copilot docente)
│   ├── certification/    # DPIAViewerPanel
│   ├── classroom/        # Register, Notes, Resources (tab di ClassroomView)
│   ├── copilot/          # AITabErrorBoundary, sub-tab AI
│   ├── governance/       # GovernanceDashboard, AuditTrail, Escalation, Verbale
│   ├── settings/         # 7 pannelli Settings
│   └── *.tsx             # Componenti globali (PrivacyConsentModal, ecc.)
│
├── design-system/        # Layer DS MD3
│   ├── M3Surface.tsx
│   ├── M3Typography.tsx
│   ├── AppLayout.tsx
│   └── tokens.ts
│
├── hooks/                # Custom React hooks
│   ├── useAdaptiveDashboard.ts
│   ├── useGdprDataManager.ts
│   └── ...
│
├── self-compliance/      # 🔑 Layer Zero Sovereignty
│   ├── certification/    # dpiaGenerator, complianceRules, types
│   ├── runtime/          # compliance store, audit engine, simulator
│   │   └── audit/        # auditEngine, auditSimulator, types
│   └── utils/            # rule helpers
│
├── services/             # Servizi puri (no React)
│   ├── ai/               # proxy, context engine, adaptive AI
│   ├── auditVerbaleGenerator.ts    # C11: HTML/TXT verbale PA
│   ├── complianceReportGenerator.ts # C10: report conformità
│   ├── featureFlags.ts             # C19: feature toggles
│   └── ...
│
├── stores/               # Zustand stores per dominio
│   ├── useAuditTrailStore.ts
│   ├── useCopilotStore.ts
│   └── ...
│
├── theme/                # MUI theme MD3
│   ├── muiTheme.ts
│   └── M3ThemeProvider.tsx
│
├── types/                # TypeScript types per dominio
│   ├── index.ts          # barrel (re-export tutto)
│   ├── uda.types.ts
│   ├── student.types.ts
│   ├── ai.types.ts
│   └── ...
│
├── utils/                # Utility pure
│   ├── structuredLogger.ts  # C20: slog API
│   ├── persistenceVerifier.ts  # C17: verifica 7 layer
│   └── dataRetention.ts     # GDPR cleanup automatico
│
├── cognition/            # Layer di consistenza e controllo AI
│   └── runtimeConsistency.ts  # C1-C4: AI gate, smart reset
│
├── tracing.ts            # OpenTelemetry (produzione)
├── sw.ts                 # Service Worker PWA
└── main.tsx              # Entry point
```

---

## 3. Layer Zero Sovereignty

Il **Self-Compliance Engine** (in `src/self-compliance/`) è il nucleo normativo del sistema.
Viene eseguito interamente nel browser e non ha dipendenze cloud.

### 3.1 Compliance DB

```typescript
// useComplianceStore.getState().db → ComplianceDb
interface ComplianceDb {
  gdprEnabled: boolean; // flag GDPR abilitato
  aiActEnabled: boolean; // flag AI Act abilitato
  consentRecorded: boolean; // consenso GDPR registrato
  dpiaCompleted: boolean; // DPIA eseguita
  transparencyActive: boolean; // trasparenza AI attiva
  dataRetentionEnabled: boolean; // retention automatica attiva
  auditLoggingActive: boolean; // audit trail attivo
  humanOversightActive: boolean; // supervisione umana attiva
}
```

Persistito su `localStorage` con chiave `compliance_db_v1`.

### 3.2 Audit Engine

| Funzione                           | File                  | Descrizione                           |
| ---------------------------------- | --------------------- | ------------------------------------- |
| `buildAuditReport(db)`             | `auditEngine.ts`      | Valuta le regole PA sull'attuale DB   |
| `runAuditSimulation(db, id)`       | `auditSimulator.ts`   | Applica un scenario override e audita |
| `buildContinuousComplianceModel()` | `escalationEngine.ts` | Cicli di audit e regole di escalation |

**Framework normativi valutati:** `GDPR | AI_ACT | AGID_CAD | AGID_MiS`

**Score PA:** 0–100 per framework + score globale ponderato.

**ComplianceStatusPA:** `CONFORME | PARZIALMENTE_CONFORME | NON_CONFORME`

**CertificationReadiness:** `PRONTO | CONDIZIONATO | NON_PRONTO`

### 3.3 Ciclo di audit continuo

```
App start → runRetentionCheck() → (ogni 24h) buildContinuousComplianceModel()
         ↓
  AuditCycle (pianificato/attivo/completato)
         ↓
  EscalationRule (soglie → azioni automatiche: ALERT | BLOCK | REPORT | ESCALATE)
         ↓
  AuditTrail (localStorage: docente-doc-audit-trail)
```

---

## 4. Moduli chiave — descrizione

### `src/cognition/runtimeConsistency.ts` — Gate AI (C1-C4)

Controlla quali use case AI sono attivi. Se mancano moduli critici, blocca i casi d'uso
e offre `smartReset()` per ripristinare il minimo compliance.

**API pubblica:**

```typescript
getBlockedUseCases(): string[]
isUseCaseBlocked(ucId: string): boolean
checkConsistency(): ConsistencySnapshot
smartReset(): void
getBlockReasonLabel(ucId: string): string
```

### `src/utils/structuredLogger.ts` — Logging strutturato (C20)

Centralizza tutti i log con categoria, messaggio e payload tipizzato.

```typescript
slog.info(category: LogCategory, message: string, data?: Record<string,unknown>);
slog.warn(...);
slog.error(...);
```

**Categorie:** `AI_GATE | COMPLIANCE | SOVEREIGNTY | AUDIT | TELEMETRY | BACKUP | FEATURE_FLAG | USE_CASE | UI | SYSTEM`

Persistito su `localStorage` con chiave `structured_logs_v1`. Limite rolling: 1000 entries.

### `src/services/featureFlags.ts` — Feature flags (C19)

Toggle configurabili a runtime, persistiti su `feature_flags_v1`.

```typescript
isEnabled(flag: FeatureFlag): boolean
setFlag(flag: FeatureFlag, value: boolean): void
getAllFlags(): Record<FeatureFlag, boolean>
resetToDefaults(): void
```

### `src/utils/persistenceVerifier.ts` — Verifica persistenza (C17)

Verifica che i 7 layer di storage critici siano intatti e leggibili.

```typescript
runPersistenceVerification(): VerificationReport
```

Layer verificati: `compliance_db_v1`, `enterprise_audit_log_v1`, `docente-doc-audit-trail`,
`sovereignty_config_v1`, `feature_flags_v1`, `structured_logs_v1`, `privacy_consent_v1`.

### `src/services/complianceReportGenerator.ts` — Report conformità (C10)

Genera un report testuale e JSON dello stato di conformità corrente, con metriche per scenario.

```typescript
generateComplianceReport(includeScenarios?: boolean): ComplianceReport
exportReportAsText(): string
exportReportAsJSON(): string
```

### `src/services/auditVerbaleGenerator.ts` — Verbale audit PA (C11)

Genera il verbale formale di audit PA in HTML (stampabile) e testo plain.

```typescript
generateVerbaleHTML(report: PALiveAuditReport): string
generateVerbaleTXT(report: PALiveAuditReport): string
```

### `src/hooks/useGdprDataManager.ts` — Gestione dati GDPR (C14)

Hook per cancellazione selettiva dati, export e gestione diritti GDPR art.17.

```typescript
const { exportData, deleteUserData, deleteAiArtefacts, status } =
  useGdprDataManager();
```

---

## 5. Componenti governance

| Componente              | File                                              | Funzione                                    |
| ----------------------- | ------------------------------------------------- | ------------------------------------------- |
| `GovernanceDashboard`   | `components/governance/GovernanceDashboard.tsx`   | Dashboard principale conformità PA          |
| `AuditTrailPanel`       | `components/governance/AuditTrailPanel.tsx`       | Storico run di audit con filtri             |
| `EscalationConfigPanel` | `components/governance/EscalationConfigPanel.tsx` | Regole escalation e cicli audit pianificati |
| `AuditVerbalePanel`     | `components/governance/AuditVerbalePanel.tsx`     | Generazione verbale PDF/TXT                 |
| `BackupRecoveryPanel`   | `components/governance/BackupRecoveryPanel.tsx`   | Backup e recovery dati (Google Drive)       |
| `DPIAViewerPanel`       | `components/certification/DPIAViewerPanel.tsx`    | Visualizzazione DPIA GDPR                   |
| `TeacherAssistantPanel` | `components/assistant/TeacherAssistantPanel.tsx`  | Copilot docente + analisi adattiva          |

---

## 6. State management

- **Zustand** per tutto lo stato globale. Nessun Redux, nessun Context per dati applicativi.
- Gli store sono in `src/stores/` e `src/self-compliance/runtime/`.
- I Context in `src/context/` e `src/contexts/` gestiscono solo tema e modal overlay.

### Store principali

| Store                | Chiave localStorage       | Contenuto                        |
| -------------------- | ------------------------- | -------------------------------- |
| `useComplianceStore` | `compliance_db_v1`        | ComplianceDb (flag normativi)    |
| `useAuditTrailStore` | `docente-doc-audit-trail` | AuditRun[] (storico audit)       |
| `useAppEngine`       | (multi-key)               | UDA, classi, alunni, valutazioni |
| `useCopilotStore`    | `copilot_state_v1`        | Stato pannello Copilot           |

---

## 7. AI Pipeline

Tutte le chiamate AI **non passano mai** per il browser con chiavi esposte.

```
Componente React
  → fetch('/api/ai', { method: 'POST', body: { model, prompt } })
  → Vercel Edge Function (api/ai.ts)
    → legge GEMINI_API_KEY / ANTHROPIC_API_KEY da env server-side
    → chiama Gemini Flash / Claude Sonnet
    → restituisce risposta al browser
```

**Modelli supportati:** `gemini-2.0-flash-exp`, `claude-sonnet-4-5` (configurabile).

**Fast-path client-side:** `window.aistudio` è l'unico percorso AI consentito nel browser
(per ambienti Google AI Studio hosted).

---

## 8. PWA e Service Worker

- Modalità: `injectManifest` (Vite Plugin PWA).
- Sorgente SW: `src/sw.ts`.
- Cache strategy: `NetworkFirst` per API, `CacheFirst` per assets statici.
- Offline: la SPA funziona offline con dati in localStorage/IndexedDB.

---

## 9. Testing

| Tipo               | Runner      | File                               | Comando                   |
| ------------------ | ----------- | ---------------------------------- | ------------------------- |
| Unit / Integration | Vitest      | `src/**/*.test.ts`, `__tests__/**` | `npm run test:unit`       |
| E2E                | Playwright  | `e2e/**`                           | `npm run test:e2e`        |
| Visual regression  | Playwright  | `__tests__/visual-regression/`     | `npm run test:visual:md3` |
| Coverage           | Vitest (v8) | tutti                              | `npm run test:coverage`   |

Setup globale Vitest: `vitest.setup.tsx`.

---

## 10. Deploy e CI/CD

- **Platform:** Vercel (vercel.json configura SPA rewrite + header sicurezza + Edge Functions).
- **Install flag obbligatorio:** `--legacy-peer-deps` (peer deps MUI v7 + React 18).
- **Variabili d'ambiente server-side:** `GEMINI_API_KEY`, `ANTHROPIC_API_KEY` su Vercel Dashboard.
- **CI GitHub Actions:** lint, test unit, release-gate, e2e-smoke.

---

## 11. Sicurezza e privacy

- Chiavi AI mai esposte al browser (`api/ai.ts` è proxy server-side).
- Consenso GDPR: `PrivacyConsentModal` blocca l'app al primo avvio (`privacy_consent_v1`).
- Data retention automatica: `runRetentionCheck()` in `main.tsx` rimuove artefatti AI > 365 gg.
- Self-Compliance Engine valuta conformità a GDPR / AI Act / AgID in ogni sessione.
- CSP e header sicurezza configurati in `vercel.json`.

---

## 12. Convenzioni di codice

- **Path alias:** usa sempre `@/` per importare da `src/` (es. `import { UDA } from '@/types'`).
- **Tipi:** non aggiungere tipi a `src/types.ts`; scrivi nel modulo dominio appropriato in `src/types/`.
- **MD3:** ogni container visivo usa `M3Surface`/`AppLayout`. Niente `<div>` per layout/shell.
- **Logging:** usa sempre `slog.info(category, message, data)` — categoria PRIMA del messaggio.
- **Button variant:** solo `"text" | "outlined" | "contained"` (MUI v7).
- **Spacing:** solo token MD3 — niente pixel hardcoded.
