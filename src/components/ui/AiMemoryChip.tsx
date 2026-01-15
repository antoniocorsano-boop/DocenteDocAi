// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface AiMemoryChipProps {
    label: string;
}

const AiMemoryChip: React.FC<AiMemoryChipProps> = ({ label }) => {
    const [hovered, setHovered] = useState(false);
    const { layers } = useTheme();
    const { sys, ref, motion } = layers;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: layers.ref.spacing['4'],
                padding: `${layers.ref.spacing['2']} ${layers.ref.spacing['2']}`,
                minHeight: layers.ref.spacing['8'],
                opacity: hovered ? 1 : 0.6,
                transition: `opacity ${motion.duration.short2} ${motion.easing.standard}`,
                userSelect: 'none',
                cursor: 'help',
                backgroundColor: sys.color.tertiaryContainer,
                borderRadius: ref.shape.corner.full,
                border: `1px solid ${sys.color.tertiary}`
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
                    fontSize: ref.typography.caption.fontSize,
                    color: sys.color.tertiary,
                    fontWeight: 'bold',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
            >
                psychology
            </span>
            <span
                style={{
                    fontSize: ref.typography.caption.fontSize,
                    fontWeight: '800',
                    color: sys.color.tertiary,
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







