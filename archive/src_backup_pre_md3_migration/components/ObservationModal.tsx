// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { Studente, ObservationEntry } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextArea } from './ui';
import { useTheme } from '../theme/theme';

interface ObservationModalProps {
    student: Studente;
    initialData?: ObservationEntry;
    onClose: () => void;
    onSave: (data: ObservationEntry) => void;
}

const ObservationModal: React.FC<ObservationModalProps> = ({ student, initialData, onClose, onSave }) => {
  const { layers } = useTheme();
    const [autonomy, setAutonomy] = useState(initialData?.autonomy || 0);
    const [collaboration, setCollaboration] = useState(initialData?.collaboration || 0);
    const [responsibility, setResponsibility] = useState(initialData?.responsibility || 0);
    const [note, setNote] = useState(initialData?.note || '');

    const RatingStars = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
        <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['5'], border: "1px solid layers.sys.colors.outline"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: layers.ref.spacing['8'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                <span style={{ color: sys.colors.[10px] }} style={{color: "layers.sys.colors.primary", fontWeight: "900", textTransform: "uppercase"}}>{label}</span>
                <span style={{fontSize: "1.125rem", fontWeight: "900", color: "layers.sys.colors.primary"}}>{value}/4</span>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", gap: layers.ref.spacing['8']}}>
                {[1, 2, 3, 4].map((i) => (
                    <button key={i} type="button" onClick={() => onChange(i)} className={`flex-1 h-14 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-center transition-all ${i <= value ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level1)] scale-105' : 'bg-surface border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]-variant'}`}>
                        <span  style={{ fontSize: "1.5rem" }}>{i <= value ? 'star' : 'star_outline'}</span>
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
            <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/30 }}>
                <div style={{marginBottom: layers.ref.spacing['6'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
                    <h3 style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{student.cognome} {student.nome}</h3>
                </div>
                <div style={{gap: layers.ref.spacing['6']}}>
                    <RatingStars label="Autonomia" value={autonomy} onChange={setAutonomy} />
                    <RatingStars label="Collaborazione" value={collaboration} onChange={setCollaboration} />
                    <RatingStars label="Responsabilità" value={responsibility} onChange={setResponsibility} />
                    <TextArea label="Aneddoti / Note Osservative" value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Es. Ha dimostrato iniziativa nel lavoro di gruppo..." />
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSave} variant="filled" >Registra Nota</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ObservationModal;



