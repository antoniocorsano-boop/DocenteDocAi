import React, { SelectHTMLAttributes } from 'react';
import M3Typography from './M3Typography';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    containerClassName?: string;
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
    containerClassName = '',
    fullWidth = false,
    children,
    ...props
}) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;

    return (
        <div
            className={containerClassName}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-2)',
                width: fullWidth ? '100%' : 'auto',
                marginBottom: 'var(--md-sys-spacing-4)'
            }}
        >
            <M3Typography
                variant="label-large"
                as="label"
                htmlFor={props.id}
                style={{
                    color: 'var(--md-sys-color-on-surface-variant)'
                }}
            >
                {label}
            </M3Typography>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    boxShadow: error
                        ? '0 0 0 2px color-mix(in srgb, var(--md-sys-color-error) 12%, transparent)'
                        : 'none',
                    borderColor: error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'
                }}
            >
                <select
                    {...props}
                    style={{
                        flex: 1,
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
                        cursor: 'pointer'
                    }}
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                >
                    {children}
                </select>
                <span
                    className="material-symbols-outlined"
                    style={{
                        position: 'absolute',
                        right: 'var(--md-sys-spacing-2)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontSize: 'var(--md-sys-spacing-4)',
                        transition: 'color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    aria-hidden="true"
                >
                    expand_more
                </span>
                {error && (
                    <span
                        className="material-symbols-outlined"
                        style={{
                            position: 'absolute',
                            left: 'var(--md-sys-spacing-2)',
                            top: '50%',
                            transform: 'translateY(-50%)',
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

export default SelectField;


