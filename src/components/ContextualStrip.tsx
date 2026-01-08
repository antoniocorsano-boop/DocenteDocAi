
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
            <div className="flex items-start gap-6 flex-grow min-w-0 py-1">
                <div className="w-6 h-6 rounded-full bg-on-tertiary-container/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined m3-body-small">auto_awesome</span>
                </div>
                <p className="strip-text">{message}</p>
            </div>

            {/* Actions Group */}
            <div className="flex items-center gap-4 pl-2 flex-shrink-0 self-center">
                <button onClick={onAction} className="strip-action-button">
                    {actionLabel}
                </button>
                <button 
                    onClick={onDismiss} 
                    className="icon-button !w-10 !h-10 !text-on-tertiary-container opacity-70 hover:opacity-100 -mr-2"
                    aria-label="Chiudi suggerimento"
                >
                    <span className="material-symbols-outlined m3-label-large">close</span>
                </button>
            </div>
        </div>
    );
};

export default ContextualStrip;


