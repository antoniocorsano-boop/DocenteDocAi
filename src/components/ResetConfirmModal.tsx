// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
interface ResetConfirmModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText === 'CANCELLA';

    return (
        <M3Dialog
            title="Attenzione"
            onClose={onClose}
            maxWidth="sm"
            level={3}
        >
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 , gap: 'var(--md-sys-spacing-6)'}}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)', color: "var(--md-sys-color-error)", marginBottom: 'var(--md-sys-spacing-8)'}}>
                    <span style={{ color: 'var(--md-sys-color-error)' }}>warning</span>
                    <span style={{ fontWeight: "bold" }}>Azione Irreversibile</span>
                </div>
                <p style={{ color: 'var(--md-sys-color-on-primary)' ,  lineHeight: "1.625" }}>
                    Stai per cancellare <strong>TUTTI</strong> i dati locali (studenti, voti, lezioni). 
                    Questa azione è <strong style={{color: "var(--md-sys-color-error)"}}>irreversibile</strong> se non hai un backup su Drive.
                </p>
                
                <TextField 
                    label='Digita "CANCELLA" per confermare'
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    placeholder="CANCELLA"
                    autoFocus
                    error={confirmText.length > 0 && !isValid && confirmText.length >= 8}
                />
            </M3DialogContent>

            <M3DialogActions style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderTop: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)" }}>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button 
                    onClick={onConfirm} 
                    disabled={!isValid}
                    variant="filled"
                    
                >
                    Reset Totale
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ResetConfirmModal;







