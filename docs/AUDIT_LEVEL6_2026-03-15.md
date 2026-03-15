# DocenteDoc AI — Audit di Maturità Livello 6

> **Data audit:** 15 marzo 2026  
> **Revisore:** AI Auditor automatizzato  
> **Commit HEAD:** `c763480c`  
> **Versione progetto:** v4.2-sprint9

---

## 1. Maturity Dashboard

| Dimensione                           | Punteggio   | Livello  | Note sintetiche                                                                                          |
| ------------------------------------ | ----------- | -------- | -------------------------------------------------------------------------------------------------------- |
| **Pipeline Pedagogia** (Sprint 6)    | **4.5 / 5** | Avanzato | 5 dimensioni Bloom, keyword MIM-allineate IT, funzioni pure, 51 test                                     |
| **Trust Engine** (Sprint 7)          | **4.0 / 5** | Avanzato | 4 dimensioni composite, integrazione bias Sprint 5, store uniforme. Gap: `studentId` non pseudonimizzato |
| **Recommendation Engine** (Sprint 8) | **4.0 / 5** | Avanzato | Sintesi 3 sorgenti, dedup, attività Bloom-targeted, curriculum advisor. Gap: contatori globali `_seq`    |
| **Integrazione UI** (Sprint 9)       | **4.0 / 5** | Avanzato | Tab 11 con dati reali da store, MD3 compliant, aria-label ovunque. Gap: nessun test unitario             |
| **Copertura Test**                   | **3.5 / 5** | Buono    | 492 test AI passati / 22 file. 1 test failing (simulation determinism). Mancano E2E Tab 11               |
| **Conformità Normativa (GDPR)**      | **2.5 / 5** | Parziale | Elaborazione 100% client-side, no API esterna. Gap: `studentId` grezzo in telemetria, no consenso        |

### Punteggio Complessivo

```
(4.5 + 4.0 + 4.0 + 4.0 + 3.5 + 2.5) / 30 = 22.5 / 30 = 75%  →  CONDITIONAL PASS
```

---

## 2. Certification Summary (JSON)

```json
{
  "project": "DocenteDocAI",
  "version": "v4.2-sprint9",
  "commitHash": "c763480c",
  "auditDate": "2026-03-15",
  "auditLevel": 6,
  "overallScore": 75,
  "verdict": "CONDITIONAL_PASS",
  "dimensions": {
    "pedagogyPipeline": { "score": 4.5, "maxScore": 5, "status": "PASS" },
    "trustEngine": { "score": 4.0, "maxScore": 5, "status": "PASS" },
    "recommendationEngine": { "score": 4.0, "maxScore": 5, "status": "PASS" },
    "uiIntegration": { "score": 4.0, "maxScore": 5, "status": "PASS" },
    "testingCoverage": { "score": 3.5, "maxScore": 5, "status": "WARN" },
    "regulatoryReadiness": { "score": 2.5, "maxScore": 5, "status": "FAIL" }
  },
  "pipelines": {
    "pedagogy": { "sprint": 6, "modules": 4, "tests": 51, "passing": true },
    "trust": { "sprint": 7, "modules": 3, "tests": 40, "passing": true },
    "recommendation": {
      "sprint": 8,
      "modules": 4,
      "tests": 42,
      "passing": true
    },
    "uiTeacher": { "sprint": 9, "modules": 1, "tests": 0, "passing": null }
  },
  "testSummary": {
    "totalAiFiles": 22,
    "totalAiTests": 492,
    "failing": 1,
    "failingReason": "simulation.test.ts:292 — executionTimeMs è wall-clock, non deterministico"
  },
  "openRisks": [
    {
      "id": "R1",
      "severity": "HIGH",
      "category": "GDPR",
      "title": "studentId non pseudonimizzato in TrustScore e Telemetria"
    },
    {
      "id": "R2",
      "severity": "MEDIUM",
      "category": "Testing",
      "title": "Nessun test per CopilotRecommendationPanel"
    },
    {
      "id": "R3",
      "severity": "LOW",
      "category": "Testing",
      "title": "_seq/_curSeq globali non reset — IDs non deterministici tra suite"
    },
    {
      "id": "R4",
      "severity": "LOW",
      "category": "Tracing",
      "title": "Audit trail solo in-memory (max 50 voci) — IndexedDB non implementato"
    },
    {
      "id": "R5",
      "severity": "LOW",
      "category": "Quality",
      "title": "Typo in DIM_LABELS_IT: 'attività ordi superiore' → 'ordine'"
    },
    {
      "id": "R-Sim",
      "severity": "MEDIUM",
      "category": "Testing",
      "title": "simulation.test.ts determinism failure su executionTimeMs"
    },
    {
      "id": "R6",
      "severity": "LOW",
      "category": "Architecture",
      "title": "CopilotRecommendationPanel manca PluginSlot 'studio-tools'"
    },
    {
      "id": "R7",
      "severity": "LOW",
      "category": "Feature",
      "title": "Benchmarks simulazione non integrati nella vista docente"
    }
  ]
}
```

