
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
            <M3DialogContent className="space-y-6 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div className="flex items-center gap-6 text-error mb-8">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                    <span className="font-bold">Azione Irreversibile</span>
                </div>
                <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] leading-relaxed">
                    Stai per cancellare <strong>TUTTI</strong> i dati locali (studenti, voti, lezioni). 
                    Questa azione è <strong className="text-error">irreversibile</strong> se non hai un backup su Drive.
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

            <M3DialogActions className="bg-[var(--md-sys-color-surface-container-low)]est border-t border-[var(--md-sys-color-outline-variant)]/30">
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button 
                    onClick={onConfirm} 
                    disabled={!isValid}
                    variant="filled"
                    className="!bg-error !text-on-error"
                >
                    Reset Totale
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default ResetConfirmModal;


