import React, { useState } from 'react';
import { Studente, ObservationEntry } from '../types';
import { TextArea } from './M3Components';

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
        <div className="p-5 bg-surface-container-low rounded-[32px] border border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{label}</span>
                <span className="text-lg font-black text-primary">{value}/4</span>
            </div>
            <div className="flex justify-between gap-2">
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
        <div className="dialog-backdrop">
            <div className="dialog-container w-full max-w-md shadow-3xl">
                <div className="dialog-header border-b border-outline-variant bg-tertiary-container text-on-tertiary-container p-6">
                    <div>
                        <h2 className="m3-headline-small font-black">Osservazione Formativa</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">{student.cognome} {student.nome}</p>
                    </div>
                    <button onClick={onClose} className="icon-button text-on-tertiary-container"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <div className="dialog-content p-8 space-y-6 overflow-y-auto bg-surface">
                    <RatingStars label="Autonomia" value={autonomy} onChange={setAutonomy} />
                    <RatingStars label="Collaborazione" value={collaboration} onChange={setCollaboration} />
                    <RatingStars label="Responsabilità" value={responsibility} onChange={setResponsibility} />
                    <TextArea label="Aneddoti / Note Osservative" value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Es. Ha dimostrato iniziativa nel lavoro di gruppo..." />
                </div>

                <div className="dialog-footer bg-surface-container-high p-6 border-t border-outline-variant">
                    <button onClick={onClose} className="button button-text font-bold">Annulla</button>
                    <button onClick={handleSave} className="button button-filled shadow-xl font-black !px-10">Registra Nota</button>
                </div>
            </div>
        </div>
    );
};

export default ObservationModal;
