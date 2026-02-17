// Academic-related types

export interface Lezione {
    id: string;
    classe: string;
    materia: string;
    contenuto: string;
    svolta: boolean;
    tipoLezione?: 'Teoria' | 'Disegno' | 'Laboratorio' | 'Test' | 'Verifica' | 'Disposizione' | 'Ricevimento';
    unitaDiApprendimento?: string;
    nota?: string;
    obiettivi?: string;
    contesto?: string;
    compiti?: string;
    adattamenti?: string;
    materialiDidattici?: MaterialeDidattico[];
    externalLink?: string;
}

export interface Slot {
    giorno: string;
    ora: string;
}

export interface Uda {
    id: string;
    title: string;
    classe: string;
    materia: string;
    introduction: string;
    finalProduct: string;
    competencyIds: string[];
    phases: { id: string; title: string; description: string; activities: string; duration: string }[];
    evaluation: string;
    tools: string;
    startDate?: string;
    endDate?: string;
    linkedEventId?: string;
    externalLink?: string;
    startPos: number;
    width: number;
    color: string;
    borderColor: string;
    textColor: string;
}

export interface EventoCalendario {
    id: string;
    titolo: string;
    data: string;
    dataFine?: string;
    tipo: 'impegno' | 'scadenza' | 'consiglio' | 'formazione';
    oraInizio?: string;
    oraFine?: string;
    descrizione?: string;
    location?: string;
}

export interface Rubrica {
    id: string;
    nome: string;
    descrizione?: string;
    livelli: { nome: string; descrizione: string; valore: number }[];
}

export interface CurriculumSubject {
    id: string;
    name: string;
    area: string;
    obiettivi: string[];
}

export interface HomeworkSubmission {
    id: string;
    studentId: string;
    lessonId: string;
    status: 'completed' | 'partial' | 'missing' | 'default';
    note?: string;
    submittedAt?: string;
}

export interface RegisterEntry {
    id: string;
    lessonId: string;
    date: string;
    classId: string;
    subjectId: string;
    content: string;
    attendance: Record<string, 'present' | 'absent' | 'late'>;
}

export interface GiudizioPeriodico {
    id: string;
    studentId: string;
    periodo: string;
    classe: string;
    giudizio: string;
    data: string;
}

export interface Report {
    id: string;
    type: 'student' | 'class' | 'period';
    title: string;
    createdAt: string;
    data: unknown;
}

export interface MaterialeDidattico {
    id: string;
    type: 'kb' | 'file' | 'link' | 'ai_deliverable';
    kbId?: string;
    fileName?: string;
    file?: { name: string; content: string; mimeType: string };
    url?: string;
    label?: string;
}

export interface AcademicState {
    lessons: Record<string, Lezione>;
    slots: Record<string, Slot>;
    uda: Uda[];
    eventi: EventoCalendario[];
    rubriche: Rubrica[];
    curricula: CurriculumSubject[];
    submissions: HomeworkSubmission[];
    draftRegister: Record<string, RegisterEntry>;
    finalizedRegister: RegisterEntry[];
    giudizi: Record<string, GiudizioPeriodico>;
    reportistica: Report[];
}
