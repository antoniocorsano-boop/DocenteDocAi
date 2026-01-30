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
        color: 'var(--app-color-on-surface)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        boxShadow: 'var(--app-elevation-level-2)',
        padding: 'var(--md-sys-spacing-8)',
        minHeight: 'var(--md-sys-spacing-14)',
        margin: 'var(--md-sys-spacing-8) 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(var(--app-spacing-section))',
        transition: 'opacity var(--app-motion-standard) var(--app-easing-standard), transform var(--app-motion-standard) var(--app-easing-standard)',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 'var(--md-sys-z-nav)'
    };

    return (
        <div style={stripStyle}>
            {/* Icon & Message Group */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 'var(--app-spacing-section)', flexGrow: 1, minWidth: 0 }}>
                <div
                    style={{
                        backgroundColor: 'var(--md-sys-color-tertiary-container)',
                        width: "var(--md-sys-spacing-7)",
                        height: "var(--md-sys-spacing-7)",
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
            <div style={{ display: "flex", alignItems: "center", gap: 'var(--app-spacing-container)', flexShrink: 0 }}>
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








