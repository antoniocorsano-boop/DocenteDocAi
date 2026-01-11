import React from 'react';
import { useTheme } from '../../theme/theme';

interface ImageSkeletonProps {
    aspectRatio?: string;
}

/**
 * ImageSkeleton - Loading skeleton for image content.
 * Shows animated placeholder with icon and text during image generation.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ 
    aspectRatio = '16/9'
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useTheme();
    
    return (
    <div
        style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderRadius: 'var(--md-sys-shape-corner-small)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio
        }}
    >
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-8)',
            color: 'color-mix(in srgb, var(--md-sys-color-on-surface-variant) 50%, transparent)'
        }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: 'var(--md-sys-typescale-display-small-size)'
            }}>image</span>
            <span style={{
                fontSize: 'var(--md-sys-typescale-body-small-size)',
                fontWeight: 500
            }}>Generazione immagine...</span>
        </div>
    </div>
    );
};

export default ImageSkeleton;


