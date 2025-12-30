import * as React from 'react';
import { useState, useRef } from 'react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Studente, Valutazione } from '../types';
import { RATING_OPTIONS, EVALUATION_TYPES } from '../constants';
import { M3ChoiceCard, SelectField, TextField, TextArea, M3Button } from './M3Components';

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
        <div
            className="dialog-backdrop animate-fade-in"
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(0,0,0,0.32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={e => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <form
                ref={containerRef as unknown as React.RefObject<HTMLFormElement>}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-eval-title"
                tabIndex={-1}
                onSubmit={handleSubmit}
                className="dialog-container animate-scale-in"
                    style={{
                        maxWidth: '95vw',
                        width: '100%',
                        maxHeight: '95vh',
                        margin: '0 auto',
                        padding: '0',
                        overflowY: 'auto',
                        borderRadius: '16px',
                        boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                        background: 'var(--sys-surface)',
                    }}
                onClick={e => e.stopPropagation()}
            >
                <div className="dialog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 id="add-eval-title" className="m3-headline-medium font-black">Aggiungi Valutazione</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Chiudi"
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            color: 'var(--sys-primary)',
                            cursor: 'pointer',
                        }}
                    >
                        ×
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
                    <M3Button variant="text" onClick={onClose} type="button">Annulla</M3Button>
                    <M3Button variant="filled" type="submit">Salva Valutazione</M3Button>
                </div>
            </form>
        </div>
    );
};

export default AddEvaluationModal;
