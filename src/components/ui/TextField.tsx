// Thin MUI wrapper — preserves TextField props API for backward compatibility
// @mui-migrated Fase 2
import React, { InputHTMLAttributes } from 'react';
import { TextField as MuiTextField, InputAdornment } from '@mui/material';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    variant?: 'filled' | 'outlined';
    error?: boolean;
    errorMessage?: string;
    leadingIcon?: string;
    fullWidth?: boolean;
    containerClassName?: string;
    multiline?: boolean;
    rows?: number;
    'data-testid'?: string;
}

const TextField: React.FC<TextFieldProps> = ({
    label,
    variant = 'outlined',
    error,
    errorMessage,
    leadingIcon,
    fullWidth = false,
    containerClassName: _containerClassName,
    multiline,
    rows,
    'data-testid': dataTestId,
    id,
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    placeholder,
    type,
    name,
    autoComplete,
    readOnly,
    ...restProps
}) => (
    <MuiTextField
        label={label}
        variant={variant}
        error={error}
        helperText={error ? errorMessage : undefined}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        id={id}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
        onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        name={name}
        autoComplete={autoComplete}
        inputProps={{ 'data-testid': dataTestId, readOnly, ...restProps }}
        FormHelperTextProps={error && errorMessage ? { id: `${id}-error` } : undefined}
        InputProps={leadingIcon ? {
            startAdornment: (
                <InputAdornment position="start">
                    <span className="material-symbols-outlined" aria-hidden="true">{leadingIcon}</span>
                </InputAdornment>
            ),
        } : undefined}
        sx={{ mb: 2 }}
    />
);

export default TextField;
