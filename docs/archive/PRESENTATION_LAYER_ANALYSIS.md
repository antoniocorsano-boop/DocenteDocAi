# 📊 ANALISI DEL PRESENTATION LAYER - DocenteDoc AI

**Data:** 23 Dicembre 2025  
**Versione:** 4.0.0 RC1  
**Status:** ✅ Completato

---

## 🏛️ ARCHITETTURA GENERALE

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│                 (React Components + Hooks)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App.tsx (Root Container)                           │  │
│  │  • Theme synchronization                            │  │
│  │  • User authentication gate                         │  │
│  │  • App shell layout (Header + ViewManager)          │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                            │
│  ┌──────────────┴───────────────────────────────────────┐  │
│  │  ViewManager (Hub centrale)                         │  │
│  │  • Routing logico tra 30+ viste                     │  │
│  │  • State coordination                               │  │
│  │  • Navigation history                               │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                            │
│     ┌───────────┼───────────┐                              │
│     ▼           ▼           ▼                              │
│  ┌──────┐  ┌──────┐  ┌──────┐                             │
│  │Views │  │Modals│  │Utils │                             │
│  │(30+) │  │(15+) │  │ (6+) │                             │
│  └──────┘  └──────┘  └──────┘                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  M3 Design System (theme.css + components.css)      │  │
│  │  • Token-based (colors, typography, spacing)        │  │
│  │  • Component library (M3Components.tsx)             │  │
│  │  • CSS architecture (modular, 5-layer)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
    useAppEngine Hook              Zustand Stores
    (State Orchestration)          (DataStore + UIStore)
```

---

## 🎯 COMPONENTI PRINCIPALI

### 1. **App Shell** (`App.tsx`, `Header.tsx`, `Menu.tsx`)
- **Responsabile:** Layout top-level e sincronizzazione tema
- **Pattern:** Container component con useLayoutEffect
- **Key Props:**
  - Theme state (light/dark/system)
  - User authentication
  - Global AI loading state
  - Notifications & suggestions

```tsx
// Flusso:
App.tsx
  ├─ Header (notifiche, user profile, back button)
  ├─ ViewManager (routing dinamico)
  ├─ Menu (navigazione inferiore)
  └─ ModalManager (overlay modali)
