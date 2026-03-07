// Thin MUI wrapper — preserves TextArea props API for backward compatibility
// @mui-migrated Fase 2
import React, { TextareaHTMLAttributes } from 'react';
import { TextField } from '@mui/material';

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
    id,
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    placeholder,
    rows = 3,
    name,
    ...restProps
}) => (
    <TextField
        label={label}
        variant="outlined"
        error={error}
        helperText={error ? errorMessage : undefined}
        fullWidth={fullWidth}
        multiline
        rows={rows}
        id={id}
        value={value}
        onChange={onChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
        onFocus={onFocus as unknown as React.FocusEventHandler<HTMLInputElement>}
        onBlur={onBlur as unknown as React.FocusEventHandler<HTMLInputElement>}
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        inputProps={{
            'aria-label': label,
            'aria-invalid': error ? 'true' : undefined,
            'aria-describedby': error && errorMessage ? `${id}-error` : undefined,
            ...restProps,
        }}
        FormHelperTextProps={error && errorMessage ? { id: `${id}-error` } : undefined}
        sx={{ mb: 2 }}
    />
);

export default TextArea;
export { TextArea };

