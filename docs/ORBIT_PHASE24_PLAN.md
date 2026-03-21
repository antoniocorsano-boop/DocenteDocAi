# Orbit Phase 2-4 — Landings + Memory + Connectors

> Generato: 2026-03-20 | Basato su analisi reale del codebase post-commit `6ab2c484`

---

## Gap Analysis — cosa esiste già vs cosa manca

### Già implementato (NON toccare)

| Componente                         | File                                                  | Note                                                              |
| ---------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| `ScheduleContext` type             | `orchestration/types.ts`                              | optional in OrchestrationOptions                                  |
| `scheduleHint` in suggestionEngine | `cognitiveLayer/suggestionEngine.ts`                  | 2-arg signature                                                   |
| `resolveScheduleContext()`         | `UserWorkspace.tsx`                                   | passato a openMenu                                                |
| `useProactiveSchedule`             | `hooks/useProactiveSchedule.ts`                       | 60s timer, ingestInput on lesson <5min                            |
| Pattern detector                   | `orchestration/patternDetector.ts`                    | ActionLog, detectPattern                                          |
| Emergent skill store               | `orchestration/emergentSkillStore.ts`                 | DynamicSkill, match/decay                                         |
| `useSkillSuggestion`               | `hooks/useSkillSuggestion.ts`                         | 5s poll, confirm/dismiss                                          |
| `userBehaviorModel.ts`             | `cognition/userBehaviorModel.ts`                      | freq/preferred/ignored/riskTolerance                              |
| `useUserBehaviorStore`             | `stores/useUserBehaviorStore.ts`                      | Zustand persistente                                               |
| `skillRegistry` + `defaultSkills`  | `orchestration/skillRegistry.ts` + ..defaultSkills.ts | OPEN_REGISTER, LOAD_DELIVERABLE, MANAGE_LESSON, SCHEDULE_RECOVERY |

### Mancante — da implementare

| Prompt | Gap                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------ |
| P2     | Skills teacher: OPEN_SCHEDULE, OPEN_CLASS_CONTEXT, START_LESSON, LOAD_LESSON_MATERIAL, MARK_ATTENDANCE |
| P2     | `src/components/landing/` — ScheduleLanding, ClassLanding, LessonLanding                               |
| P2     | `activeLanding` state in UserWorkspace + trigger logic + render overlay                                |
| P3     | `src/modules/connectors/` — types, register, email, file                                               |
| P3     | `useExternalSync` hook                                                                                 |
| P3     | Skills: SEND_EMAIL, UPLOAD_FILE, SYNC_DATA                                                             |
| P4     | `buildContext()` non legge `userBehaviorStore` (boost/suppress)                                        |
| P4     | Automation levels (suggested/assisted/auto)                                                            |
| P4     | `InlineActionStrip` component                                                                          |
| P4     | `useThumbMenu` non chiama `onActionExecuted`/`onActionIgnored`                                         |

---

## Decisioni architetturali

1. **Landing navigation** — nessun router. `activeLanding: 'schedule'|'class'|'lesson'|null` in UserWorkspace. Ogni landing è un `M3Surface position:fixed inset:0 zIndex:1300` fullscreen Portal. Navigazione: ScheduleLanding→ClassLanding→LessonLanding via prop `setActiveLanding`, back button chiude.

2. **Memory system** — NON creare `MemoryStore` da zero. Riutilizzare `userBehaviorStore` + `userBehaviorModel` già esistenti e persistiti. Collegare `buildContext()` per boost/suppress.

3. **Connectors** — mock-first, nessuna HTTP call reale. `Connector<T>` interface astratta per futura sostituzione con API reali (registro elettronico, email).

4. **Automation levels** — derivati da `actionFrequency` in userBehaviorStore:
   - `suggested` (1-3 usi): comportamento default
   - `assisted` (4-7): InlineActionStrip appare a schermo senza aprire Orbit
   - `auto` (8+): **stub documentato, non attivato** (troppo aggressivo senza undo UI; richiede sprint dedicato)

