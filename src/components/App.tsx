// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026

import AssistantModal from './AssistantModal';
import '../font-setup';
import * as React from 'react';
import '../design-system/typography.css';
import '../design-system/spacing.css';
import '../design-system/breakpoints.css';
import '../design-system/accessibility-focus.css';
import AssistantFab from './AssistantFab';
import { useAppEngine } from '../hooks/useAppEngine';
import ViewManager from './ViewManager';
import { ModalManager } from './ModalManager';
import PassaggioAnnoWizard from './PassaggioAnnoWizard';
import Snackbar from './Snackbar';
import ErrorBoundary from './ErrorBoundary';
import { AppLayout } from './AppLayout.md3';
import ImageAnalysisModal from './ImageAnalysisModal';
import VideoAnalysisModal from './VideoAnalysisModal';
import HelpModal from './HelpModal';
import CircolareAnalysisModal from './CircolareAnalysisModal';
import OperationsCenter from './OperationsCenter';
import NKABottomSheet from '../nka/NKABottomSheet';
import { useNKAStore } from '../nka/useNKAStore';

const handleImportEvents = () => {};
const handleSaveToKb = () => {};

const App: React.FC = () => {
    const {
        view,
        viewContext,
        appState,
        actions,
        modals
    } = useAppEngine();
    const aiSettings = appState.aiSettings;
    const isGlobalAiLoading = appState.isGlobalAiLoading;
    const installPrompt = appState.installPrompt;
    const activeSuggestion = appState.activeSuggestion;
    // assistantMode is not in AppState, set default value
    const [assistantMode] = React.useState<'chat' | 'docs' | 'tools' | 'backup'>('chat');
    const nkaStore = useNKAStore();
    const user = appState.user;
    const notifiche = appState.notifiche;

    // Modal state
    const [openModal, setOpenModal] = React.useState<string | null>(null);
    const [circularAnalysisPayload, setCircularAnalysisPayload] = React.useState<{ url: string; title: string } | null>(null);

    // Modal handlers
    const handleOpenImageAnalysis = () => setOpenModal('image-analysis-modal');
    const handleOpenVideoAnalysis = () => setOpenModal('video-analysis-modal');
    const handleOpenHelp = () => setOpenModal('help-modal');
    const handleOpenCircularAnalysis = (url: string, title: string) => {
        setCircularAnalysisPayload({ url, title });
        setOpenModal('circular-analysis-modal');
    };
    const handleCloseModal = () => setOpenModal(null);

    return (
        <AppLayout
            view={view}
            onNavigate={actions.handleNavigate}
            user={user}
            settings={appState.settings}
            notifiche={notifiche}
            setNotifiche={actions.setNotifiche}
            onBack={actions.handleBack}
            onOpenImageAnalysis={handleOpenImageAnalysis}
            onOpenVideoAnalysis={handleOpenVideoAnalysis}
            onOpenHelp={handleOpenHelp}
            onOpenCircularAnalysis={handleOpenCircularAnalysis}
            isAiProcessing={isGlobalAiLoading}
            installPrompt={installPrompt}
            onInstallApp={actions.handleInstallApp}
            onOpenOperations={() => setOpenModal('operations-center')}
            hasSuggestion={!!activeSuggestion}
        >
            <ErrorBoundary>
                <ViewManager
                    view={view}
                    viewContext={viewContext}
                    appState={appState}
                    actions={actions}
                    modals={modals}
                />
                <ModalManager appState={appState} actions={actions} modals={modals} />
                {/* Modal rendering */}
                {openModal === 'image-analysis-modal' && (
                        <ImageAnalysisModal onClose={handleCloseModal} />
                    )}
                {openModal === 'video-analysis-modal' && (
                        <VideoAnalysisModal onClose={handleCloseModal} />
                    )}
                {openModal === 'help-modal' && (
                        <HelpModal onClose={handleCloseModal} onNavigate={actions.handleNavigate} aiSettings={aiSettings} setIsLoadingModalOpen={modals.setIsLoadingModalOpen} setLoadingModalMessage={modals.setLoadingModalMessage} />
                    )}
                {openModal === 'circular-analysis-modal' && circularAnalysisPayload && (
                        <CircolareAnalysisModal
                            url={circularAnalysisPayload.url}
                            title={circularAnalysisPayload.title}
                            onClose={handleCloseModal}
                            aiSettings={aiSettings}
                            onImportEvents={handleImportEvents}
                            onSaveToKb={handleSaveToKb}
                        />
                    )}
                {openModal === 'operations-center' && (
                        <OperationsCenter
                            onClose={handleCloseModal}
                            onNavigate={actions.handleNavigate}
                            onAction={(action) => {
                                if (action === 'year-transition-modal') {
                                    setOpenModal('year-transition-wizard');
                                } else if (action === 'load-demo') {
                                    actions.handleLoadDemoData();
                                    handleCloseModal();
                                } else if (action === 'live-assistant') {
                                    setOpenModal('assistant-modal');
                                } else if (action === 'video-analysis') {
                                    setOpenModal('video-analysis-modal');
                                } else if (action === 'nka-map') {
                                    setOpenModal('nka-map-modal');
                                }
                            }}
                            activeSuggestion={appState.activeSuggestion?.id}
                            students={appState.students}
                            settings={appState.settings}
                            evaluations={appState.evaluations}
                            competencyEvaluations={appState.competencyEvals}
                            register={appState.finalizedRegister}
                            onPromoteStudents={actions.handlePromoteStudents}
                            onResetData={actions.handleResetYearData}
                            onBackupData={actions.handleExportData}
                        />
                    )}
                {openModal === 'year-transition-wizard' && (
                        <PassaggioAnnoWizard
                            onClose={handleCloseModal}
                            students={appState.students}
                            settings={appState.settings}
                            evaluations={appState.evaluations}
                            competencyEvaluations={appState.competencyEvals}
                            register={appState.finalizedRegister}
                            onPromoteStudents={actions.handlePromoteStudents}
                            onBackupData={actions.handleExportData}
                            onResetData={actions.handleResetYearData}
                        />
                    )}
                {openModal === 'assistant-modal' && (
                        <AssistantModal open={true} onClose={handleCloseModal} mode={assistantMode} aiSettings={aiSettings} context={{ view, viewContext }} />
                    )}
                {openModal === 'nka-map-modal' && (
                        <NKABottomSheet open={true} nodes={nkaStore.nodes} onClose={handleCloseModal} onNodeSelect={() => {}} />
                    )}
                <AssistantFab />
                {modals.isLiveAssistantModalOpen && (
                        <AssistantModal
                            open={true}
                            onClose={() => modals.setIsLiveAssistantModalOpen?.(false)}
                            mode={assistantMode}
                            aiSettings={aiSettings}
                            context={{ view, viewContext }}
                        />
                    )}
                <Snackbar />
            </ErrorBoundary>
        </AppLayout>
    );
};

export { App };
export default App;
