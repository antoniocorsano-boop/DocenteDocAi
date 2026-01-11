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
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;

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
            <label
                htmlFor={props.id}
                style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
                    fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
                    lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
                    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
                    marginBottom: 'var(--md-sys-spacing-2)'
                }}
            >
                {label}
            </label>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    border: `1px solid ${error ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    minHeight: '80px'
                }}
            >
                <textarea
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
                        resize: 'none',
                        width: '100%',
                        minHeight: '60px'
                    }}
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    rows={props.rows || 3}
                />
                {error && errorMessage && (
                    <span
                        // eslint-disable-next-line design-system/no-classname
                        className="material-symbols-outlined"
                        style={{
                            position: 'absolute',
                            left: 'var(--md-sys-spacing-2)',
                            top: 'var(--md-sys-spacing-2)',
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-spacing-4)',
                            pointerEvents: 'none'
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
                    <span
                        style={{
                            color: 'var(--md-sys-color-error)',
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                            fontFamily: 'var(--md-sys-typescale-body-small-font-family)',
                            fontWeight: 'var(--md-sys-typescale-body-small-font-weight)',
                            lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
                            letterSpacing: 'var(--md-sys-typescale-body-small-letter-spacing)'
                        }}
                    >
                        {errorMessage}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TextArea;


