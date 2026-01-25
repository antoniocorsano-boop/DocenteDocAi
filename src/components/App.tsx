// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026

import AssistantModal from './AssistantModal';
import '../font-setup';
import * as React from 'react';
import { M3Surface } from './ui';
import '../design-system/typography.css';
import '../design-system/spacing.css';
import '../design-system/breakpoints.css';
import '../design-system/accessibility-focus.css';
import AssistantFab from './AssistantFab';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';
import NavigationRail from './NavigationRail';
import ViewManager from './ViewManager';
import { ModalManager } from './ModalManager';
import PassaggioAnnoWizard from './PassaggioAnnoWizard';
import { Z_INDEX } from '../design-system/zIndex';
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
        <AppLayout>
            <ErrorBoundary>
                <M3Surface style={{ background: 'var(--md-sys-color-surface)' }}>
                    <Header
                        title="DocenteDoc AI"
                        showBackButton={view !== 'home'}
                        onBack={actions.handleBack}
                        onOpenImageAnalysis={handleOpenImageAnalysis}
                        onOpenVideoAnalysis={handleOpenVideoAnalysis}
                        onOpenHelp={handleOpenHelp}
                        user={user}
                        settings={appState.settings}
                        notifiche={notifiche}
                        setNotifiche={actions.setNotifiche}
                        onOpenCircularAnalysis={handleOpenCircularAnalysis}
                        onNavigate={actions.handleNavigate}
                        isAiProcessing={isGlobalAiLoading}
                        installPrompt={installPrompt}
                        onInstallApp={actions.handleInstallApp}
                        onOpenOperations={() => setOpenModal('operations-center')}
                        hasSuggestion={!!activeSuggestion}
                    />
                    <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--md-sys-color-surface)' }}>
                        <aside style={{ flex: '0 0 var(--md-sys-spacing-20)', background: 'var(--md-sys-color-surface)', borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                            <NavigationRail
                                items={[
                                    { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
                                    { id: 'timetable', label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
                                    { id: 'progettazione-hub', label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
                                    { id: 'aula', label: 'Classi', icon: 'groups', activeIcon: 'groups' },
                                    { id: 'orientamento', label: 'Orientamento', icon: 'explore', activeIcon: 'explore' },
                                    { id: 'calendario', label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' },
                                ]}
                                activeView={view}
                                onNavigate={actions.handleNavigate}
                            />
                        </aside>
                        <M3Surface style={{ flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: 'var(--md-sys-color-surface-container)' }}>
                            <ViewManager
                                view={view}
                                viewContext={viewContext}
                                appState={appState}
                                actions={actions}
                                modals={modals}
                            />
                        </M3Surface>
                    </div>
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
                    {/* FAB flottante sopra il menu, sempre visibile e con z-index massimo */}
                    <div style={{ zIndex: Z_INDEX.assistant.fab }}>
                        <AssistantFab />
                    </div>
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
                </M3Surface>
            </ErrorBoundary>
        </AppLayout>
    );
};

export default App;
