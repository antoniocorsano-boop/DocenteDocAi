// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useState, useEffect } from 'react';
import { Button, Box  } from '@mui/material';
import { M3Dialog, 
    SelectField, 
    TextArea,
    SectionHeader
} from './ui';

interface ImpromptuLessonModalProps {
    classe: string;
    disciplines: string[];
    onClose: () => void;
    onStart: (classe: string, materia: string, contenuto: string) => void;
}

const ImpromptuLessonModal: React.FC<ImpromptuLessonModalProps> = ({ classe, disciplines, onClose, onStart }) => {
  const [materia, setMateria] = useState<string>('');
    const [contenuto, setContenuto] = useState<string>('');

    useEffect(() => {
        if (disciplines && disciplines.length > 0 && !materia) {
            setMateria(disciplines[0]);
        }
    }, [disciplines, materia]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMateria = materia || (disciplines && disciplines.length > 0 ? disciplines[0] : '');

        if (!selectedMateria) {
            return;
        }
        if (!contenuto.trim()) {
            return;
        }
        onStart(classe, selectedMateria, contenuto.trim());
    };

    return (
        <M3Dialog
            title="Lezione Rapida"
            onClose={onClose}
            maxWidth="md"
            buttons={
                <>
                    <Button type="button" onClick={onClose} variant="text">
                        Annulla
                    </Button>
                    <Button
                        type="submit"
                        form="impromptu-form"
                        variant="contained"
                        disabled={!materia || !contenuto.trim()}>
                        Avvia Lezione
                    </Button>
                </>
            }
        >
            <Box id="impromptu-form" component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: 'var(--md-sys-percent-100)', backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 30%, transparent)', padding: 'var(--md-sys-spacing-6)', gap: 'var(--md-sys-spacing-6)' }}>
                <SectionHeader
                    title="Avvio Sessione"
                    subtitle={`Classe ${classe} • Configura i dettagli della lezione`}
                    variant="small"
                />

                <Box sx={{ mt: 'var(--md-sys-spacing-4)' }}>
                    <SelectField
                        label="Materia"
                        value={materia}
                        onChange={e => setMateria(e.target.value)}
                        required
                    >
                        <option value="" disabled>Seleziona materia...</option>
                        {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                    </SelectField>

                    <TextArea
                        label="Argomento della lezione"
                        value={contenuto}
                        onChange={e => setContenuto(e.target.value)}
                        rows={4}
                        placeholder="Es. 'Esercitazione su equazioni di secondo grado'..."
                        required
                        autoFocus
                    />
                </Box>
            </Box>
        </M3Dialog>
    );
};

export default ImpromptuLessonModal;

