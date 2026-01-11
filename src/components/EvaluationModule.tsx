import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, EvaluationModuleProps, Prova } from '../types';
import AddProvaModal from './AddProvaModal';
import StudentProfile from './StudentProfile';
import ExportModal from './ExportModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import UnifiedEvaluationModal from './UnifiedEvaluationModal';
import { 
    EmptyState, 
    Avatar 
} from './ui';

type PendingProva = Omit<Valutazione, 'id' | 'studenteId' | 'voto'>;
type ViewTab = 'grid' | 'summary' | 'risk';

const getProvaId = (prova: { data: string, argomento?: string, tipo: Valutazione['tipo'] }): string => {
    const titolo = prova.argomento || 'Prova non specificata';
    return `${String(prova.data)}-${String(prova.tipo)}-${String(titolo)}`;
};

const getTestTypeIcon = (tipo: string) => {
    switch (tipo) {
        case 'Scritto': return 'edit_note';
        case 'Orale': return 'record_voice_over';
        case 'Pratico': return 'build';
        case 'Test': return 'quiz';
        default: return 'assignment';
    }
};

const EvaluationModule: React.FC<EvaluationModuleProps> = ({ 
    students, 
    evaluations, 
    setEvaluations, 
    competencyEvaluations, 
    setCompetencyEvaluations, 
    userClasses, 
    settings, 
    aiSettings, 
    initialClass, 
    initialStudentId, 
    onClearInitialStudent, 
    onOpenInclusionPlanEditor 
}) => {
    const [selectedClass, setSelectedClass] = useState<string>(initialClass || userClasses[0] || '1A');
    const [activeTab, setActiveTab] = useState<ViewTab>('grid');
    const [isAddProvaModalOpen, setIsAddProvaModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [viewingStudent, setViewingStudent] = useState<Studente | null>(() => {
        if (initialStudentId) {
            return students.find(s => s.id === initialStudentId) || null;
        }
        return null;
    });
    const [editingUnified, setEditingUnified] = useState<{ student: Studente; prova: Prova } | null>(null);
    const [pendingProve, setPendingProve] = useState<PendingProva[]>([]);

    const { disciplines } = settings;

    const filteredStudents = useMemo(() => {
        return students
            .filter(s => s.classe === selectedClass)
            .sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [students, selectedClass]);

    const prove = useMemo((): Prova[] => {
        const proveMap: Record<string, Prova> = {};
        evaluations.filter(ev => students.some(s => s.id === ev.studenteId && s.classe === selectedClass)).forEach(ev => {
            const provaId = getProvaId(ev);
            if (!proveMap[provaId]) {
                proveMap[provaId] = {
                    id: provaId,
                    titolo: ev.argomento || 'Prova non specificata',
                    data: ev.data,
                    materia: ev.materia,
                    tipo: ev.tipo,
                    voti: {}
                };
            }
            proveMap[provaId].voti[ev.studenteId] = ev;
        });

        pendingProve.forEach(pp => {
            const provaId = getProvaId(pp);
            if (!proveMap[provaId]) {
                proveMap[provaId] = {
                    id: provaId,
                    titolo: pp.argomento || 'Prova non specificata',
                    data: pp.data,
                    materia: pp.materia,
                    tipo: pp.tipo,
                    voti: {}
                };
            }
        });

        return Object.values(proveMap).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [evaluations, pendingProve, selectedClass, students]);

    const atRiskStudents = useMemo(() => {
        return filteredStudents.filter(s => {
            const { grade } = calculatePerformance(s.id, 'Complessivo', evaluations);
            return grade && parseFloat(grade) < 6;
        });
    }, [filteredStudents, evaluations]);

    const handleSaveNewProva = (newProva: PendingProva) => {
        setPendingProve(prev => [...prev, newProva]);
    };

    const handleSaveUnifiedEvaluation = (studentId: string, prova: Prova, data: { grade: string; competencyEvals: Record<string, string> }) => {
        const { grade, competencyEvals } = data;
        const existingEval = prova.voti[studentId];
        if (grade === '') {
            if (existingEval) {
                setEvaluations((prev: Valutazione[]) => prev.filter(e => e.id !== existingEval.id));
            }
        } else {
            if (existingEval) {
                setEvaluations((prev: Valutazione[]) => prev.map(e => (e.id === existingEval.id ? { ...e, voto: grade } : e)));
            } else {
                const newEval: Valutazione = {
                    id: `eval-${Date.now()}`,
                    studenteId: studentId,
                    materia: prova.materia,
                    data: prova.data,
                    tipo: prova.tipo,
                    argomento: prova.titolo,
                    voto: grade,
                };
                setEvaluations((prev: Valutazione[]) => [...prev, newEval]);
            }
        }

        setCompetencyEvaluations((prev: ValutazioneCompetenza[]) => {
            const otherEvals = prev.filter(e => !(e.studenteId === studentId && e.provaId === prova.id));
            const newEvalsForProva = Object.entries(competencyEvals).map(([competenzaId, livelloId]) => ({
                id: `comp-eval-${Date.now()}-${competenzaId}`,
                studenteId: studentId,
                competenzaId,
                livelloId,
                materia: prova.materia,
                data: prova.data,
                provaId: prova.id,
            }));
            return [...otherEvals, ...newEvalsForProva];
        });

        setEditingUnified(null);
    };

    const handleBackFromProfile = () => {
        setViewingStudent(null);
        if (initialStudentId && onClearInitialStudent) {
            onClearInitialStudent();
        }
    };


    if (viewingStudent) {
        return <StudentProfile
            student={viewingStudent}
            evaluations={evaluations.filter(e => e.studenteId === viewingStudent.id)}
            competencyEvaluations={competencyEvaluations.filter(e => e.studenteId === viewingStudent.id)}
            settings={settings}
            aiSettings={aiSettings}
            onBack={handleBackFromProfile}
            onDeleteEvaluation={(id: string) => setEvaluations((e: Valutazione[]) => e.filter(ev => ev.id !== id))}
            onOpenInclusionPlanEditor={onOpenInclusionPlanEditor}
        />;
    }

    const renderEvaluationGrid = () => (
        <div 
            className="table-container evaluation-grid-container aura-glass border-[var(--md-sys-color-outline-variant)]/20 overflow-hidden shadow-[var(--md-sys-elevation-level2)]" style={{ border: "1px solid var(--md-sys-color-outline)" }}
            style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
        >
            <table className="table evaluation-grid-table border-separate border-spacing-0">
                <thead>
                    <tr className="bg-[var(--md-sys-color-surface-container-low)]/50 backdrop-blur-md">
                        <th className="sticky-col-student z-20 bg-[var(--md-sys-color-surface-container-low)]/80 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/20" style={{ borderBottom: "1px solid var(--md-sys-color-outline)", borderRight: "1px solid var(--md-sys-color-outline)" }}>
                            <div className="pl-4 m3-label-tiny" style={{ paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)" }}>Studente</div>
                        </th>
                        <th className="z-10 border-[var(--md-sys-color-outline-variant)]/20 m3-label-tiny" style={{ textAlign: "center", width: "5rem", borderBottom: "1px solid var(--md-sys-color-outline)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)" }}>Media</th>
                        <th className="z-10 border-[var(--md-sys-color-outline-variant)]/20 m3-label-tiny" style={{ textAlign: "center", width: "5rem", borderBottom: "1px solid var(--md-sys-color-outline)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)" }}>Trend</th>
                        {prove.map(p => (
                            <th key={p.id} className="min-w-[140px] border-[var(--md-sys-color-outline-variant)]/20" style={{ textAlign: "center", borderBottom: "1px solid var(--md-sys-color-outline)", padding: "var(--md-sys-spacing-6)" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    <div className="bg-primary/10 px-3 py-1 border-primary/20" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-4)", borderRadius: "9999px", border: "1px solid var(--md-sys-color-outline)" }}>
                                        <span className="material-symbols-outlined m3-icon-xs" style={{ color: "var(--md-sys-color-primary)" }}>{getTestTypeIcon(p.tipo)}</span>
                                        <span className="m3-label-tiny" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)" }}>{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                    <span className="max-w-[120px] m3-label-small text-[var(--md-sys-color-on-surface)]" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "-0.005em" }} title={p.titolo}>{p.titolo}</span>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && <th className="text-[var(--md-sys-color-on-surface)]-variant border-[var(--md-sys-color-outline-variant)]/20" style={{ textAlign: "center", fontWeight: "normal", borderBottom: "1px solid var(--md-sys-color-outline)" }}>Nessuna prova</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                    {filteredStudents.map(student => {
                        const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                        const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-[var(--md-sys-color-on-surface)]-variant';
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                        return (
                            <tr key={student.id} className="hover:bg-primary/5 group" style={{ transition: "color 300ms" }}>
                                <td className="sticky-col-student bg-[var(--md-sys-color-surface-container-low)]/90 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/10 z-10" style={{ borderRight: "1px solid var(--md-sys-color-outline)" }}>
                                    <div
                                        className="py-3 pl-4" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", cursor: "pointer" }}
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" className="ring-2 ring-primary/10 group-hover:ring-primary/30" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }} />
                                        <div className="text-[var(--md-sys-color-on-surface)] group-hover:text-primary" style={{ fontWeight: "bold", fontSize: "0.875rem", transition: "color 300ms" }}>
                                            {student.cognome} {student.nome}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textAlign: "center", fontWeight: "900", fontSize: "1rem" }}>
                                    {performance.grade ? (
                                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] ${parseFloat(performance.grade) < 6 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {performance.trend && <span className={`material-symbols-outlined ${trendClass} text-xl`}>{trendIcon}</span>}
                                </td>
                                {prove.map(p => {
                                    const hasCompetencies = competencyEvaluations.some(ce => ce.studenteId === student.id && ce.provaId === p.id);
                                    const evalData = p.voti[student.id];
                                    const voteValue = evalData?.voto;
                                    const isNegative = voteValue && !isNaN(parseFloat(voteValue)) && parseFloat(voteValue) < 6;

                                    return (
                                        <td
                                            key={p.id}
                                            className="relative hover:bg-primary/10" style={{ textAlign: "center", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", padding: "var(--md-sys-spacing-8)" }}
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div className={`grade-badge-m3 ${isNegative ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'} w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center mx-auto font-black text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div className="rounded-[var(--md-sys-shape-corner-small)] border-2 border-dashed border-[var(--md-sys-color-outline-variant)]/20" style={{ width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto" }}>
                                                    <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant/20" style={{ fontSize: "0.875rem" }}>add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <span className="absolute top-2 right-2 shadow-sm ring-2 ring-surface" style={{ width: "0.5rem", height: "0.5rem", backgroundColor: "var(--md-sys-color-tertiary)", borderRadius: "9999px" }} title="Competenze valutate"></span>
                                            )}
                                        </td>
                                    )
                                })}
                                {prove.length === 0 && <td className="text-[var(--md-sys-color-on-surface)]-variant" style={{ textAlign: "center" }}>-</td>}
                            </tr>
                        )
                    })}
                    {filteredStudents.length === 0 && (
                        <tr><td colSpan={prove.length + 3} style={{ padding: "var(--md-sys-spacing-8)", textAlign: "center" }}>
                            <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-[var(--md-sys-color-on-surface)]-variant';
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div 
                        key={student.id} 
                        className="aura-glass hover:ring-2 hover:ring-primary/30 group relative overflow-hidden" style={{ padding: "var(--md-sys-spacing-6)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }}
                        onClick={() => setViewingStudent(student)}
                    >
                        <div className="absolute top-0 right-0 bg-primary/5 -mr-12 -mt-12 group-hover:scale-150 duration-500" style={{ width: "6rem", height: "6rem", borderRadius: "9999px", transition: "transform 300ms" }}></div>
                        
                        <div className="gap-5 relative z-10" style={{ display: "flex", alignItems: "center" }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="ring-2 ring-white/20" />
                            <div style={{ flexGrow: "1", minWidth: "0" }}>
                                <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "1.125rem", letterSpacing: "-0.005em" }}>{student.cognome} {student.nome}</h3>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginTop: "var(--md-sys-spacing-4)" }}>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isInsufficient ? 'bg-error/10 text-error border border-error/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${trendClass}`}>
                                            <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant/40 group-hover:text-primary group-hover:translate-x-1" style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>chevron_right</span>
                        </div>
                    </div>
                );
            })}
            {filteredStudents.length === 0 && (
                <div className="col-span-full">
                    <EmptyState title="Nessuno studente" description="Aggiungi studenti alla classe." icon="group_off" />
                </div>
            )}
        </div>
    );

    const renderRiskView = () => (
        <div className="md:grid-cols-2 lg:grid-cols-3" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}>
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        className="aura-glass overflow-hidden border-error relative group" style={{ borderLeft: "4px solid" }}
                    >
                        <div className="absolute top-0 right-0 group-hover:opacity-20" style={{ padding: "var(--md-sys-spacing-8)", opacity: "0.1", transition: "opacity 300ms" }}>
                            <span className="material-symbols-outlined text-6xl" style={{ color: "var(--md-sys-color-error)" }}>warning</span>
                        </div>

                        <div className="relative z-10" style={{ padding: "var(--md-sys-spacing-6)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "var(--md-sys-spacing-6)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="ring-2 ring-error/20" />
                                    <div>
                                        <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", fontSize: "1.125rem", letterSpacing: "-0.005em" }}>{student.cognome} {student.nome}</h3>
                                        <p className="text-[10px] tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.6" }}>Classe {student.classe}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-error/10 rounded-[var(--md-sys-shape-corner-large)] border-error/20" style={{ color: "var(--md-sys-color-error)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid var(--md-sys-color-outline)", marginBottom: "var(--md-sys-spacing-6)", display: "inline-block" }}>
                                Media insufficiente: {grade}
                            </div>

                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-8)", fontWeight: "500", lineHeight: "1.625" }}>
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </p>

                            <div style={{ display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }} 
                                    className="py-3 bg-error text-white rounded-[var(--md-sys-shape-corner-large)] text-[10px] shadow-[var(--md-sys-elevation-level2)] shadow-error/20 hover:bg-error/90" style={{ flexGrow: "1", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                >
                                    Piano Inclusione
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }} 
                                    className="px-6 py-3 bg-[var(--md-sys-color-surface-container-high)]est/50 text-[var(--md-sys-color-on-surface)] rounded-[var(--md-sys-shape-corner-large)] text-[10px] hover:bg-[var(--md-sys-color-surface-container-high)]est" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div className="col-span-full">
                    <div className="aura-glass p-12" style={{ textAlign: "center" }}>
                        <span className="material-symbols-outlined text-6xl" style={{ color: "var(--md-sys-color-tertiary)", marginBottom: "var(--md-sys-spacing-8)", opacity: "0.4" }}>verified_user</span>
                        <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900" }}>Nessuna criticit�</h3>
                        <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ marginTop: "var(--md-sys-spacing-4)" }}>Tutti gli studenti mantengono una media sufficiente.</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="page-layout px-6 pb-32" style={{ maxWidth: "100%", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
            <div className="lg:flex-row lg:items-center py-16" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--md-sys-spacing-8)" }}>
                <div>
                    <h1 className="m3-headline-large text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Registro Valutazioni</h1>
                    <p className="m3-title-medium text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "500", marginTop: "var(--md-sys-spacing-4)", opacity: "0.7" }}>Gestione voti, competenze e monitoraggio performance</p>
                </div>

                <div className="aura-glass rounded-[2rem]" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-6)" }}>
                    <div className="bg-[var(--md-sys-color-surface-container-low)]/50 rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/20" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", border: "1px solid var(--md-sys-color-outline)" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)", fontSize: "1.25rem" }}>class</span>
                        <select 
                            id="class-select" 
                            value={selectedClass} 
                            onChange={e => setSelectedClass(e.target.value)} 
                            className="text-[var(--md-sys-color-on-surface)] outline-none min-w-[80px]" style={{ backgroundColor: "transparent", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
                        >
                            {userClasses.map(c => <option key={c} value={c} className="text-[var(--md-sys-color-on-surface)]" style={{ backgroundColor: "var(--md-sys-color-surface)" }}>{c}</option>)}
                        </select>
                    </div>
                    
                    <div style={{ display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                        <button onClick={() => setIsAddProvaModalOpen(true)} className="px-6 py-3 rounded-[var(--md-sys-shape-corner-large)] text-[10px] shadow-[var(--md-sys-elevation-level2)] shadow-primary/20 hover:scale-105" style={{ backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>add</span>
                            Nuova Prova
                        </button>
                        <button onClick={() => setIsExportModalOpen(true)} className="px-6 py-3 bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)] rounded-[var(--md-sys-shape-corner-large)] text-[10px] hover:bg-[var(--md-sys-color-surface-container-high)]" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div className="aura-glass rounded-[2.5rem] overflow-hidden border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)]" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                <div className="border-[var(--md-sys-color-outline-variant)]/10 bg-surface/30 backdrop-blur-md" style={{ padding: "var(--md-sys-spacing-8)", borderBottom: "1px solid var(--md-sys-color-outline)" }}>
                    <div className="md:flex-row md:items-center" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--md-sys-spacing-6)" }}>
                        <div>
                            <h2 className="m3-title-large text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Valutazione Unificata</h2>
                            <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6", marginTop: "var(--md-sys-spacing-4)" }}>Griglia voti e competenze trasversali</p>
                        </div>
                        <div className="bg-[var(--md-sys-color-surface-container-low)]/50 p-1.5 rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/10" style={{ display: "flex", border: "1px solid var(--md-sys-color-outline)" }}>
                            {[
                                { id: 'grid', label: 'Griglia', icon: 'grid_on' },
                                { id: 'summary', label: 'Riepilogo', icon: 'analytics' },
                                { id: 'risk', label: 'Criticit�', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ViewTab)}
                                    className={`flex items-center gap-8 px-6 py-4.5 rounded-[var(--md-sys-shape-corner-medium)] font-black text-[10px] uppercase tracking-widest transition-all relative ${
                                        activeTab === tab.id 
                                        ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level2)] shadow-primary/20' 
                                        : 'text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]'
                                    }`}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] shadow-sm" style={{ width: "1.25rem", height: "1.25rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ padding: 'var(--md-sys-spacing-6)' }}>
                    {activeTab === 'grid' && renderEvaluationGrid()}
                    {activeTab === 'summary' && renderSummaryView()}
                    {activeTab === 'risk' && renderRiskView()}
                </div>
            </div>

            {isAddProvaModalOpen && (
                <AddProvaModal
                    disciplines={disciplines}
                    onClose={() => setIsAddProvaModalOpen(false)}
                    onSave={handleSaveNewProva}
                />
            )}

            {isExportModalOpen && (
                <ExportModal
                    onClose={() => setIsExportModalOpen(false)}
                    students={filteredStudents}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvaluations}
                    settings={settings}
                    selectedClass={selectedClass}
                    prove={prove}
                />
            )}

            {editingUnified && (
                <UnifiedEvaluationModal
                    student={editingUnified.student}
                    prova={editingUnified.prova}
                    settings={settings}
                    existingGrade={editingUnified.prova.voti[editingUnified.student.id]}
                    existingCompetencyEvals={competencyEvaluations.filter(
                        e => e.studenteId === editingUnified.student.id && e.provaId === editingUnified.prova.id
                    )}
                    onClose={() => setEditingUnified(null)}
                    onSave={(data) => handleSaveUnifiedEvaluation(editingUnified.student.id, editingUnified.prova, data)}
                />
            )}
        </div>
    );
};

export default React.memo(EvaluationModule);



