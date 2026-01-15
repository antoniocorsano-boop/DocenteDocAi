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
            <M3DialogContent style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh/30 }} style={{gap: layers.ref.spacing['6']}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], color: "layers.sys.color.error", marginBottom: layers.ref.spacing['8']}}>
                    <span style={{ color: layers.sys.color.error }}>warning</span>
                    <span style={{ fontWeight: "bold" }}>Azione Irreversibile</span>
                </div>
                <p style={{ color: layers.sys.color.onPrimary }} style={{ lineHeight: "1.625" }}>
                    Stai per cancellare <strong>TUTTI</strong> i dati locali (studenti, voti, lezioni). 
                    Questa azione è <strong style={{color: "layers.sys.color.error"}}>irreversibile</strong> se non hai un backup su Drive.
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

            <M3DialogActions style={{ backgroundColor:  layers.sys.color.surfaceContainerLowest }} style={{borderTop: "1px solid layers.sys.color.outline"}}>
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







