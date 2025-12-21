import type { TimetableSettings, Competenza, Valutazione, ColorTokens, Lezione, ParticipationBadge, KnowledgeBaseEntry, UserProfile, ThemeCustomization } from './types';

export const DAYS_OF_WEEK: string[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const LESSON_TYPES: Lezione['tipoLezione'][] = ['Teoria', 'Disegno', 'Laboratorio', 'Test', 'Verifica', 'Disposizione', 'Ricevimento'];

export const LESSON_TYPE_ICONS: Record<string, string> = {
    'Teoria': 'auto_stories',
    'Disegno': 'draw',
    'Laboratorio': 'science',
    'Test': 'quiz',
    'Verifica': 'assignment_late',
    'Disposizione': 'pending_actions',
    'Ricevimento': 'diversity_3',
    'default': 'school'
};

export const EVALUATION_TYPES: Valutazione['tipo'][] = ['Scritto', 'Orale', 'Pratico', 'Test', 'Verifica', 'Ricevimento'];

export const RATING_OPTIONS: string[] = [
    '10', '9', '8', '7', '6', '5', '4', '3', '2', '1',
    'Ottimo', 'Distinto', 'Buono', 'Sufficiente', 'Insufficiente'
];

export const RATING_TO_VALUE: Record<string, number> = {
    // Voti numerici
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    // Giudizi
    'Insufficiente': 4,
    'Sufficiente': 6,
    'Buono': 7,
    'Distinto': 8.5,
    'Ottimo': 10,
};

export const PARTICIPATION_BADGES: ParticipationBadge[] = [
    { id: 'positive', label: 'Positivo', icon: 'star', color: 'var(--sys-tertiary)' },
    { id: 'question', label: 'Domanda', icon: 'lightbulb', color: 'var(--sys-primary)' },
    { id: 'collaboration', label: 'Collabora', icon: 'groups', color: 'var(--sys-secondary)' },
    { id: 'distraction', label: 'Disturbo', icon: 'sms_failed', color: 'var(--sys-error)' },
];

// === AI PROFILES CONFIGURATION ===
export const AI_PROFILES = {
    rapido: {
        id: 'rapido',
        model: 'gemini-2.5-flash',
        label: 'Rapido (Flash)',
        icon: 'bolt',
        description: 'Risposte immediate. Ideale per chat, note brevi e task quotidiani.',
        variant: 'tertiary'
    },
    esperto: {
        id: 'esperto',
        model: 'gemini-3-pro-preview',
        label: 'Esperto (Pro)',
        icon: 'psychology',
        description: 'Analisi profonda. Ideale per UDA, report e ragionamento complesso.',
        variant: 'primary'
    }
} as const;

// === KNOWLEDGE BASE CATEGORIES ===
export const KB_CATEGORIES = [
    { id: 'programmazione', label: 'Programmazione & UDA', icon: 'model_training', color: 'var(--sys-primary)', description: 'Piani annuali, progettazione e unità di apprendimento' },
    { id: 'normativa', label: 'Normativa & Circolari', icon: 'gavel', color: 'var(--sys-tertiary)', description: 'Leggi, regolamenti e comunicazioni ufficiali' },
    { id: 'ai_deliverable', label: 'AI Deliverables', icon: 'auto_awesome', color: 'var(--sys-secondary)', description: 'Analisi e progetti generati con NotebookLM o altri assistenti' },
    { id: 'materiale_didattico', label: 'Materiale Didattico', icon: 'menu_book', color: 'var(--sys-secondary)', description: 'Dispense, slide e testi per gli studenti' },
    { id: 'valutazione', label: 'Valutazione & Griglie', icon: 'grading', color: 'var(--sys-error)', description: 'Rubriche, test e criteri di voto' },
    { id: 'inclusione', label: 'Inclusione (BES/DSA)', icon: 'accessibility_new', color: 'var(--sys-tertiary)', description: 'PEI, PDP e normative specifiche' },
    { id: 'archivio', label: 'Archivio Generale', icon: 'folder', color: 'var(--sys-outline)', description: 'Altri documenti non categorizzati' },
];

// === LIVELLI DI PADRONANZA STANDARD (Certificazione Competenze) ===
const LIVELLI_STANDARD = [
    { id: 'a', nome: 'A - Avanzato', voto: '9-10', punteggio: '4', descrizione: "L'alunno/a svolge compiti e risolve problemi complessi, mostrando padronanza nell'uso delle conoscenze e delle abilità; propone e sostiene le proprie opinioni e assume in modo responsabile decisioni consapevoli." },
    { id: 'b', nome: 'B - Intermedio', voto: '7-8', punteggio: '3', descrizione: "L'alunno/a svolge compiti e risolve problemi in situazioni nuove, compie scelte consapevoli, mostrando di saper utilizzare le conoscenze e le abilità acquisite." },
    { id: 'c', nome: 'C - Base', voto: '6', punteggio: '2', descrizione: "L'alunno/a svolge compiti semplici anche in situazioni nuove, mostrando di possedere conoscenze e abilità fondamentali e di saper applicare basilari regole e procedure apprese." },
    { id: 'd', nome: 'D - Iniziale', voto: '5 e inf.', punteggio: '1', descrizione: "L'alunno/a, se opportunamente guidato/a, svolge compiti semplici in situazioni note." },
];

// === LIVELLI DIGCOMPEDU 3.0 (AI-Enhanced) ===
const LIVELLI_DIGCOMP_AI = [
    { id: 'c2', nome: 'C2 - Pioniere', voto: '10', punteggio: '6', descrizione: "Guida l'innovazione digitale e AI nella scuola. Sperimenta approcci pedagogici complessi con agenti AI e condivide pratiche." },
    { id: 'c1', nome: 'C1 - Leader', voto: '9', punteggio: '5', descrizione: "Utilizza l'AI e il digitale in modo strategico per diversificare la didattica e valutare criticamente i risultati." },
    { id: 'b2', nome: 'B2 - Esperto', voto: '8', punteggio: '4', descrizione: "Usa l'AI per creare risorse personalizzate e gestire la classe in modo digitale, variando gli strumenti con sicurezza." },
    { id: 'b1', nome: 'B1 - Integratore', voto: '7', punteggio: '3', descrizione: "Integra strumenti AI di base (es. ChatGPT per idee) nella pratica quotidiana per risolvere problemi specifici." },
    { id: 'a2', nome: 'A2 - Esploratore', voto: '6', punteggio: '2', descrizione: "Inizia a esplorare le potenzialità del digitale e dell'AI, necessitando di supporto per l'uso didattico." },
    { id: 'a1', nome: 'A1 - Novizio', voto: '5', punteggio: '1', descrizione: "Ha contatti limitati con le tecnologie AI/Digitali e le usa principalmente per scopi amministrativi o personali." },
];

const createLivelli = (competenzaId: string, tipo: 'standard' | 'digcomp' = 'standard'): Competenza['livelli'] => {
    const base = tipo === 'digcomp' ? LIVELLI_DIGCOMP_AI : LIVELLI_STANDARD;
    return base.map(l => ({ ...l, id: `${competenzaId}-${l.id}` }));
};

export const DEFAULT_COMPETENZE: Competenza[] = [
    { id: 'dig-1-1', codice: 'Area 1.1', nome: 'Comunicazione organizzativa', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc11', 'digcomp') },
    { id: 'dig-1-2', codice: 'Area 1.2', nome: 'Collaborazione professionale', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc12', 'digcomp') },
    { id: 'dig-1-3', codice: 'Area 1.3', nome: 'Pratiche riflessive', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc13', 'digcomp') },
    { id: 'dig-2-1', codice: 'Area 2.1', nome: 'Selezione risorse digitali e AI', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc21', 'digcomp') },
    { id: 'dig-2-2', codice: 'Area 2.2', nome: 'Creazione e modifica risorse (Prompt Engineering)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc22', 'digcomp') },
    { id: 'dig-2-3', codice: 'Area 2.3', nome: 'Gestione, protezione e condivisione dati', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc23', 'digcomp') },
    { id: 'dig-3-1', codice: 'Area 3.1', nome: 'Insegnamento (Teaching with AI)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc31', 'digcomp') },
    { id: 'dig-3-2', codice: 'Area 3.2', nome: 'Guida (Scaffolding Digitale)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc32', 'digcomp') },
    { id: 'dig-3-3', codice: 'Area 3.3', nome: 'Apprendimento collaborativo', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc33', 'digcomp') },
    { id: 'dig-3-4', codice: 'Area 3.4', nome: 'Apprendimento autoregolato', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc34', 'digcomp') },
    { id: 'dig-4-1', codice: 'Area 4.1', nome: 'Strategie di valutazione digitali', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc41', 'digcomp') },
    { id: 'dig-4-2', codice: 'Area 4.2', nome: 'Analisi delle evidenze (Data Analytics)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc42', 'digcomp') },
    { id: 'dig-4-3', codice: 'Area 4.3', nome: 'Feedback e pianificazione', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc43', 'digcomp') },
    { id: 'dig-5-1', codice: 'Area 5.1', nome: 'Accessibilità e Inclusione (Assistive Tech)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc51', 'digcomp') },
    { id: 'dig-5-2', codice: 'Area 5.2', nome: 'Differenziazione e personalizzazione (Adaptive Learning)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc52', 'digcomp') },
    { id: 'dig-5-3', codice: 'Area 5.3', nome: 'Coinvolgimento attivo degli studenti', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc53', 'digcomp') },
    { id: 'dig-6-1', codice: 'Area 6.1', nome: 'Informazione e media literacy', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc61', 'digcomp') },
    { id: 'dig-6-2', codice: 'Area 6.2', nome: 'Comunicazione e collaborazione digitale', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc62', 'digcomp') },
    { id: 'dig-6-3', codice: 'Area 6.3', nome: 'Creazione di contenuti digitali', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc63', 'digcomp') },
    { id: 'dig-6-4', codice: 'Area 6.4', nome: 'Uso responsabile (Ethics & AI)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc64', 'digcomp') },
    { id: 'dig-6-5', codice: 'Area 6.5', nome: 'Risoluzione dei problemi (Computational Thinking)', framework: 'DigCompEdu 3.0 (AI)', livelli: createLivelli('dc65', 'digcomp') },
    { id: 'comp-key-1', codice: 'C. Chiave 1', nome: 'Competenza alfabetica funzionale', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck1') },
    { id: 'comp-key-2', codice: 'C. Chiave 2', nome: 'Competenza multilinguistica', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck2') },
    { id: 'comp-key-3', codice: 'C. Chiave 3', nome: 'Competenza matematica e competenza in scienze, tecnologie e ingegneria (STEM)', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck3') },
    { id: 'comp-key-4', codice: 'C. Chiave 4', nome: 'Competenza digitale', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck4') },
    { id: 'comp-key-5', codice: 'C. Chiave 5', nome: 'Competenza personale, sociale e capacità di imparare a imparare', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck5') },
    { id: 'comp-key-6', codice: 'C. Chiave 6', nome: 'Competenza in materia di cittadinanza', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck6') },
    { id: 'comp-key-7', codice: 'C. Chiave 7', nome: 'Competenza imprenditoriale', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck7') },
    { id: 'comp-key-8', codice: 'C. Chiave 8', nome: 'Competenza in materia di consapevolezza ed espressione culturali', framework: 'Competenze Chiave Europee (2018)', livelli: createLivelli('ck8') },
];


export const INITIAL_KB_GUIDE: KnowledgeBaseEntry = {
    id: 'kb-guide-initial',
    fileName: 'Flusso di Progettazione Didattica con AI.txt',
    content: `# Guida al Flusso di Progettazione Didattica Intelligente...`,
    isGenerated: true,
    category: 'programmazione',
};

export const SCHOOL_TYPES_DISCIPLINES: Record<string, string[]> = {
    "Scuola Secondaria di I Grado": [
        'Italiano', 'Storia', 'Geografia', 'Matematica', 'Scienze', 'Inglese', 'Seconda Lingua Comunitaria', 'Tecnologia', 'Arte e Immagine', 'Musica', 'Scienze Motorie e Sportive'
    ],
    "Liceo Artistico": [
        'Discipline Pittoriche', 'Discipline Plastiche e Scultoree', 'Architettura e Ambiente', 'Design', 'Storia dell\'Arte', 'Italiano', 'Storia e Geografia', 'Matematica', 'Scienze Naturali', 'Inglese'
    ],
    "Liceo Scientifico": [
        'Matematica', 'Fisica', 'Scienze Naturali', 'Disegno e Storia dell\'Arte', 'Italiano', 'Latino', 'Storia e Geografia', 'Inglese'
    ],
    "Istituto Tecnico (CAT)": [
        'Progettazione, Costruzioni e Impianti', 'Geopedologia, Economia ed Estimo', 'Topografia', 'Gestione del Cantiere', 'Disegno Tecnico', 'Matematica', 'Italiano'
    ]
};

const defaultLevels = ['1', '2', '3'];
const defaultSections = ['A', 'B', 'C'];
const defaultClasses: string[] = [];
for (const level of defaultLevels) {
    for (const section of defaultSections) {
        defaultClasses.push(`${level.trim()}${section.trim()}`);
    }
}

export const DEFAULT_TIMETABLE_SETTINGS: TimetableSettings = {
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    defaultView: 'week',
    schoolType: 'Scuola Secondaria di I Grado',
    livelli: defaultLevels,
    sezioni: defaultSections,
    classi: defaultClasses,
    disciplines: ['Matematica', 'Scienze', 'Italiano', 'Storia', 'Geografia', 'Inglese', 'Tecnologia'],
    teachingAssignments: [],
    competenze: DEFAULT_COMPETENZE,
    nomeInsegnante: 'Nome',
    cognomeInsegnante: '',
    email: '',
    nomeIstituto: 'Nome Istituto',
    cittaIstituto: 'Città',
    anniScolastici: [`${new Date().getFullYear() - 1}/${new Date().getFullYear()}`, `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`],
    annoScolasticoCorrente: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    activityStartDate: `${new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1}-09-01`,
    activityEndDate: `${new Date().getMonth() >= 8 ? new Date().getFullYear() + 1 : new Date().getFullYear()}-06-30`,
    notificationSettings: {
        enabled: true,
        reminders: ['30-mins'],
        desktopNotifications: true,
    },
    showGuidanceTips: true,
    visualTheme: 'm3-expressive',
    uiMode: 'classic',
    visualPreferences: {
        font: 'sans',
        shape: 'rounded'
    },
    backupFolderId: undefined,
    backupFolderName: undefined,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '872214867934-2nmj6o20f733e9tqruc06m96o6fg9oqu.apps.googleusercontent.com',
    googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY, // FIX: Initialize googleApiKey
    autoSyncEnabled: true,
    autoSyncInterval: 5,
    securityPin: '0000',
};

export const THEME_CUSTOMIZATIONS: ThemeCustomization[] = [
    { name: 'M3 Default', colors: { primary: '#6750A4', secondary: '#625B71', tertiary: '#7D5260' } },
    { name: 'Blue', colors: { primary: '#0061A4', secondary: '#535F70', tertiary: '#6B5778' } },
    { name: 'Teal', colors: { primary: '#006A6A', secondary: '#4A6363', tertiary: '#4B6178' } },
    { name: 'Red/Brown', colors: { primary: '#B3261E', secondary: '#795942', tertiary: '#755B51' } },
    { name: 'Green', colors: { primary: '#386A20', secondary: '#55624C', tertiary: '#186C5D' } },
    { name: 'Sunset', colors: { primary: '#E65100', secondary: '#795942', tertiary: '#9C4146' } },
    { name: 'Forest', colors: { primary: '#2E7D32', secondary: '#3E6837', tertiary: '#827717' } },
    { name: 'Ocean', colors: { primary: '#0277BD', secondary: '#006064', tertiary: '#0288D1' } },
    { name: 'Neon Cyber', colors: { primary: '#00E5FF', secondary: '#F50057', tertiary: '#76FF03' } },
    { name: 'AI Studio', colors: { primary: '#1A73E8', secondary: '#9C27B0', tertiary: '#E8710A' } },
    { name: 'Workspace', colors: { primary: '#EA4335', secondary: '#4285F4', tertiary: '#34A853' } },
];