```

---

### 2. **ViewManager** (518 linee)
**Cuore del routing presentation layer**

```typescript
// 30+ Views mappate dinamicamente:
'home'                    → Home.tsx
'timetable'              → Timetable.tsx
'calendario'             → Calendar.tsx
'aula'                   → ClassroomView.tsx
'studenti'               → StudentManager.tsx
'progettazione-hub'      → ProgettazioneHub.tsx
'reportistica'           → ReportisticaHub.tsx
'register'               → RegisterView.tsx
'knowledge-base'         → KnowledgeBase.tsx
'live-assistant'         → LiveAssistant.tsx
... e 20+ altre
```

**Responsabilità:**
- Switch dinamico tra viste
- Passaggio props secondo lo stato
- Gestione viewContext per contesti specifici
- Coordinamento azioni cross-view

---

### 3. **CORE VIEWS** (30+ componenti)

#### **Timetable & Scheduling**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `Timetable.tsx` | ~400 | Griglia oraria settimanale/giornaliera |
| `TimetableCell.tsx` | ~80 | Singola cella ore |
| `Calendar.tsx` | ~350 | Vista calendario mensile/settimanale |
| `LessonsPage.tsx` | ~200 | Lista lezioni con filtri |
| `LessonView.tsx` | ~300 | Dettaglio lezione singola |

#### **Valutazioni & Competenze**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `EvaluationModule.tsx` | ~250 | Gestione voti per materia |
| `CompetencyEvaluationModal.tsx` | ~150 | Valutazione competenze |
| `UnifiedEvaluationModal.tsx` | ~200 | Integrazione voto + competenza |
| `CompetencyLevelsView.tsx` | ~180 | Visualizzazione livelli competenze |
| `ClassCompetencyDashboard.tsx` | ~280 | Dashboard competenze classe |

#### **Registro & Presenze**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `RegisterView.tsx` | ~320 | Registro presenze/compiti |
| `CloseLessonModal.tsx` | ~180 | Chiusura lezione con osservazioni |
| `ObservationModal.tsx` | ~140 | Raccolta dati partecipazione |

#### **Pianificazione Didattica**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `UdaPlanner.tsx` | ~280 | Pianificazione UDA |
| `AnnualPlanningWizard.tsx` | ~350 | Wizard pianificazione annuale |
| `ClassPlanningWizard.tsx` | ~280 | Wizard pianificazione classe |
| `ProgettazioneHub.tsx` | ~200 | Hub centrale pianificazione |

#### **Gestione Studenti**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `StudentManager.tsx` | ~250 | Anagrafica e gestione studenti |
| `StudentProfile.tsx` | ~200 | Profilo studente con storia |
| `StudentInterviewModal.tsx` | ~280 | Intervista/anamnesi studente |
| `QuickStudentActionModal.tsx` | ~120 | Azioni rapide su studente |

#### **Analytics & Reporting**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `AnalyticsHub.tsx` | ~300 | Hub analytics principale |
| `ClassDashboard.tsx` | ~250 | Dashboard analytics classe |
| `ReportisticaHub.tsx` | ~220 | Gestione report export |
| `ArchivioReport.tsx` | ~180 | Archivio report generati |

#### **IA & Assistenza**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `LiveAssistant.tsx` | ~180 | Chat IA in tempo reale |
| `AiAdvisor.tsx` | ~160 | Pannello consigli IA |
| `ImageAnalysisModal.tsx` | ~140 | Analisi immagini via IA |
| `VideoAnalysisModal.tsx` | ~150 | Analisi video via IA |
| `CircolareAnalysisModal.tsx` | ~120 | Analisi circolari/documenti |

#### **Strumenti Didattici**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `SmartDocumentEditor.tsx` | ~400 | Editor documenti ricco |
| `IdeaGeneratorModal.tsx` | ~180 | Generazione idee didattiche |
| `TestGeneratorModal.tsx` | ~200 | Generazione test/verifiche |
| `ClassroomView.tsx` | ~300 | Modalità aula virtuale |

#### **Knowledge Base & Fonti**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `KnowledgeBase.tsx` | ~200 | Gestione KB personale |
| `FeedManager.tsx` | ~180 | Gestione feed/fonti |
| `DocumentViewerModal.tsx` | ~150 | Viewer documenti |

#### **Didattica Inclusiva**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `DidatticaInclusiva.tsx` | ~280 | Piano Inclusione & PEI |
| `PianoInclusioneEditor.tsx` | ~200 | Editor piano inclusione |
| `RubricheManager.tsx` | ~240 | Gestione rubriche valutative |

#### **Configurazione & Impostazioni**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `Settings.tsx` | ~300 | Pagina impostazioni principale |
| `SettingsSection.tsx` | ~100 | Sezione impostazioni riutilizzabile |
| `ThemeBubble.tsx` | ~80 | Customizer tema live |

#### **Autenticazione & Profilo**
| Componente | Linee | Funzione |
|-----------|-------|----------|
| `SignInScreen.tsx` | ~150 | Login docente |
| `StudentLoginScreen.tsx` | ~120 | Login studente |
| `ProfileSelectionScreen.tsx` | ~100 | Selezione profilo |

---

### 4. **MODAL MANAGER** (15+ modali)

```typescript
ModalManager.tsx (coordinatore principale)
  ├─ AddStudentModal
  ├─ AddEvaluationModal
  ├─ CompetencyEvaluationModal
  ├─ EditSlotModal
  ├─ CreateLessonFromAiModal
  ├─ UnifiedEvaluationModal
  ├─ ExportModal
  ├─ ImportStudentsModal
  ├─ SyncConflictModal
  ├─ BackupInfoModal
  ├─ LoadingModal
  ├─ PinPadModal
  ├─ ImageAnalysisModal
  ├─ DocumentGeneratorModal
  └─ 5+ altri
