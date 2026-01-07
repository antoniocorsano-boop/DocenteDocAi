/**
 * AddEvaluationModal
 * 
 * Material Design 3 Expressive - Migrated from dialog-container pattern
 * Migration Date: Phase 1.3 (Batch P0 Migration)
 * Z-Index: Dynamic (via M3Dialog + ModalContext)
 * 
 * Previous: dialog-backdrop + dialog-container divs
 * Current: M3Dialog wrapper with M3DialogContent, M3DialogActions
 * 
 * Status: âœ… MIGRATED & TESTED
 */

import * as React from 'react';
import { useState } from 'react';
import { Studente, Valutazione } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { M3ChoiceCard, SelectField, TextField, TextArea, M3Button, M3Dialog, M3DialogContent, M3DialogActions } from './ui';

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

    return (
        <M3Dialog
            title="Aggiungi Valutazione"
            onClose={onClose}
            maxWidth="sm"
            level={1}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <M3DialogContent className="space-y-6">
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

                    <div className="grid grid-cols-2 gap-8">
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
                        <label className="m3-label-small text-primary font-black uppercase tracking-[0.2em] px-4 mb-6 block">Tipo Prova</label>
                        <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar">
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
                </M3DialogContent>

                <M3DialogActions style={{ gap: 'var(--md-sys-spacing-6)' }}>
                    <M3Button variant="text" onClick={onClose} type="button">Annulla</M3Button>
                    <M3Button variant="filled" type="submit">Salva Valutazione</M3Button>
                </M3DialogActions>
            </form>
        </M3Dialog>
    );
};

export default AddEvaluationModal;

