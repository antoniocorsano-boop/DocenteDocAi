// MD3 Compliant
// Wrapper standardizzato per le pagine principali dell'app

import React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface PageWrapperProps {
    children: React.ReactNode;
    gap?: string | number;
    maxWidth?: string | number;
    sx?: SxProps<Theme>;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    gap = 'var(--md-sys-spacing-6)',
    maxWidth,
    sx,
}) => (
    <Box
        sx={{
            width: '100%',
            maxWidth: maxWidth ?? '100%',
            mx: 'auto',
            px: 'var(--md-sys-spacing-6)',
            pb: 'var(--md-sys-spacing-8)',
            display: 'flex',
            flexDirection: 'column',
            gap,
            ...((sx as object) ?? {}),
        }}
    >
        {children}
    </Box>
);

export default PageWrapper;
