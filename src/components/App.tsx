import * as React from 'react';
import { GlobalFab } from './GlobalFab';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';
const AssistantDevTools = React.lazy(() => import('./AssistantDevTools'));

import Menu from './Menu';
import ViewManager from './ViewManager';
import SignInScreen from './SignInScreen';
import { ModalManager } from './ModalManager';

import { applyTheme, createTheme } from '../design-system';
import RestoreAssistController, { useRestoreAssist } from './useRestoreAssist';

/**
 * App.tsx - Il core del Presentation Layer.
 * Gestisce l'App Shell e la sincronizzazione del tema.
 */
export const App: React.FC = () => {
    try {
        const result = useAppEngine();
        const { view, viewContext, appState, actions, modals } = result;
        const { user, themeState, isGlobalAiLoading, notifiche, activeSuggestion, installPrompt } = appState;

        // Sincronizzazione immediata del tema (prevent flickering)
        React.useLayoutEffect(() => {
            if (themeState) {
                const theme = createTheme({
                    name: themeState.customizationName,
                    mode: themeState.mode === 'system' ? 'light' : themeState.mode,
                    colors: themeState.customColors
                });
                applyTheme(theme);
            }
        }, [themeState]);

        // Dev-only: unregister service workers to avoid stale service-worker intercept causing fetch failures
        React.useEffect(() => {
            try {
                if ((import.meta && (import.meta as any).env && (import.meta as any).env.DEV) && 'serviceWorker' in navigator && !(window as any).__sw_unregistered) {
                    (window as any).__sw_unregistered = true;
                    navigator.serviceWorker.getRegistrations()
                        .then(regs => {
                            if (!regs || regs.length === 0) return false;
                            return Promise.all(regs.map(r => r.unregister())).then(results => results.some(Boolean));
                        })
                        .then(unregistered => {
                            if (unregistered) {
                                console.info('[dev] Service workers unregistered — reloading');
                                // Hard reload to clear caches affected by the SW
                                setTimeout(() => window.location.reload(), 50);
                            }
                        })
                        .catch(err => console.warn('[dev] SW unregister failed', err));
                }
            } catch (err) {
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
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100vh',
                    background: 'var(--aura-gradient, linear-gradient(145deg, #FDFBFF 0%, #F3EDF7 100%))'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
                        <p style={{ color: 'var(--sys-on-surface, #1C1B1F)' }}>Caricamento...</p>
                    </div>
                </div>
            );
        }

        // Assisted restore UI if app is empty or backup failed
        const restoreAssist = useRestoreAssist(appState, actions, modals);
        if (restoreAssist.show) {
            return <RestoreAssistController {...restoreAssist} />;
        }

        // Fallback: se nessun utente e nessun errore, mostra login
        if (!user) {
            return <SignInScreen onSignInSuccess={(profile: any) => actions.setUser(profile)} />;
        }


        // App Shell M3 Expressive
        return (
            <div className="app-shell">
                {/* Fixed Header */}
                <Header
                    title="DocenteDoc AI"
                    showBackButton={view !== 'home'}
                    onBack={actions.handleBack}
                    onOpenImageAnalysis={() => modals.setIsImageAnalysisOpen(true)}
                    onOpenVideoAnalysis={() => modals.setIsVideoAnalysisOpen(true)}
                    // RIMOSSO: onNavigateToLiveAssistant
                    onOpenHelp={() => modals.setIsHelpOpen(true)}
                    user={user}
                    settings={appState.settings}
                    notifiche={notifiche}
                    setNotifiche={actions.setNotifiche}
                    onOpenCircularAnalysis={(url: string, title: string) => modals.setCircularAnalysisModal({ isOpen: true, url, title })}
                    onNavigate={actions.handleNavigate}
                    isAiProcessing={isGlobalAiLoading}
                    installPrompt={installPrompt}
                    onInstallApp={actions.handleInstallApp}
                    onOpenOperations={actions.handleOpenOperations}
                    hasSuggestion={!!activeSuggestion}
                />

                {/* Main Scrollable Content */}
                <main className="main-content custom-scrollbar">
                    <div className="content-container">
                        <ViewManager
                            view={view}
                            viewContext={viewContext}
                            appState={appState}
                            actions={actions}
                            modals={modals}
                        />
                    </div>
                </main>

                {/* FAB Assistente AI: apre il nuovo modal AssistantModal */}
                <GlobalFab
                    currentView={view}
                    onAction={() => modals.setIsLiveAssistantModalOpen(true)}
                />

                {/* Bottom Navigation */}
                <Menu currentView={view} onNavigate={actions.handleNavigate} />
                <ModalManager appState={appState} actions={actions} modals={modals} />
                {/* Dev tools to simulate assistant behaviors */}
                {process.env.NODE_ENV === 'development' && (
                  // lazy load to avoid shipping in prod bundles
                                    <React.Suspense fallback={null}>
                                        {/* @ts-ignore: AssistantDevTools may not have explicit props type, ignore for now */}
                                        <AssistantDevTools actions={actions} />
                                    </React.Suspense>
                )}
            </div>
        );
    } catch (err) {
        // Fallback visibile: errore di caricamento o runtime
        return <div style={{ color: 'red', padding: '32px', fontFamily: 'monospace', background: '#fff0f0', fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>
            <b>ERRORE FATALE:</b> {String(err)}
            <br />
            <span>Controlla la console per dettagli tecnici.</span>
        </div>;
    }
};
