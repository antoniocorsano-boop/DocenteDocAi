
import React, { useState, useMemo } from 'react';
import M3Button from './M3Button';
import { AiSettings, CircularAnalysisResult, EventoCalendario } from '../types';
import { analyzeCircularDocument } from '../services/aiService';
import { M3Dialog, TextArea } from './M3Components';

interface CircolareAnalysisModalProps {
    url: string; // URL is passed for reference (to open in new tab), not for fetching
    title: string;
    onClose: () => void;
    aiSettings: AiSettings;
    onImportEvents: (events: Partial<EventoCalendario>[]) => void;
    onSaveToKb: (note: { title: string, content: string }) => void;
}

const CircolareAnalysisModal: React.FC<CircolareAnalysisModalProps> = (props) => {
    const { url, title, onClose, aiSettings, onImportEvents, onSaveToKb } = props;

    const [manualText, setManualText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<CircularAnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!manualText.trim()) {
            setError("Per favore, incolla il testo della circolare.");
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            // We pass fileContent instead of url to enforce text-only analysis
            const analysisResult = await analyzeCircularDocument(aiSettings, { fileContent: manualText });
            setResult(analysisResult);
        } catch (error: any) {
            setError(error.message || 'Si è verificato un errore sconosciuto durante l\'analisi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = () => {
        if (!result) return;

        const allEvents: Partial<EventoCalendario>[] = result.events.map(e => ({
            ...e,
            tipo: 'impegno'
        }));

        result.deadlines.forEach(d => {
            allEvents.push({
                titolo: d.title,
                data: d.date,
                tipo: 'scadenza',
            });
        });

        if (allEvents.length > 0) {
            onImportEvents(allEvents);
        }
        if (result.notes && result.notes.title && result.notes.content) {
            onSaveToKb(result.notes);
        }

        onClose();
    };

    const dialogButtons = useMemo(() => {
        if (!result) {
            return (
                <>
                    <M3Button variant="text" onClick={onClose} disabled={isLoading}>Annulla</M3Button>
                    <M3Button variant="filled" onClick={handleAnalyze} disabled={isLoading || !manualText.trim()}>
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                                Analisi...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                Analizza Testo
                            </>
                        )}
                    </M3Button>
                </>
            );
        } else {
            return (
                <>
                    <M3Button variant="text" onClick={() => setResult(null)}>Indietro</M3Button>
                    <M3Button variant="filled" onClick={handleImport}>
                        <span className="material-symbols-outlined mr-2">save</span>
                        Salva Eventi e Note
                    </M3Button>
                </>
            );
        }
    }, [result, isLoading, manualText, onClose, handleAnalyze, handleImport]);

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title="Analisi Circolare"
            headline={title}
            buttons={dialogButtons}
            fullscreen={false}
        >
            <div className="space-y-6 pt-2">
                {!result ? (
                    /* INPUT STATE */
                    <>
                        <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/30 flex gap-3">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <div className="space-y-2">
                                <h3 className="m3-label-large font-bold">Procedura Manuale (Privacy-Safe)</h3>
                                <p className="m3-body-small text-on-surface-variant">L'AI analizza solo il testo che incolli qui. Non accediamo direttamente ai link per privacy.</p>
                                <ol className="list-decimal pl-5 space-y-1 text-xs text-on-surface-variant/80">
                                    <li>
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-1">
                                            Apri la circolare originale <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                        </a>
                                    </li>
                                    <li>Seleziona e copia il testo.</li>
                                    <li>Incolla il testo nel box qui sotto.</li>
                                </ol>
                            </div>
                        </div>

                        <TextArea
                            label="Testo della Circolare"
                            id="circular-text"
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                            rows={8}
                            placeholder="Incolla qui il testo..."
                            disabled={isLoading}
                        />

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-xl text-sm justify-center">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}
                    </>
                ) : (
                    /* RESULT STATE */
                    <div className="space-y-6 animate-in fade-in">
                        <div className="p-4 bg-secondary-container/30 text-on-secondary-container rounded-2xl border border-secondary/10">
                            <h3 className="m3-label-large font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">summarize</span>
                                Riepilogo AI
                            </h3>
                            <p className="m3-body-medium opacity-90 leading-relaxed">{result.summary}</p>
                        </div>

                        {result.events.length > 0 || result.deadlines.length > 0 ? (
                            <div className="rounded-2xl border border-outline-variant/30 overflow-hidden">
                                <div className="bg-surface-container-high/50 px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center">
                                    <h4 className="m3-label-medium font-black uppercase tracking-widest text-on-surface-variant/70">Eventi Rilevati</h4>
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{result.events.length + result.deadlines.length}</span>
                                </div>
                                <div className="divide-y divide-outline-variant/10">
                                    {result.events.map((e, i) => (
                                        <div key={i} className="p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary bg-primary-container p-2 rounded-full text-sm">event</span>
                                                <span className="font-medium text-sm">{e.titolo}</span>
                                            </div>
                                            <span className="font-mono text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant/20">{e.data}</span>
                                        </div>
                                    ))}
                                    {result.deadlines.map((d, i) => (
                                        <div key={`d-${i}`} className="p-4 flex justify-between items-center bg-error-container/5 hover:bg-error-container/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-error bg-error-container p-2 rounded-full text-sm">flag</span>
                                                <span className="font-medium text-sm text-on-surface">{d.title}</span>
                                            </div>
                                            <span className="font-mono text-xs bg-error-container text-on-error-container px-2 py-1 rounded">{d.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">event_busy</span>
                                <p className="text-sm text-on-surface-variant italic">Nessun evento o scadenza rilevato nel testo.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </M3Dialog>
    );
};

export default CircolareAnalysisModal;
