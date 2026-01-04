import { M3Button, M3Dialog, M3DialogContent, M3DialogActions } from './ui';
import React, { useState } from 'react';
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
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : "Si è verificato un errore durante l'analisi.";
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <M3Dialog
            title="Crea Evento da Testo con AI"
            onClose={onClose}
            maxWidth="lg"
            level={1}
        >
            <M3DialogContent className="space-y-4 bg-surface-container-high/30 backdrop-blur-sm">
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
                {error && <p className="text-error text-center m3-body-small">{error}</p>}
            </M3DialogContent>
            <M3DialogActions className="gap-2">
                <M3Button variant="text" onClick={onClose} type="button" disabled={isLoading}>Annulla</M3Button>
                <M3Button variant="filled" onClick={handleParse} type="button" disabled={isLoading || !text.trim()}>
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
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AiEventParserModal;
