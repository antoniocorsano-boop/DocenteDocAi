# DocenteDoc AI — Piani di Sviluppo

Documento di riferimento per gli sviluppi futuri, organizzato per obiettivo.  
Aggiornato: Marzo 2026 — post Sprint 9, commit `7596a387`.

---

## Stato attuale (baseline)

- **Pipeline AI**: Sprint 1–9 completati — core UDA, classroom, valutazione, Decision Support, Copilot, telemetria, Audit Livello 6
- **Test**: 1740 passed / 1752 total (12 skip intenzionali) — 0 failing
- **Pilota**: ✅ pronto — consent GDPR, data retention, AITabErrorBoundary per i 12 sub-tab copilot
- **CI**: 4 GitHub Actions attivi (lint+tsc, test+coverage, release-gate, e2e-smoke)

---

## Piano A — Qualità Tecnica

_Obiettivo: code health, manutenibilità, sicurezza dati._  
_Scenario target: sempre consigliato, indipendente dalla distribuzione._

| ID  | Feature                | Descrizione                                                                                                                        | Effort stimato | Stato           |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------- |
| A1  | AITabErrorBoundary     | Error boundary per i 12 sub-tab CopilotDocentePanel                                                                                | 3h             | ✅ completato   |
| A2  | `schemaVersion` backup | Aggiungere campo versione ai backup localStorage + migration guard al caricamento                                                  | 2h             | ⬜ backlog      |
| A3  | GitHub Actions CI      | lint → tsc → vitest su ogni push/PR                                                                                                | 1h             | ✅ già esisteva |
| A4  | Input snapshot audit   | Verificare che nessun dato studente raggiunga il modello AI non sanitizzato; aggiungere test di integrazione sul proxy `api/ai.ts` | 4h             | ⬜ backlog      |
| A5  | OpenAPI `api/ai.ts`    | Documentare il proxy Vercel Edge con schema OpenAPI 3.1 (request/response, error codes)                                            | 3h             | ⬜ backlog      |
| A6  | Dependency audit       | `npm audit` + aggiornamento dipendenze peer MUI v7/React 18 quando stabili                                                         | 2h             | ⬜ backlog      |

---

## Piano B — GDPR Compliance

_Obiettivo: conformità al Regolamento UE 2016/679 per distribuzione a più docenti._  
_Scenario target: distribuzione libera a qualunque docente (non solo pilota)._  
_Stima: 2–3 mesi, principalmente lavoro documentale + piccole UI._

| ID  | Feature                | Descrizione                                                                                                                                  | Effort stimato | Stato         |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| B1  | Registro trattamenti   | Documento art.30 GDPR: finalità, base giuridica, categorie dati, retention, destinatari. **Non è codice** — template AGID o supporto legale. | 1 gg           | ⬜ backlog    |
| B2  | Privacy consent screen | Modale bloccante GDPR art.13 al primo avvio, due checkbox obbligatorie                                                                       | 4h             | ✅ completato |
| B3  | DPA fornitori          | Firmare Data Processing Agreement con Vercel + Anthropic + Google. Form online, nessuno sviluppo.                                            | 2h burocrazia  | ⬜ backlog    |
| B4  | Data retention         | Auto-purge artefatti AI da localStorage dopo 365 giorni. `runRetentionCheck()` all'avvio.                                                    | 3h             | ✅ completato |
| B5  | Right to erasure UI    | Pulsante "Cancella dati AI" in Settings → Avanzate. Chiama `purgeAIData()` già disponibile.                                                  | 2h             | ✅ completato |

---

## Piano C — Certificazione PA

_Obiettivo: adozione ufficiale da parte di istituti scolastici pubblici italiani._  
_Scenario target: contratti con PA, fondi PNRR, bandi._  
_Stima: 9–12 mesi. Non avviare prima che il pilota sia validato._

| ID  | Feature                     | Descrizione                                                                                  | Effort stimato   | Stato      |
| --- | --------------------------- | -------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| C1  | Dichiarazione accessibilità | Audit WCAG 2.1 AA (axe, WAVE, screen reader) + dichiarazione pubblica su sito (Legge Stanca) | 2 settimane      | ⬜ backlog |
| C2  | SPID/CIE                    | Integrazione identity provider SPID (es. Aruba, Infocert). Richiede P.IVA e iter AGID.       | 1–3 mesi         | ⬜ backlog |
| C3  | Pentest                     | Vulnerability assessment da società certificata. Prerequisito: A4 completato.                | 1–2 mesi + €3–8k | ⬜ backlog |
| C4  | SLA garantito               | Passaggio a Vercel Pro (€20/mese) per SLA 99.99% richiesto da contratti PA                   | 1h               | ⬜ backlog |
| C5  | AGID qualificazione         | Iter burocratico + documentazione tecnica + dichiarazioni conformità                         | 3–6 mesi         | ⬜ backlog |

---

## Scenari di distribuzione

| Scenario                                                 | Prerequisiti               | Tempo     |
| -------------------------------------------------------- | -------------------------- | --------- |
| **Pilota** — singolo docente, uso personale              | ~~A1, B2, B4~~ ✅ + B5     | ✅ ora    |
| **Distribuzione libera** — più docenti, qualsiasi scuola | Piano A + Piano B completo | 2–3 mesi  |
| **Contratto PA** — istituti scolastici ufficiali         | Piano A + B + C            | 9–12 mesi |

---

## Note di architettura

- `purgeAIData()` in `src/utils/dataRetention.ts` — cancella artefatti AI, non tocca dati primari docente
- `hasPrivacyConsent()` / `recordConsent()` in `src/components/PrivacyConsentModal.tsx`
- `runRetentionCheck()` chiamato all'avvio in `src/main.tsx` (dopo il legacy storage IIFE)
- `AITabErrorBoundary` in `src/components/copilot/AITabErrorBoundary.tsx` — usato in `CopilotDocentePanel.tsx`
