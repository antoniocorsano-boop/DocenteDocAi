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
                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)], padding: ref.spacing[12], borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline", display: "flex"}}>
                                <span  style={{color: layers.sys.colors.primary}}>info</span>
                                <div style={{marginTop: layers.ref.spacing['4']}}>
                                    <h3  style={{ fontWeight: "bold" }}>Procedura Manuale (Privacy-Safe)</h3>
                                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>L'AI analizza solo il testo che incolli qui. Non accediamo direttamente ai link per privacy.</p>
                                    <ol style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/80 }} style={{gap: layers.ref.spacing['2']}}>
                                        <li>
                                            <a href={url} target="_blank" rel="noopener noreferrer"  style={{color: layers.sys.colors.primary, fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: layers.ref.spacing['4']}}>
                                                Apri la circolare originale <span style={{ color: sys.colors.[10px] }}>open_in_new</span>
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
                                <div style={{ padding: ref.spacing[12], color: sys.colors.on-error-container, borderRadius: ref.shape[] }} style={{display: "flex", alignItems: "center", backgroundColor: layers.sys.colors.error-container, justifyContent: "center"}}>
                                    <span >error</span>
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        /* RESULT STATE */
                        <div >
                            <div style={{ padding: ref.spacing[12], backgroundColor: sys.colors.secondary-container/30, color: sys.colors.on-secondary-container, borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline"}}>
                                <h3  style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>summarize</span>
                                    Riepilogo AI
                                </h3>
                                <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)] }} style={{ opacity: "0.9", lineHeight: "1.625" }}>{result.summary}</p>
                            </div>

                            {result.events.length > 0 || result.deadlines.length > 0 ? (
                                <div style={{ borderRadius: ref.shape[] }} style={{border: "1px solid layers.sys.colors.outline"}}>
                                    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/50 }} style={{paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], borderBottom: "1px solid layers.sys.colors.outline", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <h4 style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/70 }} style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>Eventi Rilevati</h4>
                                        <span style={{ backgroundColor: sys.colors.primary/10, color: sys.colors.[10px] }} style={{color: layers.sys.colors.primary, fontWeight: "bold", borderRadius: ref.spacing[9999]}}>{result.events.length + result.deadlines.length}</span>
                                    </div>
                                    <div >
                                        {result.events.map((e, i) => (
                                            <div key={i} style={{ padding: ref.spacing[12] }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: ref.spacing[12] }} style={{color: layers.sys.colors.primary, backgroundColor: layers.sys.colors.primary-container, borderRadius: ref.spacing[9999]}}>event</span>
                                                    <span  style={{ fontWeight: "500" }}>{e.titolo}</span>
                                                </div>
                                                <span style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)] }} style={{borderRadius: "0.375rem", border: "1px solid layers.sys.colors.outline"}}>{e.data}</span>
                                            </div>
                                        ))}
                                        {result.deadlines.map((d, i) => (
                                            <div key={`d-${i}`} style={{ padding: ref.spacing[12], backgroundColor: sys.colors.error-container/5 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 300ms" }}>
                                                <div  style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ padding: ref.spacing[12] }} style={{color: layers.sys.colors.error, backgroundColor: layers.sys.colors.error-container, borderRadius: ref.spacing[9999]}}>flag</span>
                                                    <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "500" }}>{d.title}</span>
                                                </div>
                                                <span style={{ color: sys.colors.on-error-container }} style={{backgroundColor: layers.sys.colors.error-container, borderRadius: "0.375rem"}}>{d.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: ref.spacing[12], borderRadius: ref.shape[] }} style={{ textAlign: "center" }}>
                                    <span style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant/30 }}>event_busy</span>
                                    <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>Nessun evento o scadenza rilevato nel testo.</p>
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



