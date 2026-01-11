import React from 'react';
import { useTheme } from '../../theme/theme';

interface AiMemoryChipProps {
    label: string;
}

const AiMemoryChip: React.FC<AiMemoryChipProps> = ({ label }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-2)',
                padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                minHeight: 'var(--md-sys-spacing-8)',
                opacity: 0.6,
                transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                cursor: 'help',
                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: '1px solid var(--md-sys-color-tertiary)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
            }}
            title="Contesto utilizzato dall'AI"
            role="note"
            aria-label={`Contesto AI: ${label}`}
        >
            <span
                // eslint-disable-next-line design-system/no-classname
                style={{
  fontFamily: 'Material Symbols Outlined'
}}
                style={{
                    fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                    color: 'var(--md-sys-color-tertiary)',
                    fontWeight: 'bold',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
            >
                psychology
            </span>
            <span
                style={{
                    fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                    fontWeight: '800',
                    color: 'var(--md-sys-color-tertiary)',
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


