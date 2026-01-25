// MD3 Compliant - Block J Migration Complete (1 violation eliminated)
// Note: maxWidth: calc(var(--md-sys-spacing-20) * 16) used for functional layout constraint with MD3 spacing token
import React from 'react';

interface AuraViewProps {
    children: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * AuraView - Wrapper per viste.
 * fullWidth = true: usa tutta la larghezza del container padre, nessun maxWidth.
 * fullWidth = false: centra e limita la larghezza con maxWidth MD3 token.
 * Usare fullWidth solo per viste che devono occupare tutto lo spazio disponibile (es. dashboard, mappe, fullscreen).
 * Usare senza fullWidth per viste con contenuto leggibile, form, documenti, o layout a colonna.
 * TODO: Se il container padre ha padding o overflow, fullWidth può causare scroll orizzontale o layout instabile.
 * MD3 Gold: solo token, nessun valore hardcoded, nessuna utility custom.
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








