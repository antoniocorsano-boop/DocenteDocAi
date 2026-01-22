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

    // MD3-compliant style for the root strip
    const stripStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--md-sys-spacing-8)',
        backgroundColor: 'var(--md-sys-color-surface-container-high)',
        color: 'var(--md-sys-color-on-surface)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        boxShadow: 'var(--md-sys-elevation-level-2)',
        padding: 'var(--md-sys-spacing-8)',
        minHeight: '3.5rem',
        margin: 'var(--md-sys-spacing-8) 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(1rem)',
        transition: 'opacity 0.4s, transform 0.4s',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 1000
    };

    return (
        <div style={stripStyle}>
            {/* Icon & Message Group */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 'var(--md-sys-spacing-6)', flexGrow: 1, minWidth: 0 }}>
                <div
                    style={{
                        backgroundColor: 'var(--md-sys-color-tertiary-container)',
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                    }}
                >
                    <span>auto_awesome</span>
                </div>
                <p>{message}</p>
            </div>

            {/* Actions Group */}
            <div style={{ display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)', flexShrink: 0 }}>
                <button onClick={onAction}>
                    {actionLabel}
                </button>
                <button
                    onClick={onDismiss}
                    style={{ opacity: 0.7 }}
                    aria-label="Chiudi suggerimento"
                >
                    <span>close</span>
                </button>
            </div>
        </div>
    );
};

export default ContextualStrip;







