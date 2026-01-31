// MD3 Compliant - Migrated from legacy tokens to MD3 design system
// Block F Migration: Removed className usage, converted hardcoded values to MD3 tokens
// Block C Migration: Removed sys.colors legacy token references

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
    const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'trending_flat';

    return (
        <button 
            onClick={() => onClick(student)}
            
        >
            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
            <div style={{ flexGrow: 1 }}>
                <p >{student.cognome} {student.nome}</p>
                <div >
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--md-sys-typescale-label-medium-size)',
                        color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'
                    }}>{trendIcon}</span>
                    <span style={{
                        fontFamily: 'var(--md-sys-typescale-body-small-font)',
                        fontSize: 'var(--md-sys-typescale-body-small-size)',
                        fontWeight: 'var(--md-sys-typescale-body-small-weight)',
                        lineHeight: 'var(--app-text-body-line-height)',
                        color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'
                    }}>
                        {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
                    </span>
                </div>
            </div>
            <span >chevron_right</span>
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
        <div >
            <SectionHeader 
                title={`Cruscotto Classe ${selectedClass}`}
                subtitle="Gestione didattica, valutazioni e monitoraggio in tempo reale"
                 style={{ textAlign: "center" }}
            />

            <div >
                {/* Main Column */}
                <div >

                    {/* Hero Section: Lesson or Action */}
                    <section>
                        {todaysLesson ? (
                            <M3Card >
                                <div >
                                    <div >
                                        <div >
                                            <span >school</span>
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <p >Prossima Lezione • {todaysLesson.slot.ora}</p>
                                            <h2 >{todaysLesson.lesson.materia}</h2>
                                            <p >{todaysLesson.lesson.contenuto}</p>
                                        </div>
                                    </div>
                                    <M3Button
                                        onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                        variant="primary"
                                        
                                    >
                                        <span >door_open</span>
                                        Avvia Aula Digitale
                                    </M3Button>
                                </div>
                            </M3Card>
                        ) : (
                            <M3Card >
                                <div style={{display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)', marginBottom: 'var(--app-spacing-section)'}}>
                                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-high)', color: 'var(--md-sys-color-on-surface-variant)', width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span >event_busy</span>
                                    </div>
                                    <div>
                                        <h2 style={{
                                            color: 'var(--app-color-on-primary)',
                                            fontFamily: 'var(--md-sys-typescale-headline-small-font)',
                                            fontSize: 'var(--md-sys-typescale-headline-small-size)',
                                            fontWeight: 'var(--md-sys-typescale-headline-small-weight)',
                                            lineHeight: 'var(--app-text-title-line-height)'
                                        }}>Nessuna lezione programmata</h2>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Puoi avviare una lezione libera o un'attività improvvisata.</p>
                                    </div>
                                </div>
                                <M3Button onClick={() => onStartImpromptuSession(selectedClass)} variant="secondary" style={{ width: 'var(--md-sys-percent-full)' }}>
                                    <span >add_circle</span>
                                    Avvia Lezione Improvvisata
                                </M3Button>
                            </M3Card>
                        )}
                    </section>

                    {/* INBOX WIDGET */}
                    {inboxCount > 0 && (
                        <section >
                            <M3Card 
                                
                                onClick={() => onNavigate('teacher-inbox')}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span style={{ fontFamily: 'Material Symbols Outlined', fontWeight: 400, fontStyle: 'normal', fontSize: 'var(--icon-size-medium)', lineHeight: '1', letterSpacing: 'normal', textTransform: 'none', display: 'inline-block', verticalAlign: 'middle' }}>mail</span>
                                            <span >
                                                {inboxCount}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 style={{
                                                color: 'var(--md-sys-color-on-tertiary-container)',
                                                fontFamily: 'var(--md-sys-typescale-title-large-font)',
                                                fontSize: 'var(--md-sys-typescale-title-large-size)',
                                                fontWeight: 'var(--md-sys-typescale-title-large-weight)',
                                                lineHeight: 'var(--app-text-title-line-height)'
                                            }}>Inbox Compiti</h3>
                                            <p style={{
                                                color: 'var(--md-sys-color-on-tertiary-container)',
                                                opacity: '0.7',
                                                fontFamily: 'var(--md-sys-typescale-body-medium-font)',
                                                fontSize: 'var(--md-sys-typescale-body-medium-size)',
                                                fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                                lineHeight: 'var(--app-text-body-line-height)'
                                            }}>{inboxCount} elaborati consegnati da valutare.</p>
                                        </div>
                                    </div>
                                    <div >
                                        <span style={{ fontFamily: 'Material Symbols Outlined', fontWeight: 400, fontStyle: 'normal', fontSize: 'var(--icon-size-medium)', lineHeight: '1', letterSpacing: 'normal', textTransform: 'none', display: 'inline-block', verticalAlign: 'middle' }}>arrow_forward</span>
                                    </div>
                                </div>
                            </M3Card>
                        </section>
                    )}

                    {/* TOOLS GRID */}
                    <div >
                        {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                        <section>
                            <div >
                                <span style={{ fontFamily: 'Material Symbols Outlined', fontWeight: 400, fontStyle: 'normal', fontSize: 'var(--icon-size-medium)', lineHeight: '1', letterSpacing: 'normal', textTransform: 'none', display: 'inline-block', verticalAlign: 'middle', color: 'var(--app-color-primary)' }}>auto_stories</span>
                                <h3 >Registro & Didattica</h3>
                            </div>
                            <div >
                                <M3Card 
                                    
                                    onClick={() => onNavigate('register', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span className="material-symbols-outlined">book</span>
                                        </div>
                                        <div>
                                            <h4 >Diario di Bordo</h4>
                                            <p >Lezioni, assenze, note</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    
                                    onClick={() => onNavigate('didattica-inclusiva', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span className="material-symbols-outlined">accessibility_new</span>
                                        </div>
                                        <div>
                                            <h4 >Inclusione</h4>
                                            <p >PDP, PEI e strategie</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                        <section>
                            <div >
                                <span className="material-symbols-outlined" style={{color: "var(--app-color-secondary)"}}>grading</span>
                                <h3 >Valutazione & Competenze</h3>
                            </div>
                            <div >
                                <M3Card 
                                    
                                    onClick={() => onNavigate('evaluations', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>ballot</span>
                                        </div>
                                        <div>
                                            <h4 >Voti</h4>
                                            <p >Registro valutazioni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    
                                    onClick={() => onNavigate('class-competency-dashboard', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span className="material-symbols-outlined">psychology</span>
                                        </div>
                                        <div>
                                            <h4 >Competenze</h4>
                                            <p >Livelli e matrici</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 3. SEZIONE ANALISI & REPORT */}
                        <section>
                            <div >
                                <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>analytics</span>
                                <h3 >Analisi & Report</h3>
                            </div>
                            <div >
                                <M3Card 
                                    
                                    onClick={() => onNavigate('improvement-guide', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>query_stats</span>
                                        </div>
                                        <div>
                                            <h4 >Analisi AI</h4>
                                            <p >Report pedagogico</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    
                                    onClick={() => onNavigate('consiglio-di-classe', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>gavel</span>
                                        </div>
                                        <div>
                                            <h4 >Consiglio</h4>
                                            <p >Scrutini e tabelloni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card 
                                    
                                    onClick={() => onNavigate('studenti', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--app-spacing-container)' }}>
                                        <div >
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>groups</span>
                                        </div>
                                        <div>
                                            <h4 >Anagrafica</h4>
                                            <p >Elenco studenti</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Side Column: Students List */}
                <div >
                    <M3Card variant="elevated" >
                        <div >
                            <div >
                                <h2 >Studenti</h2>
                                <span >
                                    {filteredStudents.length}
                                </span>
                            </div>

                            <div >
                                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                    <StudentDashboardItem
                                        key={student.id}
                                        student={student}
                                        evaluations={evaluations}
                                        onClick={onViewStudentProfile}
                                    />
                                )) : (
                                    <div >
                                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>person_off</span>
                                        <p style={{
                                            fontFamily: 'var(--md-sys-typescale-body-medium-font)',
                                            fontSize: 'var(--md-sys-typescale-body-medium-size)',
                                            fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
                                            lineHeight: 'var(--app-text-body-line-height)',
                                            color: 'var(--md-sys-color-on-surface-variant)'
                                        }}>Nessuno studente in elenco.</p>
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









