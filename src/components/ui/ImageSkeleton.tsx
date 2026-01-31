/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 Compliant - Updated for layered theme access
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
  const { layers: { sys: { color }, ref: { spacing, shape, typography } } } = useTheme();

    return (
    <div
        style={{
            backgroundColor: color.surfaceContainerHigh,
            borderRadius: shape.corner.small,
            animation: `pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-standard) infinite`,
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
            gap: spacing[4],
            color: `color-mix(in srgb, var(--md-sys-color-on-surface-variant) var(--md-sys-state-opacity-disabled), transparent)`
        }}>
            <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: typography.displaySmall.fontSize
            }}>image</span>
            <span style={{
                fontSize: typography.bodySmall.fontSize,
                fontWeight: 500
            }}>Generazione immagine...</span>
        </div>
    </div>
    );
};

export default ImageSkeleton;











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
