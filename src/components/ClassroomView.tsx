import React, { useState, useMemo } from 'react';
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

    const handlePrintHomework = async () => {
        if (!lesson) return;
        const blob = await generateHomeworkPdf(lesson, settings);
        viewPdfInNewTab(blob);
    };

    return (
        <div className="classroom-view-container h-full flex flex-col bg-surface-container-low">
            <div className="bg-surface z-20 px-4 py-4 flex items-center justify-between border-b border-outline-variant shadow-sm">
                <button onClick={onCloseView} className="icon-button -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>

                <div className="flex gap-8 m3-label-small font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-4 text-primary">
                        <span className="material-symbols-outlined m3-label-large">group</span>
                        <span>{attendanceSummary.present} PRES.</span>
                    </div>
                    <div className={`flex items-center gap-4 ${attendanceSummary.absent > 0 ? 'text-error animate-pulse' : 'text-on-surface-variant opacity-50'}`}>
                        <span className="material-symbols-outlined m3-label-large">person_off</span>
                        <span>{attendanceSummary.absent} ASS.</span>
                    </div>
                </div>

                <button onClick={() => onFinalizeRegister(draftKey)} className="button button-filled !h-8 !px-3 m3-label-small bg-primary">
                    <span className="material-symbols-outlined m3-label-large mr-1">save</span> Fine
                </button>
            </div>

            <div className="px-4 py-3 bg-surface border-b border-outline-variant">
                <h2 className="m3-headline-small font-bold leading-tight">{lesson.materia}</h2>
                <p className="m3-body-small text-on-surface-variant truncate">{lesson.contenuto || 'Lezione'}</p>

                <div className="mt-3">
                    {/* FIX: Add activeTab and onTabChange props to TabGroup */}
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

            <div className="flex-grow overflow-y-auto p-8 pb-24">

                {activeTab === 'register' && (
                    <div className="space-y-4">
                        {lesson.obiettivi && (
                            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant mb-8">
                                <p className="m3-label-small font-bold text-primary uppercase mb-8">Obiettivi Didattici</p>
                                <div className="space-y-2">
                                    {lesson.obiettivi.split('\n').filter(o => o.trim()).map((obj, idx) => (
                                        <label key={idx} className="flex items-start gap-6 cursor-pointer p-1 hover:bg-surface rounded">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {studentStats.map(stat => {
                                const student = stat.student;
                                const status = studentAttendance[student.id] || 'presente';
                                const hwStatus = homeworkCheck[student.id];
                                const badges = participation[student.id] || [];

                                return (
                                    <div key={student.id} className="bg-surface-container rounded-3xl shadow-lg border border-outline-variant p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => setViewingStudentProfile(student)}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 items-center">
                                            {/* Column 1: Avatar + Name + Presence + BES/DSA */}
                                            <div className="flex items-center gap-8 col-span-1 md:col-span-2 lg:col-span-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAttendanceToggle(student.id); }}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${status === 'presente' ? 'bg-primary-container text-primary' :
                                                            status === 'assente' ? 'bg-error-container text-error' : 'bg-tertiary-container text-tertiary'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined m3-label-large">
                                                        {status === 'presente' ? 'check' : status === 'assente' ? 'close' : 'schedule'}
                                                    </span>
                                                </button>
                                                <Avatar name={`${student.nome} ${student.cognome}`} className="w-8 h-8 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <h3 className={`m3-title-small font-bold truncate ${status === 'assente' ? 'line-through' : ''}`}>
                                                        {student.cognome} {student.nome}
                                                    </h3>
                                                    <p className="m3-body-small text-on-surface-variant truncate">{student.classe}</p>
                                                </div>
                                            </div>

                                            {/* Column 2: Average + Trend */}
                                            <div className="text-center col-span-1">
                                                <span className={`m3-title-large font-bold ${parseFloat(stat.grade || '0') > 7 ? 'text-primary' : parseFloat(stat.grade || '0') > 6 ? 'text-secondary' : 'text-error'}`}>
                                                    {stat.grade || '-'}
                                                </span>
                                                <div className="flex justify-center mt-4">
                                                    <span className={`material-symbols-outlined m3-label-large ${stat.trend === 'up' ? 'animate-bounce text-tertiary' : stat.trend === 'down' ? 'animate-pulse text-error' : 'text-on-surface-variant'}`}>
                                                        {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Column 3: Written Evals */}
                                            <div className="text-center col-span-1">
                                                <span className="m3-label-small text-on-surface-variant block">Scritti</span>
                                                <p className="m3-body-large font-bold">{stat.writtenCount > 0 ? `${stat.writtenCount} - ${stat.writtenAvg}` : '-'}</p>
                                            </div>

                                            {/* Column 4: Oral Evals */}
                                            <div className="text-center col-span-1">
                                                <span className="m3-label-small text-on-surface-variant block">Orali</span>
                                                <p className="m3-body-large font-bold">{stat.oralCount > 0 ? `${stat.oralCount} - ${stat.oralAvg}` : '-'}</p>
                                            </div>

                                            {/* Column 5: Notes */}
                                            <div className="text-center col-span-1">
                                                {stat.notes ? (
                                                    <span className="material-symbols-outlined text-primary m3-label-large" title={typeof stat.notes === 'string' ? stat.notes : 'Note presenti'}>edit_note</span>
                                                ) : (
                                                    <span className="text-outline">-</span>
                                                )}
                                            </div>

                                            {/* Column 6: Homework + Participation */}
                                            <div className="flex flex-col items-center gap-4 col-span-1">
                                                {hwStatus && (
                                                    <span className={`m3-label-small px-4 py-1 rounded-full border ${hwStatus === 'missing' ? 'border-error text-error bg-error-container' :
                                                            hwStatus === 'partial' ? 'border-outline text-on-surface-variant bg-surface-container' : 'border-primary text-primary bg-primary-container'
                                                        }`}>
                                                        {hwStatus === 'missing' ? 'No Compiti' : hwStatus === 'partial' ? 'Parziali' : 'OK'}
                                                    </span>
                                                )}
                                                {badges.length > 0 && (
                                                    <span className="m3-label-small px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-4">
                                                        <span className="material-symbols-outlined m3-label-small">star</span> {badges.length}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Column 7: Actions */}
                                            <div className="text-center col-span-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedStudentForActions(student); }}
                                                    className="icon-button text-on-surface-variant"
                                                >
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-surface p-8 rounded-2xl border border-outline-variant">
                            <div className="flex justify-between items-center mb-8">
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

                        <div className="grid grid-cols-2 gap-6">
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
                            <div className="grid grid-cols-1 gap-6">
                                {lesson.materialiDidattici.map(mat => (
                                    <div key={mat.id} className="bg-surface p-6 rounded-xl border border-outline-variant flex items-center gap-6 cursor-pointer active:bg-surface-container" onClick={() => handlePreviewMaterial(mat)}>
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
                                <span className="material-symbols-outlined m3-headline-large mb-8">folder_off</span>
                                <p className="m3-body-medium">Nessun materiale.</p>
                            </div>
                        )}

                        {lesson.adattamenti && (
                            <div className="p-8 bg-secondary-container text-on-secondary-container rounded-xl">
                                <h3 className="m3-title-medium font-bold flex items-center gap-8 mb-8">
                                    <span className="material-symbols-outlined m3-body-medium">accessibility_new</span>
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
                <M3Dialog
                    onClose={() => setSelectedStudentForActions(null)}
                    title={`${selectedStudentForActions.cognome} ${selectedStudentForActions.nome}`}
                    maxWidth="sm"
                    level={1}
                >
                    <M3DialogContent>
                        <div className="flex items-center gap-8 mb-6 border-b border-outline/10 pb-4">
                            <Avatar name={`${selectedStudentForActions.nome} ${selectedStudentForActions.cognome}`} className="w-12 h-12" />
                            <div>
                                <h3 className="text-lg font-black text-on-surface">{selectedStudentForActions.cognome} {selectedStudentForActions.nome}</h3>
                                <p className="m3-label-tiny font-bold uppercase tracking-wider text-primary">Azioni Rapide</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <button 
                                onClick={() => { setQuickEvalStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="flex flex-col items-center gap-8 p-6 rounded-3xl bg-primary-container/30 hover:bg-primary-container/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">grading</span>
                                </div>
                                <span className="m3-label-tiny font-black uppercase tracking-wider text-primary">Voto</span>
                            </button>
                            <button 
                                onClick={() => { setObservationStudent(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="flex flex-col items-center gap-8 p-6 rounded-3xl bg-secondary-container/30 hover:bg-secondary-container/50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">visibility</span>
                                </div>
                                <span className="m3-label-tiny font-black uppercase tracking-wider text-secondary">Osserva</span>
                            </button>
                            <button 
                                onClick={() => { setViewingStudentProfile(selectedStudentForActions); setSelectedStudentForActions(null); }} 
                                className="flex flex-col items-center gap-8 p-6 rounded-3xl bg-surface-container-high/50 hover:bg-surface-container-high transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-on-surface-variant text-surface flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <span className="m3-label-tiny font-black uppercase tracking-wider text-on-surface-variant">Profilo</span>
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="m3-label-tiny font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 px-4">Partecipazione</p>
                            <div className="flex gap-8 overflow-x-auto pb-2 custom-scrollbar">
                                {PARTICIPATION_BADGES.map(badge => (
                                    <button
                                        key={badge.id}
                                        onClick={() => handleParticipation(selectedStudentForActions.id, badge.id as ParticipationEntry['type'])}
                                        className="chip !h-10 !px-4 !rounded-full border-none bg-surface-container-high hover:bg-surface-container-highest transition-colors flex items-center gap-8"
                                        style={{ color: badge.color }}
                                    >
                                        <span className="material-symbols-outlined text-lg">{badge.icon}</span>
                                        <span className="text-xs font-bold">{badge.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="m3-label-tiny font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 px-4">Compiti</p>
                            <TabGroup
                                tabs={[
                                    { id: 'completed', label: 'Svolti' },
                                    { id: 'partial', label: 'Parziali' },
                                    { id: 'missing', label: 'No' }
                                ]}
                                activeTab={homeworkCheck[selectedStudentForActions.id] || 'default'}
                                onTabChange={(id) => { handleHomeworkChange(selectedStudentForActions.id, id as HomeworkStatus); setSelectedStudentForActions(null); }}
                                className="w-full"
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
                <div className="fixed inset-0 z-[1600] bg-surface overflow-y-auto animate-in slide-in-from-bottom-10">
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
