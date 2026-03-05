// MD3 Expressive Transformative — Animated Icon
// Supports static display + expressive animation variants via CSS keyframes.
// All keyframes defined component-scoped (documented exception per MD3 contract §9).
import React, { CSSProperties } from 'react';

const ICON_KEYFRAMES = `
  @keyframes _m3ai-pulse {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.30); }
    60%  { transform: scale(0.90); }
    80%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  @keyframes _m3ai-bounce {
    0%   { transform: translateY(0); }
    30%  { transform: translateY(-35%); }
    50%  { transform: translateY(8%); }
    70%  { transform: translateY(-12%); }
    85%  { transform: translateY(4%); }
    100% { transform: translateY(0); }
  }
  @keyframes _m3ai-shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes _m3ai-fill-morph {
    0%   { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; transform: scale(1); }
    50%  { font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24; transform: scale(1.22); }
    100% { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3ai-animated { animation-duration: 0.01ms !important; }
  }
`;

/* eslint-disable design-system/no-hardcoded-motion-values -- 500ms/300ms are CSS var() fallback values, not standalone hardcoded durations */
const ANIMATION_MAP: Record<string, string> = {
  pulse:      `_m3ai-pulse     var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`,
  bounce:     `_m3ai-bounce    var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`,
  shake:      `_m3ai-shake     var(--md-sys-motion-duration-medium, 300ms) var(--md-sys-motion-easing-standard, ease) both`,
  'fill-morph': `_m3ai-fill-morph var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00)) both`,
};
/* eslint-enable design-system/no-hardcoded-motion-values */

export type M3AnimatedIconAnimation = 'none' | 'pulse' | 'bounce' | 'shake' | 'fill-morph';

interface M3AnimatedIconProps {
    icon: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'onSurface';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Expressive animation to play when the component mounts or `animKey` changes. */
    animation?: M3AnimatedIconAnimation;
    /** Change this value to re-trigger the animation. */
    animKey?: string | number;
    /** Font-variation fill override (0 = outline, 1 = filled). Default: 0 */
    fill?: 0 | 1;
    style?: CSSProperties;
    'aria-hidden'?: boolean;
    'aria-label'?: string;
}

const sizeTokens: Record<string, string> = {
    sm: 'var(--md-sys-typescale-body-small-font-size)',
    md: 'var(--md-sys-typescale-body-large-font-size)',
    lg: 'var(--md-sys-typescale-headline-small-font-size)',
    xl: 'var(--md-sys-typescale-headline-medium-font-size)',
};

const colorTokens: Record<string, string> = {
    primary:   'var(--md-sys-color-primary)',
    secondary: 'var(--md-sys-color-secondary)',
    tertiary:  'var(--md-sys-color-tertiary)',
    surface:   'var(--md-sys-color-surface)',
    onSurface: 'var(--md-sys-color-on-surface)',
};

const M3AnimatedIcon: React.FC<M3AnimatedIconProps> = ({
    icon,
    color = 'onSurface',
    size = 'md',
    animation = 'none',
    animKey,
    fill = 0,
    style,
    'aria-hidden': ariaHidden = true,
    'aria-label': ariaLabel,
}) => {
    const hasAnimation = animation !== 'none';
    const spanStyle: CSSProperties = {
        fontSize: sizeTokens[size],
        color: colorTokens[color] ?? colorTokens.onSurface,
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        animation: hasAnimation ? ANIMATION_MAP[animation] : undefined,
        willChange: hasAnimation ? 'transform' : undefined,
        ...style,
    };

    return (
        <>
            {hasAnimation && <style>{ICON_KEYFRAMES}</style>}
            <span
                key={animKey}
                // eslint-disable-next-line design-system/no-classname -- material-symbols-outlined is the Google icon font class (functional requirement, not UI style). _m3ai-animated is a CSS animation helper class.
                className={hasAnimation ? '_m3ai-animated material-symbols-outlined' : 'material-symbols-outlined'}
                aria-hidden={ariaHidden}
                aria-label={ariaLabel}
                style={spanStyle}
            >
                {icon}
            </span>
        </>
    );
};

export default M3AnimatedIcon;

