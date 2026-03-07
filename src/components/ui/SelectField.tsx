// Thin MUI wrapper — preserves SelectField props API for backward compatibility
// @mui-migrated Fase 2
import React, { SelectHTMLAttributes } from 'react';
import { FormControl, FormHelperText, InputLabel, NativeSelect } from '@mui/material';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
    options?: { value: string; label: string }[];
    containerClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    error,
    errorMessage,
    fullWidth = false,
    children,
    options,
    containerClassName: _containerClassName,
    id,
    value,
    onChange,
    disabled,
    ...props
}) => {
    const inputId = id || 'select-field';
    const labelId = `${inputId}-label`;
    const describedBy = error && errorMessage ? `${inputId}-error` : undefined;

    return (
        <FormControl fullWidth={fullWidth} error={error} disabled={disabled} sx={{ mb: 2 }}>
            <InputLabel htmlFor={inputId} id={labelId}>{label}</InputLabel>
            <NativeSelect
                inputProps={{
                    id: inputId,
                    'aria-label': label,
                    'aria-invalid': error ? 'true' : undefined,
                    'aria-describedby': describedBy,
                    ...props,
                }}
                value={value}
                onChange={onChange}
            >
                {options
                    ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
                    : children}
            </NativeSelect>
            {error && errorMessage && (
                <FormHelperText id={describedBy}>{errorMessage}</FormHelperText>
            )}
        </FormControl>
    );
};

export default SelectField;
