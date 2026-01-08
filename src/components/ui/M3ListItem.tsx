import React from 'react';

interface M3ListItemProps {
    headline: React.ReactNode;
    headlineSize?: 'small' | 'medium' | 'large';
    supportingText?: React.ReactNode;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

const M3ListItem: React.FC<M3ListItemProps> = ({ 
    headline, 
    headlineSize = 'medium', 
    supportingText, 
    leadingElement, 
    trailingElement, 
    onClick, 
    className = '', 
    children 
}) => {
    const isClickable = Boolean(onClick);
    
    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            className={`flex items-start gap-4 p-4 rounded-[var(--md-sys-shape-corner-medium)] transition-all min-h-[56px] ${isClickable ? 'cursor-pointer hover:bg-[var(--md-sys-color-surface-container-high)]est focus-visible:bg-[var(--md-sys-color-surface-container-high)]est active:bg-[var(--md-sys-color-surface-container-high)]est' : ''} ${className}`}
        >
            {leadingElement && <div className="flex-shrink-0 mt-0.5">{leadingElement}</div>}
            <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                <div className={`text-[var(--md-sys-color-on-surface)] font-bold truncate ${headlineSize === 'small' ? 'text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]' : headlineSize === 'large' ? 'm3-title-medium' : 'text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]'}`}>
                    {headline}
                </div>
                {supportingText && (
                    <div className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant opacity-80">
                        {supportingText}
                    </div>
                )}
                {children}
            </div>
            {trailingElement && <div className="flex-shrink-0 flex items-center gap-8 self-center">{trailingElement}</div>}
        </div>
    );
};

export default M3ListItem;


