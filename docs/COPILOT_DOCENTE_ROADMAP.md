# Copilot Docente Avanzato — Roadmap Kanban

> Aggiornato: 14 marzo 2026 · Progetto: DocenteDoc AI

---

## Legenda

| Simbolo | Priorità | Simbolo | Stato       |
| ------- | -------- | ------- | ----------- |
| 🔴      | Alta     | ⬜      | To Do       |
| 🟡      | Media    | 🔄      | In Progress |
| 🔵      | Bassa    | ✅      | Done        |

---

## Board Kanban

```
┌─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐
│          ⬜  TO DO           │        🔄  IN PROGRESS       │          ✅  DONE            │
├─────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│                             │                             │                             │
│  Sprint 3 ─────────────── 🟡│  Sprint 1 ─────────────── 🔴│  CopilotDocentePanel ───── ✅│
│  Communication Helper       │  Performance Insights       │  Tab: Performance            │
│  ─────────────────────────  │  ─────────────────────────  │  Tab: Overview               │
│  • Messaggi precompilati    │  • Trend studenti per classe │  Tab: Andamento              │
│    per genitori/studenti    │  • Heatmap voti/assenze      │  Tab: Esportazione           │
│  • Preview e invio multiplo │  • Indicatori rischio/       │  Tab: Planning               │
│  • Template per tipologia     │    eccellenza per studente │  Tab: Aggregated Insights    │
│    (recupero, lode, prova)  │  • Filtri classe/studente    │  ─────────────────────────  │
│  ─────────────────────────  │    sincronizzati             │  Wired con:                  │
│  ⏱ 3–5 giorni              │  ─────────────────────────  │  useAIPipeline               │
│  🔗 → Sprint 1 + 2          │  ⏱ 3–5 giorni (attivo)     │  useAISnapshotStore          │
│                             │  🔗 → useAIPipeline          │  AnalyticsHub (props sync)   │
│ ──────────────────────────  │    AISuggestionsPanel        │                             │
│                             │    ClassHealthWidget         │                             │
│  Sprint 4 ─────────────── 🔵│                             │                             │
│  Predizione Trend Futuri    │  Sprint 2 ─────────────── 🟡│                             │
│  ─────────────────────────  │  Planning Assistant         │                             │
│  • Forecast voti/assenze    │  ─────────────────────────  │                             │
│  • Early-warning studenti   │  • Suggerimenti attività    │                             │
│    a rischio                │    personalizzate            │                             │
│  • Grafici forecast lineari │  • Recuperi per studenti     │                             │
│  • Heatmap predittiva       │    a rischio                 │                             │
│  ─────────────────────────  │  • Approfondimenti per       │                             │
│  ⏱ 5–8 giorni              │    studenti eccellenza        │                             │
│  🔗 → Sprint 1              │  ─────────────────────────  │                             │
│    AISnapshotStore          │  ⏱ 5–7 giorni              │                             │
│                             │  🔗 → Sprint 1              │                             │
│ ──────────────────────────  │                             │                             │
│                             │                             │                             │
│  Sprint 5 ─────────────── 🔵│                             │                             │
│  Aggregated Dashboard       │                             │                             │
│  ─────────────────────────  │                             │                             │
│  • Pannello unico integrato │                             │                             │
│  • ClassHealth + Trend +    │                             │                             │
│    Performance + AI         │                             │                             │
│  • Export PDF/Excel unificato│                            │                             │
│  ─────────────────────────  │                             │                             │
│  ⏱ 2–4 giorni              │                             │                             │
│  🔗 → Sprint 1→2→3→4        │                             │                             │
│                             │                             │                             │
└─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## Sprint Detail Cards

---

### ✅ CopilotDocentePanel (Completato)

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅  CopilotDocentePanel — Completato                           │
│  ─────────────────────────────────────────────────────────────  │
│  File: src/components/dashboard/CopilotDocentePanel.tsx         │
│                                                                 │
│  Tabs implementati:                                             │
│  ├─ 📊 Performance       → CopilotPerformancePanel             │
│  ├─ 🩺 Overview          → CopilotHealthOverviewPanel           │
│  ├─ 📈 Andamento         → AITrendPanel                         │
│  ├─ 📤 Esportazione      → ExportModal                          │
│  ├─ 🗓 Planning          → LessonAssistantPanel + UdaPlanner    │
│  └─ 🔮 Aggregated Insights → AISuggestionsPanel + TeacherCopilot│
│                                                                 │
│  Integrazione: AnalyticsHub → props: lessonAssistant, udas,     │
│  competenze, settings, students, evaluations                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Sprint 1 — Performance Insights `🔴 Alta Priorità`

```
┌─────────────────────────────────────────────────────────────────┐
│  🔄  Sprint 1 — Performance Insights                           │
│  ─────────────────────────────────────────────────────────────  │
│  Priorità: 🔴 Alta    Durata: 3–5 giorni    Stato: In Progress  │
│  ─────────────────────────────────────────────────────────────  │
│  Deliverable                                                    │
│  ├─ [ ] Analisi trend per studente (media mobile ultimi 30gg)  │
│  ├─ [ ] Heatmap voti/assenze per classe                        │
│  ├─ [ ] Indicatori rischio (< soglia) + eccellenza (≥ 9)      │
│  └─ [ ] Filtri classe/studente sincronizzati con AnalyticsHub  │
│                                                                 │
│  Dipendenze                                                     │
│  ├─ useAIPipeline (src/hooks/useAIPipeline.ts)                 │
│  ├─ AISuggestionsPanel (src/components/ai/)                    │
│  └─ ClassHealthWidget (src/components/dashboard/)              │
│                                                                 │
│  Output chiave: CopilotPerformancePanel v2 + heatmap chart     │
└─────────────────────────────────────────────────────────────────┘
```

---

### ⬜ Sprint 2 — Planning Assistant `🟡 Media Priorità`

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬜  Sprint 2 — Planning Assistant                             │
│  ─────────────────────────────────────────────────────────────  │
│  Priorità: 🟡 Media    Durata: 5–7 giorni    Stato: To Do      │
│  ─────────────────────────────────────────────────────────────  │
│  Deliverable                                                    │
│  ├─ [ ] Suggerimenti attività personalizzate per studente      │
│  ├─ [ ] Piano recupero auto-generato per studenti a rischio    │
│  ├─ [ ] Piano approfondimento per studenti in eccellenza       │
│  └─ [ ] Integrazione con UDA esistenti (UdaPlanner)            │
│                                                                 │
│  Dipendenze                                                     │
│  └─ Sprint 1 completato (insight performance necessari)        │
│                                                                 │
│  Output chiave: PlanningAssistantPanel + suggerimenti AI tipati │
└─────────────────────────────────────────────────────────────────┘
```

