// MD3 Gold Compliant
// Card per eventi calendario con contrasto migliorato
// Audit: febbraio 2026

import React from 'react';
import { M3Surface, M3Typography } from './index';

interface CalendarEventCardProps {
  title: string;
  time?: string;
  type?: 'urgente' | 'scadenza' | 'riunione' | 'impegno' | 'altro';
  onClick?: (e: React.MouseEvent) => void;
  compact?: boolean;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  title,
  time,
  type = 'altro',
  onClick,
  compact = false
}) => {
  const typeConfig = {
    urgente: {
      bg: 'var(--md-sys-color-error-container)',
      color: 'var(--md-sys-color-on-error-container)',
      icon: 'priority_high',
      borderColor: 'var(--md-sys-color-error)'
    },
    scadenza: {
      bg: 'var(--md-sys-color-tertiary-container)',
      color: 'var(--md-sys-color-on-tertiary-container)',
      icon: 'event',
      borderColor: 'var(--md-sys-color-tertiary)'
    },
    riunione: {
      bg: 'var(--md-sys-color-primary-container)',
      color: 'var(--md-sys-color-on-primary-container)',
      icon: 'groups',
      borderColor: 'var(--md-sys-color-primary)'
    },
    impegno: {
      bg: 'var(--md-sys-color-secondary-container)',
      color: 'var(--md-sys-color-on-secondary-container)',
      icon: 'task',
      borderColor: 'var(--md-sys-color-secondary)'
    },
    altro: {
      bg: 'var(--md-sys-color-surface-variant)',
      color: 'var(--md-sys-color-on-surface-variant)',
      icon: 'circle',
      borderColor: 'var(--md-sys-color-outline)'
    }
  };

  const config = typeConfig[type];

  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
          background: config.bg,
          color: config.color,
          borderRadius: 'var(--md-sys-spacing-1)',
          borderLeft: `3px solid ${config.borderColor}`,
          fontSize: 'var(--md-sys-typescale-label-small-size)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 200ms',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 'var(--md-sys-spacing-1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(2px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {title}
      </div>
    );
  }

  return (
    <M3Surface
      onClick={onClick}
      style={{
        padding: 'var(--md-sys-spacing-3)',
        background: config.bg,
        borderRadius: 'var(--md-sys-spacing-2)',
        borderLeft: `4px solid ${config.borderColor}`,
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--md-sys-spacing-2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icona tipo */}
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{
          fontSize: '20px',
          color: config.borderColor,
          fontVariationSettings: '"FILL" 1, "wght" 600'
        }}
      >
        {config.icon}
      </span>

      {/* Contenuto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {time && (
          <M3Typography
            variant="label-small"
            style={{
              color: config.color,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 'var(--md-sys-spacing-1)'
            }}
          >
            {time}
          </M3Typography>
        )}
        <M3Typography
          variant="body-medium"
          style={{
            color: config.color,
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </M3Typography>
      </div>

      {/* Freccia indicatore */}
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{
          fontSize: '18px',
          color: config.color,
          opacity: 0.7
        }}
      >
        arrow_forward_ios
      </span>
    </M3Surface>
  );
};

export default CalendarEventCard;
