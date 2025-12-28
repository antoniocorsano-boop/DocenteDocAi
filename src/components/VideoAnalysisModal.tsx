
import React, { useState, useEffect } from 'react';
// Load Google GenAI dynamically to avoid bundling it in the main chunk
import { M3Dialog, TextArea } from './M3Components';

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
            return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
        }

        if (!hasApiKey) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4">vpn_key</span>
                    <h3 className="m3-headline-small mb-2">API Key Richiesta</h3>
                    <p className="m3-body-medium text-on-surface-variant max-w-sm mb-6">
                        Per utilizzare la generazione video (modello Veo), è necessaria una API Key abilitata al billing.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 font-bold">
                            Scopri di più
                        </a>
                    </p>
                    {window.aistudio && (
                        <button onClick={handleSelectKey} className="button button-filled">Seleziona API Key</button>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
                <div className="flex flex-col gap-4">
                    <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary">edit</span>
                        <div>
                            <h3 className="m3-label-large font-bold">1. Prompt Descrittivo</h3>
                            <p className="m3-body-medium text-on-surface-variant text-sm">Descrivi la scena che vuoi creare. Sii dettagliato per un risultato migliore.</p>
                        </div>
                    </div>
                    <TextArea
                        id="prompt-textarea"
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Es. 'Un gatto astronauta fluttua nello spazio, inseguendo un gomitolo di lana cosmico'..."
                        containerClassName="flex-grow"
                        className="h-full min-h-[200px]"
                        label="Descrizione Video"
                    />

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-xl text-sm justify-center">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary">movie</span>
                        <div>
                            <h3 className="m3-label-large font-bold">2. Risultato</h3>
                            <p className="m3-body-medium text-on-surface-variant text-sm">Il video generato apparirà qui sotto.</p>
                        </div>
                    </div>

                    <div className="flex-grow rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col items-center justify-center p-4 min-h-[300px] relative overflow-hidden">
                        {isLoading ? (
                            <div className="text-center z-10 relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="m3-title-medium font-bold text-primary animate-pulse">{loadingMessage}</p>
                                <p className="m3-body-small text-on-surface-variant mt-2 opacity-80">Questa operazione può richiederealcuni minuti.</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <div className="w-full h-full flex flex-col">
                                <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg shadow-sm bg-black"></video>
                                <a href={generatedVideoUrl} download="generated-video.mp4" className="button button-tonal mt-4 self-center flex items-center gap-2">
                                    <span className="material-symbols-outlined">download</span> Scarica Video
                                </a>
                            </div>
                        ) : (
                            <div className="text-center text-on-surface-variant/30 flex flex-col items-center">
                                <span className="material-symbols-outlined text-8xl mb-2">videocam_off</span>
                                <p className="m3-label-large">In attesa di generazione</p>
                            </div>
                        )}

                        {/* Background effect */}
                        {!generatedVideoUrl && <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high opacity-50 -z-0 pointer-events-none" />}
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
                hasApiKey ? (
                    <>
                        <button onClick={onClose} className="button button-text" disabled={isLoading}>Chiudi</button>
                        <button onClick={handleSubmit} disabled={isLoading || !prompt} className="button button-filled">
                            {isLoading ? 'Generazione...' : 'Genera Video'}
                        </button>
                    </>
                ) : (
                    <button onClick={onClose} className="button button-text">Chiudi</button>
                )
            }
            fullscreen={true}
        >
            {renderContent()}
        </M3Dialog>
    );
};

export default VideoAnalysisModal;
