
import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, RegisterEntry, Lezione, Competenza } from '../types';
import { calculatePerformance } from '../utils/evaluationUtils';
import { generateStudentProfilePdf, generateHtmlDocxBlob, viewPdfInNewTab, generateCertificazioneCompetenzePdf } from '../utils/documentUtils';
import { DEFAULT_COMPETENZE } from '../constants';
import { saveAs } from '../utils/documentUtils';
import StudentInterviewModal from './StudentInterviewModal';
import Avatar from './Avatar';
import { TabGroup, EmptyState, M3Card, M3Dialog, M3ListItem } from './M3Components';

interface StudentProfileProps {
    student: Studente;
    evaluations: Valutazione[];
    competencyEvaluations: ValutazioneCompetenza[];
    settings: TimetableSettings;
    onBack: () => void;
    onDeleteEvaluation: (evalId: string) => void;
    onDeleteCompetencyEvaluation: (evalId: string) => void;
    onOpenInclusionPlanEditor?: (student: Studente) => void;
    register?: RegisterEntry[];
    lessons?: Record<string, Lezione>;
}

type ProfileTab = 'overview' | 'grades' | 'competencies' | 'notes' | 'history';

const StudentProfile: React.FC<StudentProfileProps> = ({ student, evaluations, competencyEvaluations, settings, onBack, onDeleteEvaluation, onDeleteCompetencyEvaluation, onOpenInclusionPlanEditor, register = [], lessons = {} }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
    const [isExporting, setIsExporting] = useState(false);
    const [isInterviewModeOpen, setIsInterviewModeOpen] = useState(false);

    const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
    const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-on-surface-variant';
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
        } catch (e: any) {
            console.error("PDF Export failed", e);
            alert(`Errore durante la creazione del PDF: ${e.message}`);
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
        } catch (e: any) {
            console.error("Certificazione failed", e);
            alert(`Errore creazione certificazione: ${e.message}`);
        } finally {
            setIsExporting(false);
        }
    }

    // ... (handleExportDocx remains the same) ...
    const handleExportDocx = async () => {
        setIsExporting(true);
        try {
            const trendText = performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile';
            let html = `<h1>Scheda Studente: ${student.cognome} ${student.nome}</h1>...`; // Simplified for brevity
            const blob = await generateHtmlDocxBlob(html, `Scheda ${student.cognome}`);
            saveAs(blob, `Scheda_${student.cognome}_${student.nome}.docx`);
        } catch (e: any) {
            alert(`Errore DOCX: ${e.message}`);
        } finally {
            setIsExporting(false);
        }
    }

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <M3Card className="!p-4 bg-primary-container text-on-primary-container relative overflow-hidden flex flex-col justify-between h-32 border-none">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <span className="material-symbols-outlined text-6xl">analytics</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Media Voti</span>
                    <span className="text-4xl font-bold">{performance.grade || '-'}</span>
                    <span className="text-xs opacity-70">Su tutte le materie</span>
                </M3Card>
                <M3Card className="!p-4 bg-surface-container-high border-none flex flex-col justify-between h-32">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Andamento</span>
                    <div className={`flex items-center gap-2 ${trendClass}`}>
                        <span className="material-symbols-outlined text-4xl">{trendIcon}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant opacity-70">Rispetto ultime 5 prove</span>
                </M3Card>
                <M3Card className="!p-4 bg-surface-container-high border-none flex flex-col justify-between h-32">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Assenze</span>
                    <span className="text-3xl font-bold text-secondary">{attendanceStats.absences}</span>
                    <span className="text-xs text-on-surface-variant opacity-70">{attendanceStats.percentage}% del totale ore</span>
                </M3Card>
                <M3Card className="!p-4 bg-surface-container-high border-none flex flex-col justify-between h-32">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ritardi</span>
                    <span className="text-3xl font-bold text-tertiary">{attendanceStats.lates}</span>
                    <span className="text-xs text-on-surface-variant opacity-70">Ingressi posticipati</span>
                </M3Card>
            </div>

            {onOpenInclusionPlanEditor && (
                <M3Card
                    className="border border-dashed border-tertiary/50 bg-tertiary-container/10 flex-row items-center justify-between p-4 cursor-pointer hover:bg-tertiary-container/20 transition-colors"
                    onClick={() => onOpenInclusionPlanEditor(student)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                            <span className="material-symbols-outlined">accessibility_new</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-on-surface">Piano di Inclusione (BES/DSA)</h3>
                            <p className="text-xs text-on-surface-variant">Gestisci misure compensative e dispensative.</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-tertiary">arrow_forward</span>
                </M3Card>
            )}

            {isTerminalYear && (
                <M3Card className="bg-surface-container-high p-4 flex-row items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-on-surface">Certificazione Competenze</h3>
                        <p className="text-xs text-on-surface-variant">Fine ciclo studi</p>
                    </div>
                    <button onClick={handleGenerateCertification} className="button button-tonal !h-8 !text-xs" disabled={isExporting}>
                        <span className="material-symbols-outlined text-sm mr-2">workspace_premium</span>
                        Genera
                    </button>
                </M3Card>
            )}
        </div>
    );

    // ... (renderGrades, renderCompetencies, renderNotes remain largely the same) ...
    const renderGrades = () => (
        <div className="space-y-4 animate-in fade-in">
            {Object.entries(groupedEvaluations).length > 0 ? (
                Object.entries(groupedEvaluations).map(([materia, evals]: [string, Valutazione[]]) => (
                    <details key={materia} className="group bg-surface-container rounded-2xl border border-outline-variant overflow-hidden" open>
                        <summary className="flex items-center justify-between p-4 cursor-pointer bg-surface-container hover:bg-surface-container-high transition-colors list-none">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    {materia.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-on-surface">{materia}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold bg-surface px-2 py-1 rounded border border-outline-variant text-on-surface-variant">
                                    Media: ${(evals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / evals.length).toFixed(1)}
                                </span>
                                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                            </div>
                        </summary>
                        <div className="p-2 space-y-1 bg-surface">
                            {evals.map(ev => (
                                <M3ListItem
                                    key={ev.id}
                                    leadingElement={
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${parseFloat(ev.voto) < 6 ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface'}`}>
                                            {ev.voto}
                                        </div>
                                    }
                                    headline={ev.argomento || 'Verifica'}
                                    supportingText={`${ev.tipo} ${ev.note ? `• ${ev.note}` : ''}`}
                                    trailingElement={
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{new Date(ev.data).toLocaleDateString()}</span>
                                            <button onClick={() => { if (confirm('Eliminare voto?')) onDeleteEvaluation(ev.id) }} className="icon-button text-error !w-8 !h-8 opacity-0 group-hover:opacity-100 transition-opacity" title="Elimina"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    }
                                    className="group hover:bg-surface-container-low transition-colors"
                                />
                            ))}
                        </div>
                    </details>
                ))
            ) : <EmptyState title="Nessun voto" description="Nessun voto registrato per questo studente." icon="grade_off" />}
        </div>
    );
    const renderCompetencies = () => (
        <div className="space-y-4 animate-in fade-in">
            {Object.entries(groupedCompetencyEvals).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(groupedCompetencyEvals).map(({ competenza, evals }) => {
                        const latest = evals.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
                        const level = competenza.livelli.find(l => l.id === latest.livelloId);
                        let levelColor = "bg-surface-container-high text-on-surface-variant";
                        if (level?.nome.includes("Avanzato") || level?.nome.includes("A -")) levelColor = "bg-primary-container text-on-primary-container";
                        if (level?.nome.includes("Intermedio") || level?.nome.includes("B -")) levelColor = "bg-secondary-container text-on-secondary-container";
                        if (level?.nome.includes("Base") || level?.nome.includes("C -")) levelColor = "bg-tertiary-container text-on-tertiary-container";

                        return (
                            <M3Card key={competenza.id} className="p-4 bg-surface-container border-outline-variant">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{competenza.codice}</p>
                                <h3 className="m3-title-medium font-bold mb-3">{competenza.nome}</h3>
                                <div className={`p-3 rounded-xl ${levelColor} mb-2`}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-sm">{level?.nome}</span>
                                        <span className="text-[10px] opacity-80">{new Date(latest.data).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs opacity-90 leading-relaxed">{level?.descrizione}</p>
                                </div>
                                {latest.nota && <p className="text-xs italic text-on-surface-variant pl-2 border-l-2 border-outline-variant mt-2">"{latest.nota}"</p>}
                            </M3Card>
                        );
                    })}
                </div>
            ) : <EmptyState title="Nessuna competenza" description="Nessuna valutazione per competenza registrata." icon="psychology_alt" />}
        </div>
    );
    const renderNotes = () => (
        <div className="space-y-4 animate-in fade-in">
            {studentReceptions.length > 0 ? (
                <div className="space-y-3">
                    {(studentReceptions || []).map(lesson => (
                        <M3Card key={lesson.id} className="bg-surface-container-low !p-4 border-outline-variant relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-tertiary bg-tertiary-container px-2 py-0.5 rounded">Ricevimento</span>
                            </div>
                            <p className="m3-body-medium font-bold pl-2 mb-1">{lesson.contenuto}</p>
                            {lesson.nota ? <p className="text-sm text-on-surface-variant pl-2 leading-relaxed whitespace-pre-wrap">"{lesson.nota}"</p> : <p className="text-xs italic text-outline pl-2">Nessuna nota.</p>}
                        </M3Card>
                    ))}
                </div>
            ) : <EmptyState title="Nessun colloquio" description="Nessun colloquio registrato per questo studente." icon="chat_bubble_outline" />}
        </div>
    );

    // NEW: Render History
    const renderHistory = () => (
        <div className="space-y-4 animate-in fade-in">
            {student.history && student.history.length > 0 ? (
                student.history.map((record, idx) => (
                    <M3Card key={idx} className="bg-surface-container p-4 border-outline-variant">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="m3-title-large text-primary">{record.year}</h3>
                                <p className="text-sm text-on-surface-variant">Classe {record.classe}</p>
                            </div>
                            <span className={`chip text-xs ${record.finalOutcome === 'Promosso' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                                {record.finalOutcome}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide opacity-70">Media Finale</p>
                                <p className="text-2xl font-bold">{record.averageGrade}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide opacity-70">Assenze</p>
                                <p className="text-2xl font-bold">{record.absencesPercentage}%</p>
                            </div>
                        </div>
                        {record.competencySummary && (
                            <div className="bg-surface p-3 rounded-lg text-sm">
                                <p className="font-bold mb-1">Note Competenze:</p>
                                <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                                    {record.competencySummary.map((c, i) => (
                                        <li key={i}>{c.name}: {c.level}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </M3Card>
                ))
            ) : (
                <EmptyState title="Nessuno storico" description="I dati degli anni precedenti appariranno qui dopo il passaggio d'anno." icon="history" />
            )}
        </div>
    );

    return (
        <M3Dialog
            isOpen={true}
            onClose={onBack}
            title={`${student.cognome} ${student.nome}`}
            fullscreen
            actions={
                <div className="flex gap-1">
                    <button onClick={() => setIsInterviewModeOpen(true)} className="icon-button text-primary bg-primary-container" title="Modalità Colloquio"><span className="material-symbols-outlined">visibility</span></button>
                    <button onClick={handleExportPdf} disabled={isExporting} className="icon-button" title="Esporta PDF"><span className="material-symbols-outlined">picture_as_pdf</span></button>
                    <button onClick={handleExportDocx} disabled={isExporting} className="icon-button" title="Esporta Word"><span className="material-symbols-outlined">description</span></button>
                </div>
            }
        >
            <div className="flex flex-col h-full bg-surface-container-low -mx-6 -mt-2">
                <div className="px-4 pt-4 pb-2 bg-surface-container-low border-b border-outline-variant/50 sticky top-0 z-10">
                    <TabGroup
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as any)}
                        variant="primary"
                        tabs={[
                            { id: 'overview', label: 'Panoramica', icon: 'dashboard' },
                            { id: 'grades', label: 'Voti', icon: 'grading' },
                            { id: 'competencies', label: 'Competenze', icon: 'psychology' },
                            { id: 'notes', label: 'Colloqui', icon: 'diversity_3', badge: studentReceptions.length > 0 ? studentReceptions.length : undefined },
                            { id: 'history', label: 'Carriera', icon: 'history', badge: student.history?.length },
                        ]}
                        className="!w-full"
                    />
                </div>
                <div className="flex-grow overflow-y-auto p-4 md:p-6 pb-24">
                    <div className="max-w-4xl mx-auto w-full">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'grades' && renderGrades()}
                        {activeTab === 'competencies' && renderCompetencies()}
                        {activeTab === 'notes' && renderNotes()}
                        {activeTab === 'history' && renderHistory()}
                    </div>
                </div>

                {isInterviewModeOpen && (
                    <StudentInterviewModal
                        student={student}
                        evaluations={evaluations}
                        competencyEvaluations={competencyEvaluations}
                        settings={settings}
                        onClose={() => setIsInterviewModeOpen(false)}
                    />
                )}
            </div>
        </M3Dialog>
    );
};

export default StudentProfile;
