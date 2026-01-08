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
                <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-primary">image</span>
                    <span>AI Image Lab</span>
                </div>
            }
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col h-full">
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface)]-variant opacity-60 px-8">
                        L'AI genererà un'immagine basata sulla tua descrizione. Sii specifico per risultati migliori.
                    </p>
                </M3DialogContent>

                <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]/30 backdrop-blur-xl border-t border-[var(--md-sys-color-outline-variant)]/10 px-12 pb-12 pt-0 gap-12">
                    <M3Button onClick={onClose} variant="text" className="font-black text-xs uppercase tracking-widest">Annulla</M3Button>
                    <M3Button 
                        onClick={handleSubmit} 
                        variant="filled" 
                        disabled={!prompt.trim()}
                        className="font-black text-xs uppercase tracking-widest shadow-[var(--md-sys-elevation-level2)]"
                    >
                        <span className="material-symbols-outlined mr-2 text-sm">auto_awesome</span>
                        Genera Immagine
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default ImageGeneratorModal;
