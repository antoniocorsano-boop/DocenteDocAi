// LEGACY - MD3 Non-compliant

import React, { useState, useRef } from 'react';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
        <div style={{marginBottom: layers.ref.spacing['8']}}>
             <div  style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: layers.ref.spacing['8']}}>
                <div style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6']}}>
                    <div className={`w-10 h-10 rounded-[var(--md-sys-shape-corner-large)] flex items-center justify-center shadow-[var(--md-sys-elevation-level1)] transition-transform hover:scale-110 ${variant === 'class' ? 'bg-secondary-container text-secondary' : variant === 'subject' ? 'bg-tertiary-container text-tertiary' : 'bg-primary-container text-primary'}`}>
                        <span  style={{ fontSize: "1.25rem" }}>{icon}</span>
                    </div>
                    <div>
                        <label style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", display: "block" }}>
                            {label}
                        </label>
                        <span style={{ color: sys.colors.[10px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{ fontWeight: "bold", opacity: "0.5", textTransform: "uppercase" }}>
                            {items.length} {items.length === 1 ? 'elemento' : 'elementi'} salvati
                        </span>
                    </div>
                </div>
             </div>
             
             <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline"}}>
                <div  style={{marginBottom: layers.ref.spacing['8']}}>
                    {items.map((item, index) => (
                        <div key={index} className={`m3-expressive-chip variant-${variant} animate-in zoom-in-95 duration-200`}>
                            <span>{item}</span>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }} 
                                
                                aria-label={`Rimuovi ${item}`}
                                tabIndex={-1}
                            >
                                <span >close</span>
                            </button>
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{fontSize: "0.75rem", opacity: "0.4", paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>Nessun elemento aggiunto...</p>
                    )}
                </div>
                
                {/* Integrated Input Area */}
                <div  onClick={() => inputRef.current?.focus()}>
                    <span  style={{ fontSize: "0.875rem", opacity: "0.4", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" }} aria-hidden="true">add_circle</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        aria-label={`Aggiungi nuovo ${label.toLowerCase()}`}
                        onKeyDown={handleKeyDown}
                         style={{ flex: "1" }}
                        placeholder={placeholder}
                        enterKeyHint="done"
                    />
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${newItem.trim() ? 'bg-primary text-on-primary shadow-[var(--md-sys-elevation-level1)] scale-110' : 'bg-[var(--md-sys-color-surface-container-high)]est text-[var(--md-sys-color-on-surface)]-variant opacity-30'}`}
                        disabled={!newItem.trim()}
                    >
                        <span  style={{ fontSize: "0.875rem" }}>arrow_forward</span>
                    </button>
                </div>
                <p style={{ color: sys.colors.[9px], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{opacity: "0.4", marginTop: layers.ref.spacing['3'], paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "bold"}}>
                    Premi Invio o usa la virgola per aggiungere più elementi
                </p>
            </div>
        </div>
    );
};

export default ChipInputList;



