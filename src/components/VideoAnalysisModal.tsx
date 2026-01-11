
import React, { useState, useEffect } from 'react';
// Load Google GenAI dynamically to avoid bundling it in the main chunk
import { M3Dialog, TextArea, M3Button } from './ui';

interface VideoAnalysisModalProps {
    onClose: () => void;
}

const loadingMessages = [
    "Inizializzazione del modello Veo...",
    "Analisi del prompt in corso...",
    "I fotogrammi stanno prendendo vita...",
    "Renderizzazione del video ad alta definizione...",
    "Quasi pronto, applicando gli ultimi ritocchi...",
];

const VideoAnalysisModal: React.FC<VideoAnalysisModalProps> = ({ onClose }) => {
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);
    const [error, setError] = useState<string>('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        // GUIDELINE: Use window.aistudio.hasSelectedApiKey() to check for selected key
        if (window.aistudio) {
            window.aistudio.hasSelectedApiKey().then(setHasApiKey);
        } else {
            // Check if injected via process.env
            setHasApiKey(!!import.meta.env.VITE_GEMINI_API_KEY);
        }
    }, []);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // GUIDELINE: MUST assume key selection was successful after triggering openSelectKey()
            setHasApiKey(true);
        } else {
            alert("Per favore configura l'API Key nel tuo ambiente.");
        }
    };

    const handleSubmit = async () => {
        if (!prompt) {
            setError("Per favore, inserisci un prompt per generare il video.");
            return;
        }
        setError('');
        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            // GUIDELINE: Create new GoogleGenAI instance right before call (lazy-loaded)
            const genaiModule = await import('@google/genai');
            const GoogleGenAI = genaiModule.GoogleGenAI;
            const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

            // Veo model parameters
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation });
            }

            if (operation.error) {
                // GUIDELINE: Reset key if "Requested entity was not found" error occurs
                const errorMessage = typeof operation.error.message === 'string' ? operation.error.message : 'Errore durante la generazione del video.';
                if (errorMessage.includes("Requested entity was not found.")) {
                    setError("API Key non valida o permessi mancanti. Per favore, seleziona nuovamente la chiave.");
                    setHasApiKey(false);
                    return;
                }
                throw new Error(errorMessage);
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (downloadLink) {
                // GUIDELINE: Append API key when fetching from download link
                const urlWithKey = `${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`;
                const response = await fetch(urlWithKey);
                if (!response.ok) {
                    throw new Error(`Errore nel download del video: ${response.statusText}`);
                }
                const videoBlob = await response.blob();
                const videoUrl = URL.createObjectURL(videoBlob);
                setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error("Nessun link per il download del video trovato nella risposta.");
            }

        } catch (err: unknown) {
            console.error("Error during video generation:", err);
            const errorMessage = (err instanceof Error) ? err.message : String(err);
            setError(`Errore durante la generazione: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (hasApiKey === null) {
            return (
                <div className="p-20" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--md-sys-spacing-6)" }}>
                    <div className="relative">
                        <div className="border-4 border-primary/20 border-t-primary animate-spin" style={{ width: "5rem", height: "5rem", borderRadius: "9999px" }}></div>
                        <div className="absolute inset-0" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined animate-pulse" style={{ color: "var(--md-sys-color-primary)" }}>movie</span>
                        </div>
                    </div>
                    <p className="m3-label-large tracking-[0.3em] animate-pulse" style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.4" }}>Inizializzazione...</p>
                </div>
            );
        }

        if (!hasApiKey) {
            return (
                <div className="p-12 bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl rounded-5xl border-[var(--md-sys-color-outline-variant)]/20 shadow-[var(--md-sys-elevation-level4)] max-w-2xl mt-10 animate-in zoom-in-95 duration-500" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid var(--md-sys-color-outline)", marginLeft: "auto", marginRight: "auto" }}>
                    <div className="rounded-[var(--md-sys-shape-corner-large)] text-on-primary-container shadow-[var(--md-sys-elevation-level2)] rotate-3" style={{ width: "6rem", height: "6rem", backgroundColor: "var(--md-sys-color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--md-sys-spacing-8)" }}>
                        <span className="material-symbols-outlined text-5xl">vpn_key</span>
                    </div>
                    <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ fontWeight: "900", letterSpacing: "-0.005em", marginBottom: "var(--md-sys-spacing-8)" }}>API Key Richiesta</h3>
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant max-w-sm" style={{ marginBottom: "var(--md-sys-spacing-8)", lineHeight: "1.625" }}>
                        Per utilizzare la generazione video (modello Veo), è necessaria una API Key abilitata al billing.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:underline ml-1" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900" }}>
                            Scopri di più
                        </a>
                    </p>
                    {window.aistudio && (
                        <M3Button onClick={handleSelectKey} variant="primary" icon="key">Seleziona API Key</M3Button>
                    )}
                </div>
            );
        }

        return (
            <div className="lg:grid-cols-2 md:p-8 animate-in fade-in duration-700" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--md-sys-spacing-8)", height: "100%", padding: "var(--md-sys-spacing-8)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}>
                    <div className="bg-[var(--md-sys-color-surface-container-low)]/40 backdrop-blur-md rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/20 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-8)" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] bg-primary/10" style={{ width: "3rem", height: "3rem", color: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>edit_note</span>
                        </div>
                        <div>
                            <h3 className="m3-label-large" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-primary)", marginBottom: "var(--md-sys-spacing-4)" }}>1. Prompt Descrittivo</h3>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ opacity: "0.7" }}>Descrivi la scena che vuoi creare. Sii dettagliato per un risultato migliore.</p>
                        </div>
                    </div>
                    
                    <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
                        <TextArea
                            id="prompt-textarea"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Es. 'Un gatto astronauta fluttua nello spazio, inseguendo un gomitolo di lana cosmico'..."
                            containerClassName="flex-grow"
                            className="min-h-[300px] !bg-[var(--md-sys-color-surface-container-low)]/20 backdrop-blur-sm !rounded-[var(--md-sys-shape-corner-large)] !border-[var(--md-sys-color-outline-variant)]/20" style={{ height: "100%" }}
                            label="Descrizione Video"
                        />
                    </div>

                    {error && (
                        <div className="bg-error-container/80 backdrop-blur-md text-on-error-container rounded-[var(--md-sys-shape-corner-large)] border-error/20 animate-in slide-in-from-top-2" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-8)", fontSize: "0.875rem", fontWeight: "bold", border: "1px solid var(--md-sys-color-outline)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>error</span>
                            {error}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}>
                    <div className="bg-[var(--md-sys-color-surface-container-low)]/40 backdrop-blur-md rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)]/20 shadow-sm" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)", display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-8)" }}>
                        <div className="rounded-[var(--md-sys-shape-corner-large)] bg-secondary/10" style={{ width: "3rem", height: "3rem", color: "var(--md-sys-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>movie</span>
                        </div>
                        <div>
                            <h3 className="m3-label-large" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--md-sys-color-secondary)", marginBottom: "var(--md-sys-spacing-4)" }}>2. Risultato</h3>
                            <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ opacity: "0.7" }}>Il video generato apparirà qui sotto.</p>
                        </div>
                    </div>

                    <div className="rounded-5xl bg-[var(--md-sys-color-surface-container-low)]/20 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/20 min-h-[400px] relative overflow-hidden shadow-[var(--md-sys-elevation-level4)] group" style={{ flexGrow: "1", border: "1px solid var(--md-sys-color-outline)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--md-sys-spacing-8)" }}>
                        {isLoading ? (
                            <div className="z-10 relative" style={{ textAlign: "center" }}>
                                <div className="relative" style={{ marginBottom: "var(--md-sys-spacing-8)" }}>
                                    <div className="border-4 border-primary/10 border-t-primary animate-spin" style={{ width: "6rem", height: "6rem", borderRadius: "9999px", marginLeft: "auto", marginRight: "auto" }}></div>
                                    <div className="absolute inset-0" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span className="material-symbols-outlined text-3xl animate-pulse" style={{ color: "var(--md-sys-color-primary)" }}>auto_videocam</span>
                                    </div>
                                </div>
                                <p className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] animate-pulse" style={{ fontWeight: "900", color: "var(--md-sys-color-primary)", letterSpacing: "-0.005em" }}>{loadingMessage}</p>
                                <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant" style={{ marginTop: "var(--md-sys-spacing-4)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>Questa operazione può richiedere alcuni minuti.</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <div className="animate-in zoom-in-95 duration-500" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                                <div className="relative rounded-[var(--md-sys-shape-corner-large)] overflow-hidden shadow-[var(--md-sys-elevation-level4)] border-white/10" style={{ flexGrow: "1", backgroundColor: "black", border: "1px solid var(--md-sys-color-outline)" }}>
                                    <video src={generatedVideoUrl} controls autoPlay loop className="object-contain" style={{ width: "100%", height: "100%" }}></video>
                                </div>
                                <div style={{ marginTop: "var(--md-sys-spacing-6)", display: "flex", justifyContent: "center" }}>
                                    <M3Button 
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = generatedVideoUrl;
                                            a.download = 'generated-video.mp4';
                                            a.click();
                                        }}
                                        variant="secondary"
                                        icon="download"
                                        className="shadow-[var(--md-sys-elevation-level2)]"
                                    >
                                        Scarica Video
                                    </M3Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-[var(--md-sys-color-on-surface)]-variant/20 group-hover:scale-110 duration-700" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 300ms" }}>
                                <span className="material-symbols-outlined m3-icon-hero" style={{ marginBottom: "var(--md-sys-spacing-8)", opacity: "0.2" }}>videocam_off</span>
                                <p className="m3-label-large tracking-[0.3em]" style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.4" }}>In attesa di generazione</p>
                            </div>
                        )}

                        {/* Background effect */}
                        {!generatedVideoUrl && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" style={{ opacity: "0.5" }} />
                        )}
                    </div>
                </div>
            </div>
        )
    };

    return (
        <M3Dialog
            isOpen={true}
            onClose={onClose}
            title="Generazione Video con AI"
            headline="Crea brevi clip video partendo da una descrizione testuale"
            buttons={
                <div style={{ display: "flex", gap: "var(--md-sys-spacing-6)" }}>
                    <M3Button onClick={onClose} variant="text" disabled={isLoading}>Chiudi</M3Button>
                    {hasApiKey && (
                        <M3Button 
                            onClick={handleSubmit} 
                            disabled={isLoading || !prompt} 
                            variant="primary"
                            icon={isLoading ? undefined : "auto_videocam"}
                        >
                            {isLoading ? 'Generazione...' : 'Genera Video'}
                        </M3Button>
                    )}
                </div>
            }
            mode="fullscreen"
            hideBackdrop={true}
        >
            <div className="relative overflow-hidden bg-[var(--md-sys-color-surface-container-low)]est/50" style={{ height: "100%" }}>
                {/* Aura Ornaments */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] animate-pulse pointer-events-none" style={{ borderRadius: "9999px" }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] animate-pulse pointer-events-none" style={{ borderRadius: "9999px" }} style={{ animationDelay: '2s' }} />
                
                <div className="relative z-10 custom-scrollbar" style={{ height: "100%", overflowY: "auto" }}>
                    {renderContent()}
                </div>
            </div>
        </M3Dialog>
    );
};

export default VideoAnalysisModal;


