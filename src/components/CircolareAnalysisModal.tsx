// LEGACY - MD3 Non-compliant

import React, { useState, useMemo } from 'react';
import { AiSettings, CircularAnalysisResult, EventoCalendario } from '../types';
import { analyzeCircularDocument } from '../services/aiService';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea } from './ui';
import { useTheme } from '../theme/theme';

interface CircolareAnalysisModalProps {
    url: string; // URL is passed for reference (to open in new tab), not for fetching
    title: string;
    onClose: () => void;
    aiSettings: AiSettings;
    onImportEvents: (events: Partial<EventoCalendario>[]) => void;
    onSaveToKb: (note: { title: string, content: string }) => void;
}

const CircolareAnalysisModal: React.FC<CircolareAnalysisModalProps> = (props) => {
  const { layers } = useTheme();
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
                                <span  style={{ marginRight: "0.5rem" }}>progress_activity</span>
                                Analisi...
                            </>
                        ) : (
                            <>
                                <span  style={{ marginRight: "0.5rem" }}>auto_awesome</span>
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
                        <span  style={{ marginRight: "0.5rem" }}>save</span>
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
                            <div style={{ backgroundColor: layers.sys.color.surfaceContainerHigh, padding: layers.ref.spacing['4'], borderRadius: layers.ref.shape.corner.large, border: "1px solid layers.sys.color.outline", display: "flex" }}>
                                <span  style={{color: layers.sys.color.primary}}>info</span>
                                <div style={{marginTop: layers.ref.spacing['4']}}>
                                    <h3  style={{ fontWeight: "bold" }}>Procedura Manuale (Privacy-Safe)</h3>
                                    <p style={{ color:  layers.sys.color.onSurfaceVariant }}>L'AI analizza solo il testo che incolli qui. Non accediamo direttamente ai link per privacy.</p>
                                    <ol style={{ color: layers.sys.color.onSurfaceVariant, gap: layers.ref.spacing['2'] }}>
                                        <li>
                                            <a href={url} target="_blank" rel="noopener noreferrer"  style={{color: layers.sys.color.primary, fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: layers.ref.spacing['4']}}>
                                                Apri la circolare originale <span style={{ color: layers.sys.color.primary }}>open_in_new</span>
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
                                <div style={{ padding: layers.ref.spacing['4'], color: layers.sys.color.onErrorContainer, borderRadius: layers.ref.shape.corner.large, display: "flex", alignItems: "center", backgroundColor: layers.sys.color.errorContainer, justifyContent: "center" }}>
                                    <span >error</span>
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        /* RESULT STATE */
                        <div >
                            <div style={{ padding: layers.ref.spacing['4'], backgroundColor: layers.sys.color.secondaryContainer, color: layers.sys.color.onSecondaryContainer, borderRadius: layers.ref.shape.corner.large, border: "1px solid layers.sys.color.outline" }}>
                                <h3  style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>summarize</span>
                                    Riepilogo AI
                                </h3>
                                <p style={{ color: layers.sys.color.onSecondaryContainer, opacity: "0.9", lineHeight: "1.625" }}>{result.summary}</p>
                            </div>

                            {result.events.length > 0 || result.deadlines.length > 0 ? (
                                <div style={{ borderRadius: layers.ref.shape.corner.large, border: "1px solid layers.sys.color.outline" }}>
                                    <div style={{ backgroundColor: layers.sys.color.surfaceContainerHigh, paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], borderBottom: "1px solid layers.sys.color.outline", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h4 style={{ color: layers.sys.color.onSurfaceVariant, fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Eventi Rilevati</h4>
                                        <span style={{ backgroundColor: layers.sys.color.primaryContainer, color: layers.sys.color.onPrimaryContainer, fontWeight: "bold", borderRadius: layers.ref.shape.corner.small }}>{result.events.length + result.deadlines.length}</span>
                                    </div>
                                    <div >
                                        {result.events.map((e, i) => (
                                            <div key={i} style={{ padding: layers.ref.spacing['4'], display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: layers.ref.spacing['2'], color: layers.sys.color.onPrimaryContainer, backgroundColor: layers.sys.color.primaryContainer, borderRadius: layers.ref.shape.corner.small }}>event</span>
                                                    <span  style={{ fontWeight: "500" }}>{e.titolo}</span>
                                                </div>
                                                <span style={{ backgroundColor: layers.sys.color.surfaceContainerHigh, borderRadius: "0.375rem", border: "1px solid layers.sys.color.outline" }}>{e.data}</span>
                                            </div>
                                        ))}
                                        {result.deadlines.map((d, i) => (
                                            <div key={`d-${i}`} style={{ padding: layers.ref.spacing['4'], backgroundColor: layers.sys.color.errorContainer, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: layers.ref.spacing['2'], color: layers.sys.color.onErrorContainer, backgroundColor: layers.sys.color.errorContainer, borderRadius: layers.ref.shape.corner.small }}>flag</span>
                                                    <span style={{ color: layers.sys.color.onErrorContainer, fontWeight: "500" }}>{d.title}</span>
                                                </div>
                                                <span style={{ color: layers.sys.color.onErrorContainer, backgroundColor: layers.sys.color.errorContainer, borderRadius: "0.375rem" }}>{d.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: layers.ref.spacing['4'], borderRadius: layers.ref.shape.corner.large, textAlign: "center" }}>
                                    <span style={{ color: layers.sys.color.onSurfaceVariant }}>event_busy</span>
                                    <p style={{ color:  layers.sys.color.onSurfaceVariant }}>Nessun evento o scadenza rilevato nel testo.</p>
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







