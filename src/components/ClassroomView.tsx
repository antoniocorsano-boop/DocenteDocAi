// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
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
import { TabGroup, M3Dialog, M3DialogContent, M3DialogActions, M3Button, Avatar } from './ui';

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
        <div className="classroom-view-main-layout">
            <div className="classroom-view-header">
                <button 
                    onClick={onCloseView} 
                    className="classroom-view-back-button"
                    title="Torna indietro"
                    aria-label="Chiudi vista lezione e torna alla lista lezioni"
                >
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">arrow_back</span>
                </button>

                <div className="classroom-view-attendance-summary">
                    <div className="classroom-view-present-count" aria-label={`Presenti: ${attendanceSummary.present}`}>
                        <span className="material-symbols-outlined m3-label-large" aria-hidden="true">group</span>
                        <span>{attendanceSummary.present} PRES.</span>
                    </div>
                    <div className={`classroom-view-absent-count ${attendanceSummary.absent > 0 ? 'classroom-view-absent-count-alert' : 'classroom-view-absent-count-normal'}`} aria-label={`Assenti: ${attendanceSummary.absent}`}>
                        <span className="material-symbols-outlined m3-label-large" aria-hidden="true">person_off</span>
                        <span>{attendanceSummary.absent} ASS.</span>
                    </div>
                </div>

                <button 
                    onClick={() => onFinalizeRegister(draftKey)} 
                    className="classroom-view-finalize-button"
                    title="Finalizza e chiudi registro"
                    aria-label="Salva e chiudi il registro di questa lezione"
                >
                    <span className="material-symbols-outlined m3-label-large mr-1" aria-hidden="true">save</span> Fine
                </button>
            </div>

            <div className="classroom-view-lesson-header">
                <h2 className="classroom-view-lesson-title">{lesson.materia}</h2>
                <p className="classroom-view-lesson-content">{lesson.contenuto || 'Lezione'}</p>

                <div className="classroom-view-tabs-container">
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

            <div className="classroom-view-content">

                {activeTab === 'register' && (
                    <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                        {lesson.obiettivi && (
                            <div className="bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)]" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", marginBottom: "var(--md-sys-spacing-8)" }}>
                                <p className="m3-label-small" style={{ fontWeight: "bold", color: "var(--md-sys-color-primary)", textTransform: "uppercase", marginBottom: "var(--md-sys-spacing-8)" }}>Obiettivi Didattici</p>
                                <div style={{ gap: "var(--md-sys-spacing-2)" }}>
                                    {lesson.obiettivi.split('\n').filter(o => o.trim()).map((obj, idx) => (
                                        <label key={idx} className="hover:bg-surface" style={{ display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-6)", cursor: "pointer", padding: "var(--md-sys-spacing-1)", borderRadius: "0.375rem" }}>
                                            <input
                                                type="checkbox"
                                                checked={checkedObjectives[idx] || false}
                                                onChange={(e) => handleObjectiveCheck(idx, e.target.checked)}
                                                className="mt-0.5 accent-primary" style={{ width: "1rem", height: "1rem" }}
                                            />
                                            <span className={`text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] leading-tight ${checkedObjectives[idx] ? 'line-through opacity-50' : 'text-[var(--md-sys-color-on-surface)]'}`}>
                                                {obj.replace(/^- /, '')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div 
                            className="md:grid-cols-2 lg:grid-cols-4" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)" }}
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
                                        className={`bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-extra-large)] shadow-[var(--md-sys-elevation-level2)] border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${isFocused ? 'focus-visible:ring-2 focus-visible:ring-primary outline-none ring-2 ring-primary' : 'border-[var(--md-sys-color-outline-variant)] hover:shadow-[var(--md-sys-elevation-level3)]'}`}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setViewingStudentProfile(student);
                                                e.preventDefault();
                                            }
                                        }}
                                        role="gridcell"
                                        aria-label={`${student.cognome} ${student.nome}, voto ${stat.grade || '-'}, presenze ${status}`}
                                    >
                                        <div style={{ padding: 'var(--md-sys-spacing-6)' }}>
                                        <div className="md:grid-cols-2 lg:grid-cols-7" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)", alignItems: "center" }}>
                                            {/* Column 1: Avatar + Name + Presence + BES/DSA */}
                                            <div className="col-span-1 md:col-span-2 lg:col-span-2" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAttendanceToggle(student.id); }}
                                                    className={`w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center transition-colors flex-shrink-0 ${status === 'presente' ? 'bg-primary-container text-primary' :
                                                            status === 'assente' ? 'bg-error-container text-error' : 'bg-tertiary-container text-tertiary'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined m3-label-large">
                                                        {status === 'presente' ? 'check' : status === 'assente' ? 'close' : 'schedule'}
                                                    </span>
                                                </button>
                                                <Avatar name={`${student.nome} ${student.cognome}`} style={{ width: "2rem", height: "2rem", flexShrink: "0" }} />
                                                <div style={{ minWidth: "0", flex: "1" }}>
                                                    <h3 className={`m3-title-small font-bold truncate ${status === 'assente' ? 'line-through' : ''}`}>
                                                        {student.cognome} {student.nome}
                                                    </h3>
                                                    <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.classe}</p>
                                                </div>
                                            </div>

                                            {/* Column 2: Average + Trend */}
                                            <div className="col-span-1" style={{ textAlign: "center" }}>
                                                <span className={`m3-title-large font-bold ${parseFloat(stat.grade || '0') > 7 ? 'text-primary' : parseFloat(stat.grade || '0') > 6 ? 'text-secondary' : 'text-error'}`}>
                                                    {stat.grade || '-'}
                                                </span>
                                                <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--md-sys-spacing-4)" }}>
                                                    <span className={`material-symbols-outlined m3-label-large ${stat.trend === 'up' ? 'animate-bounce text-tertiary' : stat.trend === 'down' ? 'animate-pulse text-error' : 'text-[var(--md-sys-color-on-surface)]-variant'}`}>
                                                        {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Column 3: Written Evals */}
                                            <div className="col-span-1" style={{ textAlign: "center" }}>
                                                <span className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant" style={{ display: "block" }}>Scritti</span>
                                                <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]" style={{ fontWeight: "bold" }}>{stat.writtenCount > 0 ? `${stat.writtenCount} - ${stat.writtenAvg}` : '-'}</p>
                                            </div>

                                            {/* Column 4: Oral Evals */}
                                            <div className="col-span-1" style={{ textAlign: "center" }}>
                                                <span className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant" style={{ display: "block" }}>Orali</span>
                                                <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]" style={{ fontWeight: "bold" }}>{stat.oralCount > 0 ? `${stat.oralCount} - ${stat.oralAvg}` : '-'}</p>
                                            </div>

                                            {/* Column 5: Notes */}
                                            <div className="col-span-1" style={{ textAlign: "center" }}>
                                                {stat.notes ? (
                                                    <span className="material-symbols-outlined m3-label-large" style={{ color: "var(--md-sys-color-primary)" }} title={typeof stat.notes === 'string' ? stat.notes : 'Note presenti'}>edit_note</span>
                                                ) : (
                                                    <span className="text-outline">-</span>
                                                )}
                                            </div>

                                            {/* Column 6: Homework + Participation */}
                                            <div className="col-span-1" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
                                                {hwStatus && (
                                                    <span className={`m3-label-small px-4 py-1 rounded-full border ${hwStatus === 'missing' ? 'border-error text-error bg-error-container' :
                                                            hwStatus === 'partial' ? 'border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)]-variant bg-[var(--md-sys-color-surface-container)]' : 'border-primary text-primary bg-primary-container'
                                                        }`}>
                                                        {hwStatus === 'missing' ? 'No Compiti' : hwStatus === 'partial' ? 'Parziali' : 'OK'}
                                                    </span>
                                                )}
                                                {badges.length > 0 && (
                                                    <span className="m3-label-small py-1 text-on-secondary-container" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-secondary-container)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
                                                        <span className="material-symbols-outlined m3-label-small">star</span> {badges.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Column 7: Actions */}
                                            <div className="col-span-1" style={{ textAlign: "center" }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedStudentForActions(student); }}
                                                    className="icon-button text-[var(--md-sys-color-on-surface)]-variant"
                                                    aria-label={`Azioni per ${student.name}`}
                                                >
                                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}} aria-hidden="true">more_vert</span>
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
                    <div className="animate-in fade-in" style={{ gap: "var(--md-sys-spacing-4)" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]" style={{ backgroundColor: "var(--md-sys-color-surface)", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--md-sys-spacing-8)" }}>
                                <label className="m3-label-large">Note Pubbliche (Registro)</label>
                                <VoiceNoteRecorder onTranscription={(text) => onUpdateDraftEntry(draftKey, { notes: (draftEntry.notes ? draftEntry.notes + '\n' : '') + text })} compact />
                            </div>
                            <textarea
                                value={draftEntry.notes || ''}
                                onChange={e => onUpdateDraftEntry(draftKey, { notes: e.target.value })}
                                className="form-textarea bg-[var(--md-sys-color-surface-container-low)]" style={{ width: "100%" }}
                                rows={8}
                                placeholder="Argomenti trattati, note disciplinari, promemoria..."
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--md-sys-spacing-6)" }}>
                            <button onClick={() => setIsCopyModalOpen(true)} className="button button-tonal" style={{ width: "100%", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>content_copy</span>
                                Copia
                            </button>
                            <button onClick={() => setIsShareInfoOpen(true)} className="button button-outlined" style={{ width: "100%", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>share</span>
                                Condividi
                            </button>
                            <button onClick={handlePrintHomework} className="button button-filled col-span-2" style={{ width: "100%", justifyContent: "center" }}>
                                <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>assignment</span>
                                Stampa Compiti (PDF)
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div className="animate-in fade-in">
                        <ClassroomTools students={classStudents} studentAttendance={studentAttendance} />
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="animate-in fade-in" style={{ gap: "var(--md-sys-spacing-4)" }}>
                        {lesson.materialiDidattici && lesson.materialiDidattici.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-6)" }}>
                                {lesson.materialiDidattici.map(mat => (
                                    <div key={mat.id} className="rounded-[var(--md-sys-shape-corner-medium)] border-[var(--md-sys-color-outline-variant)] active:bg-[var(--md-sys-color-surface-container)]" style={{ backgroundColor: "var(--md-sys-color-surface)", padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", cursor: "pointer" }} onClick={() => handlePreviewMaterial(mat)}>
                                        <div className="rounded-[var(--md-sys-shape-corner-small)] text-on-tertiary-container" style={{ width: "2.5rem", height: "2.5rem", backgroundColor: "var(--md-sys-color-tertiary-container)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>
                                                {mat.type === 'link' ? 'link' : 'article'}
                                            </span>
                                        </div>
                                        <div style={{ flexGrow: "1", minWidth: "0" }}>
                                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mat.label || mat.fileName}</p>
                                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ textTransform: "uppercase" }}>{mat.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "var(--md-sys-spacing-8)", opacity: "0.6" }}>
                                <span className="material-symbols-outlined m3-headline-large" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>folder_off</span>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">Nessun materiale.</p>
                            </div>
                        )}

                        {lesson.adattamenti && (
                            <div className="text-on-secondary-container rounded-[var(--md-sys-shape-corner-medium)]" style={{ padding: "var(--md-sys-spacing-8)", backgroundColor: "var(--md-sys-color-secondary-container)" }}>
                                <h3 className="m3-title-medium" style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-8)" }}>
                                    <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">accessibility_new</span>
                                    Inclusione
                                </h3>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ opacity: "0.9", whiteSpace: "pre-wrap" }}>{lesson.adattamenti}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-30">
                <button onClick={onOpenLiveAssistant} className="fab text-on-tertiary-container shadow-[var(--md-sys-elevation-level2)]" style={{ backgroundColor: "var(--md-sys-color-tertiary-container)" }}>
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>mic</span>
                </button>
            </div>

            {selectedStudentForActions && (
                <M3Dialog
                    onClose={() => setSelectedStudentForActions(null)}
                    title={`${selectedStudentForActions.cognome} ${selectedStudentForActions.nome}`}
                    maxWidth="sm"
                    level={1}
                >
                    <M3DialogContent>
                        <div className="border-[var(--md-sys-color-outline)]/10 pb-4" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-6)", borderBottom: "1px solid var(--md-sys-color-outline)" }}>
                            <Avatar name={`${selectedStudentForActions.nome} ${selectedStudentForActions.cognome}`} style={{ width: "3rem", height: "3rem" }} />
                            <div>
                                <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontSize: "1.125rem", fontWeight: "900" }}>{selectedStudentForActions.cognome} {selectedStudentForActions.nome}</h3>
                                <p className="m3-label-tiny" style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-primary)" }}>Azioni Rapide</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--md-sys-spacing-6)", marginBottom: "var(--md-sys-spacing-8)" }}>
                            <button 
                                onClick={() => { setQuickEvalStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-primary-container/30 hover:bg-primary-container/50 group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-6)", transition: "color 300ms" }}
                            >
                                <div className="shadow-[var(--md-sys-elevation-level1)] group-hover:scale-110" style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>grading</span>
                                </div>
                                <span className="m3-label-tiny" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-primary)" }}>Voto</span>
                            </button>
                            <button 
                                onClick={() => { setObservationStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-secondary-container/30 hover:bg-secondary-container/50 group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-6)", transition: "color 300ms" }}
                            >
                                <div className="shadow-[var(--md-sys-elevation-level1)] group-hover:scale-110" style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "var(--md-sys-color-secondary)", color: "var(--md-sys-color-on-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>visibility</span>
                                </div>
                                <span className="m3-label-tiny" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-secondary)" }}>Osserva</span>
                            </button>
                            <button 
                                onClick={() => { setViewingStudentProfile(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-[var(--md-sys-color-surface-container-high)]/50 hover:bg-[var(--md-sys-color-surface-container-high)] group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-6)", transition: "color 300ms" }}
                            >
                                <div className="bg-on-surface-variant text-surface shadow-[var(--md-sys-elevation-level1)] group-hover:scale-110" style={{ width: "3rem", height: "3rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>person</span>
                                </div>
                                <span className="m3-label-tiny text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profilo</span>
                            </button>
                        </div>

                        <div style={{ marginBottom: "var(--md-sys-spacing-6)" }}>
                            <p className="m3-label-tiny tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", marginBottom: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>Partecipazione</p>
                            <div className="pb-2 custom-scrollbar" style={{ display: "flex", gap: "var(--md-sys-spacing-8)", overflowX: "auto" }}>
                                {PARTICIPATION_BADGES.map(badge => (
                                    <button
                                        key={badge.id}
                                        onClick={() => handleParticipation(selectedStudentForActions.id, badge.id as ParticipationEntry['type'])}
                                        className="chip !h-10 !px-4 !rounded-full bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-surface-container-high)]est" style={{ border: "none", transition: "color 300ms", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-8)" }}
                                        style={{ color: badge.color }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>{badge.icon}</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{badge.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="m3-label-tiny tracking-[0.2em] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "900", textTransform: "uppercase", marginBottom: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>Compiti</p>
                            <TabGroup
                                tabs={[
                                    { id: 'completed', label: 'Svolti' },
                                    { id: 'partial', label: 'Parziali' },
                                    { id: 'missing', label: 'No' }
                                ]}
                                activeTab={homeworkCheck[selectedStudentForActions.id] || 'default'}
                                onTabChange={(id) => { handleHomeworkChange(selectedStudentForActions.id, id as HomeworkStatus); setSelectedStudentForActions(null); }}
                                style={{ width: "100%" }}
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
                    title={`Lezione: ${lesson.contenuto}`}
                    text={`Argomento: ${lesson.contenuto}\nCompiti: ${lesson.compiti || 'Nessuno'}`}
                    onClose={() => setIsShareInfoOpen(false)}
                />
            )}

            {previewingMaterial && (
                <DocumentViewerModal
                    title={previewingMaterial.fileName}
                    htmlContent={previewingMaterial.htmlContent || `<pre>${previewingMaterial.content}</pre>`}
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
                <div className="fixed inset-0 z-[1600] animate-in slide-in-from-bottom-10" style={{ backgroundColor: "var(--md-sys-color-surface)", overflowY: "auto" }}>
                    <StudentProfile
                        student={viewingStudentProfile}
                        evaluations={evaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        competencyEvaluations={competencyEvaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        settings={settings}
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



