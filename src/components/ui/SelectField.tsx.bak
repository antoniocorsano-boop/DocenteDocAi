// MD3 Compliant - Fully migrated to MD3 tokens
// @md3-compliant
// @migrated

import React, { SelectHTMLAttributes } from 'react';
import M3Typography from './M3Typography';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
}

/**
 * MD3-compliant SelectField component
 * Migrated from legacy CSS classes to pure MD3 tokens and M3Typography
 * Features: error states, accessibility, keyboard navigation
 */
const SelectField: React.FC<SelectFieldProps> = ({
    label,
    error,
    errorMessage,
    fullWidth = false,
    children,
    ...props
}) => {
    // Removed: const { layers } = useTheme();
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;

    return (
        <div
            style={{display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-component)',
                width: fullWidth ? 'var(--app-layout-full)' : 'auto',
                marginBottom: 'var(--app-spacing-container)'}}
        >
            <M3Typography
                variant="label-large"
                as="label"
                htmlFor={props.id}
                style={{color: 'var(--md-sys-color-on-surface-variant)'}}
            >
                {label}
            </M3Typography>
            <div
                style={{position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: `var(--app-border-normal) solid var(--md-sys-color-outline)`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: `var(--app-spacing-element) var(--app-spacing-container)`,
                    transition: `all var(--app-motion-quick) var(--app-easing-standard)`,
                    boxShadow: error
                        ? `0 0 0 var(--app-spacing-component) color-mix(in srgb, var(--md-sys-color-error) var(--md-sys-percent-12), transparent)`
                        : 'none',
                    borderColor: error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}}
            >
                <select
                    {...props}
                    style={{flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--app-color-on-surface)',
                        fontSize: 'var(--app-text-body)',
                        fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                        fontWeight: 'var(--app-text-body-weight)',
                        lineHeight: 'var(--app-text-body-line-height)',
                        letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer'}}
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                >
                    {children}
                </select>
                <span
                    style={{fontFamily: 'Material Symbols Outlined',
                        position: 'absolute',
                        right: 'var(--app-spacing-component)',
                        top: 'var(--app-layout-half)',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: 'var(--app-spacing-container)',
                        transition: `color var(--app-motion-quick) var(--app-easing-standard)`}}
                    aria-hidden="true"
                >
                    expand_more
                </span>
                {error && (
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            position: 'absolute',
                            left: 'var(--app-spacing-component)',
                            top: 'var(--app-layout-half)',
                            transform: 'translateY(-50%)',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-spacing-container)'}}
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
                        marginTop: 'var(--md-sys-spacing-1)',
                        width: 'var(--app-layout-full)'}}
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-text-body)'}}
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

export default SelectField;








