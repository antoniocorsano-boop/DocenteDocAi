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
            className="evaluation-grid-container"
        >
            <table>
                <thead>
                    <tr className="evaluation-header-row">
                        <th
                            className="evaluation-header-cell student-column"
                        >
                            <M3Typography variant="label-large" className="evaluation-header-text">Studente</M3Typography>
                        </th>
                        <th
                            className="evaluation-header-cell center-column"
                        >
                            <M3Typography variant="label-large" className="evaluation-header-text">Media</M3Typography>
                        </th>
                        <th
                            className="evaluation-header-cell center-column"
                        >
                            <M3Typography variant="label-large" className="evaluation-header-text">Trend</M3Typography>
                        </th>
                        {prove.map(p => (
                            <th
                                key={p.id}
                                className="evaluation-header-cell test-column"
                            >
                                <div className="test-header-content">
                                    <div
                                        className="test-badge"
                                    >
                                        <span className="test-icon">{getTestTypeIcon(p.tipo)}</span>
                                        <M3Typography variant="label-small" className="test-date">{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</M3Typography>
                                    </div>
                                    <M3Typography
                                        variant="body-small"
                                        className="test-title"
                                        title={p.titolo}
                                    >
                                        {p.titolo}
                                    </M3Typography>
                                </div>
                            </th>
                        ))}
                        {prove.length === 0 && (
                            <th className="evaluation-header-cell empty-state">
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
                            <tr key={student.id} className="student-row">
                                <td
                                    className="student-cell"
                                >
                                    <div
                                        className="student-info-container"
                                        onClick={() => setViewingStudent(student)}
                                    >
                                        <Avatar name={`${student.nome} ${student.cognome}`} size="sm" className="student-avatar" />
                                        <M3Typography variant="body-medium" className="student-name">
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                    </div>
                                </td>
                                <td className="grade-cell">
                                    {performance.grade ? (
                                        <div
                                            className={`grade-badge ${parseFloat(performance.grade) < 6 ? 'grade-insufficient' : 'grade-sufficient'}`}
                                        >
                                            {performance.grade}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="trend-cell">
                                    {performance.trend && (
                                        <span
                                            className={`trend-icon trend-${performance.trend}`}
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
                                            className="test-cell"
                                            onClick={() => setEditingUnified({ student, prova: p })}
                                        >
                                            {voteValue ? (
                                                <div
                                                    className={`vote-badge ${isNegative ? 'vote-negative' : 'vote-positive'}`}
                                                >
                                                    {voteValue}
                                                </div>
                                            ) : (
                                                <div
                                                    className="add-vote-button"
                                                >
                                                    <span className="add-icon">add</span>
                                                </div>
                                            )}
                                            {hasCompetencies && (
                                                <div
                                                    className="competency-badge"
                                                    title="Competenze valutate"
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                                {prove.length === 0 && <td className="empty-cell">-</td>}
                            </tr>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <tr>
                            <td colSpan={prove.length + 3} className="empty-state-cell">
                                <EmptyState title="Nessuno studente" description="Questa classe non ha studenti." icon="group_off" />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderSummaryView = () => (
        <div className="summary-view-grid">
            {filteredStudents.map(student => {
                const performance = calculatePerformance(student.id, 'Complessivo', evaluations);
                const trendIcon = performance.trend === 'up' ? 'trending_up' : performance.trend === 'down' ? 'trending_down' : 'trending_flat';
                const avg = parseFloat(performance.grade || '0');
                const isInsufficient = avg > 0 && avg < 6;

                return (
                    <div
                        key={student.id}
                        className="summary-student-card"
                        onClick={() => setViewingStudent(student)}
                    >
                        <div className="summary-card-header">
                            <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                            <div className="summary-student-info">
                                <M3Typography variant="headline-small" className="summary-student-name">
                                    {student.cognome} {student.nome}
                                </M3Typography>
                                <div className="summary-badges">
                                    <div
                                        className={`summary-grade-badge ${isInsufficient ? 'grade-insufficient' : 'grade-sufficient'}`}
                                    >
                                        Media: {performance.grade || 'N/D'}
                                    </div>
                                    {performance.trend && (
                                        <div
                                            className={`summary-trend-badge trend-${performance.trend}`}
                                        >
                                            <span className="trend-icon">{trendIcon}</span>
                                            {performance.trend === 'up' ? 'In crescita' : performance.trend === 'down' ? 'In calo' : 'Stabile'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="summary-chevron">chevron_right</span>
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
        <div className="risk-view-grid">
            {atRiskStudents.length > 0 ? atRiskStudents.map(student => {
                const { grade } = calculatePerformance(student.id, 'Complessivo', evaluations);
                return (
                    <div
                        key={student.id}
                        className="risk-student-card"
                    >
                        <div className="risk-card-icon-container">
                            <span className="risk-icon">warning</span>
                        </div>

                        <div className="risk-card-content">
                            <div className="risk-student-header">
                                <div className="risk-student-info-row">
                                    <Avatar name={`${student.nome} ${student.cognome}`} size="lg" />
                                    <div>
                                        <M3Typography variant="headline-small" className="risk-student-name">
                                            {student.cognome} {student.nome}
                                        </M3Typography>
                                        <M3Typography variant="body-small" className="risk-class-label">
                                            Classe {student.classe}
                                        </M3Typography>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="risk-grade-badge"
                            >
                                Media insufficiente: {grade}
                            </div>

                            <M3Typography variant="body-medium" className="risk-description">
                                Situazione critica rilevata. È consigliata l&apos;attivazione di misure di recupero personalizzate.
                            </M3Typography>

                            <div className="risk-actions">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenInclusionPlanEditor(student); }}
                                    className="risk-button-primary"
                                >
                                    Piano Inclusione
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingStudent(student); }}
                                    className="risk-button-secondary"
                                >
                                    Analizza
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="risk-empty-state">
                    <span className="risk-empty-icon">verified_user</span>
                    <M3Typography variant="headline-small" className="risk-empty-title">Nessuna criticità</M3Typography>
                    <M3Typography variant="body-medium" className="risk-empty-description">
                        Tutti gli studenti mantengono una media sufficiente.
                    </M3Typography>
                </div>
            )}
        </div>
    );

    return (
        <div className="evaluation-module-container">
            <div className="module-header">
                <div>
                    <M3Typography variant="headline-large" className="module-title">
                        Registro Valutazioni
                    </M3Typography>
                    <M3Typography variant="body-large" className="module-subtitle">
                        Gestione voti, competenze e monitoraggio performance
                    </M3Typography>
                </div>

                <div
                    className="module-controls"
                >
                    <div
                        className="class-selector"
                    >
                        <span className="class-icon">class</span>
                        <select
                            id="class-select"
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            className="class-select"
                        >
                            {userClasses.map(c => (
                                <option
                                    key={c}
                                    value={c}
                                    className="class-option"
                                >
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => setIsAddProvaModalOpen(true)}
                            className="action-button-primary"
                        >
                            <span className="button-icon">add</span>
                            Nuova Prova
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="action-button-secondary"
                        >
                            <span className="button-icon">download</span>
                            Esporta
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="view-container"
            >
                <div
                    className="view-header"
                >
                    <div className="view-header-content">
                        <div>
                            <M3Typography variant="headline-medium" className="view-title">
                                Valutazione Unificata
                            </M3Typography>
                            <M3Typography variant="body-small" className="view-subtitle">
                                Griglia voti e competenze trasversali
                            </M3Typography>
                        </div>
                        <div
                            className="tabs-container"
                        >
                            {[
                                { id: 'grid', label: 'Griglia', icon: 'grid_on' },
                                { id: 'summary', label: 'Riepilogo', icon: 'analytics' },
                                { id: 'risk', label: 'Criticità', icon: 'warning', badge: atRiskStudents.length > 0 ? atRiskStudents.length : undefined }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ViewTab)}
                                    className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
                                >
                                    <span className="tab-icon">{tab.icon}</span>
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









