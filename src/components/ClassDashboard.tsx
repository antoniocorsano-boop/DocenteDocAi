
/**
 * ClassDashboard.tsx
 * // M3Expressive refactor: Applied M3 tokens for colors, spacing, and elevation. Removed inline Tailwind, using dedicated CSS classes with M3 variables.
 */

import React, { useMemo } from 'react';
import { View, Studente, Lezione, Valutazione, Slot } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { calculatePerformance } from '../utils/evaluationUtils';
import { 
    SectionHeader, 
    M3Button,
    M3Card,
    Avatar 
} from './ui';
import { useStudentStore } from '../stores/useStudentStore';
import { useAcademicStore } from '../stores/useAcademicStore';

interface ClassDashboardProps {
    selectedClass: string;
    onNavigate: (view: View, context?: string) => void;
    onStartImpromptuSession: (classe: string) => void;
    onStartPlannedLesson: (classe: string, materia: string, slotKey: string, lesson: Lezione) => void;
    onViewStudentProfile: (student: Studente) => void;
}

interface StudentDashboardItemProps {
    student: Studente;
    evaluations: Valutazione[];
    onClick: (student: Studente) => void;
}

const StudentDashboardItem = React.memo(({ student, evaluations, onClick }: StudentDashboardItemProps) => {
    const { trend } = calculatePerformance(student.id, 'Complessivo', evaluations);
    const trendClass = trend === 'up' ? 'class-dashboard-trend-up' : trend === 'down' ? 'class-dashboard-trend-down' : 'class-dashboard-trend-neutral';
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    return (
        <button 
            onClick={() => onClick(student)}
            className="class-dashboard-student-item group"
        >
            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
            <div className="flex-grow min-w-0">
                <p className="class-dashboard-student-name">{student.cognome} {student.nome}</p>
                <div className="class-dashboard-trend-container">
                    <span className={`material-symbols-outlined class-dashboard-trend-icon ${trendClass}`}>{trendIcon}</span>
                    <span className={`class-dashboard-trend-label ${trendClass}`}>
                        {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
                    </span>
                </div>
            </div>
            <span className="material-symbols-outlined class-dashboard-chevron">chevron_right</span>
        </button>
    );
});

const ClassDashboard: React.FC<ClassDashboardProps> = ({
    selectedClass,
    onNavigate,
    onStartImpromptuSession,
    onStartPlannedLesson,
    onViewStudentProfile,
}) => {
    const students = useStudentStore(state => state.students);
    const evaluations = useStudentStore(state => state.evaluations);
    const slots = useAcademicStore(state => state.slots);
    const lessons = useAcademicStore(state => state.lessons);
    const submissions = useAcademicStore(state => state.submissions) || [];

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
        <div className="class-dashboard-layout">
            <SectionHeader 
                title={`Cruscotto Classe ${selectedClass}`}
                subtitle="Gestione didattica, valutazioni e monitoraggio in tempo reale"
                className="py-6 md:py-12 text-center"
            />

            <div className="class-dashboard-main-grid">
                {/* Main Column */}
                <div className="class-dashboard-main-column">

                    {/* Hero Section: Lesson or Action */}
                    <section>
                        {todaysLesson ? (
                            <M3Card className="class-dashboard-hero-card">
                                <div className="class-dashboard-hero-padding">
                                    <div className="class-dashboard-hero-content">
                                        <div className="class-dashboard-hero-icon">
                                            <span className="material-symbols-outlined class-dashboard-icon-large">school</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="class-dashboard-hero-label">Prossima Lezione • {todaysLesson.slot.ora}</p>
                                            <h2 className="class-dashboard-hero-title">{todaysLesson.lesson.materia}</h2>
                                            <p className="class-dashboard-hero-description">{todaysLesson.lesson.contenuto}</p>
                                        </div>
                                    </div>
                                    <M3Button
                                        onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                        variant="primary"
                                        className="class-dashboard-button-full"
                                    >
                                        <span className="material-symbols-outlined class-dashboard-icon-margin">door_open</span>
                                        Avvia Aula Digitale
                                    </M3Button>
                                </div>
                            </M3Card>
                        ) : (
                            <M3Card className="class-dashboard-no-lesson-card">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined class-dashboard-icon-large">event_busy</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--md-sys-color-on-surface)]">Nessuna lezione programmata</h2>
                                        <p className="text-[var(--md-sys-color-on-surface)]-variant">Puoi avviare una lezione libera o un'attività improvvisata.</p>
                                    </div>
                                </div>
                                <M3Button onClick={() => onStartImpromptuSession(selectedClass)} variant="secondary" className="w-full">
                                    <span className="material-symbols-outlined class-dashboard-icon-margin">add_circle</span>
                                    Avvia Lezione Improvvisata
                                </M3Button>
                            </M3Card>
                        )}
                    </section>

                    {/* INBOX WIDGET */}
                    {inboxCount > 0 && (
                        <section className="animate-in fade-in slide-in-from-top-2">
                            <M3Card 
                                className="class-dashboard-inbox"
                                onClick={() => onNavigate('teacher-inbox')}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-inbox-icon">
                                            <span className="material-symbols-outlined">mail</span>
                                            <span className="class-dashboard-inbox-badge">
                                                {inboxCount}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-on-tertiary-container">Inbox Compiti</h3>
                                            <p className="text-sm text-on-tertiary-container/70">{inboxCount} elaborati consegnati da valutare.</p>
                                        </div>
                                    </div>
                                    <div className="class-dashboard-inbox-arrow">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </div>
                            </M3Card>
                        </section>
                    )}

                    {/* TOOLS GRID */}
                    <div className="space-y-10">
                        {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                        <section>
                            <div className="class-dashboard-section-header">
                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                                <h3 className="class-dashboard-label-small">Registro & Didattica</h3>
                            </div>
                            <div className="class-dashboard-tools-grid">
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('register', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-primary">
                                            <span className="material-symbols-outlined">book</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Diario di Bordo</h4>
                                            <p className="class-dashboard-card-desc">Lezioni, assenze, note</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('didattica-inclusiva', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-tertiary">
                                            <span className="material-symbols-outlined">accessibility_new</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Inclusione</h4>
                                            <p className="class-dashboard-card-desc">PDP, PEI e strategie</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                        <section>
                            <div className="class-dashboard-section-header">
                                <span className="material-symbols-outlined text-secondary">grading</span>
                                <h3 className="class-dashboard-label-small">Valutazione & Competenze</h3>
                            </div>
                            <div className="class-dashboard-tools-grid">
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('evaluations', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-secondary">
                                            <span className="material-symbols-outlined">ballot</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Voti</h4>
                                            <p className="class-dashboard-card-desc">Registro valutazioni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('class-competency-dashboard', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-secondary">
                                            <span className="material-symbols-outlined">psychology</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Competenze</h4>
                                            <p className="class-dashboard-card-desc">Livelli e matrici</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 3. SEZIONE ANALISI & REPORT */}
                        <section>
                            <div className="class-dashboard-section-header">
                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">analytics</span>
                                <h3 className="class-dashboard-label-small">Analisi & Report</h3>
                            </div>
                            <div className="class-dashboard-tools-grid">
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('improvement-guide', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-tertiary">
                                            <span className="material-symbols-outlined">query_stats</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Analisi AI</h4>
                                            <p className="class-dashboard-card-desc">Report pedagogico</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('consiglio-di-classe', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-outline">
                                            <span className="material-symbols-outlined">gavel</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Consiglio</h4>
                                            <p className="class-dashboard-card-desc">Scrutini e tabelloni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    className="class-dashboard-tool-card"
                                    onClick={() => onNavigate('studenti', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="class-dashboard-tool-icon-outline">
                                            <span className="material-symbols-outlined">groups</span>
                                        </div>
                                        <div>
                                            <h4 className="class-dashboard-card-title">Anagrafica</h4>
                                            <p className="class-dashboard-card-desc">Elenco studenti</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Side Column: Students List */}
                <div className="class-dashboard-side-column">
                    <M3Card variant="elevated" className="class-dashboard-student-card">
                        <div className="class-dashboard-student-card-content">
                            <div className="class-dashboard-student-header">
                                <h2 className="class-dashboard-title-medium">Studenti</h2>
                                <span className="class-dashboard-student-count">
                                    {filteredStudents.length}
                                </span>
                            </div>

                            <div className="class-dashboard-student-list">
                                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                    <StudentDashboardItem
                                        key={student.id}
                                        student={student}
                                        evaluations={evaluations}
                                        onClick={onViewStudentProfile}
                                    />
                                )) : (
                                    <div className="class-dashboard-empty-state">
                                        <span className="material-symbols-outlined">person_off</span>
                                        <p className="text-sm">Nessuno studente in elenco.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </M3Card>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ClassDashboard);



