// MD3 Compliant
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
        <div style={{
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            padding: 'var(--md-sys-spacing-5)',
            border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--md-sys-spacing-8)',
                paddingLeft: 'var(--md-sys-spacing-4)',
                paddingRight: 'var(--md-sys-spacing-4)'
            }}>
                <span style={{
                    color: 'var(--md-sys-color-primary)',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                }}>{label}</span>
                <span style={{
                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                    fontWeight: '900',
                    color: 'var(--md-sys-color-primary)'
                }}>{value}/4</span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--md-sys-spacing-8)'
            }}>
                {[1, 2, 3, 4].map((i) => (
                    <button key={i} type="button" onClick={() => onChange(i)} style={{
                        flex: 1,
                        height: 'var(--md-sys-spacing-14)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                        backgroundColor: i <= value ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-low)',
                        color: i <= value ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                        border: i <= value ? 'none' : 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                        boxShadow: i <= value ? 'var(--md-sys-elevation-level1)' : 'none',
                        transform: i <= value ? 'scale(1.05)' : 'scale(1)'
                    }}>
                        <span  style={{ fontSize: "var(--md-sys-spacing-6)" }}>{i <= value ? 'star' : 'star_outline'}</span>
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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' }}>
                <div style={{
                    marginBottom: 'var(--md-sys-spacing-6)',
                    paddingLeft: 'var(--md-sys-spacing-4)',
                    paddingRight: 'var(--md-sys-spacing-4)'
                }}>
                    <h3 style={{
                        color: 'var(--md-sys-color-on-primary)',
                        fontSize: 'var(--md-sys-spacing-5)',
                        fontWeight: 'bold'
                    }}>{student.cognome} {student.nome}</h3>
                </div>
                <div style={{ gap: 'var(--md-sys-spacing-6)' }}>
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

