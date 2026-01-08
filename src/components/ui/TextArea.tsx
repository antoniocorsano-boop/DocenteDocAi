import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    containerClassName?: string;
    fullWidth?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ 
    label, 
    error, 
    errorMessage, 
    containerClassName = '', 
    fullWidth = false,
    ...props 
}) => {
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;
    const fullWidthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={`m3-field-container ${fullWidthClass} ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper group${error ? ' error' : ''}`}>
                <textarea
                    {...props}
                    className="m3-field-input resize-none"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    rows={props.rows || 3}
                />
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2 absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true">error</span>
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

export default TextArea;


