import React, { useState, useEffect } from 'react';
import { SelectField, TextArea } from './M3Components';

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
    }, [disciplines]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMateria = materia || (disciplines && disciplines.length > 0 ? disciplines[0] : '');

        if (!selectedMateria) {
            alert("Seleziona una materia.");
            return;
        }
        if (!contenuto.trim()) {
            alert("Inserisci un argomento per la lezione.");
            return;
        }
        onStart(classe, selectedMateria, contenuto.trim());
    };

    return (
        <div className="dialog-backdrop">
            <form onSubmit={handleSubmit} className="dialog-container w-full max-w-lg">
                <div className="dialog-header">
                     <div>
                        <h2 className="m3-headline-medium font-black">Lezione Rapida</h2>
                        <p className="m3-body-medium text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mt-1">Classe: {classe}</p>
                    </div>
                    <button type="button" onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-6">
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
                <div className="dialog-footer">
                    <button type="button" onClick={onClose} className="button button-text">Annulla</button>
                    <button type="submit" className="button button-filled shadow-lg">
                        <span className="material-symbols-outlined mr-2 font-black">door_open</span>
                        Avvia Aula
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImpromptuLessonModal;
