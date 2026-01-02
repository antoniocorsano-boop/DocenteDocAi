

import React, { useState } from 'react';
import { FeedSource } from '../types';
import { discoverAndCreateFeed, fetchAndParseRssFeed } from '../services/aiService';
import { InfoCard } from './M3Components';

interface FeedManagerProps {
    sources: FeedSource[];
    setSources: React.Dispatch<React.SetStateAction<FeedSource[]>>;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onOpenCircularAnalysis: (url: string, title: string) => void;
}



const FeedManager: React.FC<FeedManagerProps> = ({ sources, setSources, showToast }) => {
    const [pageUrl, setPageUrl] = useState('');
    
    // The following states are no longer actively used due to disabled functionality,
    // but kept for reference or potential re-enabling.
    // const [checkingSourceId, setCheckingSourceId] = useState<string | null>(null);
    // const [newItems, setNewItems] = useState<Record<string, NewItem[]>>({});
    // const [checkMessage, setCheckMessage] = useState<Record<string, string>>({});
    // const [checkStatus, setCheckStatus] = useState<Record<string, 'success' | 'error' | 'info'>>({});

    const handleAddSource = async () => {
        if (!pageUrl.trim()) return;

        let correctedUrl = pageUrl.trim();
        if (!/^https?:\/\//i.test(correctedUrl)) {
            correctedUrl = 'https://' + correctedUrl;
        }

        try {
            new URL(correctedUrl);
        } catch (_) {
            showToast("L'URL inserito non è valido.", "error");
            return;
        }

        try {
            // This will likely throw due to aiService.ts design
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
        // setCheckingSourceId(source.id);
        // setNewItems(prev => ({ ...prev, [source.id]: [] }));
        // setCheckMessage(prev => ({ ...prev, [source.id]: '' }));
        // setCheckStatus(prev => ({ ...prev, [source.id]: 'info' }));

        try {
            await fetchAndParseRssFeed(source.feedUrl);
            
            // The following logic would only run if fetchAndParseRssFeed succeeded,
            // which it currently does not due to design.
            /*
            if (items.length === 0) {
                // setCheckMessage(prev => ({ ...prev, [source.id]: 'Il feed è vuoto o non è stato possibile leggerlo.' }));
                // setCheckStatus(prev => ({ ...prev, [source.id]: 'error' }));
                showToast('Il feed è vuoto o non è stato possibile leggerlo.', 'error');
                return;
            }

            const lastGuid = source.lastItemGuid;
            const lastItemIndex = lastGuid ? items.findIndex(item => item.guid === lastGuid) : -1;
            
            let foundNewItems: NewItem[] = [];
            if (lastItemIndex === -1) {
                foundNewItems = items.slice(0, 5); // Take first 5 if it's new or reset
            } else {
                foundNewItems = items.slice(0, lastItemIndex);
            }

            if (foundNewItems.length > 0) {
                // setNewItems(prev => ({ ...prev, [source.id]: foundNewItems }));
                setSources(prev => prev.map(s => 
                    s.id === source.id ? { ...s, lastItemGuid: items[0].guid } : s
                ));
                // setCheckStatus(prev => ({ ...prev, [source.id]: 'success' }));
                showToast(`${foundNewItems.length} nuovi articoli trovati!`, 'success');
            } else {
                 // setCheckMessage(prev => ({ ...prev, [source.id]: 'Nessun nuovo articolo trovato.' }));
                 // setCheckStatus(prev => ({ ...prev, [source.id]: 'info' }));
                 showToast('Nessun nuovo articolo trovato.', 'info');
            }
            */
        } catch (error: unknown) {
            let message = 'Errore sconosciuto.';
            if (error instanceof Error) message = error.message;
            showToast(`Errore: ${message}`, 'error');
        } finally {
            // setCheckingSourceId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium font-black">Fonti Esterne & Feed</h1>
                    <p className="page-subtitle">Gestione delle fonti RSS e sincronizzazione.</p>
                </div>
            </div>

            <InfoCard
                title="Funzionalità Feed Disabilitata"
                description="Per garantire la tua privacy e la sicurezza dei dati, la sincronizzazione automatica con fonti RSS esterne è stata disabilitata. L'app non può accedere a contenuti esterni senza un server proxy, che potrebbe compromettere i tuoi dati."
                icon="security"
                variant="error"
            />

            <div className="card">
                <h2 className="m3-title-large">Aggiungi una Nuova Fonte</h2>
                <p className="m3-body-medium text-on-surface-variant mt-2 mb-4">
                    Puoi incollare l'URL della pagina delle circolari del tuo istituto. L'app *tenterebbe* di cercare un feed RSS.
                </p>
                <div className="input-action-group">
                    <input
                        type="url"
                        value={pageUrl}
                        onChange={e => setPageUrl(e.target.value)}
                        placeholder="www.nomescuola.edu.it/circolari"
                        className="form-input flex-grow"
                        disabled={true} // Always disabled as functionality is off
                        title="Funzionalità disabilitata"
                    />
                    <button onClick={handleAddSource} className="button button-filled flex-shrink-0" disabled={true} title="Funzionalità disabilitata">
                        <span className="material-symbols-outlined mr-2">add_link</span>Aggiungi
                    </button>
                </div>
            </div>
            
            <div className="card">
                <h2 className="m3-title-large mb-4">Fonti Monitorate</h2>
                 <div className="space-y-4">
                    {sources.length > 0 ? sources.map(source => (
                        <div key={source.id} className="m3-card !p-0 overflow-hidden border border-outline-variant">
                            <div className="bg-secondary-container/30 p-4 flex items-start justify-between">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">rss_feed</span>
                                    </div>
                                    <div className="truncate">
                                        <p className="m3-title-medium truncate">{source.title}</p>
                                        <a href={source.pageUrl} target="_blank" rel="noopener noreferrer" className="m3-body-small text-primary hover:underline truncate block">{source.pageUrl}</a>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-2">
                                    <button onClick={() => handleDeleteSource(source.id)} className="icon-button text-error" title="Elimina fonte"><span className="material-symbols-outlined">delete</span></button>
                                    <button onClick={() => handleCheckForUpdates(source)} disabled={true} className="button button-tonal" title="Funzionalità disabilitata">
                                        Aggiorna
                                    </button>
                                </div>
                            </div>
                            
                            {/* Removed conditional rendering for newItems/checkMessage/checkStatus as they are no longer active */}
                            <div className={`p-4 border-t border-outline-variant bg-surface-container-lowest text-on-surface-variant`}>
                                <p className="m3-body-medium italic text-center">
                                    La funzionalità di aggiornamento feed è disabilitata per motivi di privacy. Analizza manualmente incollando il testo.
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state-box">
                            <span className="material-symbols-outlined empty-state-icon">rss_feed</span>
                            <p className="m3-title-medium">Nessuna fonte monitorata</p>
                            <p>Aggiungi il sito della tua scuola per ricevere notifiche sulle circolari.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedManager;
