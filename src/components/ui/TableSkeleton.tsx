// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';
import { useTheme } from '../../theme/theme';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 3,
    columns = 3
}) => {
  const { layers: { ref: { spacing } } } = useTheme();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            {/* Table header skeleton */}
            <div style={{ display: 'flex', gap: spacing[6] }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            height: layers.ref.spacing['12'],
                            backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)',
                            borderRadius: 'var(--md-sys-shape-corner-small)',
                            animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-emphasized) infinite`,
                            flex: 1,
                            animationDelay: `${i * 0.05}s`
                        }}
                    />
                ))}
            </div>

            {/* Table rows skeleton */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', gap: spacing[6] }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            style={{
                                height: layers.ref.spacing['12'],
                                backgroundColor: 'var(--md-sys-color-surfaceContainerHigh)',
                                borderRadius: 'var(--md-sys-shape-corner-small)',
                                animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-emphasized) infinite`,
                                flex: 1,
                                animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`,
                                width: Math.random() > 0.5 ? 'var(--md-sys-percent-100)' : 'var(--md-sys-percent-80)'
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;








