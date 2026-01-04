import React from 'react';

interface M3IconButtonProps {
    icon: string;
    onClick?: () => void;
    ariaLabel: string;
    disabled?: boolean;
    className?: string;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
}

const M3IconButton: React.FC<M3IconButtonProps> = ({ 
    icon, 
    onClick, 
    ariaLabel, 
    disabled = false, 
    className = '', 
    title, 
    type = 'button' 
}) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        title={title || ariaLabel}
        className={`icon-button ${className}`}
    >
        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
    </button>
);

export default M3IconButton;
