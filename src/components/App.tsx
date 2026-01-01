// ...existing code...
// ...existing code...
import AssistantModal from './AssistantModal';
import '../font-setup';
import * as React from 'react';
import M3ExpressiveProvider from '../design-system/M3ExpressiveProvider';
import '../design-system/typography.css';
import '../design-system/spacing.css';

// Global runtime types are declared in `src/vite-env.d.ts`

import AssistantFab from './AssistantFab';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';

import NavigationRail from './NavigationRail';
import ViewManager from './ViewManager';
import SignInScreen from './SignInScreen';
import { ModalManager } from './ModalManager';

import { applyTheme, createTheme } from '../design-system';
import Snackbar from './Snackbar';
import { useRestoreAssist } from './useRestoreAssist';
import type { UserProfile } from '../types';

import type { AiSuggestion, SystemSuggestion } from '../types';
import ErrorBoundary from './ErrorBoundary';
type SuggestionBannerProps = { suggestion: AiSuggestion | SystemSuggestion; onAction: () => void };
// Banner Suggestion Assistant
const SuggestionBanner: React.FC<SuggestionBannerProps> = ({ suggestion, onAction }) => {
    // Support both AiSuggestion and SystemSuggestion
    const message = 'message' in suggestion ? suggestion.message : suggestion.description;
    const actionLabel = 'actionLabel' in suggestion ? suggestion.actionLabel : 'Apri';
    return (
    <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2500,
            background: 'var(--sys-primary-container, #e3f2fd)',
            color: 'var(--sys-on-primary-container, #1C1B1F)',
            padding: '0.4rem 0.7rem 0.4rem 0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem',
            fontSize: '0.98rem',
            cursor: 'pointer',
            borderBottomLeftRadius: '0.7rem',
            borderBottomRightRadius: '0.7rem',
            maxWidth: '100vw',
            minHeight: '2.2rem',
            pointerEvents: 'auto',
            boxSizing: 'border-box',
            width: '100vw',
        }}
            onClick={onAction}
            role="button"
            aria-label={actionLabel || 'Apri suggerimento'}
        >
            <span style={{ fontSize: '1.2rem', marginRight: '0.3rem' }} aria-hidden="true">💡</span>
            <span style={{ fontWeight: 600, flex: 1, textAlign: 'left', fontSize: '0.98rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {message || 'Hai un suggerimento!'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{
                    background: 'var(--sys-primary, #1976d2)',
                    color: 'var(--sys-on-primary, #fff)',
                    border: 'none',
                    borderRadius: '0.9rem',
                    padding: '0.3rem 0.7rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(25,118,210,0.07)'
                }}>
                    {actionLabel}
                    <span style={{ fontSize: '1.1rem', marginLeft: '0.1rem' }} aria-hidden="true">↗️</span>
                </span>
            </span>
        </div>
    );
};

/**
 * App.tsx - Il core del Presentation Layer.
 * Gestisce l'App Shell e la sincronizzazione del tema.
 */
export const App: React.FC = () => {
    // Stato assistant mode centralizzato (opzionale: puoi usare Zustand o context se vuoi cambiare modalità da altri punti)
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
                            try {
                                // During E2E/test runs we must avoid forcing a reload which
                                // closes the Playwright page and interrupts the test flow.
                                const isTest = window.__TEST_MODE === true;
                                if (unregistered && !isTest) {
                                    console.info('[dev] Service workers unregistered — reloading');
                                    // Hard reload to clear caches affected by the SW
                                    setTimeout(() => window.location.reload(), 50);
                                } else if (unregistered && isTest) {
                                    console.info('[dev] Service workers unregistered — skipping reload in test mode');
                                }
                            } catch (e) {
                                // swallow
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
            // Mostra una UI di restore assist se necessario (placeholder)
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--aura-gradient, linear-gradient(145deg, #FDFBFF 0%, #F3EDF7 100%))' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
                        <p style={{ color: 'var(--sys-on-surface, #1C1B1F)' }}>Assistenza ripristino dati</p>
                        {/* Puoi personalizzare questa UI o importare un componente se disponibile */}
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
                <M3ExpressiveProvider themeState={appState.themeState}>
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


                                {/* M3 Expressive Navigation Rail - vertical left navigation */}
                                <NavigationRail
                                    items={[
                                        { id: 'home', label: 'Home', icon: 'home', activeIcon: 'home' },
                                        { id: 'timetable', label: 'Orario', icon: 'schedule', activeIcon: 'watch_later' },
                                        { id: 'progettazione-hub', label: 'Progetta', icon: 'design_services', activeIcon: 'edit_document' },
                                        { id: 'aula', label: 'Classi', icon: 'groups', activeIcon: 'groups' },
                                        { id: 'calendario', label: 'Agenda', icon: 'calendar_month', activeIcon: 'event_note' },
                                    ]}
                                    activeView={view}
                                    onNavigate={actions.handleNavigate}
                                />

                                {/* FAB flottante sopra il menu, sempre visibile e con z-index massimo */}
                                {/* Super AI Assistant FAB: floating, multi-action, modal */}
                                <div style={{position: 'fixed', right: '2.2rem', bottom: '2.2rem', zIndex: 1300, pointerEvents: 'auto'}}>
                                    <AssistantFab />
                                </div>

                <ModalManager appState={appState} actions={actions} modals={modals} />
                                {modals.isLiveAssistantModalOpen && (
                                    <AssistantModal open={true} onClose={() => modals.setIsLiveAssistantModalOpen(false)} mode={assistantMode} />
                                )}
                <Snackbar />
            </div>
            </M3ExpressiveProvider>
            </ErrorBoundary>
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
