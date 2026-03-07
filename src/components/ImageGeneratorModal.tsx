// MD3 Compliant - Block P Migration Complete (4 violations eliminated)
// Note: Button typography and icon sizing retained with eslint-disable comments
import React, { useState } from 'react';
import { Button, Box, Typography  } from '@mui/material';
import { M3Dialog, TextArea } from './ui';

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
            buttons={
                <>
                    <Button onClick={onClose} variant="text" sx={{ fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}>Annulla</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={!prompt.trim()}
                        sx={{ fontWeight: 'var(--md-sys-typescale-weight-black)', fontSize: 'var(--md-sys-typescale-label-large-font-size)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}
                    >
                        <Typography component="span" sx={{ mr: 'var(--md-sys-spacing-2)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>auto_awesome</Typography>
                        Genera Immagine
                    </Button>
                </>
            }
        >
            <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }} sx={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)' }}>
                <Box sx={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', p: 'var(--md-sys-spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
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
                    <Typography component="p" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'var(--md-sys-typescale-weight-black)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)', opacity: 'var(--md-sys-state-opacity-secondary)' }}>
                        L'AI genererà un'immagine basata sulla tua descrizione. Sii specifico per risultati migliori.
                    </Typography>
                </Box>
            </Box>
        </M3Dialog>
    );
};

export default ImageGeneratorModal;

