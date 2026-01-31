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
                gap: 'var(--md-sys-spacing-2)',
                width: fullWidth ? 'var(--md-sys-percent-100)' : 'auto',
                marginBottom: 'var(--md-sys-spacing-4)'}}
        >
            <label
                htmlFor={props.id}
                style={{color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 'var(--app-text-label)',
                    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                    fontWeight: 'var(--app-text-label-weight)',
                    lineHeight: 'var(--app-text-label-line-height)',
                    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
                    marginBottom: 'var(--md-sys-spacing-2)'}}
            >
                {label}
            </label>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: `var(--md-sys-border-width-normal) solid ${error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    transition: `all var(--md-sys-motion-duration-short-2) var(--md-sys-motion-easing-standard)`,
                    minHeight: 'var(--md-sys-spacing-12)'
                }}
            >
                <textarea
                    {...props}
                    style={{flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--md-sys-color-on-surface)',
                        fontSize: 'var(--app-text-body)',
                        fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                        fontWeight: 'var(--app-text-body-weight)',
                        lineHeight: 'var(--app-text-body-line-height)',
                        letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
                        outline: 'none',
                        resize: 'none',
                        width: 'var(--md-sys-percent-100)',
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
                            left: 'var(--md-sys-spacing-2)',
                            top: 'var(--md-sys-spacing-2)',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-spacing-4)',
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








