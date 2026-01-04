import React, { ButtonHTMLAttributes } from 'react';

interface M3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  color = 'primary',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
  title,
  size = 'medium',
  ...props
}) => {
  // Base classes for M3 Button
  const baseClass = "m3-button";
  
  // Variant classes
  const variantClass = `m3-button--${variant}`;
  
  // Color classes
  const colorClass = `m3-button--${color}`;
  
  // Size classes
  const sizeClass = `m3-button--${size}`;
  
  // Full width class
  const fullWidthClass = fullWidth ? "m3-button--full-width" : "";

  const combinedClassName = `${baseClass} ${variantClass} ${colorClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      title={title}
    >
      {startIcon && <span className="m3-button__icon m3-button__icon--start">{startIcon}</span>}
      <span className="m3-button__label">{children}</span>
      {endIcon && <span className="m3-button__icon m3-button__icon--end">{endIcon}</span>}
    </button>
  );
};

export default M3Button;
