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
            style={{
                width: 'var(--md-sys-percent-100)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-3)',
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                background: 'var(--md-sys-color-surface-container-low)',
                border: 'none',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
            }}
        >
            <Avatar name={`${student.nome} ${student.cognome}`} size="md" />
            <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                    fontWeight: 'var(--md-sys-typescale-weight-medium)',
                    color: 'var(--md-sys-color-on-surface)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>{student.cognome} {student.nome}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)', marginTop: 'var(--md-sys-spacing-0-5)' }}>
                    <span className="material-symbols-outlined" aria-hidden="true" style={{
                        fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
                        color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'
                    }}>{trendIcon}</span>
                    <span style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                        fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
                        color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'
                    }}>
                        {trend === 'up' ? 'In crescita' : trend === 'down' ? 'In calo' : 'Stabile'}
                    </span>
                </div>
            </div>
            <span className="material-symbols-outlined" aria-hidden="true" style={{
                fontSize: 'var(--md-sys-spacing-5)',
                color: 'var(--md-sys-color-on-surface-variant)',
            }}>chevron_right</span>
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
        <div style={{
            padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-4) var(--md-sys-spacing-8)',
            maxWidth: 'var(--md-sys-layout-content-max-width, 1200px)',
            margin: '0 auto',
            width: 'var(--md-sys-percent-100)',
            boxSizing: 'border-box',
        }}>
            <SectionHeader 
                title={`Cruscotto Classe ${selectedClass}`}
                subtitle="Gestione didattica, valutazioni e monitoraggio in tempo reale"
                style={{ textAlign: "center", marginBottom: 'var(--md-sys-spacing-6)' }}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 'var(--md-sys-spacing-6)',
            }}>
                {/* Main Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-5)' }}>

                    {/* Hero Section: Lesson or Action */}
                    <section>
                        {todaysLesson ? (
                            <M3Card style={{
                                background: 'var(--md-sys-color-primary-container)',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                padding: 'var(--md-sys-spacing-6)',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-4)' }}>
                                        <div style={{
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            backgroundColor: 'var(--md-sys-color-primary)',
                                            color: 'var(--md-sys-color-on-primary)',
                                            width: 'var(--md-sys-spacing-12)',
                                            height: 'var(--md-sys-spacing-12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)' }}>school</span>
                                        </div>
                                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                                            <p style={{
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
                                                fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)',
                                                color: 'var(--md-sys-color-on-primary-container)',
                                                marginBottom: 'var(--md-sys-spacing-1)',
                                            }}>Prossima Lezione • {todaysLesson.slot.ora}</p>
                                            <h2 style={{
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                                                fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)',
                                                lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
                                                color: 'var(--md-sys-color-on-primary-container)',
                                                margin: 0,
                                            }}>{todaysLesson.lesson.materia}</h2>
                                            <p style={{
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                                color: 'var(--md-sys-color-on-primary-container)',
                                                marginTop: 'var(--md-sys-spacing-1)',
                                                opacity: 0.8,
                                            }}>{todaysLesson.lesson.contenuto}</p>
                                        </div>
                                    </div>
                                    <M3Button
                                        onClick={() => onStartPlannedLesson(todaysLesson.lesson.classe, todaysLesson.lesson.materia, `${todaysLesson.slot.giorno}-${todaysLesson.slot.ora}`, todaysLesson.lesson)}
                                        variant="primary"
                                    >
                                        <span className="material-symbols-outlined" aria-hidden="true">door_open</span>
                                        Avvia Aula Digitale
                                    </M3Button>
                                </div>
                            </M3Card>
                        ) : (
                            <M3Card style={{
                                background: 'var(--md-sys-color-surface-container)',
                                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                padding: 'var(--md-sys-spacing-6)',
                            }}>
                                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-4)'}}>
                                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-high)', color: 'var(--md-sys-color-on-surface-variant)', width: 'var(--md-sys-spacing-12)', height: 'var(--md-sys-spacing-12)', display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)' }}>event_busy</span>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h2 style={{
                                            color: 'var(--md-sys-color-on-surface)',
                                            fontFamily: 'var(--font-family)',
                                            fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                                            fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)',
                                            lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
                                            margin: 0,
                                        }}>Nessuna lezione programmata</h2>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-medium-font-size)', marginTop: 'var(--md-sys-spacing-1)' }}>Puoi avviare una lezione libera o un'attività improvvisata.</p>
                                    </div>
                                </div>
                                <M3Button onClick={() => onStartImpromptuSession(selectedClass)} variant="secondary" style={{ width: 'var(--md-sys-percent-100)' }}>
                                    <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
                                    Avvia Lezione Improvvisata
                                </M3Button>
                            </M3Card>
                        )}
                    </section>

                    {/* INBOX WIDGET */}
                    {inboxCount > 0 && (
                        <section>
                            <M3Card
                                style={{
                                    background: 'var(--md-sys-color-tertiary-container)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    padding: 'var(--md-sys-spacing-4)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onNavigate('teacher-inbox')}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                        <div style={{
                                            position: 'relative',
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            backgroundColor: 'var(--md-sys-color-tertiary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-on-tertiary)' }}>mail</span>
                                            <span style={{
                                                position: 'absolute',
                                                top: 'calc(-1 * var(--md-sys-spacing-1))',
                                                right: 'calc(-1 * var(--md-sys-spacing-1))',
                                                minWidth: 'var(--md-sys-spacing-5)',
                                                height: 'var(--md-sys-spacing-5)',
                                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                                backgroundColor: 'var(--md-sys-color-error)',
                                                color: 'var(--md-sys-color-on-error)',
                                                fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                                                fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '0 var(--md-sys-spacing-1)',
                                            }}>
                                                {inboxCount}
                                            </span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h3 style={{
                                                color: 'var(--md-sys-color-on-tertiary-container)',
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                                                fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                                                lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
                                                margin: 0,
                                            }}>Inbox Compiti</h3>
                                            <p style={{
                                                color: 'var(--md-sys-color-on-tertiary-container)',
                                                fontFamily: 'var(--font-family)',
                                                fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                                marginTop: 'var(--md-sys-spacing-1)',
                                                margin: 0,
                                            }}>{inboxCount} elaborati consegnati da valutare.</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-on-tertiary-container)' }}>arrow_forward</span>
                                </div>
                            </M3Card>
                        </section>
                    )}

                    {/* TOOLS GRID */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}>
                        {/* 1. SEZIONE REGISTRO & DIDATTICA */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-primary)' }}>auto_stories</span>
                                <h3 style={{
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    margin: 0,
                                }}>Registro & Didattica</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--md-sys-spacing-3)' }}>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('register', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-primary-container)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-on-primary-container)', fontSize: 'var(--md-sys-spacing-6)' }}>book</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Diario di Bordo</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Lezioni, assenze, note</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('didattica-inclusiva', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-secondary-container)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-on-secondary-container)', fontSize: 'var(--md-sys-spacing-6)' }}>accessibility_new</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Inclusione</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>PDP, PEI e strategie</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 2. SEZIONE VALUTAZIONE & COMPETENZE */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-secondary)' }}>grading</span>
                                <h3 style={{
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    margin: 0,
                                }}>Valutazione & Competenze</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--md-sys-spacing-3)' }}>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('evaluations', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-secondary-container)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-on-secondary-container)', fontSize: 'var(--md-sys-spacing-6)' }}>ballot</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Voti</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Registro valutazioni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('class-competency-dashboard', selectedClass)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-tertiary-container)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-on-tertiary-container)', fontSize: 'var(--md-sys-spacing-6)' }}>psychology</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Competenze</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Livelli e matrici</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>

                        {/* 3. SEZIONE ANALISI & REPORT */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-6)', color: 'var(--md-sys-color-on-surface-variant)' }}>analytics</span>
                                <h3 style={{
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    margin: 0,
                                }}>Analisi & Report</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--md-sys-spacing-3)' }}>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('improvement-guide', selectedClass)}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', textAlign: 'center' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-spacing-6)' }}>query_stats</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Analisi AI</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Report pedagogico</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('consiglio-di-classe', selectedClass)}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', textAlign: 'center' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-secondary)', fontSize: 'var(--md-sys-spacing-6)' }}>gavel</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Consiglio</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Scrutini e tabelloni</p>
                                        </div>
                                    </div>
                                </M3Card>
                                <M3Card
                                    style={{ cursor: 'pointer', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)' }}
                                    onClick={() => onNavigate('studenti', selectedClass)}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', textAlign: 'center' }}>
                                        <div style={{
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-tertiary)', fontSize: 'var(--md-sys-spacing-6)' }}>groups</span>
                                        </div>
                                        <div>
                                            <h4 style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-title-small-font-size)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)', color: 'var(--md-sys-color-on-surface)', margin: 0 }}>Anagrafica</h4>
                                            <p style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--md-sys-typescale-body-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)', margin: 0, marginTop: 'var(--md-sys-spacing-0-5)' }}>Elenco studenti</p>
                                        </div>
                                    </div>
                                </M3Card>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Side Column: Students List */}
                <div>
                    <M3Card variant="elevated" style={{
                        padding: 'var(--md-sys-spacing-4)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--md-sys-spacing-2)' }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--md-sys-typescale-title-large-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-title-large-font-weight)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    margin: 0,
                                }}>Studenti</h2>
                                <span style={{
                                    fontFamily: 'var(--font-family)',
                                    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                                    fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                    color: 'var(--md-sys-color-primary)',
                                    backgroundColor: 'var(--md-sys-color-primary-container)',
                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)',
                                }}>
                                    {filteredStudents.length}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
                                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                    <StudentDashboardItem
                                        key={student.id}
                                        student={student}
                                        evaluations={evaluations}
                                        onClick={onViewStudentProfile}
                                    />
                                )) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 'var(--md-sys-spacing-2)',
                                        padding: 'var(--md-sys-spacing-6)',
                                    }}>
                                        <span className="material-symbols-outlined" aria-hidden="true" style={{
                                            fontSize: 'var(--md-sys-spacing-10)',
                                            color: 'var(--md-sys-color-on-surface-variant)',
                                            fontVariationSettings: '"FILL" 0, "wght" 300',
                                        }}>person_off</span>
                                        <p style={{
                                            fontFamily: 'var(--font-family)',
                                            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                                            fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)',
                                            lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                                            color: 'var(--md-sys-color-on-surface-variant)',
                                            margin: 0,
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

