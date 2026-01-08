import React, { InputHTMLAttributes, useState } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    variant?: 'filled' | 'outlined';
    error?: boolean;
    errorMessage?: string;
    leadingIcon?: string;
    containerClassName?: string;
    fullWidth?: boolean;
    'data-testid'?: string;
}

const TextField: React.FC<TextFieldProps> = ({ 
    label,
    variant = 'outlined',
    error, 
    errorMessage, 
    leadingIcon, 
    containerClassName = '', 
    fullWidth = false,
    'data-testid': dataTestId,
    value,
    ...props 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    const fullWidthClass = fullWidth ? 'w-full' : '';
    const hasValue = value !== undefined && value !== '';
    const isLabelFloating = variant === 'filled' && (isFocused || hasValue);
    const variantClass = `m3-field-${variant}`;

    return (
        <div className={`m3-field-container ${fullWidthClass} ${containerClassName}`}>
            <div className={`m3-field-wrapper ${variantClass} ${error ? 'error' : ''} group ${isLabelFloating ? 'has-value' : ''}`}>
                {leadingIcon && (
                    <span className="material-symbols-outlined opacity-[var(--md-sys-state-opacity-disabled)] group-focus-within:opacity-100 group-focus-within:text-[var(--md-sys-color-primary)] transition-all">
                        {leadingIcon}
                    </span>
                )}
                <div className="m3-field-input-wrapper">
                    <label 
                        htmlFor={props.id} 
                        className={`m3-field-label ${variant === 'filled' ? 'm3-field-label-floating' : ''}`}
                    >
                        {label}
                    </label>
                    <input
                        {...props}
                        value={value}
                        data-testid={dataTestId}
                        className="m3-field-input"
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
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-[var(--md-sys-color-error)] ml-[var(--md-sys-spacing-2)]" aria-hidden="true">error</span>
                )}
                </div>
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-[var(--md-sys-color-error)] text-[var(--md-sys-typescale-body-small)] mt-[var(--md-sys-spacing-1)] flex items-center gap-[var(--md-sys-spacing-1)]">
                    <span className="material-symbols-outlined text-[var(--md-sys-color-error)] text-[var(--md-sys-typescale-body-small)]">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default TextField;
