import React, { useState, useMemo } from 'react';
import { Studente, RegisterEntry, Lezione, MaterialeDidattico, KnowledgeBaseEntry, ClassroomViewProps, HomeworkStatus, ObservationEntry, Valutazione, ParticipationEntry } from '../types';
import { PARTICIPATION_BADGES } from '../constants';
import ClassroomTools from './ClassroomTools';
import ShareModal from './ShareModal';
import DocumentViewerModal from './DocumentViewerModal';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import ObservationModal from './ObservationModal';
import CopyForRegisterModal from './CopyForRegisterModal';
import QuickEvaluationModal from './QuickEvaluationModal';
import { TabGroup, InfoCard } from './M3Components';
import { calculatePerformance } from '../utils/evaluationUtils';
import Avatar from './Avatar';
import StudentProfile from './StudentProfile';
import { generateHomeworkPdf, viewPdfInNewTab } from '../utils/documentUtils';

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
    onNavigate,
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

    const studentAverage = (studentId: string): string => {
        const sEvals = evaluations.filter(e => e.studenteId === studentId);
        const { grade } = calculatePerformance(studentId, 'Complessivo', sEvals);
        return grade || '-';
    };

    const handlePrintHomework = async () => {
        if (!lesson) return;
        const blob = await generateHomeworkPdf(lesson, settings);
        viewPdfInNewTab(blob);
    };

    return (
        <div className="classroom-view-container h-full flex flex-col bg-surface-container-low">
            <div className="bg-surface z-20 px-4 py-2 flex items-center justify-between border-b border-outline-variant shadow-sm">
                <button onClick={onCloseView} className="icon-button -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>

                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm">group</span>
                        <span>{attendanceSummary.present} PRES.</span>
                    </div>
                    <div className={`flex items-center gap-1 ${attendanceSummary.absent > 0 ? 'text-error animate-pulse' : 'text-on-surface-variant opacity-50'}`}>
                        <span className="material-symbols-outlined text-sm">person_off</span>
                        <span>{attendanceSummary.absent} ASS.</span>
                    </div>
                </div>

                <button onClick={() => onFinalizeRegister(draftKey)} className="button button-filled !h-8 !px-3 text-xs bg-primary">
                    <span className="material-symbols-outlined text-sm mr-1">save</span> Fine
                </button>
            </div>

            <div className="px-4 py-3 bg-surface border-b border-outline-variant">
                <h2 className="m3-headline-small font-bold leading-tight">{lesson.materia}</h2>
                <p className="m3-body-small text-on-surface-variant truncate">{lesson.contenuto || 'Lezione'}</p>

                <div className="mt-3">
                    {/* FIX: Add activeTab and onTabChange props to TabGroup */}
                    <TabGroup
                        activeTab={activeTab}
                        onTabChange={(id) => setActiveTab(id as any)}
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

            <div className="flex-grow overflow-y-auto p-4 pb-24">

                {activeTab === 'register' && (
                    <div className="space-y-4">
                        {lesson.obiettivi && (
                            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant mb-4">
                                <p className="m3-label-small font-bold text-primary uppercase mb-2">Obiettivi Didattici</p>
                                <div className="space-y-2">
                                    {lesson.obiettivi.split('\n').filter(o => o.trim()).map((obj, idx) => (
                                        <label key={idx} className="flex items-start gap-3 cursor-pointer p-1 hover:bg-surface rounded">
                                            <input
                                                type="checkbox"
                                                checked={checkedObjectives[idx] || false}
                                                onChange={(e) => handleObjectiveCheck(idx, e.target.checked)}
                                                className="mt-0.5 accent-primary w-4 h-4"
                                            />
                                            <span className={`m3-body-medium leading-tight ${checkedObjectives[idx] ? 'line-through opacity-50' : 'text-on-surface'}`}>
                                                {obj.replace(/^- /, '')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {classStudents.map(student => {
                                const status = studentAttendance[student.id] || 'presente';
                                const hwStatus = homeworkCheck[student.id];
                                const badges = participation[student.id] || [];

                                return (
                                    <div key={student.id} className={`flex items-center p-3 rounded-2xl border transition-all ${status === 'assente' ? 'bg-surface-container-low border-transparent opacity-60' : 'bg-surface border-outline-variant shadow-sm'}`}>

                                        <button
                                            onClick={() => handleAttendanceToggle(student.id)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 transition-colors flex-shrink-0 ${status === 'presente' ? 'bg-primary-container text-primary' :
                                                    status === 'assente' ? 'bg-error-container text-error' : 'bg-tertiary-container text-tertiary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl">
                                                {status === 'presente' ? 'check' : status === 'assente' ? 'close' : 'schedule'}
                                            </span>
                                        </button>

                                        <div className="flex-grow min-w-0" onClick={() => setViewingStudentProfile(student)}>
                                            <div className="flex justify-between items-start">
                                                <h3 className={`m3-title-medium font-bold truncate leading-tight ${status === 'assente' ? 'line-through' : ''}`}>
                                                    {student.cognome} {student.nome}
                                                </h3>
                                                <span className="m3-label-small font-mono bg-surface-container-high px-1.5 rounded text-on-surface-variant">
                                                    Avg: {studentAverage(student.id)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {hwStatus && (
                                                    <span className={`text-[10px] px-1.5 rounded border ${hwStatus === 'missing' ? 'border-error text-error' :
                                                            hwStatus === 'partial' ? 'border-outline text-on-surface-variant' : 'border-primary text-primary'
                                                        }`}>
                                                        {hwStatus === 'missing' ? 'No Compiti' : hwStatus === 'partial' ? 'Parziali' : 'Compiti OK'}
                                                    </span>
                                                )}
                                                {badges.length > 0 && (
                                                    <span className="text-[10px] px-1.5 rounded bg-secondary-container text-on-secondary-container flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[10px]">star</span> {badges.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedStudentForActions(student)}
                                            className="icon-button ml-1 text-on-surface-variant"
                                        >
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-surface p-4 rounded-2xl border border-outline-variant">
                            <div className="flex justify-between items-center mb-2">
                                <label className="m3-label-large">Note Pubbliche (Registro)</label>
                                <VoiceNoteRecorder onTranscription={(text) => onUpdateDraftEntry(draftKey, { notes: (draftEntry.notes ? draftEntry.notes + '\n' : '') + text })} compact />
                            </div>
                            <textarea
                                value={draftEntry.notes || ''}
                                onChange={e => onUpdateDraftEntry(draftKey, { notes: e.target.value })}
                                className="form-textarea w-full bg-surface-container-low"
                                rows={8}
                                placeholder="Argomenti trattati, note disciplinari, promemoria..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setIsCopyModalOpen(true)} className="button button-tonal w-full justify-center">
                                <span className="material-symbols-outlined mr-2">content_copy</span>
                                Copia
                            </button>
                            <button onClick={() => setIsShareInfoOpen(true)} className="button button-outlined w-full justify-center">
                                <span className="material-symbols-outlined mr-2">share</span>
                                Condividi
                            </button>
                            <button onClick={handlePrintHomework} className="button button-filled w-full justify-center col-span-2">
                                <span className="material-symbols-outlined mr-2">assignment</span>
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
                    <div className="space-y-4 animate-in fade-in">
                        {lesson.materialiDidattici && lesson.materialiDidattici.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {lesson.materialiDidattici.map(mat => (
                                    <div key={mat.id} className="bg-surface p-3 rounded-xl border border-outline-variant flex items-center gap-3 cursor-pointer active:bg-surface-container" onClick={() => handlePreviewMaterial(mat)}>
                                        <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                                            <span className="material-symbols-outlined">
                                                {mat.type === 'link' ? 'link' : 'article'}
                                            </span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="m3-body-medium font-bold truncate">{mat.label || mat.fileName}</p>
                                            <p className="m3-body-small text-on-surface-variant uppercase">{mat.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 opacity-60">
                                <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                                <p className="m3-body-medium">Nessun materiale.</p>
                            </div>
                        )}

                        {lesson.adattamenti && (
                            <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl">
                                <h3 className="m3-title-medium font-bold flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-base">accessibility_new</span>
                                    Inclusione
                                </h3>
                                <p className="m3-body-medium opacity-90 whitespace-pre-wrap">{lesson.adattamenti}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-30">
                <button onClick={onOpenLiveAssistant} className="fab bg-tertiary-container text-on-tertiary-container shadow-lg">
                    <span className="material-symbols-outlined">mic</span>
                </button>
            </div>

            {selectedStudentForActions && (
                <div className="dialog-backdrop !items-end sm:!items-center" onClick={() => setSelectedStudentForActions(null)}>
                    <div className="bg-surface w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-4 animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto mb-4 sm:hidden"></div>

                        <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
                            {/* FIX: Use correct properties nome and cognome */}
                            <Avatar name={selectedStudentForActions.nome} surname={selectedStudentForActions.cognome} />
                            <div>
                                {/* FIX: Use correct properties nome and cognome */}
                                <h3 className="m3-headline-small">{selectedStudentForActions.cognome} {selectedStudentForActions.nome}</h3>
                                <p className="m3-body-small text-on-surface-variant">Azioni Rapide</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <button onClick={() => { setQuickEvalStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center"><span className="material-symbols-outlined">grading</span></div>
                                <span className="m3-label-small">Voto</span>
                            </button>
                            <button onClick={() => { setObservationStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><span className="material-symbols-outlined">visibility</span></div>
                                <span className="m3-label-small">Osserva</span>
                            </button>
                            <button onClick={() => { setViewingStudentProfile(selectedStudentForActions); setSelectedStudentForActions(null); }} className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center"><span className="material-symbols-outlined">person</span></div>
                                <span className="m3-label-small">Profilo</span>
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="m3-label-small font-bold uppercase text-on-surface-variant mb-2">Partecipazione</p>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {PARTICIPATION_BADGES.map(badge => (
                                    <button
                                        key={badge.id}
                                        onClick={() => handleParticipation(selectedStudentForActions.id, badge.id as ParticipationEntry['type'])}
                                        className="chip pr-3 pl-2 border-none bg-surface-container-high"
                                        style={{ color: badge.color }}
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">{badge.icon}</span>
                                        {badge.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="m3-label-small font-bold uppercase text-on-surface-variant mb-2">Compiti</p>
                            {/* FIX: Added activeTab and onTabChange props to TabGroup */}
                            <TabGroup
                                tabs={[
                                    { id: 'completed', label: 'Svolti' },
                                    { id: 'partial', label: 'Parziali' },
                                    { id: 'missing', label: 'No' }
                                ]}
                                activeTab={homeworkCheck[selectedStudentForActions.id] || 'default'}
                                onTabChange={(id) => { handleHomeworkChange(selectedStudentForActions.id, id as HomeworkStatus); setSelectedStudentForActions(null); }}
                                variant="secondary"
                                className="full-width"
                            />
                        </div>
                    </div>
                </div>
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
                    onSaveCompetencyEvaluation={(data) => { /* Logic handled in parent or modal directly if needed */ }}
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
                <div className="fixed inset-0 z-[1600] bg-surface overflow-y-auto animate-in slide-in-from-bottom-10">
                    <StudentProfile
                        student={viewingStudentProfile}
                        evaluations={evaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        competencyEvaluations={competencyEvaluations.filter(e => e.studenteId === viewingStudentProfile.id)}
                        settings={settings}
                        onBack={() => setViewingStudentProfile(null)}
                        onDeleteEvaluation={(id) => {/* Handle delete */ }}
                        onDeleteCompetencyEvaluation={(id) => {/* Handle delete */ }}
                        register={[]}
                        lessons={lessons}
                    />
                </div>
            )}
        </div>
    );
};

export default ClassroomView;
