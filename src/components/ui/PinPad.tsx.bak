// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface PinPadProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
}

/**
 * PinPad - Numeric keypad component for PIN entry.
 * Provides a 3x4 grid of number buttons with delete functionality.
 */

const PinPad: React.FC<PinPadProps> = ({ onInput, onDelete }) => {
    const { layers: { sys: { color }, ref: { spacing, shape, typography }, motion } } = useTheme();

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(3, var(--md-sys-grid-fr-1))`,
            gap: spacing[4],
            maxWidth: spacing[64], // Using calculated value instead of non-existent spacing token
            margin: `${spacing[4]} auto 0`
        }}>
            {keys.map((key, i) => {
                if (key === '') return <div key={i}></div>;

                const isHovered = hoveredKey === key;
                const isPressed = pressedKey === key;

                if (key === 'back') return (
                    <button
                        key={i}
                        onClick={onDelete}
                        aria-label="Cancella"
                        style={{
                            width: spacing[12],
                            height: spacing[12],
                            borderRadius: shape.corner.large,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: `all ${motion.duration.short1} ${motion.easing.standard}`,
                            border: 'none',
                            backgroundColor: isHovered ? color.surfaceContainerHigh : 'transparent',
                            cursor: 'pointer',
                            transform: isPressed ? 'scale(0.9)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        onMouseDown={() => setPressedKey(key)}
                        onMouseUp={() => setPressedKey(null)}
                    >
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: typography.labelLarge.fontSize,
                            fontWeight: 300
                        }}>backspace</span>
                    </button>
                );

                return (
                    <button
                        key={i}
                        onClick={() => onInput(key)}
                        aria-label={`Cifra ${key}`}
                        style={{
                            width: spacing[12],
                            height: spacing[12],
                            borderRadius: shape.corner.large,
                            backgroundColor: isHovered ? color.surface : color.surfaceContainerLow,
                            fontSize: typography.labelLarge.fontSize,
                            fontWeight: 800,
                            border: `var(--md-sys-border-width-thick) solid ${isHovered ? color.primary : `color-mix(in srgb, ${color.outlineVariant} var(--md-sys-percent-30), transparent)`}`,
                            transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isHovered ? 'var(--md-sys-elevation-level3)' : 'none',
                            transform: isPressed ? 'scale(0.9)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(null)}
                        onMouseDown={() => setPressedKey(key)}
                        onMouseUp={() => setPressedKey(null)}
                    >
                        {key}
                    </button>
                );
            })}
        </div>
    );
};

export default PinPad;








