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
            <M3DialogContent className="px-8 pt-8 pb-0" style={{ gap: "var(--md-sys-spacing-8)" }}>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">
                    Copia il testo di una circolare o di una email e incollalo qui sotto. L'AI estrarrà automaticamente date, orari e dettagli per creare l'evento nel calendario.
                </p>

                <div style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
                    <label htmlFor="event-text" className="form-label">Testo della comunicazione</label>
                    <textarea
                        id="event-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="form-textarea" style={{ width: "100%" }}
                        rows={10}
                        placeholder="Es. 'Si comunica che il consiglio della classe 3A è convocato per il giorno 15/10/2024 alle ore 15:30...'"
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                {error && <p className="m3-body-small" style={{ color: "var(--md-sys-color-error)", textAlign: "center", marginTop: "var(--md-sys-spacing-4)" }}>{error}</p>}
            </M3DialogContent>
            <M3DialogActions className="gap-12 px-8 pb-8" style={{ paddingTop: "0" }}>
                <M3Button variant="text" onClick={onClose} type="button" disabled={isLoading}>Annulla</M3Button>
                <M3Button variant="filled" onClick={handleParse} type="button" disabled={isLoading || !text.trim()}>
                    {isLoading ? (
                        <>
                            <div className="animate-spin border-b-2 border-on-primary" style={{ borderRadius: "9999px", height: "1.25rem", width: "1.25rem", marginRight: "0.5rem" }}></div>
                            Analisi in corso...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>auto_awesome</span>
                            Analizza Testo
                        </>
                    )}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AiEventParserModal;


