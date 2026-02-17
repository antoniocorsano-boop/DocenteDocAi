# Analisi Criticità - DocenteDoc AI

## Data: Febbraio 2026
## Stato: Analisi completa post-refactoring iniziale

---

## 📊 Metriche Complessive

| Categoria | Valore | Target | Stato |
|-----------|--------|--------|-------|
| File TypeScript | 433 | - | ℹ️ |
| Linee totali componenti | 59,915 | <40,000 | 🔴 |
| Componenti >500 linee | 14 | 0 | 🔴 |
| Componenti >400 linee | 21 | <5 | 🟠 |
| File CSS totali | 13,428 linee | <5,000 | 🔴 |

---

## 🔴 CRITICITÀ CRITICHE

### 1. Componenti "God Component"

| Componente | Linee | Problema | Impatto |
|------------|-------|----------|---------|
| **Settings.tsx** | 1,915 | 7+ sezioni, troppi stati | Manutenibilità zero |
| **Dashboard.tsx** | 884 | Troppi widget integrati | Testing impossibile |
| **ClassroomView.tsx** | 830 | Mix logica/vista | Riuso zero |
| **AnalyticsDashboard.tsx** | 796 | Troppi grafici | Performance |

**Soluzione proposta:**
```
src/components/settings/
├── index.ts
├── SettingsShell.tsx         # Container principale
├── InterfaceSection.tsx      # ~200 linee
├── ProfileSection.tsx        # ~150 linee
├── AiDidatticaSection.tsx    # ~200 linee
├── CloudSection.tsx          # ~150 linee
├── DebugSection.tsx          # ~100 linee
└── hooks/
    ├── useThemeImport.ts
    ├── useClassGeneration.ts
    └── useSettingsSync.ts
```

**Stima:** 3 sprint (Settings.tsx → <400 linee)

---

### 2. Monolite CSS

| File | Linee | Dimensione | Problema |
|------|-------|------------|----------|
| **layout.css** | 6,626 | 204 KB | Troppo grande, cache inefficace |
| **modules.css** | 3,752 | 116 KB | Stili non modulari |
| **theme.css** | 1,541 | 67 KB | Duplicazioni |

**Soluzione proposta:**
```
src/styles/
├── layout/
│   ├── _app-shell.css      ✅
│   ├── _header.css         ✅
│   ├── _navigation.css     🔄
│   ├── _content.css        🔄
│   └── index.css           ✅
├── components/
│   ├── _dashboard.css      🔄
│   ├── _modal.css          🔄
│   └── _cards.css          🔄
└── theme/
    ├── _colors.css         🔄
    ├── _typography.css     🔄
    └── _motion.css         🔄
```

**Stima:** 4 sprint

---

### 3. Types.ts Monolitico

| File | Linee | Problema |
|------|-------|----------|
| **types.ts** | 1,380 | Tutti i tipi in un file |

**Soluzione proposta:**
```
src/types/
├── index.ts              # Esportazioni
├── student.ts            # Student types
├── academic.ts           # Lesson, UDA types
├── evaluation.ts         # Valutazione types
├── calendar.ts           # Event types
├── settings.ts           # Settings types
├── ui.ts                 # UI state types
└── shared.ts             # Utility types
```

**Stima:** 2 sprint

---

## 🟠 CRITICITÀ MEDIE

### 4. Gestione Stato Complessa

**Problema:** Mix di Zustand stores e stato locale

**Soluzione:**
- Consolidare in domain stores
- Estrarre business logic in hooks custom
- Usare React Query per dati server

---

### 5. Performance Rendering

**Problema:**
- 660+ useState nei componenti
- Re-render non controllati
- Niente React.memo su componenti pesanti

**Soluzione:**
```typescript
// Aggiungere memo ai componenti pesanti
export const DashboardWidget = memo(DashboardWidgetComponent, 
  (prev, next) => prev.data === next.data
);

// Usare useMemo per calcoli costosi
const processedData = useMemo(() => 
  expensiveCalculation(data), 
  [data]
);
```

---

## 🟡 CRITICITÀ MINORI

### 6. Dipendenze Tecnici

| Dipendenza | Versione | Note |
|------------|----------|------|
| React | 18.2.0 | ✅ OK |
| TypeScript | 5.9.3 | ✅ OK |
| Vite | 6.0.0 | ✅ OK |
| pdfjs-dist | 5.4.530 | ⚠️ Pesante |
| jspdf | 3.0.4 | ⚠️ Pesante |

**Raccomandazione:** Code splitting per PDF libraries

```typescript
const pdfjs = await import('pdfjs-dist');
```

---

## ✅ COMPLETATO

### Già Risolto

| Criticità | Stato | Note |
|-----------|-------|------|
| File backup | ✅ | 37 file rimossi |
| CSS temp files | ✅ | 148KB liberati |
| Context duplicati | ✅ | Unificati in contexts/ |
| dangerouslySetInnerHTML | ✅ | 9/9 sanitizzati |
| Storage wrapper | ✅ | Safe localStorage creato |
| Componenti estratti | ✅ | HelpModal -109 linee |
| cubic-bezier hardcoded | ✅ | 21 sostituzioni MD3 |

---

## 📅 Piano d'Azione Suggerito

### Sprint 1-2: Componenti Critici
- [ ] Refactoring Settings.tsx (→ <400 linee)
- [ ] Estrarre sezioni in componenti
- [ ] Creare hooks custom

### Sprint 3-4: CSS
- [ ] Split layout.css in moduli
- [ ] Component-based CSS
- [ ] Remove unused styles

### Sprint 5-6: Types
- [ ] Modularizzare types.ts
- [ ] Audit circular dependencies
- [ ] Type-safe improvements

### Sprint 7-8: Performance
- [ ] React.memo su widget
- [ ] Code splitting
- [ ] Lazy loading

---

## 🎯 KPI Target

| Metrica | Attuale | Target | Timeline |
|---------|---------|--------|----------|
| Max lines/component | 1,915 | <400 | 2 mesi |
| File CSS totali | 13,428 | <5,000 | 2 mesi |
| Bundle size | 5.2MB | <3MB | 3 mesi |
| Test coverage | ? | >70% | 3 mesi |

---

## 💡 Raccomandazioni Immediate

1. **Priorità P0:** Settings.tsx refactoring
2. **Priorità P1:** CSS modularization  
3. **Priorità P2:** Types modularization
4. **Priorità P3:** Performance optimization

**Team consigliato:** 2-3 sviluppatori full-time per 3 mesi
