
import { create } from 'zustand';
import { 
    UserProfile, Studente, Lezione, Slot, Valutazione, ValutazioneCompetenza, Uda, 
    EventoCalendario, KnowledgeBaseEntry, Corpus, Notifica, Rubrica, PianoInclusione, 
    GiudizioPeriodico, Report, FeedSource, RegisterEntry, NotebookNote, ToDoItem, 
    CurriculumSubject, HomeworkSubmission, AiSuggestion, SystemSuggestion 
} from '../types.ts';
import { INITIAL_KB_GUIDE } from '../constants.ts';

interface DataState {
    // Core Entities
    user: UserProfile | null;
    students: Studente[];
    lessons: Record<string, Lezione>;
    slots: Record<string, Slot>;
    evaluations: Valutazione[];
    competencyEvals: ValutazioneCompetenza[];
    udas: Uda[];
    eventi: EventoCalendario[];
    knowledgeBase: KnowledgeBaseEntry[];
    corpora: Corpus[];
    rubriche: Rubrica[];
    pianiInclusione: Record<string, PianoInclusione>;
    giudizi: Record<string, GiudizioPeriodico>;
    reports: Report[];
    feedSources: FeedSource[];
    
    // Runtime / Register
    draftRegister: Record<string, RegisterEntry>;
    finalizedRegister: RegisterEntry[];
    notebookNotes: Record<string, NotebookNote[]>;
    memos: ToDoItem[];
    curricula: CurriculumSubject[];
    submissions: HomeworkSubmission[];

    // UI-related Data (Now in DataStore for persistence)
    notifiche: Notifica[]; // Notifications for persistent storage

    // AI Suggestions & Context
    suggestions: AiSuggestion[];
    activeSuggestion: SystemSuggestion | null;
    dismissedSuggestions: Set<string>;
    studentProfileContext: Studente | null;
    selectedClassForDashboard: string | null;

    // Actions
    actions: {
        setUser: (user: UserProfile | null) => void;
        setStudents: (students: Studente[] | ((prev: Studente[]) => Studente[])) => void;
        setLessons: (lessons: Record<string, Lezione> | ((prev: Record<string, Lezione>) => Record<string, Lezione>)) => void;
        setSlots: (slots: Record<string, Slot> | ((prev: Record<string, Slot>) => Record<string, Slot>)) => void;
        setEvaluations: (evals: Valutazione[] | ((prev: Valutazione[]) => Valutazione[])) => void;
        setCompetencyEvals: (evals: ValutazioneCompetenza[] | ((prev: ValutazioneCompetenza[]) => ValutazioneCompetenza[])) => void;
        setUdas: (udas: Uda[] | ((prev: Uda[]) => Uda[])) => void;
        setEventi: (eventi: EventoCalendario[] | ((prev: EventoCalendario[]) => EventoCalendario[])) => void;
        setKnowledgeBase: (kb: KnowledgeBaseEntry[] | ((prev: KnowledgeBaseEntry[]) => KnowledgeBaseEntry[])) => void;
        setCorpora: (corpora: Corpus[] | ((prev: Corpus[]) => Corpus[])) => void;
        setNotifiche: (notifiche: Notifica[] | ((prev: Notifica[]) => Notifica[])) => void; // Action for notifications
        setRubriche: (rubriche: Rubrica[] | ((prev: Rubrica[]) => Rubrica[])) => void;
        setPianiInclusione: (piani: Record<string, PianoInclusione> | ((prev: Record<string, PianoInclusione>) => Record<string, PianoInclusione>)) => void;
        setGiudizi: (giudizi: Record<string, GiudizioPeriodico> | ((prev: Record<string, GiudizioPeriodico>) => Record<string, GiudizioPeriodico>)) => void;
        setReports: (reports: Report[] | ((prev: Report[]) => Report[])) => void;
        setFeedSources: (feeds: FeedSource[] | ((prev: FeedSource[]) => FeedSource[])) => void;
        setDraftRegister: (reg: Record<string, RegisterEntry> | ((prev: Record<string, RegisterEntry>) => Record<string, RegisterEntry>)) => void;
        setFinalizedRegister: (reg: RegisterEntry[] | ((prev: RegisterEntry[]) => RegisterEntry[])) => void;
        setNotebookNotes: (notes: Record<string, NotebookNote[]> | ((prev: Record<string, NotebookNote[]>) => Record<string, NotebookNote[]>)) => void;
        setMemos: (memos: ToDoItem[] | ((prev: ToDoItem[]) => ToDoItem[])) => void;
        setCurricula: (curr: CurriculumSubject[] | ((prev: CurriculumSubject[]) => CurriculumSubject[])) => void;
        setSubmissions: (subs: HomeworkSubmission[] | ((prev: HomeworkSubmission[]) => HomeworkSubmission[])) => void;
        
        // AI Suggestions & Context Actions
        setSuggestions: (suggestions: AiSuggestion[]) => void;
        setActiveSuggestion: (activeSuggestion: SystemSuggestion | null) => void;
        dismissSuggestion: (id: string) => void;
        setStudentProfileContext: (student: Studente | null) => void;
        setSelectedClassForDashboard: (className: string | null) => void;

        // Bulk Load (for Backup Restore)
        loadFromBackup: (data: Partial<DataState>) => void;
        resetAll: () => void;
    }
}

