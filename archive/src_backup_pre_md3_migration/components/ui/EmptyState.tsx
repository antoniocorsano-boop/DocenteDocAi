// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
}

/**
 * EmptyState - Component for displaying empty state messages.
 * Shows an icon, title, and description when no content is available.
 */

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = 'inbox'
}) => {
    const { layers } = useTheme();
    const { sys, ref, elevation } = layers;

    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: ref.spacing[16],
        textAlign: 'center',
        backgroundColor: `color-mix(in srgb, ${sys.color.surfaceContainerLow} 50%, transparent)`,
        backdropFilter: 'blur(4px)',
        borderRadius: ref.shape.corner.extraLarge,
        border: `2px dashed color-mix(in srgb, ${sys.color.outlineVariant} 30%, transparent)`
    }}>
        <div style={{
            width: ref.spacing[24],
            height: ref.spacing[24],
            borderRadius: ref.shape.corner.full,
            backgroundColor: sys.color.surfaceContainerHigh,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: ref.spacing[8],
            color: `color-mix(in srgb, ${sys.color.onSurfaceVariant} 30%, transparent)`,
            boxShadow: elevation.level1
        }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: ref.typography.displayLarge.fontSize,
                fontWeight: 300
            }}>{icon}</span>
        </div>
        <h3 style={{
            fontSize: ref.typography.headlineSmall.fontSize,
            fontFamily: ref.typography.headlineSmall.fontFamily,
            color: sys.color.onSurface,
            fontWeight: 800,
            letterSpacing: '-0.025em'
        }}>{title}</h3>
        <p style={{
            fontSize: ref.typography.bodyLarge.fontSize,
            fontFamily: ref.typography.bodyLarge.fontFamily,
            color: `color-mix(in srgb, ${sys.color.onSurfaceVariant} 60%, transparent)`,
            maxWidth: ref.spacing[448],
            margin: `${ref.spacing[4]} auto 0`,
            fontWeight: 700,
            fontStyle: 'italic'
        }}>
            "{description}"
        </p>
    </div>
    );
};

export default EmptyState;



