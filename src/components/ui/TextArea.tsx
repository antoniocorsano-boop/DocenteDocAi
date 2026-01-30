// MD3 Compliant - Fully migrated to MD3 tokens
// @md3-compliant
// @migrated

import React, { TextareaHTMLAttributes } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    errorMessage,
    fullWidth = false,
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
            <label
                htmlFor={props.id}
                style={{color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 'var(--app-text-label)',
                    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                    fontWeight: 'var(--app-text-label-weight)',
                    lineHeight: 'var(--app-text-label-line-height)',
                    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
                    marginBottom: 'var(--app-spacing-component)'}}
            >
                {label}
            </label>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: `var(--app-border-normal) solid ${error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--app-spacing-element) var(--app-spacing-container)',
                    transition: `all var(--md-sys-motion-duration-short-2) var(--app-easing-standard)`,
                    minHeight: 'var(--md-sys-spacing-12)'
                }}
            >
                <textarea
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
                        resize: 'none',
                        width: 'var(--app-layout-full)',
                        minHeight: 'var(--md-sys-spacing-12)'}}
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    rows={props.rows || 3}
                />
                {error && errorMessage && (
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            position: 'absolute',
                            left: 'var(--app-spacing-component)',
                            top: 'var(--app-spacing-component)',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-spacing-container)',
                            pointerEvents: 'none'}}
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
                        style={{fontFamily: 'Material Symbols Outlined',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-text-body)'}}
                        aria-hidden="true"
                    >
                        error
                    </span>
                    <span
                        style={{color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--app-text-body)',
                            fontFamily: 'var(--md-sys-typescale-body-small-font-family)',
                            fontWeight: 'var(--app-text-body-weight)',
                            lineHeight: 'var(--app-text-body-line-height)',
                            letterSpacing: 'var(--md-sys-typescale-body-small-letter-spacing)'}}
                    >
                        {errorMessage}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TextArea;








