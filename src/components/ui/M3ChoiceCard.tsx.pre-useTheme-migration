// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface M3ChoiceCardProps {
    icon: string;
    label: string;
    onClick: () => void;
    selected: boolean;
}

const M3ChoiceCard: React.FC<M3ChoiceCardProps> = ({
    icon,
    label,
    onClick,
    selected
}) => {
    const [hovered, setHovered] = useState(false);
    const { layers } = useTheme();
    const { sys, ref, motion, elevation } = layers;

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: layers.ref.spacing['8'],
        borderRadius: ref.shape.corner.extraLarge,
        border: `2px solid ${selected ? sys.color.primary : hovered ? sys.color.outline : `${sys.color.outlineVariant}30`}`,
        backgroundColor: selected ? sys.color.primaryContainer : hovered ? sys.color.surfaceContainerHigh : `${sys.color.surfaceContainer}80`,
        color: selected ? sys.color.onPrimaryContainer : sys.color.onSurface,
        boxShadow: selected ? elevation.level4 : 'none',
        transform: selected ? 'scale(1.05)' : 'none',
        transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
        gap: layers.ref.spacing['4'],
        minWidth: layers.ref.spacing['16'], // Using spacing token instead of hardcoded px
        cursor: 'pointer',
        outline: 'none'
    };

    const iconContainerStyle: React.CSSProperties = {
        width: layers.ref.spacing['12'],
        height: layers.ref.spacing['12'],
        borderRadius: ref.shape.corner.medium,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
        backgroundColor: selected ? sys.color.primary : sys.color.surface,
        color: selected ? sys.color.onPrimary : sys.color.primary,
        boxShadow: selected ? elevation.level2 : 'none',
        transform: hovered && !selected ? 'scale(1.1)' : 'none'
    };

    const iconStyle: React.CSSProperties = {
        fontFamily: 'Material Symbols Outlined',
        fontSize: layers.ref.spacing['6'],
        userSelect: 'none',
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    };

    const labelStyle: React.CSSProperties = {
        fontSize: ref.typography.bodySmall.fontSize,
        fontFamily: ref.typography.bodySmall.fontFamily,
        fontWeight: '800',
        letterSpacing: '0.2em',
        textTransform: 'uppercase'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            style={buttonStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={iconContainerStyle}>
                <span style={iconStyle}>{icon}</span>
            </div>
            <span style={labelStyle}>{label}</span>
        </button>
    );
};

export default M3ChoiceCard;







