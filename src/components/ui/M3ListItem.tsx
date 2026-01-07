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
            className={`flex items-start gap-4 p-4 rounded-xl transition-all min-h-[56px] ${isClickable ? 'cursor-pointer hover:bg-surface-container-highest focus-visible:bg-surface-container-highest active:bg-surface-container-highest' : ''} ${className}`}
        >
            {leadingElement && <div className="flex-shrink-0 mt-0.5">{leadingElement}</div>}
            <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                <div className={`text-on-surface font-bold truncate ${headlineSize === 'small' ? 'm3-body-medium' : headlineSize === 'large' ? 'm3-title-medium' : 'm3-body-large'}`}>
                    {headline}
                </div>
                {supportingText && (
                    <div className="m3-body-small text-on-surface-variant opacity-80">
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
