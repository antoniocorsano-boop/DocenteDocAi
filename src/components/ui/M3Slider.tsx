/**
 * M3Slider.tsx
 * Material Design 3 Slider component
 * https://m3.material.io/components/sliders/overview
 */

import React, { useState, useRef, useCallback } from 'react';

interface M3SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

const M3Slider: React.FC<M3SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  ariaLabel,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const calculateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const rawValue = min + (max - min) * percent;
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step, value]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onChange(calculateValue(e.clientX));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    onChange(calculateValue(e.touches[0].clientX));
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onChange(calculateValue(e.clientX));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        onChange(calculateValue(e.touches[0].clientX));
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, calculateValue, onChange]);

  return (
    <div
      role="slider"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{
        position: 'relative',
        width: '100%',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Track background */}
      <div
        ref={trackRef}
        style={{
          position: 'absolute',
          left: '16px',
          right: '16px',
          height: '16px',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          overflow: 'hidden',
        }}
      >
        {/* Active track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percentage}%`,
            backgroundColor: 'var(--md-sys-color-primary)',
            transition: isDragging ? 'none' : `width var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
          }}
        />
      </div>

      {/* Thumb */}
      <div
        style={{
          position: 'absolute',
          left: `calc(16px + ${percentage}% - 10px)`,
          width: isDragging ? '20px' : '4px',
          height: isDragging ? '20px' : '44px',
          borderRadius: isDragging ? 'var(--md-sys-shape-corner-full)' : '2px',
          backgroundColor: isDragging
            ? 'var(--md-sys-color-primary)'
            : 'var(--md-sys-color-on-primary)',
          border: isDragging
            ? '2px solid var(--md-sys-color-primary)'
            : '2px solid var(--md-sys-color-primary)',
          boxShadow: isDragging
            ? 'var(--md-sys-elevation-level-2)'
            : 'var(--md-sys-elevation-level-1)',
          transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default M3Slider;