```

---

### 5. **DESIGN SYSTEM** (M3 Expressive)

#### **CSS Architecture (5 livelli)**
```
src/
  ├─ theme.css          (1) Token primitivi (colori, tipografia)
  ├─ layout.css         (2) Griglia & struttura (header, sidebar, footer)
  ├─ components.css     (3) Componenti atomici (button, input, card)
  ├─ modules.css        (4) Moduli compositi (form, table, modal)
  └─ logo.css           (5) Specifiche logo
```

#### **Token M3 Utilizzati**
```css
/* Primary palette */
--primary: #6750A4
--on-primary: #FFFFFF
--primary-container: #EADDFF
--on-primary-container: #21005D

/* Semantic colors */
--sys-success: #2E7D32
--sys-warning: #F57C00
--sys-error: #B3261E

/* Typography scales */
--m3-headline-large
--m3-title-large
--m3-body-medium
--m3-label-small
```

#### **M3Components.tsx** (Atomic Library)
```typescript
export const ActionTile          // Azione primaria
export const InfoCard            // Info box
export const SectionHeader       // Titolo sezione
export const TabGroup            // Tab navigator
export const ManualSection       // Sezione manuale
export const UseCaseCard         // Card use case
```

---

## 🔄 FLUSSI DI STATO

### **Data Flow**
```
┌─────────────────────────────────────────────────┐
│         User Interaction (Click, Input)         │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  View Component │
         └───────┬────────┘
                 │
         ┌───────▼──────────────┐
         │  Call Action from    │
         │  useAppEngine/Store  │
         └───────┬──────────────┘
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌─────────────┐         ┌──────────────┐
│  DataStore  │         │   UIStore    │
│ (Zustand)   │         │  (Zustand)   │
└─────────────┘         └──────────────┘
    │                          │
    └────────────┬─────────────┘
                 │
         ┌───────▼────────────┐
         │  Component Re-render│
         │  (new state props) │
         └────────────────────┘
```

### **Esempio: Aggiungere uno studente**
```tsx
// In StudentManager.tsx
const handleAddStudent = (name, cognome, classe) => {
  // 1. Call action
  actions.setStudents(prev => [...prev, newStudent])
  
  // 2. Store aggiorna stato
  useDataStore → students array
  
  // 3. Component re-renders
  ViewManager → StudentManager → list aggiornata
  
  // 4. Toast success
  showToast('Studente aggiunto', 'success')
}
```

---

## 🎨 PATTERN DI COMPONENTI

### **Pattern 1: Container + Presenter**
```tsx
// Container (smart)
const StudentManager: React.FC = () => {
  const { students, actions } = useAppEngine();
  const [filter, setFilter] = useState('');
  
  const handleAdd = (student) => {
    actions.setStudents(prev => [...prev, student]);
  };
  
  return <StudentManagerUI 
    students={filteredStudents} 
    onAdd={handleAdd} 
  />;
};

// Presenter (dumb)
const StudentManagerUI: React.FC<Props> = ({ students, onAdd }) => {
  return <div>{students.map(s => <StudentCard key={s.id} {...s} />)}</div>;
};
```

### **Pattern 2: Modal Coordination**
```tsx
// In ModalManager
{modals.isAddStudentOpen && (
  <AddStudentModal
    isOpen={modals.isAddStudentOpen}
    onClose={() => modals.toggleModal('isAddStudentOpen', false)}
    onConfirm={(student) => {
      actions.setStudents(prev => [...prev, student]);
      modals.toggleModal('isAddStudentOpen', false);
      showToast('Studente aggiunto', 'success');
    }}
  />
)}
```

### **Pattern 3: Controlled Inputs**
```tsx
const [name, setName] = useState('');
const [cognome, setCognome] = useState('');
const [classe, setClasse] = useState('');

