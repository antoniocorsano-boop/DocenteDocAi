import * as React from 'react';
import { useState, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Studente, Valutazione } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { M3ChoiceCard, SelectField, TextField, TextArea } from './M3Components';

interface AddEvaluationModalProps {
    students: Studente[];
    discipline: string[];
    onClose: () => void;
    onSave: (evaluation: Omit<Valutazione, 'id'>) => void;
}

const getTestTypeIcon = (tipo: string) => {
    switch (tipo) {
        case 'Scritto': return 'edit_note';
        case 'Orale': return 'record_voice_over';
        case 'Pratico': return 'build';
        case 'Test': return 'quiz';
        case 'Verifica': return 'assignment_late';
        default: return 'assignment';
    }
};

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({
    students,
    discipline,
    onClose,
    onSave
}: AddEvaluationModalProps) => {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedMateria, setSelectedMateria] = useState<string>(discipline[0] || '');
    const [tipo, setTipo] = useState<Valutazione['tipo']>('Orale');
    const [voto, setVoto] = useState<string>('');
    const [argomento, setArgomento] = useState<string>('');
    const [note, setNote] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedMateria || !voto) {
            alert("Compila tutti i campi obbligatori (Studente, Materia, Voto).");
            return;
        }
        onSave({
            studenteId: selectedStudentId,
            materia: selectedMateria,
            data: new Date().toISOString(),
            tipo,
            voto,
            argomento,
            note,
        });
        onClose();
    };

    // Accessibility & UX
    const overlayRef = useRef<HTMLDivElement>(null);
    // useModalAccessibility expects containerRef as RefObject<HTMLDivElement>
    const containerRef = useRef<HTMLDivElement>(null);
    useModalAccessibility({
        isOpen: true,
        onClose,
        overlayRef,
        containerRef,
        onOverlayClick: onClose
    });

    return (
        <div className="dialog-backdrop animate-fade-in" ref={overlayRef}>
            <form
                ref={containerRef as unknown as React.RefObject<HTMLFormElement>}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                onSubmit={handleSubmit}
                className="dialog-container w-full max-w-lg sm:max-w-full md:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-2 md:p-6 animate-scale-in"
            >
                <div className="dialog-header">
                    <h2 className="m3-headline-medium font-black">Aggiungi Valutazione</h2>
                    <button type="button" onClick={onClose} className="icon-button rounded-lg hover:shadow-md transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="dialog-content space-y-6">
                    <SelectField
                        id="eval-student-select"
                        label="Studente"
                        value={selectedStudentId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStudentId(e.target.value)}
                        required
                    >
                        <option value="">Seleziona studente...</option>
                        {students.map((s: Studente) => <option key={s.id} value={s.id}>{s.cognome} {s.nome}</option>)}
                    </SelectField>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            id="eval-materia-select"
                            label="Materia"
                            value={selectedMateria}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMateria(e.target.value)}
                            required
                        >
                            <option value="">Seleziona...</option>
                            {discipline.map((d: string) => <option key={d} value={d}>{d}</option>)}
                        </SelectField>
                        <SelectField
                            id="eval-voto-select"
                            label="Voto / Giudizio"
                            value={voto}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVoto(e.target.value)}
                            required
                        >
                            <option value="">Seleziona...</option>
                            {RATING_OPTIONS.map((o: string) => <option key={o} value={o}>{o}</option>)}
                        </SelectField>
                    </div>

                    <div>
                        <label className="text-[11px] text-primary font-black uppercase tracking-[0.2em] px-2 mb-3 block">Tipo Prova</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {EVALUATION_TYPES.map(t => (
                                <M3ChoiceCard
                                    key={t}
                                    icon={getTestTypeIcon(t)}
                                    label={t}
                                    onClick={() => setTipo(t)}
                                    selected={tipo === t}
                                />
                            ))}
                        </div>
                    </div>

                    <TextField
                        id="eval-argomento-input"
                        label="Argomento"
                        value={argomento}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArgomento(e.target.value)}
                        placeholder="Es. 'Il Barocco in Italia'"
                    />

                    <TextArea
                        id="eval-note-textarea"
                        label="Note Aggiuntive"
                        value={note}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                        rows={2}
                    />
                </div>
                <div className="dialog-footer">
                    <button type="button" onClick={onClose} className="button button-text rounded-lg hover:shadow-md transition-all">Annulla</button>
                    <button type="submit" className="button button-filled rounded-lg hover:shadow-md transition-all">Salva Valutazione</button>
                </div>
            </form>
        </div>
    );
};

export default AddEvaluationModal;
