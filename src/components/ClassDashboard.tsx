
import React, { useMemo } from 'react';
import { View, Studente, Slot, Lezione, Valutazione, ValutazioneCompetenza, TimetableSettings, HomeworkSubmission } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { calculatePerformance } from '../utils/evaluationUtils';
import Avatar from './Avatar';
import { SectionHeader, M3Card, M3ListItem, ActionTile } from './M3Components';

interface ClassDashboardProps {
    selectedClass: string;
    onNavigate: (view: View, context?: string) => void;
    onStartImpromptuSession: (classe: string) => void;
    students: Studente[];
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    slots: Record<string, Slot>;
    lessons: Record<string, Lezione>;
    onStartPlannedLesson: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    onViewStudentProfile: (student: Studente) => void;
    submissions?: HomeworkSubmission[]; // Added optional prop for counting
}

const ClassDashboard: React.FC<ClassDashboardProps> = ({
    selectedClass,
    onNavigate,
    onStartImpromptuSession,
    students,
    evaluations,
    // competencyEvaluations, // not used
    // settings, // not used
    slots,
    lessons,
    onStartPlannedLesson,
    onViewStudentProfile,
    submissions = []
}) => {
    const filteredStudents = useMemo(() => {
        return students.filter(s => s.classe === selectedClass).sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [students, selectedClass]);

    const todaysLesson = useMemo(() => {
        const todayName = DAYS_OF_WEEK[new Date().getDay() - 1] || DAYS_OF_WEEK[6];
        const lessonsToday = Object.values(slots)
            .filter((slot: Slot) => slot.giorno === todayName && slot.classe === selectedClass && slot.lezioneId && lessons[slot.lezioneId])
            .map((slot: Slot) => ({ slot, lesson: lessons[slot.lezioneId!] }))
            .filter(item => item.lesson && !item.lesson.svolta)
            .sort((a, b) => a.slot.ora.localeCompare(b.slot.ora));

        return lessonsToday.length > 0 ? lessonsToday[0] : null;
    }, [slots, lessons, selectedClass]);

    // Count pending submissions for this class
    const inboxCount = useMemo(() => {
        return submissions.filter(s => s.status === 'pending' && filteredStudents.some(st => st.id === s.studentId)).length;
    }, [submissions, filteredStudents]);

    return (
        <div className="pt-3 px-4 md:px-6">
            <div className="space-y-6 pb-20">
            <header className="page-header-block">
                <h1 className="m3-display-small">Cruscotto Classe {selectedClass}</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Section: Lesson or Action */}
                    <section>
                        {todaysLesson ? (
                            <div className="hero-card">
                                <div className="hero-header">
                                    <div className="hero-icon-bg">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <div>
                                        <p className="text-eyebrow !mb-0 !text-on-primary-container/80">Prossima Lezione: {todaysLesson.slot.ora}</p>
                                        <h2 className="m3-headline-small">{todaysLesson.lesson.materia}</h2>
                                        <p className="m3-body-medium opacity-90 line-clamp-1">{todaysLesson.lesson.contenuto}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                    className="button button-filled w-full mt-2"
                                >
                                    <span className="material-symbols-outlined mr-2">door_open</span>
                                    Avvia Aula
                                </button>
                            </div>
                        ) : (
                            <div className="hero-card bg-surface-variant text-on-surface-variant">
                                <div className="hero-header">
                                    <div className="hero-icon-bg bg-surface-container-high text-on-surface">
                                        <span className="material-symbols-outlined">event_busy</span>
                                    </div>
                                    <div>
                                        <h2 className="m3-headline-small">Nessuna lezione ora</h2>
                                        <p className="m3-body-medium opacity-80">Puoi avviare una lezione libera in qualsiasi momento.</p>
                                    </div>
                                </div>
                                <button onClick={() => onStartImpromptuSession(selectedClass)} className="button button-tonal w-full mt-2">
                                    <span className="material-symbols-outlined mr-2">add_circle</span>
                                    Avvia Lezione Improvvisata
                                </button>
                            </div>
                        )}
                    </section>

                    {/* INBOX WIDGET (ACTIVE) */}
                    {inboxCount > 0 && (
                        <section className="animate-in fade-in slide-in-from-top-2">
                            <div
                                onClick={() => onNavigate('teacher-inbox')}
                                className="bg-tertiary-container text-on-tertiary-container rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center relative">
                                        <span className="material-symbols-outlined m3-headline-small">mail</span>
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error rounded-full m3-label-small font-bold flex items-center justify-center border-2 border-tertiary-container">
                                            {inboxCount}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="m3-title-medium font-bold">Inbox Compiti</h3>
                                        <p className="m3-body-small opacity-80">{inboxCount} elaborati consegnati da valutare.</p>
                                    </div>
                                </div>
                                <button className="icon-button bg-surface/20 hover:bg-surface/40 text-on-tertiary-container">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </section>
                    )}

                    {/* INIZIO RIORGANIZZAZIONE STRUMENTI STRUTTURALE */}

                    {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                    <section>
                        <SectionHeader title="Registro & Didattica" icon="auto_stories" colorClass="text-primary" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionTile title="Diario di Bordo" subtitle="Lezioni, assenze, note" icon="book" onClick={() => onNavigate('register', selectedClass)} variant="primary" />
                            <ActionTile title="Inclusione" subtitle="PDP, PEI e strategie" icon="accessibility_new" onClick={() => onNavigate('didattica-inclusiva', selectedClass)} variant="tertiary" />
                        </div>
                    </section>

                    {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                    <section>
                        <SectionHeader title="Valutazione & Competenze" icon="grading" colorClass="text-secondary" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionTile title="Voti" subtitle="Registro valutazioni" icon="ballot" onClick={() => onNavigate('evaluations', selectedClass)} variant="secondary" />
                            <ActionTile title="Competenze" subtitle="Livelli e matrici" icon="psychology" onClick={() => onNavigate('class-competency-dashboard', selectedClass)} variant="secondary" />
                        </div>
                    </section>

                    {/* 3. SEZIONE ANALISI & REPORT */}
                    <section>
                        <SectionHeader title="Analisi & Report" icon="analytics" colorClass="text-on-surface-variant" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ActionTile title="Analisi AI" subtitle="Report pedagogico" icon="query_stats" onClick={() => onNavigate('improvement-guide', selectedClass)} variant="tertiary" />
                            <ActionTile title="Consiglio" subtitle="Scrutini e tabelloni" icon="gavel" onClick={() => onNavigate('consiglio-di-classe', selectedClass)} variant="surface" />
                            <ActionTile title="Anagrafica" subtitle="Elenco studenti" icon="groups" onClick={() => onNavigate('studenti', selectedClass)} variant="surface" />
                        </div>
                    </section>

                    {/* FINE RIORGANIZZAZIONE STRUMENTI */}

                </div>

                {/* Side Column: Students List */}
                <M3Card className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="m3-title-large">Studenti</h2>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full m3-body-small font-bold">
                            {filteredStudents.length}
                        </span>
                    </div>

                    <div className="space-y-2 flex-grow overflow-y-auto pr-1 max-h-[600px] custom-scrollbar">
                        {filteredStudents.length > 0 ? filteredStudents.map(student => {
							const { trend } = calculatePerformance(student.id, 'Complessivo', evaluations);

                            return (
                                <M3ListItem
                                    key={student.id}
                                    headline={`${student.cognome} ${student.nome}`}
                                    onClick={() => onViewStudentProfile(student)}
                                    leadingElement={<Avatar name={student.nome} surname={student.cognome} size="medium" />}
                                    trailingElement={
                                        <span className="material-symbols-outlined text-on-surface-variant opacity-50">chevron_right</span>
                                    }
                                    supportingText={trend ? (trend === 'up' ? 'In crescita' : 'In calo') : 'Stabile'}
                                    className="hover:bg-surface-container-highest/30"
                                />
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-on-surface-variant p-4 border-2 border-dashed border-outline-variant rounded-xl">
                                <span className="material-symbols-outlined m3-display-small mb-2">person_off</span>
                                <p>Nessuno studente in elenco.</p>
                            </div>
                        )}
                    </div>
                </M3Card>
            </div>
            </div>
        </div>
    );
};

export default ClassDashboard;
