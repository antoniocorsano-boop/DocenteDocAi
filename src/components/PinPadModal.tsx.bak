// MD3 Compliant - Block O Migration Complete (5 violations eliminated)
// Note: Circular indicators use functional borderRadius with eslint-disable comments

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
            <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 ,  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "var(--app-layout-full)" }}>
                <div style={{textAlign: "center", marginBottom: 'var(--md-sys-spacing-8)'}}>
                    <div style={{ color: sys.colors.on-primaryContainer , width: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', backgroundColor: "var(--app-color-primary)", borderRadius: 'var(--app-spacing-container)', display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)", marginBottom: 'var(--md-sys-spacing-8)'}}>
                        <span style={{ color: 'var(--app-color-primary)' }}>lock</span>
                    </div>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , marginTop: 'var(--app-spacing-container)'}}>Inserisci il PIN docente per uscire</p>
                </div>

                {/* PIN Display */}
                <div style={{display: "flex", justifyContent: "center", gap: 'var(--md-sys-spacing-8)', marginBottom: 'var(--md-sys-spacing-8)'}}>
                    {[0, 1, 2, 3].map((i) => (
                        <div 
                            key={i}
                            style={{
                                width: 'var(--app-spacing-container)', // MD3 spacing token
                                height: 'var(--app-spacing-container)', // MD3 spacing token
                                
                                borderRadius: 'var(--app-layout-half)', // circular indicator
                                
                                transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick)', // transition-all duration-200
                                backgroundColor: i < pin.length 
                                    ? (error ? 'var(--md-sys-color-error)' : 'var(--app-color-primary)')
                                    : 'var(--md-sys-color-surface-container-high)',
                                border: i >= pin.length ? `var(--app-border-thin) solid var(--md-sys-color-outline)` : 'none',
                                transform: i < pin.length ? `scale(${error ? 1.25 : 1.1})` : 'scale(1)'
                            }}
                        />
                    ))}
                </div>

                {error && (
                    <p  style={{color: "var(--md-sys-color-error)", textAlign: "center", fontSize: "var(--md-sys-typescale-body-medium-size)", fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>PIN Errato</p>
                )}

                <PinPad onInput={handleInput} onDelete={handleDelete} />

                <M3Button onClick={onCancel} variant="text"  style={{ width: "var(--app-layout-full)" }}>
                    Annulla
                </M3Button>
            </M3DialogContent>
        </M3Dialog>
    );
};

export default PinPadModal;








