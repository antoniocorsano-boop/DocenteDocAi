// LEGACY - MD3 Non-compliant

import React, { useState, useEffect } from 'react';
import { M3Dialog, M3DialogContent, PinPad, M3Button } from './ui';
interface PinPadModalProps {
    title: string;
    correctPin: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const PinPadModal: React.FC<PinPadModalProps> = ({ title, correctPin, onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === correctPin) {
                onSuccess();
            } else {
                setError(true);
                setTimeout(() => {
                    setPin('');
                    setError(false);
                }, 500);
            }
        }
    }, [pin, correctPin, onSuccess]);

    const handleInput = (digit: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + digit);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    return (
        <M3Dialog
            title={title}
            onClose={onCancel}
            maxWidth="sm"
            level={3}
        >
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 ,  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <div style={{textAlign: "center", marginBottom: 'var(--md-sys-spacing-8)'}}>
                    <div style={{ color: sys.colors.on-primaryContainer , width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-primary)", borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: 'var(--md-sys-spacing-8)'}}>
                        <span style={{ color: 'var(--md-sys-color-primary)' }}>lock</span>
                    </div>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , marginTop: 'var(--md-sys-spacing-4)'}}>Inserisci il PIN docente per uscire</p>
                </div>

                {/* PIN Display */}
                <div style={{display: "flex", justifyContent: "center", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                    {[0, 1, 2, 3].map((i) => (
                        <div 
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                i < pin.length 
                                    ? (error ? 'bg-error scale-125' : 'bg-primary scale-110') 
                                    : 'bg-[var(--md-sys-color-surfaceContainerHigh)]est border border-[var(--md-sys-color-outline)]'
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <p  style={{color: "var(--md-sys-color-error)", textAlign: "center", fontSize: "0.875rem", fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>PIN Errato</p>
                )}

                <PinPad onInput={handleInput} onDelete={handleDelete} />

                <M3Button onClick={onCancel} variant="text"  style={{ width: "100%" }}>
                    Annulla
                </M3Button>
            </M3DialogContent>
        </M3Dialog>
    );
};

export default PinPadModal;







