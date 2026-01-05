
import React, { useState, useRef, useEffect } from 'react';
import { getGoogleAIClient } from '../services/aiClient.ts';

interface VoiceNoteRecorderProps {
    onTranscription: (text: string) => void;
    compact?: boolean;
}

const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onTranscription, compact = false }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const cleanupAudioResources = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        if (analyserRef.current) {
            analyserRef.current.disconnect();
            analyserRef.current = null;
        }

        // IMPORTANT: Do NOT close context immediately on stop, only on unmount.
        // Or if we create new one each time, ensure we close old one.
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
            audioContextRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        // Global cleanup ONLY on unmount
        return () => {
            cleanupAudioResources();
        };
    }, []);

    const startRecording = async () => {
        cleanupAudioResources(); // Clean previous session if any

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Use the updated global definition for webkitAudioContext
            const AudioContextClass = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            const audioCtx = new AudioContextClass();
            await audioCtx.resume(); // CRITICAL: Ensure context is active (User Interaction policy)

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 32;
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            // DO NOT CONNECT to destination to avoid feedback loop

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
            sourceRef.current = source;

            // Recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = handleStopRecording;
            mediaRecorder.start();
            setIsRecording(true);
            // Notify global UI that assistant is listening
            try { window.dispatchEvent(new CustomEvent('assistant:recording', { detail: { recording: true } })); } catch { /* ignore */ }
            visualize();

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Impossibile accedere al microfono. Verifica i permessi del browser.");
        }
    };

    const visualize = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);

        // Keep loop running if recording OR processing (to finish animation smoothly)
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            animationFrameRef.current = requestAnimationFrame(visualize);
        } else {
            setAudioLevel(0);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            // Don't set isRecording to false here immediately, wait for onstop
            // But we can trigger processing state UI
            setIsProcessing(true);
        }
    };

    const handleStopRecording = async () => {
        setIsRecording(false); // Update UI state
        // Notify global UI that assistant stopped listening
        try { window.dispatchEvent(new CustomEvent('assistant:recording', { detail: { recording: false } })); } catch { /* ignore */ }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Cleanup streams immediately to release mic
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                // Check valid data
                if (!base64data || !base64data.includes(',')) {
                    console.warn("Empty audio recording");
                    setIsProcessing(false);
                    return;
                }
                const base64AudioContent = base64data.split(',')[1];

                const ai = await getGoogleAIClient();
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { mimeType: 'audio/webm', data: base64AudioContent } },
                            { text: "Trascrivi questa nota vocale di un insegnante per il registro di classe. Correggi eventuali errori grammaticali minori, usa la punteggiatura corretta e, se ci sono elenchi, formattali con trattini. Restituisci solo il testo." }
                        ]
                    }
                });

                if (response.text) {
                    onTranscription(response.text.trim());
                }
                setIsProcessing(false);
                cleanupAudioResources(); // Full cleanup
            };
        } catch (error) {
            console.error("Error during transcription:", error);
            alert("Errore durante la trascrizione. Riprova.");
            setIsProcessing(false);
            cleanupAudioResources();
        }
    };

    // Dynamic style for the visualizer ring
    const visualizerStyle = {
        boxShadow: isRecording ? `0 0 0 ${Math.min(audioLevel / 5, 10)}px var(--colors-error-container)` : 'none',
        transform: isRecording ? `scale(${1 + (audioLevel / 255) * 0.2})` : 'scale(1)',
        transition: 'box-shadow 0.1s, transform 0.1s'
    };

    return (
        <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`button ${compact ? 'icon-button' : 'button-tonal'} ${isRecording ? 'bg-error-container text-on-error-container' : ''}`}
            style={visualizerStyle}
            title={isRecording ? "Ferma registrazione" : "Detta nota vocale"}
        >
            {isProcessing ? (
                <span className="button-spinner !w-5 !h-5 !border-2"></span>
            ) : (
                <span className="material-symbols-outlined">{isRecording ? 'mic_off' : 'mic'}</span>
            )}
            {!compact && !isProcessing && <span className="ml-2">{isRecording ? 'Stop' : 'Detta Nota'}</span>}
        </button>
    );
};

export default VoiceNoteRecorder;
