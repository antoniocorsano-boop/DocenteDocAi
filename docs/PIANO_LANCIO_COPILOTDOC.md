# CopilotDoc AI — Piano Completo di Sviluppo e Lancio

## 1. Visione del Prodotto

**Obiettivo:** Creare una piattaforma AI-driven per scuole che supporti docenti, dirigenti e
amministratori, riduca il carico manuale, fornisca insight intelligenti e automatizzi attività,
integrandosi con registri elettronici e standard ministeriali.

**Valore per gli utenti:**

- **Docenti:** suggerimenti step-by-step, automazioni semi-autonome, gestione documenti
- **Dirigenti:** dashboard multi-classe, alert proattivi, analisi rischi/studenti
- **Scuole:** integrazione registro, compliance, audit e sicurezza dei dati

---

## 2. Architettura Tecnica

### 2.1 Livelli Principali

```
CopilotDoc Enterprise
│
├─ Tenant Layer (School)
│   ├─ Teachers / Admin / Principal
│   ├─ Students / Classes
│   ├─ Knowledge Graph
│   └─ Automations
│
├─ AI Layer
│   ├─ Reasoning Engine
│   ├─ NextAction
│   └─ Autonomous Layer
│
├─ Integration Layer
│   ├─ School System Adapters (Axios / Spaggiari / Argo)
│   ├─ Document Memory
│   └─ Compliance + Audit
│
└─ UI Layer
    ├─ Teacher Dashboard
    ├─ Principal Dashboard
    └─ Chat Interface
```

### 2.2 Componenti Chiave

- **Knowledge Graph:** memoria strutturata di studenti, classi, verifiche e attività
- **Reasoning Engine:** analizza dati e genera insight
- **Next Action:** suggerisce passo successivo all'utente
- **Autonomous Layer:** regole di automazione semi-autonome
- **Multi-Tenant:** isolamento dati per scuola
- **Dashboard Dirigente:** overview e analytics
- **Integration Layer:** con registri elettronici e standard ministeriali
- **Chat Operativa:** interfaccia conversazionale proattiva

---

## 3. MVP (Minimum Viable Product)

**Funzionalità Core:**

1. Upload documenti/foto → Knowledge Graph → linking automatico
2. Next Action intelligente
3. Reasoning Engine con insight studenti/classi
4. Autonomous Actions Layer per attività semi-automatiche
5. Multi-tenant con isolamento dati
6. Dashboard docente e chat operativa
7. Integrazione registro elettronico (import/export)
8. Compliance e audit log

**Output MVP:** sistema operativo AI per docenti, pronto per test pilota in 1–2 scuole.

---

## 4. Fasi di Sviluppo

| Fase | Descrizione       | Output                                                                       |
| ---- | ----------------- | ---------------------------------------------------------------------------- |
| 1    | Core MVP          | Knowledge Graph + Reasoning Engine + Next Action + chat + dashboard docente  |
| 2    | Enterprise        | Multi-tenant, dashboard dirigente, automazioni scuola, integrazione registro |
| 3    | Scaling           | Multi-scuola, analytics aggregati, AI policy suggestions                     |
| 4    | Registro completo | Integrazione con SIDI, documenti ufficiali, compliance GDPR                  |

---

## 5. Automazioni e Insight

### 5.1 Esempi di Automazioni

- Assegna attività recupero per studenti con voti < 6
- Avvisa docenti/dirigenti su classi a rischio
- Invio settimanale automatico dei voti al registro

### 5.2 Insight Chiave

- Studenti a rischio
- Classi con calo prestazioni
- Docenti sovraccarichi
- Mancanza di verifiche o attività

---

## 6. Strategia Go-To-Market

### 6.1 Target Iniziale

- Scuole medie e superiori
- Dirigenti e insegnanti tech-friendly

### 6.2 MVP Rollout

1. Pilot in 1–2 scuole
2. Raccolta feedback
3. Refinement flussi e UX
4. Preparazione pricing e contratto

### 6.3 Pricing

- **Tier Base:** docente + classi
- **Tier Enterprise:** dirigente + multi-classi + automazioni avanzate
- Licenza annuale per scuola

---

## 7. Marketing e Promozione

### 7.1 Materiali Promozionali

- Video demo del sistema
- Case study pilota scuole
- Schede funzionalità per docenti e dirigenti
- Infografica flussi documenti → insight → azione

### 7.2 Canali

- Presentazioni scuole
- Newsletter educazione digitale
- Webinar demo prodotto
- Social network mirati a docenti e dirigenti

---

## 8. Compliance e Sicurezza

- GDPR e privacy dei dati studenti
- Audit log per tutte le azioni
- Credenziali sicure per integrazione registro
- Isolamento dati per scuola (multi-tenant)

---

## 9. Roadmap Successiva

| Trimestre | Obiettivo                                            |
| --------- | ---------------------------------------------------- |
| Q1        | MVP completo docenti + pilot test                    |
| Q2        | Dashboard dirigente + regole automazioni scuola      |
| Q3        | Multi-scuola + analytics aggregati                   |
| Q4        | Integrazione completa registro + documenti ufficiali |

---

## 10. Promessa Finale

Con CopilotDoc AI:

- La scuola ottiene **una piattaforma cognitiva e operativa**
- Docenti ricevono **supporto concreto e proattivo**
- Dirigenti hanno **controllo e visibilità sull'intero istituto**
- La piattaforma è **compliant, sicura e pronta per il mercato**

---

## 11. Stato Implementazione (Marzo 2026)

| Componente                                        | Stato          |
| ------------------------------------------------- | -------------- |
| Knowledge Graph + Document Memory                 | ✅ Completato  |
| Reasoning Engine / Next Action                    | ✅ Completato  |
| Autonomous Actions Layer                          | ✅ Completato  |
| Multi-Tenant (TenantId, RBAC, School Insights)    | ✅ Completato  |
| School System Adapters (Axios / Spaggiari / Argo) | ✅ Completato  |
| Normalizer + Sync Engine (import/export)          | ✅ Completato  |
| KG Bridge (sync → KG)                             | ✅ Completato  |
| Official Document Generator (6 tipi)              | ✅ Completato  |
| Compliance Log + Credential Vault (AES-GCM)       | ✅ Completato  |
| Chat Commands + Automation Rules scuola           | ✅ Completato  |
| Dashboard Dirigente (Principal Dashboard)         | 🔄 In progress |
| Multi-scuola analytics aggregati                  | ⏳ Roadmap Q3  |
| Integrazione SIDI                                 | ⏳ Roadmap Q4  |

---

**Prossimo step consigliato:**
Creare il **diagramma end-to-end** (documento → insight → azione → registro),
pronto per presentazioni commerciali a dirigenti scolastici.
