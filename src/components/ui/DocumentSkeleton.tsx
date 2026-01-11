import React from 'react';
import { useTheme } from '../../theme/theme';

interface DocumentSkeletonProps {
    lines?: number;
}

/**
 * DocumentSkeleton - Loading skeleton for document content.
 * Shows animated placeholder lines to indicate content loading.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */

const DocumentSkeleton: React.FC<DocumentSkeletonProps> = ({ 
    lines = 5
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();
    
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
        {/* Title skeleton */}
        <div style={{
            height: 'var(--md-sys-spacing-8)',
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderRadius: 'var(--md-sys-shape-corner-small)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: '70%'
        }} />
        
        {/* Content lines skeleton */}
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                style={{
                    height: 'var(--md-sys-spacing-4)',
                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    width: i === lines - 1 ? '60%' : '100%',
                    animationDelay: `${i * 0.1}s`
                }}
            />
        ))}
    </div>
    );
};

export default DocumentSkeleton;


