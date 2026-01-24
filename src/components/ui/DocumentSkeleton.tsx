// MD3 Compliant - Updated for layered theme access
import React from 'react';
import { useTheme } from '../../theme/theme';

interface DocumentSkeletonProps {
    lines?: number;
}

/**
 * DocumentSkeleton - Loading skeleton for document content.
 * Shows animated placeholder lines to indicate content loading.
 */

const DocumentSkeleton: React.FC<DocumentSkeletonProps> = ({
    lines = 5
}) => {
    const { layers: { sys: { color }, ref: { spacing, shape } } } = useTheme();

    return (
    <div style={{display: 'flex', flexDirection: 'column', gap: spacing[4]}}>
        {/* Title skeleton */}
        <div style={{
            height: spacing[4],
            backgroundColor: color.surfaceContainerHigh,
            borderRadius: shape.corner.small,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: 'var(--md-sys-percent-70)'
        }} />

        {/* Content lines skeleton */}
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                style={{
                    height: spacing[8],
                    backgroundColor: color.surfaceContainerHigh,
                    borderRadius: shape.corner.full,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    width: i === lines - 1 ? 'var(--md-sys-percent-60)' : 'var(--md-sys-percent-100)',
                    animationDelay: `${i * 0.1}s`
                }}
            />
        ))}
    </div>
    );
};

export default DocumentSkeleton;







