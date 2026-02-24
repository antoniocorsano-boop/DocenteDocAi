/**
 * M3SegmentedButton.tsx
 * Material Design 3 Segmented Button component
 * https://m3.material.io/components/segmented-buttons/overview
 */

import React from 'react';

interface Segment {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface M3SegmentedButtonProps {
  segments: Segment[];
  selectedId: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}

const M3SegmentedButton: React.FC<M3SegmentedButtonProps> = ({
  segments,
  selectedId,
  onSelect,
  ariaLabel,
}) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        height: '40px',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
        border: '1px solid var(--md-sys-color-outline)',
        overflow: 'hidden',
      }}
    >
      {segments.map((segment, index) => {
        const isSelected = segment.id === selectedId;
        const isFirst = index === 0;
        const isLast = index === segments.length - 1;

        return (
          <button
            key={segment.id}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={segment.disabled}
            disabled={segment.disabled}
            onClick={() => !segment.disabled && onSelect(segment.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--md-sys-spacing-2)',
              padding: '0 var(--md-sys-spacing-4)',
              height: '100%',
              border: 'none',
              backgroundColor: isSelected
                ? 'var(--md-sys-color-secondary-container)'
                : 'transparent',
              color: isSelected
                ? 'var(--md-sys-color-on-secondary-container)'
                : 'var(--md-sys-color-on-surface)',
              cursor: segment.disabled ? 'not-allowed' : 'pointer',
              opacity: segment.disabled ? 0.38 : 1,
              borderRadius: isFirst
                ? 'var(--md-sys-shape-corner-full) 0 0 var(--md-sys-shape-corner-full)'
                : isLast
                ? '0 var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-full) 0'
                : '0',
              fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
              fontSize: 'var(--md-sys-typescale-label-large-font-size)',
              fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
              transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
              outline: 'none',
            }}
          >
            {/* Checkmark for selected */}
            {isSelected && (
              <span
                style={{
                  fontSize: '18px',
                  color: 'var(--md-sys-color-on-secondary-container)',
                }}
              >
                check
              </span>
            )}

            {/* Icon */}
            {segment.icon && !isSelected && (
              <span
                style={{
                  fontSize: '18px',
                  color: 'var(--md-sys-color-on-surface-variant)',
                }}
              >
                {segment.icon}
              </span>
            )}

            {/* Label */}
            <span>{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default M3SegmentedButton;
