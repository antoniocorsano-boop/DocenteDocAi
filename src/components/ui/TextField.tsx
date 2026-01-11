import React, { InputHTMLAttributes, useState } from 'react';
import M3Typography from './M3Typography';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

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
    const [isFocused, setIsFocused] = useState(false);
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    const hasValue = value !== undefined && value !== '';
    const isLabelFloating = variant === 'filled' && (isFocused || hasValue);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-2)',
                width: fullWidth ? '100%' : 'auto',
                marginBottom: 'var(--md-sys-spacing-4)'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-2)',
                    backgroundColor: variant === 'filled'
                        ? 'var(--md-sys-color-surface-container-highest)'
                        : 'transparent',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    boxShadow: error
                        ? '0 0 0 2px color-mix(in srgb, var(--md-sys-color-error) 12%, transparent)'
                        : isFocused
                        ? '0 0 0 2px color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent)'
                        : 'none',
                    borderColor: error
                        ? 'var(--md-sys-color-error)'
                        : isFocused
                        ? 'var(--md-sys-color-primary)'
                        : 'var(--md-sys-color-outline)'
                }}
            >
                {leadingIcon && (
                    <span
                        // eslint-disable-next-line design-system/no-classname
                        className="material-symbols-outlined"
                        style={{
                            color: isFocused
                                ? 'var(--md-sys-color-primary)'
                                : 'color-mix(in srgb, var(--md-sys-color-on-surface-variant), var(--md-sys-state-opacity-disabled))',
                            transition: 'color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                            fontSize: 'var(--md-sys-spacing-4)'
                        }}
                        aria-hidden="true"
                    >
                        {leadingIcon}
                    </span>
                )}
                <div style={{ flex: 1, position: 'relative' }}>
                    <M3Typography
                        variant="label-large"
                        as="label"
                        htmlFor={props.id}
                        style={{
                            position: 'absolute',
                            top: isLabelFloating ? 'var(--md-sys-spacing-1)' : '50%',
                            left: 0,
                            transform: isLabelFloating
                                ? 'translateY(0) scale(0.75)'
                                : 'translateY(-50%)',
                            transformOrigin: 'top left',
                            transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                            color: isFocused
                                ? 'var(--md-sys-color-primary)'
                                : 'var(--md-sys-color-on-surface-variant)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    >
                        {label}
                    </M3Typography>
                    <input
                        {...props}
                        value={value}
                        data-testid={dataTestId}
                        style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--md-sys-color-on-surface)',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                            fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                            lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                            letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
                            outline: 'none',
                            paddingTop: isLabelFloating ? 'var(--md-sys-spacing-2)' : 0,
                            transition: 'padding-top 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
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
                        // eslint-disable-next-line design-system/no-classname
                        className="material-symbols-outlined"
                        style={{
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-spacing-4)'
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--md-sys-spacing-1)',
                        marginTop: 'var(--md-sys-spacing-1)'
                    }}
                >
                    <span
                        // eslint-disable-next-line design-system/no-classname
                        className="material-symbols-outlined"
                        style={{
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)'
                        }}
                        aria-hidden="true"
                    >
                        error
                    </span>
                    <M3Typography
                        variant="body-small"
                        style={{
                            color: 'var(--md-sys-color-error)'
                        }}
                    >
                        {errorMessage}
                    </M3Typography>
                </div>
            )}
        </div>
    );
};

export default TextField;


