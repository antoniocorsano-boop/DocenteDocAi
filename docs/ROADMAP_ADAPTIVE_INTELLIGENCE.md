# Roadmap — Adaptive Intelligence Layer

**Data pianificazione**: 2026-03-18  
**Stato**: pianificato, non ancora iniziato  
**Prerequisiti**: Phase 9 Brain (commit `14aeb093`) — actionRegistry, executeCopilotAction, useNextAction enterprise ctx

---

## Obiettivo globale

Trasformare il sistema da **decision engine** → **sistema adattivo intelligente**:

> context-aware + user-aware + explainable

Paragonabile a Notion AI / HubSpot Automation / Salesforce Einstein — ma verticale scuola.

---

## Sprint 10 — Dashboard Intelligente

### Goal

Mostrare **decisioni**, non dati.

### Componenti da creare

| File                                              | Responsabilità                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/copilot/PrimaryActionCard.tsx`    | Visualizza `getCopilotPrimaryAction()` come card MD3                 |
| `src/components/copilot/SecondaryActionsList.tsx` | Max 2 azioni da `getTopSecondaryActions()`                           |
| `src/components/copilot/SystemStatusPanel.tsx`    | `complianceStatus`, `pendingApprovals`, `activeSignals`, `riskLevel` |
| `src/components/copilot/RecentDecisions.tsx`      | Timeline sintetica `decisionMemory.last(10)`                         |
| `src/components/copilot/IntelligentDashboard.tsx` | Assembla i 4 blocchi nella view Copilot                              |

### Struttura logica

```
IntelligentDashboard
├── Blocco 1: PrimaryActionCard          ← getCopilotPrimaryAction()
│   └── SecondaryActionsList (max 2)     ← getTopSecondaryActions()
├── Blocco 2: SystemStatusPanel
│   ├── complianceStatus (gdpr/agid)
│   ├── pendingApprovals count
│   ├── activeSignals list
│   └── riskLevel (derivato da signals severity)
└── Blocco 3: RecentDecisions
    └── decisionMemory timeline (N=10)
