
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
                <div className="flex flex-col items-center justify-center p-20 gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary animate-pulse">movie</span>
                        </div>
                    </div>
                    <p className="m3-label-large font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">Inizializzazione...</p>
                </div>
            );
        }

        if (!hasApiKey) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-container-low/30 backdrop-blur-xl rounded-5xl border border-outline-variant/20 shadow-2xl max-w-2xl mx-auto mt-10 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg mb-8 rotate-3">
                        <span className="material-symbols-outlined text-5xl">vpn_key</span>
                    </div>
                    <h3 className="m3-headline-small font-black tracking-tight mb-8">API Key Richiesta</h3>
                    <p className="m3-body-medium text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                        Per utilizzare la generazione video (modello Veo), è necessaria una API Key abilitata al billing.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 font-black">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full p-8 md:p-8 animate-in fade-in duration-700">
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-container-low/40 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 flex items-start gap-8 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">edit_note</span>
                        </div>
                        <div>
                            <h3 className="m3-label-large font-black uppercase tracking-widest text-primary mb-4">1. Prompt Descrittivo</h3>
                            <p className="m3-body-small text-on-surface-variant opacity-70">Descrivi la scena che vuoi creare. Sii dettagliato per un risultato migliore.</p>
                        </div>
                    </div>
                    
                    <div className="flex-grow flex flex-col">
                        <TextArea
                            id="prompt-textarea"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Es. 'Un gatto astronauta fluttua nello spazio, inseguendo un gomitolo di lana cosmico'..."
                            containerClassName="flex-grow"
                            className="h-full min-h-[300px] !bg-surface-container-low/20 backdrop-blur-sm !rounded-2xl !border-outline-variant/20"
                            label="Descrizione Video"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-6 p-8 bg-error-container/80 backdrop-blur-md text-on-error-container rounded-2xl text-sm font-bold border border-error/20 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-xl">error</span>
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-surface-container-low/40 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 flex items-start gap-8 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">movie</span>
                        </div>
                        <div>
                            <h3 className="m3-label-large font-black uppercase tracking-widest text-secondary mb-4">2. Risultato</h3>
                            <p className="m3-body-small text-on-surface-variant opacity-70">Il video generato apparirà qui sotto.</p>
                        </div>
                    </div>

                    <div className="flex-grow rounded-5xl bg-surface-container-low/20 backdrop-blur-xl border border-outline-variant/20 flex flex-col items-center justify-center p-8 min-h-[400px] relative overflow-hidden shadow-2xl group">
                        {isLoading ? (
                            <div className="text-center z-10 relative">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin mx-auto"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_videocam</span>
                                    </div>
                                </div>
                                <p className="m3-headline-small font-black text-primary animate-pulse tracking-tight">{loadingMessage}</p>
                                <p className="m3-body-small text-on-surface-variant mt-4 font-bold uppercase tracking-widest opacity-60">Questa operazione può richiedere alcuni minuti.</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <div className="w-full h-full flex flex-col animate-in zoom-in-95 duration-500">
                                <div className="relative flex-grow rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain"></video>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <M3Button 
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = generatedVideoUrl;
                                            a.download = 'generated-video.mp4';
                                            a.click();
                                        }}
                                        variant="secondary"
                                        icon="download"
                                        className="shadow-lg"
                                    >
                                        Scarica Video
                                    </M3Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-on-surface-variant/20 flex flex-col items-center group-hover:scale-110 transition-transform duration-700">
                                <span className="material-symbols-outlined m3-icon-hero mb-8 opacity-20">videocam_off</span>
                                <p className="m3-label-large font-black uppercase tracking-[0.3em] opacity-40">In attesa di generazione</p>
                            </div>
                        )}

                        {/* Background effect */}
                        {!generatedVideoUrl && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />
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
                <div className="flex gap-6">
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
            <div className="h-full relative overflow-hidden bg-surface-container-lowest/50">
                {/* Aura Ornaments */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
                
                <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </div>
        </M3Dialog>
    );
};

export default VideoAnalysisModal;
