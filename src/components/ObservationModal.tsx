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
        <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-large)] border-[var(--md-sys-color-outline-variant)] shadow-sm" style={{ padding: "var(--md-sys-spacing-5)", border: "1px solid var(--md-sys-color-outline)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--md-sys-spacing-8)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                <span className="text-[10px] tracking-[0.3em]" style={{ color: "var(--md-sys-color-primary)", fontWeight: "900", textTransform: "uppercase" }}>{label}</span>
                <span style={{ fontSize: "1.125rem", fontWeight: "900", color: "var(--md-sys-color-primary)" }}>{value}/4</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--md-sys-spacing-8)" }}>
                {[1, 2, 3, 4].map((i) => (
                    <button key={i} type="button" onClick={() => onChange(i)} className={`flex-1 h-14 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-center transition-all ${i <= value ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level1)] scale-105' : 'bg-surface border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]-variant'}`}>
                        <span className="material-symbols-outlined filled-icon" style={{ fontSize: "1.5rem" }}>{i <= value ? 'star' : 'star_outline'}</span>
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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div style={{ marginBottom: "var(--md-sys-spacing-6)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)" }}>
                    <h3 className="text-[var(--md-sys-color-on-surface)]" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                </div>
                <div style={{ gap: "var(--md-sys-spacing-6)" }}>
                    <RatingStars label="Autonomia" value={autonomy} onChange={setAutonomy} />
                    <RatingStars label="Collaborazione" value={collaboration} onChange={setCollaboration} />
                    <RatingStars label="Responsabilità" value={responsibility} onChange={setResponsibility} />
                    <TextArea label="Aneddoti / Note Osservative" value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Es. Ha dimostrato iniziativa nel lavoro di gruppo..." />
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSave} variant="filled" className="shadow-[var(--md-sys-elevation-level3)] !px-10">Registra Nota</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ObservationModal;


