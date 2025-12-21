import React from 'react';
import OperationsCenter from './OperationsCenter';
import ImageAnalysisModal from './ImageAnalysisModal';
import LiveAssistantModal from './LiveAssistantModal';
import HelpModal from './HelpModal';
import CircolareAnalysisModal from './CircolareAnalysisModal';
import LoadingModal from './LoadingModal';
import SlotActionModal from './SlotActionModal';
import BackupInfoModal from './BackupInfoModal';
import SyncConflictModal from './SyncConflictModal';
import { CreateLessonFromAiModal } from './CreateLessonFromAiModal';
import PassaggioAnnoWizard from './PassaggioAnnoWizard';
import VideoAnalysisModal from './VideoAnalysisModal';
import { AppState, AppActions, EventoCalendario } from '../types'; // FIX: Corrected import path to ../types

interface ModalManagerProps {
    appState: AppState;
    actions: AppActions;
    modals: any;
}

export const ModalManager: React.FC<ModalManagerProps> = ({ appState, actions, modals }) => {
    const { students, settings, evaluations, competencyEvals, finalizedRegister, draftRegister, slots, lessons, pianiInclusione, knowledgeBase, aiSettings } = appState;
    const { handleNavigate, onScheduleLesson, handleAddEvaluation, handleCreateUda, handleAddNote, onMarkAttendance, handleLoadDemoData, handlePromoteStudents, handleResetYearData, handleExportData } = actions;

    const activeSlot = modals.activeSlotKey ? slots[modals.activeSlotKey] : null;
    const activeLesson = modals.lessonViewContext;

    // Check if there is an active draft for this slot
    const isDraftExisting = modals.activeSlotKey ? !!draftRegister[modals.activeSlotKey] : false;

    return (
        <>
            {modals.isOperationsCenterOpen && (
                <OperationsCenter
                    onClose={() => modals.setIsOperationsCenterOpen(false)}
                    onNavigate={handleNavigate}
                    onAction={(action) => {
                        if (action === 'year-transition-modal') {
                            modals.setIsYearTransitionOpen(true);
                        } else if (action === 'load-demo') {
                            handleLoadDemoData();
                            modals.setIsOperationsCenterOpen(false);
                        } else if (action === 'live-assistant') {
                            modals.setIsLiveAssistantModalOpen(true);
                        } else if (action === 'video-analysis') {
                            modals.setIsVideoAnalysisOpen(true);
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
                    onClose={() => modals.setIsYearTransitionOpen(false)}
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
                    onClose={() => modals.setIsImageAnalysisOpen(false)}
                    aiSettings={aiSettings}
                />
            )}

            {modals.isVideoAnalysisOpen && (
                <VideoAnalysisModal onClose={() => modals.setIsVideoAnalysisOpen(false)} />
            )}

            {modals.isLiveAssistantModalOpen && (
                <LiveAssistantModal
                    onClose={() => modals.setIsLiveAssistantModalOpen(false)}
                    students={students}
                    evaluations={evaluations}
                    slots={slots}
                    lessons={lessons}
                    pianiInclusione={pianiInclusione}
                    knowledgeBase={knowledgeBase}
                    onNavigate={handleNavigate}
                    onScheduleLesson={onScheduleLesson}
                    onAddEvaluation={handleAddEvaluation}
                    onCreateUda={handleCreateUda}
                    onAddNote={handleAddNote}
                    onMarkAttendance={onMarkAttendance}
                    onLoadDemoData={handleLoadDemoData}
                    userContext={appState.user}
                    onCreateEvent={(eventData) => {
                        const newEvent: EventoCalendario = { ...eventData, id: `evt-${Date.now()}-${Math.random()}` };
                        actions.setEventi(prev => [...prev, newEvent]);
                        actions.showToast('Evento creato!', 'success');
                    }}
                />
            )}

            {modals.isHelpOpen && (
                <HelpModal
                    onClose={() => modals.setIsHelpOpen(false)}
                    onNavigate={handleNavigate}
                    aiSettings={aiSettings}
                    setIsLoadingModalOpen={modals.setIsLoadingModalOpen}
                    setLoadingModalMessage={modals.setLoadingModalMessage}
                />
            )}

            {modals.circularAnalysisModal?.isOpen && (
                <CircolareAnalysisModal
                    url={modals.circularAnalysisModal.url}
                    title={modals.circularAnalysisModal.title}
                    onClose={() => modals.setCircularAnalysisModal(null)}
                    aiSettings={aiSettings}
                    onImportEvents={(events) => {
                        actions.setEventi(prev => {
                            const newEvents = events.map(e => ({
                                ...e,
                                id: `evt-${Date.now()}-${Math.random()}`
                            } as any));
                            return [...prev, ...newEvents];
                        });
                        actions.showToast(`${events.length} eventi importati.`, 'success');
                    }}
                    onSaveToKb={(note) => {
                        actions.setKnowledgeBase(prev => [...prev, {
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
                <LoadingModal message={modals.loadingModalMessage} />
            )}

            {modals.isBackupInfoModalOpen && (
                <BackupInfoModal onClose={() => modals.setIsBackupInfoModalOpen(false)} />
            )}

            {modals.syncConflictModal && (
                <SyncConflictModal
                    data={modals.syncConflictModal}
                    onRestore={() => {
                        actions.handleRestoreFromDrive();
                        modals.setSyncConflictModal(null);
                    }}
                    onIgnore={() => {
                        actions.handleSyncToDrive();
                        modals.setSyncConflictModal(null);
                    }}
                />
            )}

            {modals.createLessonContext && (
                <CreateLessonFromAiModal
                    content={modals.createLessonContext}
                    onClose={() => modals.setCreateLessonContext(null)}
                    onSave={(lessonData) => {
                        const newLesson = {
                            ...lessonData,
                            id: `lesson-ai-${Date.now()}`,
                            svolta: false
                        };
                        actions.setLessons(prev => ({ ...prev, [newLesson.id]: newLesson }));
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
                    onClose={() => { modals.setActiveSlotKey(null); modals.setLessonViewContext(null); }}
                    onEdit={() => { modals.setEditingSlotKey(modals.activeSlotKey); modals.setActiveSlotKey(null); }}
                    onStart={() => {
                        actions.handleStartClassroom(activeSlot.classe!, activeSlot.materia!, modals.activeSlotKey!, activeLesson);
                        modals.setActiveSlotKey(null);
                    }}
                    onView={() => {
                        actions.handleNavigate('lessons');
                        modals.setActiveSlotKey(null);
                    }}
                />
            )}
        </>
    );
};
