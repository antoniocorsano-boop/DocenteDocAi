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
            style={{
                border: '1px solid colors.outline',
                borderRadius: 'shape.corner.medium'
            }}
        >
            <table>
                <thead>
                    <tr style={{ backgroundColor: 'colors.surfaceContainerLow' }}>
                        <th
                            style={{
                                backgroundColor: 'colors.surfaceContainerLow',
                                borderBottom: '1px solid colors.outline',
                                borderRight: '1px solid colors.outline',
                                padding: 'spacing[4]'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'colors.primary' }}>Studente</M3Typography>
                        </th>
                        <th
                            style={{
                                textAlign: 'center',
                                width: 'spacing[16]',
                                borderBottom: '1px solid colors.outline',
                                padding: 'spacing[4]'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'colors.primary' }}>Media</M3Typography>
                        </th>
                        <th
                            style={{
                                textAlign: 'center',
                                width: 'spacing[16]',
                                borderBottom: '1px solid colors.outline',
                                padding: 'spacing[4]'
                            }}
                        >
                            <M3Typography variant="label-large" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'colors.primary' }}>Trend</M3Typography>
                        </th>
                        {prove.map(p => (
                            <th
                                key={p.id}
                                style={{
                                    textAlign: 'center',
                                    borderBottom: '1px solid colors.outline',
                                    padding: 'spacing[6]'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'colors.primaryContainer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'spacing[2]',
                                            marginBottom: 'spacing[1]',
                                            borderRadius: 'shape.corner.small',
                                            border: '1px solid colors.outline',
                                            padding: 'spacing[1]'
                                        }}
                                    >
                                        <span style={{ color: 'colors.onPrimaryContainer', fontSize: 'typescale.headlineSmall.fontSize' }}>{getTestTypeIcon(p.tipo)}</span>
                                        <M3Typography variant="label-small" style={{ fontWeight: '900', color: 'colors.onPrimaryContainer' }}>{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</M3Typography>
                                    </div>
                                    <M3Typography
                                        variant="body-small"
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: 'typescale.bodyLarge.tracking',
                                            color: 'colors.onSurface'
                                        }}
                                        title={p.titolo}
                                    >
                                        {p.titolo}
                                    </M3Typography>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && (
                            <th style={{ color: 'colors.onSurfaceVariant', textAlign: 'center', fontWeight: 'normal', borderBottom: '1px solid colors.outline', padding: 'spacing[4]' }}>
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
                                        backgroundColor: 'colors.surfaceContainerLow',
                                        borderRight: '1px solid colors.outline',
                                        padding: 'spacing[4]'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'spacing[3]',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        <M3Typography variant="body-medium" style={{ fontWeight: 'bold', fontSize: 'typescale.bodyMedium.fontSize', transition: 'color 300ms', color: 'colors.onSurface' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: '900', fontSize: 'spacing[4]', padding: 'spacing[4]' }}>
                                    {performance.grade ? (
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24',
                                                height: '24',
                                                borderRadius: 'shape.corner.medium',
                                                backgroundColor: parseFloat(performance.grade) < 6 ? 'colors.errorContainer' : 'colors.primaryContainer',
                                                color: parseFloat(performance.grade) < 6 ? 'colors.onErrorContainer' : 'colors.onPrimaryContainer'
                                            }}
                                        >
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td style={{ textAlign: 'center', padding: 'spacing[4]' }}>
                                    {performance.trend && (
                                        <span
                                            style={{
                                                fontSize: 'typescale.headlineMedium.fontSize',
                                                color: performance.trend === 'up' ? 'colors.tertiary' : performance.trend === 'down' ? 'colors.error' : 'colors.onSurfaceVariant'
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
                                                padding: 'spacing[2]'
                                            }}
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div
                                                    style={{
                                                        width: '24',
                                                        height: '24',
                                                        borderRadius: 'shape.corner.medium',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        fontWeight: 'bold',
                                                        fontSize: 'typescale.bodyMedium.fontSize',
                                                        backgroundColor: isNegative ? 'colors.errorContainer' : 'colors.secondaryContainer',
                                                        color: isNegative ? 'colors.onErrorContainer' : 'colors.onSecondaryContainer',
                                                        boxShadow: 'elevation.level1'
                                                    }}
                                                >
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 'spacing[4]',
                                                        height: 'spacing[4]',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        borderRadius: 'shape.corner.small',
                                                        backgroundColor: 'colors.surfaceContainerHighest',
                                                        border: '1px solid colors.outlineVariant'
                                                    }}
                                                >
                                                    <span style={{ color: 'colors.onSurfaceVariant', fontSize: 'typescale.bodyMedium.fontSize' }}>add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <div
                                                    style={{
                                                        width: '16',
                                                        height: '16',
                                                        backgroundColor: 'colors.tertiary',
                                                        borderRadius: 'shape.corner.small',
                                                        margin: 'spacing[1] auto 0'
                                                    }}
                                                    title="Competenze valutate"
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                                {prove.length === 0 && <td style={{ color: 'colors.onSurfaceVariant', textAlign: 'center', padding: 'spacing[4]' }}>-</td>}
                            </tr>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <tr>
                            <td colSpan={prove.length + 3} style={{ padding: 'spacing[2]', textAlign: 'center' }}>
                                <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'spacing[3]' }}>
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div
                        key={student.id}
                        style={{
                            padding: 'spacing[3]',
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderRadius: 'shape.corner.medium',
                            backgroundColor: 'colors.surfaceContainerLow',
                            border: '1px solid colors.outlineVariant'
                        }}
                        onClick={() => setViewingStudent(student)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                            <div style={{ flexGrow: '1', minWidth: '0' }}>
                                <M3Typography variant="headline-small" style={{ fontWeight: '900', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: 'typescale.headlineSmall.tracking', color: 'colors.onSurface' }}>
                                    {student.cognome} {student.nome}
                                </M3Typography>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'spacing[2]', marginTop: 'spacing[1]' }}>
                                    <div
                                        style={{
                                            padding: 'spacing[1] spacing[2]',
                                            borderRadius: 'shape.corner.full',
                                            fontSize: 'typescale.bodySmall.fontSize',
                                            fontWeight: '900',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            backgroundColor: isInsufficient ? 'colors.errorContainer' : 'colors.primaryContainer',
                                            color: isInsufficient ? 'colors.onErrorContainer' : 'colors.onPrimaryContainer',
                                            border: `1px solid ${isInsufficient ? 'colors.error' : 'colors.primary'}`
                                        }}
                                    >
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'spacing[1]',
                                                fontSize: 'typescale.labelSmall.fontSize',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                color: performance.trend === 'up' ? 'colors.tertiary' : performance.trend === 'down' ? 'colors.error' : 'colors.onSurfaceVariant'
                                            }}
                                        >
                                            <span style={{ fontSize: 'typescale.bodyMedium.fontSize' }}>{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: 'colors.onSurfaceVariant', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', fontSize: 'typescale.headlineMedium.fontSize' }}>chevron_right</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'spacing[2]' }}>
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        style={{
                            borderLeft: 'var(--md-sys-border-width-thick) solid var(--md-sys-color-error)',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            backgroundColor: 'var(--md-sys-color-surface-container-low)'
                        }}
                    >
                        <div style={{ padding: 'var(--md-sys-spacing-2)', opacity: '0.1', transition: 'opacity 300ms' }}>
                            <span style={{ color: 'var(--md-sys-color-error)', fontSize: 'var(--md-sys-typescale-headline-medium-font-size)' }}>warning</span>
                        </div>

                        <div style={{ padding: 'var(--md-sys-spacing-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--md-sys-spacing-3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                                    <div>
                                        <M3Typography variant="headline-small" style={{ fontWeight: '900', letterSpacing: 'typescale.headlineSmall.tracking', color: 'colors.onSurface' }}>
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                        <M3Typography variant="body-small" style={{ fontWeight: '900', textTransform: 'uppercase', opacity: '0.6', color: 'colors.onSurfaceVariant' }}>
                                            Classe {student.classe}
                                        </M3Typography>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: 'colors.errorContainer',
                                    color: 'colors.onErrorContainer',
                                    padding: 'spacing[1] spacing[2]',
                                    fontSize: 'typescale.bodySmall.fontSize',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRadius: 'shape.corner.small',
                                    border: '1px solid colors.outline',
                                    marginBottom: 'spacing[3]',
                                    display: 'inline-block'
                                }}
                            >
                                Media insufficiente: {grade}
                            </div>

                            <M3Typography variant="body-medium" style={{ color: 'colors.onSurfaceVariant', marginBottom: 'spacing[2]', fontWeight: '500', lineHeight: '1.625' }}>
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </M3Typography>

                            <div style={{ display: 'flex', gap: 'spacing[3]' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }}
                                    style={{
                                        backgroundColor: 'colors.error',
                                        color: 'colors.onError',
                                        borderRadius: 'shape.corner.large',
                                        flexGrow: '1',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        padding: 'spacing[2] spacing[3]',
                                        border: 'none'
                                    }}
                                >
                                    Piano Inclusione
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }}
                                    style={{
                                        backgroundColor: 'colors.surfaceContainerHighest',
                                        color: 'colors.onSurface',
                                        borderRadius: 'shape.corner.large',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        padding: 'spacing[2] spacing[3]',
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
                <div style={{ padding: 'spacing[4]', textAlign: 'center' }}>
                    <span style={{ color: 'colors.tertiary', marginBottom: 'spacing[2]', opacity: '0.4', fontSize: 'typescale.displaySmall.fontSize' }}>verified_user</span>
                    <M3Typography variant="headline-small" style={{ color: 'colors.onSurface', fontWeight: '900' }}>Nessuna criticità</M3Typography>
                    <M3Typography variant="body-medium" style={{ color: 'colors.onSurfaceVariant', marginTop: 'spacing[1]' }}>
                        Tutti gli studenti mantengono una media sufficiente.
                    </M3Typography>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'spacing[2]' }}>
                <div>
                    <M3Typography variant="headline-large" style={{ fontWeight: '900', letterSpacing: 'typescale.headlineLarge.tracking', color: 'colors.onSurface' }}>
                        Registro Valutazioni
                    </M3Typography>
                    <M3Typography variant="body-large" style={{ fontWeight: '500', marginTop: 'spacing[1]', opacity: '0.7', color: 'colors.onSurfaceVariant' }}>
                        Gestione voti, competenze e monitoraggio performance
                    </M3Typography>
                </div>

                <div
                    style={{
                        borderRadius: 'shape.corner.large',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 'spacing[2]',
                        padding: 'spacing[3]',
                        backgroundColor: 'colors.surfaceContainerLow',
                        border: '1px solid colors.outline'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'colors.surfaceContainerLow',
                            borderRadius: 'shape.corner.large',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'spacing[2]',
                            padding: 'spacing[1] spacing[2]',
                            border: '1px solid colors.outline'
                        }}
                    >
                        <span style={{ color: 'colors.primary', fontSize: 'typescale.headlineSmall.fontSize' }}>class</span>
                        <select
                            id="class-select"
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            style={{
                                color: 'colors.onSurface',
                                backgroundColor: 'transparent',
                                fontWeight: '900',
                                fontSize: 'typescale.bodySmall.fontSize',
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
                                        color: 'colors.onSurface',
                                        backgroundColor: 'colors.surface'
                                    }}
                                >
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: 'spacing[3]' }}>
                        <button
                            onClick={() => setIsAddProvaModalOpen(true)}
                            style={{
                                borderRadius: 'shape.corner.large',
                                backgroundColor: 'colors.primary',
                                color: 'colors.onPrimary',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'spacing[2]',
                                padding: 'spacing[2] spacing[3]',
                                border: 'none'
                            }}
                        >
                            <span style={{ fontSize: 'typescale.headlineSmall.fontSize' }}>add</span>
                            Nuova Prova
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            style={{
                                backgroundColor: 'colors.surfaceContainerHighest',
                                color: 'colors.onSurface',
                                borderRadius: 'shape.corner.large',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'spacing[2]',
                                padding: 'spacing[2] spacing[3]',
                                border: 'none'
                            }}
                        >
                            <span style={{ fontSize: 'typescale.headlineSmall.fontSize' }}>download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div
                style={{
                    borderRadius: 'shape.corner.large',
                    border: '1px solid colors.outline',
                    backgroundColor: 'colors.surface'
                }}
            >
                <div
                    style={{
                        padding: 'spacing[2]',
                        borderBottom: '1px solid colors.outline',
                        backgroundColor: 'colors.surfaceContainerLow'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'spacing[3]' }}>
                        <div>
                            <M3Typography variant="headline-medium" style={{ fontWeight: '900', letterSpacing: 'typescale.headlineMedium.tracking', color: 'colors.onSurface' }}>
                                Valutazione Unificata
                            </M3Typography>
                            <M3Typography variant="body-small" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: '0.6', marginTop: 'spacing[1]', color: 'colors.onSurfaceVariant' }}>
                                Griglia voti e competenze trasversali
                            </M3Typography>
                        </div>
                        <div
                            style={{
                                backgroundColor: 'colors.surfaceContainerLow',
                                padding: 'spacing[1]',
                                borderRadius: 'shape.corner.large',
                                display: 'flex',
                                border: '1px solid colors.outline'
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
                                        gap: 'spacing[2]',
                                        padding: 'spacing[2] spacing[3]',
                                        borderRadius: 'shape.corner.medium',
                                        fontWeight: '900',
                                        fontSize: 'typescale.labelSmall.fontSize',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        backgroundColor: activeTab === tab.id ? 'colors.primary' : 'transparent',
                                        color: activeTab === tab.id ? 'colors.onPrimary' : 'colors.onSurfaceVariant',
                                        border: 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ fontSize: 'typescale.headlineSmall.fontSize' }}>{tab.icon}</span>
                                    {tab.label}
                                    {tab.badge && (
                                        <div
                                            style={{
                                                backgroundColor: 'colors.error',
                                                color: 'colors.onError',
                                                width: '20',
                                                height: '20',
                                                borderRadius: 'shape.corner.small',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 'typescale.bodySmall.fontSize',
                                                fontWeight: 'bold',
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

                <div style={{ padding: 'spacing[3]' }}>
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









