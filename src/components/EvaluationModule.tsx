// LEGACY - MD3 Non-compliant
import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, EvaluationModuleProps, Prova } from '../types';
import AddProvaModal from './AddProvaModal';
import StudentProfile from './StudentProfile';
import ExportModal from './ExportModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import UnifiedEvaluationModal from './UnifiedEvaluationModal';
import { useTheme } from '../theme/theme';
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
  const { layers } = useTheme();
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
             style={{border: "1px solid layers.sys.color.outline", borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
        >
            <table >
                <thead>
                    <tr style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50 }}>
                        <th style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/80 }} style={{borderBottom: "1px solid layers.sys.color.outline", borderRight: "1px solid layers.sys.color.outline"}}>
                            <div  style={{paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.primary"}}>Studente</div>
                        </th>
                        <th  style={{textAlign: "center", width: layers.ref.spacing['16'], borderBottom: "1px solid layers.sys.color.outline", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.primary"}}>Media</th>
                        <th  style={{textAlign: "center", width: layers.ref.spacing['16'], borderBottom: "1px solid layers.sys.color.outline", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.primary"}}>Trend</th>
                        {prove.map(p => (
                            <th key={p.id}  style={{textAlign: "center", borderBottom: "1px solid layers.sys.color.outline", padding: layers.ref.spacing['6']}}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    <div style={{ backgroundColor: sys.colors.primary/10 }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginBottom: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], border: "1px solid layers.sys.color.outline"}}>
                                        <span  style={{color: "layers.sys.color.primary"}}>{getTestTypeIcon(p.tipo)}</span>
                                        <span  style={{fontWeight: "900", color: "layers.sys.color.primary"}}>{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                    <span style={{ color:  layers.sys.color.onPrimary }} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "-0.005em" }} title={p.titolo}>{p.titolo}</span>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && <th style={{ color:  layers.sys.color.onSurfaceVariant }} style={{textAlign: "center", fontWeight: "normal", borderBottom: "1px solid layers.sys.color.outline"}}>Nessuna prova</th>}
                    </tr>
                </thead>
                <tbody >
                    {filteredStudents.map(student => {
                        const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                        const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-[var(--md-sys-color-onSurface)]-variant';
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                        return (
                            <tr key={student.id}  style={{ transition: "color 300ms" }}>
                                <td style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/90 }} style={{borderRight: "1px solid layers.sys.color.outline"}}>
                                    <div
                                         style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], cursor: "pointer"}}
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm"  style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }} />
                                        <div style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "bold", fontSize: "0.875rem", transition: "color 300ms" }}>
                                            {student.cognome} {student.nome}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textAlign: "center", fontWeight: "900", fontSize: layers.ref.spacing['4'] }}>
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
                                             style={{textAlign: "center", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", padding: layers.ref.spacing['8']}}
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div className={`grade-badge-m3 ${isNegative ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'} w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center mx-auto font-black text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div style={{ borderRadius: layers.ref.shape.corner.large }} style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto" }}>
                                                    <span style={{ color:  layers.sys.color.onSurfaceVariant/20 }} style={{ fontSize: "0.875rem" }}>add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <span  style={{width: "0.5rem", height: "0.5rem", backgroundColor: "layers.sys.color.tertiary", borderRadius: layers.ref.spacing['4']}} title="Competenze valutate"></span>
                                            )}
                                        </td>
                                    )
                                })}
                                {prove.length === 0 && <td style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ textAlign: "center" }}>-</td>}
                            </tr>
                        )
                    })}
                    {filteredStudents.length === 0 && (
                        <tr><td colSpan={prove.length + 3} style={{padding: layers.ref.spacing['8'], textAlign: "center"}}>
                            <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['6']}}>
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-[var(--md-sys-color-onSurface)]-variant';
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div 
                        key={student.id} 
                         style={{padding: layers.ref.spacing['6'], transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer"}}
                        onClick={() => setViewingStudent(student)}
                    >
                        <div style={{ backgroundColor: sys.colors.primary/5 }} style={{ width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], borderRadius: layers.ref.spacing['4'], transition: "transform 300ms" }}></div>
                        
                        <div  style={{ display: "flex", alignItems: "center" }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg"  />
                            <div style={{ flexGrow: "1", minWidth: "0" }}>
                                <h3 style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "900", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "1.125rem", letterSpacing: "-0.005em" }}>{student.cognome} {student.nome}</h3>
                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8'], marginTop: layers.ref.spacing['4']}}>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isInsufficient ? 'bg-error/10 text-error border border-error/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${trendClass}`}>
                                            <span  style={{ fontSize: "0.875rem" }}>{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span style={{ color:  layers.sys.color.onSurfaceVariant/40 }} style={{ transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}>chevron_right</span>
                        </div>
                    </div>
                );
            })}
            {filteredStudents.length === 0 && (
                <div >
                    <EmptyState title="Nessuno studente" description="Aggiungi studenti alla classe." icon="group_off" />
                </div>
            )}
        </div>
    );

    const renderRiskView = () => (
        <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8']}}>
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                         style={{ borderLeft: "4px solid" }}
                    >
                        <div  style={{padding: layers.ref.spacing['8'], opacity: "0.1", transition: "opacity 300ms"}}>
                            <span style={{ color: "layers.sys.color.error" }}>warning</span>
                        </div>

                        <div  style={{padding: layers.ref.spacing['6']}}>
                            <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: layers.ref.spacing['6']}}>
                                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg"  />
                                    <div>
                                        <h3 style={{ color:  layers.sys.color.onPrimary, fontWeight: "900", fontSize: "1.125rem", letterSpacing: "-0.005em" }}>{student.cognome} {student.nome}</h3>
                                        <p style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", opacity: "0.6" }}>Classe {student.classe}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: sys.colors.error/10, borderRadius: layers.ref.shape.corner.large }} style={{color: "layers.sys.color.error", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], fontSize: "0.75rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid layers.sys.color.outline", marginBottom: layers.ref.spacing['6'], display: "inline-block"}}>
                                Media insufficiente: {grade}
                            </div>

                            <p style={{ color: layers.sys.color.onSurfaceVariant, marginBottom: layers.ref.spacing['8'], fontWeight: "500", lineHeight: "1.625" }}>
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </p>

                            <div style={{display: "flex", gap: layers.ref.spacing['6']}}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }}
                                    style={{ backgroundColor: sys.colors.error, color: sys.colors.white, borderRadius: layers.ref.shape.corner.large, flexGrow: "1", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                >
                                    Piano Inclusione
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }}
                                    style={{ backgroundColor:  layers.sys.color.surfaceContainerHighest/50, color:  layers.sys.color.onPrimary, borderRadius: layers.ref.shape.corner.large, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div >
                    <div style={{ padding: layers.ref.spacing['4'], textAlign: "center" }}>
                        <span style={{color: "layers.sys.color.tertiary", marginBottom: layers.ref.spacing['8'], opacity: "0.4"}}>verified_user</span>
                        <h3 style={{ color: layers.sys.color.onPrimary, fontWeight: "900" }}>Nessuna criticit�</h3>
                        <p style={{ color: layers.sys.color.onSurfaceVariant, marginTop: layers.ref.spacing['4'] }}>Tutti gli studenti mantengono una media sufficiente.</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div  style={{ maxWidth: "100%", marginLeft: "auto", marginRight: "auto", width: "100%" }}>
            <div  style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", gap: layers.ref.spacing['8']}}>
                <div>
                    <h1 style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Registro Valutazioni</h1>
                    <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{fontWeight: "500", marginTop: layers.ref.spacing['4'], opacity: "0.7"}}>Gestione voti, competenze e monitoraggio performance</p>
                </div>

                <div style={{ borderRadius: ref.shape[2] }} style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: layers.ref.spacing['8'], padding: layers.ref.spacing['6']}}>
                    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50, borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], border: "1px solid layers.sys.color.outline"}}>
                        <span  style={{color: "layers.sys.color.primary", fontSize: "1.25rem"}}>class</span>
                        <select 
                            id="class-select" 
                            value={selectedClass} 
                            onChange={e => setSelectedClass(e.target.value)} 
                            style={{ color:  layers.sys.color.onPrimary }} style={{ backgroundColor: "transparent", fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
                        >
                            {userClasses.map(c => <option key={c} value={c} style={{ color:  layers.sys.color.onPrimary }} style={{backgroundColor: "layers.sys.color.surface"}}>{c}</option>)}
                        </select>
                    </div>
                    
                    <div style={{display: "flex", gap: layers.ref.spacing['6']}}>
                        <button onClick={() => setIsAddProvaModalOpen(true)} style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: "layers.sys.color.primary", color: "layers.sys.color.on-primary", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <span  style={{ fontSize: "1.125rem" }}>add</span>
                            Nuova Prova
                        </button>
                        <button onClick={() => setIsExportModalOpen(true)} style={{ backgroundColor: layers.sys.color.surfaceContainerHighest, color: layers.sys.color.onPrimary, borderRadius: layers.ref.shape.corner.large, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: layers.ref.spacing['8']}}>
                            <span  style={{ fontSize: "1.125rem" }}>download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ borderRadius: ref.shape[25] }} style={{border: "1px solid layers.sys.color.outline"}}>
                <div style={{ backgroundColor: sys.colors.surface/30 }} style={{padding: layers.ref.spacing['8'], borderBottom: "1px solid layers.sys.color.outline"}}>
                    <div  style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: layers.ref.spacing['6']}}>
                        <div>
                            <h2 style={{ color:  layers.sys.color.onPrimary }} style={{ fontWeight: "900", letterSpacing: "-0.005em" }}>Valutazione Unificata</h2>
                            <p style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6", marginTop: layers.ref.spacing['4']}}>Griglia voti e competenze trasversali</p>
                        </div>
                        <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/50, padding: layers.ref.spacing['4'], borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", border: "1px solid layers.sys.color.outline"}}>
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
                                        : 'text-[var(--md-sys-color-onSurface)]-variant hover:bg-[var(--md-sys-color-surfaceContainerHigh)]'
                                    }`}
                                >
                                    <span  style={{ fontSize: "1.125rem" }}>{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <span style={{ backgroundColor: sys.colors.error, color: sys.colors.white, width: "1.25rem", height: "1.25rem", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{padding: layers.ref.spacing['6']}}>
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








