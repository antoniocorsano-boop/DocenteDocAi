import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
    rows = 3, 
    columns = 3, 
    className = '' 
}) => (
    <div className={`space-y-2 ${className}`}>
        {/* Table header skeleton */}
        <div className="flex gap-8">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="h-6 bg-[var(--md-sys-color-surface-container-high)] rounded animate-pulse flex-1"
                    style={{ animationDelay: `${i * 0.05}s` }}
                />
            ))}
        </div>
        
        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-8">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <div
                        key={colIndex}
                        className="h-4 bg-[var(--md-sys-color-surface-container-high)] rounded animate-pulse flex-1"
                        style={{
                            animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`,
                            width: Math.random() > 0.5 ? '100%' : '80%'
                        }}
                    />
                ))}
            </div>
        ))}
    </div>
);

export default TableSkeleton;


