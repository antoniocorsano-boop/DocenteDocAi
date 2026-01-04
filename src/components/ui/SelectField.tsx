import React, { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    containerClassName?: string;
    fullWidth?: boolean;
}

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
    const fullWidthClass = fullWidth ? 'w-full' : '';
    
    return (
        <div className={`m3-field-container ${fullWidthClass} ${containerClassName}`}>
            <label htmlFor={props.id} className="m3-field-label">{label}</label>
            <div className={`m3-field-wrapper relative group${error ? ' error' : ''}`}>
                <select
                    {...props}
                    className="m3-field-select"
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                >
                    {children}
                </select>
                <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all">
                    expand_more
                </span>
                {error && errorMessage && (
                    <span className="material-symbols-outlined text-error ml-2 absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true">error</span>
                )}
            </div>
            {error && errorMessage && (
                <div id={describedBy} className="m3-field-error text-error text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SelectField;
