import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, TimetableSettings, Competenza, Livello, EvaluationModuleProps, Prova, RegisterEntry, Lezione } from '../types';
import AddProvaModal from './AddProvaModal';
import StudentProfile from './StudentProfile';
import ExportModal from './ExportModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import UnifiedEvaluationModal from './UnifiedEvaluationModal';
import Avatar from './Avatar';
import { InfoCard, EmptyState, TabGroup, M3Card, M3ListItem } from './M3Components';

type PendingProva = Omit<Valutazione, 'id' | 'studenteId' | 'voto'>;
type ViewTab = 'grid' | 'summary' | 'risk';

// FIX: Make lessons property required to match base interface
interface EvaluationModulePropsExtended extends EvaluationModuleProps {
    register?: RegisterEntry[];
    lessons: Record<string, Lezione>; // Changed to required
}

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

const EvaluationModule: React.FC<EvaluationModulePropsExtended> = ({ students, evaluations, setEvaluations, competencyEvaluations, setCompetencyEvaluations, userClasses, settings, aiSettings, isModalMode = false, initialClass, initialStudentId, onClearInitialStudent, onOpenInclusionPlanEditor, showGuidanceTips, register, lessons }) => {
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
            onBack={handleBackFromProfile}
            onDeleteEvaluation={(id: string) => setEvaluations((e: Valutazione[]) => e.filter(ev => ev.id !== id))}
            onDeleteCompetencyEvaluation={(id: string) => setCompetencyEvaluations((e: ValutazioneCompetenza[]) => e.filter(ev => ev.id !== id))}
            onOpenInclusionPlanEditor={onOpenInclusionPlanEditor}
            register={register}
            lessons={lessons}
        />;
    }

    const renderEvaluationGrid = () => (
        <div className="table-container evaluation-grid-container">
            <table className="table evaluation-grid-table">
                <thead>
                    <tr>
                        <th className="sticky-col-student z-20">
                            <div className="pl-2">Studente</div>
                        </th>
                        <th className="text-center z-10 w-20">Media</th>
                        <th className="text-center z-10 w-20">Trend</th>
                        {prove.map(p => (
                            <th key={p.id} className="text-center min-w-[120px]">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="flex items-center gap-2 mb-1 bg-surface-container px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-sm">{getTestTypeIcon(p.tipo)}</span>
                                        <span className="text-xs font-medium text-on-surface-variant">{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                    <span className="truncate max-w-[120px] text-sm font-medium" title={p.titolo}>{p.titolo}</span>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && <th className="text-center text-on-surface-variant font-normal">Nessuna prova</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => {
                        const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                        const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-on-surface-variant';
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                        return (
                            <tr key={student.id}>
                                <td className="sticky-col-student">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer py-1 pl-2"
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={student.nome} surname={student.cognome} size="small" />
                                        <div className="font-medium truncate max-w-[140px]">
                                            {student.cognome} {student.nome}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center font-bold text-lg">
                                    {performance.grade ? (
                                        <span className={parseFloat(performance.grade) < 6 ? 'text-error' : 'text-on-surface'}>
                                            {performance.grade}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="text-center">
                                    {performance.trend && <span className={`material-symbols-outlined ${trendClass} text-2xl`}>{trendIcon}</span>}
                                </td>
                                {prove.map(p => {
                                    const hasCompetencies = competencyEvaluations.some(ce => ce.studenteId === student.id && ce.provaId === p.id);
                                    const evalData = p.voti[student.id];
                                    const voteValue = evalData?.voto;
                                    const isNegative = voteValue && !isNaN(parseFloat(voteValue)) && parseFloat(voteValue) < 6;

                                    return (
                                        <td
                                            key={p.id}
                                            className="text-center relative cursor-pointer hover:bg-surface-container transition-colors"
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <span className={`grade-badge ${isNegative ? 'negative' : 'positive'}`}>
                                                    {voteValue}
                                                </span>
                                            ) : (
                                                <span className="text-on-surface-variant opacity-30">-</span>
                                            )}
                                            {hasCompetencies && (
                                                <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full shadow-sm ring-1 ring-surface" title="Competenze valutate"></span>
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
        <M3Card className="space-y-2">
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendClass = performance.trend === 'up' ? 'text-tertiary' : performance.trend === 'down' ? 'text-error' : 'text-on-surface-variant';
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                return (
                    <M3ListItem
                        key={student.id}
                        onClick={() => setViewingStudent(student)}
                        headline={`${student.cognome} ${student.nome}`}
                        supportingText={`Classe ${student.classe}`}
                        leadingElement={<Avatar name={student.nome} surname={student.cognome} size="medium" />}
                        trailingElement={
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-end md:items-center mt-2 md:mt-0">
                                <div className="flex items-center gap-2">
                                    <span className="m3-label-medium uppercase text-on-surface-variant md:hidden">Media:</span>
                                    <span className={`px-3 py-1 rounded-full font-bold ${parseFloat(performance.grade || '0') < 6 ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface'
                                        }`}>
                                        {performance.grade || 'N/D'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="m3-label-medium uppercase text-on-surface-variant md:hidden">Trend:</span>
                                    {performance.trend ? (
                                        <span className={`flex items-center gap-1 ${trendClass} font-medium`}>
                                            <span className="material-symbols-outlined">{trendIcon}</span>
                                            <span className="hidden md:inline">{performance.trend === 'up' ? 'Positivo' : performance.trend === 'down' ? 'Negativo' : 'Stabile'}</span>
                                        </span>
                                    ) : <span className="text-on-surface-variant">-</span>}
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                            </div>
                        }
                        className="hover:bg-surface-container-highest/30"
                    />
                );
            })}
            {filteredStudents.length === 0 && <EmptyState title="Nessuno studente" description="Aggiungi studenti alla classe." icon="group_off" />}
        </M3Card>
    );

    const renderRiskView = () => (
        <div className="risk-grid">
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <InfoCard
                        key={student.id}
                        title={`${student.cognome} ${student.nome}`}
                        description={`Media insufficiente: ${grade}. Considera l'attivazione di misure di recupero o un colloquio.`}
                        variant="error"
                        icon="warning"
                        action={
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }} className="button-small button-tonal rounded-lg hover:shadow-md transition-all">
                                    Piano Inclusione
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }} className="button-small button-outlined rounded-lg hover:shadow-md transition-all">
                                    Analizza
                                </button>
                            </div>
                        }
                    />
                )
            }) : (
                <div className="col-span-full">
                    <EmptyState
                        title="Ottimo lavoro!"
                        description="Nessuna situazione critica rilevata nella classe."
                        icon="check_circle"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="page-layout">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                <div className="page-header-title-group">
                    {!isModalMode && <h1 className="m3-display-small text-on-surface">Registro Valutazioni</h1>}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select id="class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="bg-surface-container-high text-on-surface font-bold px-4 py-2 rounded-xl border-none outline-none cursor-pointer">
                        {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex gap-2 ml-auto md:ml-0">
                        <button onClick={() => setIsAddProvaModalOpen(true)} className="button button-filled rounded-xl hover:shadow-md transition-all">
                            <span className="material-symbols-outlined md:mr-2">add</span>
                            <span className="hidden md:inline">Nuova Prova</span>
                        </button>
                        <button onClick={() => setIsExportModalOpen(true)} className="button button-outlined rounded-xl hover:shadow-md transition-all">
                            <span className="material-symbols-outlined md:mr-2">download</span>
                            <span className="hidden md:inline">Esporta</span>
                        </button>
                    </div>
                </div>
            </div>

            <InfoCard
                title="Valutazione Unificata"
                description="Clicca su una cella della griglia per aprire il pannello di valutazione. Puoi inserire simultaneamente il voto numerico e i livelli delle competenze trasversali."
                variant="secondary"
                icon="ballot"
                className="mb-4"
            />

            {/* Centralized View Tabs */}
            <TabGroup
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as any)}
                variant="secondary"
                className="mb-4"
                tabs={[
                    { id: 'grid', label: 'Griglia Voti', icon: 'grid_on' },
                    { id: 'summary', label: 'Riepilogo', icon: 'view_list' },
                    { id: 'risk', label: 'Criticità', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                ]}
            />

            <div>
                {activeTab === 'grid' && renderEvaluationGrid()}
                {activeTab === 'summary' && renderSummaryView()}
                {activeTab === 'risk' && renderRiskView()}
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

export default EvaluationModule;
