import React from 'react';
import { useTheme } from '../../theme/theme';

interface AiThinkingGemProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    inline?: boolean;
}

const AiThinkingGem: React.FC<AiThinkingGemProps> = ({ size = 'medium', text, inline = false }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();

    const sizeMap = {
        small: { width: 32, height: 32, icon: 16 },
        medium: { width: 56, height: 56, icon: 28 },
        large: { width: 90, height: 90, icon: 44 }
    };

    const dim = sizeMap[size];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: inline ? 'row' : 'column',
                gap: 'var(--md-sys-spacing-8)',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: dim.width,
                    height: dim.height
                }}
            >
                {/* Aura Ring */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: 'var(--md-sys-color-primary-container)',
                        transform: 'scale(1.2)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        opacity: 0.4
                    }}
                />

                {/* Rotating Thinking Ring */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, transparent 0%, var(--md-sys-color-primary) 50%, var(--sys-tertiary) 100%)',
                        maskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        WebkitMaskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        animation: 'spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                    }}
                />

                {/* The Core Gem */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span
                        // eslint-disable-next-line design-system/no-classname
                        style={{
  fontFamily: 'Material Symbols Outlined'
}}
                        style={{
                            fontSize: dim.icon,
                            color: 'var(--md-sys-color-primary)',
                            fontWeight: 300
                        }}
                    >
                        diamond
                    </span>
                </div>
            </div>
            {text && (
                <p
                    style={{
                        fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                        fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                        fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
                        color: 'var(--md-sys-color-primary)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        margin: 0
                    }}
                >
                    {text}
                </p>
            )}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AiThinkingGem;


