// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useState, useEffect } from 'react';
import { 

    M3Dialog, 
    M3DialogContent, 
    M3DialogActions, 
    M3Button, 
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
        >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "var(--md-sys-percent-100)" }}>
                <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 , padding: 'var(--md-sys-spacing-6)', gap: 'var(--md-sys-spacing-6)'}}>
                    <SectionHeader 
                        title="Avvio Sessione"
                        subtitle={`Classe ${classe} • Configura i dettagli della lezione`}
                        variant="small"
                    />

                    <div style={{marginTop: 'var(--md-sys-spacing-4)'}}>
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
                    </div>
                </M3DialogContent>

                <M3DialogActions style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/80 , padding: 'var(--md-sys-spacing-6)', borderTop: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                    <M3Button type="button" onClick={onClose} variant="text">
                        Annulla
                    </M3Button>
                    <M3Button 
                        type="submit" 
                        variant="filled"
                        disabled={!materia || !contenuto.trim()}
                    >
                        <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>door_open</span>
                        Avvia Aula
                    </M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default ImpromptuLessonModal;








