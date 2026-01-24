// LEGACY - MD3 Non-compliant
import { M3Button, M3Dialog, M3DialogContent, M3DialogActions } from './ui';
import React, { useState } from 'react';
import { AiSettings, EventoCalendario } from '../types';
import { extractEventFromText } from '../services/aiService';
import { useTheme } from '../theme/theme';

interface AiEventParserModalProps {
    onClose: () => void;
    onEventParsed: (eventData: Partial<EventoCalendario>) => void;
    aiSettings: AiSettings;
}

const AiEventParserModal: React.FC<AiEventParserModalProps> = ({ onClose, onEventParsed, aiSettings }) => {
  const { layers } = useTheme();
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
            <M3DialogContent  style={{gap: layers.ref.spacing['8']}}>
                <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }}>
                    Copia il testo di una circolare o di una email e incollalo qui sotto. L'AI estrarrà automaticamente date, orari e dettagli per creare l'evento nel calendario.
                </p>

                <div style={{marginTop: layers.ref.spacing['4']}}>
                    <label htmlFor="event-text" >Testo della comunicazione</label>
                    <textarea
                        id="event-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                         style={{ width: "100%" }}
                        rows={10}
                        placeholder="Es. 'Si comunica che il consiglio della classe 3A è convocato per il giorno 15/10/2024 alle ore 15:30...'"
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                {error && <p  style={{color: "layers.sys.colors.error", textAlign: "center", marginTop: layers.ref.spacing['4']}}>{error}</p>}
            </M3DialogContent>
            <M3DialogActions  style={{ paddingTop: "0" }}>
                <M3Button variant="text" onClick={onClose} type="button" disabled={isLoading}>Annulla</M3Button>
                <M3Button variant="filled" onClick={handleParse} type="button" disabled={isLoading || !text.trim()}>
                    {isLoading ? (
                        <>
                            <div  style={{ borderRadius: ref.spacing[9999], height: "1.25rem", width: "1.25rem", marginRight: "0.5rem" }}></div>
                            Analisi in corso...
                        </>
                    ) : (
                        <>
                            <span  style={{ marginRight: "0.5rem" }}>auto_awesome</span>
                            Analizza Testo
                        </>
                    )}
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AiEventParserModal;



