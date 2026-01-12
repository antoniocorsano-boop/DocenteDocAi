
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
            <M3DialogContent className="py-8 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--md-sys-spacing-8)" }}>
                    <div className="text-on-primary-container shadow-[var(--md-sys-elevation-level1)]" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--md-sys-color-primary-container)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: "var(--md-sys-spacing-8)" }}>
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ marginTop: "var(--md-sys-spacing-4)" }}>Inserisci il PIN docente per uscire</p>
                </div>

                {/* PIN Display */}
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--md-sys-spacing-8)", marginBottom: "var(--md-sys-spacing-8)" }}>
                    {[0, 1, 2, 3].map((i) => (
                        <div 
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                i < pin.length 
                                    ? (error ? 'bg-error scale-125' : 'bg-primary scale-110') 
                                    : 'bg-[var(--md-sys-color-surface-container-high)]est border border-[var(--md-sys-color-outline)]'
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="animate-pulse" style={{ color: "var(--md-sys-color-error)", textAlign: "center", fontSize: "0.875rem", fontWeight: "bold", marginBottom: "var(--md-sys-spacing-8)" }}>PIN Errato</p>
                )}

                <PinPad onInput={handleInput} onDelete={handleDelete} />

                <M3Button onClick={onCancel} variant="text" className="mt-8" style={{ width: "100%" }}>
                    Annulla
                </M3Button>
            </M3DialogContent>
        </M3Dialog>
    );
};

export default PinPadModal;


