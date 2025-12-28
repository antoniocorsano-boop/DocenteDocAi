import React, { useState } from 'react';
import { TextArea } from './M3Components';

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
        <div className="dialog-backdrop">
            <div
                className="dialog-container w-full max-w-lg"
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
                    <h2 className="m3-headline-medium">Genera Immagine</h2>
                    <button type="button" onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-6">
                    <TextArea
                        id="image-generator-prompt" // FIX: Add ID
                        label="Descrivi l'immagine che vuoi creare"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Illustrazione minimalista del ciclo dell'acqua per una lezione di scienze, stile flat design'..."
                        autoFocus
                    />
                </div>
                <div className="dialog-footer">
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="button" onClick={handleSubmit} className="button button-filled rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined mr-2">auto_awesome</span>
                        Genera Immagine
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorModal;
