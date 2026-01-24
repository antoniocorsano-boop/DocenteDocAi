// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

interface ImageSkeletonProps {
    aspectRatio?: string;
}

/**
 * ImageSkeleton - Loading skeleton for image content.
 * Shows animated placeholder with icon and text during image generation.
 */

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
    aspectRatio = '16/9'
}) => {
  const { layers } = useTheme();
  const { sys, ref } = layers;

    return (
    <div
        style={{
            backgroundColor: sys.color.surfaceContainerHigh,
            borderRadius: ref.shape.corner.small,
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
            gap: ref.spacing[8],
            color: `color-mix(in srgb, ${sys.color.onSurfaceVariant} 50%, transparent)`
        }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: ref.typography.displaySmall.fontSize
            }}>image</span>
            <span style={{
                fontSize: ref.typography.bodySmall.fontSize,
                fontWeight: 500
            }}>Generazione immagine...</span>
        </div>
    </div>
    );
};

export default ImageSkeleton;



