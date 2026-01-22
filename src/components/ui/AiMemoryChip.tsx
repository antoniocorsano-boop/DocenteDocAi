// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface AiMemoryChipProps {
    label: string;
}

const AiMemoryChip: React.FC<AiMemoryChipProps> = ({ label }) => {
    const [hovered, setHovered] = useState(false);
    const { layers: { sys: { color }, ref: { spacing, shape, typography }, motion } } = useTheme();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[4],
                padding: `${spacing[2]} ${spacing[2]}`,
                minHeight: spacing[8],
                opacity: hovered ? 1 : 0.6,
                transition: `opacity ${motion.duration.short2} ${motion.easing.standard}`,
                userSelect: 'none',
                cursor: 'help',
                backgroundColor: color.tertiaryContainer,
                borderRadius: shape.corner.full,
                border: `1px solid ${color.tertiary}`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title="Contesto utilizzato dall'AI"
            role="note"
            aria-label={`Contesto AI: ${label}`}
        >
            <span
                style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: typography.caption.fontSize,
                    color: color.tertiary,
                    fontWeight: 'bold',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
            >
                psychology
            </span>
            <span
                style={{
                    fontSize: typography.caption.fontSize,
                    fontWeight: '800',
                    color: color.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em'
                }}
            >
                {label}
            </span>
        </div>
    );
};

export default AiMemoryChip;







