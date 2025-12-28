import * as React from 'react';
import M3ExpressiveProvider from '../design-system/M3ExpressiveProvider';

// Extend the Window interface to include __app_instrumentation and __sw_unregistered
declare global {
    interface Window {
        __app_instrumentation?: {
            user?: { id: string; displayName?: string };
            isRestoring?: boolean;
            appShellMounted?: boolean;
        };
        __sw_unregistered?: boolean;
    }
}

import AssistantFab from './AssistantFab';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';

import Menu from './Menu';
import ViewManager from './ViewManager';
import SignInScreen from './SignInScreen';
import { ModalManager } from './ModalManager';

import { applyTheme, createTheme } from '../design-system';
import Snackbar from './Snackbar';
import RestoreAssistController, { useRestoreAssist } from './useRestoreAssist';
import type { UserProfile } from '../types';

/**
 * App.tsx - Il core del Presentation Layer.
 * Gestisce l'App Shell e la sincronizzazione del tema.
 */
export const App: React.FC = () => {
    try {
        const result = useAppEngine();
        const { view, viewContext, appState, actions, modals } = result;
        const { user, themeState, isGlobalAiLoading, notifiche, activeSuggestion, installPrompt } = appState;

        // Runtime instrumentation for automated tests and diagnostics
        React.useEffect(() => {
            try {
                window.__app_instrumentation = window.__app_instrumentation || {};
                window.__app_instrumentation.user = user ? { id: user.id, displayName: (user as { id: string; displayName?: string }).displayName } : undefined;
                console.info('[instrument] user', window.__app_instrumentation.user);
            } catch (e) {
                /* ignore */
            }
        }, [user]);

        React.useEffect(() => {
            try {
                window.__app_instrumentation = window.__app_instrumentation || {};
                window.__app_instrumentation.isRestoring = !!modals?.isRestoring;
                console.info('[instrument] isRestoring', !!modals?.isRestoring);
            } catch (e) {
                /* ignore */
            }
        }, [modals?.isRestoring]);

        React.useEffect(() => {
            const check = () => {
                const shell = document.querySelector('.app-shell');
                if (shell) {
                    try {
                        document.documentElement.setAttribute('data-app-shell-mounted', 'true');
                    } catch (e) { /* ignore error */ }
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
                const theme = createTheme({
                    name: themeState.customizationName,
                    mode: themeState.mode === 'system' ? 'light' : themeState.mode,

                });
                applyTheme(theme);
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
            return <RestoreAssistController isOpen={restoreAssist.show} {...restoreAssist} />;
        }

        // Fallback: se nessun utente e nessun errore, mostra login
        if (!user) {
            return <SignInScreen onSignInSuccess={(profile: UserProfile) => actions.setUser(profile)} />;
        }


        // App Shell M3 Expressive
        return (
            <M3ExpressiveProvider>
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
                        <Snackbar />
                        <ViewManager
                            view={view}
                            viewContext={viewContext}
                            appState={appState}
                            actions={actions}
                            modals={modals}
                        />
                    </div>
                </main>


                                {/* FAB flottante sopra il menu, sempre visibile e con z-index massimo */}
                                {/* Super AI Assistant FAB: floating, multi-action, modal */}
                                <div style={{position: 'fixed', right: '2.2rem', bottom: '5.5rem', zIndex: 1300, pointerEvents: 'auto'}}>
                                    <AssistantFab />
                                </div>

                                {/* Footer Menu flottante in basso, sotto il FAB */}
                                <div style={{position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1200, pointerEvents: 'none'}}>
                                    <div style={{display: 'flex', justifyContent: 'center', pointerEvents: 'auto'}}>
                                        <Menu
                                            currentView={view}
                                            onNavigate={actions.handleNavigate}
                                        />
                                    </div>
                                </div>

                <ModalManager appState={appState} actions={actions} modals={modals} />
                <Snackbar />
                <Snackbar />
            </div>
            </M3ExpressiveProvider>
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
