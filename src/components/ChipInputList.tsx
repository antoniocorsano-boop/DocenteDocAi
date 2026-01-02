
import React, { useState, useRef } from 'react';

interface ChipInputListProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
    icon: string;
    label: string;
    variant?: 'class' | 'subject' | 'default'; // New prop
}

const ChipInputList: React.FC<ChipInputListProps> = ({ items, onAdd, onRemove, placeholder, icon, label, variant = 'default' }) => {
    const [newItem, setNewItem] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        if (newItem.trim()) {
            if (newItem.includes(',')) {
                const parts = newItem.split(',').map(s => s.trim()).filter(s => s);
                parts.forEach(p => onAdd(p));
            } else {
                onAdd(newItem.trim());
            }
            setNewItem('');
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
        if (e.key === 'Backspace' && !newItem && items.length > 0) {
            onRemove(items.length - 1);
        }
    };

    return (
        <div className="mb-8">
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${variant === 'class' ? 'bg-secondary-container text-secondary' : variant === 'subject' ? 'bg-tertiary-container text-tertiary' : 'bg-primary-container text-primary'}`}>
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    <div>
                        <label className="m3-label-large font-black text-on-surface uppercase tracking-widest block">
                            {label}
                        </label>
                        <span className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase tracking-tighter">
                            {items.length} {items.length === 1 ? 'elemento' : 'elementi'} salvati
                        </span>
                    </div>
                </div>
             </div>
             
             <div className="p-4 bg-surface-container-low rounded-3xl border border-outline-variant/50 shadow-inner-sm">
                <div className="m3-chip-grid mb-4">
                    {items.map((item, index) => (
                        <div key={index} className={`m3-expressive-chip variant-${variant} animate-in zoom-in-95 duration-200`}>
                            <span>{item}</span>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }} 
                                className="m3-chip-delete"
                                aria-label={`Rimuovi ${item}`}
                                tabIndex={-1}
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <p className="text-xs text-on-surface-variant italic opacity-40 py-2 px-2">Nessun elemento aggiunto...</p>
                    )}
                </div>
                
                {/* Integrated Input Area */}
                <div className="m3-new-chip-input-container group" onClick={() => inputRef.current?.focus()}>
                    <span className="material-symbols-outlined text-sm opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all">add_circle</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="m3-new-chip-input flex-1"
                        placeholder={placeholder}
                        enterKeyHint="done"
                    />
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${newItem.trim() ? 'bg-primary text-on-primary shadow-md scale-110' : 'bg-surface-container-highest text-on-surface-variant opacity-30'}`}
                        disabled={!newItem.trim()}
                    >
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <p className="text-[9px] text-on-surface-variant opacity-40 mt-3 px-2 uppercase tracking-widest font-bold">
                    Premi Invio o usa la virgola per aggiungere più elementi
                </p>
            </div>
        </div>
    );
};

export default ChipInputList;
