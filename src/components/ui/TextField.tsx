import React, { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    leadingIcon?: string;
    containerClassName?: string;
    fullWidth?: boolean;
    'data-testid'?: string;
}

const TextField: React.FC<TextFieldProps> = ({ 
    label, 
    error, 
    errorMessage, 
    leadingIcon, 
    containerClassName = '', 
    fullWidth = false,
    'data-testid': dataTestId,
    ...props 
}) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    const fullWidthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={`m3-field-container ${fullWidthClass} ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper ${error ? 'error' : ''} group`}>
                {leadingIcon && (
                    <span className="material-symbols-outlined opacity-60 group-focus-within:opacity-100 group-focus-within:text-primary transition-all">
                        {leadingIcon}
                    </span>
                )}
                <input
                    {...props}
                    data-testid={dataTestId}
                    className="m3-field-input"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                />
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2" aria-hidden="true">error</span>
                )}
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-error text-xs mt-4 flex items-center gap-4">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default TextField;
