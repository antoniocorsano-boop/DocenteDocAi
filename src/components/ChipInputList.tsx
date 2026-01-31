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
                <div style={{display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)'}}>
                    <div style={{
                        width: 'var(--md-sys-spacing-10)',
                        height: 'var(--md-sys-spacing-10)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--md-sys-elevation-level1)',
                        transition: 'transform var(--app-motion-quick) var(--app-easing-standard)',
                        backgroundColor: variant === 'class' ? 'var(--app-color-secondary-container)' :
                                       variant === 'subject' ? 'var(--md-sys-color-tertiary-container)' :
                                       'var(--app-color-primary-container)',
                            color: variant === 'class' ? 'var(--app-color-on-secondary-container)' :
                               variant === 'subject' ? 'var(--md-sys-color-on-tertiary-container)' :
                               'var(--app-color-on-primary-container)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-spacing-touch)',
                            userSelect: 'none'
                        }}>{icon}</span>
                    </div>
                    <div>
                        <label style={{ color: 'var(--app-color-on-primary)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", display: "block" }}>
                            {label}
                        </label>
                            <span style={{ color: 'var(--app-color-on-surface-variant)', fontWeight: "bold", opacity: "0.5", textTransform: "uppercase" }}>
                            {items.length} {items.length === 1 ? 'elemento' : 'elementi'} salvati
                        </span>
                    </div>
                </div>
             </div>
             
             <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-8)', border: 'var(--app-border-normal) solid var(--md-sys-color-outline)'}}>
                <div  style={{marginBottom: 'var(--md-sys-spacing-8)'}}>
                    {items.map((item, index) => (
                        <div key={index} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--app-spacing-component)',
                            padding: 'var(--app-spacing-component) var(--app-spacing-element)',
                            backgroundColor: variant === 'class' ? 'var(--app-color-secondary-container)' :
                                           variant === 'subject' ? 'var(--md-sys-color-tertiary-container)' :
                                           'var(--app-color-primary-container)',
                            color: variant === 'class' ? 'var(--app-color-on-secondary-container)' :
                                  variant === 'subject' ? 'var(--md-sys-color-on-tertiary-container)' :
                                  'var(--app-color-on-primary-container)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            fontSize: 'var(--md-sys-typescale-body-small-size)',
                            fontWeight: 'var(--md-sys-typescale-body-small-weight)',
                            lineHeight: 'var(--app-text-body-line-height)',
                            animation: 'zoom-in-95 var(--app-motion-quick) var(--app-easing-standard)-out',
                            cursor: 'pointer',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
                            border: 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)'
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
                                    transition: 'opacity var(--app-motion-quick) var(--app-easing-standard)'
                                }}
                            >
                                <span style={{
                                    fontFamily: 'Material Symbols Outlined',
                                    fontSize: 'var(--app-spacing-element)',
                                    userSelect: 'none'
                                }}>close</span>
                            </button>
                        </div>
                    ))}
                    
                        {items.length === 0 && (
                            <p style={{ color: 'var(--app-color-on-surface-variant)' , fontSize: 'var(--app-text-body)', opacity: "0.4", paddingTop: 'var(--app-spacing-container)', paddingBottom: 'var(--app-spacing-container)', paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)'}}>Nessun elemento aggiunto...</p>
                        )}
                </div>
                
                {/* Integrated Input Area */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-element)',
                    padding: 'var(--app-spacing-element)',
                    border: 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    transition: 'border-color var(--app-motion-quick) var(--app-easing-standard)'
                }} onClick={() => inputRef.current?.focus()}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-spacing-container)',
                        opacity: '0.6',
                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                            color: 'var(--app-color-on-surface-variant)'
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
                            color: 'var(--app-color-on-surface)',
                            fontSize: 'var(--app-text-body)',
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
                            backgroundColor: newItem.trim() ? 'var(--app-color-primary)' : 'var(--md-sys-color-surface-variant)',
                                color: newItem.trim() ? 'var(--app-color-on-primary)' : 'var(--app-color-on-surface-variant)',
                            border: 'none',
                            width: 'var(--md-sys-spacing-8)',
                            height: 'var(--md-sys-spacing-8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: newItem.trim() ? 'pointer' : 'not-allowed',
                            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)'
                        }}
                        disabled={!newItem.trim()}
                    >
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-spacing-container)',
                            userSelect: 'none'
                        }}>arrow_forward</span>
                    </button>
                </div>
                    <p style={{ color: 'var(--app-color-on-surface-variant)', opacity: "0.4", marginTop: 'var(--app-spacing-element)', paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)", fontWeight: "bold" }}>
                    Premi Invio o usa la virgola per aggiungere più elementi
                </p>
            </div>
        </div>
    );
};

export default ChipInputList;








