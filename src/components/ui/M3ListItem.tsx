// Thin MUI wrapper — preserves M3ListItem props API for backward compatibility
// @mui-migrated Fase 2
import React from 'react';
import { ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import { M3Typography } from './M3Typography';

interface M3ListItemProps {
    headline: React.ReactNode;
    headlineSize?: 'small' | 'medium' | 'large';
    supportingText?: React.ReactNode;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
}

const M3ListItem: React.FC<M3ListItemProps> = ({
    headline,
    headlineSize = 'medium',
    supportingText,
    leadingElement,
    trailingElement,
    onClick,
    children,
}) => {
    const content = (
      <>
        {leadingElement && (
          <Box sx={{ flexShrink: 0, mt: 0.5, display: 'flex', alignItems: 'center' }}>
            {leadingElement}
          </Box>
        )}
        <ListItemText
          disableTypography
          primary={
            <M3Typography
              variant={headlineSize === 'large' ? 'title-large' : 'body-large'}
              as="div"
              style={{ color: 'var(--md-sys-color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {headline}
            </M3Typography>
          }
          secondary={supportingText ? (
            <M3Typography variant="body-small" as="div" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {supportingText}
            </M3Typography>
          ) : undefined}
        />
        {children}
        {trailingElement && (
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            {trailingElement}
          </Box>
        )}
      </>
    );

    if (onClick) {
        return (
            <ListItemButton
                onClick={onClick}
                sx={{
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    minHeight: 'var(--md-sys-spacing-12)',
                    gap: 2,
                }}
            >
                {content}
            </ListItemButton>
        );
    }

    return (
        <ListItem
            sx={{
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                minHeight: 'var(--md-sys-spacing-12)',
                gap: 2,
            }}
        >
            {content}
        </ListItem>
    );
};

export default M3ListItem;

