import React, { useState } from 'react';
import { TextArea } from './M3Components';

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
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-lg">
                <div className="dialog-header">
                    <h2 className="m3-headline-medium font-black">Crea Documento Formattato</h2>
                    <button type="button" onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-6">
                    <TextArea
                        id="doc-generator-prompt" // FIX: Add ID
                        label="Descrivi il documento che vuoi creare"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Scrivi una relazione dettagliata sul Rinascimento italiano, organizzata in sezioni per arte, scienza e politica.'..."
                        autoFocus
                    />
                </div>
                <div className="dialog-footer">
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="button" onClick={handleSubmit} className="button button-filled rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">auto_awesome</span>
                        Genera Documento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentGeneratorModal;
