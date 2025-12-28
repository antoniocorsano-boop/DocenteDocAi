import React from 'react';
import OperationsCenter from './OperationsCenter';
import ImageAnalysisModal from './ImageAnalysisModal';
import HelpModal from './HelpModal';
import CircolareAnalysisModal from './CircolareAnalysisModal';
import LoadingModal from './LoadingModal';
import SlotActionModal from './SlotActionModal';
import BackupInfoModal from './BackupInfoModal';
import SyncConflictModal from './SyncConflictModal';
import { CreateLessonFromAiModal } from './CreateLessonFromAiModal';
import PassaggioAnnoWizard from './PassaggioAnnoWizard';
import VideoAnalysisModal from './VideoAnalysisModal';

import EditSlotModal from './EditSlotModal';
import type { AppState, AppActions, Modals } from '../types';

interface ModalManagerProps {
    appState: AppState;
    actions: AppActions;
    modals: Partial<Modals>;
}

export const ModalManager: React.FC<ModalManagerProps> = ({ appState, actions, modals }) => {
    const { students, settings, evaluations, competencyEvals, finalizedRegister, draftRegister, slots, lessons, pianiInclusione, knowledgeBase, aiSettings } = appState;
    const { handleNavigate, onScheduleLesson, handleLoadDemoData, handlePromoteStudents, handleResetYearData, handleExportData, setLessons, setSlots, handleStartClassroom } = actions;

    const activeSlot = modals.activeSlotKey ? slots[modals.activeSlotKey] : null;
    const activeLesson = modals.lessonViewContext;

    // Check if there is an active draft for this slot
    const isDraftExisting = modals.activeSlotKey ? !!draftRegister[modals.activeSlotKey] : false;

    return (
        <>
            {modals.isOperationsCenterOpen && (
                <OperationsCenter
                    onClose={() => modals.setIsOperationsCenterOpen?.(false)}
                    onNavigate={handleNavigate}
                    onAction={(action) => {
                        if (action === 'year-transition-modal') {
                            modals.setIsYearTransitionOpen?.(true);
                        } else if (action === 'load-demo') {
                            handleLoadDemoData();
                            modals.setIsOperationsCenterOpen?.(false);
                        } else if (action === 'live-assistant') {
                            console.warn('[DEBUG] Trigger: ModalManager -> OperationsCenter -> live-assistant');
                            modals.setIsLiveAssistantModalOpen?.(true);
                        } else if (action === 'video-analysis') {
                            modals.setIsVideoAnalysisOpen?.(true);
                        }
                    }}
                    activeSuggestion={appState.activeSuggestion?.id}
                    students={students}
                    settings={settings}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    register={finalizedRegister}
                    onPromoteStudents={handlePromoteStudents}
                    onResetData={handleResetYearData}
                    onBackupData={handleExportData}
                />
            )}

            {modals.isYearTransitionOpen && (
                <PassaggioAnnoWizard
                    onClose={() => modals.setIsYearTransitionOpen?.(false)}
                    students={students}
                    settings={settings}
                    evaluations={evaluations}
                    competencyEvaluations={competencyEvals}
                    register={finalizedRegister}
                    onPromoteStudents={handlePromoteStudents}
                    onBackupData={async () => { await handleExportData(); }}
                    onResetData={handleResetYearData}
                />
            )}

            {modals.isImageAnalysisOpen && (
                <ImageAnalysisModal
                    onClose={() => modals.setIsImageAnalysisOpen?.(false)}
                    aiSettings={aiSettings}
                />
            )}

            {modals.isVideoAnalysisOpen && (
                <VideoAnalysisModal onClose={() => modals.setIsVideoAnalysisOpen?.(false)} />
            )}



            {modals.isHelpOpen && (
                <HelpModal
                    onClose={() => modals.setIsHelpOpen?.(false)}
                    onNavigate={handleNavigate}
                    aiSettings={aiSettings}
                    setIsLoadingModalOpen={modals.setIsLoadingModalOpen ?? (() => {})}
                    setLoadingModalMessage={modals.setLoadingModalMessage ?? (() => {})}
                />
            )}

            {modals.circularAnalysisModal?.isOpen && (
                <CircolareAnalysisModal
                    url={modals.circularAnalysisModal.url ?? ''}
                    title={modals.circularAnalysisModal.title ?? ''}
                    onClose={() => modals.setCircularAnalysisModal?.(null)}
                    aiSettings={aiSettings}
                    onImportEvents={(events) => {
                        actions.setEventi((prev: typeof appState.eventi) => {
                            const newEvents = events.map(e => ({
                                ...e,
                                id: `evt-${Date.now()}-${Math.random()}`,
                                titolo: e.titolo ?? '',
                                data: e.data ?? '',
                                tipo: e.tipo ?? 'impegno',
                            }));
                            return [...prev, ...newEvents];
                        });
                        actions.showToast(`${events.length} eventi importati.`, 'success');
                    }}
                    onSaveToKb={(note) => {
                        actions.setKnowledgeBase((prev: typeof appState.knowledgeBase) => [...prev, {
                            id: `kb-note-${Date.now()}`,
                            fileName: note.title + '.txt',
                            content: note.content,
                            category: 'normativa',
                            isGenerated: true
                        }]);
                        actions.showToast('Nota salvata in KB.', 'success');
                    }}
                />
            )}

            {modals.isLoadingModalOpen && (
                <LoadingModal message={modals.loadingModalMessage ?? ''} />
            )}

            {modals.isBackupInfoModalOpen && (
                <BackupInfoModal onClose={() => modals.setIsBackupInfoModalOpen?.(false)} />
            )}

            {modals.syncConflictModal?.isOpen && modals.syncConflictModal?.data && (
                <SyncConflictModal
                    data={modals.syncConflictModal.data}
                    onRestore={() => {
                        actions.handleRestoreFromDrive();
                        modals.setSyncConflictModal?.({ isOpen: false, data: null });
                    }}
                    onIgnore={() => {
                        actions.handleSyncToDrive();
                        modals.setSyncConflictModal?.({ isOpen: false, data: null });
                    }}
                />
            )}

            {modals.createLessonContext?.isOpen && modals.createLessonContext?.lezione && (
                <CreateLessonFromAiModal
                    content={{ title: '', htmlContent: '', ...(modals.createLessonContext.lezione as object) }}
                    onClose={() => modals.setCreateLessonContext?.({ isOpen: false, slotKey: null, lezione: null })}
                    onSave={(lessonData) => {
                        const newLesson = {
                            ...lessonData,
                            id: `lesson-ai-${Date.now()}`,
                            svolta: false
                        };
                        actions.setLessons((prev: typeof appState.lessons) => ({ ...prev, [newLesson.id]: newLesson }));
                        actions.showToast('Lezione creata da AI!', 'success');
                    }}
                    userClasses={settings.classi}
                    disciplines={settings.disciplines}
                    students={students}
                    pianiInclusione={pianiInclusione}
                    aiSettings={aiSettings}
                    slots={slots}
                    onSchedule={onScheduleLesson}
                    curricula={appState.curricula}
                />
            )}

            {activeSlot && activeLesson && modals.activeSlotKey && !modals.editingSlotKey && (
                <SlotActionModal
                    slot={activeSlot}
                    lesson={activeLesson}
                    isDraftExisting={isDraftExisting}
                    onClose={() => { modals.setActiveSlotKey?.(null); modals.setLessonViewContext?.(null); }}
                    onEdit={() => { modals.setEditingSlotKey?.(modals.activeSlotKey ?? null); modals.setActiveSlotKey?.(null); }}
                    onStart={() => {
                        actions.handleStartClassroom(activeSlot.classe!, activeSlot.materia!, modals.activeSlotKey!, activeLesson);
                        modals.setActiveSlotKey?.(null);
                    }}
                    onView={() => {
                        actions.handleNavigate('lessons');
                        modals.setActiveSlotKey?.(null);
                    }}
                />
            )}

            {/* Edit slot modal (open when user clicks an empty cell or chooses Edit) */}
            {modals.editingSlotKey ? (() => {
                const slotKey = modals.editingSlotKey as string;
                if (!slotKey) return null;
                const slot = slots[slotKey] || { giorno: slotKey.split('-')[0] || '', ora: slotKey.split('-')[1] || '' };
                const lesson = slot && slot.lezioneId ? lessons[slot.lezioneId] : undefined;
                return (
                    <EditSlotModal
                        slot={slot}
                        lesson={lesson}
                        allLessons={lessons}
                        allSlots={slots}
                        udas={appState.udas}
                        onClose={() => { modals.setEditingSlotKey?.(null); }}
                        onSave={(key: string, slotData: typeof slot) => {
                            setSlots((prev: typeof slots) => ({ ...prev, [key]: slotData }));
                            modals.setEditingSlotKey?.(null);
                        }}
                        onDelete={(key: string) => {
                            // remove lesson association if exists
                            const s = slots[key];
                            if (s?.lezioneId) {
                                const lid = s.lezioneId;
                                setLessons((prev: typeof lessons) => {
                                    const cp = { ...prev };
                                    delete cp[lid];
                                    return cp;
                                });
                            }
                            setSlots((prev: typeof slots) => {
                                const cp = { ...prev };
                                delete cp[key];
                                return cp;
                            });
                            modals.setEditingSlotKey?.(null);
                        }}
                        onSaveLesson={(lessonData: typeof lesson, key: string) => {
                            if (!lessonData) return;
                            const id = lessonData.id || `les-${Date.now()}`;
                            const newLesson = { ...lessonData, id };
                            setLessons((prev: typeof lessons) => ({ ...prev, [id]: newLesson }));
                            setSlots((prev: typeof slots) => ({ ...prev, [key]: { ...(prev[key] || {}), lezioneId: id, classe: newLesson.classe ?? '', materia: newLesson.materia ?? '' } }));
                            modals.setEditingSlotKey?.(null);
                        }}
                        onStartClassroom={(classe: string, materia: string, key: string, lessonObj: typeof lesson) => {
                            if (!lessonObj) return;
                            handleStartClassroom(classe, materia, key, lessonObj);
                            modals.setEditingSlotKey?.(null);
                        }}
                        timetableSettings={settings}
                        userClasses={settings.classi}
                        aiSettings={aiSettings}
                        students={students}
                        knowledgeBase={knowledgeBase}
                        pianiInclusione={pianiInclusione}
                    />
                );
            })() : null}
        </>
    );
};
