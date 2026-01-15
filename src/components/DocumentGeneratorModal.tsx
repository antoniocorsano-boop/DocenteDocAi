// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea } from './ui';
import { useTheme } from '../theme/theme';

interface DocumentGeneratorModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => void;
}

const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({ onClose, onGenerate }) => {
  const { layers } = useTheme();
  const [prompt, setPrompt] = useState('');

    const handleSubmit = () => {
        if (!prompt.trim()) {
            alert("Per favore, inserisci un prompt per il documento.");
            return;
        }
        onGenerate(prompt);
    };

    return (
        <M3Dialog
            title="Crea Documento Formattato"
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{gap: layers.ref.spacing['6']}}>
                <M3DialogContent style={{gap: layers.ref.spacing['6']}}>
                    <TextArea
                        id="doc-generator-prompt"
                        label="Descrivi il documento che vuoi creare"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Scrivi una relazione dettagliata sul Rinascimento italiano, organizzata in sezioni per arte, scienza e politica.'..."
                        autoFocus
                    />
                </M3DialogContent>

                <M3DialogActions style={{gap: layers.ref.spacing['6']}}>
                    <M3Button type="button" onClick={onClose} variant="text">Annulla</M3Button>
                    <M3Button type="button" onClick={handleSubmit} variant="filled">
                        <span  style={{ marginRight: "0.5rem" }}>auto_awesome</span>
                        Genera Documento
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default DocumentGeneratorModal;








