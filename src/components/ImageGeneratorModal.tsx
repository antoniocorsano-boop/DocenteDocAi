// MD3 Compliant
import React, { useState } from 'react';
import { TextArea, M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

interface ImageGeneratorModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => void;
}

const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ onClose, onGenerate }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = () => {
        if (!prompt.trim()) {
            return;
        }
        onGenerate(prompt);
    };

    return (
        <M3Dialog
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-6)' }}>
                    <span style={{ color: 'var(--md-sys-color-primary)' }}>image</span>
                    <span>AI Image Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', padding: 'var(--md-sys-spacing-4)' }}>
                    <TextArea
                        id="image-generator-prompt"
                        label="Descrizione Immagine"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Illustrazione minimalista del ciclo dell'acqua per una lezione di scienze, stile flat design'..."
                        autoFocus
                        style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}
                    />
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>
                        L'AI genererà un'immagine basata sulla tua descrizione. Sii specifico per risultati migliori.
                    </p>
                </M3DialogContent>

                <M3DialogActions style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderTop: '1px solid var(--md-sys-color-outline)',
                    paddingTop: '0'
                }}>
                    <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                    <M3Button 
                        onClick={handleSubmit} 
                        variant="filled" 
                        disabled={!prompt.trim()}
                         style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
                    >
                        <span  style={{ marginRight: "0.5rem", fontSize: "0.875rem" }}>auto_awesome</span>
                        Genera Immagine
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default ImageGeneratorModal;







