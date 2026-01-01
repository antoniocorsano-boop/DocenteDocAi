import React, { useState } from 'react';
import { TextArea } from './M3Components';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

interface DocumentGeneratorModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => void;
}

const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({ onClose, onGenerate }) => {
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
            open={true}
            onClose={onClose}
            maxWidth="sm"
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <M3DialogContent className="space-y-6">
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

                <M3DialogActions className="gap-2">
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="button" onClick={handleSubmit} className="button button-filled rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">auto_awesome</span>
                        Genera Documento
                    </button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default DocumentGeneratorModal;