---

### ⬜ Sprint 3 — Communication Helper `🟡 Media Priorità`

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬜  Sprint 3 — Communication Helper                           │
│  ─────────────────────────────────────────────────────────────  │
│  Priorità: 🟡 Media    Durata: 3–5 giorni    Stato: To Do      │
│  ─────────────────────────────────────────────────────────────  │
│  Deliverable                                                    │
│  ├─ [ ] Messaggi precompilati AI per genitori (recupero, lode) │
│  ├─ [ ] Messaggi precompilati AI per studenti (feedback diretto)│
│  ├─ [ ] Preview modale MD3 + conferma invio multiplo           │
│  └─ [ ] Template per tipo: recupero / eccellenza / prova       │
│                                                                 │
│  Dipendenze                                                     │
│  ├─ Sprint 1 (profili rischio/eccellenza per targeting)        │
│  └─ Sprint 2 (contesto pianificazione per messaggi coerenti)   │
│                                                                 │
│  Output chiave: CommunicationHelperPanel + MessagePreview      │
└─────────────────────────────────────────────────────────────────┘
```

---

### ⬜ Sprint 4 — Predizione Trend Futuri `🔵 Bassa Priorità`

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬜  Sprint 4 — Predizione Trend Futuri                        │
│  ─────────────────────────────────────────────────────────────  │
│  Priorità: 🔵 Bassa    Durata: 5–8 giorni    Stato: To Do      │
│  ─────────────────────────────────────────────────────────────  │
│  Deliverable                                                    │
│  ├─ [ ] Forecast voti prossime 4 settimane (regressione lineare)│
│  ├─ [ ] Forecast assenze con early-warning soglia critica      │
│  ├─ [ ] Grafici lineari forecast (Chart.js / Recharts)         │
│  └─ [ ] Heatmap predittiva classe per periodo                  │
│                                                                 │
│  Dipendenze                                                     │
│  ├─ Sprint 1 (serie storiche necessarie per modello)           │
│  └─ useAISnapshotStore (snapshot temporali per training)       │
│                                                                 │
│  Output chiave: TrendForecastPanel + ForecastChart             │
└─────────────────────────────────────────────────────────────────┘
```

