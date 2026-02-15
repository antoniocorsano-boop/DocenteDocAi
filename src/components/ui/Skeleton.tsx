// MD3 Gold Compliant
// Component per skeleton loaders (scheletro di caricamento)
// Audit: febbraio 2026

import React from 'react';
import M3Surface from './M3Surface';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'list';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Componente Skeleton per visualizzare uno scheletro di caricamento
 * @param variant - Tipo di skeleton (text, circular, rectangular, card, list)
 * @param width - Larghezza dello skeleton
 * @param height - Altezza dello skeleton
 * @param animation - Tipo di animazione (pulse, wave, none)
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  animation = 'pulse'
}) => {
  // Mappatura varianti a stili predefiniti
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      background:
        'linear-gradient(90deg, var(--md-sys-color-surface-container-highest) 0%, var(--md-sys-color-surface-variant) 50%, var(--md-sys-color-surface-container-highest) 100%)',
      backgroundSize: '200% 100%',
      borderRadius: 'var(--md-sys-shape-corner-extra-small)',
    };

    switch (variant) {
      case 'circular':
        return {
          ...baseStyles,
          borderRadius: '50%',
          width: width || '40px',
          height: height || '40px',
        };

      case 'rectangular':
        return {
          ...baseStyles,
          width: width || '100%',
          height: height || 'var(--md-sys-spacing-4)',
          borderRadius: 'var(--md-sys-shape-corner-small)',
        };

      case 'card':
        return {
          ...baseStyles,
          width: width || '100%',
          height: height || 'var(--md-sys-spacing-12)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
        };

      case 'list':
        return {
          ...baseStyles,
          width: width || '100%',
          height: height || 'var(--md-sys-spacing-5)',
          borderRadius: 'var(--md-sys-shape-corner-extra-small)',
        };

      case 'text':
      default:
        return {
          ...baseStyles,
          width: width || '60%',
          height: height || 'var(--md-sys-spacing-3)',
          borderRadius: 'var(--md-sys-shape-corner-extra-small)',
        };
    }
  };

  // Animazione
  const getAnimationClass = (): string => {
    switch (animation) {
      case 'wave':
        return 'skeleton-wave';
      case 'none':
        return 'skeleton-none';
      case 'pulse':
      default:
        return 'skeleton-pulse';
    }
  };

  return (
    <div
      className={`skeleton ${getAnimationClass()} ${className}`.trim()}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      role="status"
      aria-label="Caricamento..."
      aria-live="polite"
    />
  );
};

/**
 * Componente SkeletonCard per scheletro di card completa
 */
export const SkeletonCard: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => {
  return (
    <M3Surface
      className={`skeleton-card ${className}`.trim()}
      style={{
        padding: 'var(--md-sys-spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-3)',
        ...style,
      }}
      elevation="level1"
    >
      {/* Header con icona e testo */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--md-sys-spacing-3)',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="circular" width="40px" height="40px" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--md-sys-spacing-1)',
          }}
        >
          <Skeleton variant="text" width="60%" height="16px" />
          <Skeleton variant="text" width="40%" height="12px" />
        </div>
      </div>

      {/* Corpo della card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-2)',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="12px" />
        <Skeleton variant="rectangular" width="90%" height="12px" />
        <Skeleton variant="rectangular" width="70%" height="12px" />
      </div>
    </M3Surface>
  );
};

/**
 * Componente SkeletonList per scheletro di lista
 */
export const SkeletonList: React.FC<{ items?: number; className?: string; style?: React.CSSProperties }> = ({
  items = 3,
  className = '',
  style,
}) => {
  return (
    <div className={`skeleton-list ${className}`.trim()} style={style}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-3)',
            padding: 'var(--md-sys-spacing-3)',
          }}
        >
          <Skeleton variant="circular" width="40px" height="40px" />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-1)',
            }}
          >
            <Skeleton variant="text" width="70%" height="16px" />
            <Skeleton variant="text" width="50%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente SkeletonGrid per scheletro di griglia
 */
export const SkeletonGrid: React.FC<{
  cols?: number;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ cols = 2, rows = 2, className = '', style }) => {
  return (
    <div
      className={`skeleton-grid ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 'var(--md-sys-spacing-3)',
        ...style,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

const SkeletonComponent = Skeleton;
export { Skeleton as default };
