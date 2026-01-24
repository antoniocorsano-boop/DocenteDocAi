// LEGACY - MD3 Non-compliant
import React, { SelectHTMLAttributes } from 'react';
import M3Typography from './M3Typography';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';
import { useTheme } from '../../theme/theme';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
}

/**
 * MD3-compliant SelectField component
 * Migrated from legacy CSS classes to pure MD3 tokens and M3Typography
 * Features: error states, accessibility, keyboard navigation
 */
const SelectField: React.FC<SelectFieldProps> = ({
    label,
    error,
    errorMessage,
    fullWidth = false,
    children,
    ...props
}) => {
    const { layers } = useTheme();
    const describedBy = error && errorMessage ? `${props.id}-error` : undefined;

    return (
        <div
            style={{display: 'flex',
                flexDirection: 'column',
                gap: layers.ref.spacing['2'],
                width: fullWidth ? '100%' : 'auto',
                marginBottom: layers.ref.spacing['4']}}
        >
            <M3Typography
                variant="label-large"
                as="label"
                htmlFor={props.id}
                style={{color: 'layers.sys.color.on-surface-variant'}}
            >
                {label}
            </M3Typography>
            <div
                style={{position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: layers.sys.color.surfaceContainerHighest,
                    border: `1px solid ${layers.sys.color.outline}`,
                    borderRadius: layers.ref.shape.corner.large,
                    padding: `${layers.ref.spacing['3']} ${layers.ref.spacing['4']}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    boxShadow: error
                        ? `0 0 0 2px color-mix(in srgb, ${layers.sys.color.error} 12%, transparent)`
                        : 'none',
                    borderColor: error ? layers.sys.color.error : layers.sys.color.outline}}
            >
                <select
                    {...props}
                    style={{flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'layers.sys.color.on-surface',
                        fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                        fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
                        fontWeight: 'var(--md-sys-typescale-body-large-font-weight)',
                        lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                        letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer'}}
                    aria-label={label}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                >
                    {children}
                </select>
                <span
                    style={{fontFamily: 'Material Symbols Outlined',
                        position: 'absolute',
                        right: layers.ref.spacing['2'],
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'layers.sys.color.on-surface-variant',
                        fontSize: layers.ref.spacing['4'],
                        transition: 'color 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'}}
                    aria-hidden="true"
                >
                    expand_more
                </span>
                {error && (
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            position: 'absolute',
                            left: layers.ref.spacing['2'],
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'layers.sys.color.error',
                            fontSize: layers.ref.spacing['4']}}
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
                        gap: layers.ref.spacing['1'],
                        marginTop: layers.ref.spacing['1']}}
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            color: 'layers.sys.color.error',
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)'}}
                        aria-hidden="true"
                    >
                        error
                    </span>
                    <M3Typography
                        variant="body-small"
                        style={{color: 'layers.sys.color.error'}}
                    >
                        {errorMessage}
                    </M3Typography>
                </div>
            )}
        </div>
    );
};

export default SelectField;



