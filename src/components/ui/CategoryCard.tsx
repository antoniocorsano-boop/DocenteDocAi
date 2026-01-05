import React from 'react';

interface CategoryCardProps {
    id: string;
    label: string;
    icon: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
    description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
    label, 
    icon, 
    color, 
    isSelected, 
    onClick, 
    description 
}) => (
    <div
        onClick={onClick}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        className={`flex flex-col items-center gap-8 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected ? 'border-primary bg-primary-container shadow-xl scale-[1.02]' : 'border-outline-variant/20 bg-surface-container/30 hover:border-outline-variant/60 hover:bg-surface-container/50'}`}
    >
        <div
            className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
            style={{ backgroundColor: isSelected ? 'var(--sys-primary)' : color + '20', color: isSelected ? 'var(--sys-on-primary)' : color }}
        >
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="flex flex-col items-center gap-4">
            <span className="text-sm font-black text-center tracking-tight">{label}</span>
            {description && <p className="text-[10px] text-on-surface-variant text-center opacity-60 leading-tight font-medium line-clamp-2 px-4">{description}</p>}
        </div>
    </div>
);

export default CategoryCard;
