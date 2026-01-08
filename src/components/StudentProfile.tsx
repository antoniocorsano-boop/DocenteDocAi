
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <InfoCard 
                    title="Media Voti"
                    description={performance.grade || '-'}
                    icon="analytics"
                    variant="primary"
                    className="bg-primary-container/20 border-primary/20 h-32"
                />
                <InfoCard 
                    title="Andamento"
                    description={performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                    icon={trendIcon}
                    variant="surface"
                    className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/20 h-32"
                />
                <InfoCard 
                    title="Assenze"
                    description={`${attendanceStats.absences} ore`}
                    icon="event_busy"
                    variant="secondary"
                    className="bg-secondary-container/10 border-secondary/20 h-32"
                />
                <InfoCard 
                    title="Ritardi"
                    description={`${attendanceStats.lates} ingressi`}
                    icon="schedule"
                    variant="tertiary"
                    className="bg-tertiary-container/10 border-tertiary/20 h-32"
                />
            </div>

            {onOpenInclusionPlanEditor && (
                <div 
                    className="bg-tertiary-container/10 backdrop-blur-xl border border-tertiary/20 rounded-[var(--md-sys-shape-corner-large)] p-6 flex items-center justify-between cursor-pointer hover:bg-tertiary-container/20 transition-all group"
                    onClick={() => onOpenInclusionPlanEditor(student)}
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[var(--md-sys-shape-corner-large)] bg-tertiary text-on-tertiary flex items-center justify-center shadow-[var(--md-sys-elevation-level2)] group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">accessibility_new</span>
                        </div>
                        <div>
                            <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Piano di Inclusione (BES/DSA)</h3>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant opacity-70">Gestisci misure compensative e dispensative.</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-tertiary text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
            )}

            {/* AI Judgment Suggestion Section */}
            <div className="bg-primary-container/10 backdrop-blur-xl border border-primary/20 rounded-[var(--md-sys-shape-corner-large)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[var(--md-sys-shape-corner-large)] bg-primary text-on-primary flex items-center justify-center shadow-[var(--md-sys-elevation-level2)]">
                            <span className="material-symbols-outlined text-3xl">psychology</span>
                        </div>
                        <div>
                            <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Consulente AI: Giudizio</h3>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant opacity-70">Genera una bozza di giudizio basata sui dati.</p>
                        </div>
                    </div>
                    <M3Button 
                        onClick={handleGenerateAiJudgment} 
                        variant="filled" 
                        className="font-black text-xs uppercase tracking-widest"
                        disabled={isLoadingAi}
                    >
                        {isLoadingAi ? '⏳' : 'Genera Bozza'}
                    </M3Button>
                </div>

                {aiJudgment && (
                    <div className="bg-[var(--md-sys-color-surface-container-low)]est/50 p-8 rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)]/20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-8 mb-8 text-primary">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Suggerimento AI</span>
                        </div>
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)] leading-relaxed italic">
                            "{aiJudgment}"
                        </p>
                        <div className="flex justify-end mt-4">
                            <M3Button 
                                onClick={() => {
                                    navigator.clipboard.writeText(aiJudgment);
                                    alert("Giudizio copiato negli appunti!");
                                }} 
                                variant="text" 
                                className="text-[10px] font-black uppercase tracking-widest"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">content_copy</span>
                                Copia Testo
                            </M3Button>
                        </div>
                    </div>
                )}
            </div>

            {isTerminalYear && (
                <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border border-[var(--md-sys-color-outline-variant)]/20 rounded-[var(--md-sys-shape-corner-large)] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[var(--md-sys-shape-corner-large)] bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                        </div>
                        <div>
                            <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">Certificazione Competenze</h3>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant opacity-70">Fine ciclo studi</p>
                        </div>
                    </div>
                    <M3Button onClick={handleGenerateCertification} variant="tonal" className="font-black text-xs uppercase tracking-widest" disabled={isExporting}>
                        Genera PDF
                    </M3Button>
                </div>
            )}
        </div>
    );

    const renderGrades = () => (
        <div className="space-y-6 animate-in fade-in">
            {Object.entries(groupedEvaluations).length > 0 ? (
                Object.entries(groupedEvaluations).map(([materia, evals]: [string, Valutazione[]]) => (
                    <div key={materia} className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/20 overflow-hidden">
                        <div className="flex items-center justify-between p-6 bg-[var(--md-sys-color-surface-container-high)]/50">
                            <div className="flex items-center gap-8">
                                <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] bg-primary text-on-primary flex items-center justify-center font-black text-xl shadow-[var(--md-sys-elevation-level1)]">
                                    {materia.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">{materia}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-70">{evals.length} prove registrate</p>
                                </div>
                            </div>
                            <div className="bg-primary-container/30 px-4 py-4 rounded-[var(--md-sys-shape-corner-large)] border border-primary/20">
                                <span className="text-xs font-black text-primary uppercase tracking-widest mr-2">Media:</span>
                                <span className="m3-title-large font-black text-primary">
                                    {(evals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / evals.length).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 space-y-2">
                            {evals.map(ev => (
                                <M3ListItem
                                    key={ev.id}
                                    leadingElement={
                                        <div className={`w-12 h-12 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-center font-black text-xl shadow-sm ${parseFloat(ev.voto) < 6 ? 'bg-error text-on-error' : 'bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]'}`}>
                                            {ev.voto}
                                        </div>
                                    }
                                    headline={ev.argomento || 'Verifica'}
                                    supportingText={`${ev.tipo} ${ev.note ? `• ${ev.note}` : ''}`}
                                    trailingElement={
                                        <div className="flex items-center gap-8">
                                            <span className="text-[10px] font-black text-[var(--md-sys-color-on-surface)]-variant uppercase tracking-widest opacity-60">{new Date(ev.data).toLocaleDateString()}</span>
                                            <M3Button onClick={() => { if (confirm('Eliminare voto?')) onDeleteEvaluation(ev.id) }} variant="icon" className="text-error hover:bg-error/10">
                                                <span className="material-symbols-outlined">delete</span>
                                            </M3Button>
                                        </div>
                                    }
                                    className="hover:bg-[var(--md-sys-color-surface-container-high)]/50 rounded-[var(--md-sys-shape-corner-large)] transition-all"
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : <EmptyState title="Nessun voto" description="Nessun voto registrato per questo studente." icon="grade_off" />}
        </div>
    );

    const renderCompetencies = () => (
        <div className="space-y-6 animate-in fade-in">
            {Object.entries(groupedCompetencyEvals).length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {Object.values(groupedCompetencyEvals).map(({ competenza, evals }) => {
                        const latest = evals.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
                        const level = competenza.livelli.find(l => l.id === latest.livelloId);
                        let levelColor = "bg-[var(--md-sys-color-surface-container-high)]/50 text-[var(--md-sys-color-on-surface)]-variant";
                        
                        if (level?.nome.includes("Avanzato") || level?.nome.includes("A -")) {
                            levelColor = "bg-primary-container/30 text-primary border-primary/20";
                        } else if (level?.nome.includes("Intermedio") || level?.nome.includes("B -")) {
                            levelColor = "bg-secondary-container/30 text-secondary border-secondary/20";
                        } else if (level?.nome.includes("Base") || level?.nome.includes("C -")) {
                            levelColor = "bg-tertiary-container/30 text-tertiary border-tertiary/20";
                        }

                        return (
                            <div key={competenza.id} className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl p-6 rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/20">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">{competenza.codice}</p>
                                        <h3 className="m3-title-large font-black text-[var(--md-sys-color-on-surface)]">{competenza.nome}</h3>
                                    </div>
                                    <div className={`px-4 py-4 rounded-[var(--md-sys-shape-corner-large)] border font-black text-xs uppercase tracking-widest ${levelColor}`}>
                                        {level?.nome}
                                    </div>
                                </div>
                                <div className="bg-[var(--md-sys-color-surface-container-high)]/50 p-5 rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/10">
                                    <div className="flex items-center gap-8 mb-8 opacity-60">
                                        <span className="material-symbols-outlined text-sm">event</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(latest.data).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)] leading-relaxed">{level?.descrizione}</p>
                                </div>
                                {latest.nota && (
                                    <div className="mt-4 flex gap-6 items-start pl-4 border-l-4 border-primary/30">
                                        <span className="material-symbols-outlined text-primary text-sm mt-4">chat_bubble</span>
                                        <p className="m3-body-small italic text-[var(--md-sys-color-on-surface)]-variant">&ldquo;{latest.nota}&rdquo;</p>
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
        <div className="space-y-6 animate-in fade-in">
            {studentReceptions.length > 0 ? (
                <div className="space-y-4">
                    {(studentReceptions || []).map(lesson => (
                        <div key={lesson.id} className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl p-6 rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]/20 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-tertiary"></div>
                            <div className="flex justify-between items-start mb-6 pl-2">
                                <div className="flex items-center gap-8">
                                    <span className="material-symbols-outlined text-tertiary">meeting_room</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-tertiary bg-tertiary-container/30 px-3 py-1 rounded-full">Ricevimento</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{new Date(lesson.data).toLocaleDateString()}</span>
                            </div>
                            <p className="m3-title-medium font-bold pl-2 text-[var(--md-sys-color-on-surface)] leading-relaxed">{lesson.contenuto}</p>
                            {lesson.obiettivi && (
                                <div className="mt-4 pl-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-60 mb-4">Esito / Obiettivi</p>
                                    <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">{lesson.obiettivi}</p>
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
        <div className="page-layout pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-6">
                    <M3Button onClick={onBack} variant="icon" className="bg-[var(--md-sys-color-surface-container-high)]/50">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </M3Button>
                    <div className="flex items-center gap-5">
                        <Avatar 
                            name={`${student.nome} ${student.cognome}`} 
                            size="xl" 
                            className="shadow-[var(--md-sys-elevation-level3)] border-4 border-surface-container-high"
                        />
                        <div>
                            <h1 className="m3-headline-medium font-black tracking-tight">{student.cognome} {student.nome}</h1>
                            <div className="flex items-center gap-6 mt-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Classe {student.classe}</span>
                                {student.hasBES && <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-black uppercase tracking-widest border border-tertiary/20">BES</span>}
                                {student.hasDSA && <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-black uppercase tracking-widest border border-tertiary/20">DSA</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6 w-full md:w-auto">
                    <M3Button onClick={() => setIsInterviewModeOpen(true)} variant="tonal" className="flex-grow md:flex-grow-0 font-black text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined mr-2">record_voice_over</span>
                        Colloquio
                    </M3Button>
                    <M3Button onClick={handleExportPdf} variant="filled" className="flex-grow md:flex-grow-0 shadow-[var(--md-sys-elevation-level2)] font-black text-xs uppercase tracking-widest" disabled={isExporting}>
                        <span className="material-symbols-outlined mr-2">download</span>
                        Esporta PDF
                    </M3Button>
                </div>
            </div>

            <TabGroup 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(id) => setActiveTab(id as ProfileTab)}
                variant="primary"
                className="mb-8"
            />

            <div className="mt-8">
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


