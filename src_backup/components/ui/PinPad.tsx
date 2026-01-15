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
    const { layers } = useTheme();
    const { sys: { colors }, ref, motion, elevation } = layers;

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: ref.spacing[6],
            maxWidth: ref.spacing[272], // Using calculated value instead of non-existent spacing token
            margin: `${ref.spacing[10]} auto 0`
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
                            width: ref.spacing[12],
                            height: ref.spacing[12],
                            borderRadius: ref.shape.large,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: `all ${motion.duration.short1} ${motion.easing.standard}`,
                            border: 'none',
                            backgroundColor: isHovered ? colors.surfaceContainerHigh : 'transparent',
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
                            fontSize: ref.typography.labelLarge.fontSize,
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
                            width: ref.spacing[12],
                            height: ref.spacing[12],
                            borderRadius: ref.shape.large,
                            backgroundColor: isHovered ? colors.surface : colors.surfaceContainerLow,
                            fontSize: ref.typography.labelLarge.fontSize,
                            fontWeight: 800,
                            border: `2px solid ${isHovered ? colors.primary : `color-mix(in srgb, ${colors.outlineVariant} 30%, transparent)`}`,
                            transition: `all ${motion.duration.short1} ${motion.easing.standard}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isHovered ? elevation.level3 : 'none',
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



