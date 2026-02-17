# Piano di Risoluzione Problematiche

## Fasi di Esecuzione

### FASE 1: Refactoring Settings.tsx 🔄 IN CORSO
**Target:** Ridurre da 1,916 a <600 linee

#### 1.1 Estrarre Sezione InterfaceSettings ✅ COMPLETATO
- [x] Creare `src/components/settings/InterfaceSettings.tsx` (~650 linee)
- [x] Spostare UI mode, theme, colors, ecosistema visivo, parametri strutturali
- [x] Linee estratte: ~500

#### 1.2 Estrarre Sezione AiDidatticaSettings ✅ COMPLETATO
- [x] Creare `src/components/settings/AiDidatticaSettings.tsx` (~850 linee)
- [x] Spostare AI profile, anno scolastico, gestione cattedra, matrice interattiva
- [x] Linee estratte: ~494

#### 1.3 Estrarre Sezione ProfileSettings  
- [ ] Creare `src/components/settings/ProfileSettings.tsx`
- [ ] Spostare dati docente e istituto
- [ ] Linee da spostare: ~43

#### 1.4 Estrarre Sezione CloudSettings
- [ ] Creare `src/components/settings/CloudSettings.tsx`
- [ ] Spostare Google Drive, sync
- [ ] Linee da spostare: ~168

#### 1.5 Estrarre Sezione DebugSettings
- [ ] Creare `src/components/settings/DebugSettings.tsx`
- [ ] Spostare logging, diagnostics
- [ ] Linee da spostare: ~120

**Stima:** 2-3 giorni
**Risultato atteso:** Settings.tsx ~600 linee (dopo 1.1+1.2: ~900 linee)

---

### FASE 2: Completare HelpModal.tsx
**Target:** Ridurre da 1,067 a <500 linee

#### 2.1 Estrarre Tab Components
- [ ] Creare `src/components/help/tabs/ImprovementsTab.tsx`
- [ ] Creare `src/components/help/tabs/ManualTab.tsx`
- [ ] Creare `src/components/help/tabs/GuideTab.tsx`
- [ ] Creare `src/components/help/tabs/FaqTab.tsx`

**Stima:** 1-2 giorni
**Risultato atteso:** HelpModal.tsx ~500 linee

---

### FASE 3: CSS Modularization
**Target:** Ridurre CSS totali da 21,225 a <10,000 linee

#### 3.1 Estrarre da layout.css
- [ ] Creare `_navigation.css`
- [ ] Creare `_content.css`
- [ ] Creare `_grid-system.css`

#### 3.2 Estrarre da modules.css
- [ ] Creare `_dashboard.css`
- [ ] Creare `_evaluation.css`
- [ ] Creare `_wizard.css`

**Stima:** 3-4 giorni
**Risultato atteso:** CSS modulari e tree-shakable

---

### FASE 4: Types Modularization
**Target:** Suddividere types.ts (1,381 linee)

#### 4.1 Creare moduli types
- [ ] `src/types/student.ts`
- [ ] `src/types/academic.ts`
- [ ] `src/types/evaluation.ts`
- [ ] `src/types/settings.ts`
- [ ] `src/types/ui.ts`

**Stima:** 2 giorni
**Risultato atteso:** Types organizzati per dominio

---

## Tracking Progresso

| Fase | Stato | Iniziato | Completato |
|------|-------|----------|------------|
| 1.1 InterfaceSettings | 🔄 | 2026-02-17 | - |
| 1.2 ProfileSettings | ⏳ | - | - |
| 1.3 CloudSettings | ⏳ | - | - |
| 1.4 DebugSettings | ⏳ | - | - |
| 2.x HelpModal tabs | ⏳ | - | - |
| 3.x CSS modules | ⏳ | - | - |
| 4.x Types modules | ⏳ | - | - |

---

## Comandi Utili

```bash
# Verifica progresso
node scripts/project-metrics.cjs

# Controlla linee specifiche
wc -l src/components/Settings.tsx

# Trova file grandi
find src -name "*.tsx" -exec wc -l {} + | sort -rn | head -10
```
