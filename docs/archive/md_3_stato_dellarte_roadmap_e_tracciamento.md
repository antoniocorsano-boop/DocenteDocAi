# Material Design 3 – Stato dell’Arte e Piano di Tracciamento

Questo documento serve come **fonte unica di verità** per mantenere traccia dello stato MD3 dell’app, delle decisioni prese e dei passi successivi. È pensato per essere aggiornato nel tempo.

---

## 1. Stato Attuale (Baseline Ufficiale)

**Data baseline:** 2026-01-10

| Area | Stato | Note |
|-----|------|------|
| Design System MD3 | ✅ Completo | Token centralizzati (colori, typography, spacing, motion) |
| Theme Engine | ✅ Maturo | Light/Dark + override runtime persistenti |
| Componenti Core | 🟡 Ibrido | Nuovi componenti MD3 + residui legacy |
| Layout & Responsive | ✅ Completo | Breakpoint e spacing MD3 |
| Motion & Feedback | 🟡 Quasi completo | Skeleton/loading parziali |
| Accessibilità | 🟡 Buona | ARIA avanzata da completare |
| Settings & Personalizzazione | ✅ Avanzato | ThemeSettingsPanel + preset |

👉 **Conclusione:** sistema MD3-first con debito tecnico residuo localizzato.

---

## 2. Decisioni Architetturali Congelate (ADR sintetiche)

### ADR-001 — MD3 come fonte unica di stile
- Tutti i nuovi componenti **devono** usare `useTheme()` o CSS vars MD3
- Vietati valori hardcoded di colore, spacing, font

### ADR-002 — Legacy ammesso solo in mantenimento
- I componenti legacy non si riscrivono se non modificati funzionalmente
- Ogni modifica funzionale ⇒ migrazione MD3 obbligatoria

### ADR-003 — Personalizzazione come override, non fork
- Le preferenze utente agiscono solo tramite override runtime
- I token base MD3 non vengono mutati

---

## 3. Roadmap Tecnica MD3 (3 Step)

### Fase 1 — Consolidamento (breve termine)
**Obiettivo:** eliminare ambiguità e rischi
- [ ] Mappare componenti legacy rimasti
- [ ] Documentare quali sono MD3-native vs legacy
- [ ] Aggiungere commenti `// LEGACY` nei componenti non migrati

### Fase 2 — Rifinitura (medio termine)
**Obiettivo:** qualità UX e accessibilità
- [ ] Completare ARIA labels nei componenti critici
- [ ] Uniformare loading/skeleton a MD3
- [ ] Rifinire navigation (header/sidebar)

### Fase 3 — Pulizia finale (lungo termine)
**Obiettivo:** rimozione debito tecnico
- [ ] Rimuovere sezioni legacy in Settings
- [ ] Eliminare token/const inutilizzati
- [ ] Audit finale MD3 + accessibility

---

## 4. Checklist Operativa di Controllo Continuo

Usare questa checklist ad ogni release significativa.

### Design & UI
- [ ] Nessun colore hardcoded
- [ ] Nessun `px` fuori dai token
- [ ] Elevation coerente
- [ ] Shape MD3 rispettata

### Theme & Token
- [ ] Override runtime funzionanti
- [ ] Persistenza localStorage valida
- [ ] Dark/Light senza regressioni

### Componenti
- [ ] I nuovi componenti usano `useTheme()`
- [ ] I legacy non sono stati peggiorati

### Accessibilità
- [ ] Focus visibile
- [ ] Contrasto ≥ WCAG AA
- [ ] Navigazione tastiera ok

---

## 5. Registro Modifiche (Change Log)

Compilare ad ogni intervento rilevante.

| Data | Area | Tipo | Descrizione | Impatto |
|------|------|------|-------------|---------|
|      |      | Refactor / Fix / Feature |             | Basso / Medio / Alto |

---

## 6. Regole per il Futuro

- **Regola d’oro:** se un componente sembra “strano”, controllare prima i token
- **Mai** introdurre stili inline permanenti
- Ogni nuova feature UI deve essere **MD3 by design**

---

## 7. Stato Finale Atteso

> App completamente MD3-native, personalizzabile, accessibile e priva di duplicazioni concettuali tra legacy e design system.

Questo documento è vivo e va aggiornato.

