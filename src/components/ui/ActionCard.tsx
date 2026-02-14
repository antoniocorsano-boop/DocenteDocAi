// MD3 Gold Compliant
// Card per azioni rapide con icona e descrizione
// Audit: febbraio 2026

import React from 'react';
import { M3Card, M3Typography } from './index';

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const variantConfig = {
    primary: {
      iconColor: 'var(--md-sys-color-primary)',
      hoverBg: 'var(--md-sys-color-primary-container)'
    },
    secondary: {
      iconColor: 'var(--md-sys-color-secondary)',
      hoverBg: 'var(--md-sys-color-secondary-container)'
    },
    tertiary: {
      iconColor: 'var(--md-sys-color-tertiary)',
      hoverBg: 'var(--md-sys-color-tertiary-container)'
    }
  };

  const config = variantConfig[variant];

  return (
    <M3Card
      onClick={disabled ? undefined : onClick}
      style={{
        padding: 'var(--md-sys-spacing-4)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.5 : 1,
        border: `1px solid var(--md-sys-color-outline-variant)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-3)',
        minHeight: 'var(--md-sys-spacing-14)'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = config.hoverBg;
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = 'var(--md-sys-color-surface)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      {/* Icona */}
      <div
        style={{
          width: 'var(--md-sys-spacing-8)',
          height: 'var(--md-sys-spacing-8)',
          borderRadius: 'var(--md-sys-spacing-3)',
          background: `${config.iconColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{
            fontSize: 'var(--md-sys-spacing-6)',
            color: config.iconColor,
            fontVariationSettings: '"FILL" 0, "wght" 500'
          }}
        >
          {icon}
        </span>
      </div>

      {/* Testo */}
      <div style={{ flex: 1 }}>
        <M3Typography
          variant="title-medium"
          style={{
            color: 'var(--md-sys-color-on-surface)',
            fontWeight: '600',
            marginBottom: 'var(--md-sys-spacing-1)'
          }}
        >
          {title}
        </M3Typography>
        <M3Typography
          variant="body-small"
          style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            lineHeight: '1.4'
          }}
        >
          {description}
        </M3Typography>
      </div>

      {/* Indicatore freccia */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{
            fontSize: '20px',
            color: config.iconColor,
            opacity: 0.6
          }}
        >
          arrow_forward
        </span>
      </div>
    </M3Card>
  );
};

export default ActionCard;
