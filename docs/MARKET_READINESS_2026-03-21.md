# Market Readiness Analysis — Marzo 2026

_Data: 2026-03-21 | Autore: analisi automatizzata codebase_

---

## Il sistema attuale: 3 layer distinti

```
┌─────────────────────────────────────────────────────────────┐
│  ORBIT (app utente finale)                                  │
│  PWA per docenti — UDA, registro, AI assistant              │
│  Stato: ✅ Pilota-ready, brand creato, GDPR B2/B4/B5 ok     │
├─────────────────────────────────────────────────────────────┤
│  COPILOTDOC (portale vendita PA)                            │
│  CopilotDocentePanel, 14+ tab AI, AuditPA, GDPR/AgID        │
│  Stato: ✅ funzionale, brand ok, no multi-tenant             │
├─────────────────────────────────────────────────────────────┤
│  ENGINE (AI core condiviso)                                 │
│  copilotBrain, orchestrator, sovereigntyRouter              │
│  Stato: ✅ Sprint 1–9 completi, C1–C21 completati            │
└─────────────────────────────────────────────────────────────┘
```

---

## Cosa c'è già (solido)

| Area                                              | Stato         |
| ------------------------------------------------- | ------------- |
| Core AI (engine, orchestrator, audit trail)       | ✅ Sprint 1–9 |
| GDPR consent, retention, right to erasure         | ✅            |
| Sovereignty layer (AI on/off per utente)          | ✅            |
| Feature flags (AI on/off)                         | ✅ C19        |
| AuditPA panel (GDPR/AI Act/AgID simulator)        | ✅            |
| Brand Orbit + CopilotDoc (icone, CSS, componenti) | ✅            |
| CSV import Argo/Spaggiari                         | ✅ D3         |
| ToS modale                                        | ✅ D1         |
| CI/CD (4 workflow GitHub Actions)                 | ✅            |
| Test baseline: 1740/1752                          | ✅            |

---

## Gap per andare al mercato

### Tier 1 — Docente privato (€5–8/mese) → 1–3 mesi

| Gap                           | Azione richiesta                                              | Effort           |
| ----------------------------- | ------------------------------------------------------------- | ---------------- |
| Dominio                       | Registrare `orbit.app` o `copilotdoc.it` (D2)                 | 1h burocrazia    |
| DPA Vercel + Anthropic        | Firmare accordi online (D3/D4)                                | 2h burocrazia    |
| Registro trattamenti          | Documento art.30 GDPR (B1)                                    | Supporto legale  |
| **Paywall / subscription UI** | **Zero — nessun sistema di pagamento.** Stripe o LemonSqueezy | 2–3 gg dev       |
| **Account management**        | **Tutto è localStorage — nessun login reale.**                | Richiede backend |

### Tier 2 — Singola scuola (€200–500/anno) → 3–6 mesi

| Gap                     | Azione richiesta                                                                         | Effort        |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| **Multi-tenant**        | **Non esiste.** Solo `localStorage`. Serve isolamento dati per docente + ruolo dirigente | 3–4 settimane |
| **Auth system**         | Google GSI solo per Drive. Serve autenticazione reale (Supabase Auth, Clerk)             | 1 settimana   |
| **Dashboard dirigente** | Prevista in PIANO_LANCIO §2.2, non implementata                                          | 2 settimane   |
| **RBAC**                | Admin vs docente vs dirigente — zero enforcement a runtime                               | 1 settimana   |
| **Backend reale**       | Vercel Edge solo per AI proxy. Nessun DB cloud, nessuna persistenza utenti               | 2–3 settimane |

### Tier 3 — Multi-scuola / rete scolastica → 6–12 mesi

