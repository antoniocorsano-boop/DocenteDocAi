import React, { useState } from 'react';
import { TextArea } from './M3Components';
import { M3Dialog, M3DialogContent, M3DialogActions } from './M3Dialog';

interface ImageGeneratorModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => void;
}

const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ onClose, onGenerate }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = () => {
        if (!prompt.trim()) {
            alert("Per favore, inserisci una descrizione per l'immagine.");
            return;
        }
        onGenerate(prompt);
    };

    return (
        <M3Dialog
            title="Genera Immagine"
            open={true}
            onClose={onClose}
            maxWidth="sm"
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <M3DialogContent className="space-y-6">
                    <TextArea
                        id="image-generator-prompt"
                        label="Descrivi l'immagine che vuoi creare"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Illustrazione minimalista del ciclo dell'acqua per una lezione di scienze, stile flat design'..."
                        autoFocus
                    />
                </M3DialogContent>

                <M3DialogActions className="gap-2">
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="button" onClick={handleSubmit} className="button button-filled rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">auto_awesome</span>
                        Genera Immagine
                    </button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default ImageGeneratorModal;
