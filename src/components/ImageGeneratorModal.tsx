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
                <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-primary)" }}>image</span>
                    <span>AI Image Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <M3DialogContent className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl p-12 space-y-12">
                    <TextArea
                        id="image-generator-prompt"
                        label="Descrizione Immagine"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Illustrazione minimalista del ciclo dell'acqua per una lezione di scienze, stile flat design'..."
                        autoFocus
                        className="bg-[var(--md-sys-color-surface-container-high)]/50"
                    />
                    <p className="text-[10px] text-[var(--md-sys-color-on-surface)]-variant px-8" style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", opacity: "0.6" }}>
                        L'AI genererà un'immagine basata sulla tua descrizione. Sii specifico per risultati migliori.
                    </p>
                </M3DialogContent>

                <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border-[var(--md-sys-color-outline-variant)]/10 px-12 pb-12 gap-12" style={{ borderTop: "1px solid var(--md-sys-color-outline)", paddingTop: "0" }}>
                    <M3Button onClick={onClose} variant="text" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Annulla</M3Button>
                    <M3Button 
                        onClick={handleSubmit} 
                        variant="filled" 
                        disabled={!prompt.trim()}
                        className="shadow-[var(--md-sys-elevation-level2)]" style={{ fontWeight: "900", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}
                    >
                        <span className="material-symbols-outlined" style={{ marginRight: "0.5rem", fontSize: "0.875rem" }}>auto_awesome</span>
                        Genera Immagine
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default ImageGeneratorModal;