5. **Landing trigger** — UserWorkspace decodifica tag dell'entry (`schedule`, `classe`, `lesson`) per impostare `activeLanding` prima/invece di aprire il ThumbMenu.

6. **InlineActionStrip visibilità** — basata su `suggestedEntry` corrente (non richiede ThumbMenu aperto).

---

## PHASE A — Teacher Skills + Landing System

**File modificati:** 1 | **File creati:** 3+1=4

### A1. `src/modules/orchestration/defaultSkills.ts`

Aggiungere skills teacher-centric:

```ts
OPEN_SCHEDULE       → 'pedagogical', no capability gate
OPEN_CLASS_CONTEXT  → 'pedagogical'
START_LESSON        → 'pedagogical', capabilityId: 'uda_planner'
LOAD_LESSON_MATERIAL→ 'pedagogical', capabilityId: 'uda_planner'
MARK_ATTENDANCE     → 'pedagogical', no capability gate
```

### A2. `src/components/landing/ScheduleLanding.tsx`

Fullscreen overlay (zIndex 1300). Contenuto:

- Titolo "Orario di oggi"
- Timeline verticale del giorno da `useAcademicStore.lessons` filtrato per oggi
- Ogni slot: ora, materia, classe — highlight se "in corso" (ora attuale nel range)
- Tap su slot → `setActiveLanding('class')` passando contesto classe
- Back button in alto a sinistra

### A3. `src/components/landing/ClassLanding.tsx`

Overlay contestuale. Contenuto:

- Header: nome classe + materia corrente
- 4 quick-action chips: Registro | Presenze | Avvia | Chiudi
- Pulsante "Vai alla lezione" → `setActiveLanding('lesson')`
- JarvisIndicator sempre visibile (non nascosto)

### A4. `src/components/landing/LessonLanding.tsx`

Focus mode. Contenuto:

- Header compatto: classe + materia + ora
- Note rapide: TextField multiline
- Lista suggerimenti Jarvis da `context?.suggestions` (se passato)
- Azioni: LOAD_LESSON_MATERIAL, generateActivity stub
- Back button

### A5. `src/components/workspace/UserWorkspace.tsx`

```ts
const [activeLanding, setActiveLanding] = useState<
  "schedule" | "class" | "lesson" | null
>(null);
const [landingCtx, setLandingCtx] = useState<ScheduleContext | null>(null);
```

`decodeLandingType(entry: CognitiveEntry)`: controlla `entry.tags` per:

- `schedule` → 'schedule'
- `lesson` + `classe` → 'lesson'
- `classe` → 'class'
- else → null (apre ThumbMenu come prima)

Render prima del closing `</M3Surface>`:

```tsx
{
  activeLanding === "schedule" && (
    <ScheduleLanding onClose onNavigate={setActiveLanding} ctx={landingCtx} />
  );
}
{
  activeLanding === "class" && (
    <ClassLanding onClose onNavigate={setActiveLanding} ctx={landingCtx} />
  );
}
{
  activeLanding === "lesson" && (
    <LessonLanding onClose ctx={landingCtx} context={context} />
  );
}
```

**Commit A:** `feat(orbit): teacher skills + fullscreen landing system (Schedule, Class, Lesson)`

---

## PHASE B — Memory Wiring + InlineActionStrip

**File modificati:** 2 | **File creati:** 1

### B1. `src/hooks/useThumbMenu.ts`

In `handleSelect` dopo execution:

```ts
if (result.success) {
  useUserBehaviorStore.getState().onActionExecuted(action.ctaType);
}
// il dismiss è già implicitamente tracked quando l'utente chiude senza selezionare
```

### B2. `src/modules/orchestration/orchestrationService.ts`

Aggiungere `getAutomationLevel(ctaType)`:

