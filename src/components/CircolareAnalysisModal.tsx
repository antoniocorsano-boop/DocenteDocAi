
import React, { useState, useMemo } from 'react';
import { AiSettings, CircularAnalysisResult, EventoCalendario } from '../types';
import { analyzeCircularDocument } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea } from './ui';

interface CircolareAnalysisModalProps {
    url: string; // URL is passed for reference (to open in new tab), not for fetching
    title: string;
    onClose: () => void;
    aiSettings: AiSettings;
    onImportEvents: (events: Partial<EventoCalendario>[]) => void;
    onSaveToKb: (note: { title: string, content: string }) => void;
}

const CircolareAnalysisModal: React.FC<CircolareAnalysisModalProps> = (props) => {
    const { url, onClose, aiSettings, onImportEvents, onSaveToKb } = props;

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
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Si è verificato un errore sconosciuto durante l\'analisi.';
            setError(errorMsg);
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
                                <span className="material-symbols-outlined animate-spin" style={{ marginRight: "0.5rem" }}>progress_activity</span>
                                Analisi...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>auto_awesome</span>
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
                        <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>save</span>
                        Salva Eventi e Note
                    </M3Button>
                </>
            );
        }
    }, [result, isLoading, manualText, onClose, handleAnalyze, handleImport]);

    return (
        <M3Dialog
            onClose={onClose}
            title="Analisi Circolare"
            level={1}
            hideBackdrop={true}
        >
            <M3DialogContent className="px-12 pt-12 pb-0">
                <div className="space-y-12">
                    {!result ? (
                        /* INPUT STATE */
                        <>
                            <div className="bg-[var(--md-sys-color-surface-container-high)] p-12 rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/30 gap-12" style={{ border: "1px solid var(--md-sys-color-outline)", display: "flex" }}>
                                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>info</span>
                                <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                                    <h3 className="m3-label-large" style={{ fontWeight: "bold" }}>Procedura Manuale (Privacy-Safe)</h3>
                                    <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">L'AI analizza solo il testo che incolli qui. Non accediamo direttamente ai link per privacy.</p>
                                    <ol className="list-decimal pl-8 m3-label-small text-[var(--md-sys-color-on-surface)]-variant/80" style={{ gap: "var(--md-sys-spacing-2)" }}>
                                        <li>
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--md-sys-color-primary)", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
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
                                className="mt-12"
                            />

                            {error && (
                                <div className="gap-12 p-12 text-on-error-container rounded-[var(--md-sys-shape-corner-large)] m3-body-small" style={{ display: "flex", alignItems: "center", backgroundColor: "var(--md-sys-color-error-container)", justifyContent: "center" }}>
                                    <span className="material-symbols-outlined m3-label-large">error</span>
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        /* RESULT STATE */
                        <div className="space-y-12 animate-in fade-in">
                            <div className="p-12 bg-secondary-container/30 text-on-secondary-container rounded-[var(--md-sys-shape-corner-large)] border-secondary/10" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                                <h3 className="m3-label-large mb-12 gap-12" style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>summarize</span>
                                    Riepilogo AI
                                </h3>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ opacity: "0.9", lineHeight: "1.625" }}>{result.summary}</p>
                            </div>

                            {result.events.length > 0 || result.deadlines.length > 0 ? (
                                <div className="rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden" style={{ border: "1px solid var(--md-sys-color-outline)" }}>
                                    <div className="bg-[var(--md-sys-color-surface-container-high)]/50 px-8 border-[var(--md-sys-color-outline-variant)]/10" style={{ paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)", borderBottom: "1px solid var(--md-sys-color-outline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h4 className="m3-label-medium text-[var(--md-sys-color-on-surface)]-variant/70" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Eventi Rilevati</h4>
                                        <span className="bg-primary/10 text-[10px] px-8 py-2" style={{ color: "var(--md-sys-color-primary)", fontWeight: "bold", borderRadius: "9999px" }}>{result.events.length + result.deadlines.length}</span>
                                    </div>
                                    <div className="divide-y divide-outline-variant/10">
                                        {result.events.map((e, i) => (
                                            <div key={i} className="p-12 hover:bg-[var(--md-sys-color-surface-container-low)]" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div className="gap-12" style={{ display: "flex", alignItems: "center" }}>
                                                    <span className="material-symbols-outlined p-12 m3-body-small" style={{ color: "var(--md-sys-color-primary)", backgroundColor: "var(--md-sys-color-primary-container)", borderRadius: "9999px" }}>event</span>
                                                    <span className="m3-body-small" style={{ fontWeight: "500" }}>{e.titolo}</span>
                                                </div>
                                                <span className="font-mono m3-label-small bg-[var(--md-sys-color-surface-container-high)] px-8 py-2 border-[var(--md-sys-color-outline-variant)]/20" style={{ borderRadius: "0.375rem", border: "1px solid var(--md-sys-color-outline)" }}>{e.data}</span>
                                            </div>
                                        ))}
                                        {result.deadlines.map((d, i) => (
                                            <div key={`d-${i}`} className="p-12 bg-error-container/5 hover:bg-error-container/10" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div className="gap-12" style={{ display: "flex", alignItems: "center" }}>
                                                    <span className="material-symbols-outlined p-12 m3-body-small" style={{ color: "var(--md-sys-color-error)", backgroundColor: "var(--md-sys-color-error-container)", borderRadius: "9999px" }}>flag</span>
                                                    <span className="m3-body-small text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "500" }}>{d.title}</span>
                                                </div>
                                                <span className="font-mono m3-label-small text-on-error-container px-8 py-2" style={{ backgroundColor: "var(--md-sys-color-error-container)", borderRadius: "0.375rem" }}>{d.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 border-2 border-dashed border-[var(--md-sys-color-outline-variant)]/30 rounded-[var(--md-sys-shape-corner-large)]" style={{ textAlign: "center" }}>
                                    <span className="material-symbols-outlined m3-display-small text-[var(--md-sys-color-on-surface)]-variant/30 mb-12">event_busy</span>
                                    <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant italic">Nessun evento o scadenza rilevato nel testo.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </M3DialogContent>
            <M3DialogActions className="gap-12 px-12 pb-12" style={{ paddingTop: "0" }}>
                {dialogButtons}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default CircolareAnalysisModal;


