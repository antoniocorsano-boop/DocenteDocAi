
import React, { useState, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { AiSettings, EventoCalendario } from '../types';
import { extractEventFromText } from '../services/aiService';

interface AiEventParserModalProps {
    onClose: () => void;
    onEventParsed: (eventData: Partial<EventoCalendario>) => void;
    aiSettings: AiSettings;
}

const AiEventParserModal: React.FC<AiEventParserModalProps> = ({ onClose, onEventParsed, aiSettings }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleParse = async () => {
        if (!text.trim()) {
            setError('Per favore, incolla il testo della comunicazione.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const parsedData = await extractEventFromText(aiSettings, text);
            onEventParsed(parsedData);
        } catch (e: any) {
            setError(e.message || "Si è verificato un errore durante l'analisi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Accessibility & UX
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({
        isOpen: true,
        onClose,
        overlayRef,
        containerRef,
        onOverlayClick: onClose
    });

    return (
        <div className="dialog-backdrop animate-fade-in" ref={overlayRef}>
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                    className="dialog-container"
                    style={{
                        maxWidth: '95vw',
                        width: '100%',
                        maxHeight: '95vh',
                        margin: '0 auto',
                        padding: '0',
                        overflowY: 'auto',
                        borderRadius: '16px',
                        boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                        background: 'var(--sys-surface)',
                    }}
            >
                <div className="dialog-header">
                    <h2 className="m3-headline-medium">Crea Evento da Testo con AI</h2>
                    <button type="button" onClick={onClose} className="icon-button" disabled={isLoading}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-4">
                    <p className="m3-body-medium text-on-surface-variant">
                        Copia il testo di una circolare o di una email e incollalo qui sotto. L'AI estrarrà automaticamente date, orari e dettagli per creare l'evento nel calendario.
                    </p>

                    <div>
                        <label htmlFor="event-text" className="form-label">Testo della comunicazione</label>
                        <textarea
                            id="event-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="form-textarea w-full"
                            rows={10}
                            placeholder="Es. 'Si comunica che il consiglio della classe 3A è convocato per il giorno 15/10/2024 alle ore 15:30...'"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-error text-center text-sm">{error}</p>}
                </div>
                <div className="dialog-footer">
                    <button type="button" onClick={onClose} className="button button-text" disabled={isLoading}>
                        Annulla
                    </button>
                    <button type="button" onClick={handleParse} className="button button-filled" disabled={isLoading || !text.trim()}>
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary mr-2"></div>
                                Analisi in corso...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                Analizza Testo
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiEventParserModal;
