
import React, { useState } from 'react';

interface ResetConfirmModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText === 'CANCELLA';

    return (
        <div className="dialog-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
            <div className="dialog-container max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="dialog-header !pb-0">
                    <h3 className="m3-headline-small text-error flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        Attenzione
                    </h3>
                </div>
                <div className="dialog-content space-y-4 pt-4">
                    <p className="m3-body-medium">
                        Stai per cancellare <strong>TUTTI</strong> i dati locali (studenti, voti, lezioni). 
                        Questa azione è <strong>irreversibile</strong> se non hai un backup su Drive.
                    </p>
                    <div>
                        <label className="form-label text-xs">Digita "CANCELLA" per confermare</label>
                        <input 
                            type="text" 
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            className="form-input w-full border-error focus:border-error focus:ring-1 focus:ring-error"
                            placeholder="CANCELLA"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="dialog-footer">
                    <button onClick={onClose} className="button button-text">Annulla</button>
                    <button 
                        onClick={onConfirm} 
                        disabled={!isValid}
                        className="button button-filled bg-error text-on-error disabled:opacity-50"
                    >
                        Reset Totale
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetConfirmModal;
