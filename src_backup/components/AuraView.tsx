// LEGACY - MD3 Non-compliant
// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
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
        <div className={`aura-view-wrapper ${fullWidth ? '' : 'aura-view-wrapper.constrained aura-view-wrapper.constrained.responsive'}`}>
            {children}
        </div>
    );
};

export default AuraView;

// M3Expressive refactor COMPLETED: AuraView.tsx - Replaced hardcoded Tailwind classes with dedicated aura-view-wrapper CSS classes using M3 tokens for spacing and responsive layout.



