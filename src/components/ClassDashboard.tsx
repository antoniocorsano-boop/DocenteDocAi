
import React, { useMemo } from 'react';
import { View, Studente, Lezione } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { calculatePerformance } from '../utils/evaluationUtils';
import { 
    SectionHeader, 
    InfoCard, 
    M3Button,
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
    const trendClass = trend === 'up' ? 'text-tertiary' : trend === 'down' ? 'text-error' : 'text-[var(--md-sys-color-on-surface)]-variant/40';
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    return (
        <button 
            onClick={() => onClick(student)}
            className="w-full flex items-center gap-8 p-6 rounded-[var(--md-sys-shape-corner-medium)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-all group text-left"
        >
            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
            <div className="flex-grow min-w-0">
                <p className="font-bold text-[var(--md-sys-color-on-surface)] truncate">{student.cognome} {student.nome}</p>
                <div className="flex items-center gap-2.5 mt-0.5">
                    <span className={`material-symbols-outlined text-xs ${trendClass}`}>{trendIcon}</span>
                    <span className={`m3-label-tiny font-bold uppercase tracking-wider ${trendClass}`}>
                        {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
                    </span>
                </div>
            </div>
            <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant/30 group-hover:translate-x-1 transition-transform">chevron_right</span>
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
        <div className="page-layout max-w-full mx-auto w-full px-4 pb-24">
            <SectionHeader 
                title={`Cruscotto Classe ${selectedClass}`}
                subtitle="Gestione didattica, valutazioni e monitoraggio in tempo reale"
                className="py-6 md:py-12 text-center"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Hero Section: Lesson or Action */}
                    <section>
                        {todaysLesson ? (
                            <InfoCard variant="elevated" className="overflow-hidden bg-primary-container/30 backdrop-blur-sm border border-primary/10">
                                <div style={{ padding: 'var(--md-sys-spacing-5)' }}>
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-16 h-16 rounded-[var(--md-sys-shape-corner-large)] bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-[var(--md-sys-elevation-level2)] shadow-primary/20">
                                            <span className="material-symbols-outlined text-3xl">school</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Prossima Lezione â€¢ {todaysLesson.slot.ora}</p>
                                            <h2 className="text-2xl font-bold text-[var(--md-sys-color-on-surface)] truncate">{todaysLesson.lesson.materia}</h2>
                                            <p className="text-[var(--md-sys-color-on-surface)]-variant line-clamp-1 mt-4">{todaysLesson.lesson.contenuto}</p>
                                        </div>
                                    </div>
                                    <M3Button
                                        onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                        variant="filled"
                                        className="w-full py-4"
                                    >
                                        <span className="material-symbols-outlined mr-2">door_open</span>
                                        Avvia Aula Digitale
                                    </M3Button>
                                </div>
                            </InfoCard>
                        ) : (
                            <InfoCard variant="tonal" className="p-6 border border-[var(--md-sys-color-outline-variant)]/30">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-3xl">event_busy</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--md-sys-color-on-surface)]">Nessuna lezione programmata</h2>
                                        <p className="text-[var(--md-sys-color-on-surface)]-variant">Puoi avviare una lezione libera o un'attività improvvisata.</p>
                                    </div>
                                </div>
                                <M3Button onClick={() => onStartImpromptuSession(selectedClass)} variant="tonal" className="w-full">
                                    <span className="material-symbols-outlined mr-2">add_circle</span>
                                    Avvia Lezione Improvvisata
                                </M3Button>
                            </InfoCard>
                        )}
                    </section>

                    {/* INBOX WIDGET */}
                    {inboxCount > 0 && (
                        <section className="animate-in fade-in slide-in-from-top-2">
                            <InfoCard 
                                variant="elevated"
                                className="bg-tertiary-container/40 backdrop-blur-sm border border-tertiary/10 p-8 cursor-pointer hover:ring-2 hover:ring-tertiary/20 transition-all"
                                onClick={() => onNavigate('teacher-inbox')}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-tertiary text-on-tertiary flex items-center justify-center relative shadow-[var(--md-sys-elevation-level1)] shadow-tertiary/20">
                                            <span className="material-symbols-outlined">mail</span>
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error rounded-full m3-label-tiny font-bold flex items-center justify-center border-2 border-tertiary-container">
                                                {inboxCount}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-on-tertiary-container">Inbox Compiti</h3>
                                            <p className="text-sm text-on-tertiary-container/70">{inboxCount} elaborati consegnati da valutare.</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary/10 text-tertiary">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </div>
                            </InfoCard>
                        </section>
                    )}

                    {/* TOOLS GRID */}
                    <div className="space-y-10">
                        {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                        <section>
                            <div className="flex items-center gap-6 mb-6 px-4">
                                <span className="material-symbols-outlined text-primary">auto_stories</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant">Registro & Didattica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all group"
                                    onClick={() => onNavigate('register', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                            <span className="material-symbols-outlined">book</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Diario di Bordo</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Lezioni, assenze, note</p>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-tertiary/20 transition-all group"
                                    onClick={() => onNavigate('didattica-inclusiva', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                                            <span className="material-symbols-outlined">accessibility_new</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Inclusione</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">PDP, PEI e strategie</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>
                        </section>

                        {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                        <section>
                            <div className="flex items-center gap-6 mb-6 px-4">
                                <span className="material-symbols-outlined text-secondary">grading</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant">Valutazione & Competenze</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-secondary/20 transition-all group"
                                    onClick={() => onNavigate('evaluations', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                            <span className="material-symbols-outlined">ballot</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Voti</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Registro valutazioni</p>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-secondary/20 transition-all group"
                                    onClick={() => onNavigate('class-competency-dashboard', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                            <span className="material-symbols-outlined">psychology</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Competenze</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Livelli e matrici</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>
                        </section>

                        {/* 3. SEZIONE ANALISI & REPORT */}
                        <section>
                            <div className="flex items-center gap-6 mb-6 px-4">
                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant">analytics</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant">Analisi & Report</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-tertiary/20 transition-all group"
                                    onClick={() => onNavigate('improvement-guide', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                                            <span className="material-symbols-outlined">query_stats</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Analisi AI</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Report pedagogico</p>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-outline/20 transition-all group"
                                    onClick={() => onNavigate('consiglio-di-classe', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant flex items-center justify-center group-hover:bg-outline group-hover:text-on-outline transition-colors">
                                            <span className="material-symbols-outlined">gavel</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Consiglio</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Scrutini e tabelloni</p>
                                        </div>
                                    </div>
                                </InfoCard>
                                <InfoCard 
                                    variant="tonal" 
                                    className="p-8 cursor-pointer hover:ring-2 hover:ring-outline/20 transition-all group"
                                    onClick={() => onNavigate('studenti', selectedClass)}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant flex items-center justify-center group-hover:bg-outline group-hover:text-on-outline transition-colors">
                                            <span className="material-symbols-outlined">groups</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">Anagrafica</h4>
                                            <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">Elenco studenti</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Side Column: Students List */}
                <div className="space-y-6">
                    <InfoCard variant="elevated" className="h-full flex flex-col bg-[var(--md-sys-color-surface-container-low)]est/50 backdrop-blur-sm">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-[var(--md-sys-color-on-surface)]">Studenti</h2>
                                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                                    {filteredStudents.length}
                                </span>
                            </div>

                            <div className="space-y-2 flex-grow overflow-y-auto pr-1 max-h-[400px] md:max-h-[600px] custom-scrollbar">
                                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                    <StudentDashboardItem
                                        key={student.id}
                                        student={student}
                                        evaluations={evaluations}
                                        onClick={onViewStudentProfile}
                                    />
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-center text-[var(--md-sys-color-on-surface)]-variant/40 p-8 border-2 border-dashed border-[var(--md-sys-color-outline-variant)]/20 rounded-[var(--md-sys-shape-corner-large)]">
                                        <span className="material-symbols-outlined text-4xl mb-8">person_off</span>
                                        <p className="text-sm">Nessuno studente in elenco.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ClassDashboard);



