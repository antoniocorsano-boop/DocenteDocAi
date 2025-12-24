import React, { useLayoutEffect } from 'react';
import { useAppEngine } from '../hooks/useAppEngine';
import { Header } from './Header';
import Menu from './Menu';
import ViewManager from './ViewManager';
import SignInScreen from './SignInScreen';
import { ModalManager } from './ModalManager';
import { applyTheme, createTheme } from '../design-system';

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
        useLayoutEffect(() => {
            if (themeState) {
                const theme = createTheme({
                    name: themeState.customizationName,
                    mode: themeState.mode === 'system' ? 'light' : themeState.mode,
                    colors: themeState.customColors
                });
                applyTheme(theme);
            }
        }, [themeState]);

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

        if (!user) {
            return <SignInScreen onSignInSuccess={(profile) => actions.setUser(profile)} />;
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
                    onNavigateToLiveAssistant={() => modals.setIsLiveAssistantModalOpen(true)}
                    onOpenHelp={() => modals.setIsHelpOpen(true)}
                    user={user}
                    settings={appState.settings}
                    notifiche={notifiche}
                    setNotifiche={actions.setNotifiche}
                    onOpenCircularAnalysis={(url, title) => modals.setCircularAnalysisModal({ isOpen: true, url, title })}
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

                {/* Bottom Navigation */}
                <Menu currentView={view} onNavigate={actions.handleNavigate} />
                <ModalManager appState={appState} actions={actions} modals={modals} />
            </div>
        );
    } catch (err) {
        console.error('🔴 App error:', err);
        return <div style={{ color: 'red', padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>ERROR: {String(err)}</div>;
    }
};
