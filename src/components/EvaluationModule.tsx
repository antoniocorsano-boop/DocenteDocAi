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
            className="table-container evaluation-grid-container aura-glass border border-outline-variant/20 overflow-hidden shadow-lg"
            style={{ borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))' }}
        >
            <table className="table evaluation-grid-table border-separate border-spacing-0">
                <thead>
                    <tr className="bg-surface-container-low/50 backdrop-blur-md">
                        <th className="sticky-col-student z-20 bg-surface-container-low/80 backdrop-blur-xl border-b border-r border-outline-variant/20">
                            <div className="pl-4 py-4 font-black uppercase tracking-widest m3-label-tiny text-primary">Studente</div>
                        </th>
                        <th className="text-center z-10 w-20 border-b border-outline-variant/20 font-black uppercase tracking-widest m3-label-tiny text-primary">Media</th>
                        <th className="text-center z-10 w-20 border-b border-outline-variant/20 font-black uppercase tracking-widest m3-label-tiny text-primary">Trend</th>
                        {prove.map(p => (
                            <th key={p.id} className="text-center min-w-[140px] border-b border-outline-variant/20 p-6">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="flex items-center gap-8 mb-4 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                        <span className="material-symbols-outlined text-primary m3-icon-xs">{getTestTypeIcon(p.tipo)}</span>
                                        <span className="m3-label-tiny font-black text-primary">{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                    <span className="truncate max-w-[120px] m3-label-small font-bold text-on-surface uppercase tracking-tight" title={p.titolo}>{p.titolo}</span>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && <th className="text-center text-on-surface-variant font-normal border-b border-outline-variant/20">Nessuna prova</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                    {filteredStudents.map(student => {
                        const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                        const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-on-surface-variant';
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                        return (
                            <tr key={student.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="sticky-col-student bg-surface-container-low/90 backdrop-blur-xl border-r border-outline-variant/10 z-10">
                                    <div
                                        className="flex items-center gap-6 cursor-pointer py-3 pl-4"
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" className="ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all" />
                                        <div className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                                            {student.cognome} {student.nome}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center font-black text-base">
                                    {performance.grade ? (
                                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${parseFloat(performance.grade) < 6 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="text-center">
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
                                            className="text-center relative cursor-pointer hover:bg-primary/10 transition-all p-8"
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div className={`grade-badge-m3 ${isNegative ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'} w-10 h-10 rounded-xl flex items-center justify-center mx-auto font-black text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg border-2 border-dashed border-outline-variant/20 flex items-center justify-center mx-auto">
                                                    <span className="material-symbols-outlined text-on-surface-variant/20 text-sm">add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full shadow-sm ring-2 ring-surface" title="Competenze valutate"></span>
                                            )}
                                        </td>
                                    )
                                })}
                                {prove.length === 0 && <td className="text-center text-on-surface-variant">-</td>}
                            </tr>
                        )
                    })}
                    {filteredStudents.length === 0 && (
                        <tr><td colSpan={prove.length + 3} className="p-8 text-center">
                            <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-on-surface-variant';
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div 
                        key={student.id} 
                        className="aura-glass p-6 hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => setViewingStudent(student)}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="flex items-center gap-5 relative z-10">
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="ring-2 ring-white/20" />
                            <div className="flex-grow min-w-0">
                                <h3 className="font-black text-on-surface truncate text-lg tracking-tight">{student.cognome} {student.nome}</h3>
                                <div className="flex items-center gap-8 mt-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isInsufficient ? 'bg-error/10 text-error border border-error/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${trendClass}`}>
                                            <span className="material-symbols-outlined text-sm">{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        className="aura-glass overflow-hidden border-l-4 border-error relative group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-error">warning</span>
                        </div>

                        <div className="p-6 relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-8">
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" className="ring-2 ring-error/20" />
                                    <div>
                                        <h3 className="font-black text-on-surface text-lg tracking-tight">{student.cognome} {student.nome}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Classe {student.classe}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-error/10 text-error px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-error/20 mb-6 inline-block">
                                Media insufficiente: {grade}
                            </div>

                            <p className="m3-body-medium text-on-surface-variant mb-8 font-medium leading-relaxed">
                                Situazione critica rilevata. Ãˆ consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </p>

                            <div className="flex gap-6">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }} 
                                    className="flex-grow py-3 bg-error text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-error/20 hover:bg-error/90 transition-all"
                                >
                                    Piano Inclusione
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }} 
                                    className="px-6 py-3 bg-surface-container-highest/50 text-on-surface rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }) : (
                <div className="col-span-full">
                    <div className="aura-glass p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-tertiary mb-8 opacity-40">verified_user</span>
                        <h3 className="m3-headline-small font-black text-on-surface">Nessuna criticità</h3>
                        <p className="m3-body-large text-on-surface-variant mt-4">Tutti gli studenti mantengono una media sufficiente.</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="page-layout max-w-full mx-auto w-full px-6 pb-32">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 py-16">
                <div>
                    <h1 className="m3-headline-large font-black text-on-surface tracking-tight">Registro Valutazioni</h1>
                    <p className="m3-title-medium text-on-surface-variant font-medium mt-4 opacity-70">Gestione voti, competenze e monitoraggio performance</p>
                </div>

                <div className="flex flex-wrap items-center gap-8 aura-glass p-6 rounded-[2rem]">
                    <div className="flex items-center gap-6 px-4 py-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
                        <span className="material-symbols-outlined text-primary text-xl">class</span>
                        <select 
                            id="class-select" 
                            value={selectedClass} 
                            onChange={e => setSelectedClass(e.target.value)} 
                            className="bg-transparent text-on-surface font-black text-xs uppercase tracking-widest border-none outline-none cursor-pointer min-w-[80px]"
                        >
                            {userClasses.map(c => <option key={c} value={c} className="bg-surface text-on-surface">{c}</option>)}
                        </select>
                    </div>
                    
                    <div className="flex gap-6">
                        <button onClick={() => setIsAddProvaModalOpen(true)} className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-8">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Nuova Prova
                        </button>
                        <button onClick={() => setIsExportModalOpen(true)} className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-high transition-all flex items-center gap-8">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div className="aura-glass rounded-[2.5rem] overflow-hidden border border-outline-variant/20 shadow-2xl">
                <div className="p-8 border-b border-outline-variant/10 bg-surface/30 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h2 className="m3-title-large font-black text-on-surface tracking-tight">Valutazione Unificata</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mt-4">Griglia voti e competenze trasversali</p>
                        </div>
                        <div className="flex bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10">
                            {[
                                { id: 'grid', label: 'Griglia', icon: 'grid_on' },
                                { id: 'summary', label: 'Riepilogo', icon: 'analytics' },
                                { id: 'risk', label: 'CriticitÃ ', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ViewTab)}
                                    className={`flex items-center gap-8 px-6 py-4.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative ${
                                        activeTab === tab.id 
                                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                                        : 'text-on-surface-variant hover:bg-surface-container-high'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] rounded-full flex items-center justify-center shadow-sm">
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

