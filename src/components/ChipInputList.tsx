
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
        <div className="mb-6">
             <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${variant === 'class' ? 'secondary' : variant === 'subject' ? 'tertiary' : 'surface'}-container text-${variant === 'class' ? 'secondary' : variant === 'subject' ? 'tertiary' : 'primary'}`}>
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                </div>
                <label className="text-sm font-bold text-on-surface uppercase tracking-wide">
                    {label}
                </label>
                <span className="text-xs text-on-surface-variant opacity-60 ml-auto">{items.length} elementi</span>
             </div>
             
             <div className="m3-chip-grid">
                 {items.map((item, index) => (
                    <div key={index} className={`m3-expressive-chip variant-${variant}`}>
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
                 
                 {/* Integrated Input Tile */}
                 <div className="m3-new-chip-input-container" onClick={() => inputRef.current?.focus()}>
                     <input 
                        ref={inputRef}
                        type="text" 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="m3-new-chip-input"
                        placeholder={placeholder}
                        enterKeyHint="done"
                     />
                     <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                        className={`icon-button !w-6 !h-6 ${newItem.trim() ? 'text-primary' : 'text-outline-variant'}`}
                        disabled={!newItem.trim()}
                     >
                        <span className="material-symbols-outlined text-sm">add</span>
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default ChipInputList;
