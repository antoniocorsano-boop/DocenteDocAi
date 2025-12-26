import React from 'react';
import { View, AppState, NavigationParams } from '../types';
import { M3IconButton } from './M3Components';

interface HomeProps {
    onNavigate: (view: View, params?: NavigationParams) => void;
    appState: AppState;
    dismissSuggestion: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, appState, dismissSuggestion }) => {
    const activeSuggestion = appState.activeSuggestion;
    const dismissedSuggestions = appState.dismissedSuggestions;
    const showAiSuggestion = activeSuggestion && !dismissedSuggestions?.has(activeSuggestion.id);

    return (
        <React.Fragment>
            {showAiSuggestion && (
                <section className="animate-in fade-in slide-in-from-bottom-8 delay-100 duration-700 mb-6">
                    <div className="bg-tertiary-container text-on-tertiary-container rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-tertiary/20">
                        <span className="material-symbols-outlined text-4xl mr-4 text-tertiary">psychology</span>
                        <div className="flex-1">
                            <div className="font-bold text-lg mb-2">Suggerimento AI</div>
                            <div className="mb-2 text-base">{activeSuggestion.message}</div>
                            {activeSuggestion.actionLabel && (
                                <button
                                    className="mt-2 px-6 py-2 rounded-full bg-primary text-on-primary font-bold shadow hover:scale-105 transition-all"
                                    onClick={() => {
                                        if (activeSuggestion.action?.type === 'navigate' && activeSuggestion.targetView) {
                                            onNavigate(activeSuggestion.targetView as View, activeSuggestion.action?.payload as NavigationParams);
                                        }
                                        dismissSuggestion(activeSuggestion.id);
                                    }}
                                    aria-label={activeSuggestion.actionLabel}
                                >
                                    {activeSuggestion.actionLabel}
                                </button>
                            )}
                            <button
                                className="mt-2 ml-4 px-4 py-2 rounded-full bg-outline-variant text-on-surface-variant font-medium hover:bg-outline-variant/30 transition-all"
                                onClick={() => dismissSuggestion(activeSuggestion.id)}
                                aria-label="Ignora suggerimento"
                            >
                                Ignora
                            </button>
                        </div>
                    </div>
                </section>
            )}
            <div className="fixed bottom-8 right-8 z-50">
                <M3IconButton
                    icon="psychology"
                    ariaLabel="Apri Assistente AI"
                    className="shadow-lg bg-primary text-on-primary rounded-full w-16 h-16 flex items-center justify-center hover:scale-110 transition-all"
                    onClick={() => onNavigate('live-assistant')}
                    title="Assistente AI"
                />
            </div>
        </React.Fragment>
    );
};

export default Home;
