# Orbit Jarvis — Strategia UX Post-Audit

> Documento generato: 2026-03-20  
> Stato: Implementazione in corso  
> Riferimento audit: ORBIT_JARVIS_BLUEPRINT.md §7

---

## Lettura Strategica Dell'Audit

### Il problema reale

Il sistema è tecnicamente perfetto ma:

- non guida abbastanza
- non comunica abbastanza
- a volte è silenzioso quando non dovrebbe

> Tipico dei sistemi "troppo ingegnerizzati"

### Osservazione fondamentale

Il sistema già:

- **pensa** — CognitiveLayer + OrchestrationService
- **suggerisce** — CapabilitySystem
- **traccia** — TrustChain

Quello che mancava: **il sistema che rassicura mentre lo fa.**

### Interpretazione "Jarvis"

Jarvis **non è**:

- ❌ UI minimal
- ❌ animazioni
- ❌ orbite

Jarvis **è**:

- ✅ feedback immediato
- ✅ guida silenziosa
- ✅ anticipazione dell'intenzione

---

## Piano d'Azione — 3 Blocchi Sequenziali

### 🧩 Fase 1 — Fix Critici (Obbligatori Subito)

> "Questi NON sono miglioramenti, sono bug UX reali"

| ID  | Issue                                                            | File                | Priorità     |
| --- | ---------------------------------------------------------------- | ------------------- | ------------ |
| C1  | Ghost FAB dopo chiusura ThumbMenu (`frozenCenter` non resettato) | `ThumbMenu.tsx`     | 🔴 Bloccante |
| C2  | `openMenu` silent fail — null context, nessun feedback           | `useThumbMenu.ts`   | 🔴 Bloccante |
| C3  | `LinearProgress` globale, non per-entry (doppio click possibile) | `UserWorkspace.tsx` | 🔴 Bloccante |

> Questi 3 sono **bloccanti di fiducia** — commit unico, immediato.

---

### 🧩 Fase 2 — Chiarezza Interazione (Jarvis Vero)

> "Qui trasformi il sistema da tecnico a naturale"

| ID  | Issue                                                                 | File                                          | Priorità |
| --- | --------------------------------------------------------------------- | --------------------------------------------- | -------- |
| M1  | Onboarding senza titoli — step non identificabili                     | `OnboardingOverlay.tsx`                       | 🟠 Alta  |
| M3  | `selectedIndex=0` auto-select su apertura                             | `ThumbMenu.tsx`                               | 🟠 Alta  |
| M4  | Enter su chip disabilitato = silenzio                                 | `ThumbMenu.tsx`                               | 🟠 Alta  |
| M6  | Entry passive — nessuna affordance visiva di interattività            | `UserWorkspace.tsx`                           | 🟠 Alta  |
| OC  | Onboarding → azione guidata immediata (trigger Orbit sul primo entry) | `OnboardingOverlay.tsx` + `UserWorkspace.tsx` | 🟠 Alta  |
| SB  | Blocco "Suggerito" sopra lista entry                                  | `UserWorkspace.tsx`                           | 🟠 Media |
| ES  | Empty state con CTA attiva                                            | `UserWorkspace.tsx`                           | 🟠 Media |
| TI  | Toast significativi (`${action.label} completata`)                    | `useThumbMenu.ts`                             | 🟠 Media |

---

### 🧩 Fase 3 — Rifinitura (Prodotto Premium)

> "Solo dopo — questo è quello che vende il prodotto"

| ID  | Issue                                                                     | File                  | Priorità |
| --- | ------------------------------------------------------------------------- | --------------------- | -------- |
| M5  | Nessun viewport clamping per chip positions                               | `ThumbMenu.tsx`       | 🟡 Media |
| OL  | Label micro sotto chip selezionato in Orbit                               | `ThumbMenu.tsx`       | 🟡 Media |
| P1  | Header "Spazio di lavoro" in `on-surface-variant` invece di `on-surface`  | `UserWorkspace.tsx`   | 🟡 Bassa |
| P2  | Domain dots senza tooltip                                                 | `UserWorkspace.tsx`   | 🟡 Bassa |
| P4  | Empty state senza CTA                                                     | `UserWorkspace.tsx`   | 🟡 Bassa |
| JI  | JarvisIndicator — stati estesi: `idle / suggestion / active / processing` | `JarvisIndicator.tsx` | 🟡 Bassa |