---

### ⬜ Sprint 5 — Aggregated Dashboard Unica `🔵 Bassa Priorità`

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬜  Sprint 5 — Aggregated Dashboard Unica                     │
│  ─────────────────────────────────────────────────────────────  │
│  Priorità: 🔵 Bassa    Durata: 2–4 giorni    Stato: To Do      │
│  ─────────────────────────────────────────────────────────────  │
│  Deliverable                                                    │
│  ├─ [ ] Pannello unico: ClassHealth + Trend + Performance + AI │
│  ├─ [ ] Grid MD3 responsive (1–4 col, token spacing)           │
│  ├─ [ ] Export PDF/Excel unificato multi-modulo                │
│  └─ [ ] Quick-filter globale classe/studente/periodo           │
│                                                                 │
│  Dipendenze                                                     │
│  └─ Sprint 1 → 2 → 3 → 4 (tutti completati)                   │
│                                                                 │
│  Output chiave: AggregatedDashboardView (entry in viewRegistry) │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architettura dipendenze

```
  useAIPipeline ──────────────────────────────► Sprint 1
  useAISnapshotStore ──────────────────────────► Sprint 1, Sprint 4
  AnalyticsHub (filtri classe/studente) ───────► tutti gli sprint
                                                     │
                        ┌────────────────────────────┘
                        ▼
              Sprint 1 (Performance Insights)
                        │
          ┌─────────────┴──────────────┐
          ▼                            ▼
  Sprint 2 (Planning)        Sprint 4 (Predizione)
          │
          ▼
  Sprint 3 (Communication)
          │
          └──────────────────► Sprint 5 (Dashboard Unica)
```

---

## Timeline orientativa

```
Marzo 2026       Aprile 2026         Maggio 2026
│                │                   │
├── Sprint 1 ────┤                   │
│   (3-5 gg)     │                   │
│                ├── Sprint 2 ───────┤
│                │   (5-7 gg)        │
│                │                   ├── Sprint 3 ────┐
│                │                   │   (3-5 gg)     │
│                │                   │                ├── Sprint 4 ────┐
│                │                   │                │   (5-8 gg)     │
│                │                   │                │                ├── Sprint 5 ──►
│                │                   │                │                │   (2-4 gg)
```

---

## Note tecniche

- Tutti i moduli rispettano le **regole MD3**: container via `M3Surface`, tipografia via `M3Typography`, spacing solo da token MD3.
- Nessuna chiamata AI diretta dal browser — tutto passa per `api/ai.ts` (Vercel Edge Function).
- I filtri classe/studente sono sincronizzati tramite lo store Zustand condiviso in `AnalyticsHub`.
- Ogni nuovo pannello va registrato in `src/utils/viewRegistry.ts` per il pre-fetch bundle.
- Test Vitest obbligatorio per ogni nuovo hook/engine AI prima del merge.
