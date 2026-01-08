

import React, { useState } from 'react';
import { FeedSource } from '../types';
import { discoverAndCreateFeed, fetchAndParseRssFeed } from '../services/aiService';
import { InfoCard, SectionHeader, M3Button, TextField } from './ui';

interface FeedManagerProps {
    sources: FeedSource[];
    setSources: React.Dispatch<React.SetStateAction<FeedSource[]>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onOpenCircularAnalysis: (url: string, title: string) => void;
}

const FeedManager: React.FC<FeedManagerProps> = ({ sources, setSources, showToast }) => {
    const [pageUrl, setPageUrl] = useState('');
    
    const handleAddSource = async () => {
        if (!pageUrl.trim()) return;

        let correctedUrl = pageUrl.trim();
        if (!/^https?:\/\//i.test(correctedUrl)) {
            correctedUrl = 'https://' + correctedUrl;
        }

        try {
            new URL(correctedUrl);
        } catch {
            showToast("L'URL inserito non è valido.", "error");
            return;
        }

        try {
            const { feedUrl, title } = await discoverAndCreateFeed(correctedUrl);
            const newSource: FeedSource = {
                id: `feed-${Date.now()}`,
                pageUrl: correctedUrl,
                feedUrl,
                title: title || 'Fonte Sconosciuta',
            };
            setSources(prev => [...prev.filter(s => s.pageUrl !== correctedUrl), newSource]);
            setPageUrl('');
            showToast(`Fonte "${title}" aggiunta con successo!`, 'success');
        } catch (error: unknown) {
            console.error("Error adding feed source:", error);
            let message = "Si è verificato un errore sconosciuto.";
            if (error instanceof Error) message = error.message;
            showToast(message, "error");
        }
    };

    const handleDeleteSource = (sourceId: string) => {
        if (window.confirm("Sei sicuro di voler smettere di monitorare questa fonte?")) {
            setSources(prev => prev.filter(s => s.id !== sourceId));
        }
    };

    const handleCheckForUpdates = async (source: FeedSource) => {
        try {
            await fetchAndParseRssFeed(source.feedUrl);
        } catch (error: unknown) {
            let message = 'Errore sconosciuto.';
            if (error instanceof Error) message = error.message;
            showToast(`Errore: ${message}`, 'error');
        }
    };

    return (
        <div className="page-layout max-w-4xl mx-auto space-y-8">
            <SectionHeader 
                title="Fonti Esterne & Feed" 
                subtitle="Gestione delle fonti RSS e sincronizzazione delle circolari."
                icon="rss_feed"
            />

            <InfoCard
                title="Funzionalità Feed Disabilitata"
                description="Per garantire la tua privacy e la sicurezza dei dati, la sincronizzazione automatica con fonti RSS esterne è stata disabilitata. L'app non può accedere a contenuti esterni senza un server proxy, che potrebbe compromettere i tuoi dati."
                icon="security"
                variant="error"
                className="bg-error-container/10 border-error/20"
            />

            <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-extra-large)] p-6 border border-[var(--md-sys-color-outline-variant)]/30 shadow-sm">
                <h2 className="m3-title-large mb-8">Aggiungi una Nuova Fonte</h2>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant mb-6">
                    Puoi incollare l'URL della pagina delle circolari del tuo istituto. L'app *tenterebbe* di cercare un feed RSS.
                </p>
                <div className="flex flex-col md:flex-row gap-8">
                    <TextField
                        type="url"
                        value={pageUrl}
                        onChange={e => setPageUrl(e.target.value)}
                        placeholder="www.nomescuola.edu.it/circolari"
                        disabled={true}
                        title="Funzionalità disabilitata"
                        containerClassName="flex-grow"
                        leadingIcon="link"
                    />
                    <M3Button 
                        onClick={handleAddSource} 
                        variant="filled" 
                        disabled={true} 
                        className="h-[56px] px-8"
                    >
                        <span className="material-symbols-outlined mr-2">add_link</span>
                        Aggiungi
                    </M3Button>
                </div>
            </div>
            
            <div className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl rounded-[var(--md-sys-shape-corner-extra-large)] p-6 border border-[var(--md-sys-color-outline-variant)]/30 shadow-sm">
                <h2 className="m3-title-large mb-6">Fonti Monitorate</h2>
                 <div className="space-y-4">
                    {sources.length > 0 ? sources.map(source => (
                        <div key={source.id} className="bg-[var(--md-sys-color-surface-container-high)]/50 rounded-[var(--md-sys-shape-corner-large)] overflow-hidden border border-[var(--md-sys-color-outline-variant)]/20">
                            <div className="p-8 flex items-start justify-between">
                                <div className="flex items-center gap-8 truncate">
                                    <div className="w-12 h-12 rounded-[var(--md-sys-shape-corner-medium)] bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">rss_feed</span>
                                    </div>
                                    <div className="truncate">
                                        <p className="m3-title-medium truncate font-bold">{source.title}</p>
                                        <a href={source.pageUrl} target="_blank" rel="noopener noreferrer" className="m3-body-small text-primary hover:underline truncate block opacity-70">{source.pageUrl}</a>
                                    </div>
                                </div>
                                <div className="flex gap-8 flex-shrink-0 ml-2">
                                    <M3Button 
                                        onClick={() => handleDeleteSource(source.id)} 
                                        variant="text" 
                                        className="!min-w-0 !p-8 text-error"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </M3Button>
                                    <M3Button 
                                        onClick={() => handleCheckForUpdates(source)} 
                                        disabled={true} 
                                        variant="tonal"
                                        className="text-xs font-black uppercase tracking-widest"
                                    >
                                        Aggiorna
                                    </M3Button>
                                </div>
                            </div>
                            
                            <div className="p-8 border-t border-[var(--md-sys-color-outline-variant)]/10 bg-[var(--md-sys-color-surface-container-low)]est/30 text-[var(--md-sys-color-on-surface)]-variant">
                                <p className="m3-body-small italic text-center opacity-60">
                                    La funzionalità di aggiornamento feed è disabilitata per motivi di privacy. Analizza manualmente incollando il testo.
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-8">rss_feed</span>
                            <p className="m3-title-medium font-bold">Nessuna fonte monitorata</p>
                            <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">Aggiungi il sito della tua scuola per ricevere notifiche sulle circolari.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedManager;
