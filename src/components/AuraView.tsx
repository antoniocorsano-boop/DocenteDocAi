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
        <div className={`aura-view-wrapper mx-auto w-full ${fullWidth ? '' : 'max-w-7xl md:px-6'}`}>
            {children}
        </div>
    );
};

export default AuraView;
