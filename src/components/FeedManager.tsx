// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026

/* M3Expressive - FeedManager Component */

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
        <div >
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
                
            />

            <div >
                <h2 >Aggiungi una Nuova Fonte</h2>
                <p >
                    Puoi incollare l'URL della pagina delle circolari del tuo istituto. L'app *tenterebbe* di cercare un feed RSS.
                </p>
                <div >
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
                        
                    >
                        <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>add_link</span>
                        Aggiungi
                    </M3Button>
                </div>
            </div>
            
            <div >
                <h2 >Fonti Monitorate</h2>
                 <div >
                    {sources.length > 0 ? sources.map(source => (
                        <div key={source.id} >
                            <div >
                                <div >
                                    <div >
                                        <span style={{
}}>rss_feed</span>
                                    </div>
                                    <div >
                                        <p >{source.title}</p>
                                        <a href={source.pageUrl} target="_blank" rel="noopener noreferrer" >{source.pageUrl}</a>
                                    </div>
                                </div>
                                <div >
                                    <M3Button 
                                        onClick={() => handleDeleteSource(source.id)} 
                                        variant="text" 
                                        
                                    >
                                        <span style={{
}}>delete</span>
                                    </M3Button>
                                    <M3Button 
                                        onClick={() => handleCheckForUpdates(source)} 
                                        disabled={true} 
                                        variant="tonal"
                                        
                                    >
                                        Aggiorna
                                    </M3Button>
                                </div>
                            </div>
                            
                            <div >
                                <p >
                                    La funzionalità di aggiornamento feed è disabilitata per motivi di privacy. Analizza manualmente incollando il testo.
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div >
                            <span >rss_feed</span>
                            <p >Nessuna fonte monitorata</p>
                            <p >Aggiungi il sito della tua scuola per ricevere notifiche sulle circolari.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedManager;

