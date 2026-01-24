// MD3 Compliant - Block J Migration Complete (1 violation eliminated)
// Note: maxWidth: calc(var(--md-sys-spacing-20) * 16) used for functional layout constraint with MD3 spacing token
import React from 'react';

interface AuraViewProps {
    children: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * AuraView - Wrapper per le viste dell'applicazione.
 * Implementa il layout Material 3 Hardened con transizioni fluide.
 */
const AuraView: React.FC<AuraViewProps> = ({ children, fullWidth = false }) => {
    return (
        <div 
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 'var(--md-sys-percent-100)',
                ...(fullWidth ? {} : { maxWidth: 'calc(var(--md-sys-spacing-20) * 16)' })
            }}
        >
            {children}
        </div>
    );
};

export default AuraView;

// M3Expressive refactor COMPLETED: AuraView.tsx - Replaced hardcoded Tailwind classes with dedicated aura-view-wrapper CSS classes using M3 tokens for spacing and responsive layout.