---

## 3. Gap Analysis + Raccomandazioni

### R1 — GDPR: studentId grezzo nei buffer AI (ALTA priorità)

**File coinvolti:** `src/ai/telemetry/aiTelemetry.ts`, `src/ai/trust/trustScoreEngine.ts`

`AITelemetryEvent` emette `studentId` raw via `console.debug`. `StudentTrustScore` mantiene `studentId` identificabile in oggetti intermedi. In un contesto scolastico italiano reale (DPCM 2015, Reg. UE 2016/679), i dati personali degli studenti minorenni non possono essere processati senza pseudonimizzazione.

**Azioni:**

1. Rimuovere `studentId` da `AITelemetryEvent` (o sostituire con hash deterministico)
2. Aggiungere hook `useConsentStore` per bloccare pipeline AI senza consenso esplicito
3. Implementare `clearAIPersonalData()` in ogni store AI per right-to-erasure

### R-Sim — Simulation determinism (MEDIA priorità)

**File:** `src/ai/simulation/__tests__/simulation.test.ts:292`

`BenchmarkMetrics.executionTimeMs` è wall-clock time — non può essere deterministico. Il test usa `toStrictEqual` su tutto l'oggetto.

**Fix:** Escludere `executionTimeMs` dal confronto.

### R5 — Typo DIM_LABELS_IT (BASSA priorità)

**File:** `src/ai/recommendation/lessonRecommender.ts:57`

`'attività ordi superiore (HOTS)'` → `'attività di ordine superiore (HOTS)'`

### R3 — Contatori globali \_seq non resettati (BASSA priorità)

**File:** `src/ai/recommendation/lessonRecommender.ts`, `src/ai/recommendation/curriculumAdvisor.ts`

I contatori `_seq` e `_curSeq` sono globali a livello di modulo. Tra test run consecutivi gli ID crescono cumulativamente, rendendo fragili snapshot test e test di integrazione cross-suite.

**Fix:** Esportare funzione `_resetIdSeqForTesting` condizionale a `import.meta.env.TEST`.

### R2 — Nessun test CopilotRecommendationPanel (MEDIA priorità)

Aggiungere `src/components/copilot/__tests__/CopilotRecommendationPanel.test.tsx` con almeno 6 casi: stato iniziale, loader, empty result, recommendation cards, genera attività, ricalcola.

### R4 — Audit trail solo in-memory (BASSA priorità)

**File:** `src/ai/audit/auditTrail.ts`

Il buffer è in-memory max 50 voci, si azzera al refresh. La JSDoc di `unifiedOrchestrator.ts` dichiara IndexedDB persistence che non è implementata.

**Fix:** Aggiungere `indexedDbService.saveAuditTrail(trail)` fire-and-forget in `pushAudit()`.

### R6 — PluginSlot mancante (BASSA priorità)

`CopilotRecommendationPanel` non espone `<PluginSlot slot="studio-tools" />` a differenza della controparte DevTools.

### R7 — Benchmarks simulazione esclusi dalla vista docente (BASSA priorità)

`generateRecommendations` riceve `[]` come benchmarks. Le raccomandazioni basate su F1/riskDetectionRate non appaiono nella vista teacher.

---

## 4. Piano di Risoluzione

Vedi risoluzione incrementale nei commit successivi a `c763480c`.

| Rischio | Fix commit                                         | Stato |
| ------- | -------------------------------------------------- | ----- |
| R-Sim   | fix(test): correzione determinism simulation       | ⏳    |
| R5      | fix(recommendation): typo DIM_LABELS_IT            | ⏳    |
| R3      | fix(recommendation): reset \_seq per test          | ⏳    |
| R1      | fix(gdpr): rimuovi studentId da aiTelemetry        | ⏳    |
| R6      | feat(ui): PluginSlot in CopilotRecommendationPanel | ⏳    |
| R2      | test(copilot): CopilotRecommendationPanel suite    | ⏳    |
| R4      | feat(audit): IndexedDB persistence in pushAudit    | ⏳    |

---

## 5. MD3 Compliance

| Check                                                          | Stato |
| -------------------------------------------------------------- | ----- |
| Container visivi: `Box`/`Stack`/`InfoCard` (no `<div>` visivi) | ✅    |
| Tipografia via `Typography variant=` MD3                       | ✅    |
| Spacing via `var(--md-sys-spacing-*)`                          | ✅    |
| `aria-label` su tutti gli elementi interattivi                 | ✅    |
| Icone decorative con `aria-hidden`                             | ✅    |
| Token colore `var(--md-sys-color-*)`                           | ✅    |
| Nessun `box-shadow` custom                                     | ✅    |

---

_Prossima revisione programmata: Sprint 10 / v4.3_
