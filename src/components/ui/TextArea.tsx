// MD3 Compliant - Fully migrated to MD3 tokens
// @md3-compliant
// @migrated

import React, { TextareaHTMLAttributes } from 'react';
import { M3Typography } from './M3Typography';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
    containerClassName?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    errorMessage,
    fullWidth = false,
    containerClassName: _containerClassName,
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
                style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    marginBottom: 'var(--md-sys-spacing-2)'
                }}
            >
                {label}
            </M3Typography>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: `var(--md-sys-border-width-normal) solid ${error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    transition: `all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
                    minHeight: 'var(--md-sys-spacing-12)'
                }}
            >
                <textarea
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
                        className="material-symbols-outlined"
                        style={{
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
                        className="material-symbols-outlined"
                        style={{
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)'}}
                        aria-hidden="true"
                    >
                        error
                    </span>
                    <M3Typography
                        variant="body-small"
                        as="span"
                        style={{color: 'var(--md-sys-color-error)'}}
                    >
                        {errorMessage}
                    </M3Typography>
                </div>
            )}
        </div>
    );
};

export default TextArea;

