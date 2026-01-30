// LEGACY - MD3 Non-compliant

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
                                <span  style={{ marginRight: 'var(--md-sys-spacing-2)' }}>progress_activity</span>
                                Analisi...
                            </>
                        ) : (
                            <>
                                <span  style={{ marginRight: 'var(--md-sys-spacing-2)' }}>auto_awesome</span>
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
                        <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>save</span>
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
            <M3DialogContent >
                <div >
                    {!result ? (
                        /* INPUT STATE */
                        <>
                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", display: "flex" }}>
                                <span  style={{color: 'var(--md-sys-color-primary)'}}>info</span>
                                <div style={{marginTop: 'var(--md-sys-spacing-4)'}}>
                                    <h3  style={{ fontWeight: "bold" }}>Procedura Manuale (Privacy-Safe)</h3>
                                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>L'AI analizza solo il testo che incolli qui. Non accediamo direttamente ai link per privacy.</p>
                                    <ol style={{ color: 'var(--md-sys-color-on-surface-variant)', gap: 'var(--md-sys-spacing-2)' }}>
                                        <li>
                                            <a href={url} target="_blank" rel="noopener noreferrer"  style={{color: 'var(--md-sys-color-primary)', fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)'}}>
                                                Apri la circolare originale <span style={{ color: 'var(--md-sys-color-primary)' }}>open_in_new</span>
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
                                <div style={{ padding: 'var(--md-sys-spacing-4)', color: 'var(--md-sys-color-on-error-container)', borderRadius: 'var(--md-sys-shape-corner-large)', display: "flex", alignItems: "center", backgroundColor: 'var(--md-sys-color-error-container)', justifyContent: "center" }}>
                                    <span >error</span>
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        /* RESULT STATE */
                        <div >
                            <div style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                <h3  style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>summarize</span>
                                    Riepilogo AI
                                </h3>
                                <p style={{ color: 'var(--md-sys-color-on-secondary-container)', opacity: "0.9", lineHeight: "1.625" }}>{result.summary}</p>
                            </div>

                            {result.events.length > 0 || result.deadlines.length > 0 ? (
                                <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                                    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)', borderBottom: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h4 style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Eventi Rilevati</h4>
                                        <span style={{ backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', fontWeight: "bold", borderRadius: 'var(--md-sys-shape-corner-small)' }}>{result.events.length + result.deadlines.length}</span>
                                    </div>
                                    <div >
                                        {result.events.map((e, i) => (
                                            <div key={i} style={{ padding: 'var(--md-sys-spacing-4)', display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-primary)', backgroundColor: 'var(--md-sys-color-primary)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>event</span>
                                                    <span  style={{ fontWeight: "500" }}>{e.titolo}</span>
                                                </div>
                                                <span style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-small)', border: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>{e.data}</span>
                                            </div>
                                        ))}
                                        {result.deadlines.map((d, i) => (
                                            <div key={`d-${i}`} style={{ padding: 'var(--md-sys-spacing-4)', backgroundColor: 'var(--md-sys-color-error-container)', display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-error-container)', backgroundColor: 'var(--md-sys-color-error-container)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>flag</span>
                                                    <span style={{ color: 'var(--md-sys-color-on-error-container)', fontWeight: "500" }}>{d.title}</span>
                                                </div>
                                                <span style={{ color: 'var(--md-sys-color-on-error-container)', backgroundColor: 'var(--md-sys-color-error-container)', borderRadius: 'var(--md-sys-shape-corner-small)' }}>{d.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-shape-corner-large)', textAlign: "center" }}>
                                    <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>event_busy</span>
                                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Nessun evento o scadenza rilevato nel testo.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </M3DialogContent>
            <M3DialogActions  style={{ paddingTop: "0" }}>
                {dialogButtons}
            </M3DialogActions>
        </M3Dialog>
    );
};

export default CircolareAnalysisModal;








