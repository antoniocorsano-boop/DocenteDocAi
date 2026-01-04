import React from 'react';

interface PinPadProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
}

const PinPad: React.FC<PinPadProps> = ({ onInput, onDelete }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];
    return (
        <div className="grid grid-cols-3 gap-6 max-w-[340px] mx-auto mt-10">
            {keys.map((key, i) => {
                if (key === '') return <div key={i}></div>;
                if (key === 'back') return (
                    <button 
                        key={i} 
                        onClick={onDelete} 
                        aria-label="Cancella"
                        className="w-20 h-20 rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-3xl font-light">backspace</span>
                    </button>
                );
                return (
                    <button 
                        key={i} 
                        onClick={() => onInput(key)} 
                        aria-label={`Cifra ${key}`}
                        className="w-20 h-20 rounded-2xl bg-surface-container text-3xl font-extrabold border-2 border-outline-variant/30 hover:border-primary hover:bg-surface hover:shadow-xl active:scale-90 transition-all"
                    >
                        {key}
                    </button>
                ); 
            })}
        </div>
    );
};

export default PinPad;
