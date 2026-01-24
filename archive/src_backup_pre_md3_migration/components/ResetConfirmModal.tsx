// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField } from './ui';
import { useTheme } from '../theme/theme';

interface ResetConfirmModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onClose, onConfirm }) => {
  const { layers } = useTheme();
    const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText === 'CANCELLA';

    return (
        <M3Dialog
            title="Attenzione"
            onClose={onClose}
            maxWidth="sm"
            level={3}
        >
            <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/30 }} style={{gap: layers.ref.spacing['6']}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], color: "layers.sys.colors.error", marginBottom: layers.ref.spacing['8']}}>
                    <span style={{ color: sys.colors.3xl }}>warning</span>
                    <span style={{ fontWeight: "bold" }}>Azione Irreversibile</span>
                </div>
                <p style={{ color: sys.colors.[var(--md-sys-typescale-body-large)] }} style={{ lineHeight: "1.625" }}>
                    Stai per cancellare <strong>TUTTI</strong> i dati locali (studenti, voti, lezioni). 
                    Questa azione è <strong style={{color: "layers.sys.colors.error"}}>irreversibile</strong> se non hai un backup su Drive.
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

            <M3DialogActions style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)]est }} style={{borderTop: "1px solid layers.sys.colors.outline"}}>
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



