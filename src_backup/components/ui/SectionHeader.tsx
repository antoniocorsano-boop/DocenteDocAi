// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';
import M3Typography from './M3Typography';

/**
 * SectionHeader Component
 *
 * Displays a section header with optional icon, title, and subtitle.
 * Uses MD3 design tokens for consistent styling.
 */

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    icon
}) => {
  const { layers } = useTheme();
  const { sys, ref } = layers;

    return (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: ref.spacing[4],
            marginBottom: ref.spacing[6],
            marginTop: ref.spacing[6],
            paddingLeft: ref.spacing[4],
            paddingRight: ref.spacing[4]
        }}
    >
        {icon && (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ref.spacing[6],
                    height: ref.spacing[6],
                    borderRadius: ref.shape.corner.medium,
                    backgroundColor: sys.color.primaryContainer,
                    color: sys.color.onPrimaryContainer
                }}
            >
                <span
                    style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: ref.spacing[4]
                    }}
                >
                    {icon}
                </span>
            </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <M3Typography
                variant="label-large"
                style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5em',
                    color: `color-mix(in srgb, ${sys.color.onSurfaceVariant} 40%, transparent)`
                }}
            >
                {title}
            </M3Typography>
            {subtitle && (
                <M3Typography
                    variant="body-small"
                    style={{
                        marginTop: ref.spacing[4],
                        color: `color-mix(in srgb, ${sys.color.onSurfaceVariant} 60%, transparent)`
                    }}
                >
                    {subtitle}
                </M3Typography>
            )}
        </div>
    </div>
    );
};

export default SectionHeader;