const isValid = name.trim() && cognome.trim() && classe;

return (
  <>
    <input 
      value={name} 
      onChange={e => setName(e.target.value)}
      placeholder="Nome"
      className="input-filled"
    />
    <button 
      onClick={() => onConfirm({ name, cognome, classe })}
      disabled={!isValid}
      className="btn-primary"
    >
      Aggiungi
    </button>
  </>
);
```

---

## 📊 STATISTICHE LAYER PRESENTAZIONE

| Metrica | Valore |
|---------|--------|
| **Numero di componenti** | 80+ |
| **Linee di codice totali** | ~15,000 |
| **Numero di viste** | 30+ |
| **Numero di modali** | 15+ |
| **Componenti riutilizzabili** | 6+ (M3Components) |
| **CSS custom properties** | 100+ |
| **Test coverage** | ~50% |

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### **1. React.memo per componenti pesanti**
```tsx
export const EvaluationModule = React.memo(({ students, onEval }) => {
  // Re-render solo se props cambiano
  return <div>...</div>;
});
```

### **2. useMemo per derivazioni state**
```tsx
const filteredStudents = useMemo(() => {
  return students.filter(s => s.classe === selectedClass);
}, [students, selectedClass]);
```

### **3. useCallback per callback stabili**
```tsx
const handleAdd = useCallback((student) => {
  actions.setStudents(prev => [...prev, student]);
}, [actions]);
```

### **4. Dynamic imports per modali**
```tsx
const AddStudentModal = lazy(() => import('./AddStudentModal'));
```

---

## 🔐 SECURITY IN PRESENTATION LAYER

### **Input Validation**
```tsx
// Sanitization
const sanitizeInput = (input: string) => {
  return input.replace(/[<>]/g, '').trim();
};

// Validation
const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### **XSS Prevention**
```tsx
// ✅ Correct - React escapes by default
<div>{userInput}</div>

// ❌ Wrong - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 🧪 TESTING COVERAGE

### **Test Files**
- `__tests__/components/*.test.tsx` (24 file)
- Coverage: **329 test passed**

### **Key Test Areas**
- ✅ Component rendering
- ✅ User interactions (click, input)
- ✅ State updates
- ✅ Modal open/close
- ✅ Navigation

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints (Tailwind)**
```css
base        → <640px
sm          → ≥640px
md          → ≥768px
lg          → ≥1024px
xl          → ≥1280px
2xl         → ≥1536px
```

### **Mobile-First Approach**
```tsx
<div className="
  flex flex-col           // base
  md:flex-row            // tablet+
  lg:max-w-7xl           // desktop
  md:px-6                // padding
">
```

---

## 🎯 BEST PRACTICES ADOTTATE

✅ **Component Composition:** Piccoli componenti riutilizzabili  
✅ **Props Drilling:** Minimizzato con useAppEngine  
✅ **Type Safety:** TypeScript con strict mode  
✅ **Error Boundaries:** ErrorBoundary wrapper  
✅ **Accessibility:** Semantic HTML, ARIA labels  
✅ **Responsive:** Mobile-first design  
✅ **Dark Mode:** System preference detection  
✅ **Loading States:** Skeleton + spinners  
✅ **Error States:** User-friendly messages  
✅ **Empty States:** Helpful guidance  

---

## 📈 NEXT PHASE RECOMMENDATIONS

1. **Refactor ViewManager** (518 linee → split in 3-4 file)
2. **Extract custom hooks** (useStudents, useEvaluations, etc.)
3. **Create Storybook** per M3Components
4. **Increase test coverage** (50% → 70%+)
5. **Performance audit** (LCP, FID metrics)
6. **Accessibility audit** (WCAG 2.1 AA)
7. **Component library** per package/npm

---

**Status:** ✅ Presentation Layer ben strutturato e funzionante  
**Next Review:** Q1 2026
