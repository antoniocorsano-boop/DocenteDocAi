// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';
import { useTheme } from '../../theme/theme';

interface AiThinkingGemProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    inline?: boolean;
}

const AiThinkingGem: React.FC<AiThinkingGemProps> = ({ size = 'medium', text, inline = false }) => {
    const { layers } = useTheme();
    const {
        sys: { color: { primary, primaryContainer } },
        ref: { spacing, typescale: { labelLarge } }
    } = layers;

    const sizeMap = {
        small: { width: 32, height: 32, icon: 16 },
        medium: { width: 56, height: 56, icon: 28 },
        large: { width: 90, height: 90, icon: 44 }
    };

    const dim = sizeMap[size];

    return (
        <div
            style={{display: 'flex',
                flexDirection: inline ? 'row' : 'column',
                gap: spacing['8'],
                alignItems: 'center',
                justifyContent: 'center'}}
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
                    style={{position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: primaryContainer,
                        transform: 'scale(1.2)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        opacity: 0.4}}
                />

                {/* Rotating Thinking Ring */}
                <div
                    style={{position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: `conic-gradient(from 0deg, transparent 0%, ${primary} 50%, #6750A4 100%)`, // Using tertiary color value
                        maskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        WebkitMaskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        animation: 'spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'}}
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
                        style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: dim.icon,
                            color: primary,
                            fontWeight: 300}}
                    >
                        diamond
                    </span>
                </div>
            </div>
            {text && (
                <p
                    style={{fontFamily: labelLarge.fontFamily,
                        fontSize: labelLarge.fontSize,
                        fontWeight: labelLarge.fontWeight,
                        lineHeight: labelLarge.lineHeight,
                        color: primary,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        margin: 0}}
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



