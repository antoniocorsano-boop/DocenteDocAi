import React from 'react';

interface DocumentSkeletonProps {
    lines?: number;
    className?: string;
}

const DocumentSkeleton: React.FC<DocumentSkeletonProps> = ({ 
    lines = 5, 
    className = '' 
}) => (
    <div className={`space-y-3 ${className}`}>
        {/* Title skeleton */}
        <div className="h-8 bg-surface-container-high rounded-lg animate-pulse" style={{ width: '70%' }} />
        
        {/* Content lines skeleton */}
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className="h-4 bg-surface-container-high rounded animate-pulse"
                style={{
                    width: i === lines - 1 ? '60%' : '100%',
                    animationDelay: `${i * 0.1}s`
                }}
            />
        ))}
    </div>
);

export default DocumentSkeleton;
