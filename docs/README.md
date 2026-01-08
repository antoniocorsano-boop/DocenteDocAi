# DocenteDoc AI - Documentazione Tecnica

> **Documentazione Ufficiale** - Sistema di documentazione document-driven per il progetto DocenteDoc AI

## 📋 Panoramica

Questa è la documentazione tecnica ufficiale del progetto **DocenteDoc AI**, organizzata secondo principi di **document-driven operativity**. La documentazione è strutturata per supportare lo sviluppo, deployment e manutenzione del progetto attraverso documenti viventi che evolvono con il codice.

### 🎯 Principi Organizzativi

- **Document-Driven Development**: Ogni decisione tecnica è documentata e tracciata
- **Living Documentation**: I documenti operativi vengono aggiornati con il codice
- **Archive Intelligente**: Materiale storico preservato ma separato dall'operativo
- **Navigazione Strutturata**: Indici chiari e cross-referenze tra documenti

---

## 📚 Documenti Operativi Principali

| Documento | Scopo | Stato |
|-----------|-------|-------|
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Guida sviluppo, workflow e best practices | 🚧 In creazione |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Architettura sistema e design patterns | 📋 Pianificato |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Procedure deployment e configurazione | 📋 Pianificato |
| [`TESTING.md`](./TESTING.md) | Strategia testing e coverage | 📋 Pianificato |
| [`MD3_GUIDE.md`](./MD3_GUIDE.md) | Guida Material Design 3 e tema system | 📋 Pianificato |

### 🔗 Documenti di Supporto

- [**Root README**](../README.md) - Panoramica progetto e quick start
- [**Contributing Guide**](../CONTRIBUTING.md) - Linee guida contributi
- [**Changelog**](../CHANGELOG.md) - Cronologia modifiche versione

---

## 📁 Struttura Repository

```
docs/
├── README.md              # Questo file - Indice principale
├── DEVELOPMENT.md         # Guida sviluppo operativo
├── ARCHITECTURE.md        # Architettura e design
├── DEPLOYMENT.md          # Deployment e configurazione
├── TESTING.md             # Testing e qualità
├── MD3_GUIDE.md           # Guida Material Design 3
└── archive/               # Archivio storico organizzato
    ├── 2025/             # Documenti 2025 per categoria
    │   ├── phases/       # Report fasi progetto
    │   ├── lint-audit/   # Audit qualità codice
    │   ├── md3-migration/# Migrazione MD3
    │   ├── deployment/   # Deployment storici
    │   └── completion-reports/ # Report completamento
    └── 2026/             # Documenti 2026
```

---

## 🔄 Workflow Document-Driven

### 📝 Processo di Sviluppo

1. **Planning**: Consultare `DEVELOPMENT.md` per workflow attivi
2. **Implementazione**: Seguire patterns in `ARCHITECTURE.md`
3. **Testing**: Applicare strategia in `TESTING.md`
4. **Deployment**: Usare procedure in `DEPLOYMENT.md`
5. **Documentazione**: Aggiornare documenti viventi

### 🔍 Ricerca e Consultazione

- **Documenti Attivi**: Usare sempre la versione in `docs/` (non archivio)
- **Storico**: Consultare `docs/archive/` per evoluzione e decisioni passate
- **Cross-Reference**: Ogni documento linka agli altri per contesto completo

### 📊 Metriche e Quality Gates

- **Coverage Testing**: ≥80% (tracciato in `TESTING.md`)
- **Lint Quality**: Zero violazioni critiche (audit in `lint-audit/`)
- **Bundle Size**: Monitorato e documentato (`BUNDLE_SIZE_METRICS.md`)
- **Performance**: Lighthouse PWA audit obbligatorio

---

## 🏗️ Principi Architetturali

### 🎨 Design System
- **Material Design 3**: Implementazione custom-first
- **Token-Only Approach**: No CSS custom, solo design tokens
- **Tailwind Layout-Only**: Tailwind solo per layout, MD3 per componenti

### 🔒 Sicurezza e Privacy
- **Local-First Storage**: Dati in LocalStorage/IndexedDB
- **OAuth 2.0 Google Drive**: Backup sicuro personale
- **Zero External Dependencies**: Privacy massima

### 🚀 Performance
- **Zero FOUC**: Caricamento tema istantaneo
- **Bundle Optimization**: Code splitting e lazy loading
- **PWA Ready**: Service worker e offline capability

---

## 📞 Contatti e Supporto

### 👥 Team di Sviluppo
- **Tech Lead**: [Nome] - Architettura e performance
- **UX Lead**: [Nome] - Design system e user experience
- **QA Lead**: [Nome] - Testing e quality assurance

### 📮 Canali di Comunicazione
- **Issues**: GitHub Issues per bug e feature requests
- **Discussions**: GitHub Discussions per domande generali
- **Documentation**: PR su documentazione benvenute

### 🔧 Troubleshooting
- **Build Issues**: Consultare `DEVELOPMENT.md` sezione troubleshooting
- **Deployment Problems**: Vedere `DEPLOYMENT.md` guide operative
- **Design Inconsistencies**: Riferimento `MD3_GUIDE.md`

---

*Questa documentazione è viva e si evolve con il progetto. Ultimo aggiornamento: $(date '+%Y-%m-%d')*