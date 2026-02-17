// Student-related types

export interface StudentHistoryRecord {
    year: string;
    class: string;
    average?: number;
    notes?: string;
}

export interface Studente {
    id: string;
    nome: string;
    cognome: string;
    classe: string;
    dataNascita?: string;
    isArchived?: boolean;
    archiveYear?: string;
    history?: StudentHistoryRecord[];
}

export interface PianoInclusione {
    id: string;
    studentId: string;
    annoScolastico: string;
    diagnosi?: string;
    misureCompensative: string[];
    misureDispensative: string[];
    note?: string;
    docenteReferente?: string;
}

export interface Valutazione {
    id: string;
    studentId: string;
    materia: string;
    tipo: 'orale' | 'scritto' | 'pratico' | 'grafico';
    voto: number;
    data: string;
    periodo: string;
    note?: string;
}

export interface ValutazioneCompetenza {
    id: string;
    studentId: string;
    competenzaId: string;
    livello: 'base' | 'intermedio' | 'avanzato';
    data: string;
    note?: string;
}

export interface StudentOrientamentoState {
    studentId: string;
    hasCapolavoro: boolean;
    hasAutovalutazione: boolean;
    totalHours: number;
    activities: string[];
    ePortfolio: string[];
    selfReflection: string;
    tutorNotes: string;
}

export interface EPortfolioEntry {
    id: string;
    studentId: string;
    title: string;
    date: string;
    description: string;
    category: 'capolavoro' | 'riflessione' | 'certificazione' | 'altro';
    fileUrl?: string;
    tags: string[];
}

export interface OrientamentoActivity {
    id: string;
    title: string;
    date: string;
    durationHours: number;
    description: string;
    type: 'didattica' | 'extra-curriculare' | 'PCTO' | 'esperienziale' | 'altro';
    studentIds: string[];
    classes: string[];
    competenciesAddressed: string[];
}

export interface StudentState {
    students: Studente[];
    pianiInclusione: Record<string, PianoInclusione>;
    evaluations: Valutazione[];
    competencyEvals: ValutazioneCompetenza[];
    studentProfileContext: Studente | null;
    selectedClassForDashboard: string | null;
    orientamentoActivities: OrientamentoActivity[];
    ePortfolioEntries: EPortfolioEntry[];
    studentOrientamentoStates: Record<string, StudentOrientamentoState>;
}
