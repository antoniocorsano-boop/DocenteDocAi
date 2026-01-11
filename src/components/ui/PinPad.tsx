import React from 'react';
import { useTheme } from '../../theme/theme';

interface PinPadProps {
    onInput: (digit: string) => void;
    onDelete: () => void;
}

/**
 * PinPad - Numeric keypad component for PIN entry.
 * Provides a 3x4 grid of number buttons with delete functionality.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and MD3 tokens
 */

const PinPad: React.FC<PinPadProps> = ({ onInput, onDelete }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();
    
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--md-sys-spacing-6)',
            maxWidth: '340px',
            margin: 'var(--md-sys-spacing-10) auto 0'
        }}>
            {keys.map((key, i) => {
                if (key === '') return <div key={i}></div>;
                if (key === 'back') return (
                    <button 
                        key={i} 
                        onClick={onDelete} 
                        aria-label="Cancella"
                        style={{
                            width: 'var(--md-sys-spacing-20)',
                            height: 'var(--md-sys-spacing-20)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-short)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'scale(0.9)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-display-small-size)',
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
                            width: 'var(--md-sys-spacing-20)',
                            height: 'var(--md-sys-spacing-20)',
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            fontSize: 'var(--md-sys-typescale-display-small-size)',
                            fontWeight: 800,
                            border: '2px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)',
                            transition: 'all var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-short)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface)';
                            e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)';
                            e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'scale(0.9)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {key}
                    </button>
                ); 
            })}
        </div>
    );
};

export default PinPad;


