// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useState } from 'react';
import { Button, Box, Typography  } from '@mui/material';
import { M3Dialog, TextArea } from './ui';
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
            onClose={onClose}
            maxWidth="sm"
            buttons={
                <>
                    <Button type="button" onClick={onClose} variant="text">Annulla</Button>
                    <Button type="button" onClick={handleSubmit} variant="contained">
                        <Typography component="span" sx={{ mr: 'var(--md-sys-spacing-2)' }}>auto_awesome</Typography>
                        Genera Documento
                    </Button>
                </>
            }
        >
            <Box component="form" id="doc-generator-form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }} sx={{ gap: 'var(--md-sys-spacing-6)', display: 'flex', flexDirection: 'column' }}>
                    <TextArea
                        id="doc-generator-prompt"
                        label="Descrivi il documento che vuoi creare"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        placeholder="Es. 'Scrivi una relazione dettagliata sul Rinascimento italiano, organizzata in sezioni per arte, scienza e politica.'..."
                        autoFocus
                    />
            </Box>
        </M3Dialog>
    );
};

export default DocumentGeneratorModal;

