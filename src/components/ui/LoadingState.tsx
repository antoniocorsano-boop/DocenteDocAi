// MD3 Gold Compliant
// Component per stati di caricamento con skeleton
// Audit: febbraio 2026

import React from 'react';
import { M3Surface } from './index';
import { Skeleton, SkeletonCard, SkeletonList, SkeletonGrid } from './Skeleton';

export type LoadingVariant = 'spinner' | 'skeleton' | 'skeleton-card' | 'skeleton-list' | 'skeleton-grid';

interface LoadingStateProps {
  variant?: LoadingVariant;
  message?: string;
  subMessage?: string;
  skeletonItems?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente LoadingState per visualizzare stati di caricamento
 * @param variant - Tipo di visualizzazione (spinner, skeleton, skeleton-card, skeleton-list, skeleton-grid)
 * @param message - Messaggio principale
 * @param subMessage - Messaggio secondario
 * @param skeletonItems - Numero di skeleton items (per skeleton-list o skeleton-grid)
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  message = 'Caricamento...',
  subMessage,
  skeletonItems,
  className = '',
  style,
}) => {
  const renderSpinner = () => (
    <div className="loading-spinner">
      <svg
        className="spinner"
        viewBox="0 0 50 50"
        style={{
          width: 'var(--md-sys-spacing-8)',
          height: 'var(--md-sys-spacing-8)',
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle
          className="spinner-path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="var(--md-sys-color-primary)"
          strokeWidth="4"
          style={{
            strokeDasharray: '90, 150',
            strokeDashoffset: 0,
            strokeLinecap: 'round',
          }}
        />
      </svg>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div style={{ width: '100%', maxWidth: 'var(--md-sys-spacing-24)' }}>
            <div style={{ marginBottom: 'var(--md-sys-spacing-3)' }}>
              <Skeleton variant="text" width="60%" height="24px" />
            </div>
            <div style={{ marginBottom: 'var(--md-sys-spacing-3)' }}>
              <Skeleton variant="rectangular" width="100%" height="12px" />
            </div>
            <Skeleton variant="rectangular" width="80%" height="12px" />
          </div>
        );

      case 'skeleton-card':
        return <SkeletonCard />;

      case 'skeleton-list':
        return <SkeletonList items={skeletonItems || 3} />;

      case 'skeleton-grid':
        return <SkeletonGrid cols={2} rows={2} />;

      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <M3Surface
      className={`loading-state ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--md-sys-spacing-8)',
        gap: 'var(--md-sys-spacing-4)',
        minHeight: 'var(--md-sys-spacing-14)',
        textAlign: 'center',
        borderRadius: 'var(--md-sys-spacing-3)',
        background: 'var(--md-sys-color-surface)',
        ...style,
      }}
      elevation="level0"
    >
      {/* Contenuto (spinner o skeleton) */}
      {renderContent()}

      {/* Messaggi */}
      {variant === 'spinner' && (
        <>
          {message && (
            <div
              style={{
                color: 'var(--md-sys-color-on-surface)',
                fontSize: 'var(--md-sys-typescale-headline-small-size)',
                fontWeight: '600',
              }}
            >
              {message}
            </div>
          )}
          {subMessage && (
            <div
              style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                fontSize: 'var(--md-sys-typescale-body-large-size)',
                maxWidth: 'var(--md-sys-spacing-16)',
                lineHeight: '1.5',
              }}
            >
              {subMessage}
            </div>
          )}
        </>
      )}
    </M3Surface>
  );
};

/**
 * Componente LoadingOverlay per sovrapposizione di caricamento
 */
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ isLoading, message = 'Caricamento...', children, className = '', style }) => {
  return (
    <div className={`loading-overlay ${className}`.trim()} style={{ position: 'relative', ...style }}>
      {children}

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--md-sys-spacing-3)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            zIndex: 100,
          }}
        >
          <LoadingState variant="spinner" message={message} />
        </div>
      )}
    </div>
  );
};

/**
 * Componente LoadingButton per bottoni con stato di caricamento
 */
export const LoadingButton: React.FC<{
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ isLoading, loadingText = 'Caricamento...', children, disabled, onClick, className = '', style }) => {
  return (
    <button
      className={`loading-button ${isLoading ? 'loading' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--md-sys-spacing-2)',
        padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
        background: 'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
        border: 'none',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        fontSize: 'var(--md-sys-typescale-label-large-size)',
        fontWeight: '500',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
    >
      {isLoading && (
        <svg
          className="spinner-small"
          viewBox="0 0 50 50"
          style={{
            width: '16px',
            height: '16px',
            animation: 'spin 1s linear infinite',
          }}
        >
          <circle
            className="spinner-path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            style={{
              strokeDasharray: '90, 150',
              strokeDashoffset: 0,
              strokeLinecap: 'round',
            }}
          />
        </svg>
      )}
      {isLoading ? loadingText : children}
    </button>
  );
};

const LoadingStateComponent = LoadingState;
export { LoadingState as default };
