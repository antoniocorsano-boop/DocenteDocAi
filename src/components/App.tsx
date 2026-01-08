// ...existing code...
// ...existing code...
import AssistantModal from './AssistantModal';
import '../font-setup';
import * as React from 'react';
import '../design-system/typography.css';
import '../design-system/spacing.css';
import '../design-system/breakpoints.css';
import '../design-system/accessibility-focus.css';

// Global runtime types are declared in `src/vite-env.d.ts`

import AssistantFab from './AssistantFab';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';
import { SkipLink } from './accessibility/SkipLink';

import NavigationRail from './NavigationRail';
import ViewManager from './ViewManager';
import SignInScreen from './SignInScreen';
import { ModalManager } from './ModalManager';
import PassaggioAnnoWizard from './PassaggioAnnoWizard';

import { ThemeService } from '../services/ThemeService';
import { Z_INDEX } from '../design-system/zIndex';
import Snackbar from './Snackbar';
import { useRestoreAssist } from './useRestoreAssist';
import type { UserProfile, AiSuggestion, SystemSuggestion, KnowledgeBaseEntry, EventoCalendario } from '../types';
import ErrorBoundary from './ErrorBoundary';
type SuggestionBannerProps = { suggestion: AiSuggestion | SystemSuggestion; onAction: () => void };
// Banner Suggestion Assistant
const SuggestionBanner: React.FC<SuggestionBannerProps> = ({ suggestion, onAction }) => {
    // Support both AiSuggestion and SystemSuggestion
    const message = 'message' in suggestion ? suggestion.message : suggestion.description;
    const actionLabel = 'actionLabel' in suggestion ? suggestion.actionLabel : 'Apri';
    return (
        <div
            className="fixed top-0 left-0 right-0 aura-glass py-4 px-4 flex items-center justify-center gap-6 cursor-pointer border-b border-white/10 shadow-[var(--md-sys-elevation-level2)] animate-in slide-in-from-top duration-500"
            style={{ zIndex: Z_INDEX.notification.banner }}
            onClick={onAction}
            role="button"
            aria-label={actionLabel || 'Apri suggerimento'}
        >
            <span className="text-xl" aria-hidden="true">??</span>
            <span className="font-bold flex-1 text-sm md:text-base truncate text-on-primary-container">
                {message || 'Hai un suggerimento!'}
            </span>
            <button className="m3-button-filled !py-1 !px-4 !rounded-full text-xs md:text-sm flex items-center gap-4">
                {actionLabel}
                <span className="material-symbols-outlined text-sm">north_east</span>
            </button>
        </div>
    );
};

import { useUIStore } from '../stores/useUIStore';
import { useModal } from '../context/ModalContext';
import HelpModal from './HelpModal';
import ImageAnalysisModal from './ImageAnalysisModal';
import OperationsCenter from './OperationsCenter';
import VideoAnalysisModal from './VideoAnalysisModal';
import CircolareAnalysisModal from './CircolareAnalysisModal';
import LoadingModal from './LoadingModal';
import { NKABottomSheet, useNKAStore } from '../nka';

/**
 * App.tsx - Il core del Presentation Layer.
 * Gestisce l'App Shell e la sincronizzazione del tema.
 */
