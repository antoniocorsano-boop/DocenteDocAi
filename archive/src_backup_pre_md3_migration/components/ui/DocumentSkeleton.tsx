// LEGACY - MD3 Non-compliant
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
    const { layers } = useTheme();
    const { sys, ref } = layers;

    return (
    <div style={{display: 'flex', flexDirection: 'column', gap: ref.spacing[3]}}>
        {/* Title skeleton */}
        <div style={{
            height: ref.spacing[8],
            backgroundColor: sys.color.surfaceContainerHigh,
            borderRadius: ref.shape.corner.small,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: '70%'
        }} />

        {/* Content lines skeleton */}
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                style={{
                    height: ref.spacing[4],
                    backgroundColor: sys.color.surfaceContainerHigh,
                    borderRadius: ref.shape.corner.full,
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