| Gap                 | Azione richiesta                       | Effort / Costo     |
| ------------------- | -------------------------------------- | ------------------ |
| Tenant isolation DB | Row-level security o schema-per-tenant | 2–3 settimane      |
| Superadmin panel    | Gestione licenze, scuole, usage        | 2 settimane        |
| Analytics aggregati | Cross-scuola per dirigenti di rete/USR | 2 settimane        |
| AGID qualificazione | Iter burocratico                       | €2–5k + 3–6 mesi   |
| SPID/CIE            | Identity provider PA                   | €500–2k + 1–3 mesi |
| SLA 99.99%          | Vercel Pro                             | €20/mese           |
| Pentest             | Società certificata, prerequisito C3   | €3–8k              |
| WCAG 2.1 AA         | Audit accessibilità (Legge Stanca)     | €1–3k              |

---

## Gap strutturale critico: nessun backend

Tutto il sistema è **SPA full-client con localStorage**. Questo blocca ogni tier commerciale.

```
OGGI:
  Browser → API Edge (solo AI proxy) → Gemini/Anthropic
  Browser → localStorage (tutto il resto)

NECESSARIO:
  Browser → Auth (Supabase/Clerk) → DB cloud (Postgres)
  Browser → Edge API (AI + business logic) → DB
  Admin   → Superadmin API → Tenant management
```

**Scelta consigliata: Supabase** — include Auth, DB Postgres, Edge Functions, Storage, RLS multi-tenant.
Compatibile con React + TypeScript + Vercel, free tier generoso per il pilota.

---

## Modelli di business

| Modello                                | Prezzo                   | Break-even            |
| -------------------------------------- | ------------------------ | --------------------- |
| SaaS individuale                       | €5–8/mese per docente    | 20–30 docenti paganti |
| Licenza istituto                       | €200–500/anno per scuola | 5–10 scuole           |
| Freemium (base gratis, AI a pagamento) | €3–5/mese funzioni AI    | 40–60 utenti attivi   |
| Bando PNRR / fondi scuola              | €10–50k grant una tantum | 1 bando vinto         |

---

## Roadmap verso il mercato

```
Mese 1–2   → Tier 1: Privato / Freemium
             · Dominio + DPA (burocrazia, ~€15 + 4h)
             · Stripe integration per subscription
             · Landing page Orbit + pricing page CopilotDoc

Mese 3–4   → Tier 2: Singola scuola
             · Auth reale (Supabase Auth o Clerk)
             · DB cloud: profili docenti, classi, UDA persistenti
             · Dashboard dirigente basic
             · Feature flag per-tenant in sovereigntyStore

Mese 5–6   → Beta istituzionale
             · Multi-tenant isolation nel DB (RLS Supabase)
             · Import CSV + sync bidirezionale registro
             · Superadmin panel (licenze, usage, billing)
             · Primo contratto pilota → break-even

Mese 6–12  → PA ufficiale
             · AGID qualificazione
             · SPID/CIE
             · Pentest + WCAG 2.1
             · SLA contrattuale
```

---

## Azioni immediate (questa settimana)

1. **Decisione architettura backend** — scegliere Supabase (raccomandato) o alternativa
2. **Decisione business** — freemium docente o solo B2B scuola (impatta architettura auth)
3. **DPA burocrazia** — Vercel Data Processing Agreement + Anthropic BAA (prerequisito legale distribuzione)
4. **Stripe/LemonSqueezy** — collegare payment provider per tier privato (2–3 gg dev)

> Il sistema AI è già robusto.  
> Il collo di bottiglia non è la tecnologia AI — **è l'infrastruttura di distribuzione** (auth, DB, multi-tenant, billing).

---

## Costi infrastruttura stimati per fase

| Fase                 | Voce                         | Costo           |
| -------------------- | ---------------------------- | --------------- |
| Pilota               | Vercel Hobby + Gemini Flash  | < €5/mese       |
| Distribuzione libera | + dominio `.app`             | + €15/anno      |
| Singola scuola       | + Supabase Pro               | + €25/mese      |
| Multi-scuola         | + Vercel Pro + Supabase Team | + €50/mese      |
| PA ufficiale         | + pentest + AGID + SPID      | €8–22k one-time |