export const App: React.FC = () => {
    const { chaosStage } = useUIStore();
    const { pushModal, popModal } = useModal();
    // Stato assistant mode centralizzato (opzionale: puoi usare Zustand o context se vuoi cambiare modalit� da altri punti)
    const [assistantMode] = React.useState<'chat' | 'docs' | 'tools' | 'backup'>('chat');
    // AssistantModal montato una sola volta a livello root, usa solo modals proxy
    try {
        const result = useAppEngine();
        const { view, viewContext, appState, actions, modals } = result;

        // NOTE: removed previous dev-only forced-close effect because it interfered
        // with automated E2E flows (caused modal to be closed before tests could
        // interact). If you need a dev-only helper, enable it via an explicit
        // runtime flag (e.g. VITE_ENABLE_FORCE_CLOSE) rather than unconditionally
        // running on mount.
        const { user, themeState, aiSettings, isGlobalAiLoading, notifiche, activeSuggestion, installPrompt } = appState;

        // Sync Loading Modal with ModalProvider
        React.useEffect(() => {
            if (modals.isLoadingModalOpen) {
                pushModal({
                    id: 'loading-modal',
                    component: <LoadingModal message={modals.loadingModalMessage ?? ''} />
                });
            } else {
                popModal('loading-modal');
            }
        }, [modals.isLoadingModalOpen, modals.loadingModalMessage, pushModal, popModal]);

        // Runtime instrumentation for automated tests and diagnostics
        React.useEffect(() => {
            try {
                window.__app_instrumentation = window.__app_instrumentation || {};
                window.__app_instrumentation.user = user ? { id: user.id, displayName: (user as { id: string; displayName?: string }).displayName } : undefined;
                console.info('[instrument] user', window.__app_instrumentation.user);
            } catch {
                /* ignore */
            }
        }, [user]);

        React.useEffect(() => {
            try {
                window.__app_instrumentation = window.__app_instrumentation || {};
                window.__app_instrumentation.isRestoring = !!modals?.isRestoring;
                console.info('[instrument] isRestoring', !!modals?.isRestoring);
            } catch {
                /* ignore */
            }
        }, [modals?.isRestoring]);

        React.useEffect(() => {
            const check = () => {
                const shell = document.querySelector('.app-shell');
                if (shell) {
                    try {
                        document.documentElement.setAttribute('data-app-shell-mounted', 'true');
                    } catch { /* ignore error */ }
                    window.__app_instrumentation = window.__app_instrumentation || {};
                    window.__app_instrumentation.appShellMounted = true;
                    console.info('[instrument] app-shell-mounted');
                    return true;
                }
                return false;
            };
            if (check()) return;
            const obs = new MutationObserver(() => { if (check()) obs.disconnect(); });
            obs.observe(document.body, { childList: true, subtree: true });
            return () => obs.disconnect();
        }, [user, modals?.isRestoring]);

        // Sincronizzazione immediata del tema (prevent flickering)
        React.useLayoutEffect(() => {
            if (themeState) {
                ThemeService.applyThemeState(themeState);
            }
        }, [themeState]);

        // Dev-only: unregister service workers to avoid stale service-worker intercept causing fetch failures
        React.useEffect(() => {
            try {
                if ((import.meta && (import.meta as unknown as { env?: { DEV?: boolean } }).env && (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) && 'serviceWorker' in navigator && !window.__sw_unregistered) {
                    window.__sw_unregistered = true;
                    navigator.serviceWorker.getRegistrations()
                        .then(regs => {
                            if (!regs || regs.length === 0) return false;
                            return Promise.all(regs.map(r => r.unregister())).then(results => results.some(Boolean));
                        })
                        .then(unregistered => {
                            try {
                                // During E2E/test runs we must avoid forcing a reload which
                                // closes the Playwright page and interrupts the test flow.
                                const isTest = window.__TEST_MODE === true;
                                if (unregistered && !isTest) {
                                    console.info('[dev] Service workers unregistered � reloading');
                                    // Hard reload to clear caches affected by the SW
                                    setTimeout(() => window.location.reload(), 50);
                                } else if (unregistered && isTest) {
                                    console.info('[dev] Service workers unregistered � skipping reload in test mode');
                                }
                            } catch {
                                // swallow
                            }
                        })
                        .catch(err => console.warn('[dev] SW unregister failed', err));
                }
            } catch {
                // ignore in environments where import.meta may be absent
            }
        }, []);

        // Keep FAB in sync with assistant state (notification & listening)
        React.useEffect(() => {
            const syncNotification = () => {
                const has = !!activeSuggestion;
                const fab = document.querySelector('.live-assistant-fab, .fab') as HTMLElement | null;
                if (fab) {
                    if (has) fab.setAttribute('data-has-notification', 'true');
                    else fab.removeAttribute('data-has-notification');
                }
            };
            // initial sync
            syncNotification();
            // listen to global event from voice recorder
            const onRecording = (e: CustomEvent<{ recording: boolean }>) => {
                const recording = e?.detail?.recording;
                const fab = document.querySelector('.live-assistant-fab, .fab') as HTMLElement | null;
                if (!fab) return;
                if (recording) fab.classList.add('listening');
                else fab.classList.remove('listening');
            };
            window.addEventListener('assistant:recording', onRecording as EventListener);

            return () => {
                window.removeEventListener('assistant:recording', onRecording as EventListener);
            };
        }, [activeSuggestion]);


        // Show loading screen during restore
        if (modals.isRestoring) {
            return (
                <div className="flex items-center justify-center h-screen bg-[var(--md-sys-color-surface-container-low)]">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-[var(--md-sys-shape-corner-extra-large)] aura-glass flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-4xl text-primary">sync</span>
                        </div>
                        <p className="m3-label-large text-[var(--md-sys-color-on-surface)] tracking-widest uppercase">Caricamento...</p>
                    </div>
                </div>
            );
        }

        // Assisted restore UI if app is empty or backup failed
        const restoreAssist = useRestoreAssist(appState, actions, modals);
        if (restoreAssist.show) {
            return (
                <div className="flex items-center justify-center h-screen bg-[var(--md-sys-color-surface-container-low)]">
                    <div className="text-center space-y-4 max-w-xs px-6">
                        <div className="w-16 h-16 mx-auto rounded-[var(--md-sys-shape-corner-extra-large)] aura-glass flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary">build</span>
                        </div>
                        <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-bold">Assistenza ripristino</h2>
                        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">Stiamo preparando il tuo ambiente di lavoro.</p>
                    </div>
                </div>
            );
        }

        // Fallback: se nessun utente e nessun errore, mostra login
        if (!user) {
            return <SignInScreen onSignInSuccess={(profile: UserProfile) => actions.setUser(profile)} />;
        }


        // App Shell M3 Expressive
        return (
            <ErrorBoundary>
                <SkipLink />
                <div className={`app-shell ${chaosStage === 'chaos' ? 'stage-chaos' : ''}`}>
                {/* Fixed Header */}
                <Header
                    title="DocenteDoc AI"
                    showBackButton={view !== 'home'}
                    onBack={actions.handleBack}
                    onOpenImageAnalysis={() => pushModal({
                        id: 'image-analysis-modal',
                        component: (
                            <ImageAnalysisModal
                                onClose={() => popModal('image-analysis-modal')}
                                aiSettings={aiSettings}
                            />
                        )
                    })}
                    onOpenVideoAnalysis={() => pushModal({
                        id: 'video-analysis-modal',
                        component: (
                            <VideoAnalysisModal
                                onClose={() => popModal('video-analysis-modal')}
                            />
                        )
                    })}
                    // RIMOSSO: onNavigateToLiveAssistant
                    onOpenHelp={() => pushModal({
                        id: 'help-modal',
                        component: (
                            <HelpModal
                                onClose={() => popModal('help-modal')}
                                onNavigate={actions.handleNavigate}
                                aiSettings={aiSettings}
                                setIsLoadingModalOpen={modals.setIsLoadingModalOpen}
                                setLoadingModalMessage={modals.setLoadingModalMessage}
                            />
                        )
                    })}
                    user={user}
                    settings={appState.settings}
                    notifiche={notifiche}
                    setNotifiche={actions.setNotifiche}
                    onOpenCircularAnalysis={(url: string, title: string) => pushModal({
                        id: 'circular-analysis-modal',
                        component: (
                            <CircolareAnalysisModal
                                url={url}
                                title={title}
                                onClose={() => popModal('circular-analysis-modal')}
                                aiSettings={aiSettings}
                                onImportEvents={(events) => {
                                    actions.setEventi((prev: EventoCalendario[]) => {
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
                                    actions.setKnowledgeBase((prev: KnowledgeBaseEntry[]) => [...prev, {
                                        id: `kb-note-${Date.now()}`,
                                        fileName: note.title + '.txt',
                                        content: note.content,
                                        category: 'normativa',
                                        isGenerated: true
                                    }]);
                                    actions.showToast('Nota salvata in KB.', 'success');
                                }}
                            />
                        )
                    })}
                    onNavigate={actions.handleNavigate}
                    isAiProcessing={isGlobalAiLoading}
                    installPrompt={installPrompt}
                    onInstallApp={actions.handleInstallApp}
                    onOpenOperations={() => pushModal({
                        id: 'operations-center',
                        component: (
                            <OperationsCenter
                                onClose={() => popModal('operations-center')}
                                onNavigate={actions.handleNavigate}
                                onAction={(action) => {
                                    if (action === 'year-transition-modal') {
                                        pushModal({
                                            id: 'year-transition-wizard',
                                            component: (
                                                <PassaggioAnnoWizard
                                                    onClose={() => popModal('year-transition-wizard')}
                                                    students={appState.students}
                                                    settings={appState.settings}
                                                    evaluations={appState.evaluations}
                                                    competencyEvaluations={appState.competencyEvals}
                                                    register={appState.finalizedRegister}
                                                    onPromoteStudents={actions.handlePromoteStudents}
                                                    onBackupData={actions.handleExportData}
                                                    onResetData={actions.handleResetYearData}
                                                />
                                            )
                                        });
                                    } else if (action === 'load-demo') {
                                        actions.handleLoadDemoData();
                                        popModal('operations-center');
                                    } else if (action === 'live-assistant') {
                                        pushModal({
                                            id: 'assistant-modal',
                                            component: (
                                                <AssistantModal 
                                                    open={true} 
                                                    onClose={() => popModal('assistant-modal')} 
                                                    mode={assistantMode} 
                                                    aiSettings={aiSettings}
                                                    context={{ view, viewContext }}
                                                />
                                            )
                                        });
                                    } else if (action === 'video-analysis') {
                                        pushModal({
                                            id: 'video-analysis-modal',
                                            component: (
                                                <VideoAnalysisModal 
                                                    onClose={() => popModal('video-analysis-modal')}
                                                />
                                            )
                                        });
                                    } else if (action === 'nka-map') {
                                        pushModal({
                                            id: 'nka-map-modal',
                                            component: (
                                                <NKABottomSheet 
                                                    open={true}
                                                    nodes={useNKAStore.getState().nodes}
                                                    onClose={() => popModal('nka-map-modal')}
                                                    onNodeSelect={() => {}}
                                                />
                                            )
                                        });
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
                        )
                    })}
                    hasSuggestion={!!activeSuggestion}
                />

                <div className="app-body">
                    {/* M3 Expressive Navigation Rail - vertical left navigation */}
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

                    {/* Main Scrollable Content */}
                    <main className="main-content custom-scrollbar">
                        <div className="content-container">
                            {/* Banner Suggestion Assistant (solo se suggestion richiede modale) */}
                            {activeSuggestion && activeSuggestion.action?.type === 'modal' && typeof activeSuggestion.action?.payload === 'string' && activeSuggestion.action.payload === 'isLiveAssistantModalOpen' && !modals.isLiveAssistantModalOpen && (
                              <SuggestionBanner
                                suggestion={activeSuggestion}
                                onAction={() => modals.setIsLiveAssistantModalOpen(true)}
                              />
                            )}
                            <ViewManager
                                view={view}
                                viewContext={viewContext}
                                appState={appState}
                                actions={actions}
                                modals={modals}
                            />
                        </div>
                    </main>
                </div>

                <ModalManager appState={appState} actions={actions} modals={modals} />
                
                {/* FAB flottante sopra il menu, sempre visibile e con z-index massimo */}
                {/* Super AI Assistant FAB: floating, multi-action, modal */}
                <div 
                    className="fixed right-6 bottom-[calc(64px+var(--md-sys-spacing-6))] md:bottom-6 pointer-events-auto"
                    style={{ zIndex: Z_INDEX.assistant.fab }}
                >
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
            </div>
            </ErrorBoundary>
        );
    } catch (err) {
        // Fallback visibile: errore di caricamento o runtime
        return <div style={{ color: 'red', padding: 'var(--md-sys-spacing-8)', fontFamily: 'monospace', background: 'var(--md-sys-color-surface-variant)', fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>
            <b>ERRORE FATALE:</b> {String(err)}
            <br />
            <span>Controlla la console per dettagli tecnici.</span>
        </div>;
    }
};