```

### Output schematico (dashboard AI prompt)

```ts
interface DashboardSchema {
  primaryCard: PrimaryActionCard;
  secondaryCards: SecondaryActionCard[]; // max 2
  statusPanel: SystemStatusPanelData;
  timelinePreview: DecisionEvent[]; // last 5
}
```

### Regole di rendering

- Prioritizzare item azionabili su dati raw
- Collassare info a bassa priorità
- Evidenziare urgenza visivamente: `critical > warning > normal` (MD3 error/warning/surface tokens)
- Mai mostrare più di 3 azioni principali

---

## Sprint 11 — Notifiche Proattive

### Goal

Non reagire → **anticipare**.

### File da creare

| File                                           | Responsabilità                        |
| ---------------------------------------------- | ------------------------------------- |
| `src/cognition/notificationEngine.ts`          | Core logic: decide se/cosa notificare |
| `src/hooks/useProactiveNotifications.ts`       | React bridge → `notificationEngine`   |
| `src/components/copilot/NotificationToast.tsx` | MD3 SnackBar/Chip per notifiche       |

### Trigger logic

```ts
if (signal.severity === 'critical')                   → push immediato
if (patternDetected && !recentlySuggested)            → suggerimento proattivo
if (userInactive && pendingActions.length > 0)        → reminder
```

### Tipologie

| Tipo         | Token colore MD3 | Esempio                      |
| ------------ | ---------------- | ---------------------------- |
| `critical`   | `error`          | Scadenza normativa           |
| `warning`    | `tertiary`       | Documento incompleto         |
| `suggestion` | `secondary`      | "Puoi automatizzare questo"  |
| `autonomous` | `primary`        | Azione eseguita in autonomia |

### Output `notificationEngine.decide()`

```ts
interface NotificationDecision {
  shouldNotify: boolean;
  type: "critical" | "warning" | "suggestion" | "info";
  title: string;
  message: string;
  actionId?: string;
  urgencyScore: number; // 0–1
}
```

### Regole anti-fatigue

- Max 1 notifica critica ogni 5 minuti
- Batch le suggestion a bassa priorità (max 1 ogni 30 min)
- Non notificare se la stessa `actionId` è già pending
- Tono personalizzato in base a `userBehaviorProfile`

---

## Sprint 12 — Timeline Decisionale

### Goal

Far capire all'utente cosa sta succedendo → **fiducia + enterprise readiness**.

### File da creare

| File                                           | Responsabilità                                      |
| ---------------------------------------------- | --------------------------------------------------- |
| `src/cognition/decisionTimeline.ts`            | Builder: merge `decisionMemory` + `auditLogs`       |
| `src/components/copilot/DecisionTimeline.tsx`  | Timeline verticale MD3                              |
| `src/components/copilot/DecisionEventChip.tsx` | Badge status: ✅ eseguito / ⏳ pending / ⚠️ blocked |

### Tipo `DecisionEvent`

```ts
interface DecisionEvent {
  timestamp: string; // ISO 8601
  action: string; // titolo leggibile
  source: "user" | "copilot" | "system";
  result: "executed" | "blocked" | "pending_approval";
  approvalRequired?: boolean;
  complianceImpact?: "none" | "low" | "high";
}
```

### Vista UX

- Timeline verticale, scroll, max 15 eventi visibili
- Filtri: `normative` | `studenti` | `documenti`
- Clustered: azioni correlate entro 5 minuti vengono raggruppate

### Builder rules

- Merge `decisionMemory.signals` + `enterpriseAuditLog.entries` per timestamp
- Evidenziare eventi compliance-relevant
- Surfacing anomalie (blocked consecutivi, approval delay > 1h)

---

## Sprint 13 — User Behavior Model

### Goal

`copilotBrain` diventa **user-aware**: raccomandazioni personalizzate per docente.

### File da creare

| File                                 | Responsabilità                          |
| ------------------------------------ | --------------------------------------- |
| `src/cognition/userBehaviorModel.ts` | Model + update functions                |
| `src/stores/useUserBehaviorStore.ts` | Zustand store persistito (localStorage) |

### Tipo `UserBehaviorProfile`

```ts
interface UserBehaviorProfile {
  actionFrequency: Record<string, number>; // actionId → esecuzioni totali
  preferredActions: string[]; // top 3 più eseguite
  ignoredActions: string[]; // rifiutate 2+ volte
  approvalSpeed: "fast" | "normal" | "slow";
  riskTolerance: "low" | "medium" | "high";
  lastUpdated: string; // ISO 8601
}
```

### Aggiornamento continuo

```ts
// EVENT HOOKS (da wiring in executeCopilotAction + UI)
onActionExecuted(actionId)  → updateProfile(): incrementa freq, aggiorna preferred
onActionIgnored(actionId)   → penalize(): aggiungi a ignoredActions se già rifiutata 1x
onApprovalDelay(ms)         → adjustApprovalSpeed(): aggiorna approvalSpeed
```

### Regole di apprendimento

- Aumento peso per azioni ripetute (freq > 3 = preferred)
- Diminuzione priorità per azioni ignorate (ignored > 2 = "soppresso" salvo critical)
- Pattern detection: azioni settimanali (es. "crea registro" ogni lunedì → proattivo)
- Adatta `riskTolerance` in base ad accept/reject rate su `requiresApproval`

---

## Sprint 14 — Dynamic Ranking Engine

### Goal

`priority = rules + userProfile + contextHistory` → **ranking personalizzato**.

### File da creare

| File                             | Responsabilità                                          |
| -------------------------------- | ------------------------------------------------------- |
| `src/cognition/rankingEngine.ts` | `rankActions(candidates, scoringFactors)`               |
| Update `copilotBrain.ts`         | Usa `rankingEngine` prima di restituire `primaryAction` |

### Formula scoring

```ts
finalScore =
  basePriority + // TIER_0=100, TIER_1=80, TIER_2=60, TIER_3=40, TIER_4=20, TIER_5=10
  userAffinity + // preferred action: +15; ignored: -20
  urgency + // signal.severity critical: +25, warning: +10
  complianceWeight + // complianceStatus non-ok: +30
  recencyBoost; // non eseguita nelle ultime 24h: +5
