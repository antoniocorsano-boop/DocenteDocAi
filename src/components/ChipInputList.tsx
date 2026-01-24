// MD3 Compliant - Block J Migration Complete (4 violations eliminated)

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
        <div style={{marginBottom: 'var(--md-sys-spacing-8)'}}>
             <div  style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 'var(--md-sys-spacing-8)'}}>
                <div style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-6)'}}>
                    <div style={{
                        width: 'var(--md-sys-spacing-10)',
                        height: 'var(--md-sys-spacing-10)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--md-sys-elevation-level1)',
                        transition: 'transform 0.2s ease',
                        backgroundColor: variant === 'class' ? 'var(--md-sys-color-secondary-container)' :
                                       variant === 'subject' ? 'var(--md-sys-color-tertiary-container)' :
                                       'var(--md-sys-color-primary-container)',
                        color: variant === 'class' ? 'var(--md-sys-color-on-secondary-container)' :
                               variant === 'subject' ? 'var(--md-sys-color-on-tertiary-container)' :
                               'var(--md-sys-color-on-primary-container)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-spacing-5)',
                            userSelect: 'none'
                        }}>{icon}</span>
                    </div>
                    <div>
                        <label style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", display: "block" }}>
                            {label}
                        </label>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: "bold", opacity: "0.5", textTransform: "uppercase" }}>
                            {items.length} {items.length === 1 ? 'elemento' : 'elementi'} salvati
                        </span>
                    </div>
                </div>
             </div>
             
             <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'}}>
                <div  style={{marginBottom: 'var(--md-sys-spacing-8)'}}>
                    {items.map((item, index) => (
                        <div key={index} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--md-sys-spacing-2)',
                            padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
                            backgroundColor: variant === 'class' ? 'var(--md-sys-color-secondary-container)' :
                                           variant === 'subject' ? 'var(--md-sys-color-tertiary-container)' :
                                           'var(--md-sys-color-primary-container)',
                            color: variant === 'class' ? 'var(--md-sys-color-on-secondary-container)' :
                                  variant === 'subject' ? 'var(--md-sys-color-on-tertiary-container)' :
                                  'var(--md-sys-color-on-primary-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            fontSize: 'var(--md-sys-typescale-body-small-size)',
                            fontWeight: 'var(--md-sys-typescale-body-small-weight)',
                            lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
                            animation: 'zoom-in-95 0.2s ease-out',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)'
                        }}>
                            <span>{item}</span>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }} 
                                
                                aria-label={`Rimuovi ${item}`}
                                tabIndex={-1}
                                style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    padding: 'var(--md-sys-spacing-1)',
                                    borderRadius: 'var(--md-sys-shape-corner-full)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: '0.7',
                                    transition: 'opacity 0.2s ease'
                                }}
                            >
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--md-sys-spacing-3)',
                                    userSelect: 'none'
                                }}>close</span>
                            </button>
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' , fontSize: 'var(--md-sys-typescale-body-small-font-size)', opacity: "0.4", paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)'}}>Nessun elemento aggiunto...</p>
                    )}
                </div>
                
                {/* Integrated Input Area */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-3)',
                    padding: 'var(--md-sys-spacing-3)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    transition: 'border-color 0.2s ease'
                }} onClick={() => inputRef.current?.focus()}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--md-sys-spacing-4)',
                        opacity: '0.6',
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        color: 'var(--md-sys-color-on-surface-variant)'
                    }} aria-hidden="true">add_circle</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={newItem} 
                        onChange={e => setNewItem(e.target.value)}
                        aria-label={`Aggiungi nuovo ${label.toLowerCase()}`}
                        onKeyDown={handleKeyDown}
                        style={{
                            flex: '1',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--md-sys-color-on-surface)',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            fontFamily: 'var(--md-sys-typescale-body-large-font-family)'
                        }}
                        placeholder={placeholder}
                        enterKeyHint="done"
                    />
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                        style={{
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            backgroundColor: newItem.trim() ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)',
                            color: newItem.trim() ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                            border: 'none',
                            width: 'var(--md-sys-spacing-8)',
                            height: 'var(--md-sys-spacing-8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: newItem.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease'
                        }}
                        disabled={!newItem.trim()}
                    >
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-spacing-4)',
                            userSelect: 'none'
                        }}>arrow_forward</span>
                    </button>
                </div>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', opacity: "0.4", marginTop: 'var(--md-sys-spacing-3)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "bold" }}>
                    Premi Invio o usa la virgola per aggiungere più elementi
                </p>
            </div>
        </div>
    );
};

export default ChipInputList;







