import React from 'react';

interface ImageSkeletonProps {
    aspectRatio?: string;
    className?: string;
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ 
    aspectRatio = '16/9', 
    className = '' 
}) => (
    <div
        className={`bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-small)] animate-pulse flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
    >
        <div className="flex flex-col items-center gap-8 text-[var(--md-sys-color-on-surface)]-variant/50">
            <span className="material-symbols-outlined text-4xl">image</span>
            <span className="text-sm font-medium">Generazione immagine...</span>
        </div>
    </div>
);

export default ImageSkeleton;


