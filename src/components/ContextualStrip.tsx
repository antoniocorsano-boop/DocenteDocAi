// LEGACY - MD3 Non-compliant

import React, { useEffect, useState } from 'react';
interface ContextualStripProps {
    message: string;
    actionLabel: string;
    onAction: () => void;
    onDismiss: () => void;
    visible: boolean;
}

const ContextualStrip: React.FC<ContextualStripProps> = ({ message, actionLabel, onAction, onDismiss, visible }) => {
  const [render, setRender] = useState(visible);

    useEffect(() => {
        if (visible) setRender(true);
        else setTimeout(() => setRender(false), 400); // Wait for animation (matches CSS duration)
    }, [visible]);

    if (!render) return null;

    return (
        <div className={`contextual-strip ${visible ? 'visible' : 'hidden-strip'}`}>
            {/* Icon & Message Group */}
            <div  style={{display: "flex", alignItems: "flex-start", gap: 'var(--md-sys-spacing-6)', flexGrow: "1", minWidth: "0"}}>
                <div style={{ backgroundColor: sys.colors.on-tertiary-container/20 ,  width: "1.5rem", height: "1.5rem", borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                    <span >auto_awesome</span>
                </div>
                <p >{message}</p>
            </div>

            {/* Actions Group */}
            <div  style={{display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)', flexShrink: "0"}}>
                <button onClick={onAction} >
                    {actionLabel}
                </button>
                <button 
                    onClick={onDismiss} 
                     style={{ opacity: "0.7" }}
                    aria-label="Chiudi suggerimento"
                >
                    <span >close</span>
                </button>
            </div>
        </div>
    );
};

export default ContextualStrip;







