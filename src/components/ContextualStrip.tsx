
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
            <div className="py-1" style={{ display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-6)", flexGrow: "1", minWidth: "0" }}>
                <div className="bg-on-tertiary-container/20 mt-0.5" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                    <span className="material-symbols-outlined m3-body-small">auto_awesome</span>
                </div>
                <p className="strip-text">{message}</p>
            </div>

            {/* Actions Group */}
            <div className="pl-2 self-center" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)", flexShrink: "0" }}>
                <button onClick={onAction} className="strip-action-button">
                    {actionLabel}
                </button>
                <button 
                    onClick={onDismiss} 
                    className="icon-button !w-10 !h-10 !text-on-tertiary-container hover:opacity-100 -mr-2" style={{ opacity: "0.7" }}
                    aria-label="Chiudi suggerimento"
                >
                    <span className="material-symbols-outlined m3-label-large">close</span>
                </button>
            </div>
        </div>
    );
};

export default ContextualStrip;


