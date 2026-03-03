import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, EvaluationModuleProps, Prova } from '../types';
import AddProvaModal from './AddProvaModal';
import StudentProfile from './StudentProfile';
import ExportModal from './ExportModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import UnifiedEvaluationModal from './UnifiedEvaluationModal';
import { M3Typography, EmptyState, Avatar } from './ui';
import './EvaluationModule.css';

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

    // MD3 Theme tokens

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
            style={{ overflowX: 'auto' }}
        >
            <table>
                <thead>
                    <tr>
                        <th
                            style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-2)' }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)' }}>Studente</M3Typography>
                        </th>
                        <th
                            style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-2)', textAlign: 'center' }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)' }}>Media</M3Typography>
                        </th>
                        <th
                            style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-2)', textAlign: 'center' }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)' }}>Trend</M3Typography>
                        </th>
                        {prove.map(p => (
                            <th
                                key={p.id}
                                style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-2)' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                    <div
                                        style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-1)', borderRadius: 'var(--md-sys-shape-corner-medium)', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}
                                    >
                                        <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>{getTestTypeIcon(p.tipo)}</span>
                                        <M3Typography variant="label-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-on-primary-container)' }}>{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</M3Typography>
                                    </div>
                                    <M3Typography
                                        variant="body-small"
                                        style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)', textAlign: 'center' }}
                                        title={p.titolo}
                                    >
                                        {p.titolo}
                                    </M3Typography>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && (
                            <th style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', color: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-2)' }}>
                                <M3Typography variant="body-medium">Nessuna prova</M3Typography>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => {
                        const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                        const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';

                        return (
                            <tr key={student.id} style={{ display: 'grid', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-medium)', backgroundColor: 'var(--md-sys-color-surface-container-low)', transition: 'background-color var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard)' }}>
                                <td
                                    style={{ padding: 'var(--md-sys-spacing-2)', verticalAlign: 'middle' }}
                                >
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer' }}
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" />
                                        <M3Typography variant="body-medium" style={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)', padding: 'var(--md-sys-spacing-2)' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)', transition: 'transform var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard)', cursor: 'pointer' }}>
                                    {performance.grade ? (
                                        <div
                                            style={{ display: 'inline-block', minWidth: 'var(--md-sys-spacing-8)', textAlign: 'center', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-small)', fontWeight: 'var(--md-sys-typescale-weight-bold)', backgroundColor: parseFloat(performance.grade) < 6 ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-primary-container)', color: parseFloat(performance.grade) < 6 ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-primary-container)' }}
                                        >
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {performance.trend && (
                                        <span
                                            style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)', color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }}
                                        >
                                            {trendIcon}
                                        </span>
                                    )}
                                </td>
                                {prove.map(p => {
                                    const hasCompetencies = competencyEvaluations.some(ce => ce.studenteId === student.id && ce.provaId === p.id);
                                    const evalData = p.voti[student.id];
                                    const voteValue = evalData?.voto;
                                    const isNegative = voteValue && !isNaN(parseFloat(voteValue)) && parseFloat(voteValue) < 6;

                                    return (
                                        <td
                                            key={p.id}
                                            style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)', color: 'var(--md-sys-color-on-surface)', transition: 'transform var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard)', cursor: 'pointer' }}
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div
                                                    style={{ display: 'inline-block', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-full)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textAlign: 'center', backgroundColor: isNegative ? 'var(--md-sys-color-error-container)' : parseFloat(voteValue) >= 9 ? 'var(--md-sys-color-tertiary-container)' : parseFloat(voteValue) >= 7 ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-secondary-container)', color: isNegative ? 'var(--md-sys-color-on-error-container)' : parseFloat(voteValue) >= 9 ? 'var(--md-sys-color-on-tertiary-container)' : parseFloat(voteValue) >= 7 ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-secondary-container)' }}
                                                >
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--md-sys-spacing-6)', height: 'var(--md-sys-spacing-6)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', cursor: 'pointer', fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}
                                                >
                                                    <span>add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <div
                                                    style={{ position: 'absolute', top: 'var(--md-sys-spacing-1)', right: 'var(--md-sys-spacing-1)', width: 'var(--md-sys-spacing-3)', height: 'var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-full)', backgroundColor: 'var(--md-sys-color-tertiary)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-surface)' }}
                                                    title="Competenze valutate"
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                                {prove.length === 0 && <td style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-2)' }}>-</td>}
                            </tr>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <tr>
                            <td colSpan={prove.length + 3} style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-8)' }}>
                                <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-card-width), var(--md-sys-grid-fr-1)))', gap: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-4)' }}>
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div
                        key={student.id}
                        style={{ padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-low)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', cursor: 'pointer' }}
                        onClick={() => setViewingStudent(student)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                            <div style={{ flex: 1 }}>
                                <M3Typography variant="headline-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', color: 'var(--md-sys-color-on-surface)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                                    {student.cognome} {student.nome}
                                </M3Typography>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)' }}>
                                    <div
                                        style={{ display: 'inline-block', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-full)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', backgroundColor: isInsufficient ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-primary-container)', color: isInsufficient ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-primary-container)' }}
                                    >
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div
                                            style={{ display: 'inline-block', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-full)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', backgroundColor: performance.trend === 'up' ? 'var(--md-sys-color-tertiary-container)' : performance.trend === 'down' ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-secondary-container)', color: performance.trend === 'up' ? 'var(--md-sys-color-on-tertiary-container)' : performance.trend === 'down' ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-secondary-container)' }}
                                        >
                                            <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>chevron_right</span>
                        </div>
                    </div>
                );
            })}
            {filteredStudents.length === 0 && (
                <div>
                    <EmptyState title="Nessuno studente" description="Aggiungi studenti alla classe." icon="group_off" />
                </div>
            )}
        </div>
    );

    const renderRiskView = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-4)' }}>
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        style={{ padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-error-container)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-error)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                            <span style={{ color: 'var(--md-sys-color-error)', fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>warning</span>
                        </div>

                        <div style={{ paddingTop: 'var(--md-sys-spacing-3)', borderTop: 'var(--md-sys-spacing-0) solid var(--md-sys-color-shadow)', marginTop: 'var(--md-sys-spacing-3)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                                    <div>
                                        <M3Typography variant="headline-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', color: 'var(--md-sys-color-on-error-container)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                        <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-error-container)', opacity: 'var(--md-sys-state-opacity-caption)' }}>
                                            Classe {student.classe}
                                        </M3Typography>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{ display: 'inline-block', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-full)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', backgroundColor: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)', marginBottom: 'var(--md-sys-spacing-3)' }}
                            >
                                Media insufficiente: {grade}
                            </div>

                            <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-error-container)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </M3Typography>

                            <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', marginTop: 'var(--md-sys-spacing-3)' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }}
                                    style={{ flex: 1, padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-medium)', backgroundColor: 'var(--md-sys-color-error)', color: 'var(--md-sys-color-on-error)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', border: 'none', cursor: 'pointer', transition: 'background-color var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard)' }}
                                >
                                    Piano Inclusione
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }}
                                    style={{ flex: 1, padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-medium)', backgroundColor: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', border: 'none', cursor: 'pointer', transition: 'background-color var(--md-sys-motion-duration-short-4) var(--md-sys-motion-easing-standard)' }}
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div style={{ padding: 'var(--md-sys-spacing-8)', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    <span style={{ fontSize: 'var(--md-sys-typescale-display-large-font-size)', color: 'var(--md-sys-color-tertiary)', marginBottom: 'var(--md-sys-spacing-4)', display: 'block' }}>verified_user</span>
                    <M3Typography variant="headline-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', color: 'var(--md-sys-color-on-surface)', marginBottom: 'var(--md-sys-spacing-2)' }}>Nessuna criticità</M3Typography>
                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>
                        Tutti gli studenti mantengono una media sufficiente.
                    </M3Typography>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: 'var(--md-sys-spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                <div>
                    <M3Typography variant="headline-large" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', letterSpacing: 'var(--md-sys-typescale-headline-large-tracking)', color: 'var(--md-sys-color-on-surface)' }}>
                        Registro Valutazioni
                    </M3Typography>
                    <M3Typography variant="body-large" style={{ fontWeight: 'var(--md-sys-typescale-weight-medium)', marginTop: 'var(--md-sys-spacing-1)', opacity: 'var(--md-sys-state-opacity-supporting)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Gestione voti, competenze e monitoraggio performance
                    </M3Typography>
                </div>

                <div
                    style={{ borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-3)', backgroundColor: 'var(--md-sys-color-surface-container-low)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}
                >
                    <div
                        style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}
                    >
                        <span style={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>class</span>
                        <select
                            id="class-select"
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            style={{ color: 'var(--md-sys-color-on-surface)', backgroundColor: 'transparent', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-body-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', border: 'none', cursor: 'pointer' }}
                        >
                            {userClasses.map(c => (
                                <option
                                    key={c}
                                    value={c}
                                    style={{ color: 'var(--md-sys-color-on-surface)', backgroundColor: 'var(--md-sys-color-surface)' }}
                                >
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)' }}>
                        <button
                            onClick={() => setIsAddProvaModalOpen(true)}
                            style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', border: 'none', cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>add</span>
                            Nuova Prova
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            style={{ backgroundColor: 'var(--md-sys-color-surface-container-highest)', color: 'var(--md-sys-color-on-surface)', borderRadius: 'var(--md-sys-shape-corner-large)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', border: 'none', cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div
                style={{ borderRadius: 'var(--md-sys-shape-corner-large)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)', backgroundColor: 'var(--md-sys-color-surface)' }}
            >
                <div
                    style={{ padding: 'var(--md-sys-spacing-2)', borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)', backgroundColor: 'var(--md-sys-color-surface-container-low)' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--md-sys-spacing-3)' }}>
                        <div>
                            <M3Typography variant="headline-medium" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', letterSpacing: 'var(--md-sys-typescale-headline-medium-tracking)', color: 'var(--md-sys-color-on-surface)' }}>
                                Valutazione Unificata
                            </M3Typography>
                            <M3Typography variant="body-small" style={{ fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', opacity: 'var(--md-sys-state-opacity-secondary)', marginTop: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                Griglia voti e competenze trasversali
                            </M3Typography>
                        </div>
                        <div
                            style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: 'var(--md-sys-spacing-1)', borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)' }}
                        >
                            {[
                                { id: 'grid', label: 'Griglia', icon: 'grid_on' },
                                { id: 'summary', label: 'Riepilogo', icon: 'analytics' },
                                { id: 'risk', label: 'Criticità', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ViewTab)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)', borderRadius: 'var(--md-sys-shape-corner-medium)', fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', backgroundColor: activeTab === tab.id ? 'var(--md-sys-color-primary)' : 'transparent', color: activeTab === tab.id ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)', border: 'none', cursor: 'pointer', position: 'relative' }}
                                >
                                    <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <div
                                            style={{
                                                backgroundColor: 'var(--md-sys-color-error)',
                                                color: 'var(--md-sys-color-on-error)',
                                                width: 'var(--md-sys-spacing-5)',
                                                height: 'var(--md-sys-spacing-5)',
                                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                                fontWeight: 'var(--md-sys-typescale-weight-bold)',
                                                position: 'absolute',
                                                top: 'calc(-1 * var(--md-sys-spacing-2))',
                                                right: 'calc(-1 * var(--md-sys-spacing-2))'
                                            }}
                                        >
                                            {tab.badge}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ padding: 'var(--md-sys-spacing-3)' }}>
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

