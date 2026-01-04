
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
            <M3DialogContent className="flex flex-col items-center justify-center w-full py-8 bg-surface-container-high/30 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <p className="m3-body-medium text-on-surface-variant mt-1">Inserisci il PIN docente per uscire</p>
                </div>

                {/* PIN Display */}
                <div className="flex justify-center gap-4 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                        <div 
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                i < pin.length 
                                    ? (error ? 'bg-error scale-125' : 'bg-primary scale-110') 
                                    : 'bg-surface-container-highest border border-outline'
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-error text-center text-sm font-bold mb-4 animate-pulse">PIN Errato</p>
                )}

                <PinPad onInput={handleInput} onDelete={handleDelete} />

                <M3Button onClick={onCancel} variant="text" className="w-full mt-8">
                    Annulla
                </M3Button>
            </M3DialogContent>
        </M3Dialog>
    );
};

export default PinPadModal;
