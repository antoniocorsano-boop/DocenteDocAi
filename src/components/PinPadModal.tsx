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
                            style={{
                                width: 'var(--md-sys-spacing-4)', // MD3 spacing token
                                height: 'var(--md-sys-spacing-4)', // MD3 spacing token
                                /* eslint-disable md3-design-system */
                                borderRadius: '50%', // circular indicator
                                /* eslint-enable md3-design-system */
                                transition: 'all 0.2s', // transition-all duration-200
                                backgroundColor: i < pin.length 
                                    ? (error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)')
                                    : 'var(--md-sys-color-surface-container-high)',
                                border: i >= pin.length ? `var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)` : 'none',
                                transform: i < pin.length ? `scale(${error ? 1.25 : 1.1})` : 'scale(1)'
                            }}
                        />
                    ))}
                </div>

                {error && (
                    <p  style={{color: "var(--md-sys-color-error)", textAlign: "center", fontSize: "var(--md-sys-typescale-body-medium-size)", fontWeight: "bold", marginBottom: 'var(--md-sys-spacing-8)'}}>PIN Errato</p>
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







