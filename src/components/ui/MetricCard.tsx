// MD3 Gold Compliant
// Card per visualizzazione metriche con numeri grandi
// Audit: febbraio 2026

import React from 'react';
import { M3Card, M3Surface, M3Typography } from './index';

interface MetricCardProps {
  value: number | string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  icon,
  trend,
  trendValue,
  color = 'primary',
  onClick
}) => {
  const colorMap = {
    primary: 'var(--md-sys-color-primary)',
    secondary: 'var(--md-sys-color-secondary)',
    tertiary: 'var(--md-sys-color-tertiary)',
    success: '#4CAF50',
    warning: '#FF9800',
    error: 'var(--md-sys-color-error)'
  };

  const containerColorMap = {
    primary: 'var(--md-sys-color-primary-container)',
    secondary: 'var(--md-sys-color-secondary-container)',
    tertiary: 'var(--md-sys-color-tertiary-container)',
    success: '#4CAF5020',
    warning: '#FF980020',
    error: 'var(--md-sys-color-error-container)'
  };

  return (
    <M3Card
      onClick={onClick}
      style={{
        padding: 'var(--md-sys-spacing-4)',
        flex: '1',
        minWidth: 'var(--md-sys-spacing-14)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 200ms, box-shadow 200ms',
        border: `1px solid ${containerColorMap[color]}`
      }}
    >
      <M3Surface
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-2)',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Icona opzionale */}
        {icon && (
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
            style={{
              fontSize: 'var(--md-sys-spacing-6)',
              color: colorMap[color],
              marginBottom: 'var(--md-sys-spacing-1)'
            }}
          >
            {icon}
          </span>
        )}
        
        {/* Valore principale */}
        <M3Typography
          variant="display-small"
          style={{
            color: colorMap[color],
            fontWeight: '700',
            fontSize: '48px',
            lineHeight: '56px'
          }}
        >
          {value}
        </M3Typography>
        
        {/* Label */}
        <M3Typography
          variant="label-large"
          style={{
            color: 'var(--md-sys-color-on-surface)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600'
          }}
        >
          {label}
        </M3Typography>
        
        {/* Trend opzionale */}
        {trend && trendValue && (
          <M3Surface
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
              borderRadius: 'var(--md-sys-spacing-4)',
              background: trend === 'up' 
                ? '#4CAF5020' 
                : trend === 'down' 
                ? '#F4433620' 
                : 'var(--md-sys-color-surface-variant)',
              marginTop: 'var(--md-sys-spacing-1)'
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                fontSize: 'var(--md-sys-spacing-3)',
                color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)'
              }}
            >
              {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'remove'}
            </span>
            <M3Typography
              variant="label-small"
              style={{
                color: trend === 'up' ? 'var(--md-sys-color-tertiary)' : trend === 'down' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-on-surface-variant)',
                fontWeight: '600'
              }}
            >
              {trendValue}
            </M3Typography>
          </M3Surface>
        )}
      </M3Surface>
    </M3Card>
  );
};

export default MetricCard;
