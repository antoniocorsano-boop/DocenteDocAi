import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Studente, MaterialeDidattico, KnowledgeBaseEntry, ClassroomViewProps, HomeworkStatus, ParticipationEntry } from '../types';
import { PARTICIPATION_BADGES } from '../constants';
import ClassroomTools from './ClassroomTools';
import ShareModal from './ShareModal';
import DocumentViewerModal from './DocumentViewerModal';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import ObservationModal from './ObservationModal';
import CopyForRegisterModal from './CopyForRegisterModal';
import QuickEvaluationModal from './QuickEvaluationModal';
import { calculatePerformance } from '../utils/evaluationUtils';
import { generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';
import StudentProfile from './StudentProfile';
import { TabGroup, M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar, M3Typography } from './ui';

type AttendanceStatus = 'presente' | 'assente' | 'ritardo';
type ClassroomTab = 'register' | 'tools' | 'resources' | 'notes';

const ClassroomView: React.FC<ClassroomViewProps> = ({
    draftKey,
    draftEntry,
    students,
    lessons,
    knowledgeBase,
    evaluations,
    competencyEvaluations,
    onUpdateDraftEntry,
    onFinalizeRegister,
    onCloseView,
    onSaveOralEvaluation,
    onOpenLiveAssistant,
    settings,
    aiSettings,
}) => {
    const [activeTab, setActiveTab] = useState<ClassroomTab>('register');
    const [selectedStudentForActions, setSelectedStudentForActions] = useState<Studente | null>(null);
    const [quickEvalStudent, setQuickEvalStudent] = useState<Studente | null>(null);
    const [observationStudent, setObservationStudent] = useState<Studente | null>(null);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [isShareInfoOpen, setIsShareInfoOpen] = useState(false);
    const [previewingMaterial, setPreviewingMaterial] = useState<KnowledgeBaseEntry | null>(null);
    const [viewingStudentProfile, setViewingStudentProfile] = useState<Studente | null>(null);
    const [focusedStudentIndex, setFocusedStudentIndex] = useState<number>(0);
    const studentGridRef = useRef<HTMLDivElement>(null);

    const lesson = useMemo(() => {
        return lessons[draftEntry.lessonId] || {
            id: draftEntry.lessonId,
            materia: draftEntry.materia || 'Sconosciuta',
            contenuto: 'Lezione (Dati Mancanti)',
            classe: draftEntry.classe,
            svolta: false
        };
    }, [lessons, draftEntry.lessonId, draftEntry.materia, draftEntry.classe]);

    const classStudents = useMemo(() => {
        return students.filter(s => s.classe === draftEntry.classe).sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [students, draftEntry.classe]);

    const studentAttendance = draftEntry.studentAttendance || {};
    const homeworkCheck = draftEntry.homeworkCheck || {};
    const participation = draftEntry.participation || {};
    const checkedObjectives = draftEntry.checkedObjectives || {};
    const observations = draftEntry.observations || {};

    // --- ATTENDANCE LOGIC ---
    const handleAttendanceToggle = (studentId: string) => {
        const current = studentAttendance[studentId] || 'presente';
        let next: AttendanceStatus = 'presente';
        if (current === 'presente') next = 'assente';
        else if (current === 'assente') next = 'ritardo';
        else next = 'presente';

        const newAttendance = { ...studentAttendance, [studentId]: next };
        onUpdateDraftEntry(draftKey, { studentAttendance: newAttendance });
    };

    const attendanceSummary = useMemo(() => {
        const present = classStudents.filter(s => !studentAttendance[s.id] || studentAttendance[s.id] === 'presente').length;
        const absent = classStudents.filter(s => studentAttendance[s.id] === 'assente').length;
        const late = classStudents.filter(s => studentAttendance[s.id] === 'ritardo').length;
        return { present, absent, late };
    }, [studentAttendance, classStudents]);

    const handleHomeworkChange = (studentId: string, status: HomeworkStatus) => {
        const newHomeworkCheck = { ...homeworkCheck, [studentId]: status };
        onUpdateDraftEntry(draftKey, { homeworkCheck: newHomeworkCheck });
    };

    const handleParticipation = (studentId: string, badgeId: ParticipationEntry['type']) => {
        const newParticipation = { ...participation };
        if (!newParticipation[studentId]) newParticipation[studentId] = [];
        newParticipation[studentId].push({ type: badgeId, timestamp: Date.now() });
        onUpdateDraftEntry(draftKey, { participation: newParticipation });
        setSelectedStudentForActions(null);
    };

    const handleObjectiveCheck = (index: number, isChecked: boolean) => {
        const newCheckedObjectives = { ...checkedObjectives, [index]: isChecked };
        onUpdateDraftEntry(draftKey, { checkedObjectives: newCheckedObjectives });
    };

    const handlePreviewMaterial = (material: MaterialeDidattico) => {
        if (material.type === 'kb' && material.kbId) {
            const kbEntry = knowledgeBase.find(kb => kb.id === material.kbId);
            if (kbEntry) setPreviewingMaterial(kbEntry);
        } else if (material.type === 'file' && material.file?.content) {
            setPreviewingMaterial({
                id: `temp-${Date.now()}`,
                fileName: material.file.name,
                content: "Contenuto Binario",
                fileContent: { data: material.file.content, mimeType: material.file.mimeType },
                htmlContent: `<p>File binario: ${material.file.mimeType}</p>`
            });
        }
    };

    const studentStats = useMemo(() => {
        return classStudents.map(student => {
            const sEvals = evaluations.filter(e => e.studenteId === student.id);
            const { grade, trend } = calculatePerformance(student.id, 'Complessivo', sEvals);
            const writtenEvals = sEvals.filter(e => e.tipo === 'Scritto');
            const oralEvals = sEvals.filter(e => e.tipo === 'Orale');
            const writtenAvg = writtenEvals.length > 0 ? (writtenEvals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / writtenEvals.length).toFixed(1) : '-';
            const oralAvg = oralEvals.length > 0 ? (oralEvals.reduce((a, b) => a + (parseFloat(b.voto) || 0), 0) / oralEvals.length).toFixed(1) : '-';
            const notes = observations[student.id] || '';
            return {
                student,
                grade,
                trend,
                writtenCount: writtenEvals.length,
                writtenAvg,
                oralCount: oralEvals.length,
                oralAvg,
                notes
            };
        });
    }, [classStudents, evaluations, observations]);

    // Reset focus when tab changes
    useEffect(() => {
        setFocusedStudentIndex(0);
    }, [activeTab]);

    // Handle arrow key navigation in student grid
    const handleStudentGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const keysToHandle = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!keysToHandle.includes(e.key)) return;

        e.preventDefault();
        const itemsPerRow = 4; // grid-cols-4 in lg view
        const totalItems = studentStats.length;
        let newIndex = focusedStudentIndex;

        switch (e.key) {
            case 'ArrowUp':
                newIndex = Math.max(0, focusedStudentIndex - itemsPerRow);
                break;
            case 'ArrowDown':
                newIndex = Math.min(totalItems - 1, focusedStudentIndex + itemsPerRow);
                break;
            case 'ArrowLeft':
                newIndex = focusedStudentIndex > 0 ? focusedStudentIndex - 1 : 0;
                break;
            case 'ArrowRight':
                newIndex = focusedStudentIndex < totalItems - 1 ? focusedStudentIndex + 1 : totalItems - 1;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = totalItems - 1;
                break;
        }

        setFocusedStudentIndex(newIndex);
    };

    const handlePrintHomework = async () => {
        if (!lesson) return;
        const blob = await generateHomeworkPdf(lesson, settings);
        viewPdfInNewTab(blob);
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: 'var(--md-sys-spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--md-sys-spacing-4)' }}>
                <button
                    onClick={onCloseView}
                    style={{
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        border: 'none',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        padding: 'var(--md-sys-spacing-2)',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface-variant)'
                    }}
                    title="Torna indietro"
                    aria-label="Chiudi vista lezione e torna alla lista lezioni"
                >
                    <span style={{ fontFamily: 'Material Symbols Outlined' }} aria-hidden="true">arrow_back</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }} aria-label="Presenti:">
                        <span aria-hidden="true">group</span>
                        <M3Typography variant="label-small">{attendanceSummary.present} PRES.</M3Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)', color: attendanceSummary.absent > 0 ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)' }} aria-label="Assenti:">
                        <span aria-hidden="true">person_off</span>
                        <M3Typography variant="label-small">{attendanceSummary.absent} ASS.</M3Typography>
                    </div>
                </div>

                <button
                    onClick={() => onFinalizeRegister(draftKey)}
                    style={{
                        backgroundColor: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)',
                        border: 'none',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--md-sys-typescale-label-large-tracking)'
                    }}
                    title="Finalizza e chiudi registro"
                    aria-label="Salva e chiudi il registro di questa lezione"
                >
                    <span aria-hidden="true">save</span> Fine
                </button>
            </div>

            <div style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
                <M3Typography variant="headline-large" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'bold', marginBottom: 'var(--md-sys-spacing-1)' }}>{lesson.materia}</M3Typography>
                <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{lesson.contenuto || 'Lezione'}</M3Typography>

                <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
                    <TabGroup
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as ClassroomTab)}
                        variant="primary"
                        tabs={[
                            { id: 'register', label: 'Registro', icon: 'how_to_reg' },
                            { id: 'notes', label: 'Diario', icon: 'edit_note' },
                            { id: 'tools', label: 'Strumenti', icon: 'construction' },
                            { id: 'resources', label: 'Materiali', icon: 'folder', badge: lesson.materialiDidattici?.length || undefined },
                        ]}
                    />
                </div>
            </div>

            <div style={{ marginBottom: 'var(--md-sys-spacing-4)' }}>

                {activeTab === 'register' && (
                    <div style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
                        {lesson.obiettivi && (
                            <div style={{ backgroundColor: 'var(--md-sys-color-on-primary)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-6)', border: '1px solid var(--md-sys-color-outline)', marginBottom: 'var(--md-sys-spacing-8)' }}>
                                <M3Typography variant="title-medium" style={{ fontWeight: 'bold', color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', marginBottom: 'var(--md-sys-spacing-4)' }}>Obiettivi Didattici</M3Typography>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
                                    {lesson.obiettivi.split('\n').filter(o => o.trim()).map((obj, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer', padding: 'var(--md-sys-spacing-1)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>
                                            <input
                                                type="checkbox"
                                                checked={checkedObjectives[idx] || false}
                                                onChange={(e) => handleObjectiveCheck(idx, e.target.checked)}
                                                style={{ width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)' }}
                                            />
                                            <M3Typography variant="body-medium" style={{ lineHeight: '1.5', color: checkedObjectives[idx] ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-surface)', textDecoration: checkedObjectives[idx] ? 'line-through' : 'none' }}>
                                                {obj.replace(/^- /, '')}
                                            </M3Typography>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div
                            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--md-sys-spacing-4)' }}
                            ref={studentGridRef}
                            onKeyDown={handleStudentGridKeyDown}
                            role="grid"
                            aria-label="Registro studenti con voti e presenze"
                        >
                            {studentStats.map((stat, index) => {
                                const student = stat.student;
                                const status = studentAttendance[student.id] || 'presente';
                                const hwStatus = homeworkCheck[student.id];
                                const badges = participation[student.id] || [];
                                const isFocused = index === focusedStudentIndex && activeTab === 'register';

                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => setViewingStudentProfile(student)}
                                        onFocus={() => setFocusedStudentIndex(index)}
                                        tabIndex={isFocused ? 0 : -1}
                                        style={{
                                            backgroundColor: 'var(--md-sys-color-surface-container)',
                                            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                            boxShadow: 'var(--md-sys-elevation-level2)',
                                            border: '1px solid var(--md-sys-color-outline-variant)',
                                            transition: 'all 300ms',
                                            cursor: 'pointer',
                                            outline: isFocused ? 'var(--md-sys-border-width-normal) solid var(--md-sys-color-primary)' : 'none',
                                            outlineOffset: 'var(--md-sys-spacing-1)'
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setViewingStudentProfile(student);
                                                e.preventDefault();
                                            }
                                        }}
                                        role="gridcell"
                                        aria-label={`${student.cognome}, voto, presenze`}
                                    >
                                        <div style={{ padding: 'var(--md-sys-spacing-3)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--md-sys-spacing-4)', alignItems: 'center' }}>
                                                {/* Column 1: Avatar + Name + Presence + BES/DSA */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-4)' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAttendanceToggle(student.id); }}
                                                        style={{
                                                            width: 'var(--md-sys-spacing-10)',
                                                            height: 'var(--md-sys-spacing-10)',
                                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: status === 'presente' ? 'var(--md-sys-color-primary-container)' : status === 'assente' ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-tertiary-container)',
                                                            color: status === 'presente' ? 'var(--md-sys-color-on-primary-container)' : status === 'assente' ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-tertiary-container)',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 300ms'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>
                                                            {status === 'presente' ? 'check' : status === 'assente' ? 'close' : 'schedule'}
                                                        </span>
                                                    </button>
                                                    <Avatar name={`${student.nome}`} size="md" />
                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <M3Typography variant="title-small" style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: status === 'assente' ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-surface)', textDecoration: status === 'assente' ? 'line-through' : 'none' }}>
                                                            {student.cognome} {student.nome}
                                                        </M3Typography>
                                                        <M3Typography variant="body-small" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface-variant)' }}>{student.classe}</M3Typography>
                                                    </div>
                                                </div>

                                                {/* Column 2: Average + Trend */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <M3Typography
                                                        variant="title-large"
                                                        style={{
                                                            fontWeight: 'bold',
                                                            color: parseFloat(stat.grade || '0') > 7 ? 'var(--md-sys-color-primary)' : parseFloat(stat.grade || '0') > 6 ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-error)'
                                                        }}
                                                    >
                                                        {stat.grade || '-'}
                                                    </M3Typography>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--md-sys-spacing-1)' }}>
                                                        <span
                                                            style={{
                                                                fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                                                                color: stat.trend === 'up' ? 'var(--md-sys-color-tertiary)' : stat.trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)'
                                                            }}
                                                        >
                                                            {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Column 3: Written Evals */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Scritti</M3Typography>
                                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold' }}>{stat.writtenCount > 0 ? `${stat.writtenCount} - ${stat.writtenAvg}` : '-'}</M3Typography>
                                                </div>

                                                {/* Column 4: Oral Evals */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Orali</M3Typography>
                                                    <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold' }}>{stat.oralCount > 0 ? `${stat.oralCount} - ${stat.oralAvg}` : '-'}</M3Typography>
                                                </div>

                                                {/* Column 5: Notes */}
                                                <div style={{ textAlign: 'center' }}>
                                                    {stat.notes ? (
                                                        <span style={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)' }} title={typeof stat.notes === 'string' ? stat.notes : 'Note presenti'}>edit_note</span>
                                                    ) : (
                                                        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-outline)' }}>-</M3Typography>
                                                    )}
                                                </div>

                                                {/* Column 6: Homework + Participation */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
                                                    {hwStatus && (
                                                        <div
                                                            style={{
                                                                padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                                                borderRadius: 'var(--md-sys-shape-corner-full)',
                                                                fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                                                                fontWeight: 'bold',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.1em',
                                                                backgroundColor: hwStatus === 'missing' ? 'var(--md-sys-color-error-container)' : hwStatus === 'partial' ? 'var(--md-sys-color-surface-container)' : 'var(--md-sys-color-primary-container)',
                                                                color: hwStatus === 'missing' ? 'var(--md-sys-color-on-error-container)' : hwStatus === 'partial' ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary-container)',
                                                                border: '1px solid var(--md-sys-color-outline)'
                                                            }}
                                                        >
                                                            {hwStatus === 'missing' ? 'No Compiti' : hwStatus === 'partial' ? 'Parziali' : 'OK'}
                                                        </div>
                                                    )}
                                                    {badges.length > 0 && (
                                                        <div
                                                            style={{
                                                                padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
                                                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                                                backgroundColor: 'var(--md-sys-color-secondary-container)',
                                                                color: 'var(--md-sys-color-on-secondary-container)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--md-sys-spacing-1)'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>star</span> {badges.length}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Column 7: Actions */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedStudentForActions(student); }}
                                                        style={{
                                                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                                            border: 'none',
                                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                                            padding: 'var(--md-sys-spacing-1)',
                                                            cursor: 'pointer',
                                                            color: 'var(--md-sys-color-on-surface-variant)'
                                                        }}
                                                        aria-label={`Azioni per ${student.cognome}`}
                                                    >
                                                        <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-headline-small-font-size)' }} aria-hidden="true">more_vert</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                        <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface)', padding: 'var(--md-sys-spacing-4)', border: '1px solid var(--md-sys-color-outline)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--md-sys-spacing-4)' }}>
                                <M3Typography variant="title-medium">Note Pubbliche (Registro)</M3Typography>
                                <VoiceNoteRecorder onTranscription={(text) => onUpdateDraftEntry(draftKey, { notes: (draftEntry.notes ? draftEntry.notes + '\n' : '') + text })} compact />
                            </div>
                            <textarea
                                value={draftEntry.notes || ''}
                                onChange={e => onUpdateDraftEntry(draftKey, { notes: e.target.value })}
                                style={{
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                                    padding: 'var(--md-sys-spacing-2)',
                                    width: '100%',
                                    color: 'var(--md-sys-color-on-surface)',
                                    fontFamily: 'inherit'
                                }}
                                rows={8}
                                placeholder="Argomenti trattati, note disciplinari, promemoria..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--md-sys-spacing-3)' }}>
                            <button
                                onClick={() => setIsCopyModalOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>content_copy</span>
                                Copia
                            </button>
                            <button
                                onClick={() => setIsShareInfoOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>share</span>
                                Condividi
                            </button>
                            <button
                                onClick={handlePrintHomework}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>assignment</span>
                                Stampa Compiti (PDF)
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div>
                        <ClassroomTools students={classStudents} studentAttendance={studentAttendance} />
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
                        {lesson.materialiDidattici && lesson.materialiDidattici.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--md-sys-spacing-3)' }}>
                                {lesson.materialiDidattici.map(mat => (
                                    <div
                                        key={mat.id}
                                        style={{
                                            borderRadius: 'var(--md-sys-shape-corner-large)',
                                            backgroundColor: 'var(--md-sys-color-surface)',
                                            padding: 'var(--md-sys-spacing-3)',
                                            border: '1px solid var(--md-sys-color-outline)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--md-sys-spacing-3)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handlePreviewMaterial(mat)}
                                    >
                                        <div
                                            style={{
                                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                                width: 'var(--md-sys-spacing-10)',
                                                height: 'var(--md-sys-spacing-10)',
                                                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                                                color: 'var(--md-sys-color-on-tertiary-container)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-title-medium-font-size)' }}>
                                                {mat.type === 'link' ? 'link' : 'article'}
                                            </span>
                                        </div>
                                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                                            <M3Typography variant="body-medium" style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface)' }}>{mat.label || mat.fileName}</M3Typography>
                                            <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase' }}>{mat.type}</M3Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 'var(--md-sys-spacing-4)', opacity: 0.6 }}>
                                <span style={{ marginBottom: 'var(--md-sys-spacing-2)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)', color: 'var(--md-sys-color-on-surface-variant)' }}>folder_off</span>
                                <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Nessun materiale.</M3Typography>
                            </div>
                        )}

                        {lesson.adattamenti && (
                            <div style={{ color: 'var(--md-sys-color-on-secondary-container)', borderRadius: 'var(--md-sys-shape-corner-large)', padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-secondary-container)' }}>
                                <M3Typography variant="title-medium" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-2)' }}>
                                    <span style={{ color: 'var(--md-sys-color-on-secondary-container)', fontSize: 'var(--md-sys-typescale-headline-small-font-size)' }}>accessibility_new</span>
                                    Inclusione
                                </M3Typography>
                                <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-secondary-container)', opacity: 0.9, whiteSpace: 'pre-wrap' }}>{lesson.adattamenti}</M3Typography>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ position: 'fixed', bottom: 'var(--md-sys-spacing-4)', right: 'var(--md-sys-spacing-4)' }}>
                <button
                    onClick={onOpenLiveAssistant}
                    style={{
                        backgroundColor: 'var(--md-sys-color-tertiary-container)',
                        color: 'var(--md-sys-color-on-tertiary-container)',
                        border: 'none',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        padding: 'var(--md-sys-spacing-3)',
                        cursor: 'pointer',
                        boxShadow: 'var(--md-sys-elevation-level3)'
                    }}
                >
                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-headline-small-font-size)' }}>mic</span>
                </button>
            </div>

            {selectedStudentForActions && (
                <M3Dialog
                    onClose={() => setSelectedStudentForActions(null)}
                    title={`${selectedStudentForActions.cognome}`}
                    maxWidth="sm"
                    level={1}
                >
                    <M3DialogContent>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)', borderBottom: '1px solid var(--md-sys-color-outline)', paddingBottom: 'var(--md-sys-spacing-2)' }}>
                            <Avatar name={`${selectedStudentForActions.nome}`} size="md" />
                            <div>
                                <M3Typography variant="headline-small" style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontWeight: '900', color: 'var(--md-sys-color-on-surface)' }}>{selectedStudentForActions.cognome} {selectedStudentForActions.nome}</M3Typography>
                                <M3Typography variant="body-small" style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--md-sys-color-primary)' }}>Azioni Rapide</M3Typography>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                            <button
                                onClick={() => { setQuickEvalStudent(selectedStudentForActions); setSelectedStudentForActions(null); }}
                                style={{
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    backgroundColor: 'var(--md-sys-color-primary-container)',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-3)',
                                    cursor: 'pointer',
                                    transition: 'all 300ms'
                                }}
                            >
                                <div style={{ width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 300ms' }}>
                                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>grading</span>
                                </div>
                                <M3Typography variant="label-small" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--md-sys-color-on-primary-container)' }}>Voto</M3Typography>
                            </button>
                            <button
                                onClick={() => { setObservationStudent(selectedStudentForActions); setSelectedStudentForActions(null); }}
                                style={{
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-3)',
                                    cursor: 'pointer',
                                    transition: 'all 300ms'
                                }}
                            >
                                <div style={{ width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-secondary)', color: 'var(--md-sys-color-on-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 300ms' }}>
                                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>visibility</span>
                                </div>
                                <M3Typography variant="label-small" style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--md-sys-color-on-secondary-container)' }}>Osserva</M3Typography>
                            </button>
                            <button
                                onClick={() => { setViewingStudentProfile(selectedStudentForActions); setSelectedStudentForActions(null); }}
                                style={{
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'var(--md-sys-spacing-2)',
                                    padding: 'var(--md-sys-spacing-3)',
                                    cursor: 'pointer',
                                    transition: 'all 300ms'
                                }}
                            >
                                <div style={{ width: 'var(--md-sys-spacing-8)', height: 'var(--md-sys-spacing-8)', borderRadius: 'var(--md-sys-shape-corner-small)', backgroundColor: 'var(--md-sys-color-on-surface-variant)', color: 'var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 300ms' }}>
                                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>person</span>
                                </div>
                                <M3Typography variant="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profilo</M3Typography>
                            </button>
                        </div>

                        <div style={{ marginBottom: 'var(--md-sys-spacing-3)' }}>
                            <M3Typography variant="title-small" style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: 'var(--md-sys-spacing-2)', paddingLeft: 'var(--md-sys-spacing-2)', paddingRight: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>Partecipazione</M3Typography>
                            <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', overflowX: 'auto' }}>
                                {PARTICIPATION_BADGES.map(badge => (
                                    <button
                                        key={badge.id}
                                        onClick={() => handleParticipation(selectedStudentForActions.id, badge.id as ParticipationEntry["type"])}
                                        style={{
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                            border: 'none',
                                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                                            padding: 'var(--md-sys-spacing-2)',
                                            cursor: 'pointer',
                                            transition: 'all 300ms',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--md-sys-spacing-1)',
                                            color: badge.color
                                        }}
                                    >
                                        <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>{badge.icon}</span>
                                        <M3Typography variant="label-small" style={{ fontSize: 'var(--md-sys-typescale-body-small-font-size)', fontWeight: 'bold' }}>{badge.label}</M3Typography>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <M3Typography variant="title-small" style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: 'var(--md-sys-spacing-2)', paddingLeft: 'var(--md-sys-spacing-2)', paddingRight: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface-variant)' }}>Compiti</M3Typography>
                            <TabGroup
                                tabs={[
                                    { id: 'completed', label: 'Svolti' },
                                    { id: 'partial', label: 'Parziali' },
                                    { id: 'missing', label: 'No' }
                                ]}
                                activeTab={homeworkCheck[selectedStudentForActions.id] || 'default'}
                                onTabChange={(id) => { handleHomeworkChange(selectedStudentForActions.id, id as HomeworkStatus); setSelectedStudentForActions(null); }}
                                // style removed: width should be set on parent container if needed
                            />
                        </div>
                    </M3DialogContent>
                    <M3DialogActions>
                        <M3Button onClick={() => setSelectedStudentForActions(null)} variant="text">Chiudi</M3Button>
                    </M3DialogActions>
                </M3Dialog>
            )}

            {isCopyModalOpen && lesson && (
                <CopyForRegisterModal
                    lesson={lesson}
                    entry={draftEntry}
                    students={classStudents}
                    todaysEvaluations={evaluations.filter(e => e.data.startsWith(draftEntry.date.split('T')[0]) && e.materia === lesson.materia)}
                    onClose={() => setIsCopyModalOpen(false)}
                />
            )}

            {isShareInfoOpen && (
                <ShareModal
                    title="Lezione:"
                    text="Argomento:\nCompiti:"
                    onClose={() => setIsShareInfoOpen(false)}
                />
            )}

            {previewingMaterial && (
                <DocumentViewerModal
                    title={previewingMaterial.fileName}
                    htmlContent={typeof previewingMaterial.htmlContent === 'string' && previewingMaterial.htmlContent.trim() ? previewingMaterial.htmlContent : 'Contenuto non disponibile'}
                    onClose={() => setPreviewingMaterial(null)}
                />
            )}

            {quickEvalStudent && lesson && (
                <QuickEvaluationModal
                    student={quickEvalStudent}
                    lesson={lesson}
                    settings={settings}
                    onClose={() => setQuickEvalStudent(null)}
                    onSaveEvaluation={(data) => { onSaveOralEvaluation(data); setQuickEvalStudent(null); }}
                    onSaveCompetencyEvaluation={() => { /* Logic handled in parent or modal directly if needed */ }}
                />
            )}

            {observationStudent && (
                <ObservationModal
                    student={observationStudent}
                    initialData={observations[observationStudent.id]}
                    onClose={() => setObservationStudent(null)}
                    onSave={(data) => {
                        const newObservations = { ...observations, [observationStudent.id]: data };
                        onUpdateDraftEntry(draftKey, { observations: newObservations });
                        setObservationStudent(null);
                    }}
                />
            )}

            {viewingStudentProfile && (
                <div style={{ backgroundColor: 'var(--md-sys-color-surface)', overflowY: 'auto', padding: 'var(--md-sys-spacing-4)' }}>
                    <StudentProfile
                        student={viewingStudentProfile}
                        evaluations={evaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        competencyEvaluations={competencyEvaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        settings={settings}
                        aiSettings={aiSettings}
                        onBack={() => setViewingStudentProfile(null)}
                        onDeleteEvaluation={() => {/* Handle delete */ }}
                        register={[]}
                        lessons={lessons}
                    />
                </div>
            )}
        </div>
    );
};

export default ClassroomView;