// Lazy initialization wrapper to prevent zustand from accessing React.useState before React is ready
let _useDataStoreInstance: any = null;

function initializeDataStore() {
    if (_useDataStoreInstance) return _useDataStoreInstance;
    
    _useDataStoreInstance = create<DataState>((set) => ({
    // Initial State
    user: null,
    students: [],
    lessons: {},
    slots: {},
    evaluations: [],
    competencyEvals: [],
    udas: [],
    eventi: [],
    knowledgeBase: [INITIAL_KB_GUIDE],
    corpora: [],
    notifiche: [],
    rubriche: [],
    pianiInclusione: {},
    giudizi: {},
    reports: [],
    feedSources: [],
    draftRegister: {},
    finalizedRegister: [],
    notebookNotes: {},
    memos: [],
    curricula: [],
    submissions: [],

    // AI Suggestions & Context
    suggestions: [],
    activeSuggestion: null,
    dismissedSuggestions: new Set(),
    studentProfileContext: null,
    selectedClassForDashboard: null,

    actions: {
        setUser: (user) => set({ user }),
        setStudents: (input) => set((state) => ({ students: typeof input === 'function' ? input(state.students) : input })),
        setLessons: (input) => set((state) => ({ lessons: typeof input === 'function' ? input(state.lessons) : input })),
        setSlots: (input) => set((state) => ({ slots: typeof input === 'function' ? input(state.slots) : input })),
        setEvaluations: (input) => set((state) => ({ evaluations: typeof input === 'function' ? input(state.evaluations) : input })),
        setCompetencyEvals: (input) => set((state) => ({ competencyEvals: typeof input === 'function' ? input(state.competencyEvals) : input })),
        setUdas: (input) => set((state) => ({ udas: typeof input === 'function' ? input(state.udas) : input })),
        setEventi: (input) => set((state) => ({ eventi: typeof input === 'function' ? input(state.eventi) : input })),
        setKnowledgeBase: (input) => set((state) => ({ knowledgeBase: typeof input === 'function' ? input(state.knowledgeBase) : input })),
        setCorpora: (input) => set((state) => ({ corpora: typeof input === 'function' ? input(state.corpora) : input })),
        setNotifiche: (input) => set((state) => ({ notifiche: typeof input === 'function' ? input(state.notifiche) : input })),
        setRubriche: (input) => set((state) => ({ rubriche: typeof input === 'function' ? input(state.rubriche) : input })),
        setPianiInclusione: (input) => set((state) => ({ pianiInclusione: typeof input === 'function' ? input(state.pianiInclusione) : input })),
        setGiudizi: (input) => set((state) => ({ giudizi: typeof input === 'function' ? input(state.giudizi) : input })),
        setReports: (input) => set((state) => ({ reports: typeof input === 'function' ? input(state.reports) : input })),
        setFeedSources: (input) => set((state) => ({ feedSources: typeof input === 'function' ? input(state.feedSources) : input })),
        setDraftRegister: (input) => set((state) => ({ draftRegister: typeof input === 'function' ? input(state.draftRegister) : input })),
        setFinalizedRegister: (input) => set((state) => ({ finalizedRegister: typeof input === 'function' ? input(state.finalizedRegister) : input })),
        setNotebookNotes: (input) => set((state) => ({ notebookNotes: typeof input === 'function' ? input(state.notebookNotes) : input })),
        setMemos: (input) => set((state) => ({ memos: typeof input === 'function' ? input(state.memos) : input })),
        setCurricula: (input) => set((state) => ({ curricula: typeof input === 'function' ? input(state.curricula) : input })),
        setSubmissions: (input) => set((state) => ({ submissions: typeof input === 'function' ? input(state.submissions) : input })),

        // AI Suggestions & Context Actions
        setSuggestions: (suggestions) => set({ suggestions }),
        setActiveSuggestion: (activeSuggestion) => set({ activeSuggestion }),
        dismissSuggestion: (id) => set((state) => {
            const newDismissed = new Set(state.dismissedSuggestions);
            newDismissed.add(id);
            return { dismissedSuggestions: newDismissed };
        }),
        setStudentProfileContext: (student) => set({ studentProfileContext: student }),
        setSelectedClassForDashboard: (className) => set({ selectedClassForDashboard: className }),

        loadFromBackup: (data) => set((state) => ({
            ...state,
            ...data,
            // Special handling for Set (dismissedSuggestions) during load
            dismissedSuggestions: data.dismissedSuggestions 
                ? new Set(Array.from(data.dismissedSuggestions))
                : new Set(),
        })),

        resetAll: () => set({
            user: null,
            students: [], lessons: {}, slots: {}, evaluations: [], competencyEvals: [],
            udas: [], eventi: [], knowledgeBase: [INITIAL_KB_GUIDE], corpora: [],
            notifiche: [], rubriche: [], pianiInclusione: {}, giudizi: {}, reports: [],
            feedSources: [], draftRegister: {}, finalizedRegister: [], notebookNotes: {},
            memos: [], curricula: [], submissions: []
        })
    }
}));
    
    return _useDataStoreInstance;
}

// Export proxy that lazily initializes the store
export const useDataStore = new Proxy({} as any, {
    get(target, prop) {
        const store = initializeDataStore();
        return store[prop];
    },
    apply(target, thisArg, args) {
        return initializeDataStore()(...args);
    }
});
