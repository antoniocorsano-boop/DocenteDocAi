// MD3 Compliant - InfoCard component with layered theme destructuring
import React from 'react';
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
            onClick={onClick}
            style={{
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default',
                padding: 'var(--app-spacing-section)' // large padding
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-container)'
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
                                width: 'var(--md-sys-spacing-12)', // infoCard.iconContainerSize
                                height: 'var(--md-sys-spacing-12)', // infoCard.iconContainerSize
                                borderRadius: 'var(--md-sys-shape-corner-large)',
                                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span
                                    style={{
                                        fontFamily: 'Material Symbols Outlined',
                                        fontSize: 'var(--app-spacing-section)', // infoCard.iconSize
                                        color: 'var(--md-sys-color-on-surface-variant)'
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
                                    width: 'var(--md-sys-spacing-10)', // infoCard.buttonSize
                                    height: 'var(--md-sys-spacing-10)', // infoCard.buttonSize
                                    borderRadius: 'var(--app-layout-half)',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--md-sys-color-on-surface-variant)'
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
                    gap: 'var(--app-spacing-element)'
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
                        marginTop: 'var(--app-spacing-container)'
                    }}>
                        {action}
                    </div>
                )}
            </div>
        </M3Card>
    );
};

export default InfoCard;








