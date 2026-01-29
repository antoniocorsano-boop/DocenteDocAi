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
                gap: 'var(--md-sys-spacing-2)',
                width: fullWidth ? 'var(--md-sys-percent-100)' : 'auto',
                marginBottom: 'var(--md-sys-spacing-4)'}}
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
                    border: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: `var(--md-sys-spacing-3) var(--md-sys-spacing-4)`,
                    transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
                    boxShadow: error
                        ? `0 0 0 var(--md-sys-spacing-2) color-mix(in srgb, var(--md-sys-color-error) var(--md-sys-percent-12), transparent)`
                        : 'none',
                    borderColor: error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}}
            >
                <select
                    {...props}
                    style={{flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--md-sys-color-on-surface)',
                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                        fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
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
                        right: 'var(--md-sys-spacing-2)',
                        top: 'var(--md-sys-percent-50)',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: 'var(--md-sys-spacing-4)',
                        transition: `color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`}}
                    aria-hidden="true"
                >
                    expand_more
                </span>
                {error && (
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            position: 'absolute',
                            left: 'var(--md-sys-spacing-2)',
                            top: 'var(--md-sys-percent-50)',
                            transform: 'translateY(-50%)',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-spacing-4)'}}
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
                        width: 'var(--md-sys-percent-100)'}}
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)'}}
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








