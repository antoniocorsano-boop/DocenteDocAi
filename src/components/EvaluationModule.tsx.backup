import React, { useState, useMemo } from 'react';
import { Studente, Valutazione, ValutazioneCompetenza, EvaluationModuleProps, Prova } from '../types';
import AddProvaModal from './AddProvaModal';
import StudentProfile from './StudentProfile';
import ExportModal from './ExportModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import UnifiedEvaluationModal from './UnifiedEvaluationModal';
import { M3Typography, EmptyState, Avatar } from './ui';

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
            style={{
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-medium)'
            }}
        >
            <table>
                <thead>
                    <tr style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                        <th
                            style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderBottom: '1px solid var(--md-sys-color-outline)',
                                borderRight: '1px solid var(--md-sys-color-outline)',
                                padding: 'var(--md-sys-spacing-4)'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--md-sys-color-primary)' }}>Studente</M3Typography>
                        </th>
                        <th
                            style={{
                                textAlign: 'center',
                                width: 'var(--md-sys-spacing-16)',
                                borderBottom: '1px solid var(--md-sys-color-outline)',
                                padding: 'var(--md-sys-spacing-4)'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--md-sys-color-primary)' }}>Media</M3Typography>
                        </th>
                        <th
                            style={{
                                textAlign: 'center',
                                width: 'var(--md-sys-spacing-16)',
                                borderBottom: '1px solid var(--md-sys-color-outline)',
                                padding: 'var(--md-sys-spacing-4)'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--md-sys-color-primary)' }}>Trend</M3Typography>
                        </th>
                        {prove.map(p => (
                            <th
                                key={p.id}
                                style={{
                                    textAlign: 'center',
                                    borderBottom: '1px solid var(--md-sys-color-outline)',
                                    padding: 'var(--md-sys-spacing-6)'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'var(--md-sys-color-primary-container)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--md-sys-spacing-2)',
                                            marginBottom: 'var(--md-sys-spacing-1)',
                                            borderRadius: 'var(--md-sys-shape-corner-small)',
                                            border: '1px solid var(--md-sys-color-outline)',
                                            padding: 'var(--md-sys-spacing-1)'
                                        }}
                                    >
                                        <span style={{ color: 'var(--md-sys-color-on-primary-container)', fontSize: '1.125rem' }}>{getTestTypeIcon(p.tipo)}</span>
                                        <M3Typography variant="label-small" style={{ fontWeight: '900', color: 'var(--md-sys-color-on-primary-container)' }}>{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</M3Typography>
                                    </div>
                                    <M3Typography
                                        variant="body-small"
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '-0.005em',
                                            color: 'var(--md-sys-color-on-surface)'
                                        }}
                                        title={p.titolo}
                                    >
                                        {p.titolo}
                                    </M3Typography>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && (
                            <th style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', fontWeight: 'normal', borderBottom: '1px solid var(--md-sys-color-outline)', padding: 'var(--md-sys-spacing-4)' }}>
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
                            <tr key={student.id} style={{ transition: 'color 300ms' }}>
                                <td
                                    style={{
                                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                        borderRight: '1px solid var(--md-sys-color-outline)',
                                        padding: 'var(--md-sys-spacing-4)'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--md-sys-spacing-3)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        <M3Typography variant="body-medium" style={{ fontWeight: 'bold', fontSize: '0.875rem', transition: 'color 300ms', color: 'var(--md-sys-color-on-surface)' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: '900', fontSize: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-4)' }}>
                                    {performance.grade ? (
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                backgroundColor: parseFloat(performance.grade) < 6 ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-primary-container)',
                                                color: parseFloat(performance.grade) < 6 ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-primary-container)'
                                            }}
                                        >
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-4)' }}>
                                    {performance.trend && (
                                        <span
                                            style={{
                                                fontSize: '1.5rem',
                                                color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)'
                                            }}
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
                                            style={{
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                                padding: 'var(--md-sys-spacing-2)'
                                            }}
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div
                                                    style={{
                                                        width: '2.5rem',
                                                        height: '2.5rem',
                                                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.875rem',
                                                        backgroundColor: isNegative ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-secondary-container)',
                                                        color: isNegative ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-secondary-container)',
                                                        boxShadow: 'var(--md-sys-elevation-level1)'
                                                    }}
                                                >
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 'var(--md-sys-spacing-4)',
                                                        height: 'var(--md-sys-spacing-4)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                                        border: '1px solid var(--md-sys-color-outline-variant)'
                                                    }}
                                                >
                                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.875rem' }}>add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <div
                                                    style={{
                                                        width: '0.5rem',
                                                        height: '0.5rem',
                                                        backgroundColor: 'var(--md-sys-color-tertiary)',
                                                        borderRadius: 'var(--md-sys-shape-corner-small)',
                                                        margin: 'var(--md-sys-spacing-1) auto 0'
                                                    }}
                                                    title="Competenze valutate"
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                                {prove.length === 0 && <td style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', padding: 'var(--md-sys-spacing-4)' }}>-</td>}
                            </tr>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <tr>
                            <td colSpan={prove.length + 3} style={{ padding: 'var(--md-sys-spacing-2)', textAlign: 'center' }}>
                                <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--md-sys-spacing-3)' }}>
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div
                        key={student.id}
                        style={{
                            padding: 'var(--md-sys-spacing-3)',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            border: '1px solid var(--md-sys-color-outline-variant)'
                        }}
                        onClick={() => setViewingStudent(student)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                            <div style={{ flexGrow: '1', minWidth: '0' }}>
                                <M3Typography variant="headline-small" style={{ fontWeight: '900', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.005em', color: 'var(--md-sys-color-on-surface)' }}>
                                    {student.cognome} {student.nome}
                                </M3Typography>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginTop: 'var(--md-sys-spacing-1)' }}>
                                    <div
                                        style={{
                                            padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                            borderRadius: 'var(--md-sys-shape-corner-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: '900',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            backgroundColor: isInsufficient ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-primary-container)',
                                            color: isInsufficient ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-primary-container)',
                                            border: `1px solid ${isInsufficient ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)'}`
                                        }}
                                    >
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--md-sys-spacing-1)',
                                                fontSize: '0.625rem',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                color: performance.trend === 'up' ? 'var(--md-sys-color-tertiary)' : performance.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.875rem' }}>{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', fontSize: '1.5rem' }}>chevron_right</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--md-sys-spacing-2)' }}>
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        style={{
                            borderLeft: '4px solid var(--md-sys-color-error)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            backgroundColor: 'var(--md-sys-color-surface-container-low)'
                        }}
                    >
                        <div style={{ padding: 'var(--md-sys-spacing-2)', opacity: '0.1', transition: 'opacity 300ms' }}>
                            <span style={{ color: 'var(--md-sys-color-error)', fontSize: '1.5rem' }}>warning</span>
                        </div>

                        <div style={{ padding: 'var(--md-sys-spacing-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                                    <div>
                                        <M3Typography variant="headline-small" style={{ fontWeight: '900', letterSpacing: '-0.005em', color: 'var(--md-sys-color-on-surface)' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                        <M3Typography variant="body-small" style={{ fontWeight: '900', textTransform: 'uppercase', opacity: '0.6', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                            Classe {student.classe}
                                        </M3Typography>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: 'var(--md-sys-color-error-container)',
                                    color: 'var(--md-sys-color-on-error-container)',
                                    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                    fontSize: '0.75rem',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    marginBottom: 'var(--md-sys-spacing-3)',
                                    display: 'inline-block'
                                }}
                            >
                                Media insufficiente: {grade}
                            </div>

                            <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-2)', fontWeight: '500', lineHeight: '1.625' }}>
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </M3Typography>

                            <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }}
                                    style={{
                                        backgroundColor: 'var(--md-sys-color-error)',
                                        color: 'var(--md-sys-color-on-error)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        flexGrow: '1',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                        border: 'none'
                                    }}
                                >
                                    Piano Inclusione
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }}
                                    style={{
                                        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                        color: 'var(--md-sys-color-on-surface)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                        border: 'none'
                                    }}
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div style={{ padding: 'var(--md-sys-spacing-4)', textAlign: 'center' }}>
                    <span style={{ color: 'var(--md-sys-color-tertiary)', marginBottom: 'var(--md-sys-spacing-2)', opacity: '0.4', fontSize: '3rem' }}>verified_user</span>
                    <M3Typography variant="headline-small" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: '900' }}>Nessuna criticità</M3Typography>
                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--md-sys-spacing-1)' }}>
                        Tutti gli studenti mantengono una media sufficiente.
                    </M3Typography>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-2)' }}>
                <div>
                    <M3Typography variant="headline-large" style={{ fontWeight: '900', letterSpacing: '-0.005em', color: 'var(--md-sys-color-on-surface)' }}>
                        Registro Valutazioni
                    </M3Typography>
                    <M3Typography variant="body-large" style={{ fontWeight: '500', marginTop: 'var(--md-sys-spacing-1)', opacity: '0.7', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Gestione voti, competenze e monitoraggio performance
                    </M3Typography>
                </div>

                <div
                    style={{
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-2)',
                        padding: 'var(--md-sys-spacing-3)',
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        border: '1px solid var(--md-sys-color-outline)'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-2)',
                            padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                            border: '1px solid var(--md-sys-color-outline)'
                        }}
                    >
                        <span style={{ color: 'var(--md-sys-color-primary)', fontSize: '1.25rem' }}>class</span>
                        <select
                            id="class-select"
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            style={{
                                color: 'var(--md-sys-color-on-surface)',
                                backgroundColor: 'transparent',
                                fontWeight: '900',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {userClasses.map(c => (
                                <option
                                    key={c}
                                    value={c}
                                    style={{
                                        color: 'var(--md-sys-color-on-surface)',
                                        backgroundColor: 'var(--md-sys-color-surface)'
                                    }}
                                >
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)' }}>
                        <button
                            onClick={() => setIsAddProvaModalOpen(true)}
                            style={{
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'var(--md-sys-color-primary)',
                                color: 'var(--md-sys-color-on-primary)',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-2)',
                                padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                border: 'none'
                            }}
                        >
                            <span style={{ fontSize: '1.125rem' }}>add</span>
                            Nuova Prova
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                color: 'var(--md-sys-color-on-surface)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--md-sys-spacing-2)',
                                padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                border: 'none'
                            }}
                        >
                            <span style={{ fontSize: '1.125rem' }}>download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div
                style={{
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: '1px solid var(--md-sys-color-outline)',
                    backgroundColor: 'var(--md-sys-color-surface)'
                }}
            >
                <div
                    style={{
                        padding: 'var(--md-sys-spacing-2)',
                        borderBottom: '1px solid var(--md-sys-color-outline)',
                        backgroundColor: 'var(--md-sys-color-surface-container-low)'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--md-sys-spacing-3)' }}>
                        <div>
                            <M3Typography variant="headline-medium" style={{ fontWeight: '900', letterSpacing: '-0.005em', color: 'var(--md-sys-color-on-surface)' }}>
                                Valutazione Unificata
                            </M3Typography>
                            <M3Typography variant="body-small" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: '0.6', marginTop: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                Griglia voti e competenze trasversali
                            </M3Typography>
                        </div>
                        <div
                            style={{
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                padding: 'var(--md-sys-spacing-1)',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                display: 'flex',
                                border: '1px solid var(--md-sys-color-outline)'
                            }}
                        >
                            {[
                                { id: 'grid', label: 'Griglia', icon: 'grid_on' },
                                { id: 'summary', label: 'Riepilogo', icon: 'analytics' },
                                { id: 'risk', label: 'Criticità', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ViewTab)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--md-sys-spacing-2)',
                                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                                        fontWeight: '900',
                                        fontSize: '0.625rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        backgroundColor: activeTab === tab.id ? 'var(--md-sys-color-primary)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                                        border: 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ fontSize: '1.125rem' }}>{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <div
                                            style={{
                                                backgroundColor: 'var(--md-sys-color-error)',
                                                color: 'var(--md-sys-color-on-error)',
                                                width: '1.25rem',
                                                height: '1.25rem',
                                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                position: 'absolute',
                                                top: '-0.5rem',
                                                right: '-0.5rem'
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