---

## Dettaglio Implementazione

### Fase 1 — Critical Fixes

#### C1 — Ghost FAB (ThumbMenu.tsx)

```typescript
useEffect(() => {
  if (!open) {
    const t = setTimeout(() => setFrozenCenter(null), ANIM_DURATION + 60);
    return () => clearTimeout(t);
  }
}, [open]);
```

#### C2 — Silent Failure (useThumbMenu.ts)

```typescript
try {
  const ctx = await buildContext(inputId, {
    tenantId,
    role,
    domain: getUserDomain(role),
  });
  if (!ctx) {
    showToast("Contenuto non disponibile", "error");
    return;
  }
  setContext(ctx);
  setOpen(true);
} catch {
  showToast("Errore nel caricamento", "error");
} finally {
  setLoading(false);
}
```

#### C3 — Per-Entry Loading (UserWorkspace.tsx)

- State: `loadingEntryId: string | null`
- Show `CircularProgress` inline sul row cliccato
- Disabilitare altri row durante loading

---

### Fase 2 — Onboarding → Azione

#### Onboarding titles

| Step | Titolo              |
| ---- | ------------------- |
| 1    | Benvenuto           |
| 2    | Aggiungi contenuti  |
| 3    | Azioni intelligenti |
| 4    | Tracciabilità       |

#### Trigger Orbit post-onboarding

```typescript
// OnboardingOverlay.tsx
interface Props {
  onComplete?: () => void; // aggiunta
}
// Su close: onClose(); onComplete?.();

// UserWorkspace.tsx
const handleOnboardingComplete = () => {
  const first = entries[0];
  if (!first) return;
  const el = entryRefs[first.id];
  if (!el) return;
  setTimeout(() => openMenu(first.id, el), 400);
};
```

#### Affordance visiva (AutoAwesome icon)

```tsx
<AutoAwesomeIcon sx={{ fontSize: 14, opacity: 0.4, transition: 'opacity 120ms' }} />
// Hover:
'& svg': { opacity: 1 }
```

---

### Fase 3 — Orbit UX

#### Viewport clamping

```typescript
const safeX = Math.max(40, Math.min(chipX, window.innerWidth - 40));
const safeY = Math.max(40, Math.min(chipY, window.innerHeight - 40));
```

#### Label sotto chip selezionato

```tsx
{
  selectedIndex === i && (
    <Typography
      variant="labelSmall"
      sx={{
        position: "absolute",
        top: safeY + 28,
        left: safeX,
        transform: "translateX(-50%)",
        opacity: 0.7,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {action.label}
    </Typography>
  );
}
```

#### JarvisIndicator — stati

| Stato        | Comportamento          |
| ------------ | ---------------------- |
| `idle`       | invisibile (opacity 0) |
| `suggestion` | pulsazione lenta       |
| `active`     | glow                   |
| `processing` | pulse veloce           |

---

## Vincoli Architetturali

- ❌ Nessun nuovo store
- ❌ Nessuna modifica all'orchestration logic
- ❌ Nessun routing aggiuntivo
- ❌ Nessun UI heavy
- ✅ Tutto minimale
- ✅ Jarvis feel: light, fast, contextuale

---

## Risultato Atteso

```
onboarding    → esperienza guidata + azione immediata
workspace     → suggerisce, invita, è vivo
orbit/thumb   → comprensibile senza tutorial
feedback      → affidabile e significativo
ghost fab     → eliminato
silent errors → eliminati
```

> "anticipates user — guides silently — minimal UI — high intelligence"
> Think JARVIS, not dashboard.

---

## Step Successivo: Jarvis Proattivo

Quando questi fix sono consolidati:

- **Orario docente** → trigger automatici
- **Ingest da file/email/registro** → parsing + suggerimenti
- **Suggerimenti anticipati reali** → context-aware proactive actions

> 💣 lì diventa davvero rivoluzionario
