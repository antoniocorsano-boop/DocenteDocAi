import React, { useState } from 'react';
import { Studente, ObservationEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea } from './ui';

interface ObservationModalProps {
    student: Studente;
    initialData?: ObservationEntry;
    onClose: () => void;
    onSave: (data: ObservationEntry) => void;
}

const ObservationModal: React.FC<ObservationModalProps> = ({ student, initialData, onClose, onSave }) => {
    const [autonomy, setAutonomy] = useState(initialData?.autonomy || 0);
    const [collaboration, setCollaboration] = useState(initialData?.collaboration || 0);
    const [responsibility, setResponsibility] = useState(initialData?.responsibility || 0);
    const [note, setNote] = useState(initialData?.note || '');

    const RatingStars = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
        <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-8 px-4">
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{label}</span>
                <span className="text-lg font-black text-primary">{value}/4</span>
            </div>
            <div className="flex justify-between gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <button key={i} type="button" onClick={() => onChange(i)} className={`flex-1 h-14 rounded-2xl flex items-center justify-center transition-all ${i <= value ? 'bg-primary text-on-primary shadow-md scale-105' : 'bg-surface border border-outline-variant text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined filled-icon text-2xl">{i <= value ? 'star' : 'star_outline'}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const handleSave = () => {
        onSave({ autonomy, collaboration, responsibility, note });
        onClose();
    };

    return (
        <M3Dialog
            title="Osservazione Formativa"
            onClose={onClose}
            maxWidth="md"
            level={1}
        >
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <div className="mb-6 px-4">
                    <h3 className="text-xl font-bold text-on-surface">{student.cognome} {student.nome}</h3>
                </div>
                <div className="space-y-6">
                    <RatingStars label="Autonomia" value={autonomy} onChange={setAutonomy} />
                    <RatingStars label="Collaborazione" value={collaboration} onChange={setCollaboration} />
                    <RatingStars label="Responsabilità" value={responsibility} onChange={setResponsibility} />
                    <TextArea label="Aneddoti / Note Osservative" value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Es. Ha dimostrato iniziativa nel lavoro di gruppo..." />
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSave} variant="filled" className="shadow-xl !px-10">Registra Nota</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ObservationModal;
