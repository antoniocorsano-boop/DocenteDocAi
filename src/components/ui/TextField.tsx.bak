// MD3 Compliant - Fully migrated to MD3 tokens
// @md3-compliant
// @migrated

import React, { InputHTMLAttributes, useState } from 'react';
import M3Typography from './M3Typography';
// ...existing code...

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    variant?: 'filled' | 'outlined';
    error?: boolean;
    errorMessage?: string;
    leadingIcon?: string;
    fullWidth?: boolean;
    'data-testid'?: string;
}

/**
 * MD3-compliant TextField component
 * Migrated from legacy CSS classes to pure MD3 tokens and M3Typography
 * Features: outlined/filled variants, error states, leading icons, accessibility
 */
const TextField: React.FC<TextFieldProps> = ({
    label,
    variant = 'outlined',
    error,
    errorMessage,
    leadingIcon,
    fullWidth = false,
    'data-testid': dataTestId,
    value,
    ...props
}) => {
    // Removed: const { layers } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    const hasValue = value !== undefined && value !== '';
    const isLabelFloating = variant === 'filled' && (isFocused || hasValue);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-component)',
                width: fullWidth ? 'var(--app-layout-full)' : 'auto',
                marginBottom: 'var(--app-spacing-container)'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-component)',
                    backgroundColor: variant === 'filled'
                        ? 'var(--md-sys-color-surface-container-high)'
                        : 'transparent',
                    border: `var(--app-border-normal) solid var(--md-sys-color-outline)`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                    transition: `all var(--app-motion-quick) var(--app-easing-standard)`, // MD3 motion tokens for duration and easing
                    boxShadow: error
                        ? `0 0 0 var(--app-spacing-component) color-mix(in srgb, var(--md-sys-color-error) var(--md-sys-percent-12), transparent)`
                        : isFocused
                        ? `0 0 0 var(--app-spacing-component) color-mix(in srgb, var(--app-color-primary) var(--md-sys-percent-12), transparent)`
                        : 'none',
                    borderColor: error
                        ? 'var(--md-sys-color-error)'
                        : isFocused
                        ? 'var(--app-color-primary)'
                        : 'var(--md-sys-color-outline)'
                }}
            >
                {leadingIcon && (
                    <span
                        style={{
                            fontFamily: 'Material Symbols Outlined',
                            color: isFocused
                                ? 'var(--app-color-primary)'
                                : `color-mix(in srgb, var(--app-color-on-surface-variant), var(--md-sys-state-opacity-disabled))`,
                            transition: `color var(--app-motion-quick) var(--app-easing-standard)`, // MD3 motion tokens for duration and easing
                            fontSize: 'var(--app-spacing-container)'
                        }}
                        aria-hidden="true"
                    >
                        {leadingIcon}
                    </span>
                )}
                <div style={{ flex: 1, position: 'relative' }}>
                    <M3Typography
                        variant="label-large"
                        as="span"
                        // htmlFor removed: not valid for span
                        style={{
                            position: 'absolute',
                            top: isLabelFloating ? 'var(--md-sys-spacing-1)' : 'var(--app-layout-half)',
                            left: 0,
                            transform: isLabelFloating
                                ? 'translateY(0) scale(0.75)'
                                : 'translateY(-50%)',
                            transformOrigin: 'top left',
                            transition: `all var(--app-motion-quick) var(--app-easing-standard)`, // MD3 motion tokens for duration and easing
                            color: isFocused
                                ? 'var(--app-color-primary)'
                                : 'var(--app-color-on-surface-variant)',
                            pointerEvents: 'none',
                            zIndex: 'var(--app-z-tooltip)' // MD3 z-index token
                        }}
                    >
                        {label}
                    </M3Typography>
                    <input
                        {...props}
                        value={value}
                        data-testid={dataTestId}
                        style={{
                            width: 'var(--app-layout-full)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--app-color-on-surface)',
                            fontSize: 'var(--app-text-body)',
                            fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                            fontWeight: 'var(--app-text-body-weight)',
                            lineHeight: 'var(--app-text-body-line-height)',
                            letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
                            outline: 'none',
                            paddingTop: isLabelFloating ? 'var(--app-spacing-component)' : 0,
                            transition: `padding-top var(--app-motion-quick) var(--app-easing-standard)` // MD3 motion tokens for duration and easing
                        }}
                        placeholder=""
                        aria-label={label}
                        aria-invalid={error ? 'true' : undefined}
                        aria-describedby={describedBy}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                    />
                </div>
                {error && (
                    <span
                        style={{
                            fontFamily: 'Material Symbols Outlined',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-spacing-container)'
                        }}
                        aria-hidden="true"
                    >
                        error
                    </span>
                )}
            </div>
            {error && errorMessage && (
                <div
                    id={describedBy}
                    style={{display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-1)',
                        marginTop: 'var(--md-sys-spacing-1)'}}
                >
                    <span
                        style={{
                            fontFamily: 'Material Symbols Outlined',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-text-body)'
                        }}
                        aria-hidden="true"
                    >
                        error
                    </span>
                    <M3Typography
                        variant="body-small"
                        style={{color: 'var(--md-sys-color-error)'}}
                    >
                        {errorMessage}
                    </M3Typography>
                </div>
            )}
        </div>
    );
};

export default TextField;








