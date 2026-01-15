// LEGACY - MD3 Non-compliant
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
  const { layers } = useTheme();

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
                gap: layers.ref.spacing['4']
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
                                width: layers.comp.infoCard.iconContainerSize,
                                height: layers.comp.infoCard.iconContainerSize,
                                borderRadius: layers.ref.shape.large,
                                backgroundColor: layers.sys.color.surfaceContainerHigh,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span
                                    style={{
                                        fontFamily: 'Material Symbols Outlined',
                                        fontSize: layers.comp.infoCard.iconSize,
                                        color: layers.sys.color.onSurfaceVariant
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
                                    width: layers.comp.infoCard.buttonSize,
                                    height: layers.comp.infoCard.buttonSize,
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: layers.sys.color.onSurfaceVariant
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
                    gap: layers.ref.spacing['3']
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
                        marginTop: layers.ref.spacing['4']
                    }}>
                        {action}
                    </div>
                )}
            </div>
        </M3Card>
    );
};

export default InfoCard;







