
// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, RegisterEntry, Lezione, Competenza } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { generateStudentProfilePdf, viewPdfInNewTab, generateCertificazioneCompetenzePdf } from '../utils/documentUtils';
import { DEFAULT_COMPETENZE } from '../constants';
import StudentInterviewModal from './StudentInterviewModal';
import { M3Button, TabGroup, EmptyState, InfoCard, Avatar, M3ListItem } from './ui';
import { getPeriodicJudgmentSuggestion } from '../services/aiService';

interface StudentProfileProps {
    student: Studente;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onBack: () => void;
    onDeleteEvaluation: (evalId: string) => void;
    onOpenInclusionPlanEditor?: (student: Studente) => void;
    register?: RegisterEntry[];
    lessons?: Record<string, Lezione>;
}

export type ProfileTab = 'overview' | 'grades' | 'competencies' | 'notes' | 'history';

const StudentProfile: React.FC<StudentProfileProps> = ({ student, evaluations, competencyEvaluations, settings, aiSettings, onBack, onDeleteEvaluation, onOpenInclusionPlanEditor, register = [], lessons = {} }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
    const [isExporting, setIsExporting] = useState(false);
    const [isInterviewModeOpen, setIsInterviewModeOpen] = useState(false);
    const [aiJudgment, setAiJudgment] = useState<string | null>(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
    const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

    // Check if student is in terminal year (starts with 3 for middle school, 5 for high school)
    const isTerminalYear = student.classe.startsWith('3') || student.classe.startsWith('5');

    const groupedEvaluations = useMemo(() => {
        const safeEvaluations: Valutazione[] = evaluations || [];
        return safeEvaluations.reduce((acc, ev) => {
            (acc[ev.materia] = acc[ev.materia] || []).push(ev);
            return acc;
        }, {} as Record<string, Valutazione[]>);
    }, [evaluations]);

    const groupedCompetencyEvals = useMemo(() => {
        const safeCompetencyEvaluations: ValutazioneCompetenza[] = competencyEvaluations || [];
        return safeCompetencyEvaluations.reduce((acc, ev) => {
            let competency = settings.competenze.find(c => c.id === ev.competenzaId);
            if (!competency) {
                competency = DEFAULT_COMPETENZE.find(c => c.id === ev.competenzaId);
            }

            if (competency) {
                const compName = competency.nome;
                if (!acc[compName]) {
                    acc[compName] = { competenza: competency, evals: [] };
                }
                acc[compName].evals.push(ev);
            }
            return acc;
        }, {} as Record<string, { competenza: Competenza, evals: ValutazioneCompetenza[] }>);
    }, [competencyEvaluations, settings.competenze]);

    const attendanceStats = useMemo(() => {
        const studentEntries: RegisterEntry[] = (Array.isArray(register) ? register : []).filter(e => e.classe === student.classe);
        const totalLessons = studentEntries.length;
        const absences = studentEntries.filter(e => e.studentAttendance[student.id] === 'assente').length;
        const lates = studentEntries.filter(e => e.studentAttendance[student.id] === 'ritardo').length;

        const percentage = totalLessons > 0 ? Math.round((absences / totalLessons) * 100) : 0;

        return { totalLessons, absences, lates, percentage };
    }, [register, student.id, student.classe]);

    const studentReceptions = useMemo(() => {
        return (lessons && typeof lessons === 'object' ? Object.values(lessons) : []).filter((l: Lezione) =>
            l.tipoLezione === 'Ricevimento' &&
            (l.contesto?.includes(`STUDENT_ID:${student.id}`) || l.contenuto.includes(student.cognome))
        );
    }, [lessons, student]);

    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const blob = await generateStudentProfilePdf(student, evaluations, competencyEvaluations, settings);
            viewPdfInNewTab(blob);
        } catch (e: unknown) {
            console.error("PDF Export failed", e);
            let message = 'Errore durante la creazione del PDF.';
            if (e instanceof Error) {
                message = `Errore durante la creazione del PDF: ${e.message}`;
            }
            alert(message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleGenerateCertification = async () => {
        setIsExporting(true);
        try {
            // Aggregate levels for certification
            const certData = Object.values(groupedCompetencyEvals).map(({ competenza, evals }) => {
                // Logic: take the latest or best level. Let's take latest.
                const latest = evals.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
                const level = competenza.livelli.find(l => l.id === latest.livelloId);
                // Map internal level names to A/B/C/D if possible, otherwise pass name
                let mappedLevel = 'D'; // Default
                if (level) {
                    if (level.nome.includes('Avanzato') || level.nome.startsWith('A')) mappedLevel = 'A';
                    else if (level.nome.includes('Intermedio') || level.nome.startsWith('B')) mappedLevel = 'B';
                    else if (level.nome.includes('Base') || level.nome.startsWith('C')) mappedLevel = 'C';
                }
                return { competencyName: competenza.nome, level: mappedLevel };
            });

            const blob = await generateCertificazioneCompetenzePdf(student, certData, settings);
            viewPdfInNewTab(blob);
        } catch (e: unknown) {
            console.error("Certificazione failed", e);
            let message = 'Errore creazione certificazione.';
            if (e instanceof Error) {
                message = `Errore creazione certificazione: ${e.message}`;
            }
            alert(message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleGenerateAiJudgment = async () => {
        setIsLoadingAi(true);
        setAiJudgment(null);
        try {
            const suggestion = await getPeriodicJudgmentSuggestion(
                aiSettings,
                student,
                'periodo corrente',
                evaluations,
                competencyEvaluations,
                settings.competenze
            );
            setAiJudgment(suggestion);
        } catch (error) {
            console.error("Error generating AI judgment:", error);
            alert("Errore durante la generazione del giudizio AI.");
        } finally {
            setIsLoadingAi(false);
        }
    };

    const renderOverview = () => (
        <div className="student-profile-overview">
            <div className="student-profile-stats-grid">
                <InfoCard 
                    title="Media Voti"
                    description={performance.grade || '-'}
                    icon="analytics"
                    variant="primary"
                    className="student-profile-stat-card-primary"
                />
                <InfoCard 
                    title="Andamento"
                    description={performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                    icon={trendIcon}
                    variant="surface"
                    className="student-profile-stat-card-surface"
                />
                <InfoCard 
                    title="Assenze"
                    description={`${attendanceStats.absences} ore`}
                    icon="event_busy"
                    variant="secondary"
                    className="student-profile-stat-card-secondary"
                />
                <InfoCard 
                    title="Ritardi"
                    description={`${attendanceStats.lates} ingressi`}
                    icon="schedule"
                    variant="tertiary"
                    className="student-profile-stat-card-tertiary"
                />
            </div>

            {onOpenInclusionPlanEditor && (
                <div 
                    className="student-profile-inclusion-card"
                    onClick={() => onOpenInclusionPlanEditor(student)}
                >
                    <div className="student-profile-inclusion-content">
                        <div className="student-profile-inclusion-icon">
                            <span className="material-symbols-outlined student-profile-inclusion-icon-symbol">accessibility_new</span>
                        </div>
                        <div>
                            <h3 className="student-profile-inclusion-title">Piano di Inclusione (BES/DSA)</h3>
                            <p className="student-profile-inclusion-subtitle">Gestisci misure compensative e dispensative.</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined student-profile-inclusion-arrow">arrow_forward</span>
                </div>
            )}

            {/* AI Judgment Suggestion Section */}
            <div className="student-profile-ai-section">
                <div className="student-profile-ai-header">
                    <div className="student-profile-ai-content">
                        <div className="student-profile-ai-icon">
                            <span className="material-symbols-outlined student-profile-ai-icon-symbol">psychology</span>
                        </div>
                        <div>
                            <h3 className="student-profile-ai-title">Consulente AI: Giudizio</h3>
                            <p className="student-profile-ai-subtitle">Genera una bozza di giudizio basata sui dati.</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={handleGenerateAiJudgment} 
                        variant="filled" 
                        className="student-profile-ai-generate-button"
                        disabled={isLoadingAi}
                    >
                        {isLoadingAi ? '⏳' : 'Genera Bozza'}
                    </M3Button>
                </div>

                {aiJudgment && (
                    <div className="student-profile-ai-judgment">
                        <div className="student-profile-ai-judgment-header">
                            <span className="material-symbols-outlined student-profile-ai-judgment-icon">auto_awesome</span>
                            <span className="student-profile-ai-judgment-label">Suggerimento AI</span>
                        </div>
                        <p className="student-profile-ai-judgment-text">
                            "{aiJudgment}"
                        </p>
                        <div className="student-profile-ai-judgment-actions">
                            <M3Button 
                                onClick={() => {
                                    navigator.clipboard.writeText(aiJudgment);
                                    alert("Giudizio copiato negli appunti!");
                                }} 
                                variant="text" 
                                className="student-profile-ai-copy-button"
                            >
                                <span className="material-symbols-outlined student-profile-ai-copy-icon">content_copy</span>
                                Copia Testo
                            </M3Button>
                        </div>
                    </div>
                )}
            </div>

            {isTerminalYear && (
                <div className="student-profile-certification-card">
                    <div className="student-profile-certification-content">
                        <div className="student-profile-certification-icon">
                            <span className="material-symbols-outlined student-profile-certification-icon-symbol">workspace_premium</span>
                        </div>
                        <div>
                            <h3 className="student-profile-certification-title">Certificazione Competenze</h3>
                            <p className="student-profile-certification-subtitle">Fine ciclo studi</p>
                        </div>
                    </div>
                    <M3Button onClick={handleGenerateCertification} variant="tonal" className="student-profile-certification-button" disabled={isExporting}>
                        Genera PDF
                    </M3Button>
                </div>
            )}
        </div>
    );

    const renderGrades = () => (
        <div className="student-profile-grades">
            {Object.entries(groupedEvaluations).length > 0 ? (
                Object.entries(groupedEvaluations).map(([materia, evals]: [string, Valutazione[]]) => (
                    <div key={materia} className="student-profile-grade-subject">
                        <div className="student-profile-grade-subject-header">
                            <div className="student-profile-grade-subject-info">
                                <div className="student-profile-grade-subject-icon">
                                    {materia.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="student-profile-grade-subject-title">{materia}</h3>
                                    <p className="student-profile-grade-subject-count">{evals.length} prove registrate</p>
                                </div>
                            </div>
                            <div className="student-profile-grade-subject-average">
                                <span className="student-profile-grade-subject-average-label">Media:</span>
                                <span className="student-profile-grade-subject-average-value">
                                    {(evals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / evals.length).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="student-profile-grade-subject-list">
                            {evals.map(ev => (
                                <M3ListItem
                                    key={ev.id}
                                    leadingElement={
                                        <div className={`student-profile-grade-voto ${parseFloat(ev.voto) < 6 ? 'student-profile-grade-voto-low' : 'student-profile-grade-voto-normal'}`}>
                                            {ev.voto}
                                        </div>
                                    }
                                    headline={ev.argomento || 'Verifica'}
                                    supportingText={`${ev.tipo} ${ev.note ? `• ${ev.note}` : ''}`}
                                    trailingElement={
                                        <div className="student-profile-grade-actions">
                                            <span className="student-profile-grade-date">{new Date(ev.data).toLocaleDateString()}</span>
                                            <M3Button onClick={() => { if (confirm('Eliminare voto?')) onDeleteEvaluation(ev.id) }} variant="icon" className="student-profile-grade-delete">
                                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>delete</span>
                                            </M3Button>
                                        </div>
                                    }
                                    className="student-profile-grade-item"
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : <EmptyState title="Nessun voto" description="Nessun voto registrato per questo studente." icon="grade_off" />}
        </div>
    );

    const renderCompetencies = () => (
        <div className="student-profile-competencies">
            {Object.entries(groupedCompetencyEvals).length > 0 ? (
                <div className="student-profile-competencies-grid">
                    {Object.values(groupedCompetencyEvals).map(({ competenza, evals }) => {
                        const latest = evals.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
                        const level = competenza.livelli.find(l => l.id === latest.livelloId);
                        let levelColor = "student-profile-competency-level-default";
                        
                        if (level?.nome.includes("Avanzato") || level?.nome.includes("A -")) {
                            levelColor = "student-profile-competency-level-advanced";
                        } else if (level?.nome.includes("Intermedio") || level?.nome.includes("B -")) {
                            levelColor = "student-profile-competency-level-intermediate";
                        } else if (level?.nome.includes("Base") || level?.nome.includes("C -")) {
                            levelColor = "student-profile-competency-level-basic";
                        }

                        return (
                            <div key={competenza.id} className="student-profile-competency-card">
                                <div className="student-profile-competency-header">
                                    <div>
                                        <p className="student-profile-competency-code">{competenza.codice}</p>
                                        <h3 className="student-profile-competency-title">{competenza.nome}</h3>
                                    </div>
                                    <div className={`student-profile-competency-level ${levelColor}`}>
                                        {level?.nome}
                                    </div>
                                </div>
                                <div className="student-profile-competency-details">
                                    <div className="student-profile-competency-date">
                                        <span className="material-symbols-outlined student-profile-competency-date-icon">event</span>
                                        <span className="student-profile-competency-date-text">{new Date(latest.data).toLocaleDateString()}</span>
                                    </div>
                                    <p className="student-profile-competency-description">{level?.descrizione}</p>
                                </div>
                                {latest.nota && (
                                    <div className="student-profile-competency-note">
                                        <span className="material-symbols-outlined student-profile-competency-note-icon">chat_bubble</span>
                                        <p className="student-profile-competency-note-text">&ldquo;{latest.nota}&rdquo;</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : <EmptyState title="Nessuna competenza" description="Nessuna valutazione per competenza registrata." icon="psychology_alt" />}
        </div>
    );

    const renderNotes = () => (
        <div className="student-profile-notes">
            {studentReceptions.length > 0 ? (
                <div className="student-profile-notes-list">
                    {(studentReceptions || []).map(lesson => (
                        <div key={lesson.id} className="student-profile-note-card">
                            <div className="student-profile-note-accent"></div>
                            <div className="student-profile-note-header">
                                <div className="student-profile-note-type">
                                    <span className="material-symbols-outlined student-profile-note-type-icon">meeting_room</span>
                                    <span className="student-profile-note-type-badge">Ricevimento</span>
                                </div>
                                <span className="student-profile-note-date">{new Date(lesson.data).toLocaleDateString()}</span>
                            </div>
                            <p className="student-profile-note-content">{lesson.contenuto}</p>
                            {lesson.obiettivi && (
                                <div className="student-profile-note-objectives">
                                    <p className="student-profile-note-objectives-label">Esito / Obiettivi</p>
                                    <p className="student-profile-note-objectives-text">{lesson.obiettivi}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : <EmptyState title="Nessuna nota" description="Nessun colloquio o nota registrata." icon="event_note" />}
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Panoramica', icon: 'dashboard' },
        { id: 'grades', label: 'Voti', icon: 'grade' },
        { id: 'competencies', label: 'Competenze', icon: 'psychology' },
        { id: 'notes', label: 'Colloqui', icon: 'chat' },
    ];

    return (
        <div className="student-profile-layout">
            <div className="student-profile-header">
                <div className="student-profile-header-info">
                    <M3Button onClick={onBack} variant="icon" className="student-profile-back-button">
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                    </M3Button>
                    <div className="student-profile-header-details">
                        <Avatar 
                            name={`${student.nome} ${student.cognome}`} 
                            size="xl" 
                            className="student-profile-avatar"
                        />
                        <div>
                            <h1 className="student-profile-name">{student.cognome} {student.nome}</h1>
                            <div className="student-profile-badges">
                                <span className="student-profile-class-badge">Classe {student.classe}</span>
                                {student.hasBES && <span className="student-profile-bes-badge">BES</span>}
                                {student.hasDSA && <span className="student-profile-dsa-badge">DSA</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="student-profile-header-actions">
                    <M3Button onClick={() => setIsInterviewModeOpen(true)} variant="tonal" className="student-profile-interview-button">
                        <span className="material-symbols-outlined student-profile-interview-icon">record_voice_over</span>
                        Colloquio
                    </M3Button>
                    <M3Button onClick={handleExportPdf} variant="filled" className="student-profile-export-button" disabled={isExporting}>
                        <span className="material-symbols-outlined student-profile-export-icon">download</span>
                        Esporta PDF
                    </M3Button>
                </div>
            </div>

            <TabGroup 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(id) => setActiveTab(id as ProfileTab)}
                variant="primary"
                className="student-profile-tabs"
            />

            <div className="student-profile-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'grades' && renderGrades()}
                {activeTab === 'competencies' && renderCompetencies()}
                {activeTab === 'notes' && renderNotes()}
            </div>

            {isInterviewModeOpen && (
                <StudentInterviewModal 
                    student={student}
                    onClose={() => setIsInterviewModeOpen(false)}
                    onSave={() => {
                        // Logic to save interview note
                        setIsInterviewModeOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default StudentProfile;