```

### Esempio scoring

| Azione           | Base | User | Urgenza | Compliance | Score   |
| ---------------- | ---- | ---- | ------- | ---------- | ------- |
| Normativa GDPR   | 80   | 0    | 25      | 30         | **135** |
| Report mensile   | 40   | 15   | 10      | 0          | **65**  |
| Suggerimento UDA | 20   | 10   | 0       | 0          | **30**  |

### Output

```ts
interface RankedAction extends SuggestedAction {
  finalScore: number;
  scoreBreakdown: {
    basePriority: number;
    userAffinity: number;
    urgency: number;
    complianceWeight: number;
    recencyBoost: number;
  };
  explanation: string; // "Priorità alta: scadenza normativa + preferenza utente"
}
```

### Regole

- Never suppress `critical` actions (score floor = 100)
- Normalize scores to 0–200 range
- Sempre includere `explanation` (explainability)
- Max 5 azioni nel ranking output

---

## Sprint 15 — Explainability Layer _(prossimo step raccomandato)_

### Goal

> "Perché ti sto suggerendo questo?"

Enterprise-ready + conforme normativa scuola (trasparenza AI).

### File da creare

| File                                             | Responsabilità                                           |
| ------------------------------------------------ | -------------------------------------------------------- |
| `src/cognition/explainAction.ts`                 | `explainAction(action, context)` → spiegazione leggibile |
| `src/components/copilot/ExplainabilityPanel.tsx` | UI "trasparenza AI" in overlay/tooltip                   |

### Output `explainAction()`

```ts
interface ActionExplanation {
  actionId: string;
  headline: string; // "Conformità GDPR richiede attenzione"
  reasons: string[]; // list of human-readable factors
  dataUsed: string[]; // "registro studenti", "stato compliance", "storico approvazioni"
  confidence: number; // 0–1 (da scoreBreakdown normalizzato)
  normativeRef?: string; // es. "Reg. UE 2016/679 art. 13"
}
```

---

## Sequenza di implementazione suggerita

```
Sprint 10: Dashboard Intelligente (UI — sprint più visibile)
Sprint 13: User Behavior Model    (dati — base per ranking)
Sprint 14: Dynamic Ranking        (logica — upgrade copilotBrain)
Sprint 11: Notifiche Proattive    (UX — alto impatto utente)
Sprint 12: Timeline Decisionale   (trust — fondamentale enterprise)
Sprint 15: Explainability Layer   (compliance + enterprise-ready)
```

### Dipendenze

```
Sprint 10 ← già disponibile (getCopilotPrimaryAction, decisionMemory)
Sprint 13 ← indipendente (nuovo store + model)
Sprint 14 ← dipende da Sprint 13 (UserBehaviorProfile)
Sprint 11 ← dipende da Sprint 10 + 13
Sprint 12 ← dipende da Sprint 10 (DecisionEvent type)
Sprint 15 ← dipende da Sprint 14 (scoreBreakdown)
```

---

## Vincoli architetturali (NON derogabili)

- Nessun nuovo Zustand store salvo `useUserBehaviorStore` (Sprint 13)
- `useNextAction` rimane THE hook UI — nessun componente computa next-action autonomamente
- `executeCopilotAction` rimane il gate obbligatorio — nessun bypass
- Tutti i componenti UI: MD3 Gold Compliant (`M3Surface`, `M3Typography`, token spacing)
- `userBehaviorProfile` persistito in `localStorage` via Zustand persist middleware
- Nessuna API key client-side — ranking e explainability sono computazioni pure lato client

---

_Piano salvato da: sessione 2026-03-18 — post commit `14aeb093`_
