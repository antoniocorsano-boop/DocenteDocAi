// LEGACY - MD3 Non-compliant

import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme/theme';

interface ContextualStripProps {
    message: string;
    actionLabel: string;
    onAction: () => void;
    onDismiss: () => void;
    visible: boolean;
}

const ContextualStrip: React.FC<ContextualStripProps> = ({ message, actionLabel, onAction, onDismiss, visible }) => {
  const { layers } = useTheme();
    const [render, setRender] = useState(visible);

    useEffect(() => {
        if (visible) setRender(true);
        else setTimeout(() => setRender(false), 400); // Wait for animation (matches CSS duration)
    }, [visible]);

    if (!render) return null;

    return (
        <div className={`contextual-strip ${visible ? 'visible' : 'hidden-strip'}`}>
            {/* Icon & Message Group */}
            <div  style={{display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['6'], flexGrow: "1", minWidth: "0"}}>
                <div style={{ backgroundColor: sys.colors.on-tertiary-container/20 }} style={{ width: "1.5rem", height: "1.5rem", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                    <span >auto_awesome</span>
                </div>
                <p >{message}</p>
            </div>

            {/* Actions Group */}
            <div  style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['4'], flexShrink: "0"}}>
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