```ts
export function getAutomationLevel(
  ctaType: string,
): "suggested" | "assisted" | "auto" {
  const freq =
    useUserBehaviorStore.getState().profile.actionFrequency[ctaType] ?? 0;
  if (freq >= 8) return "auto";
  if (freq >= 4) return "assisted";
  return "suggested";
}
```

In `buildContext()`, dopo assemblaggo actions, prima di return:

```ts
const profile = useUserBehaviorStore.getState().profile;
// boost priority per preferredActions
actions.forEach((a) => {
  if (profile.preferredActions.includes(a.ctaType))
    a.priority = Math.max(1, a.priority - 1);
});
// sopprime ignoredActions (tranne compliance)
actions = actions.filter(
  (a) =>
    a.domain === "compliance" || !profile.ignoredActions.includes(a.ctaType),
);
```

### B3. `src/components/ui/InlineActionStrip.tsx`

Strip orizzontale `position:sticky bottom:80 left:0 right:0`. Mostra i chip degli `actions` con level `'assisted'`. Ogni chip: label + onClick → `handleSelect`. Scompare se `actions.length === 0`.

### B4. `src/components/workspace/UserWorkspace.tsx`

Mount InlineActionStrip dopo la lista content, passando le azioni `'assisted'` dal contesto suggerito.

**Commit B:** `feat(orbit): behavior-driven action ranking + InlineActionStrip for assisted automation`

---

## PHASE C — External Connectors + useExternalSync

**File creati:** 5 | **File modificati:** 2

### C1. `src/modules/connectors/types.ts`

```ts
export interface Connector<T = ExternalRecord> {
  readonly id: string;
  fetch(): Promise<T[]>;
  send?(payload: T): Promise<void>;
}
export interface ExternalRecord {
  id: string;
  source: string;
  content: string;
  tags: string[];
  meta?: Record<string, unknown>;
  fetchedAt: number;
}
```

### C2. `src/modules/connectors/registerConnector.ts`

Mock: `fetchLessons()`, `fetchAttendance()`, `fetchAssignments()` → ExternalRecord[] con tags `['registro','classe']`.

### C3. `src/modules/connectors/emailConnector.ts`

Mock: `fetchEmails()` → ExternalRecord[] con tags `['email']` o `['email','allegato']` se ha attachment.

### C4. `src/modules/connectors/fileConnector.ts`

`uploadFile(file: File)` → delega a `ingestInput()` con `inputType: 'file'`. Pipeline Universal Input riutilizzata integralmente.

### C5. `src/hooks/useExternalSync.ts`

`setInterval(2 min)`. Per ogni connector: chiama `fetch()`, per ogni record non già visto (sessionStorage key): `ingestInput({ inputType: 'external', content: record.content, tags: record.tags, meta: { source: record.source } })`.

### C6. `src/modules/orchestration/defaultSkills.ts`

Aggiungere SEND_EMAIL, UPLOAD_FILE, SYNC_DATA.
Mount `useExternalSync(tenantId)` in UserWorkspace accanto a `useProactiveSchedule`.

**Commit C:** `feat(orbit): external connectors layer (register/email/file) + useExternalSync sync loop`

---

## PHASE D — Validation

Per ogni fase:

```bash
npx tsc -b --noEmit          # 0 errors
npx eslint src/... --max-warnings 0  # 0 warnings
```

---

## Exclusions / Deferred

| Item                                        | Motivo                                                              |
| ------------------------------------------- | ------------------------------------------------------------------- |
| Dark theme redesign (`--bg: #0B0F14`)       | Richiede sprint dedicato al muiTheme.ts                             |
| Auto-execution (freq ≥ 8)                   | Troppo aggressivo senza undo UI — stub documentato                  |
| API reali per connectors                    | Registro elettronico = contratti istituzionali; email = OAuth scope |
| `onActionIgnored` hook in ThumbMenu dismiss | Dismiss implicito non tracciabile senza explicit dismiss button     |
