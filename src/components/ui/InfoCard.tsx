import React from 'react';
import { useTheme } from '../../theme/theme';
import M3Card from './M3Card';
import M3Typography from './M3Typography';

interface InfoCardProps {
    title?: string;
    description?: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface' | 'elevated' | 'tonal';
    action?: React.ReactNode;
    onClose?: () => void;
    children?: React.ReactNode;
    onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    icon,
    variant = 'surface',
    action,
    onClose,
    children,
    onClick
}) => {
    const { spacing, colors } = useTheme();

    // Map variants to M3Card variants
    const getCardVariant = () => {
        switch (variant) {
            case 'elevated':
                return 'elevated';
            case 'surface':
                return 'elevated';
            default:
                return 'filled';
        }
    };

    return (
        <M3Card
            variant={getCardVariant()}
            padding="large"
            onClick={onClick}
            style={{
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing['4']
            }}>
                {/* Header with icon and close button */}
                {(icon || onClose) && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    }}>
                        {icon && (
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: colors.surfaceContainerHigh,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span
                                    style={{
  fontFamily: 'Material Symbols Outlined'
}}
                                    style={{
                                        fontSize: '24px',
                                        color: colors.onSurfaceVariant
                                    }}
                                >
                                    {icon}
                                </span>
                            </div>
                        )}
                        {onClose && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: colors.onSurfaceVariant
                                }}
                                aria-label="Chiudi"
                            >
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing['3']
                }}>
                    {title && (
                        <M3Typography variant="headline-small">
                            {title}
                        </M3Typography>
                    )}
                    {description && (
                        <M3Typography variant="body-large">
                            {description}
                        </M3Typography>
                    )}
                    {children}
                </div>

                {/* Action */}
                {action && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: spacing['4']
                    }}>
                        {action}
                    </div>
                )}
            </div>
        </M3Card>
    );
};

export default InfoCard;


