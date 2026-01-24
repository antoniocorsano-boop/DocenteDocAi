// MD3 Compliant - Block J Migration Complete (2 violations eliminated)
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
        <div >
            <div >
                <InfoCard 
                    title="Media Voti"
                    description={performance.grade || '-'}
                    icon="analytics"
                    variant="primary"
                    
                />
                <InfoCard 
                    title="Andamento"
                    description={performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                    icon={trendIcon}
                    variant="surface"
                    
                />
                <InfoCard 
                    title="Assenze"
                    description={`${attendanceStats.absences} ore`}
                    icon="event_busy"
                    variant="secondary"
                    
                />
                <InfoCard 
                    title="Ritardi"
                    description={`${attendanceStats.lates} ingressi`}
                    icon="schedule"
                    variant="tertiary"
                    
                />
            </div>

            {onOpenInclusionPlanEditor && (
                <div 
                    
                    onClick={() => onOpenInclusionPlanEditor(student)}
                >
                    <div >
                        <div >
                            <span >accessibility_new</span>
                        </div>
                        <div>
                            <h3 >Piano di Inclusione (BES/DSA)</h3>
                            <p >Gestisci misure compensative e dispensative.</p>
                        </div>
                    </div>
                    <span >arrow_forward</span>
                </div>
            )}

            {/* AI Judgment Suggestion Section */}
            <div >
                <div >
                    <div >
                        <div >
                            <span >psychology</span>
                        </div>
                        <div>
                            <h3 >Consulente AI: Giudizio</h3>
                            <p >Genera una bozza di giudizio basata sui dati.</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={handleGenerateAiJudgment} 
                        variant="filled" 
                        
                        disabled={isLoadingAi}
                    >
                        {isLoadingAi ? '⏳' : 'Genera Bozza'}
                    </M3Button>
                </div>

                {aiJudgment && (
                    <div >
                        <div >
                            <span >auto_awesome</span>
                            <span >Suggerimento AI</span>
                        </div>
                        <p >
                            "{aiJudgment}"
                        </p>
                        <div >
                            <M3Button 
                                onClick={() => {
                                    navigator.clipboard.writeText(aiJudgment);
                                    alert("Giudizio copiato negli appunti!");
                                }} 
                                variant="text" 
                                
                            >
                                <span >content_copy</span>
                                Copia Testo
                            </M3Button>
                        </div>
                    </div>
                )}
            </div>

            {isTerminalYear && (
                <div >
                    <div >
                        <div >
                            <span >workspace_premium</span>
                        </div>
                        <div>
                            <h3 >Certificazione Competenze</h3>
                            <p >Fine ciclo studi</p>
                        </div>
                    </div>
                    <M3Button onClick={handleGenerateCertification} variant="tonal"  disabled={isExporting}>
                        Genera PDF
                    </M3Button>
                </div>
            )}
        </div>
    );

    const renderGrades = () => (
        <div >
            {Object.entries(groupedEvaluations).length > 0 ? (
                Object.entries(groupedEvaluations).map(([materia, evals]: [string, Valutazione[]]) => (
                    <div key={materia} >
                        <div >
                            <div >
                                <div >
                                    {materia.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 >{materia}</h3>
                                    <p >{evals.length} prove registrate</p>
                                </div>
                            </div>
                            <div >
                                <span >Media:</span>
                                <span >
                                    {(evals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / evals.length).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div >
                            {evals.map(ev => (
                                <M3ListItem
                                    key={ev.id}
                                    leadingElement={
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 'var(--md-sys-spacing-10)',
                                            height: 'var(--md-sys-spacing-10)',
                                            borderRadius: 'var(--md-sys-shape-corner-small)',
                                            backgroundColor: parseFloat(ev.voto) < 6 ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-primary-container)',
                                            color: parseFloat(ev.voto) < 6 ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-primary-container)',
                                            fontWeight: 'bold',
                                            fontSize: 'var(--md-sys-typescale-label-large-size)'
                                        }}>
                                            {ev.voto}
                                        </div>
                                    }
                                    headline={ev.argomento || 'Verifica'}
                                    supportingText={`${ev.tipo} ${ev.note ? `• ${ev.note}` : ''}`}
                                    trailingElement={
                                        <div >
                                            <span >{new Date(ev.data).toLocaleDateString()}</span>
                                            <M3Button onClick={() => { if (confirm('Eliminare voto?')) onDeleteEvaluation(ev.id) }} variant="icon" >
                                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>delete</span>
                                            </M3Button>
                                        </div>
                                    }
                                    
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : <EmptyState title="Nessun voto" description="Nessun voto registrato per questo studente." icon="grade_off" />}
        </div>
    );

    const renderCompetencies = () => (
        <div >
            {Object.entries(groupedCompetencyEvals).length > 0 ? (
                <div >
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
                            <div key={competenza.id} >
                                <div >
                                    <div>
                                        <p >{competenza.codice}</p>
                                        <h3 >{competenza.nome}</h3>
                                    </div>
                                    <div style={{
                                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                        fontSize: 'var(--md-sys-typescale-body-small-size)',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        backgroundColor: levelColor.includes('advanced') ? 'var(--md-sys-color-tertiary-container)' :
                                                        levelColor.includes('intermediate') ? 'var(--md-sys-color-secondary-container)' :
                                                        levelColor.includes('basic') ? 'var(--md-sys-color-primary-container)' :
                                                        'var(--md-sys-color-surface-container-highest)',
                                        color: levelColor.includes('advanced') ? 'var(--md-sys-color-on-tertiary-container)' :
                                               levelColor.includes('intermediate') ? 'var(--md-sys-color-on-secondary-container)' :
                                               levelColor.includes('basic') ? 'var(--md-sys-color-on-primary-container)' :
                                               'var(--md-sys-color-on-surface)'
                                    }}>
                                        {level?.nome}
                                    </div>
                                </div>
                                <div >
                                    <div >
                                        <span >event</span>
                                        <span >{new Date(latest.data).toLocaleDateString()}</span>
                                    </div>
                                    <p >{level?.descrizione}</p>
                                </div>
                                {latest.nota && (
                                    <div >
                                        <span >chat_bubble</span>
                                        <p >&ldquo;{latest.nota}&rdquo;</p>
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
        <div >
            {studentReceptions.length > 0 ? (
                <div >
                    {(studentReceptions || []).map(lesson => (
                        <div key={lesson.id} >
                            <div ></div>
                            <div >
                                <div >
                                    <span >meeting_room</span>
                                    <span >Ricevimento</span>
                                </div>
                                <span >{new Date(lesson.data).toLocaleDateString()}</span>
                            </div>
                            <p >{lesson.contenuto}</p>
                            {lesson.obiettivi && (
                                <div >
                                    <p >Esito / Obiettivi</p>
                                    <p >{lesson.obiettivi}</p>
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
        <div >
            <div >
                <div >
                    <M3Button onClick={onBack} variant="icon" >
                        <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>arrow_back</span>
                    </M3Button>
                    <div >
                        <Avatar 
                            name={`${student.nome} ${student.cognome}`} 
                            size="xl" 
                            
                        />
                        <div>
                            <h1 >{student.cognome} {student.nome}</h1>
                            <div >
                                <span >Classe {student.classe}</span>
                                {student.hasBES && <span >BES</span>}
                                {student.hasDSA && <span >DSA</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    <M3Button onClick={() => setIsInterviewModeOpen(true)} variant="tonal" >
                        <span >record_voice_over</span>
                        Colloquio
                    </M3Button>
                    <M3Button onClick={handleExportPdf} variant="filled"  disabled={isExporting}>
                        <span >download</span>
                        Esporta PDF
                    </M3Button>
                </div>
            </div>

            <TabGroup 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(id) => setActiveTab(id as ProfileTab)}
                variant="primary"
                
            />

            <div >
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







