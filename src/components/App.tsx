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
    const { view, viewContext, appState, actions, modals } = useAppEngine();
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

    if (!user) {
        return <SignInScreen onSignInSuccess={(profile) => actions.setUser(profile)} />;
    }

    // Struttura Flexbox rigida per garantire stabilità visiva
    return (
        <div className="app-container flex flex-col h-screen h-[100dvh] w-screen overflow-hidden bg-background text-on-surface">
            <Header
                title="DocenteDoc AI"
                showBackButton={view !== 'home'}
                onBack={actions.handleBack}
                onOpenImageAnalysis={() => modals.setIsImageAnalysisOpen(true)}
                onOpenVideoAnalysis={() => modals.setIsVideoAnalysisOpen(true)}
                onNavigateToLiveAssistant={() => modals.setIsLiveAssistantModalOpen(true)}
                onOpenHelp={() => modals.setIsHelpOpen(true)}
                user={user}
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

            {/* Viewport dinamico con padding di sicurezza per la navigazione inferiore */}
            <main className="flex-grow overflow-y-auto relative w-full custom-scrollbar" style={{ paddingBottom: 'var(--nav-height)' }}>
                <ViewManager
                    view={view}
                    viewContext={viewContext}
                    appState={appState}
                    actions={actions}
                    modals={modals}
                />
            </main>

            {/* Navigazione Fissa e Modali in sovrimpressione */}
            <Menu currentView={view} onNavigate={actions.handleNavigate} />
            <ModalManager appState={appState} actions={actions} modals={modals} />
        </div>
    );
};
