// LEGACY - MD3 Non-compliant

import React, { useState, useEffect } from 'react';
// Load Google GenAI dynamically to avoid bundling it in the main chunk
import { M3Dialog, TextArea, M3Button } from './ui';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
                <div style={{ padding: layers.ref.spacing['4'], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: layers.ref.spacing['6'] }}>
                    <div >
                        <div  style={{ width: layers.ref.spacing['8'], height: layers.ref.spacing['8'], borderRadius: layers.ref.spacing['4'] }}></div>
                        <div  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span  style={{color: layers.sys.color.primary}}>movie</span>
                        </div>
                    </div>
                    <p  style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.4" }}>Inizializzazione...</p>
                </div>
            );
        }

        if (!hasApiKey) {
            return (
                <div style={{ padding: layers.ref.spacing['4'], backgroundColor: layers.sys.color.surfaceContainerLow, borderRadius: layers.ref.shape.corner.large, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid layers.sys.color.outline", marginLeft: "auto", marginRight: "auto" }}>
                    <div style={{ borderRadius: layers.ref.shape.corner.large, color: layers.sys.color.onPrimaryContainer, width: layers.ref.spacing['8'], height: layers.ref.spacing['8'], backgroundColor: layers.sys.color.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: layers.ref.spacing['8'] }}>
                        <span style={{ color: layers.sys.color.primary }}>vpn_key</span>
                    </div>
                    <h3 style={{ color: layers.sys.color.onSurface, fontWeight: "900", letterSpacing: "-0.005em", marginBottom: layers.ref.spacing['8'] }}>API Key Richiesta</h3>
                    <p style={{ color: layers.sys.color.onSurfaceVariant, marginBottom: layers.ref.spacing['8'], lineHeight: "1.625" }}>
                        Per utilizzare la generazione video (modello Veo), è necessaria una API Key abilitata al billing.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer"  style={{color: layers.sys.color.primary, fontWeight: "900"}}>
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
            <div  style={{display: "grid", gridTemplateColumns: "1fr", gap: layers.ref.spacing['8'], height: "100%", padding: layers.ref.spacing['8']}}>
                <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6']}}>
                    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/40, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline", display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['8']}}>
                        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: sys.colors.primary/10 }} style={{width: layers.ref.spacing['16'], height: layers.ref.spacing['16'], color: "layers.sys.color.primary", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>edit_note</span>
                        </div>
                        <div>
                            <h3  style={{fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.primary", marginBottom: layers.ref.spacing['4']}}>1. Prompt Descrittivo</h3>
                            <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ opacity: "0.7" }}>Descrivi la scena che vuoi creare. Sii dettagliato per un risultato migliore.</p>
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
                             style={{ height: "100%" }}
                            label="Descrizione Video"
                        />
                    </div>

                    {error && (
                        <div style={{ backgroundColor: sys.colors.error-container/80, color: sys.colors.on-error-container, borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['8'], fontSize: "0.875rem", fontWeight: "bold", border: "1px solid layers.sys.color.outline"}}>
                            <span  style={{ fontSize: "1.25rem" }}>error</span>
                            {error}
                        </div>
                    )}
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6']}}>
                    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow/40, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['6'], border: "1px solid layers.sys.color.outline", display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['8']}}>
                        <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: sys.colors.secondary/10 }} style={{width: layers.ref.spacing['16'], height: layers.ref.spacing['16'], color: "layers.sys.color.secondary", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}>
                            <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>movie</span>
                        </div>
                        <div>
                            <h3  style={{fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "layers.sys.color.secondary", marginBottom: layers.ref.spacing['4']}}>2. Risultato</h3>
                            <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ opacity: "0.7" }}>Il video generato apparirà qui sotto.</p>
                        </div>
                    </div>

                    <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor: layers.sys.color.surfaceContainerLow, flexGrow: "1", border: "1px solid layers.sys.color.outline", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: layers.ref.spacing['8'] }}>
                        {isLoading ? (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: layers.ref.spacing['8'] }}>
                                    <div style={{ width: layers.ref.spacing['12'], height: layers.ref.spacing['12'], borderRadius: layers.ref.shape.corner.small, marginLeft: "auto", marginRight: "auto" }}></div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ color: layers.sys.color.primary }}>auto_videocam</span>
                                    </div>
                                </div>
                                <p style={{ fontWeight: "900", color: layers.sys.color.primary, letterSpacing: "-0.005em" }}>{loadingMessage}</p>
                                <p style={{ color: layers.sys.color.onSurfaceVariant, marginTop: layers.ref.spacing['4'], fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>Questa operazione pu� richiedere alcuni minuti.</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <div  style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                                <div style={{ borderRadius: layers.ref.shape.corner.large }} style={{flexGrow: "1", backgroundColor: "black", border: "1px solid layers.sys.color.outline"}}>
                                    <video src={generatedVideoUrl} controls autoPlay loop  style={{ width: "100%", height: "100%" }}></video>
                                </div>
                                <div style={{marginTop: layers.ref.spacing['6'], display: "flex", justifyContent: "center"}}>
                                    <M3Button 
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = generatedVideoUrl;
                                            a.download = 'generated-video.mp4';
                                            a.click();
                                        }}
                                        variant="secondary"
                                        icon="download"
                                        
                                    >
                                        Scarica Video
                                    </M3Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color:  layers.sys.color.onSurfaceVariant/20 }} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", transition: "transform 300ms" }}>
                                <span  style={{marginBottom: layers.ref.spacing['8'], opacity: "0.2"}}>videocam_off</span>
                                <p  style={{ fontWeight: "900", textTransform: "uppercase", opacity: "0.4" }}>In attesa di generazione</p>
                            </div>
                        )}

                        {/* Background effect */}
                        {!generatedVideoUrl && (
                            <div style={{ backgroundColor: sys.colors.gradient-to-br }} style={{ opacity: "0.5" }} />
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
                <div style={{display: "flex", gap: layers.ref.spacing['6']}}>
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
            <div style={{ backgroundColor: layers.sys.color.surfaceContainerLowest, height: "100%" }}>
                {/* Aura Ornaments */}
                <div style={{ backgroundColor: layers.sys.color.primaryContainer, borderRadius: layers.ref.shape.corner.small }} />
                <div style={{ backgroundColor: layers.sys.color.secondaryContainer, borderRadius: layers.ref.shape.corner.small, animationDelay: '2s' }} />
                
                <div  style={{ height: "100%", overflowY: "auto" }}>
                    {renderContent()}
                </div>
            </div>
        </M3Dialog>
    );
};

export default VideoAnalysisModal;







